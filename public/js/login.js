/* eslint-disable */
import axios from 'axios';

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
            alert('Logged in successfully!');
            setTimeout(() => {
                location.assign('/');
            }, 1500);
        }

        //
        // console.log(res); 
    }
    catch (err) {
        alert(err.response.data.message);
        // console.log(err.response.data);
    }
};
