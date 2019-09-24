/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { signup, login, logout } from './login';

// ELEMENTS
const DOMMap = document.getElementById('map');
const DOMLoginForm = document.querySelector('.login-form');
const DOMRegistrationForm = document.querySelector('.signup-form');
const DOMForm = document.querySelector('.form');
const DOMLogoutBtn = document.querySelector('.nav__el--logout');

function loginForm(e) {
    e.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    login(email.value, password.value);
    email.value = '';
    password.value = '';
}

function signupForm(e) {
    e.preventDefault();
    // values
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('passwordConfirm');
    signup(
        name.value,
        email.value,
        password.value,
        passwordConfirm.value
    );
    name.value = '';
    email.value = '';
    password.value = '';
    passwordConfirm.value = '';
}

if (DOMLoginForm) DOMForm.addEventListener('submit', loginForm);
if (DOMRegistrationForm) DOMForm.addEventListener('submit', signupForm);

if (DOMMap) {
    const tourDuration = DOMMap.dataset.duration * 1;
    const locations = JSON.parse(DOMMap.dataset.locations);
    locations[0].day = 0;
    displayMap(locations, tourDuration);
}

if (DOMLogoutBtn) DOMLogoutBtn.addEventListener('click', logout);
