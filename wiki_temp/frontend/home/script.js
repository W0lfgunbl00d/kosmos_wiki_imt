API_URL = "";

let stations = [
  {
    "latitude": 48.8566,
    "longitude": 2.3522,
    "site": "Station 1"
  }
];

const fetchStationsGPS = async () => {
  try {
    const response = await fetch(`${API_URL}/stations/gps`, {
      headers: {
        "Content-Type": "application/json", 
      },
    });

    if (!response.ok) {
      throw new Error("Error while retreiving data.");
    }

    stations = await response.json();
    console.log("Stations récupérées :", stations);

    // add markers on stations of each video
    addMarkersToMap();
  } catch (error) {
    console.error("Impossible de récupérer les données des stations.");
  }
} 

const map = L.map('map').setView([48.3582, -4.5704], 13);
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      map.setView([latitude, longitude], 13);  
    },
    (error) => {
      console.error('Erreur lors de la récupération de la position :', error.message);
      alert('Your position is indetectable.');
    }
  );
} else {
  alert('You have to allow access to your geolocalisation in the browser.');
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '',
}).addTo(map);

const addMarkersToMap = async () => {
  stations.forEach((station) => {
    const marker = L.marker([station.latitude, station.longitude]).addTo(map);
    
    marker.on("click", async () => {
      try {
        const response = await fetch(
          `${API_URL}/stations/videos?lon=${encodeURIComponent(station.longitude)}&lat=${encodeURIComponent(station.latitude)}&duration=5`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error while retrieving videos.");
        }

        const videos = await response.json();

        const videoContent = videos
          .map(
            (video) => `
            <iframe 
              src="${video.url}" 
              width="300" 
              height="200" 
              frameborder="0" 
              allowfullscreen>
            </iframe>`
          )
          .join("");

        marker.bindPopup(`
          <div>
            <h3>${station.site}</h3>
            ${videoContent || "<p>No videos available.</p>"}
          </div>
        `).openPopup();
      } catch (error) {
        console.error("Error while retrieving videos. :", error);
        marker.bindPopup(`<p>Could not load videos for this station.</p>`).openPopup();
      }
    });
  });
};

fetchStationsGPS();