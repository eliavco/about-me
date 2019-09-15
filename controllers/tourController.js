const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/factoryGenerator');

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, true);

exports.createNewTour = factory.createOne(Tour);

exports.updateTourF = catchAsync(async (req, res, next) => {
    req.upDoc = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        upsert: true
    });
    next();
});

exports.updateTourS = factory.updateOne;

exports.deleteTourF = catchAsync(async (req, res, next) => {
    req.delDoc = await Tour.findByIdAndDelete(req.params.id);
    next();
});

exports.deleteTourS = factory.deleteOne('tour');

exports.getDoc = factory.getDoc;

exports.getStats = factory.getStats(Tour);

// /within/:distance/center/:latlng/unit/:unit
// /within/256/center/34.111745,-118.113491/unit/:unit
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    const [lat, lng] = latlng.split(',');
    if (!lat || !lng)
        return next(
            AppError(
                'Your Location was not defined properly. try specifying this format: 34.111745,-118.113491 with latitude first',
                400
            )
        );

    // There are more mongodb operators for geospatial calculations go to docs online, for example $near
    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        status: 'success',
        results: {
            tours: `${
                tours.length
            } results out of ${await Tour.countDocuments()}`
        },
        currentUser: {
            id: req.currentUser._id,
            name: req.currentUser.name,
            email: req.currentUser.email,
            role: req.currentUser.role
        },
        data: {
            tours
        }
    });
});

exports.getToursDistance = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    if (!lat || !lng)
        return next(
            AppError(
                'Your Location was not defined properly. try specifying this format: 34.111745,-118.113491 with latitude first',
                400
            )
        );

    // There are more mongodb operators for geospatial calculations go to docs online, for example $near
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        currentUser: {
            id: req.currentUser._id,
            name: req.currentUser.name,
            email: req.currentUser.email,
            role: req.currentUser.role
        },
        data: {
            distances
        }
    });
});

exports.alias = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
