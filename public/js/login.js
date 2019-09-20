/* eslint-disable */

const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        console.log(res); 
    }
    catch (err) {
        console.log(err.response.data);
    }
};

document.querySelector('.form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    login(email.value, password.value);
    email.value = '';
    password.value = '';
})