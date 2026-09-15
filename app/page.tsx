import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [reading, math, logic, attempts] = await Promise.all([
    prisma.activity.count({ where: { subject: "reading" } }),
    prisma.activity.count({ where: { subject: "math" } }),
    prisma.activity.count({ where: { subject: "logic" } }),
    prisma.attempt.count()
  ]);

  return (
    <main className="shell">
      <section className="hero">
        <div className="mascot">🌈</div>
        <h1>Belajar Yuk!</h1>
        <p>Belajar sambil bermain. Pilih permainanmu.</p>
      </section>

      <section className="menu-grid">
        <Link className="menu-card reading" href="/learn/reading">
          <span className="icon">📖</span>
          <strong>Membaca</strong>
          <small>{reading} permainan</small>
        </Link>
        <Link className="menu-card math" href="/learn/math">
          <span className="icon">🔢</span>
          <strong>Matematika</strong>
          <small>{math} permainan</small>
        </Link>
        <Link className="menu-card logic" href="/learn/logic">
          <span className="icon">🧩</span>
          <strong>Logika</strong>
          <small>{logic} permainan</small>
        </Link>
        <Link className="menu-card parent" href="/parent">
          <span className="icon">👨‍👩‍👧</span>
          <strong>Orang Tua</strong>
          <small>{attempts} jawaban tersimpan</small>
        </Link>
      </section>
    </main>
  );
}
