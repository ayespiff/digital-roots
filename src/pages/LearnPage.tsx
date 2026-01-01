import { useEffect, useState } from "react";

type Option = { id: number; option_text: string };
type Question = { id: number; prompt: string; options: Option[] };

export default function LearnPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/lesson_questions.php?lessonId=1")
      .then((r) => r.json())
      .then((data) => setQuestions(data))
      .catch(() => setQuestions([]));
  }, []);

  const q = questions[index];

  if (!q) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div style={{ padding: 16, maxWidth: 700 }}>
      <h1>Digital Roots — Learn</h1>

      <div style={{ marginTop: 12, padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
        <div style={{ opacity: 0.7, marginBottom: 8 }}>
          Question {index + 1} / {questions.length}
        </div>

        <h2 style={{ marginTop: 0 }}>{q.prompt}</h2>

        <div style={{ display: "grid", gap: 8 }}>
          {q.options.map((opt) => (
            <button
              key={opt.id}
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc", textAlign: "left" }}
              onClick={() => {/* later: store answer */}}
            >
              {opt.option_text}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          Previous
        </button>
        <button disabled={index === questions.length - 1} onClick={() => setIndex((i) => i + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
