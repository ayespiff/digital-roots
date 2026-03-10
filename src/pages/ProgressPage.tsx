import { useEffect, useState } from "react";
import { learnApi } from "../services/learnAPI";
import { Navigate } from "react-router-dom";

type User = { id: number; name: string } | null;

type ProgressPageProps = {
  user: User;
};

export default function ProgressPage({ user }: ProgressPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [courseSummary, setCourseSummary] = useState<any[]>([]);



  

  useEffect(() => {

    Promise.all([learnApi.getCourseProgress(), learnApi.getMyProgress()])
      .then(([summary, attempts]) => {
        setCourseSummary(Array.isArray(summary) ? summary : []);
        setItems(Array.isArray(attempts) ? attempts : []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!user) return <Navigate to="/register" replace />;

  const ProgressBar = ({ pct }: { pct: number }) => (
    <div style={{ height: 10, background: "#e5e7eb", borderRadius: 999 }}>
      <div
        style={{
          width: `${pct}%`,
          height: 10,
          background: "#2563eb",
          borderRadius: 999,
        }}
      />
    </div>
  );

  const maxAttempts =
    courseSummary.length > 0
      ? Math.max(...courseSummary.map((c) => Number(c.attempts) || 0))
      : 1;

  return (<div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
    <h1 style={{ fontSize: 28, marginBottom: 10 }}>Your Progress</h1>

    <h2 style={{ fontSize: 20, fontWeight: 900, marginTop: 18, marginBottom: 10 }}>
      Course Progress
    </h2>

    {loading ? (
      <div>Loading…</div>
    ) : courseSummary.length === 0 ? (
      <div style={{ opacity: 0.75 }}>No courses found.</div>
    ) : (
      <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
        {courseSummary.map((c) => {
          const total = Number(c.total_lessons) || 0;
          const completed = Number(c.lessons_completed) || 0;
          const attempts = Number(c.attempts) || 0;

          const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100);

          const attemptsPct =
            maxAttempts === 0 ? 0 : Math.round((attempts / maxAttempts) * 100);

          return (
            <div
              key={c.course_id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 14,
                background: "white",
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 6 }}>{c.course_title}</div>

              <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 6 }}>
                Course completion: {completed}/{total} lessons ({completionPct}%)
              </div>
              <ProgressBar pct={completionPct} />

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 6 }}>
                  Attempts: {attempts} (target {maxAttempts}) 
              //
                </div>
                <ProgressBar pct={attemptsPct} />
              </div>
            </div>
          );
        })}
      </div>
    )}
    <h2 style={{ fontSize: 20, fontWeight: 900, marginTop: 12, marginBottom: 10 }}>
      Detailed Attempts
    </h2>

    {loading ? (
      <div>Loading…</div>
    ) : items.length === 0 ? (
      <div style={{ opacity: 0.75 }}>
        No progress yet — complete a lesson to see results here.
      </div>
    ) : (
      <div style={{ display: "grid", gap: 12 }}>
        {items.map((x) => (
          <div
            key={x.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 14,
              background: "white",
            }}
          >
            <div style={{ fontWeight: 900 }}>
              {x.course_title} — {x.lesson_title}
            </div>
            <div style={{ opacity: 0.8, marginTop: 6 }}>
              Score: {x.score}/{x.total}
            </div>
            <div style={{ opacity: 0.6, fontSize: 12, marginTop: 4 }}>
              Completed: {new Date(x.completed_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>);

}

