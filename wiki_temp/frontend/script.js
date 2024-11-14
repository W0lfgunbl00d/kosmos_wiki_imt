// Attach an event listener to the login form
document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect input values
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate inputs
    if (!username || !password) {
        alert("Please fill in both username and password.");
        return;
    }

    try {
        // Send POST request to the backend
        const response = await fetch("../backend/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Set the request Content-Type
            },
            body: JSON.stringify({ username, password }), // Send data as JSON
        });

        // Handle HTTP errors
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const result = await response.json();

        // Handle the response from the backend
        if (result.success) {
            alert(result.message); // Display success message
            window.location.href = "index.html"; // Redirect on successful login
        } else {
            alert("Login failed: " + result.message); // Display error message
        }
    } catch (error) {
        // Handle fetch errors (e.g., network issues)
        console.error("An error occurred:", error.message);
        alert("An error occurred: " + error.message);
    }
});
