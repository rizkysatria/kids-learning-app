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

type LearningObject = {
  id: string;
  name: string;
  visual: string;
};

const learningObjects: LearningObject[] = [
  { id: "apple", name: "apel", visual: "🍎" },
  { id: "orange", name: "jeruk", visual: "🍊" },
  { id: "strawberry", name: "stroberi", visual: "🍓" },
  { id: "pear", name: "pir", visual: "🍐" },
  { id: "lemon", name: "lemon", visual: "🍋" },
  { id: "watermelon", name: "semangka", visual: "🍉" },
  { id: "star", name: "bintang", visual: "⭐" },
  { id: "fish", name: "ikan", visual: "🐟" },
  { id: "butterfly", name: "kupu-kupu", visual: "🦋" },
  { id: "flower", name: "bunga", visual: "🌸" },
  { id: "cookie", name: "kue", visual: "🍪" },
  { id: "car", name: "mobil", visual: "🚗" },
];

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
    id: "read-syllable-ba", subject: "reading", title: "Bunyi Suku Kata", instruction: "Pilih BA", type: "choice", difficulty: 1,
    data: { visual: "BA", options: ["BA", "BI", "BU"], answer: "BA", speak: "BA. B... A... BA." }
  },
  {
    id: "read-word-bola", subject: "reading", title: "Kata Sederhana", instruction: "Pilih kata BOLA", type: "choice", difficulty: 1,
    data: { visual: "⚽", options: ["BOLA", "BUKU", "BEBEK"], answer: "BOLA", speak: "Bola." }
  },
  {
    id: "logic-different", subject: "logic", title: "Yang Berbeda", instruction: "Mana yang berbeda?", type: "choice", difficulty: 1,
    data: { visual: "🐶 🐶 🐱 🐶", options: ["🐶", "🐱", "🐰"], answer: "🐱", speak: "Kucing berbeda dari yang lain." }
  },
  {
    id: "logic-sequence", subject: "logic", title: "Urutan", instruction: "Apa yang melanjutkan pola?", type: "choice", difficulty: 1,
    data: { visual: "🟦 🟦 🟨 🟦 🟦 ❓", options: ["🟦", "🟨", "🟥"], answer: "🟨", speak: "Setelah dua kotak biru, muncul kotak kuning." }
  }
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function choices(answer: number, max = 10): string[] {
  const candidates = new Set<number>([answer]);
  while (candidates.size < 3) candidates.add(randomInt(0, max));
  return shuffle([...candidates]).map(String);
}

function visualObjects(object: string, count: number): string {
  return Array.from({ length: count }, () => object).join(" ");
}

let countId = 1, addId = 1, subtractId = 1, compareId = 1;
let missingId = 1, patternId = 1, sequenceId = 1;

function countQuestion() {
  const object = randomItem(learningObjects);
  const count = randomInt(2, 10);
  const question = `Ada berapa ${object.name}?`;
  activities.push({
    id: `math-count-${String(countId++).padStart(3, "0")}`,
    subject: "math", title: `Hitung ${object.name}`, instruction: question,
    type: "visual_count", difficulty: 1,
    data: { visual: visualObjects(object.visual, count), options: choices(count, 12), answer: String(count), speak: `${question} Hitung pelan-pelan.`, objectId: object.id }
  });
}

function addQuestion() {
  let a = randomInt(1, 5), b = randomInt(1, 5);
  while (a + b > 10) { a = randomInt(1, 5); b = randomInt(1, 5); }
  const object = randomItem(learningObjects), answer = a + b;
  activities.push({
    id: `math-add-${String(addId++).padStart(3, "0")}`,
    subject: "math", title: "Tambah Benda", instruction: "Hitung semua benda. Berapa jumlahnya?",
    type: "visual_addition", difficulty: 1,
    data: { left: { object: object.visual, count: a }, right: { object: object.visual, count: b }, options: choices(answer, 12), answer: String(answer), speak: `${a} ditambah ${b}. Berapa jumlahnya?` }
  });
}

function subtractQuestion() {
  const total = randomInt(2, 10), take = randomInt(1, total - 1);
  const object = randomItem(learningObjects), answer = total - take;
  activities.push({
    id: `math-sub-${String(subtractId++).padStart(3, "0")}`,
    subject: "math", title: `Kurangi ${object.name}`,
    instruction: `Ada ${total} ${object.name}. Jika ${take} diambil, berapa sisanya?`,
    type: "visual_subtraction", difficulty: 1,
    data: { left: { object: object.visual, count: total }, removed: take, options: choices(answer, 10), answer: String(answer), speak: `${total} dikurangi ${take}. Berapa sisanya?` }
  });
}

function comparisonQuestion() {
  const leftObject = randomItem(learningObjects);
  let rightObject = randomItem(learningObjects);
  while (rightObject.id === leftObject.id) rightObject = randomItem(learningObjects);
  const a = randomInt(1, 10), b = randomInt(1, 10);
  const answer = a > b ? "Kiri" : a < b ? "Kanan" : "Sama";
  activities.push({
    id: `math-compare-${String(compareId++).padStart(3, "0")}`,
    subject: "math", title: "Mana Lebih Banyak?", instruction: "Pilih kelompok yang lebih banyak.",
    type: "visual_compare", difficulty: 1,
    data: { left: { object: leftObject.visual, count: a }, right: { object: rightObject.visual, count: b }, options: ["Kiri", "Kanan", "Sama"], answer, speak: `Lihat kedua kelompok. ${a} di kiri dan ${b} di kanan. Mana yang lebih banyak?` }
  });
}

function missingNumberQuestion() {
  const mode = randomInt(0, 2);
  let expression: string, answer: number, speak: string;
  if (mode === 0) {
    const a = randomInt(1, 5), b = randomInt(1, 5);
    expression = `${a} + ? = ${a + b}`; answer = b; speak = `${a} ditambah berapa menjadi ${a + b}?`;
  } else if (mode === 1) {
    const b = randomInt(1, 5), value = randomInt(1, 5);
    expression = `? + ${b} = ${value + b}`; answer = value; speak = `Berapa ditambah ${b} menjadi ${value + b}?`;
  } else {
    const answerValue = randomInt(1, 5), take = randomInt(1, 4), total = answerValue + take;
    expression = `${total} - ? = ${answerValue}`; answer = take; speak = `${total} dikurangi berapa menjadi ${answerValue}?`;
  }
  activities.push({
    id: `math-missing-${String(missingId++).padStart(3, "0")}`,
    subject: "math", title: "Angka yang Hilang", instruction: "Pilih angka yang hilang.",
    type: "choice", difficulty: 1,
    data: { visual: expression, options: choices(answer, 10), answer: String(answer), speak }
  });
}

function patternQuestion() {
  const patterns = [
    { sequence: ["🔴", "🔵", "🔴", "🔵"], answer: "🔴", speak: "Merah, biru, merah, biru. Apa berikutnya?", distractors: ["🔵", "🟡"] },
    { sequence: ["⭐", "⭐", "🌸", "⭐", "⭐", "🌸"], answer: "⭐", speak: "Dua bintang lalu satu bunga. Apa berikutnya?", distractors: ["🌸", "🔵"] },
    { sequence: ["🟢", "🟡", "🟡", "🟢", "🟡", "🟡"], answer: "🟢", speak: "Hijau, dua kuning. Ulangi polanya.", distractors: ["🟡", "🔴"] },
    { sequence: ["🍎", "🍊", "🍎", "🍊"], answer: "🍎", speak: "Apel dan jeruk bergantian. Apa berikutnya?", distractors: ["🍊", "🍓"] }
  ];
  const pattern = randomItem(patterns);
  activities.push({
    id: `math-pattern-${String(patternId++).padStart(3, "0")}`,
    subject: "math", title: "Lanjutkan Pola", instruction: "Apa yang datang berikutnya?",
    type: "pattern", difficulty: 1,
    data: { visual: `${pattern.sequence.join(" ")} ❓`, options: shuffle([pattern.answer, ...pattern.distractors]), answer: pattern.answer, speak: pattern.speak }
  });
}

function sequenceQuestion() {
  const mode = randomInt(0, 2);
  let sequence: number[], answer: number, speak: string;
  if (mode === 0) {
    const start = randomInt(1, 5); sequence = [start, start + 1, start + 2]; answer = start + 3; speak = `Angka naik satu-satu. Setelah ${sequence[2]}, angka berapa?`;
  } else if (mode === 1) {
    const start = randomInt(1, 4); sequence = [start, start + 2, start + 4]; answer = start + 6; speak = `Angka bertambah dua. Setelah ${sequence[2]}, angka berapa?`;
  } else {
    const start = randomInt(5, 10); sequence = [start, start - 1, start - 2]; answer = start - 3; speak = `Angka turun satu-satu. Setelah ${sequence[2]}, angka berapa?`;
  }
  activities.push({
    id: `math-sequence-${String(sequenceId++).padStart(3, "0")}`,
    subject: "math", title: "Urutan Angka", instruction: "Angka mana yang berikutnya?",
    type: "choice", difficulty: 1,
    data: { visual: `${sequence.join(" , ")} , ?`, options: choices(answer, 12), answer: String(answer), speak }
  });
}

const mathGenerators = [countQuestion, addQuestion, subtractQuestion, comparisonQuestion, missingNumberQuestion, patternQuestion, sequenceQuestion];

// No level is used here. Every seed creates a fresh random mix of questions.
for (let i = 0; i < 30; i++) randomItem(mathGenerators)();

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