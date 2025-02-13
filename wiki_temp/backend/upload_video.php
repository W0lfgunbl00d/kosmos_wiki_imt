<?php
// Enable error logging for debugging purposes
ini_set('log_errors', 1); // Log errors to a file
ini_set('error_log', '../php-error.log'); // Specify the error log file location
error_reporting(E_ALL); // Report all errors, warnings, and notices

// Start a new session or resume the existing session
session_start();

// Set the response type to JSON
header("Content-Type: application/json");

// Validate that the user is logged in and has the required session variables
if (!isset($_SESSION['username']) || !isset($_SESSION['access_level']) || !isset($_SESSION['id_user'])) {
    // If the session variables are missing, deny access and exit
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

// Retrieve access level and user ID from session
$access_level = $_SESSION['access_level'];
$id_user = $_SESSION['id_user'];

// Ensure the user has the appropriate permissions to upload videos
if ($access_level !== "community_member" && $access_level !== "scientific") {
    echo json_encode(["success" => false, "message" => "You do not have permission to upload videos."]);
    exit;
}

// Check if both video file and JSON metadata are provided
if (!isset($_FILES["video"]) || !isset($_POST["json"])) {
    // If either the video file or metadata is missing, return an error
    echo json_encode(["success" => false, "message" => "Video file and JSON metadata are required."]);
    exit;
}

// Define the directory where uploaded videos will be stored
$target_dir = "../uploads/";

// Ensure the target directory exists, create it if it doesn't
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0777, true);
}

// Get the original file name of the uploaded video
$videoFileName = basename($_FILES["video"]["name"]);
$target_file = $target_dir . $videoFileName; // Full path to the uploaded file

// Move the uploaded video file to the target directory
if (!move_uploaded_file($_FILES["video"]["tmp_name"], $target_file)) {
    echo json_encode(["success" => false, "message" => "Failed to upload video file."]);
    exit;
}

// Retrieve and decode the JSON metadata
$jsonContent = $_POST["json"];
$metadata = json_decode($jsonContent, true);

// Validate the JSON metadata
if (!$metadata) {
    echo json_encode(["success" => false, "message" => "Invalid JSON metadata."]);
    exit;
}

// Extract or set a default recording date from the metadata
$recording_date = date("Y-m-d", strtotime($metadata['campagne']['dateDict']['date'] ?? "now"));

// Connect to the MySQL database
$conn = new mysqli("localhost", "root", "", "kosmos_wiki");

// Check if the database connection failed
if ($conn->connect_error) {
    http_response_code(500); // Return a 500 Internal Server Error
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Calculate a SHA-256 hash of the video file without loading it into memory
$videoHash = hash_file("sha256", $target_file);

// Check if a video with the same hash already exists in the database
$stmt = $conn->prepare("SELECT id_video FROM videos WHERE hash = ?");
$stmt->bind_param("s", $videoHash); // Bind the hash as a string parameter
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // If a matching hash is found, return an error indicating the video is a duplicate
    echo json_encode(["success" => false, "message" => "This video has already been uploaded."]);
    $stmt->close();
    $conn->close();
    exit;
}

// Prepare an SQL query to insert video details into the database
$stmt = $conn->prepare("INSERT INTO videos (id_station, recording_date, file_name, file_size, id_user, metadata, hash) VALUES (?, ?, ?, ?, ?, ?, ?)");
$station_id = 1; // Default station ID
$stmt->bind_param(
    "isssiss", // Data types: integer, string, string, string, integer, string, string
    $station_id,             // Station ID
    $recording_date,         // Recording date
    $videoFileName,          // File name
    $_FILES["video"]["size"],// File size
    $id_user,                // User ID
    $jsonContent,            // Metadata as a JSON string
    $videoHash               // SHA-256 hash of the video file
);

// Execute the query and handle the response
if ($stmt->execute()) {
    // If the insertion is successful, return a success message
    echo json_encode(["success" => true, "message" => "Video uploaded successfully."]);
} else {
    // If the insertion fails, return an error with the specific SQL error
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to insert video details: " . $stmt->error]);
}

// Close the prepared statement and database connection
$stmt->close();
$conn->close();
?>