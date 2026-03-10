<?php
require_once __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

$stmt = $pdo->prepare("SELECT id, name, password_hash FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user["password_hash"])) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

$_SESSION["user_id"] = $user["id"];
$_SESSION["user_name"] = $user["name"];

echo json_encode([
    "message" => "Login successful",
    "user" => [
        "id" => $user["id"],
        "name" => $user["name"]
    ]
]);