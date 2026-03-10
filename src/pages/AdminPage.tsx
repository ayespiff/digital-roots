import { useMemo } from "react";
import { Navigate } from "react-router-dom";

type User = { id: number; name: string } | null;

export default function AdminPage({ user }: { user: User }) {
  // could remove guard but leave it so it matches the rest of UX
  if (!user) return <Navigate to="/register" replace />;

  const stats = useMemo(() => {
    return {
      students: 135,
      lessons: 24,
      lessonsCompleted: 830,
      avgScore: 92,
      avgTime: "1.1 min",
    };
  }, []);

  const recentActivity = useMemo(() => {
    return [
      { name: "Amina", progress: "Online Safety — 2 lessons completed" },
      { name: "Kemi", progress: "Web Basics — 1 lesson completed" },
      { name: "Tunde", progress: "Digital Comms — 3 lessons completed" },
    ];
  }, []);

  const lessonMgmt = useMemo(() => {
    return [
      { title: "Browsers & Tabs", course: "Web Basics" },
      { title: "Recognising Phishing", course: "Online Safety" },
      { title: "Creating Strong Passwords", course: "Online Safety" },
    ];
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar */}
        <aside className="border rounded-xl bg-white p-4 lg:col-span-1">
          <div className="text-sm font-semibold mb-4">Admin</div>

          <div className="space-y-2 text-sm">
            <div className="font-medium underline underline-offset-4">Overview</div>
            <div className="text-slate-600">Students</div>
            <div className="text-slate-600">Analytics</div>
            <div className="text-slate-600">Lesson management</div>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            Demo dashboard (frontend-only).
          </div>
        </aside>

        {/* Main */}
        <main className="lg:col-span-3 space-y-4">
          <h1 className="text-2xl font-semibold">Overview</h1>

          {/* Top stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-xl bg-white p-4">
              <div className="text-xs text-slate-500">Students</div>
              <div className="text-xl font-semibold mt-1">{stats.students}</div>
            </div>

            <div className="border rounded-xl bg-white p-4">
              <div className="text-xs text-slate-500">Lessons</div>
              <div className="text-xl font-semibold mt-1">{stats.lessons}</div>
            </div>
          </div>

          {/* Mid section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="border rounded-xl bg-white p-4 lg:col-span-2">
              <div className="text-sm font-semibold mb-3">Recent student activity</div>
              <div className="divide-y">
                {recentActivity.map((r) => (
                  <div key={r.name} className="py-2 flex items-center justify-between gap-3">
                    <div className="text-sm">{r.name}</div>
                    <div className="text-xs text-slate-600">{r.progress}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-xl bg-white p-4">
              <div className="text-sm font-semibold mb-3">Analytics (demo)</div>
              <div className="text-sm text-slate-700">• {stats.lessonsCompleted} lessons completed</div>
              <div className="text-sm text-slate-700 mt-2">• {stats.avgScore}% average score</div>
              <div className="text-sm text-slate-700 mt-2">• {stats.avgTime} avg time per lesson</div>
            </div>
          </div>

          {/* Lesson management */}
          <div className="border rounded-xl bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Lesson management</div>
              <button className="border rounded-lg px-3 py-2 text-sm text-slate-700 hover:border-slate-300">
                + Add lesson (demo)
              </button>
            </div>

            <div className="mt-3 divide-y">
              {lessonMgmt.map((l) => (
                <div key={l.title} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{l.title}</div>
                    <div className="text-xs text-slate-600">{l.course}</div>
                  </div>
                  <button className="text-sm text-blue-600 hover:underline">
                    View →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}