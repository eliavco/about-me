/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_G2AZJSnZeT0OX7gCsFG8eWFG002Z9UEJwO');

export const bookTour = async tourId => {
    try {
        const session = await axios(`${window.location.origin}/api/v1/bookings/checkout-session/${tourId}`);
    
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        showAlert('error', err)
    }
}