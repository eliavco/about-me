/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is 'password' or 'info'
export const updateSettings = async (data, type) => {
    try {
        const url =
            type === 'Password'
                ? '/api/v1/users/updatePassword'
                : '/api/v1/users/updateInfo';
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        //

        if (res.data.status === 'success') {
            showAlert('success', `${type} Successfully Changed!`);
            setTimeout(() => {
                location.reload(true);
            }, 1500);
        }

        //
        // console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
        // console.log(err.response.data);
    }
};