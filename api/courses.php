<?php
require_once __DIR__ . "/db.php";

$stmt = $pdo->query("SELECT id, title, description FROM courses ORDER BY id ASC");
echo json_encode($stmt->fetchAll());