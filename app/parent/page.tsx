import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ParentPage() {
  const attempts = await prisma.attempt.findMany({
    include: { activity: true },
    orderBy: { createdAt: "desc" },
    take: 30
  });

  const total = await prisma.attempt.count();
  const correct = await prisma.attempt.count({ where: { correct: true } });
  const rate = total ? Math.round((correct / total) * 100) : 0;

  return (
    <main className="shell">
      <div className="topbar"><Link href="/">←</Link><span>👨‍👩‍👧 Orang Tua</span><span /></div>
      <section className="parent-card">
        <h1>Progress Belajar</h1>
        <div className="stats">
          <div><strong>{total}</strong><small>Jawaban</small></div>
          <div><strong>{correct}</strong><small>Benar</small></div>
          <div><strong>{rate}%</strong><small>Akurasi</small></div>
        </div>
        <h2>Riwayat Terbaru</h2>
        {attempts.length === 0 ? <p>Belum ada aktivitas.</p> : (
          <div className="history">
            {attempts.map(a => (
              <div className="history-row" key={a.id}>
                <span>{a.correct ? "✅" : "❌"}</span>
                <span>{a.activity.title}</span>
                <small>Level {a.activity.difficulty}</small>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
