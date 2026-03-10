import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";


type ExploreLesson = {
  id: number;
  title: string;
  course: string;
  level: "Beginner" | "Intermediate";
  durationMins: number;
  tags: string[];
};

const DEMO_LESSONS: ExploreLesson[] = [
  { id: 1, title: "Browsers & Tabs", course: "Web Basics", level: "Beginner", durationMins: 6, tags: ["browser", "tabs"] },
  { id: 2, title: "What is a Web Browser?", course: "Web Basics", level: "Beginner", durationMins: 5, tags: ["browser"] },
  { id: 3, title: "Recognising Phishing", course: "Online Safety", level: "Beginner", durationMins: 7, tags: ["phishing", "security"] },
  { id: 4, title: "Creating Strong Passwords", course: "Online Safety", level: "Beginner", durationMins: 6, tags: ["passwords", "security"] },
  { id: 5, title: "Using Email Safely", course: "Digital Communication Basics", level: "Beginner", durationMins: 8, tags: ["email", "phishing"] },
  { id: 6, title: "Online Etiquette", course: "Digital Communication Basics", level: "Beginner", durationMins: 6, tags: ["etiquette"] },
];

export default function ExplorePage() {
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [course, setCourse] = useState<string>("All");
  const [level, setLevel] = useState<string>("All");

  const courses = useMemo(() => ["All", ...Array.from(new Set(DEMO_LESSONS.map(l => l.course)))], []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return DEMO_LESSONS.filter((l) => {
      const matchesQuery =
        query.length === 0 ||
        l.title.toLowerCase().includes(query) ||
        l.course.toLowerCase().includes(query) ||
        l.tags.some(t => t.toLowerCase().includes(query));

      const matchesCourse = course === "All" || l.course === course;
      const matchesLevel = level === "All" || l.level === level;

      return matchesQuery && matchesCourse && matchesLevel;
    });
  }, [q, course, level]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Explore</h1>
          <p className="text-sm text-slate-600 mt-1">Search lessons across courses and topics.</p>
        </div>

        <button
          onClick={() => setShowFilters(v => !v)}
          className="border rounded-lg px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:border-slate-300"
        >
          Filters
        </button>
      </div>

      <div className="mt-4 border rounded-xl bg-white p-3">
        <input
          className="w-full outline-none text-sm"
          placeholder="Search lessons, courses, or keywords…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {showFilters && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border rounded-xl bg-white p-3">
            <label className="text-xs text-slate-500">Course</label>
            <select
              className="w-full mt-1 border rounded-lg p-2 text-sm"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="border rounded-xl bg-white p-3">
            <label className="text-xs text-slate-500">Level</label>
            <select
              className="w-full mt-1 border rounded-lg p-2 text-sm"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
            </select>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((l) => (
          <div key={l.id} className="border rounded-xl bg-white p-4">
            <div className="text-sm font-semibold">{l.title}</div>
            <div className="text-xs text-slate-600 mt-1">{l.course}</div>

            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
              <span className="border rounded-full px-2 py-0.5">{l.level}</span>
              <span className="border rounded-full px-2 py-0.5">{l.durationMins} min</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {l.tags.slice(0, 3).map(t => (
                <span key={t} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-4">
              {/* Demo-only: will later wire it to open the exact lesson. */}
              <Link
                to="/learn"
                className="text-sm text-blue-600 hover:underline"
              >
                Start learning →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 text-sm text-slate-600">
          No lessons match your search. Try a different keyword.
        </div>
      )}
    </div>
  );
}