const User = require('./../models/userModel');
// const APIFeatures = require('./../utils/apiFeatures');
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

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//     const features = new APIFeatures(User.find(), req.body, req.query, User)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();

//     const users = await features.query;

//     res.status(200).json({
//         status: 'success',
//         results: {
//             users: users.length
//         },
//         data: {
//             users
//         }
//     });
// });

exports.getAllUsers = factory.getAll(User);

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

// exports.getUser = catchAsync(async (req, res, next) => {
//     const user = await User.findById(req.params.id);

//     if (!user) return next(new AppError('No user found for this ID', 404));

//     res.status(200).json({
//         status: 'success',
//         data: {
//             user
//         }
//     });
// });

exports.getUser = factory.getOne(User);

// exports.createNewUser = catchAsync(async (req, res, next) => {
//     const newUser = await User.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: newUser
//     });
// });

exports.createNewUser = factory.createOne(User);

exports.updateUserF = catchAsync(async (req, res, next) => {
    req.upDoc = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        upsert: true
    });
});

// exports.updateUserS = catchAsync(async (req, res, next) => {
//     if (!user) return next(new AppError('No user found for this ID', 404));
//     res.status(200).json({
//         status: 'success',
//         data: {
//             user
//         }
//     });
// });

exports.updateUserS = factory.updateOne;

exports.deleteUserF = catchAsync(async (req, res, next) => {
    req.delDoc = await User.findByIdAndDelete(req.params.id);
});

// exports.deleteUserS = catchAsync(async (req, res, next) => {
//     if (!req.user) return next(new AppError('No user found for this ID', 404));

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });

exports.deleteUserS = factory.deleteOne('user');

// const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
// // eslint-disable-next-line no-useless-escape
// const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

// JSON.dateParser = function(key, value) {
//     if (typeof value === 'string') {
//         let a = reISO.exec(value);
//         if (a) return new Date(value);
//         a = reMsAjax.exec(value);
//         if (a) {
//             const b = a[1].split(/[-+,.]/);
//             return new Date(b[0] ? +b[0] : 0 - +b[1]);
//         }
//     }
//     return value;
// };

// exports.getStats = catchAsync(async (req, res, next) => {
//     const aggregation = JSON.parse(JSON.stringify(req.body), JSON.dateParser);
//     const stats = await User.aggregate(aggregation.stages);
//     res.status(200).json({
//         status: 'success',
//         results: stats.length,
//         data: {
//             stats
//         }
//     });
// });

exports.getStats = factory.getStats(User);
