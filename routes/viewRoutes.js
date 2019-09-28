const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();
// eslint-disable-next-line no-unused-vars
const { protect, restrict, isLoggedIn } = authController;

// router.use(authController.isLoggedIn);

router.get(
    '/',
    bookingController.createBookingCheckout,
    isLoggedIn,
    viewsController.getOverview
);

router.get('/overview', isLoggedIn, viewsController.getOverview);

router.get('/login', isLoggedIn, viewsController.getLogin);
router.get('/signup', isLoggedIn, viewsController.getSignup);

router.get('/me', protect, viewsController.getAccount);
router.get('/my-tours', protect, viewsController.getMyTours);
router.post('/submit-user-data', protect, viewsController.updateUserData);

router.get('/tour/:slug', isLoggedIn, viewsController.getTour);

module.exports = router;
