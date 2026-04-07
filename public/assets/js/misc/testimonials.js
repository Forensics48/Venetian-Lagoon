const userTestimonialsEl = document.getElementById('user-testimonials');

$.ajax({
    type: 'GET',
    url: '/data/user-testimonials',
    success: function (resultData) {
        if (resultData) {            
            let html = '';

            for (var i = 0; i < resultData.length; i++) {
                let userName = resultData[i].Name;
                let userText = resultData[i].Text;
                let commentDate = resultData[i].bericht_datum;
                let userPfp = resultData[i].profilbild;

                html += `<div class="testimonial__card swiper-slide">
                <div class="testimonial__quote">
                    <i class="ri-double-quotes-l"></i>
                </div>

                <p class="testimonial__description">
                    ${userText}
                </p>

                <div class="testimonial__perfil">
                    <img src="assets/img/profilepics/${userPfp}" alt="" class="testimonial__perfil-img">

                    <div class="testimonial__perfil-data">
                        <span class="testimonial__perfil-name">${userName}</span>
                        <h4 class="testimonial__date">
                            ${commentDate}
                        </h4>
                    </div>
                </div>
            </div>`;

                userTestimonialsEl.innerHTML = html;
                let testimonialSwiper = new Swiper(".testimonial-swiper", {
                    spaceBetween: 30,
                    loop: 'true',
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev"
                    }
                });
            }
            
        }
    }
});
