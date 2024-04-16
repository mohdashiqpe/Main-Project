const srclat = document.querySelectorAll('#srclat');
const srclng = document.querySelectorAll('#srclng');
var routingControl;
const dellat = document.getElementById('dellat');
const dellng = document.getElementById('dellng');

const destLat = document.querySelectorAll('#destLat');
const destLng = document.querySelectorAll('#destLng');

var markerdel;

var latLngList = []
const markers = []

const endlatLng = []

var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);




function loadPoints() {
    console.log(srclat);

    var latitude = parseFloat(dellat.value);
    var longitude = parseFloat(dellng.value);

    // Define a custom marker icon with the desired color
    var customIcon = L.icon({
        iconUrl: 'https://cdn3.iconfinder.com/data/icons/bold-ui-2/24/artsebasov_profile-512.png', // You can use any marker icon image
        iconSize: [25, 41], // Size of the icon
        iconAnchor: [12, 41], // Anchor point of the icon
        popupAnchor: [1, -34], // Popup anchor point
        // Define the icon's HTML class and set its color
        className: 'custom-marker-icon',
        // Use CSS styles to change the color of the marker icon
        // You can use any valid CSS color value
        // Here, we're using red as an example
        iconStyle: 'color: red;'
    });

    // Create a marker with the custom icon
    markerdel = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

    console.log(srclat[0].value);
    for (let i = 0; i < srclat.length; i++) {
        const lat = parseFloat(srclat[i].value);
        const lng = parseFloat(srclng[i].value);
        console.log(`Lat: ${lat}, ${lng}`);
        latLngList.push([lat, lng]);
    }

    console.log(latLngList);
    latLngList.forEach(point => {
        console.log('Reached Hee');
        const marker = L.marker([point[0], point[1]]).addTo(map); // Access lat and lng using array indices
        console.log('Reached Hee 34');
        markers.push(marker);
        endlatLng.push(L.latLng(point[0], point[1]));
    });



    // Calculate center point
    const centerLat = latLngList.reduce((sum, point) => sum + point[0], 0) / latLngList.length;
    const centerLng = latLngList.reduce((sum, point) => sum + point[1], 0) / latLngList.length;

    console.log(markerdel._latlng);

    console.log(endlatLng);

    // findRoute(markerdel._latlng, endlatLng[0]);
    
    // Set map view to the center point
    map.setView([centerLat, centerLng]);
}

function findRoute(start, end) {
    console.log(`Start Point ${start.lat}, ${start.lng}`);
    console.log(`End Point ${end.lat}, ${end.lng}`);

    routingControl = L.Routing.control({
    waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
    ],
    routeWhileDragging: true
    }).on('routesfound', (e) => {
        console.log(e);
        console.log(e.routes[0].summary);
    })
    .addTo(map);
}


function getRoute(index) {
    if (routingControl) {
        routingControl.removeFrom(map);
    }
    index = parseInt(index)-1
    console.log(latLngList[index][0]);
    console.log(latLngList[index][1]);
    const endpoint =  L.latLng(latLngList[index][0], latLngList[index][1]);
    findRoute(markerdel._latlng, endpoint)
}

function loadPoints2() {
    if (destLat && destLng) {
        var latitude = parseFloat(dellat.value);
        var longitude = parseFloat(dellng.value);
    
        // Define a custom marker icon with the desired color
        var customIcon = L.icon({
            iconUrl: 'https://cdn3.iconfinder.com/data/icons/bold-ui-2/24/artsebasov_profile-512.png', // You can use any marker icon image
            iconSize: [25, 41], // Size of the icon
            iconAnchor: [12, 41], // Anchor point of the icon
            popupAnchor: [1, -34], // Popup anchor point
            // Define the icon's HTML class and set its color
            className: 'custom-marker-icon',
            // Use CSS styles to change the color of the marker icon
            // You can use any valid CSS color value
            // Here, we're using red as an example
            iconStyle: 'color: red;'
        });
    
        // Create a marker with the custom icon
        markerdel = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

        console.log(markerdel);

        for (let i = 0; i < srclat.length; i++) {
            const lat = parseFloat(srclat[i].value);
            const lng = parseFloat(srclng[i].value);
            latLngList.push([lat, lng]);
            console.log(latLngList);
        }

        latLngList.forEach(point => {
            const marker = L.marker([point[0], point[1]]).addTo(map); // Access lat and lng using array indices
            markers.push(marker);
            endlatLng.push(L.latLng(point[0], point[1]));
        });

        // Calculate center point
        const centerLat = latLngList.reduce((sum, point) => sum + point[0], 0) / latLngList.length;
        const centerLng = latLngList.reduce((sum, point) => sum + point[1], 0) / latLngList.length;

        map.setView([centerLat, centerLng]);
    } else {
        console.log('Not Available');
    }
}

window.onload = function() {
    console.log(destLat.length);
    if (destLat.length === 0) {
        console.log("Entered 1");
        loadPoints();
    }else{
        console.log("Entered 2");
        loadPoints2();
    }
};