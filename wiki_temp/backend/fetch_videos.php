<?php
ini_set('log_errors', 1);
ini_set('error_log', '../php-error.log');
error_reporting(E_ALL);

session_start();

header("Content-Type: application/json");

// Check if the user is logged in and access_level is set
if (!isset($_SESSION['username']) || !isset($_SESSION['access_level'])) {
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

$access_level = $_SESSION['access_level'];

// Database connection
$conn = new mysqli("localhost", "root", "", "kosmos_wiki");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Fetch videos based on access level
if ($access_level === "general_public") {
    $query = "SELECT id_video, file_name, recording_date FROM videos LIMIT 5"; // Limit to 5 videos
} elseif ($access_level === "community_member") {
    $query = "SELECT id_video, file_name, recording_date, file_size FROM videos";
} elseif ($access_level === "scientific") {
    $query = "SELECT id_video, file_name, recording_date, file_size, id_station FROM videos";
} else {
    echo json_encode(["success" => false, "message" => "Invalid access level."]);
    exit;
}

$result = $conn->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Query failed: " . $conn->error]);
    exit;
}

// Prepare the data to return
$videos = [];
while ($row = $result->fetch_assoc()) {
    $videos[] = $row;
}

echo json_encode(["success" => true, "videos" => $videos]);
$conn->close();
?>
