import { prisma } from "@/lib/prisma";
import LearningClient from "@/components/LearningClient";

const allowed = new Set(["reading", "math", "logic"]);

export default async function LearnPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  if (!allowed.has(subject)) return <div className="shell"><h1>Modul tidak ditemukan.</h1></div>;

  const activities = await prisma.activity.findMany({
    where: { subject },
    orderBy: [{ difficulty: "asc" }, { id: "asc" }]
  });

  return <LearningClient subject={subject} activities={activities.map(a => ({
    id: a.id,
    title: a.title,
    instruction: a.instruction,
    type: a.type,
    difficulty: a.difficulty,
    data: JSON.parse(a.data) as { visual?: string; options: string[]; answer: string; speak: string; left?: { object: string; count: number }; right?: { object: string; count: number }; removed?: number }
  }))} />;
}
