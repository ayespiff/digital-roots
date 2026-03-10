<?php
require_once __DIR__ . "/db.php";
header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
  http_response_code(401);
  echo json_encode(["error" => "Not logged in"]);
  exit;
}

$user_id = (int)$_SESSION["user_id"];

$stmt = $pdo->prepare("
  SELECT 
    la.id,
    la.score,
    la.total,
    la.completed_at,
    l.id AS lesson_id,
    l.title AS lesson_title,
    c.id AS course_id,
    c.title AS course_title
  FROM lesson_attempts la
  JOIN lessons l ON la.lesson_id = l.id
  JOIN courses c ON l.course_id = c.id
  WHERE la.user_id = ?
  ORDER BY la.completed_at DESC
");
$stmt->execute([$user_id]);

echo json_encode($stmt->fetchAll());