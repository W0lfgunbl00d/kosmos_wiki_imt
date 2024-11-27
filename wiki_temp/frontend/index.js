document.addEventListener("DOMContentLoaded", async () => {
    const username = localStorage.getItem("username");
    const accessLevel = localStorage.getItem("access_level");

    if (username && accessLevel) {
        document.getElementById("welcome-message").textContent = `Welcome, ${accessLevel}!`;
        document.getElementById("user-details").textContent = `Username: ${username}`;

        try {
            // Fetch videos
            const response = await fetch("../backend/fetch_videos.php");
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

            const result = await response.json();
            if (result.success) {
                const videosList = document.getElementById("videos-list");
                videosList.innerHTML = ""; // Clear the list
                result.videos.forEach(video => {
                    const listItem = document.createElement("li");
                    listItem.textContent = `${video.file_name} (Recorded: ${video.recording_date})`;

                    // Add download button for the video
                    const downloadButton = document.createElement("button");
                    downloadButton.textContent = "Download Video";
                    downloadButton.style.marginLeft = "10px";
                    downloadButton.onclick = () => {
                        window.location.href = `../uploads/${video.file_name}`;
                    };
                    listItem.appendChild(downloadButton);

                    // Add metadata download button for scientific access
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

                // Show upload section for community_member and scientific
                if (accessLevel === "community_member" || accessLevel === "scientific") {
                    document.getElementById("upload-section").style.display = "block";
                }
            } else {
                document.getElementById("videos-list").innerHTML = `<li>${result.message}</li>`;
            }
        } catch (error) {
            document.getElementById("videos-list").innerHTML = `<li>Error loading videos: ${error.message}</li>`;
        }
    } else {
        document.getElementById("welcome-message").textContent = "Welcome!";
        document.getElementById("user-details").textContent = "Session data not found. Please log in.";
    }

    // Handle video upload
    const uploadForm = document.getElementById("upload-form");
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const videoFile = document.getElementById("video-file").files[0];
        const metadataFile = document.getElementById("metadata-file").files[0];

        if (!videoFile || !metadataFile) {
            document.getElementById("upload-message").textContent = "Please select both a video and its metadata file.";
            return;
        }

        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("metadata", metadataFile);

        try {
            const uploadResponse = await fetch("../backend/upload_video.php", {
                method: "POST",
                body: formData
            });

            const uploadResult = await uploadResponse.json();
            document.getElementById("upload-message").textContent = uploadResult.message;

            // Reload videos after successful upload
            if (uploadResult.success) {
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            document.getElementById("upload-message").textContent = "Error uploading video and metadata.";
        }
    });
});
