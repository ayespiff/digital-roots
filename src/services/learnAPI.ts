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
};