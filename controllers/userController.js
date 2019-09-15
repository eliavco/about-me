const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/factoryGenerator');

const filterObj = (object, ...allowedFields) => {
    const newObj = {};
    Object.keys(object).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = object[el];
    });
    return newObj;
};

exports.getAllUsers = factory.getAll(User);

exports.getMe = factory.getMe;

exports.updateMe = catchAsync(async (req, res, next) => {
    if (
        req.body.password ||
        req.body.passwordConfirm ||
        req.body.newPassword ||
        req.body.newPasswordConfirm ||
        req.body.oldPassword
    )
        return next(
            new AppError(
                'You cannot update passwords here. Please use /updatePassword',
                400
            )
        );

    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(
        req.currentUser.id,
        filteredBody,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        status: 'success',
        user: updatedUser
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.currentUser.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getUser = factory.getOne(User, false);

exports.createNewUser = factory.createOne(User);

exports.updateUserF = catchAsync(async (req, res, next) => {
    req.upDoc = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        upsert: true
    });
    next();
});

exports.updateUserS = factory.updateOne;

exports.deleteUserF = catchAsync(async (req, res, next) => {
    req.delDoc = await User.findByIdAndDelete(req.params.id);
    next();
});

exports.deleteUserS = factory.deleteOne('user');

exports.getStats = factory.getStats(User);
