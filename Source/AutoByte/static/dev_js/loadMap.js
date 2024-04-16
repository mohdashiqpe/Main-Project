var map, marker;
var hidlat = document.getElementById("hidlat");
var hidlng = document.getElementById("hidlng");
var hidlat1 = document.getElementById("hidlat1");
var hidlng1 = document.getElementById("hidlng1");
var displaylatlng = document.getElementById("displaylatlng");
var countryText, stateText, cityText;
const selectedStateText = document.getElementById('selectedStateText');
const selectedCountryText = document.getElementById('selectedCountryText');
const selectedCityText = document.getElementById('selectedCityText');

function loadMap() {
  map = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  if (selectedLocaData()) {
    findLocation();
  }else{
    map.locate({ setView: true, maxZoom: 16 });
  }

  map.on("locationfound", onLocationFound);
  map.on("locationerror", onLocationError);
  map.on("click", onMapClick);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clickEvent() {
  await sleep(1000);
  loadMap();
}

function onMapClick(e) {
  console.log(e);
  clearMarkers(); // Clear existing markers
  loadlatlng(e);
  marker = L.marker(e.latlng, { draggable: true }).addTo(map);
  marker.on("move", markerMoved);
}

function clearMarkers() {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
}

function markerMoved(e) {
  console.log(e);
  loadlatlng(e);
}

function loadlatlng(e) {
  hidlat.value = e.latlng.lat;
  hidlng.value = e.latlng.lng;
  hidlat1.value = e.latlng.lat;
  hidlng1.value = e.latlng.lng;
  displaylatlng.textContent = `Latitude: ${e.latlng.lat}, Longitude: ${e.latlng.lng}`;
}

function selectedLocaData() {
  if (countrySelect.selectedOptions[0].value === "") countryText = false;
  else countryText = countrySelect.selectedOptions[0].textContent;

  if (stateSelect.selectedOptions[0].value === "") stateText = false;
  else stateText = stateSelect.selectedOptions[0].textContent;

  if (citySelect.selectedOptions[0].value === "") cityText = false;
  else cityText = citySelect.selectedOptions[0].textContent;

  console.log(
    `Country: ${countryText}, State: ${stateText}, City: ${cityText}`
  );

  selectedCountryText.value = countryText;
  selectedStateText.value = stateText;
  selectedCityText.value = cityText

  if (!countryText && !stateText && !cityText) {
    return false;
  } else {
    return true;
  }
}

function onLocationFound(e) {
  var radius = e.accuracy / 2;

  L.marker(e.latlng)
    .addTo(map)
    .bindPopup("You are within " + radius + " meters from this point")
    .openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

function findLocation() {
  var countryName = countryText.trim();
  var stateName = stateText.trim();
  var cityName = cityText.trim();

  var query = encodeURIComponent(
    cityName + "," + stateName + "," + countryName
  );

  var url = "https://nominatim.openstreetmap.org/search?format=json&q=" + query;
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


