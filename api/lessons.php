<?php
require_once __DIR__ . "/db.php";

$courseId = isset($_GET["courseId"]) ? intval($_GET["courseId"]) : 0;
if ($courseId <= 0) {
  http_response_code(400);
  echo json_encode(["error" => "courseId required"]);
  exit;
}

$stmt = $pdo->prepare("SELECT id, title FROM lessons WHERE course_id = ? ORDER BY id ASC");
$stmt->execute([$courseId]);
echo json_encode($stmt->fetchAll());