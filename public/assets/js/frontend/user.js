const showSettingsEl = document.getElementById('show-settings');
const userSettingsEl = document.getElementById('user-settings');
const userEmailEl = document.getElementById('user-email');
const userNameEl = document.getElementById('user-name');

const currPasswordEl = document.getElementById('current-password');
const newPasswordEl = document.getElementById('new-password');
const newPasswordRepeatEl = document.getElementById('new-password-repeat');

const pfpEl = document.getElementById('profile-picture-file');
const userPfpEl = document.getElementById('user-profile-picture');
const boatInputEl = document.getElementById('boat-img-input');
const offerImgEl = document.getElementById('offer-img');

showSettingsEl.addEventListener('click', function () {
    if (userSettingsEl.style.display === 'flex') {
        userSettingsEl.style.display = 'none';
    } else {
        userSettingsEl.style.display = 'flex';
    }
});

var currUser;

(async function () {
    currUser = await getCurrentUser();
    getLogBooks(currUser.id);
    getUserBookings(currUser);
    let menuTabs = document.getElementById('user-tabs');
    let title = document.getElementById('bookings-title');
    
    if(currUser.isVendor) {
        menuTabs.innerHTML = `<li data-tab-target="#reservierungen" class="tab2 active">Angebote</li>
        <li data-tab-target="#bootangebot" class="tab2">Boot anbieten</li>`;
        title.innerHTML = 'Meine Angebote';
    } else {
        menuTabs.innerHTML = `<li data-tab-target="#reservierungen" class="tab2 active">Reservierungen</li>
        <li data-tab-target="#logbooks" class="tab2">Logbücher</li>`;
        title.innerHTML = 'Meine Reservierungen';
    }
    
    const tabs = document.querySelectorAll('[data-tab-target]')
    const tabContents = document.querySelectorAll('[data-tab-content]')
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.tabTarget)
            tabContents.forEach(tabContent => {
                tabContent.classList.remove('active')
            })
            tabs.forEach(tab => {
                tab.classList.remove('active')
            })
            tab.classList.add('active')
            target.classList.add('active')
        })
    })

    userEmailEl.value = currUser.email;
    userNameEl.innerHTML = currUser.name;
    userPfpEl.src = './assets/img/profilepics/' + currUser.pfp;
})();

function readURL(input) {
    if (!(input.files && input.files[0])) {
        return;
    }
    if (input.id == 'boat-img-input') {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#offer-img').attr('src', e.target.result).height(230);
            offerImgEl.style.display = 'initial';
        };

        reader.readAsDataURL(input.files[0]);

    } else if (input.id == 'profile-picture-file') {
        var reader = new FileReader();

        reader.onload = function (e) {
            userPfpEl.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function uploadNewPfpPicture() {
    if (pfpEl.files[0] != undefined && pfpEl.files[0] != null) {
        var pfpFileName = 'user-' + currUser.id + '.jpg';
        uploadImage(pfpEl.files[0], pfpFileName, 'profilepics');
        updateProfilePicture(pfpFileName, currUser.id);
    }
}

function changeUserPassword() {
    var oldPassword = currPasswordEl.value;
    var newPassword = newPasswordEl.value;
    var newPasswordRepeat = newPasswordRepeatEl.value;

    if (oldPassword == '' || newPassword == '' || newPasswordRepeat == '') {
        return;
    }

    if (newPassword != newPasswordRepeat) {
        alert("Passwörter stimmen nicht überein");
        return;
    }

    changePassword(oldPassword, newPassword);
}

function saveNewSettings() {
    uploadNewPfpPicture();
    changeUserPassword();
    alert("Die Einstellungen wurden erfolgreich gespeichert.");
}

function openNewPictureDialog() {
    pfpEl.click();
}

function addOffer() {
    const offerBoatNameEl = document.getElementById('offer-boat-name');
    const offerWebsiteEl = document.getElementById('offer-website');
    const offerPhoneNumberEl = document.getElementById('offer-phone-number');
    const offerLatitudeEl = document.getElementById('offer-latitude');
    const offerLongitudeEl = document.getElementById('offer-longitude');
    const offerDailyPriceEl = document.getElementById('offer-daily-price');
    const offerOpeningTimeEl = document.getElementById('offer-opening-time');
    var boatImageName = 'user-' + currUser.id + '-boat-' + offerBoatNameEl.value + '.jpg';
    boatImageName = boatImageName.replace(' ', '-');
    addBoatOffer(offerBoatNameEl.value, offerWebsiteEl.value, offerPhoneNumberEl.value, offerLatitudeEl.value, offerLongitudeEl.value, offerDailyPriceEl.value, offerOpeningTimeEl.value, boatImageName, currUser.id);
    uploadImage(boatInputEl.files[0], boatName, 'boats');
    offerBoatNameEl.value = '';
    offerWebsiteEl.value = '';
    offerPhoneNumberEl.value = '';
    offerLatitudeEl.value = '';
    offerLongitudeEl.value = '';
    offerDailyPriceEl.value = '';
    offerOpeningTimeEl.value = '';
    offerImgEl.style.display = 'none';
}

function addLogbook() {
    const logbookDate = document.getElementById('date');
    const logbookLocationMorning = document.getElementById('locationMorning');
    const logbookLocationEvening = document.getElementById('locationEvening');
    addUserLogbook(currUser.id, logbookDate.value, logbookLocationMorning.value, logbookLocationEvening.value);
}

var submitCommentForm = document.getElementById('submit-comment');
submitCommentForm.addEventListener('click', addTestimonial, false);

function addTestimonial(e) {
    e.preventDefault();
    var userComment = document.getElementById('user-comment').value;
    addUserTestimonial(userComment, currUser.id);
    alert("Ihre Kommentar wurde erfolgreich hinzugefügt.");
}

$('#star-rating').on('click', '.rating .star', function (e) {
    let starName = e.currentTarget.htmlFor;
    const selectedStarEl = document.getElementById(starName);
    const offerIdEl = document.getElementById('offer-id');
    addUserOfferRating(offerIdEl.value, currUser.id, selectedStarEl.value);
});