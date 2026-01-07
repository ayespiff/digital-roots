<?php
require_once __DIR__ . "/db.php";

$lessonId = isset($_GET["lessonId"]) ? intval($_GET["lessonId"]) : 0;
if ($lessonId <= 0) {
  http_response_code(400);
  echo json_encode(["error" => "lessonId required"]);
  exit;
}

$qStmt = $pdo->prepare("
  SELECT id, prompt
  FROM questions
  WHERE lesson_id = ?
  ORDER BY id ASC
");
$qStmt->execute([$lessonId]);
$questions = $qStmt->fetchAll();

$oStmt = $pdo->prepare("
  SELECT id, option_text, is_correct, feedback
  FROM options
  WHERE question_id = ?
  ORDER BY id ASC
");

foreach ($questions as &$q) {
  $oStmt->execute([$q["id"]]);
  $q["options"] = $oStmt->fetchAll();
}

echo json_encode($questions);