const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();
// eslint-disable-next-line no-unused-vars
const { protect, restrict } = authController;
// If login is required, add protect as first middleware

router.get(
    '/checkout-session/:tourId',
    protect,
    bookingController.getCheckoutSession
);

module.exports = router;
