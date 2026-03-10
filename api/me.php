<?php
require_once __DIR__ . "/db.php";

header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
  http_response_code(401);
  echo json_encode(["user" => null]);
  exit;
}

echo json_encode([
  "user" => [
    "id" => $_SESSION["user_id"],
    "name" => $_SESSION["user_name"]
  ]
]);