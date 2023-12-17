async function getAirportData() {
    const response = await fetch('http://127.0.0.1:5000/location/');
    console.log('response', response);
    const data = await response.json();
    console.log('Location data', data);
    return data;
}

var singleMarker = ""; // global marker
var markerClicked = false;

function renderHTML(data) {
    console.log("HELLO");
    const map = L.map('map').setView([data['Latitude'], data['Longitude']], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    singleMarker = L.marker([data['Latitude'], data['Longitude']]);
    singleMarker.addTo(map);
    singleMarker.on('click', function () {
        if (!markerClicked) {
            displayTriviaQuestionOnClick();
            markerClicked = true;
        }
    });
}

var redIcon = new L.Icon({
    iconUrl: 'Pics/red marker icon.png',
    iconSize: [50, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function changeMarkerToRed() {
    singleMarker.setIcon(redIcon);


    singleMarker.bindPopup('<div class="message-body"><p><b>Question already answered. Please proceed to the next one!</b></p></div>').openPopup();
}


async function main() {
    let name = localStorage.getItem("textvalue");
    const locationData = await getAirportData(name);
    console.log('Next Location data:', locationData);
    renderHTML(locationData);
}

setTimeout(main, 100);
