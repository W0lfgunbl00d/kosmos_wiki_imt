document.addEventListener("DOMContentLoaded", async () => {
    const username = localStorage.getItem("username");
    const accessLevel = localStorage.getItem("access_level");

    // Display welcome message and user details
    if (username && accessLevel) {
        document.getElementById("welcome-message").textContent = `Welcome, ${accessLevel}!`;
        document.getElementById("user-details").textContent = `Username: ${username}`;
    } else {
        document.getElementById("welcome-message").textContent = "Welcome!";
        document.getElementById("user-details").textContent = "Session data not found. Please log in.";
        return;
    }

    // Video and JSON Upload Handlers
    const jsonFileInput = document.getElementById("metadata-file");
    const jsonTextarea = document.getElementById("json-content");
    const uploadForm = document.getElementById("upload-form");
    const uploadMessage = document.getElementById("upload-message");

    // Fetch and display videos
    try {
        const response = await fetch("../backend/fetch_videos.php");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const result = await response.json();
        if (result.success) {
            const videosList = document.getElementById("videos-list");
            videosList.innerHTML = ""; // Clear the list

            result.videos.forEach((video) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${video.file_name} (Recorded: ${video.recording_date})`;

                // Add download button for video
                const downloadButton = document.createElement("button");
                downloadButton.textContent = "Download Video";
                downloadButton.style.marginLeft = "10px";
                downloadButton.onclick = () => {
                    window.location.href = `../uploads/${video.file_name}`;
                };
                listItem.appendChild(downloadButton);

                // Add metadata download button for "scientific" access level
                if (accessLevel === "scientific") {
                    const metadataButton = document.createElement("button");
                    metadataButton.textContent = "Download Metadata";
                    metadataButton.style.marginLeft = "10px";
                    metadataButton.onclick = () => {
                        window.location.href = `../backend/download_metadata.php?id_video=${video.id_video}`;
                    };
                    listItem.appendChild(metadataButton);
                }

                videosList.appendChild(listItem);
            });

            // Show upload section for authorized users
            if (accessLevel === "community_member" || accessLevel === "scientific") {
                document.getElementById("upload-section").style.display = "block";
            }
        } else {
            document.getElementById("videos-list").innerHTML = `<li>${result.message}</li>`;
        }
    } catch (error) {
        document.getElementById("videos-list").innerHTML = `<li>Error loading videos: ${error.message}</li>`;
    }

    // Load JSON file content into the textarea for preview and editing
    jsonFileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonContent = JSON.parse(e.target.result);
                    jsonTextarea.value = JSON.stringify(jsonContent, null, 4); // Pretty-print JSON
                } catch (error) {
                    alert("Invalid JSON file. Please select a valid JSON.");
                    jsonTextarea.value = "";
                }
            };
            reader.readAsText(file);
        } else {
            alert("Please select a valid JSON file.");
        }
    });

    // Handle form submission for video and JSON upload
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const videoFile = document.getElementById("video-file").files[0];
        const jsonContent = jsonTextarea.value.trim();

        if (!videoFile) {
            uploadMessage.textContent = "Please select a video file.";
            return;
        }

        if (!jsonContent) {
            uploadMessage.textContent = "JSON content is required.";
            return;
        }

        try {
            // Validate JSON content
            JSON.parse(jsonContent);

            const formData = new FormData();
            formData.append("video", videoFile);
            formData.append("json", jsonContent);

            const response = await fetch("../backend/upload_video.php", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            uploadMessage.textContent = result.message;

            // Reload the page after successful upload
            if (result.success) {
                window.location.reload();
            }
        } catch (error) {
            uploadMessage.textContent = "Error: Invalid JSON content.";
        }
    });
});
