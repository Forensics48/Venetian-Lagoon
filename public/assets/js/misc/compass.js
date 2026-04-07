function readAlignment(event) {
    var angleAlpha = Math.round(event.alpha * 100) / 100;
    var angleBeta = Math.round(event.beta * 100) / 100;
    var angleGamma = Math.round(event.gamma * 100) / 100;
    document.getElementById('datenAlpha').innerHTML = angleAlpha;
    document.getElementById('datenBeta').innerHTML = angleBeta;
    document.getElementById('datenGamma').innerHTML = angleGamma;
    document.getElementById("kompass").style.webkitTransform = "rotate(" + angleAlpha + "deg)";
}

window.onload = function() {
    window.addEventListener("deviceorientation", readAlignment, false);
}