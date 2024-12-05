<?php
ini_set('log_errors', 1);
ini_set('error_log', '../php-error.log');
error_reporting(E_ALL);

session_start();

// Check if the user is logged in and has the required access level
if (!isset($_SESSION['username'], $_SESSION['access_level'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

if ($_SESSION['access_level'] !== "scientific") {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "You do not have permission to access metadata."]);
    exit;
}

if (!isset($_GET['id_video'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing video ID."]);
    exit;
}

$id_video = intval($_GET['id_video']);

// Connect to the database
$conn = new mysqli("localhost", "root", "", "kosmos_wiki");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Retrieve metadata for the specified video
$stmt = $conn->prepare("SELECT metadata FROM videos WHERE id_video = ?");
$stmt->bind_param("i", $id_video);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $metadata = $row['metadata'];

    // Set headers to trigger a download
    header("Content-Type: application/json");
    header("Content-Disposition: attachment; filename=metadata_$id_video.json");
    echo $metadata;
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Metadata not found."]);
}

$stmt->close();
$conn->close();
?>
