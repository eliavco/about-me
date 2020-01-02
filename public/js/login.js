/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const whereToGo = 'https://eliav.herokuapp.com/go';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        
        //

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            setTimeout(() => {
                location.assign(whereToGo);
            }, 1500);
        }

        //
        // console.log(res); 
    }
    catch (err) {
        showAlert('error', err.response.data.message);
        // console.log(err.response.data);
    }
};

export const signup = async (name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });
        
        //

        if (res.data.status === 'success') {
            showAlert('success', 'Signed up successfully!');
            setTimeout(() => {
                location.assign(whereToGo);
            }, 1500);
        }

        //
        // console.log(res); 
    }
    catch (err) {
        showAlert('error', err.response.data.message);
        // console.log(err.response.data);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });

        const defaultRoutes = [/^\/tour/, '/go', '/login', '/signup'];
        // IF reload not set with true the browser might reload the page from the cache and not GET the current page again from the server
        if (res.data.status === 'success') {
            if (window.location.pathname in defaultRoutes) return location.reload(true);
            return location.assign(whereToGo);
        }
    } catch (err) {
        showAlert('error', 'Error while logging out! Please try again later.')
    }
}