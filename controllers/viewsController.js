const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'Exciting tours for adventurous people',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker',
        tour: 'The Forest Hiker',
        user: 'Eliav'
    });
});
