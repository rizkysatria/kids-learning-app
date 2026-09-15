import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.activityId !== "string" || typeof body.correct !== "boolean" || typeof body.answer !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const activity = await prisma.activity.findUnique({ where: { id: body.activityId } });
    if (!activity) return NextResponse.json({ error: "Activity not found" }, { status: 404 });

    const attempt = await prisma.attempt.create({
      data: { activityId: body.activityId, correct: body.correct, answer: body.answer }
    });

    return NextResponse.json({ id: attempt.id });
  } catch {
    return NextResponse.json({ error: "Unable to save attempt" }, { status: 500 });
  }
}
