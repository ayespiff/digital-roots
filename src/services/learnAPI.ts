import type { Course, Lesson, Question } from "../types/learn";

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const learnApi = {
  getCourses: () => getJSON<Course[]>("/api/courses.php"),
  getLessons: (courseId: number) =>
    getJSON<Lesson[]>(`/api/lessons.php?courseId=${courseId}`),
  getLessonQuestions: (lessonId: number) =>
    getJSON<Question[]>(`/api/lesson_questions.php?lessonId=${lessonId}`),
  saveAttempt: async (payload: { lesson_id: number; score: number; total: number }) => {
    const res = await fetch("/api/save_attempt.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  getMyProgress: async () => {
    const res = await fetch("/api/my_progress.php", {
      credentials: "include",
    });
    return res.json();
  },
  getCourseProgress: async () => {
  const res = await fetch("/api/course_progress.php", {
    credentials: "include",
  });
  return res.json();
},
};

export async function saveAttempt(payload: { lesson_id: number; score: number; total: number }) {
  const res = await fetch("/api/save_attempt.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getMyProgress() {
  const res = await fetch("/api/my_progress.php", {
    credentials: "include",
  });
  return res.json();
}