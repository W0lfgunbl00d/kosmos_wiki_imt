let page = 1;
let offset = 10;

const onMarkerClick = async (event) => {
  const site = event.target.dataset.site;
  const date = event.target.dataset.date;

  try {
    const response = await fetch(
      `${API_URL}/stations/videos?site=${encodeURIComponent(site)}&date=${encodeURIComponent(date)}&access_level=${encodeURIComponent(localStorage.getItem("access_level"))}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error while retrieving video data.");
    }

    const videoData = await response.json();

    showVideoPopup(videoData);
  } catch (error) {
    console.error("Error fetching video:", error);
    alert("Failed to load video.");
  }
};

const fetchVideosMarkers = async () => {
  try {
    const response = await fetch(
      `${API_URL}/stations/videos/metadata?p=${page}&offset=${offset}&access_level=${encodeURIComponent(localStorage.getItem("access_level"))}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error while retrieving videos.");
    }

    const videoMarkers = await response.json();

    const markerList = document.querySelector(".markers");

    const markers = videoMarkers
          .map(
            (marker) => `
            <h2 class="marker" data-site="${sanitizeHTML(marker.site)}" data-date="${sanitizeHTML(marker.date)}">
              ${sanitizeHTML(marker.site)} at ${sanitizeHTML(marker.date)}
            </h2>`
          )
          .join("");

    markerList.innerHTML = markers;

    document.querySelectorAll(".marker").forEach((element) => {
      element.addEventListener("click", onMarkerClick);
    });
  } catch (error) {
    console.error("Error while retrieving videos. :", error);
  }  
} 

const sanitizeHTML = (str) => {
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
};

const fetchVideosCount = async () => {
  try {
    const response = await fetch(
      `${API_URL}/stations/videos/metadata/count`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error while videos count.");
    }

    const videoCount = await response.json();
    
    const totalPages = Math.ceil(videoCount / offset);

    const pagination = document.querySelector(".pagination");

    const paginationHTML = `
      ${page > 1 ? `<button class="prev">◀</button>` : ""}
      ${Array.from({ length: totalPages }, (_, i) => {
        const currentPage = i + 1;
        return `
          <button class="page-btn ${currentPage === page ? "selected" : ""}" data-page="${currentPage}">
            ${currentPage}
          </button>`;
      }).join("")}
      ${page < totalPages ? `<button class="next">▶</button>` : ""}
    `;

    pagination.innerHTML = paginationHTML;

    addPaginationEventListeners();
    
  } catch (error) {
    console.error("Error while retrieving videos. :", error);
  }  
}

const addPaginationEventListeners = () => {
  const pageButtons = document.querySelectorAll(".page-btn");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  pageButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      page = parseInt(event.target.dataset.page, 10); 
      updateContent();
    });
  });

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (page > 1) {
        page--;
        updateContent();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      page++;
      updateContent();
    });
  }
};

const updateContent = () => {
  fetchVideosMarkers();
  fetchVideosCount();
};

fetchVideosMarkers();
fetchVideosCount();

const showVideoPopup = (video) => {
  const popup = document.createElement("div");
  popup.className = "video-popup";

  popup.innerHTML = `
    <div class="popup-content">
      <button class="close-popup">✖</button>
      <video controls>
        <source src="${sanitizeHTML(video.url)}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <a href="${sanitizeHTML(video.url)}" class="download-btn" download="kosmos_video.mp4">Download Video</a>
      ${
        video.metadata 
          ? `<a href="${sanitizeHTML(video.metadata)}" class="download-btn" download>Download Metadata</a>` 
          : ""
      }
    </div>
  `;

  document.body.appendChild(popup);

  document.querySelector(".close-popup").addEventListener("click", () => {
    popup.remove();
  });
};