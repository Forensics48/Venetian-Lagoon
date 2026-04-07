function showWeather() {
    $.ajax({
        type: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/forecast?lat=45.430219873725493&lon=12.343919469398251&appid=610b07309304da88e3b28e7c89163094&units=metric&cnt=40',
        success: function (resultData) {
            let weatherDays = [];
            weatherDays[0] = resultData.list[0];
            let currUnixStamp = weatherDays[0].dt;
            currUnixStamp = currUnixStamp + 24 * 60 * 60;
            for (let i = 0; i < resultData.list.length; i++) {
                if (resultData.list[i].dt == currUnixStamp) {
                    weatherDays.push(resultData.list[i]);
                    currUnixStamp = currUnixStamp + 24 * 60 * 60;
                }
            }


            let html = '';
            for (let i = 0; i < weatherDays.length; i++) {
                let date = new Date(timeConverter(weatherDays[i].dt));
                html += `<div class="weather__day swiper-slide ">
                <div class="icon bubble black">
                    <div class="spin">
                        <img src="https://openweathermap.org/img/wn/${weatherDays[i].weather[0].icon}@2x.png">
                    </div>
                </div>
    
                <h1>${dayConverter(date.getDay())}</h1>
                <span class="temp">${Math.round(weatherDays[i].main.temp)}&deg;</span>
                <span class="high-low">${weatherDays[i].main.temp_min}&deg;/ ${weatherDays[i].main.temp_max}&deg;</span>
                <span class="wind"><i class="ri-windy-line"></i>${weatherDays[i].wind.speed} m/s</span>
            </div>`
            }
            document.getElementById('weather-swiper-content').innerHTML = html;

            let weatherSwiper = new Swiper(".weather-swiper", {
                navigation: {
                    nextEl: ".weather-swiper-button-next",
                    prevEl: ".weather-swiper-button-prev",
                }
            });
        }
    });
    setTimeout(() => {
        document.getElementById('weather-form').style.display = 'initial';
    }, 200);
}

var myChart;

function showWaterLevels() {

    var endDate = new Date();
    var startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    endDate.setDate(endDate.getDate() + 1);
    let endDateFormatted = formatWithZero(endDate.getDate()) + '.' + formatWithZero(endDate.getMonth() + 1) + '.' + endDate.getFullYear() + 'T00:00:00';
    let startDateFormatted = formatWithZero(startDate.getDate()) + '.' + formatWithZero(startDate.getMonth() + 1) + '.' + startDate.getFullYear() + 'T00:00:00';
    var dates = [];
    var levels = [];

    $.ajax({
        type: 'GET',
        url: `https://api.pegelalarm.at/api/station/1.0/height/5-diga-nord-malamocco-it/history?granularity=hour&loadEndDate=${endDateFormatted}%2B0200&loadStartDate=${startDateFormatted}%2B0200`,
        success: function (resultData) {
            for (let i = 0; i < resultData.payload.history.length; i++) {
                var splitdate = resultData.payload.history[i].sourceDate.split('T');
                var splitDatePart2 = splitdate[1].split(':');
                var date = splitdate[0] + "\n" + splitDatePart2[0] + ":" + splitDatePart2[1];
                dates.push(date);
                levels.push(resultData.payload.history[i].value);
            }
            if (window.myChart instanceof Chart) {
                window.myChart.destroy();
            }
            const ctx = document.getElementById('myChart').getContext('2d');
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Höhe in cm',
                        data: levels,
                        backgroundColor: [
                            'rgba(39, 148, 245, 0.8)',
                        ],
                        borderColor: [
                            'rgba(39, 148, 245, 0.8)',
                        ],
                        borderWidth: 1
                    }]
                }
            });
        }
    });
    setTimeout(() => {
        document.getElementById('chart-container').style.display = 'initial';
    }, 200);
}

function formatWithZero(d) {
    return (d < 10 ? '0' : '') + d;
}


function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

function dayConverter(day) {
    var days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    return days[day];
}