/*============ SHOW MENU ============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    })
}


let weatherPopupSelector = "#weather-form";
let weatherPopup = document.querySelector(weatherPopupSelector);

let compassSelector = '#compass';
let compassPopup = document.querySelector(compassSelector);

let waterLevelsSelector = '#chart-container';
let waterLevelsPopup = document.querySelector(waterLevelsSelector);



document.addEventListener("click", (e) => {
    closeMenuAndCompass(e);
});

function closeMenuAndCompass(e) {
    const isClosest = e.target.closest(weatherPopupSelector);
    const isClosest2 = e.target.closest(compassSelector);
    const isClosest3 = e.target.closest(waterLevelsSelector);
    // If `isClosest` equals falsy & popup has the class `show`
    // then hide the popup
    if (!isClosest && weatherPopup.style.display == 'initial') {
        weatherPopup.style.display = 'none';
    }

    if(!isClosest2 && compassPopup.style.display == 'block' || e.target.id == 'close-compass') {
        compassPopup.style.display = 'none';
    }

    if(!isClosest3 && waterLevelsPopup.style.display == 'initial') {
        waterLevelsPopup.style.display = 'none';
        myChart.destroy();
    }
}

const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}

navLink.forEach(el => {
    el.addEventListener('click', linkAction);
});

/*============ CHANGE BACKGROUND HEADER ============*/
function scrollHeader() {
    const header = document.getElementById('header');
    if (this.scrollY >= 100) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}

window.addEventListener('scroll', scrollHeader);

/*============ SWIPER DISCOVER ============*/


/*=============== REVIEW SWIPER ===============*/


/*============ VIDEO ============*/
const videoFile = document.getElementById('video-file'),
    videoButton = document.getElementById('video-button'),
    videoIcon = document.getElementById('video-icon');

function playPause() {
    if(videoFile.paused) {
        videoFile.play();
        videoIcon.classList.add('ri-pause-line');
        videoIcon.classList.remove('ri-play-line');
    } else {
        videoFile.pause();
        videoIcon.classList.add('ri-play-line');
        videoIcon.classList.remove('ri-pause-line');
    }
}

videoButton.addEventListener('click', playPause);

function finalVideo() {
    // Video ends, icon changes
    videoIcon.classList.add('ri-play-line');
    videoIcon.classList.remove('ri-pause-line');
}

videoFile.addEventListener('ended', finalVideo);

/*============ SHOW SCROLL UP ============*/
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    if(this.scrollY >= 200) {
        scrollUp.classList.add('show-scroll');
    } else {
        scrollUp.classList.remove('show-scroll');
    }
}

window.addEventListener('scroll', scrollUp);

var userIsLoggedIn = false;
const loginEl = document.getElementById("login");
const loginTextEl = document.getElementById("login-text");

const myAccountEl = document.getElementById('my-account-container');

function isLoggedOut() {
    userIsLoggedIn = false;
    loginEl.classList.remove('ri-logout-box-line');
    loginEl.classList.add('ri-login-box-line');
    loginTextEl.innerHTML = "Einloggen";
    myAccountEl.style.display = 'none';
}

function isLoggedIn() {
    userIsLoggedIn = true;
    loginEl.classList.remove('ri-login-box-line');
    loginEl.classList.add('ri-logout-box-line');
    loginTextEl.innerHTML = "Ausloggen";
    myAccountEl.style.display = 'initial';
}

function onLoginClick() {
    if(userIsLoggedIn) {
        logout();
        isLoggedOut();
    } else {
        window.location.assign('/login.html');
    }
}

function onMyAccountClick() {
    if(userIsLoggedIn) {
        window.location.assign('/user.html');
    } else {
        window.location.assign('/login.html');
    }
}

var currUser;

(async function () {
    await $.ajax({
		type: 'GET',
		url: '/user/isLoggedIn',
		success: function (resultData) {
            if(resultData.loggedIn) {
                isLoggedIn();
            } else {
                isLoggedOut();
            }
        }
	});
    if(userIsLoggedIn) {
        currUser = await getCurrentUser();
    }
})();

picker.on('select', () => {
    updateChoice();
});


function bookBoat() {
    if(currUser) {
        var selectedOfferIndex = document.getElementById('boat-choice').value;
        var selectedBoat = boats[selectedOfferIndex];
        var startDate = new Date(picker.getStartDate());
        var currDate = new Date();
        if(startDate < currDate) {
            alert('Das Datum kann nicht in der Vergangenheit liegen');
            return;
        }
        startDate = startDate.toLocaleString('de', {year: 'numeric', month: '2-digit', day: '2-digit'});
        var endDate = new Date(picker.getEndDate());
        endDate = endDate.toLocaleString('de', {year: 'numeric', month: '2-digit', day: '2-digit'});
        userBookBoat(startDate, endDate, currUser.id, selectedBoat.vendorId, selectedBoat.id);
    } else {
        alert("Sie müssen eingeloggt sein um diese Funktion zu benutzen");
    }
    
}


function updateChoice() {
    if(lastRentMarker != null && lastRentMarker != undefined) {
        rentMap.removeLayer(lastRentMarker);
    }
    var selectedOfferIndex = document.getElementById('boat-choice').value;
    var selectedBoat = boats[selectedOfferIndex];
    let marker = L.marker([selectedBoat.lat, selectedBoat.long], { icon: pierIcon }).addTo(rentMap);
    let popupOutput = `<div class="rentBoatPopup"><h1>${selectedBoat.name}</h1>
    <br>
    <h4>Öffnungszeiten : ${selectedBoat.openingTimes}</h4>
    <h4>Telefon Nummer : ${selectedBoat.phoneNumber}</h4>
    <h4>Webseite : <a href="${selectedBoat.website}">${selectedBoat.website}</a></h4>
    </div>`;
    marker.bindPopup(popupOutput);
    lastRentMarker = marker;
    var startDate = new Date(picker.getStartDate());
    var endDate = new Date(picker.getEndDate());
    var days = Math.round((endDate-startDate)/(1000*60*60*24)) + 1;
    var totalPrice = selectedBoat.price * days;
    document.getElementById('total-price').innerHTML = `Gesamtpreis : ${totalPrice} €`;
}

