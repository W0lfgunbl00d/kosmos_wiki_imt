<?php
// Enable error logging for debugging purposes
ini_set('log_errors', 1); // Enable error logging
ini_set('error_log', '../php-error.log'); // Log errors to the specified file
error_reporting(E_ALL); // Report all errors, warnings, and notices

// Start the session to access user session data
session_start();

// Check if the user is logged in and has the required session variables
if (!isset($_SESSION['username'], $_SESSION['access_level'])) {
    http_response_code(403); // Forbidden
    echo json_encode(["success" => false, "message" => "Access denied."]); // Return an error response
    exit; // Stop further execution
}

// Verify that the user has the "scientific" access level
if ($_SESSION['access_level'] !== "scientific") {
    http_response_code(403); // Forbidden
    echo json_encode(["success" => false, "message" => "You do not have permission to access metadata."]);
    exit; // Stop further execution
}

// Ensure the `id_video` parameter is provided in the request
if (!isset($_GET['id_video'])) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "message" => "Missing video ID."]); // Inform the client that `id_video` is required
    exit; // Stop further execution
}

// Sanitize the video ID to prevent potential SQL injection
$id_video = intval($_GET['id_video']); // Convert to integer for safety

// Connect to the MySQL database
$conn = new mysqli("localhost", "root", "", "kosmos_wiki");

// Check for database connection errors
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit; // Stop further execution
}

// Prepare an SQL statement to retrieve metadata for the specified video ID
$stmt = $conn->prepare("SELECT metadata FROM videos WHERE id_video = ?");
$stmt->bind_param("i", $id_video); // Bind the video ID as an integer
$stmt->execute();
$result = $stmt->get_result();

// Check if the metadata was found in the database
if ($row = $result->fetch_assoc()) {
    $metadata = $row['metadata']; // Retrieve the metadata JSON string

    // Set headers to initiate a file download
    header("Content-Type: application/json"); // Specify the content type as JSON
    header("Content-Disposition: attachment; filename=metadata_$id_video.json"); // Specify the download file name

    echo $metadata; // Output the metadata content
} else {
    // Return a 404 error if the metadata is not found
    http_response_code(404); // Not Found
    echo json_encode(["success" => false, "message" => "Metadata not found."]);
}

// Close the prepared statement and database connection
$stmt->close();
$conn->close();
?>
