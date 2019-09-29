/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { signup, login, logout } from './login';
import { updateSettings, removePhoto } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// ELEMENTS
const DOMMap = document.getElementById('map');
const DOMRegistrationForm = document.querySelector('.signup-form');
const DOMLoginForm = document.querySelector('.login-form');
const DOMUpdateInfoForm = document.querySelector('.form-user-data');
const DOMUpdatePasswordForm = document.querySelector('.form-user-password');
const DOMForm = document.querySelector('.form');
const DOMLogoutBtn = document.querySelector('.nav__el--logout');
const DOMPhoto = document.getElementById('photo');
const DOMPhotoRemove = document.getElementById('remove');
const DOMBookTourAction = document.getElementById('book-tour');
const DOMAlert = document.querySelector('body').dataset.alert;

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

const purchseTour = (e) => {
    e.preventDefault();
    e.target.textContent = 'Processing...';
    // tour-id gets converted to tourId
    bookTour(e.target.dataset.tourId);
}

const updatePhotoLabel = (e) => {
    e.preventDefault();
    const photoLabel = document.getElementById('photo__label');
    // the double blackslash below is an escape to the escape character
    const filename = photo.value.split('\\')[photo.value.split('\\').length - 1]; 
    photoLabel.textContent = `Choose new photo: ${filename}`;
}

const updateInfoForm = async (e) => {
    e.preventDefault();

    // Multimedia way
    // MULTIPART FORM DATA
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    // NORMAL WAY
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    updateSettings(
        form,
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

// const removePhotoDOM = async (e) => {
//     e.preventDefault();
//     await removePhoto();
// }

if (DOMRegistrationForm) DOMForm.addEventListener('submit', signupForm);
if (DOMLoginForm) DOMForm.addEventListener('submit', loginForm);
if (DOMUpdateInfoForm) {
    DOMPhoto.addEventListener('change', updatePhotoLabel);
    // DOMPhotoRemove.onClick(removePhoto);
    DOMPhotoRemove.addEventListener('click', removePhoto);
    DOMUpdateInfoForm.addEventListener('submit', updateInfoForm);
    DOMUpdatePasswordForm.addEventListener('submit', updatePasswordForm);
};

if (DOMMap) {
    const tourDuration = DOMMap.dataset.duration * 1;
    const locations = JSON.parse(DOMMap.dataset.locations);
    locations[0].day = 0;
    displayMap(locations, tourDuration);
}

if (DOMLogoutBtn) DOMLogoutBtn.addEventListener('click', logout);

if (DOMBookTourAction) DOMBookTourAction.addEventListener('click', purchseTour);

if (DOMAlert) showAlert('success', DOMAlert, 20);
