<?php
// Enable error logging for debugging purposes
ini_set('log_errors', 1); // Log errors to a file
ini_set('error_log', '../php-error.log'); // Specify the error log file
error_reporting(E_ALL); // Report all errors, warnings, and notices

// Set headers for cross-origin requests and response type
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Content-Type: application/json"); // Set response type to JSON

// Restrict the script to POST requests only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed."]);
    exit; // Stop further execution
}

// Connect to the MySQL database
$conn = new mysqli("localhost", "root", "", "kosmos_wiki");

// Check for connection errors
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit; // Stop further execution
}

// Decode the JSON payload from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate the JSON input
if (!$data || !isset($data['username'], $data['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "message" => "Invalid JSON input."]);
    exit; // Stop further execution
}

// Extract username and password from the decoded JSON
$username = $data['username'];
$password = $data['password'];

// Prepare an SQL query to fetch user details by username
$stmt = $conn->prepare("SELECT * FROM user WHERE identification = ?");
if (!$stmt) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "SQL query preparation failed."]);
    exit; // Stop further execution
}

// Bind the username to the prepared SQL statement
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

// Check if a user with the provided username exists
if ($row = $result->fetch_assoc()) {
    // Verify the provided password
    if ($password == $row['password']) {
        // Start a new session and store user information in session variables
        session_start();
        $_SESSION['username'] = $username;
        $_SESSION['access_level'] = $row['access_level']; // Store the user's access level
        $_SESSION['id_user'] = $row['id']; // Store the user's ID

        // Respond with a success message and user details
        echo json_encode([
            "success" => true,
            "username" => $username,
            "access_level" => $row['access_level']
        ]);
    } else {
        // Respond with an error if the password is incorrect
        echo json_encode(["success" => false, "message" => "Incorrect password."]);
    }
} else {
    // Respond with an error if the user is not found
    echo json_encode(["success" => false, "message" => "User not found."]);
}

// Close the prepared statement and database connection
$stmt->close();
$conn->close();
?>
