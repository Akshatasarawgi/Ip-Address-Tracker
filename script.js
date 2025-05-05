
const apiUrl = "http://localhost:3000/api/ip";

const givenIp = document.querySelector('.IP-address');
const searchBTn = document.querySelector('.submit-button');

let map;
let marker;

async function checkIpAddress(ip = '') {
    try { 
        const url = ip ? `${apiUrl}?ip=${ip}` : apiUrl;
        const response = await fetch(url);
        const data = await response.json();
    console.log(data);

if (data.code === 422 || !data.location) {
        alert("Invalid IP address or domain. Please try again.");
        return;
}
   document.getElementById("ip-address").textContent = data.ip;
   document.getElementById("location").innerHTML = `${data.location.city}, ${data.location.region }, ${data.location.country}`;
   document.getElementById("timezone").textContent = data.location.timezone;
   document.getElementById("isp").textContent = data.isp;

   const { lat, lng } = data.location;
   const customIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [38, 45],
    iconAnchor: [19, 45],
    popupAnchor: [0, -40]
});

if (!data.location) {
    alert("Invalid data: Location missing");
    return;
  }
   if(!map) {
    map = L.map("map").setView([lat, lng],13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    marker = L.marker([lat,lng], { icon: customIcon}).addTo(map);
   } else {
    map.setView([lat,lng],13);
    marker.setLatLng([lat,lng]);
    marker.setIcon(customIcon);
   }
} 
catch(error) {
    console.error('Failed to fetch IP info:',error);
}
}

searchBTn.addEventListener('click', () => {
    const ipValue = givenIp.value.trim();
    if(ipValue) {
    checkIpAddress(ipValue); 
    }
});

givenIp.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBTn.click();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    checkIpAddress(); 
});
