 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Activity = {
  id: string;
  title: string;
  instruction: string;
  type: string;
  difficulty: number;
  data: {
    visual?: string;
    options: string[];
    answer: string;
    speak: string;
    left?: { object: string; count: number };
    right?: { object: string; count: number };
    removed?: number;
  };
};

const labels: Record<string, string> = {
  reading: "📖 Membaca",
  math: "🔢 Matematika",
  logic: "🧩 Logika"
};

export default function LearningClient({ subject, activities }: { subject: string; activities: Activity[] }) {
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [busy, setBusy] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [started, setStarted] = useState(false);

  const activity = activities[index];

  useEffect(() => {
    setResult(null);
  }, [index, activity]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const markReady = () => setAudioReady(true);
    markReady();
    synth.addEventListener("voiceschanged", markReady);
    return () => synth.removeEventListener("voiceschanged", markReady);
  }, []);

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const indonesianVoice = voices.find(v => v.lang.toLowerCase().startsWith("id"));
    if (indonesianVoice) utterance.voice = indonesianVoice;
    utterance.lang = indonesianVoice?.lang || "id-ID";
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    synth.speak(utterance);
  }

  async function answer(value: string) {
    if (busy || result || !activity) return;
    setBusy(true);
    const correct = value === activity.data.answer;
    setResult(correct ? "correct" : "wrong");
    if (correct) {
      setScore(s => s + 1);
      speak("Hebat! Jawabanmu benar.");
    } else {
      speak(`Coba lagi. Jawaban yang benar adalah ${activity.data.answer}.`);
    }

    await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId: activity.id, correct, answer: value })
    }).catch(() => {});

    setBusy(false);
  }

  function startLearning() {
    if (!activity) return;
    setStarted(true);

    // speak() is called directly from the user's click to satisfy
    // browser autoplay policies.
    speak(activity.data.speak);
  }

  function next() {
    const nextIndex = index < activities.length - 1 ? index + 1 : 0;
    const nextActivity = activities[nextIndex];
    setIndex(nextIndex);

    // The Lanjut button is also a user gesture, so the next question
    // can be spoken immediately without using setTimeout/useEffect.
    if (nextActivity) {
      speak(nextActivity.data.speak);
    }
  }

  if (!activity) return <main className="shell"><h1>Belum ada aktivitas.</h1></main>;

  return (
    <main className="shell">
      <div className="topbar">
        <Link href="/">←</Link>
        <span>{labels[subject]}</span>
        <span>⭐ {score}</span>
      </div>

      {!started ? (
        <section className="lesson welcome-screen">
          <div className="welcome-emoji">🎮</div>
          <h1>Yuk, kita belajar!</h1>
          <p className="welcome-text">
            Aku akan membantu membacakan soal untukmu.
          </p>
          <button
            className="start-learning"
            onClick={startLearning}
          >
            🚀 Mulai
          </button>
          {!audioReady && (
            <p className="audio-note">Audio tidak tersedia di browser ini.</p>
          )}
        </section>
      ) : (
      <section className="lesson">
        <div className="progress"><div style={{ width: `${((index + 1) / activities.length) * 100}%` }} /></div>
        <p className="eyebrow">{index + 1} / {activities.length} · Level {activity.difficulty}</p>
        <h1>{activity.title}</h1>
        <button className="speak" onClick={() => speak(activity.data.speak)} disabled={!audioReady}>🔊 Dengarkan</button>
        <p className="instruction">{activity.instruction}</p>
        {!audioReady && <p className="audio-note">Audio tidak tersedia di browser ini.</p>}
        {activity.type === "visual_addition" && activity.data.left && activity.data.right ? (
          <div className="math-equation visual-groups">
            <div className="object-group">{Array.from({ length: activity.data.left.count }, (_, i) => <span key={i}>{activity.data.left!.object}</span>)}</div>
            <div className="operator">+</div>
            <div className="object-group">{Array.from({ length: activity.data.right.count }, (_, i) => <span key={i}>{activity.data.right!.object}</span>)}</div>
            <div className="operator">=</div>
            <div className="question-mark">?</div>
          </div>
        ) : activity.type === "visual_subtraction" && activity.data.left ? (
          <div className="math-equation visual-groups">
            <div className="object-group">{Array.from({ length: activity.data.left.count }, (_, i) => <span key={i}>{activity.data.left!.object}</span>)}</div>
            <div className="operator">−</div>
            <div className="removed-count">{activity.data.removed}</div>
            <div className="operator">=</div>
            <div className="question-mark">?</div>
          </div>
        ) : activity.type === "visual_compare" && activity.data.left && activity.data.right ? (
          <div className="compare-groups">
            <div className="compare-box"><div className="object-group">{Array.from({ length: activity.data.left.count }, (_, i) => <span key={i}>{activity.data.left!.object}</span>)}</div><small>Kiri</small></div>
            <div className="operator">VS</div>
            <div className="compare-box"><div className="object-group">{Array.from({ length: activity.data.right.count }, (_, i) => <span key={i}>{activity.data.right!.object}</span>)}</div><small>Kanan</small></div>
          </div>
        ) : (
          <div className="visual">{activity.data.visual}</div>
        )}

        <div className="options">
          {activity.data.options.map(option => (
            <button
              key={option}
              className={`option ${result && option === activity.data.answer ? "answer" : ""}`}
              onClick={() => answer(option)}
              disabled={!!result}
            >
              {option}
            </button>
          ))}
        </div>

        {result && (
          <div className={`feedback ${result}`}>
            <strong>{result === "correct" ? "🎉 Hebat!" : "💡 Coba lagi!"}</strong>
            <span>{result === "correct" ? "Jawabanmu benar." : `Jawaban yang benar: ${activity.data.answer}`}</span>
            <button className="next" onClick={next}>Lanjut ▶</button>
          </div>
        )}
      </section>
      )}
    </main>
  );
}
