document.addEventListener("DOMContentLoaded", async () => {
    const username = localStorage.getItem("username");
    const accessLevel = localStorage.getItem("access_level");

    const videosList = document.getElementById("videos-list");
    const videoPlayer = document.getElementById("video-player");
    const videoSource = document.getElementById("video-source");
    const alertMessage = document.getElementById("alert-message");
    const uploadSection = document.getElementById("upload-section");
    const uploadForm = document.getElementById("upload-form");
    const jsonFileInput = document.getElementById("metadata-file");
    const jsonTextarea = document.getElementById("json-content");
    const uploadMessage = document.getElementById("upload-message");
    const MAX_PLAY_TIME = 300; // 5 minutes in seconds

    // Display welcome message and user details
    if (username && accessLevel) {
        document.getElementById("welcome-message").textContent = `Welcome, ${accessLevel}!`;
        document.getElementById("user-details").textContent = `Username: ${username}`;
    } else {
        document.getElementById("welcome-message").textContent = "Welcome!";
        document.getElementById("user-details").textContent = "Session data not found. Please log in.";
        return;
    }

    // Show the upload section for authorized users only
    if (accessLevel === "community_member" || accessLevel === "scientific") {
        uploadSection.style.display = "block";
    }

    // Disable video download for "general_public"
    if (accessLevel === "general_public") {
        videoPlayer.setAttribute("controlsList", "nodownload");
    }

    // Function to fetch and display videos
    async function fetchVideos() {
        try {
            const response = await fetch("../backend/fetch_videos.php");
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

            const result = await response.json();
            if (result.success) {
                videosList.innerHTML = ""; // Clear the video list
                result.videos.forEach((video) => {
                    const listItem = document.createElement("li");
                    listItem.innerHTML = `
                        ${video.file_name} (Recorded: ${video.recording_date})
                        <button class="play-video-button" data-video="${video.id_video}" style="margin-left: 10px;">
                            Play Video
                        </button>
                        ${
                        accessLevel === "scientific"
                            ? `<button class="download-metadata-button" data-id="${video.id_video}" style="margin-left: 10px;">Download Metadata</button>`
                            : ""
                    }
                    `;

                    // Add event listener to play video
                    listItem.querySelector(".play-video-button").addEventListener("click", () => {
                        videoPlayer.pause(); // Pause any current playback
                        alertMessage.style.display = "none"; // Hide alert message

                        const videoFileName = video.file_name; // File name from the backend
                        videoSource.src = `../uploads/${videoFileName}`;

                        videoPlayer.load(); // Load the new video
                        videoPlayer.play(); // Start playback
                    });

                    // Add event listener to download metadata (scientific only)
                    if (accessLevel === "scientific") {
                        listItem.querySelector(".download-metadata-button").addEventListener("click", () => {
                            window.location.href = `../backend/download_metadata.php?id_video=${video.id_video}`;
                        });
                    }

                    videosList.appendChild(listItem); // Add the list item to the video list
                });
            } else {
                videosList.innerHTML = `<li>${result.message}</li>`;
            }
        } catch (error) {
            videosList.innerHTML = `<li>Error loading videos: ${error.message}</li>`;
        }
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
                    jsonTextarea.value = ""; // Clear the textarea on error
                }
            };
            reader.readAsText(file); // Read the JSON file
        } else {
            alert("Please select a valid JSON file.");
        }
    });

    // Handle video and JSON upload
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

            // Refresh the video list on successful upload
            if (result.success) {
                fetchVideos();
            }
        } catch (error) {
            uploadMessage.textContent = "Error: Invalid JSON content.";
        }
    });

    // Restrict video playback to the first 5 minutes (general_public only)
    if (accessLevel === "general_public") {
        videoPlayer.addEventListener("timeupdate", () => {
            if (videoPlayer.currentTime > MAX_PLAY_TIME) {
                videoPlayer.pause(); // Pause playback
                videoPlayer.currentTime = MAX_PLAY_TIME; // Limit playback time
                alertMessage.style.display = "block"; // Show playback restriction alert
            }
        });

        videoPlayer.addEventListener("play", () => {
            alertMessage.style.display = "none"; // Hide alert when playback resumes
        });
    }

    // Fetch and display videos when the page loads
    fetchVideos();
});
