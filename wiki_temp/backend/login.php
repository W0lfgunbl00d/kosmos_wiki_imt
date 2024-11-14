<?php
ini_set('log_errors', 1);
ini_set('error_log', '../php-error.log');
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed."]);
    exit;
}

$conn = new mysqli("localhost", "root", "", "kosmos_wiki");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['username'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON input."]);
    exit;
}

$username = $data['username'];
$password = $data['password'];

$stmt = $conn->prepare("SELECT * FROM user WHERE identification = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "SQL query preparation failed."]);
    exit;
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if ($password == $row['password']) {
        echo json_encode(["success" => true, "message" => "Login successful."]);
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect password."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found."]);
}

$stmt->close();
$conn->close();
?>
