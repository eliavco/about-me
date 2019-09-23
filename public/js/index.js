/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';

// ELEMENTS
const DOMMap = document.getElementById('map');
const DOMLoginForm = document.querySelector('.form');

if (DOMLoginForm) {
    DOMLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        login(email.value, password.value);
        email.value = '';
        password.value = '';
    });
}

if (DOMMap) {
    const tourDuration = DOMMap.dataset.duration * 1;
    const locations = JSON.parse(DOMMap.dataset.locations);
    // values
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    locations[0].day = 0;
    displayMap(locations, tourDuration);
}
