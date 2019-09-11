// const fs = require('fs');
const Tour = require('./../models/tourModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./../controllers/factoryGenerator');

// exports.getAllTours = catchAsync(async (req, res, next) => {
//     const features = new APIFeatures(Tour.find(), req.body, req.query, Tour)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();

//     const tours = await features.query;

//     res.status(200).json({
//         status: 'success',
//         results: {
//             tours: tours.length
//         },
//         user: {
//             id: req.currentUser._id,
//             name: req.currentUser.name,
//             email: req.currentUser.email,
//             role: req.currentUser.role
//         },
//         data: {
//             tours
//         }
//     });
// });

exports.getAllTours = factory.getAll(Tour);

// exports.getTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findById(req.params.id).populate({
//         path: 'reviews',
//         select: '-tour'
//     });

//     if (!tour) return next(new AppError('No tour found for this ID', 404));

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// });

exports.getTour = factory.getOne(Tour);

// exports.createNewTour = catchAsync(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: newTour
//     });
// });

exports.createNewTour = factory.createOne(Tour);

exports.updateTour = catchAsync(async (req, res, next) => {
    req.upDoc = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        upsert: true
    });
});

// exports.updateTour = catchAsync(async (req, res, next) => {
//     if (!tour) return next(new AppError('No tour found for this ID', 404));
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// });

exports.updateTour = factory.updateOne;

exports.deleteTourF = catchAsync(async (req, res, next) => {
    req.delDoc = await Tour.findByIdAndDelete(req.params.id);
});

// exports.deleteTourS = catchAsync(async (req, res, next) => {
//     if (!req.tour) return next(new AppError('No tour found for this ID', 404));

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });

exports.deleteTourS = factory.deleteOne('tour');

exports.getDoc = factory.getDoc;

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
//     const stats = await Tour.aggregate(aggregation.stages);
//     res.status(200).json({
//         status: 'success',
//         results: stats.length,
//         data: {
//             stats
//         }
//     });
// });

exports.getStats = factory.getStats(Tour);

exports.alias = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
