import { useEffect, useMemo, useState } from "react";
import { learnApi } from "../services/learnAPI";
import type { Course, Lesson, Question } from "../types/learn";
import { Navigate } from "react-router-dom";


type User = { id: number; name: string } | null;
type LearnPageProps = { user: User };

type Stage = "courses" | "lessons" | "player" | "complete";

export default function LearnPage({ user }: LearnPageProps) {

  const [savingAttempt, setSavingAttempt] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [stage, setStage] = useState<Stage>("courses");

  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [courseError, setCourseError] = useState<string | null>(null);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [questionError, setQuestionError] = useState<string | null>(null);

  // player state
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const currentQuestion = questions[index];

  const progressPct = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round(((index + 1) / questions.length) * 100);
  }, [index, questions.length]);

  const score = useMemo(() => {
    let correct = 0;
    for (const q of questions) {
      const chosen = answers[q.id];
      if (!chosen) continue;
      const opt = q.options.find((o) => o.id === chosen);
      if (opt?.is_correct === 1) correct++;
    }
    return { correct, total: questions.length };
  }, [answers, questions]);

  // Load courses on page load
  useEffect(() => {
    setLoadingCourses(true);
    setCourseError(null);

    learnApi
      .getCourses()
      .then((data) => {
        setCourses(data);
      })
      .catch(() => {
        setCourses([]);
        setCourseError("Could not load courses. Please refresh and try again.");
      })
      .finally(() => setLoadingCourses(false));
  }, []);

  if (!user) return <Navigate to="/register" replace />;
  const resetPlayerState = () => {
    setIndex(0);
    setSelectedOptionId(null);
    setChecked(false);
    setAnswers({});
    setQuestions([]);
  };

  const openCourse = async (course: Course) => {
    setSelectedCourse(course);
    setSelectedLesson(null);
    resetPlayerState();
    setStage("lessons");
    setLessonError(null);
    setLoadingLessons(true);

    setLoadingLessons(true);
    setLessonError(null);
    try {
      const data = await learnApi.getLessons(course.id);
      setLessons(data);
    } catch {
      setLessons([]);
      setLessonError("Could not load lessons for this course. Please try again.");
    } finally {
      setLoadingLessons(false);
    }
  };

  const startLesson = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    resetPlayerState();
    setStage("player");

    setLoadingQuestions(true);
    setQuestionError(null);

    try {
      const data = await learnApi.getLessonQuestions(lesson.id);
      setQuestions(data);
    } catch {
      setQuestions([]);
      setQuestionError("Could not load questions for this lesson. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const onCheck = () => {
    if (!currentQuestion || selectedOptionId === null) return;
    setChecked(true);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOptionId }));
  };

  //save, then complete
  const onNext = async () => {
    if (!checked) return;

    // last question -> save attempt -> complete
    if (index >= questions.length - 1) {
      setSaveError(null);

      if (selectedLesson && questions.length > 0) {
        try {
          setSavingAttempt(true);
          await learnApi.saveAttempt({
            lesson_id: selectedLesson.id,
            score: score.correct,
            total: score.total,
          });
        } catch {
          setSaveError("Could not save progress. Please try again.");
        } finally {
          setSavingAttempt(false);
        }
      }

      setStage("complete");
      return;
    }

    setIndex((i) => i + 1);
    setSelectedOptionId(null);
    setChecked(false);
  };

  const onPrev = () => {
    if (index === 0) return;

    const prevIndex = index - 1;
    const prevQ = questions[prevIndex];
    const prevChosen = prevQ ? answers[prevQ.id] : undefined;

    setIndex(prevIndex);
    setSelectedOptionId(prevChosen ?? null);
    setChecked(prevChosen ? true : false);
  };

  // --- simple UI helpers
  const Container = ({ children }: { children: React.ReactNode }) => (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>{children}</div>
  );

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        background: "white",
      }}
    >
      {children}
    </div>
  );

  const Button = ({
    children,
    onClick,
    disabled,
    variant = "primary",
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "primary" | "ghost";
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        border: variant === "ghost" ? "1px solid #e5e7eb" : "1px solid #2563eb",
        background: variant === "ghost" ? "white" : "#2563eb",
        color: variant === "ghost" ? "#111827" : "white",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );

  // --- STAGE: courses
  if (stage === "courses") {
    return (
      <Container>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Learn</h1>
        <p style={{ opacity: 0.75, marginTop: 0, marginBottom: 16 }}>
          Choose a course to start learning.
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          {loadingCourses ? (
            <Card>
              <div>Loading courses…</div>
            </Card>
          ) : (
            <>
              {courseError && (
                <Card>
                  <div style={{ color: "red" }}>{courseError}</div>
                </Card>
              )}
              {courses.map((c) => (
                <Card key={c.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>{c.title}</div>
                      <div style={{ opacity: 0.75, marginTop: 6 }}>{c.description ?? ""}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Button onClick={() => openCourse(c)}>View lessons</Button>
                    </div>
                  </div>
                </Card>
              ))}

              {courses.length === 0 && (
                <Card>
                  <div>No courses available yet. Please check back soon.</div>
                </Card>
              )}
            </>
          )}
        </div>
      </Container>
    );
  }

  // --- STAGE: lessons
  if (stage === "lessons") {
    return (
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 6 }}>{selectedCourse?.title ?? "Lessons"}</h1>
            <p style={{ opacity: 0.75, marginTop: 0 }}>
              Pick a lesson to start.
            </p>
          </div>
          <Button variant="ghost" onClick={() => setStage("courses")}>
            ← Back to courses
          </Button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {lessonError && (
            <Card>
              <div style={{ color: "red" }}>{lessonError}</div>
            </Card>
          )}
          {lessons.map((l) => (
            <Card key={l.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ fontWeight: 800 }}>{l.title}</div>
                <Button onClick={() => startLesson(l)}>Start</Button>
              </div>
            </Card>
          ))}

          {lessons.length === 0 && (
            <Card>
              <div>No lessons found for this course yet.</div>
            </Card>
          )}
        </div>
      </Container>
    );
  }

  // --- STAGE: complete
  if (stage === "complete") {
    return (
      <Container>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Lesson complete 🎉</h1>

        <Card>
          <div style={{ fontSize: 18, fontWeight: 800 }}>
            Score: {score.correct} / {score.total}
          </div>
          <div style={{ opacity: 0.75, marginTop: 6 }}>
            You can retry this lesson or go back to the lesson list.
          </div>

          {saveError && (
            <div style={{ marginTop: 10, color: "red", fontSize: 14 }}>
              {saveError}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <Button
              onClick={() => {
                if (selectedLesson) startLesson(selectedLesson);
              }}
            >
              Retry lesson
            </Button>

            <Button variant="ghost" onClick={() => setStage("lessons")}>
              Back to lessons
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  // --- STAGE: question
  const chosen = currentQuestion?.options.find(o => o.id === selectedOptionId);
  const correct = currentQuestion?.options.find(o => o.is_correct === 1);

  if (currentQuestion && (!currentQuestion.options || currentQuestion.options.length === 0)) {
    return (
      <Container>
        <Card>
          <div style={{ fontWeight: 800 }}>This question has no answer options.</div>
          <div style={{ opacity: 0.75, marginTop: 6 }}>
            This is a data issue. Please go back and try another lesson.
          </div>

          <div style={{ marginTop: 12 }}>
            <Button variant="ghost" onClick={() => setStage("lessons")}>
              ← Back to lessons
            </Button>
          </div>
        </Card>
      </Container>
    );
  }
  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 6 }}>{selectedLesson?.title ?? "Lesson"}</h1>
          <div style={{ opacity: 0.75 }}>
            Question {Math.min(index + 1, questions.length)} of {questions.length}
          </div>
        </div>
        <Button variant="ghost" onClick={() => setStage("lessons")}>
          ← Back to lessons
        </Button>
      </div>

      {/* progress bar */}
      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <div style={{ height: 8, background: "#e5e7eb", borderRadius: 999 }}>
          <div style={{ width: `${progressPct}%`, height: 8, background: "#2563eb", borderRadius: 999 }} />
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{progressPct}%</div>
      </div>
      {/* question stage <render, only shows when loading*/}
      {!loadingQuestions && questionError && (
        <Card>
          <div style={{ color: "red" }}>{questionError}</div>
        </Card>
      )}
      {!currentQuestion ? (

        <Card>Loading questions…</Card>
      ) : (
        <Card>
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>
            {currentQuestion.prompt}
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isChosenCorrect = checked && selectedOptionId === opt.id && opt.is_correct === 1;
              const isChosenWrong = checked && selectedOptionId === opt.id && opt.is_correct === 0;

              return (
                <button
                  key={opt.id}
                  onClick={() => !checked && setSelectedOptionId(opt.id)}
                  disabled={checked}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    textAlign: "left",
                    border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
                    background: isChosenCorrect
                      ? "#ecfdf5"
                      : isChosenWrong
                        ? "#fef2f2"
                        : isSelected
                          ? "#eff6ff"
                          : "white",
                    cursor: checked ? "default" : "pointer",
                  }}
                >
                  {opt.option_text}
                </button>
              );
            })}
          </div>

          {/* feedback */}
          {checked && selectedOptionId !== null && (
            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 12,
                background: "#f8fafc",
                borderLeft: chosen?.is_correct === 1 ? "4px solid #22c55e" : "4px solid #ef4444",
                border: "1px solid #e5e7eb",
              }}
            >
              {currentQuestion.options.find((o) => o.id === selectedOptionId)?.is_correct === 1 ? (
                <div style={{ fontWeight: 800 }}>Correct ✅</div>
              ) : (
                <div style={{ fontWeight: 800 }}>Not quite ❌</div>
              )}

              <div style={{ opacity: 0.8, marginTop: 6 }}>
                {chosen?.feedback ?? "—"}
                {chosen?.is_correct === 0 && correct?.feedback && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Correct answer:</strong> {correct.feedback}
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <Button variant="ghost" disabled={index === 0} onClick={onPrev}>
              Previous
            </Button>

            <Button disabled={selectedOptionId === null || checked} onClick={onCheck}>
              Check answer
            </Button>

            <Button disabled={!checked || savingAttempt} onClick={onNext}>
              {index === questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </Card>
      )}
    </Container>
  );
}
