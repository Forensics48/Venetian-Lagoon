function signUp() {
	const userName = $("#user-name").val();
	const userEmail = $('#user-signup-email').val();
	const userPassword = document.getElementById("user-signup-password").value;
	const emailError = document.getElementById("email-signup-error");
	const passwordError = document.getElementById("password-signup-error");
	const isVendor = document.getElementById('user-vendor').checked;

	emailError.innerHTML = "";
	passwordError.innerHTML = "";

	$.ajax({
		type: 'POST',
		url: '/user/signup',
		data: { name: userName, email: userEmail, password: userPassword, vendor: isVendor },
		success: function (resultData) {
			if (resultData.successful) {
				window.location.assign('/');
			}
		},
		error: function (resultData) {
			if (resultData.responseJSON.email) {
				emailError.innerHTML = resultData.responseJSON.email;
			} else if (resultData.responseJSON.password) {
				passwordError.innerHTML = resultData.responseJSON.password;
			}
		}
	});
}

function login() {
	emailError.innerHTML = "";
	passwordError.innerHTML = "";

	$.ajax({
		type: 'POST',
		url: '/user/login',
		data: { email: userEmail.value, password: userPassword.value },
		success: function (resultData) {
			console.log(resultData);
			if (resultData.successful) {
				window.location.assign('/');
			}
		},
		error: function (resultData) {
			if (resultData.responseJSON.email) {
				emailError.innerHTML = resultData.responseJSON.email;
			} else if (resultData.responseJSON.password) {
				passwordError.innerHTML = resultData.responseJSON.password;
			}
		}
	});
}

function logout() {
	$.ajax({
		type: 'GET',
		url: '/user/logout',
		success: function () {
			console.log("Logged out");
		}
	});
}

function deleteAccount() {
	if (confirm("Sind Sie sicher, dass Sie Ihr Konto löschen möchten?") === true) {
		$.ajax({
			type: 'POST',
			url: '/user/deleteAccount',
			success: function () {
				window.location.assign('/index.html');
			}
		});
	}
}


async function getCurrentUser() {
	var user = {};
	await $.ajax({
		type: 'GET',
		url: '/user/currentUser',
		success: function (resultData) {
			if (resultData.user !== 'notLoggedIn') {
				if (resultData.user.email !== undefined && resultData.user.name !== undefined) {
					user.email = resultData.user.email;
					user.name = resultData.user.name;
					user.pfp = resultData.user.pfp;
					user.id = resultData.user.id;
					user.isVendor = resultData.user.isVendor;
				} else {
					logout();
					window.location.assign('/index.html');
				}
			} else {
				window.location.assign('/login.html');
			}
		}
	});
	return user;
}

function changePassword(oldPassword, newPassword) {
	$.ajax({
		type: 'GET',
		url: '/user/currentUser',
		success: function (resultData) {
			if (resultData.user !== 'notLoggedIn') {
				if (resultData.user.email !== undefined && resultData.user.name !== undefined) {
					$.ajax({
						type: 'POST',
						url: '/user/updatePassword',
						data: { email: resultData.user.email, oldPassword, newPassword },
						success: function () {
							logout();
							window.location.assign('/login.html');
						},
						error: function () {
							alert("Sie haben Ihr aktuelles Passwort falsch eingegeben");
						}
					});
				} else {
					logout();
					window.location.assign('/index.html');
				}
			} else {
				window.location.assign('/login.html');
			}
		}
	});
}

function updateProfilePicture(pfpName, userId) {
	$.ajax({
		type: 'POST',
		url: '/user/updateProfilePic',
		data: { pfpName, userId },
		success: function () {
			console.log('Profile picture has been saved.');
		}
	});
}

function addBoatOffer(boatName, website, phoneNumber, latitude, longitude, dailyPrice, openingTime, imageName, vendorId) {
	$.ajax({
		type: 'POST',
		url: '/offers/addBoatOffer',
		data: { boatName, website, phoneNumber, latitude, longitude, dailyPrice, openingTime, imageName, vendorId },
		success: function () {
			console.log('Offer has been added.');
		}
	});
}

function addUserLogbook(user, date, locationMorning, locationEvening) {
	$.ajax({
		type: 'POST',
		url: '/user/addLogbook',
		data: { user, date, locationMorning, locationEvening },
		success: function () {
			console.log('Logbook has been added.');
		}
	});
}

function userBookBoat(startDate, endDate, userId, vendorId, boatOfferId) {
	$.ajax({
		type: 'POST',
		url: '/user/bookBoat',
		data: { startDate, endDate, userId, vendorId, boatOfferId },
		success: function () {
			alert("Das Boot ist erfolgreich gebucht worden.");
		}
	});
}

function getLogBooks(userId) {
	$.ajax({
		type: 'POST',
		url: '/user/userLogbooks',
		data: { userId },
		success: function (resultData) {
			if (resultData) {
				let html = '<tr>' +
					'<th>Datum</th>' +
					'<th>Standort morgens</th>' +
					'<th>Standort abends</th>\n' +
					'</tr>';


				for (var i = 0; i < resultData.length; i++) {
					let date = resultData[i].Datum;
					let locationMorning = resultData[i].StandortMorgens;
					let locationEvening = resultData[i].StandortAbends;

					locationMorning = locationMorning.replace(',', '<br>');
					locationEvening = locationEvening.replace(',', '<br>');

					html += `<tr class="booking">` +
						`<td>` + date + `</td>` +
						`<td>` + locationMorning + `</td>` +
						`<td>` + locationEvening + `</td>` +
						`</tr>`;
				}

				let table = document.getElementById('logbooks-table');
				table.innerHTML = html;
			}
		}
	});
}

function getUserBookings(currUser) {
	let userId = currUser.id;
	if(currUser.isVendor) {
		$.ajax({
			type: 'POST',
			url: '/user/userOffers',
			data: { userId },
			success: function (resultData) {
				if (resultData) {
					console.log(resultData);
					
					let html = '<tr><th>ID</th><th>Name</th><th>Breitengrad</th><th>Laengengrad</th><th>Mietpreis pro Tag</th><th>Bewertung</th></tr>';
	
					
					for (var i = 0; i < resultData.length; i++) {
						let offerId = resultData[i].ID;
						let offerName = resultData[i].Name;
						let offerLng = resultData[i].Breitengrad;
						let offerLat = resultData[i].Laengengrad;
						let offerPrice = resultData[i].Mietpreis;
						let offerRating = resultData[i].Durchschnittsbewertung ? resultData[i].Durchschnittsbewertung : '- / -';
	
						html += `<tr class="booking">
						<td>${offerId}</td>
						<td>${offerName}</td>
						<td>${offerLng}</td>
						<td>${offerLat}</td>
						<td>${offerPrice}</td>
						<td>${offerRating}</td>
						</tr>`;
					}
					
					let table = document.getElementById('bookings-table');
					table.innerHTML = html;
					
				}
			}
		});
	} else {
		$.ajax({
			type: 'POST',
			url: '/user/userBookings',
			data: { userId },
			success: function (resultData) {
				if (resultData) {
					let html = '<tr><th>ID</th><th>Datum</th><th>Angebot</th><th>Preis</th><th>Anmerkung</th><th>Bewerten</th><th>Kalender</th></tr>';
	
	
					for (var i = 0; i < resultData.length; i++) {
						let angebotId = resultData[i].boatangebot_id;
						let startDate = parseDate(resultData[i].StartDatum);
						let endDate = parseDate(resultData[i].EndDatum);
						var days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
						startDate = startDate.toLocaleString('de', { year: 'numeric', month: '2-digit', day: '2-digit' });
						endDate = endDate.toLocaleString('de', { year: 'numeric', month: '2-digit', day: '2-digit' })
						let name = resultData[i].Name;
						let price = resultData[i].Mietpreis * days;
	
						html += `<tr class="booking">
						<td>${i + 1}</td>
						<td>${startDate} - ${endDate}</td>
						<td>${name}</td>
						<td>${price} €</td>
						<input type="hidden" value="${angebotId}">
						<td><i onclick="openPopupWindow('commentForm')" class="ri-message-2-line booking__comment"></i></td>
						<td><i class="ri-star-fill rate-booking" onclick="openRateWindow(${angebotId})"></i></td>
						<td><button id="authorize_button" onclick="handleAuthClick()" class="btn fa fa-calendar"></button></td>
						</tr>`;
					}
	
					let table = document.getElementById('bookings-table');
					table.innerHTML = html;
	
				}
			}
		});
	}
}

function addUserTestimonial(text, userId) {
	$.ajax({
		type: 'POST',
		url: '/user/addTestimonial',
		data: { text, userId },
		success: function (resultData) {
			if (resultData) {
				closePopupWindow('commentForm');
			}
		}
	});
}

function addUserOfferRating(offerId, userId, rating) {
    $.ajax({
        type: 'POST',
        url: '/user/addOfferRating',
        data: { offerId, userId, offerRating: rating },
        success: function (resultData) {
            if (resultData) {
				alert("Ihre Bewertung wurde erfolgreich abgegeben.");
            }
        }
    });
}

function parseDate(input) {
	var parts = input.match(/(\d+)/g);
	return new Date(parts[2], parts[1] - 1, parts[0]);
}

