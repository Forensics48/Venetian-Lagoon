function openPopupWindow(popupWindowName) {
    document.getElementById(popupWindowName).style.display = "block";
    document.getElementById('header').style.display = 'none';
}

function closePopupWindow(popupWindowName) {
    document.getElementById(popupWindowName).style.display = "none";
    document.getElementById('header').style.display = 'initial';
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
    document.getElementById("locationMorning").value = position.coords.latitude + ', ' + position.coords.longitude;
}

function openRateWindow(angebotId) {
    document.getElementById('rateForm').style.display = "block";
    document.getElementById('header').style.display = 'none';
    document.getElementById('offer-id').value = angebotId;
}

function closeRateWindow() {
    document.getElementById('rateForm').style.display = "none";
    document.getElementById('header').style.display = 'initial';
}