const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });
const { protect, restrict } = authController;
// If login is required, add protect as first middleware

router
    .route('/')
    .get(protect, reviewController.getAllReviews)
    .post(protect, restrict('admin'), reviewController.createNewReview);

router
    .route('/stats')
    .get(protect, restrict('admin', 'lead-guide'), reviewController.getStats);

// ID HAS TO BE THE LAST
router
    .route('/:id')
    .get(protect, reviewController.getReview)
    .patch(protect, restrict('admin'), reviewController.updateReview)
    .delete(
        protect,
        restrict('admin', 'lead-guide'),
        reviewController.deleteReview
    );

module.exports = router;
