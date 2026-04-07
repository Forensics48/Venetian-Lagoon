var customControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('i');
        container.id = 'compass-button';
        container.classList.add('ri-compass-line');
        container.style.fontSize = '1.3rem';
        container.style.border = '2px solid rgba(0,0,0,0.2)';
        container.style.backgroundColor = 'white';
        container.style.backgroundSize = "30px 30px";
        container.style.width = '34px';
        container.style.height = '34px';
        container.style.borderRadius = '4px';
        container.style.color = 'black';

        container.onmouseover = function () {
            container.style.cursor = 'pointer';
            container.style.backgroundColor = '#f4f4f4';

        }
        container.onmouseout = function () {
            container.style.backgroundColor = 'white';
        }

        container.onclick = function () {
            showCompass();
        }

        return container;
    }
});

var customControl2 = L.Control.extend({
    onAdd: function (map) {
        var container = L.DomUtil.create('i');
        container.id = 'close-route';
        container.classList.add('ri-close-fill');
        container.style.display = 'none';
        container.style.position = 'absolute';
        container.style.right = '0.75rem';
        container.style.top = '0.5rem';
        container.style.zIndex = '999';
        container.style.fontSize = '1.3rem';
        container.style.width = '34px';
        container.style.height = '34px';
        container.style.borderRadius = '4px';
        container.style.color = 'black';

        container.onmouseover = function () {
            container.style.cursor = 'pointer';
            container.style.color = 'red';
        }
        container.onmouseout = function () {
            container.style.color = 'black';
        }

        container.onclick = function () {
            closeRoute();
        }

        return container;
    }
});

/*============ LOCATIONS MAP ============*/
var locationsMap = L.map('mapid').setView([45.40783, 12.29167], 11);
var southWest = L.latLng(40.712, -74.227),
    northEast = L.latLng(40.774, -74.125),
    bounds = L.latLngBounds(southWest, northEast);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    minZoom: 3,
    id: 'mapbox/outdoors-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'YOUR_MAPBOX_TOKEN',
    className: 'map-tiles',
    maxBounds: bounds   // Then add it here..
}).addTo(locationsMap);

L.control.locate({
    strings: {
        title: "Location",
        popup: "Sie befinden sich innerhalb von 1800 Metern von diesem Punkt"
    }
}).addTo(locationsMap);

L.control.scale({
    metric: true,
    imperial: false,
    position: 'bottomright'
}).addTo(locationsMap);

locationsMap.addControl(new L.Control.Fullscreen());
locationsMap.addControl(new customControl());
locationsMap.addControl(new customControl2());

/*============ RENT MAP ============*/
var rentMap = L.map('rent-map').setView([45.40783, 12.29167], 11);
var lastRentMarker;

var pierIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/7672/7672869.png',
    iconSize: [25, 25],
    popupAnchor: [0, -15]
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'YOUR_MAPBOX_TOKEN'
}).addTo(rentMap);

function showCompass() {
    setTimeout(() => {
        if (compass.style.display == 'none') {
            compass.style.display = 'block';
            document.getElementById('header').style.display = 'none';
        }
    }, 200);
}

var coords1;
var control;
locationsMap.addLayer(new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));	//base layer
locationsMap.addControl(new L.Control.Search({
    url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
    jsonpParam: 'json_callback',
    propertyName: 'display_name',
    propertyLoc: ['lat', 'lon'],
    marker: false,
    autoCollapse: true,
    autoType: false,
    minLength: 2
}).on('search:locationfound', function (e) {
    coords1 = e.latlng;
}));

locationsMap.addControl(new L.Control.Search({
    url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
    jsonpParam: 'json_callback',
    propertyName: 'display_name',
    propertyLoc: ['lat', 'lon'],
    marker: false,
    autoCollapse: true,
    autoType: false,
    minLength: 2
}).on('search:locationfound', function (e) {
    if (coords1) {
        closeRoute();
        drawRoute(coords1, e.latlng);
    } else {
        coords1 = e.latlng;
    }
}));

function closeRoute() {
    if (control) {
        document.getElementById('close-route').style.display = 'none';
        locationsMap.removeControl(control);
    }
}

function drawRoute(coords1, coords2) {
    document.getElementById('close-route').style.display = 'initial';
    control = L.Routing.control({
        waypoints: [
            L.latLng(coords1.lat, coords1.lng),
            L.latLng(coords2.lat, coords2.lng)
        ],
        routeWhileDragging: true,
        useZoomParameter: true
    }).addTo(locationsMap);
}