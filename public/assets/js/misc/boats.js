const boatOffersEl = document.getElementById('boat-offers');
const boatSelectEl = document.getElementById('boat-choice');
var boats = [];

$.ajax({
    type: 'GET',
    url: '/data/available-boats',
    success: function (resultData) {
        if (resultData) {
            let html = '';
            let html2 = '';

            for (var i = 0; i < resultData.length; i++) {
                let boatName = resultData[i].Name;
                let boatWebsite = resultData[i].Webseite;
                let boatPrice = resultData[i].Mietpreis;
                let boatRating = resultData[i].Durchschnittsbewertung;
                let boatPictureFile = resultData[i].Bild;
                let boatVendorId = resultData[i].anbieter_id;
                let boatOfferId = resultData[i].ID;
                let boatLat = resultData[i].Breitengrad;
                let boatLng = resultData[i].Laengengrad;
                let boatOpeningTimes = resultData[i].Oeffnungszeiten;
                let boatPhoneNumber = resultData[i].Telefon;
                var boat = {id: boatOfferId, name: boatName, website: boatWebsite, price: boatPrice, rating: boatRating, vendorId: boatVendorId, picture: boatPictureFile, lat: boatLat, long: boatLng, phoneNumber: boatPhoneNumber, website: boatWebsite, openingTimes: boatOpeningTimes};
                boats.push(boat);

                html += `<div class="place__card swiper-slide">
                    <img src="/assets/img/boats/${boatPictureFile}" alt="" class="place__img">

                    <div class="place__content">`;

                    if(boatRating) {
                        html += `
                            <span class="place__rating">
                            <i class="ri-star-line place__rating-icon"></i>
                            <span class="place__rating-number">${boatRating}</span>
                        `;
                    } else {
                        html += `<span class="place__rating" style="padding: 0px">`;
                    }

                    
                        html += 
                        `</span><div class="place__data">
                            <h3 class="place__title">
                                ${boatName}
                            </h3>
                            <br>
                            <span class="place__price">${boatPrice} € / pro Tag</span>
                        </div>
                    </div>

                    <a class="button button--flex place__button" href="${boatWebsite}" target="_blank">
                        <i class="ri-arrow-right-line"></i>
                    </a>
                </div>`;

                html2 += `<option value="${i}">${boatName}</option>`;
            }

            boatOffersEl.innerHTML = html;
            boatSelectEl.innerHTML = html2;
            document.getElementById('boat-choice').dispatchEvent(new Event('change'));

            let boatSwiper = new Swiper(".boats-swiper", {
                effect: "coverflow",
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: "auto",
                loop: 'true',
                coverflowEffect: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                }
            });
        }
    }
});
