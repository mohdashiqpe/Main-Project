var map;
var countryText, stateText, cityText;
var marker;
var loadCoord = document.getElementById("loadCoord");
var saveBtnMap = document.getElementById("saveBtnMap");
var hiddenLat = document.getElementById("hiddenLat");
var hiddenLng = document.getElementById("hiddenLng");
var userlocaId = document.getElementById("userlocaId");
var existingLat = document.getElementById("existingLat");
var existinglng = document.getElementById("existinglng");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function btnOnClick(lat, lng) {
  if (map) {
    console.log("Map already exists. Resetting...");
    findLocation();
  }
  console.log("Load the map now");
  await sleep(300);

  map = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  console.log("Map has been loaded");
  findLocation();

  map.on("click", (e) => {
    console.log(e);
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker(e.latlng).addTo(map);
    loadCoord.textContent = `Loaded Co-Ordinates ${e.latlng.lat}, ${e.latlng.lng}`;
    saveBtnMap.classList.remove("d-none");
    saveBtnMap.href = `${saveBtnMap.href}${userlocaId.value}&lat=${e.latlng.lat}&long=${e.latlng.lng}`;
    console.log(saveBtnMap.href);
    hiddenLat.value = e.latlng.lat;
    hiddenLng.value = e.latlng.lng;
  });
}

function findLocation() {
  if (existingLat.value != "None" && existinglng.value != "None") {
    var lat = parseFloat(existingLat.value.trim());
    var lon = parseFloat(existinglng.value.trim());
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);
    map.setView([lat, lon], 16);
    marker = L.marker([lat, lon]).addTo(map);
    console.log(marker);
  } else {
    loadData();
    var countryName = countryText.trim();
    var stateName = stateText.trim();
    var cityName = cityText.trim();

    var query = encodeURIComponent(
      cityName + "," + stateName + "," + countryName
    );

    var url =
      "https://nominatim.openstreetmap.org/search?format=json&q=" + query;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          var lat = parseFloat(data[0].lat);
          var lon = parseFloat(data[0].lon);
          map.setView([lat, lon], 13);
          marker = L.marker([lat, lon]).addTo(map);
        } else {
          alert("Location not found.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while finding the location.");
      });
  }
}

function loadData() {
  if (countrySelect.selectedOptions[0].value === "") countryText = false;
  else countryText = countrySelect.selectedOptions[0].textContent;

  if (stateSelect.selectedOptions[0].value === "") stateText = false;
  else stateText = stateSelect.selectedOptions[0].textContent;

  if (citySelect.selectedOptions[0].value === "") cityText = false;
  else cityText = citySelect.selectedOptions[0].textContent;

  console.log(
    `Country: ${countryText}, State: ${stateText}, City: ${cityText}`
  );
}

function clearMap() {
  // Remove all layers from the map
  map.eachLayer(function (layer) {
    if (
      layer instanceof L.Marker ||
      layer instanceof L.Polyline ||
      layer instanceof L.Polygon
    ) {
      map.removeLayer(layer);
    }
  });
}
