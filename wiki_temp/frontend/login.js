// Event listener for normal login
document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please fill in both username and password.");
        return;
    }

    try {
        const response = await fetch("../backend/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        if (result.success) {
            localStorage.setItem("username", result.username);
            localStorage.setItem("access_level", result.access_level); // Store access_level
            window.location.href = "index.html"; // Redirect after successful login
        } else {
            alert("Login failed: " + result.message);
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
});

// Event listener for "General Public" login
document.getElementById("general-public-button").addEventListener("click", async () => {
    const username = "general_user"; // Predefined username
    const password = ""; // Empty password

    try {
        const response = await fetch("../backend/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        if (result.success) {
            localStorage.setItem("username", result.username);
            localStorage.setItem("access_level", "general_public"); // Store access_level
            window.location.href = "index.html"; // Redirect after successful login
        } else {
            alert("Failed to log in as General Public: " + result.message);
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
});
