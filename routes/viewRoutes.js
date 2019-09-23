const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();
// eslint-disable-next-line no-unused-vars
const { protect, restrict } = authController;

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);

router.get('/overview', viewsController.getOverview);

router.get('/login', viewsController.getLogin);

router.get('/tour/:slug', /* protect, */ viewsController.getTour);

module.exports = router;
