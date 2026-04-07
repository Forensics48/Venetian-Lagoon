$.ajax({
    type: 'GET',
    url: '/data/island-rating',
    success: function (resultData) {
        if (resultData) {
            let html = '<div class="swiper-wrapper">';
            var index;
            if(resultData.length > 10){
                index = 10;
            }
            else{
                index = resultData.length;
            }

            for (var i = 0; i < index; i++) {
                let island = resultData[i].Insel;
                let rating = resultData[i].Durchschnittsbewertung;
                let description = resultData[i].Kurzbeschreibung;

                html += `<div class="discover__card swiper-slide">
                            <span class="discover__rating">
                                <i class="ri-star-line place__rating-icon"></i>
                                <span class="discover__rating-number">` + rating + `</span>
                            </span>
                            <a href="/`+ island + `.html"> 
                            <img src="/assets/img/islands/` + island + `.jpg" alt="" class="discover__img">
                            </a>
                        <div class="discover__data">
                            <h2 class="discover__title">` + island + `</h2>
                            <span class="discover__description">
                                Bekannt für: ` + description +
                            `</span>
                        </div>
                    </div>`;
            }

            html += '</div>';
            let slider = document.getElementById('containerSlider');
            slider.innerHTML = html;

            var swiper = new Swiper(".discover__container", {
                effect: "coverflow",
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: "auto",
                coverflowEffect: {
                    rotate: 20
                },
                loop: true
            });
        }
    }
});
