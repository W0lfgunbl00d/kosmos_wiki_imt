<?php
ini_set('log_errors', 1);
ini_set('error_log', '../php-error.log');
error_reporting(E_ALL);

session_start();

// Check if the required session variables are set
if (isset($_SESSION['username']) && isset($_SESSION['access_level']) && isset($_SESSION['id_user'])) {
    echo json_encode([
        "success" => true,
        "username" => $_SESSION['username'],
        "access_level" => $_SESSION['access_level'],
        "id_user" => $_SESSION['id_user']
    ]);
} else {
    echo json_encode(["success" => false, "message" => "No session data found."]);
}
?>
