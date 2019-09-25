/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { signup, login, logout } from './login';
import { updateSettings } from './updateSettings';

// ELEMENTS
const DOMMap = document.getElementById('map');
const DOMRegistrationForm = document.querySelector('.signup-form');
const DOMLoginForm = document.querySelector('.login-form');
const DOMUpdateInfoForm = document.querySelector('.form-user-data');
const DOMUpdatePasswordForm = document.querySelector('.form-user-password');
const DOMForm = document.querySelector('.form');
const DOMLogoutBtn = document.querySelector('.nav__el--logout');

const signupForm = async (e) => {
    e.preventDefault();
    // values
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('passwordConfirm');
    signup(name.value, email.value, password.value, passwordConfirm.value);
    name.value = '';
    email.value = '';
    password.value = '';
    passwordConfirm.value = '';
}

const loginForm = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    login(email.value, password.value);
    email.value = '';
    password.value = '';
}

const updateInfoForm = async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings(
        {
            name, 
            email
        },
        'Info'
    );
}

const updatePasswordForm = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    let oldPassword = document.getElementById('password-current').value;
    let newPassword = document.getElementById('password').value;
    let newPasswordConfirm = document.getElementById('password-confirm').value;
    const savePassword = document.querySelector('.btn-save-password');
    savePassword.textContent = 'Updating...';
    await updateSettings(
        {
            email,
            oldPassword,
            newPassword,
            newPasswordConfirm
        },
        'Password'
    );
    savePassword.textContent = 'Save password';
    oldPassword = '';
    newPassword = '';
    newPasswordConfirm = '';
}

if (DOMRegistrationForm) DOMForm.addEventListener('submit', signupForm);
if (DOMLoginForm) DOMForm.addEventListener('submit', loginForm);
if (DOMUpdateInfoForm) {
    DOMUpdateInfoForm.addEventListener('submit', updateInfoForm)
    DOMUpdatePasswordForm.addEventListener('submit', updatePasswordForm)
};

if (DOMMap) {
    const tourDuration = DOMMap.dataset.duration * 1;
    const locations = JSON.parse(DOMMap.dataset.locations);
    locations[0].day = 0;
    displayMap(locations, tourDuration);
}

if (DOMLogoutBtn) DOMLogoutBtn.addEventListener('click', logout);
