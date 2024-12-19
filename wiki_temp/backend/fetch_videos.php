<?php
// Enable error logging for debugging purposes
ini_set('log_errors', 1); // Enable logging of errors
ini_set('error_log', '../php-error.log'); // Specify the error log file
error_reporting(E_ALL); // Report all types of errors, warnings, and notices

// Start the session to access session variables
session_start();

// Set the response type to JSON
header("Content-Type: application/json");

// Check if the user is logged in and their access level is set
if (!isset($_SESSION['username']) || !isset($_SESSION['access_level'])) {
    // If session data is missing, return an access denied error
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit; // Stop further execution
}

// Retrieve the user's access level from the session
$access_level = $_SESSION['access_level'];

// Connect to the MySQL database
$conn = new mysqli("localhost", "root", "", "kosmos_wiki");

// Check if the database connection failed
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit; // Stop further execution
}

// Determine the SQL query based on the user's access level
if ($access_level === "general_public") {
    // General public only sees basic details of videos, limited to 5 entries
    $query = "SELECT id_video, file_name, recording_date FROM videos LIMIT 5";
} elseif ($access_level === "community_member") {
    // Community members can see file size in addition to basic details
    $query = "SELECT id_video, file_name, recording_date, file_size FROM videos";
} elseif ($access_level === "scientific") {
    // Scientists can see all details, including station ID
    $query = "SELECT id_video, file_name, recording_date, file_size, id_station FROM videos";
} else {
    // Invalid access level, return an error
    echo json_encode(["success" => false, "message" => "Invalid access level."]);
    exit; // Stop further execution
}

// Execute the SQL query
$result = $conn->query($query);

// Check if the query failed
if (!$result) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Query failed: " . $conn->error]);
    exit; // Stop further execution
}

// Prepare the data to return as a JSON response
$videos = []; // Initialize an empty array to hold the video details
while ($row = $result->fetch_assoc()) {
    $videos[] = $row; // Append each row to the videos array
}

// Return the fetched video data as a JSON response
echo json_encode(["success" => true, "videos" => $videos]);

// Close the database connection
$conn->close();
?>
