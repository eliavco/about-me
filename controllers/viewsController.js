const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'Exciting tours for adventurous people',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.find({ slug: req.params.slug }).populate({
        path: 'reviews',
        select: 'rating user content'
    });

    if (!tour) return next(new AppError('No tour found for this ID', 404));

    res.status(200).render('tour', {
        title: `${tour[0].name} Tour`,
        // user: 'Eliav',
        tour: tour[0]
    });
});

exports.getLogin = catchAsync(async (req, res, next) => {
    res.status(200).render('login', {
        title: 'Login'
    });
});

exports.getSignup = catchAsync(async (req, res, next) => {
    res.status(200).render('signup', {
        title: 'Register'
    });
});
