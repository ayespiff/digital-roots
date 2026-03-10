<?php
require_once __DIR__ . "/db.php";
header("Content-Type: application/json");

// must be logged in
if (!isset($_SESSION["user_id"])) {
  http_response_code(401);
  echo json_encode(["error" => "Not logged in"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$lesson_id = (int)($data["lesson_id"] ?? 0);
$score = (int)($data["score"] ?? 0);
$total = (int)($data["total"] ?? 0);

if ($lesson_id <= 0 || $total <= 0) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid payload"]);
  exit;
}

$user_id = (int)$_SESSION["user_id"];

$stmt = $pdo->prepare("INSERT INTO lesson_attempts (user_id, lesson_id, score, total) VALUES (?, ?, ?, ?)");
$stmt->execute([$user_id, $lesson_id, $score, $total]);

echo json_encode(["message" => "Attempt saved"]);