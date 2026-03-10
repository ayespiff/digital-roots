<?php
require_once __DIR__ . "/db.php";
header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
  http_response_code(401);
  echo json_encode(["error" => "Not logged in"]);
  exit;
}

$user_id = (int)$_SESSION["user_id"];

/*
Returns one row per course:
- total_lessons: how many lessons exist in the course
- lessons_completed: how many unique lessons user has at least one attempt for
- attempts: total attempt count across lessons in that course
*/
$stmt = $pdo->prepare("
  SELECT
    c.id AS course_id,
    c.title AS course_title,
    COUNT(DISTINCT l.id) AS total_lessons,
    COUNT(DISTINCT la.lesson_id) AS lessons_completed,
    COUNT(la.id) AS attempts
  FROM courses c
  JOIN lessons l ON l.course_id = c.id
  LEFT JOIN lesson_attempts la
    ON la.lesson_id = l.id
    AND la.user_id = ?
  GROUP BY c.id, c.title
  ORDER BY c.id ASC
");

$stmt->execute([$user_id]);
echo json_encode($stmt->fetchAll());