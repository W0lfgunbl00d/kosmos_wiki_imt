// Event listener for normal login
document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior (page reload)

    // Retrieve input values for username and password
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Ensure both fields are filled
    if (!username || !password) {
        alert("Please fill in both username and password."); // Alert the user if any field is empty
        return; // Exit the function
    }

    try {
        // Send a POST request to the backend login endpoint
        const response = await fetch("../backend/login.php", {
            method: "POST", // HTTP POST method
            headers: { "Content-Type": "application/json" }, // Specify JSON content type
            body: JSON.stringify({ username, password }), // Send username and password as JSON
        });

        // Throw an error if the response status is not OK
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        // Parse the JSON response
        const result = await response.json();

        if (result.success) {
            // Store the username and access level in localStorage
            localStorage.setItem("username", result.username);
            localStorage.setItem("access_level", result.access_level);

            // Redirect the user to the main index page after successful login
            window.location.href = "index.html";
        } else {
            // Display an error message if login fails
            alert("Login failed: " + result.message);
        }
    } catch (error) {
        // Catch and display any errors that occur during the process
        alert("An error occurred: " + error.message);
    }
});

// Event listener for "General Public" login
document.getElementById("general-public-button").addEventListener("click", async () => {
    // Predefined credentials for "General Public" login
    const username = "general_user"; // Static username for general public access
    const password = ""; // Empty password for general public access

    try {
        // Send a POST request to the backend login endpoint
        const response = await fetch("../backend/login.php", {
            method: "POST", // HTTP POST method
            headers: { "Content-Type": "application/json" }, // Specify JSON content type
            body: JSON.stringify({ username, password }), // Send predefined username and empty password
        });

        // Throw an error if the response status is not OK
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        // Parse the JSON response
        const result = await response.json();

        if (result.success) {
            // Store the username and access level for general public in localStorage
            localStorage.setItem("username", result.username);
            localStorage.setItem("access_level", "general_public"); // Set static access level for general public

            // Redirect the user to the main index page
            window.location.href = "index.html";
        } else {
            // Display an error message if the login fails
            alert("Failed to log in as General Public: " + result.message);
        }
    } catch (error) {
        // Catch and display any errors that occur during the process
        alert("An error occurred: " + error.message);
    }
});
