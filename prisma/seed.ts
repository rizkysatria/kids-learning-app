import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ActivitySeed = {
  id: string;
  subject: string;
  title: string;
  instruction: string;
  type: string;
  difficulty: number;
  data: object;
};

const activities: ActivitySeed[] = [
  {
    id: "read-letter-a", subject: "reading", title: "Kenal Huruf A", instruction: "Ini huruf apa?", type: "choice", difficulty: 1,
    data: { visual: "A", options: ["A", "B", "C"], answer: "A", speak: "Ini huruf A. Huruf A seperti pada kata apel." }
  },
  {
    id: "read-letter-b", subject: "reading", title: "Kenal Huruf B", instruction: "Ini huruf apa?", type: "choice", difficulty: 1,
    data: { visual: "B", options: ["A", "B", "D"], answer: "B", speak: "Ini huruf B." }
  },
  {
    id: "read-syllable-ba", subject: "reading", title: "Bunyi Suku Kata", instruction: "Pilih BA", type: "choice", difficulty: 2,
    data: { visual: "BA", options: ["BA", "BI", "BU"], answer: "BA", speak: "BA. B... A... BA." }
  },
  {
    id: "read-word-bola", subject: "reading", title: "Kata Sederhana", instruction: "Pilih kata BOLA", type: "choice", difficulty: 3,
    data: { visual: "⚽", options: ["BOLA", "BUKU", "BEBEK"], answer: "BOLA", speak: "Bola." }
  },
  {
    id: "logic-different", subject: "logic", title: "Yang Berbeda", instruction: "Mana yang berbeda?", type: "choice", difficulty: 2,
    data: { visual: "🐶 🐶 🐱 🐶", options: ["🐶", "🐱", "🐰"], answer: "🐱", speak: "Kucing berbeda dari yang lain." }
  },
  {
    id: "logic-sequence", subject: "logic", title: "Urutan", instruction: "Apa yang melanjutkan pola?", type: "choice", difficulty: 3,
    data: { visual: "🟦 🟦 🟨 🟦 🟦 ❓", options: ["🟦", "🟨", "🟥"], answer: "🟨", speak: "Setelah dua kotak biru, muncul kotak kuning." }
  }
];

const fruits = ["🍎", "🍊", "🍓", "🍐", "🍋", "🍉"];
const objects = ["⭐", "🐟", "🦋", "🌸", "🍪", "🚗"];

function choices(answer: number, max = 10): string[] {
  const candidates = new Set<number>([answer]);
  const offsets = [-2, -1, 1, 2, 3, -3];
  for (const offset of offsets) {
    const value = answer + offset;
    if (value >= 0 && value <= max && candidates.size < 3) candidates.add(value);
  }
  let next = 0;
  while (candidates.size < 3) {
    if (!candidates.has(next) && next <= max) candidates.add(next);
    next++;
  }
  return [...candidates].slice(0, 3).map(String);
}

function visualObjects(object: string, count: number): string {
  return Array.from({ length: count }, () => object).join(" ");
}

function addQuestion(n: number, difficulty: number, a: number, b: number, object: string, title = "Tambah Benda") {
  const answer = a + b;
  activities.push({
    id: `math-add-${String(n).padStart(3, "0")}`,
    subject: "math",
    title,
    instruction: "Hitung semua benda. Berapa jumlahnya?",
    type: "visual_addition",
    difficulty,
    data: {
      left: { object, count: a }, right: { object, count: b },
      options: choices(answer, 15), answer: String(answer),
      speak: `${a} ditambah ${b}. Berapa jumlahnya?`
    }
  });
}

function subtractQuestion(n: number, difficulty: number, total: number, take: number, object: string) {
  const answer = total - take;
  activities.push({
    id: `math-sub-${String(n).padStart(3, "0")}`,
    subject: "math",
    title: "Kurangi Benda",
    instruction: "Ada beberapa benda. Jika sebagian diambil, berapa sisanya?",
    type: "visual_subtraction",
    difficulty,
    data: {
      left: { object, count: total }, removed: take,
      options: choices(answer, 12), answer: String(answer),
      speak: `${total} dikurangi ${take}. Berapa sisanya?`
    }
  });
}

function countQuestion(n: number, difficulty: number, count: number, object: string) {
  activities.push({
    id: `math-count-${String(n).padStart(3, "0")}`,
    subject: "math",
    title: "Hitung Benda",
    instruction: "Ada berapa benda?",
    type: "visual_count",
    difficulty,
    data: {
      visual: visualObjects(object, count), options: choices(count, 12), answer: String(count),
      speak: `Ada berapa benda? Hitung pelan-pelan.`
    }
  });
}

function comparisonQuestion(n: number, difficulty: number, a: number, b: number, left: string, right: string) {
  const answer = a > b ? "left" : a < b ? "right" : "equal";
  const answerLabel = answer === "left" ? "Kiri" : answer === "right" ? "Kanan" : "Sama";
  activities.push({
    id: `math-compare-${String(n).padStart(3, "0")}`,
    subject: "math",
    title: "Mana Lebih Banyak?",
    instruction: "Pilih kelompok yang lebih banyak.",
    type: "visual_compare",
    difficulty,
    data: {
      left: { object: left, count: a }, right: { object: right, count: b },
      options: ["Kiri", "Kanan", "Sama"], answer: answerLabel,
      speak: "Lihat kedua kelompok. Mana yang lebih banyak?"
    }
  });
}

function patternQuestion(n: number, difficulty: number, sequence: string[], answer: string, speak: string) {
  activities.push({
    id: `math-pattern-${String(n).padStart(3, "0")}`,
    subject: "math",
    title: "Lanjutkan Pola",
    instruction: "Apa yang datang berikutnya?",
    type: "pattern",
    difficulty,
    data: { visual: `${sequence.join(" ")} ❓`, options: [answer, sequence[0], sequence[1]].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3), answer, speak }
  });
}

function missingNumberQuestion(n: number, difficulty: number, expression: string, answer: number, speak: string) {
  activities.push({
    id: `math-missing-${String(n).padStart(3, "0")}`,
    subject: "math",
    title: "Angka yang Hilang",
    instruction: "Pilih angka yang hilang.",
    type: "choice",
    difficulty,
    data: { visual: expression, options: choices(answer, 12), answer: String(answer), speak }
  });
}

function sequenceQuestion(n: number, difficulty: number, sequence: number[], answer: number, speak: string) {
  activities.push({
    id: `math-sequence-${String(n).padStart(3, "0")}`,
    subject: "math",
    title: "Urutan Angka",
    instruction: "Angka mana yang berikutnya?",
    type: "choice",
    difficulty,
    data: { visual: `${sequence.join(" , ")} , ?`, options: choices(answer, 20), answer: String(answer), speak }
  });
}

// Level 1–2: number sense and counting.
countQuestion(1, 1, 2, fruits[0]);
countQuestion(2, 1, 3, fruits[1]);
countQuestion(3, 1, 4, objects[0]);
countQuestion(4, 1, 5, objects[1]);
countQuestion(5, 2, 6, fruits[2]);
countQuestion(6, 2, 7, objects[2]);
countQuestion(7, 2, 8, fruits[3]);
countQuestion(8, 2, 9, objects[3]);
comparisonQuestion(1, 2, 4, 2, "🍎", "🍊");
comparisonQuestion(2, 2, 3, 6, "⭐", "🌸");
comparisonQuestion(3, 2, 5, 5, "🐟", "🦋");
comparisonQuestion(4, 2, 7, 4, "🍓", "🍐");

// Level 3–4: visual arithmetic.
addQuestion(1, 3, 1, 2, "🍎");
addQuestion(2, 3, 2, 2, "🍊");
addQuestion(3, 3, 3, 2, "🍓");
addQuestion(4, 3, 4, 1, "⭐");
addQuestion(5, 3, 3, 3, "🐟");
addQuestion(6, 4, 4, 3, "🌸");
addQuestion(7, 4, 5, 2, "🍪");
addQuestion(8, 4, 5, 3, "🍐");
addQuestion(9, 4, 6, 2, "🍎");
addQuestion(10, 4, 4, 4, "⭐");
subtractQuestion(1, 3, 4, 1, "🍎");
subtractQuestion(2, 3, 5, 2, "🍊");
subtractQuestion(3, 4, 6, 2, "🍓");
subtractQuestion(4, 4, 7, 3, "⭐");
subtractQuestion(5, 4, 8, 4, "🐟");
subtractQuestion(6, 4, 9, 3, "🌸");

// Level 5–6: number relations and patterns.
missingNumberQuestion(1, 5, "2 + ? = 5", 3, "Dua ditambah berapa menjadi lima?");
missingNumberQuestion(2, 5, "4 + ? = 7", 3, "Empat ditambah berapa menjadi tujuh?");
missingNumberQuestion(3, 5, "? + 2 = 6", 4, "Berapa ditambah dua menjadi enam?");
missingNumberQuestion(4, 5, "5 - ? = 3", 2, "Lima dikurangi berapa menjadi tiga?");
missingNumberQuestion(5, 6, "3 + ? = 8", 5, "Tiga ditambah berapa menjadi delapan?");
missingNumberQuestion(6, 6, "? - 2 = 5", 7, "Berapa dikurangi dua menjadi lima?");
patternQuestion(1, 6, ["🔴", "🔵", "🔴", "🔵"], "🔴", "Merah, biru, merah, biru. Apa berikutnya?");
patternQuestion(2, 6, ["⭐", "⭐", "🌸", "⭐", "⭐", "🌸"], "⭐", "Dua bintang lalu satu bunga. Apa berikutnya?");
patternQuestion(3, 6, ["🟢", "🟡", "🟡", "🟢", "🟡", "🟡"], "🟢", "Hijau, dua kuning. Ulangi polanya.");
patternQuestion(4, 6, ["🍎", "🍊", "🍎", "🍊"], "🍎", "Apel dan jeruk bergantian. Apa berikutnya?");

// Level 7–8: sequences, geometry and stronger comparisons.
sequenceQuestion(1, 7, [1, 2, 3], 4, "Angka naik satu-satu.");
sequenceQuestion(2, 7, [2, 4, 6], 8, "Angka bertambah dua.");
sequenceQuestion(3, 7, [5, 6, 7], 8, "Angka naik satu-satu.");
sequenceQuestion(4, 7, [10, 9, 8], 7, "Angka turun satu-satu.");
sequenceQuestion(5, 8, [1, 3, 5], 7, "Angka bertambah dua.");
sequenceQuestion(6, 8, [2, 5, 8], 11, "Angka bertambah tiga.");
comparisonQuestion(5, 7, 8, 6, "🔵", "🟡");
comparisonQuestion(6, 8, 9, 9, "🔺", "🟢");

activities.push({
  id: "math-shape-count-001", subject: "math", title: "Hitung Bentuk", instruction: "Ada berapa segitiga?", type: "choice", difficulty: 7,
  data: { visual: "🔺 🔺 🔵 🔺 ⭐", options: ["2", "3", "4"], answer: "3", speak: "Hitung semua segitiga." }
});
activities.push({
  id: "math-shape-count-002", subject: "math", title: "Hitung Bentuk", instruction: "Ada berapa lingkaran?", type: "choice", difficulty: 8,
  data: { visual: "🔵 🔺 🔵 ⭐ 🔵", options: ["2", "3", "4"], answer: "3", speak: "Hitung semua lingkaran." }
});

// Level 9–10: original olympiad-style visual reasoning.
activities.push({
  id: "math-balance-001", subject: "math", title: "Buat Sama", instruction: "Berapa benda yang perlu ditambah di kanan?", type: "visual_compare", difficulty: 9,
  data: { left: { object: "🍎", count: 5 }, right: { object: "🍎", count: 3 }, options: ["1", "2", "3"], answer: "2", speak: "Kiri punya lima. Kanan punya tiga. Berapa perlu ditambah agar sama?" }
});
activities.push({
  id: "math-balance-002", subject: "math", title: "Buat Sama", instruction: "Berapa benda yang perlu diambil dari kiri?", type: "visual_compare", difficulty: 9,
  data: { left: { object: "⭐", count: 7 }, right: { object: "⭐", count: 5 }, options: ["1", "2", "3"], answer: "2", speak: "Kiri punya tujuh. Kanan punya lima. Berapa perlu diambil dari kiri agar sama?" }
});
activities.push({
  id: "math-two-step-001", subject: "math", title: "Pikirkan Pelan-Pelan", instruction: "Hitung lalu pilih jawabannya.", type: "choice", difficulty: 10,
  data: { visual: "🍎🍎🍎 + 🍎🍎  →  ? - 🍎", options: ["3", "4", "5"], answer: "4", speak: "Tiga ditambah dua, lalu kurangi satu. Berapa hasilnya?" }
});
activities.push({
  id: "math-two-step-002", subject: "math", title: "Pikirkan Pelan-Pelan", instruction: "Hitung kelompok pertama, lalu bandingkan.", type: "choice", difficulty: 10,
  data: { visual: "⭐⭐⭐ + ⭐⭐   vs   🌸🌸🌸🌸", options: ["Kiri", "Kanan", "Sama"], answer: "Kanan", speak: "Tiga ditambah dua sama dengan lima. Mana yang lebih banyak: lima atau empat?" }
});
activities.push({
  id: "math-composition-001", subject: "math", title: "Bentuk Angka", instruction: "Pilih pasangan yang jumlahnya tujuh.", type: "choice", difficulty: 9,
  data: { visual: "? + ? = 7", options: ["3 + 4", "2 + 2", "5 + 1"], answer: "3 + 4", speak: "Pilih pasangan angka yang jumlahnya tujuh." }
});
activities.push({
  id: "math-composition-002", subject: "math", title: "Bentuk Angka", instruction: "Pilih pasangan yang jumlahnya delapan.", type: "choice", difficulty: 10,
  data: { visual: "? + ? = 8", options: ["3 + 5", "4 + 3", "2 + 5"], answer: "3 + 5", speak: "Pilih pasangan angka yang jumlahnya delapan." }
});

async function main() {
  await prisma.attempt.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.activity.createMany({
    data: activities.map((activity) => ({ ...activity, data: JSON.stringify(activity.data) }))
  });
  const mathCount = activities.filter((activity) => activity.subject === "math").length;
  console.log(`Seeded ${activities.length} activities (${mathCount} math questions).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(() => prisma.$disconnect());
