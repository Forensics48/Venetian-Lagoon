const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('login-container');
const userEmail = document.getElementById("user-email");
const userPassword = document.getElementById("user-password");
const emailError = document.getElementById("email-login-error");
const passwordError = document.getElementById("password-login-error");

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

function toggleContainer() {
	const icon = document.getElementById('toggle-icon');
	const text = document.getElementById('toggle-description');
	const signInForm = document.getElementById('sign-in-form');
	const signUpForm = document.getElementById('sign-up-form');

	if (icon.classList.contains('ri-toggle-line')) {
		icon.classList.remove('ri-toggle-line');
		icon.classList.add('ri-toggle-fill');
		signInForm.style.display = 'none';
		signUpForm.style.display = 'block';
		container.classList.add("right-panel-active");

		text.innerHTML = "Einloggen";
	} else {
		icon.classList.add('ri-toggle-line');
		icon.classList.remove('ri-toggle-full');
		signUpForm.style.display = 'none';
		signInForm.style.display = 'block';
		container.classList.remove("right-panel-active");

		text.innerHTML = "Registrieren";
	}
}

function monitorSize() {
	if ($(window).width() > 768) {
		const signInForm = document.getElementById('sign-in-form');
		const signUpForm = document.getElementById('sign-up-form');

		signInForm.style.display = 'initial';
		signUpForm.style.display = 'initial';
	} else {
		const container = document.getElementById('login-container');
		const icon = document.getElementById('toggle-icon');
		const text = document.getElementById('toggle-description');
		const signInForm = document.getElementById('sign-in-form');
		const signUpForm = document.getElementById('sign-up-form');

		if(container.classList.contains('right-panel-active')) {
			icon.classList.remove('ri-toggle-line');
			icon.classList.add('ri-toggle-fill');
			signInForm.style.display = 'none';
			signUpForm.style.display = 'block';
			text.innerHTML = "Einloggen";
		} else {
			icon.classList.add('ri-toggle-line');
			icon.classList.remove('ri-toggle-full');
			signUpForm.style.display = 'none';
			signInForm.style.display = 'block';	
			text.innerHTML = "Registrieren";
		}
	}
}

window.onresize = monitorSize;
