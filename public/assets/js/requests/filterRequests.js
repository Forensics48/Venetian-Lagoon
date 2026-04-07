var restaurantMarkers = [];

async function restaurantsFilter() {
    var restaurantsCheckBox = document.getElementById("checkbox-restaurants");
    var data;

    if (restaurantsCheckBox.checked === true) {
        await $.ajax({
            type: 'GET',
            url: '/data/restaurants',
            success: function (resultData) {
                if (resultData) {
                    data = resultData;
                }
            }
        });
        console.log(data);
        if (data) {
            for (var i = 0; i < data.length; i++) {
                let lat = data[i].Breitengrad;
                let lng = data[i].Laengengrad;
                let name = data[i].Name;
                let website = data[i].Webseite;
                let phoneNumber = data[i].Telefon;
                let openingTimes = data[i].Oeffnungszeiten;
                let id = data[i].id;
                let comments = await getPointComments(id);

                openingTimes = openingTimes.replace(',', '<br>');

                var restaurantIcon = L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3170/3170733.png',
                    iconSize: [25, 25],
                    popupAnchor: [0, -15]
                });

                let marker = L.marker([lat, lng], { icon: restaurantIcon }).addTo(locationsMap);

                let popupOutput =
                    `
                    <div class="tabs" id="marker${i}">
                    <div class="tab" id="tab-1">
                    <div class="content">
    
                    <h1>${name}</h1><br><i class="ri-pages-line"></i> <a href="${website}" target="blank">Webseite</a></a><br><i class="ri-phone-line"></i>${phoneNumber}<br><br><b>Öffnungszeiten:</b><br>${openingTimes}<br/>
    
                    </div>
                    </div>
                    <div class="tab" id="tab-2">
                    <div class="content">
                    `;

                if (comments && comments.length >= 0) {
                    for (let j = 0; j < comments.length; j++) {
                        let display = 'initial';
                        if (j != 0) {
                            display = 'none';
                        }
                        popupOutput +=

                            `
                            <input type="hidden" id="${id}-current-comment-index" value="0">
                            <input type="hidden" id="${id}-comments-length" value="${comments.length}">
                            <div class="comment" id="point-comment-${id}-${j}" style="display: ${display}">
                            <div class="comment__user">
                            <img src="assets/img/profilepics/${comments[j].profilbild}" class="user__picture">
                            <h5 class="user__name">${comments[j].Name}</h5>
                            <h5 class="comment__date">${comments[j].datum}</h5>
                            </div>
                            <h3 class="comment__text">${comments[j].comment}</h3>
                            </div>
                            <div class="comment-button-next comment-button" onclick="nextComment(${id}, true)"><i class="ri-arrow-right-line"></i></div><div class="comment-button-prev comment-button" onclick="nextComment(${id}, false)"><i class="ri-arrow-left-line"></i></div>
                            `;
                    }
                }

                popupOutput += `
                <div class="comment__write">
                <textarea rows="4" class="comment__input" id="${id}-comment-text" placeholder="Rezension schreiben.."></textarea>
                <a onclick="addComment(${id})" class="comment__send">Abschicken</a>
                </div>
                </div>
                </div>
                <ul class="tabs-link">
                <li class="tab-link"> <a id="tab-link-1"><span>Info</span></a></li>
                <li class="tab-link"> <a id="tab-link-2"><span>Erfahrungsberichte</span></a></li>
                </ul>
                </div>`;

                marker.bindPopup(popupOutput);
                restaurantMarkers.push(marker);
            }
        }

    } else {
        restaurantMarkers.forEach(marker => {
            locationsMap.removeLayer(marker);
        });
    }
}

var islandMarkers = [];
async function islandsFilter() {
    var islandsCheckBox = document.getElementById("checkbox-islands");
    let data;
    if (islandsCheckBox.checked === true) {
        await $.ajax({
            type: 'GET',
            url: '/data/islands',
            success: function (resultData) {
                if (resultData) {
                    data = resultData;
                }
            }
        });
        if (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                let lat = data[i].Breitengrad;
                let lng = data[i].Laengengrad;
                let name = data[i].Name;
                let description = data[i].Beschreibung;
                let rating = await getIslandRating(name);
                var islandIcon = L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/7229/7229726.png',
                    iconSize: [25, 25],
                    popupAnchor: [0, -15]
                });

                let marker = L.marker([lat, lng], { icon: islandIcon }).addTo(locationsMap);

                let popupOutput = '<h1>' + name + '</h1>';
                popupOutput +=
                    '<div id="star-rating"><fieldset class="rating">' +
                    '<input type="hidden" id="island-name" value="' + name + '">' +
                    '<input type="radio" id="star5" name="rating" value="5"/><label for="star5" class="star full" title="Awesome"></label>' +
                    '<input type="radio" id="star4.5" name="rating" value="4.5"/><label for="star4.5" class="star half"></label>' +
                    '<input type="radio" id="star4" name="rating" value="4"/><label for="star4" class="star full"></label>' +
                    '<input type="radio" id="star3.5" name="rating" value="3.5"/><label for="star3.5" class="star half"></label>' +
                    '<input type="radio" id="star3" name="rating" value="3"/><label for="star3" class="star full"></label>' +
                    '<input type="radio" id="star2.5" name="rating" value="2.5"/><label for="star2.5" class="star half"></label>' +
                    '<input type="radio" id="star2" name="rating" value="2"/><label for="star2" class="star full"></label>' +
                    '<input type="radio" id="star1.5" name="rating" value="1.5"/><label for="star1.5" class="star half"></label>' +
                    '<input type="radio" id="star1" name="rating" value="1"/><label for="star1" class="star full"></label>' +
                    '<input type="radio" id="star0.5" name="rating" value="0.5"/><label for="star0.5" class="star half"></label>' +
                    '</fieldset><h4>(' + rating + ')</h4></div>';

                popupOutput += '<p>' + description + '</p>';

                marker.bindPopup(popupOutput);
                islandMarkers.push(marker);
            }
        }
    } else {
        islandMarkers.forEach(marker => {
            locationsMap.removeLayer(marker);
        });
    }
}
var ratingsArr = [];
function getComments() {

    $.ajax({
        type: 'GET',
        url: '/data/ratings',
        success: function (ratings) {
            for (var i = 0; i < ratings.length; i++) {
                ratings[i].addTo(ratingsArr);
            }
        }
    })
}

var landingMarkers = [];
async function landingsFilter() {
    var landingsCheckBox = document.getElementById("checkbox-landings");
    var data;

    if (landingsCheckBox.checked === true) {
        await $.ajax({
            type: 'GET',
            url: '/data/landings',
            success: function (resultData) {
                if (resultData) {
                    data = resultData;
                }
            }
        });

        if (data) {
            for (var i = 0; i < data.length; i++) {
                let lat = data[i].Breitengrad;
                let lng = data[i].Laengengrad;
                let name = data[i].Name;
                let island = data[i].Insel;
                let length = data[i].Max_Boot_Laenge;
                let numberLandings = data[i].Anzahl_Liegeplaetze;
                let id = data[i].id;
                let comments = await getPointComments(id);

                var landingIcon = L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/314/314278.png',
                    iconSize: [25, 25],
                    popupAnchor: [0, -15]
                });

                let marker = L.marker([lat, lng], { icon: landingIcon }).addTo(locationsMap);

                let popupOutput = `
                <div class="tabs" id="marker${i}">
                <div class="tab" id="tab-1">
                <div class="content">                  
                <h1>${name}</h1><br><b>Insel: </b>${island}
                <br><br><b>Max. Bootslänge: </b>${length}m
                <br><b>Anzahl Liegeplätze: </b>${numberLandings}
                </div>
                </div>
                <div class="tab" id="tab-2">
                <div class="content">
                `;

                if (comments && comments.length >= 0) {
                    for (let j = 0; j < comments.length; j++) {
                        let display = 'initial';
                        if (j != 0) {
                            display = 'none';
                        }
                        popupOutput +=

                            `
                        <input type="hidden" id="${id}-current-comment-index" value="0">
                        <input type="hidden" id="${id}-comments-length" value="${comments.length}">
                        <div class="comment" id="point-comment-${id}-${j}" style="display: ${display}">
                        <div class="comment__user">
                        <img src="assets/img/profilepics/${comments[j].profilbild}" class="user__picture">
                        <h5 class="user__name">${comments[j].Name}</h5>
                        <h5 class="comment__date">${comments[j].datum}</h5>
                        </div>
                        <h3 class="comment__text">${comments[j].comment}</h3>
                        </div>
                        <div class="comment-button-next comment-button" onclick="nextComment(${id}, true)"><i class="ri-arrow-right-line"></i></div><div class="comment-button-prev comment-button" onclick="nextComment(${id}, false)"><i class="ri-arrow-left-line"></i></div>
                        `;
                    }
                }


                popupOutput += `
                <div class="comment__write">
                <textarea rows="4" class="comment__input" id="${id}-comment-text" placeholder="Rezension schreiben.."></textarea>
                <a onclick="addComment(${id})" class="comment__send">Abschicken</a>
                </div>
                </div>
                </div>
                <ul class="tabs-link">
                <li class="tab-link"> <a id="tab-link-1"><span>Info</span></a></li>
                <li class="tab-link"> <a id="tab-link-2"><span>Erfahrungsberichte</span></a></li>
                </ul>
                </div>`;


                marker.bindPopup(popupOutput);
                landingMarkers.push(marker);
            }
        }
    } else {
        landingMarkers.forEach(marker => {
            locationsMap.removeLayer(marker);
        });
    }
}


var supermarketMarkers = [];
async function supermarketsFilter() {
    var supermarketsCheckBox = document.getElementById("checkbox-supermarkets");
    var data;

    if (supermarketsCheckBox.checked === true) {
        await $.ajax({
            type: 'GET',
            url: '/data/supermarkets',
            success: function (resultData) {
                if (resultData) {
                    data = resultData;
                }
            }
        });
        if (data) {
            for (var i = 0; i < data.length; i++) {
                let lat = data[i].Breitengrad;
                let lng = data[i].Laengengrad;
                let name = data[i].Name;
                let island = data[i].Insel;
                let id = data[i].id;
                let comments = await getPointComments(id);

                var supermarketIcon = L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/7499/7499863.png',
                    iconSize: [25, 25],
                    popupAnchor: [0, -15]
                });

                let marker = L.marker([lat, lng], { icon: supermarketIcon }).addTo(locationsMap);

                let popupOutput = `
                <div class="tabs" id="marker${i}">
                <div class="tab" id="tab-1">
                <div class="content">                  
                <h1>${name}</h1><br><b>Insel: </b>${island}
                </div>
                </div>
                <div class="tab" id="tab-2">
                <div class="content">
                `;

                if (comments && comments.length >= 0) {
                    for (let j = 0; j < comments.length; j++) {
                        let display = 'initial';
                        if (j != 0) {
                            display = 'none';
                        }
                        popupOutput +=

                            `
                        <input type="hidden" id="${id}-current-comment-index" value="0">
                        <input type="hidden" id="${id}-comments-length" value="${comments.length}">
                        <div class="comment" id="point-comment-${id}-${j}" style="display: ${display}">
                        <div class="comment__user">
                        <img src="assets/img/profilepics/${comments[j].profilbild}" class="user__picture">
                        <h5 class="user__name">${comments[j].Name}</h5>
                        <h5 class="comment__date">${comments[j].datum}</h5>
                        </div>
                        <h3 class="comment__text">${comments[j].comment}</h3>
                        </div>
                        <div class="comment-button-next comment-button" onclick="nextComment(${id}, true)"><i class="ri-arrow-right-line"></i></div><div class="comment-button-prev comment-button" onclick="nextComment(${id}, false)"><i class="ri-arrow-left-line"></i></div>
                        `;
                    }
                }

                popupOutput += `
                <div class="comment__write">
                <textarea rows="4" class="comment__input" id="${id}-comment-text" placeholder="Rezension schreiben.."></textarea>
                <a onclick="addComment(${id})" class="comment__send">Abschicken</a>
                </div>
                </div>
                </div>
                <ul class="tabs-link">
                <li class="tab-link"> <a id="tab-link-1"><span>Info</span></a></li>
                <li class="tab-link"> <a id="tab-link-2"><span>Erfahrungsberichte</span></a></li>
                </ul>
                </div>`;

                marker.bindPopup(popupOutput);
                supermarketMarkers.push(marker);
            }
        }
    } else {
        supermarketMarkers.forEach(marker => {
            locationsMap.removeLayer(marker);
        });
    }
}


var attractionMarkers = [];
async function attractionsFilter() {
    var attractionsCheckBox = document.getElementById("checkbox-attractions");
    var data;

    if (attractionsCheckBox.checked === true) {
        await $.ajax({
            type: 'GET',
            url: '/data/attractions',
            success: function (resultData) {
                if (resultData) {
                    data = resultData;
                }
            }
        });

        if (data) {
            for (var i = 0; i < data.length; i++) {
                let lat = data[i].Breitengrad;
                let lng = data[i].Laengengrad;
                let name = data[i].Name;
                let island = data[i].Insel;
                let id = data[i].id;
                let comments = getPointComments(id);

                var attractionIcon = L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3237/3237420.png',
                    iconSize: [25, 25],
                    popupAnchor: [0, -15]
                });

                let marker = L.marker([lat, lng], { icon: attractionIcon }).addTo(locationsMap);

                let popupOutput = `
                <div class="tabs" id="marker${i}">
                <div class="tab" id="tab-1">
                <div class="content">                  
                <h1>${name}</h1><br><b>Insel: </b>${island}
                </div>
                </div>
                <div class="tab" id="tab-2">
                <div class="content">
                `;

                if (comments && comments.length >= 0) {
                    for (let j = 0; j < comments.length; j++) {
                        let display = 'initial';
                        if (j != 0) {
                            display = 'none';
                        }
                        popupOutput +=

                            `
                        <input type="hidden" id="${id}-current-comment-index" value="0">
                        <input type="hidden" id="${id}-comments-length" value="${comments.length}">
                        <div class="comment" id="point-comment-${id}-${j}" style="display: ${display}">
                        <div class="comment__user">
                        <img src="assets/img/profilepics/${comments[j].profilbild}" class="user__picture">
                        <h5 class="user__name">${comments[j].Name}</h5>
                        <h5 class="comment__date">${comments[j].datum}</h5>
                        </div>
                        <h3 class="comment__text">${comments[j].comment}</h3>
                        </div>
                        <div class="comment-button-next comment-button" onclick="nextComment(${id}, true)"><i class="ri-arrow-right-line"></i></div><div class="comment-button-prev comment-button" onclick="nextComment(${id}, false)"><i class="ri-arrow-left-line"></i></div>
                        `;
                    }
                }

                popupOutput += `
                <div class="comment__write">
                <textarea rows="4" class="comment__input" id="${id}-comment-text" placeholder="Rezension schreiben.."></textarea>
                <a onclick="addComment(${id})" class="comment__send">Abschicken</a>
                </div>
                </div>
                </div>
                <ul class="tabs-link">
                <li class="tab-link"> <a id="tab-link-1"><span>Info</span></a></li>
                <li class="tab-link"> <a id="tab-link-2"><span>Erfahrungsberichte</span></a></li>
                </ul>
                </div>`;

                marker.bindPopup(popupOutput);
                attractionMarkers.push(marker);
            }
        }
    } else {
        attractionMarkers.forEach(marker => {
            locationsMap.removeLayer(marker);
        });
    }
}


var swimmingPlacesMarkers = [];
async function swimmingPlacesFilter() {
    var swimmingPlacesCheckBox = document.getElementById("checkbox-swimmingPlaces");
    var data;

    if (swimmingPlacesCheckBox.checked === true) {
        await $.ajax({
            type: 'GET',
            url: '/data/swimming-places',
            success: function (resultData) {
                if (resultData) {
                    data = resultData;
                }
            }
        });

        for (var i = 0; i < data.length; i++) {
            let lat = data[i].Breitengrad;
            let lng = data[i].Laengengrad;
            let name = data[i].Name;
            let island = data[i].Insel;
            let id = data[i].id;
            let comments = await getPointComments(id);

            var swimmingPlaceIcon = L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/186/186192.png',
                iconSize: [25, 25],
                popupAnchor: [0, -15]
            });

            let marker = L.marker([lat, lng], { icon: swimmingPlaceIcon }).addTo(locationsMap);

            let popupOutput = `
            <div class="tabs" id="marker${i}">
            <div class="tab" id="tab-1">
            <div class="content">                  
            <h1>${name}</h1><br><b>Insel: </b>${island}
            </div>
            </div>
            <div class="tab" id="tab-2">
            <div class="content">
            `;

            if (comments && comments.length >= 0) {
                for (let j = 0; j < comments.length; j++) {
                    let display = 'initial';
                    if (j != 0) {
                        display = 'none';
                    }
                    popupOutput +=

                        `
                    <input type="hidden" id="${id}-current-comment-index" value="0">
                    <input type="hidden" id="${id}-comments-length" value="${comments.length}">
                    <div class="comment" id="point-comment-${id}-${j}" style="display: ${display}">
                    <div class="comment__user">
                    <img src="assets/img/profilepics/${comments[j].profilbild}" class="user__picture">
                    <h5 class="user__name">${comments[j].Name}</h5>
                    <h5 class="comment__date">${comments[j].datum}</h5>
                    </div>
                    <h3 class="comment__text">${comments[j].comment}</h3>
                    </div>
                    <div class="comment-button-next comment-button" onclick="nextComment(${id}, true)"><i class="ri-arrow-right-line"></i></div><div class="comment-button-prev comment-button" onclick="nextComment(${id}, false)"><i class="ri-arrow-left-line"></i></div>
                    `;
                }
            }

            popupOutput += `
            <div class="comment__write">
            <textarea rows="4" class="comment__input" id="${id}-comment-text" placeholder="Rezension schreiben.."></textarea>
            <a onclick="addComment(${id})" class="comment__send">Abschicken</a>
            </div>
            </div>
            </div>
            <ul class="tabs-link">
            <li class="tab-link"> <a id="tab-link-1"><span>Info</span></a></li>
            <li class="tab-link"> <a id="tab-link-2"><span>Erfahrungsberichte</span></a></li>
            </ul>
            </div>`;

            marker.bindPopup(popupOutput);
            swimmingPlacesMarkers.push(marker);
        }
    } else {
        swimmingPlacesMarkers.forEach(marker => {
            locationsMap.removeLayer(marker);
        });
    }
}

async function getIslandRating(name) {
    let result;
    await $.ajax({
        type: 'GET',
        url: '/data/island-rating',
        success: function (resultData) {
            if (resultData) {
                for (var i = 0; i < resultData.length; i++) {
                    if (name === resultData[i].Insel) {
                        result = resultData[i].Durchschnittsbewertung;
                    }
                }
            }
        }
    });
    return result;
}

async function getPointComments(pointId) {
    let result;
    await $.ajax({
        type: 'POST',
        url: '/data/user-comments',
        data: { pointId },
        success: function (resultData) {
            if (resultData) {
                result = resultData;
            }
        }
    });
    return result;
}

function addIslandRating(name, userId, rating) {
    $.ajax({
        type: 'POST',
        url: '/user/addIslandRating',
        data: { islandName: name, userId, islandRating: rating },
        success: function (resultData) {
            if (resultData) {
                alert("Ihre Bewertung wurde erfolgreich hinzugefügt");
            }
        }
    });
}

function addComment(pointId) {
    let comment = document.getElementById(pointId + '-comment-text').value;
    if (currUser) {
        let userId = currUser.id;
        console.log(comment);
        console.log(userId);

        $.ajax({
            type: 'POST',
            url: '/user/addComment',
            data: { pointId, userId, comment },
            success: function (resultData) {
                if (resultData) {
                    alert("Ihre Bewertung wurde erfolgreich hinzugefügt");
                }
            }
        });

    } else {
        alert("Sie müssen eingeloggt sein um diese Funktion zu benutzen.");
        return;
    }
}

$('#mapid').on('click', '.rating .star', function (e) {
    let starName = e.currentTarget.htmlFor;
    const selectedStarEl = document.getElementById(starName);
    let islandNameEl = document.getElementById('island-name');
    addIslandRating(islandNameEl.value, currUser.id, selectedStarEl.value)
});

$('#mapid').on('click', '.tabs .tabs-link .tab-link #tab-link-2', function (e) {
    const tab1El = document.getElementById('tab-1');
    const tab2El = document.getElementById('tab-2');
    tab2El.style.display = 'block';
    tab1El.style.display = 'none';
});

$('#mapid').on('click', '.tabs .tabs-link .tab-link #tab-link-1', function () {
    const tab1El = document.getElementById('tab-1');
    const tab2El = document.getElementById('tab-2');
    tab1El.style.display = 'block';
    tab2El.style.display = 'none';
});

function nextComment(pointId, goUp) {
    let currentIndexEl = document.getElementById(pointId + '-current-comment-index');
    let currCommentIndex = currentIndexEl.value;
    let oldCommentEl = document.getElementById(`point-comment-${pointId}-${currCommentIndex}`);
    let maxCommentsEl = document.getElementById(`${pointId}-comments-length`);
    let maxCommentsAmount = maxCommentsEl.value - 1;
    if (goUp) {
        if (currCommentIndex < maxCommentsAmount) {
            currCommentIndex++;
            currentIndexEl.value = currCommentIndex;
        } else {
            return;
        }
    } else {
        if (currCommentIndex > 0) {
            currCommentIndex--;
            currentIndexEl.value = currCommentIndex;
        } else {
            return;
        }
    }
    let newCommentEl = document.getElementById(`point-comment-${pointId}-${currCommentIndex}`);
    newCommentEl.style.display = 'initial';
    oldCommentEl.style.display = 'none';
}
