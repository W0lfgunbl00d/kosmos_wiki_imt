<?php
// Enable error logging for debugging purposes
ini_set('log_errors', 1); // Enable logging of errors
ini_set('error_log', '../php-error.log'); // Specify the error log file path
error_reporting(E_ALL); // Report all types of errors, warnings, and notices

// Start the session to access session variables
session_start();

// Check if the required session variables are set
if (isset($_SESSION['username']) && isset($_SESSION['access_level']) && isset($_SESSION['id_user'])) {
    // If all required session variables are available, return them as a JSON response
    echo json_encode([
        "success" => true,                  // Indicate success
        "username" => $_SESSION['username'], // Provide the username from the session
        "access_level" => $_SESSION['access_level'], // Provide the access level from the session
        "id_user" => $_SESSION['id_user']  // Provide the user ID from the session
    ]);
} else {
    // If any of the session variables are missing, return a failure response
    echo json_encode([
        "success" => false,             // Indicate failure
        "message" => "No session data found." // Inform the client about missing session data
    ]);
}
?>
