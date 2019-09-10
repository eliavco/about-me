const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
const { protect, restrict } = authController;

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/updatePassword', protect, authController.updatePassword);

router.patch('/updateInfo', protect, userController.updateMe);

router.delete('/deleteMe', protect, userController.deleteMe);
router.delete('/deleteMe', protect, userController.deleteMe);

router.patch('/promote', protect, authController.getPromoted);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router
    .route('/')
    .get(protect, restrict('admin', 'lead-guide'), userController.getAllUsers)
    .post(protect, restrict('admin'), userController.createNewUser);

router
    .route('/stats')
    .get(protect, restrict('admin', 'lead-guide'), userController.getStats);

router
    .route('/:id')
    .get(protect, restrict('admin', 'lead-guide'), userController.getUser)
    .patch(protect, restrict('admin'), userController.updateUser)
    .delete(protect, restrict('admin'), userController.deleteUser);

module.exports = router;
