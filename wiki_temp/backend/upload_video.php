<?php
// Enable error logging
ini_set('log_errors', 1);
ini_set('error_log', '../php-error.log');
error_reporting(E_ALL);

// Start the session and set the response type
session_start();
header("Content-Type: application/json");

// Check if the user is logged in and has access level and ID set
if (!isset($_SESSION['username']) || !isset($_SESSION['access_level']) || !isset($_SESSION['id_user'])) {
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

// Only specific roles can upload videos
$access_level = $_SESSION['access_level'];
$id_user = $_SESSION['id_user']; // Get the user ID from the session

if ($access_level !== "community_member" && $access_level !== "scientific") {
    echo json_encode(["success" => false, "message" => "You do not have permission to upload videos."]);
    exit;
}

// Check if the video file and JSON content are provided
if (!isset($_FILES["video"]) || !isset($_POST["json"])) {
    echo json_encode(["success" => false, "message" => "Video file and JSON metadata are required."]);
    exit;
}

// Validate and parse the JSON metadata
$jsonContent = $_POST["json"];
$metadata = json_decode($jsonContent, true);

if (!$metadata) {
    echo json_encode(["success" => false, "message" => "Invalid JSON metadata."]);
    exit;
}

// Set a default recording_date if it's missing
$date = $metadata['campagne']['dateDict']['date'];
$recording_date = date("Y-m-d", strtotime($date));

// Validate the video file type
$videoFileName = basename($_FILES["video"]["name"]);
$videoFileType = strtolower(pathinfo($videoFileName, PATHINFO_EXTENSION));
$allowed_types = ["mp4", "avi", "mov"];

if (!in_array($videoFileType, $allowed_types)) {
    echo json_encode(["success" => false, "message" => "Invalid video file type. Allowed types are MP4, AVI, and MOV."]);
    exit;
}

// Move the video file to the uploads directory
$target_dir = "../uploads/";
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0777, true);
}

$target_file = $target_dir . $videoFileName;

if (!move_uploaded_file($_FILES["video"]["tmp_name"], $target_file)) {
    echo json_encode(["success" => false, "message" => "Failed to upload video file."]);
    exit;
}

// Connect to the database
$conn = new mysqli("localhost", "root", "", "kosmos_wiki");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$metadata_json = json_encode($metadata);

// Insert the video details and metadata into the database
$station_id = 1; // Default station ID

$stmt = $conn->prepare("INSERT INTO videos (id_station, recording_date, file_name, file_size, id_user, metadata) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param(
    "isssis",
    $station_id,                 // Station ID (default 1)
    $recording_date,             // Recording date (from metadata or today's date)
    $videoFileName,              // File name
    $_FILES["video"]["size"],    // File size
    $id_user,                    // User ID (from session)
    $metadata_json               // Metadata as a JSON string
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Video and metadata uploaded successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to insert data into the database: " . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
