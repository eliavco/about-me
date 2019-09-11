// const fs = require('fs');
const Review = require('./../models/reviewModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/factoryGenerator');

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     const features = new APIFeatures(Review.find(), req.body, req.query, Review)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();

//     const reviews = await features.query;

//     res.status(200).json({
//         status: 'success',
//         results: {
//             reviews: reviews.length
//         },
//         user: {
//             id: req.currentUser._id,
//             name: req.currentUser.name,
//             email: req.currentUser.email,
//             role: req.currentUser.role
//         },
//         data: {
//             reviews
//         }
//     });
// });

exports.getAllReviews = factory.getAll(Review);

// exports.getReview = catchAsync(async (req, res, next) => {
//     const review = await Review.findById(req.params.id);

//     if (!review) return next(new AppError('No review found for this ID', 404));

//     res.status(200).json({
//         status: 'success',
//         data: {
//             review
//         }
//     });
// });

exports.getReview = factory.getOne(Review);

exports.defineParams = catchAsync(async (req, res, next) => {
    if (req.params.tourId && (req.body.tour || req.body.user))
        return next(
            new AppError('you can not create a review for another user', 403)
        );
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.currentUser._id;
    next();
});

// exports.createNewReview = catchAsync(async (req, res, next) => {
//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: newReview
//     });
// });

exports.createNewReview = factory.createOne(Review);

exports.updateReviewF = catchAsync(async (req, res, next) => {
    if (req.params.tourId) {
        req.review = await Review.findOneAndUpdate(
            {
                tour: req.params.tourId,
                user: req.currentUser._id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
    } else {
        req.review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            upsert: true
        });
    }
    next();
});

// exports.updateReviewS = catchAsync(async (req, res, next) => {
//     if (!req.upDoc) return next(new AppError('No document found for this ID', 404));

//     res.status(200).json({
//         status: 'success',
//         data: {
//             document: req.upDoc
//         }
//     });
// });

exports.updateReviewS = factory.updateOne;

// exports.updateReviewDirect = catchAsync(async (req, res, next) => {
//     const review = await Review.findOneAndUpdate(
//         {
//             tour: req.params.tourId,
//             user: req.currentUser._id
//         },
//         req.body,
//         {
//             new: true,
//             runValidators: true
//         }
//     );

//     if (!review)
//         return next(new AppError('No review found for this tour', 404));

//     res.status(200).json({
//         status: 'success',
//         data: {
//             review
//         }
//     });
// });

exports.deleteReviewF = catchAsync(async (req, res, next) => {
    if (req.params.tourId) {
        req.delDoc = await Review.findOneAndDelete({
            tour: req.params.tourId,
            user: req.currentUser._id
        });
    } else {
        req.delDoc = await Review.findByIdAndDelete(req.params.id);
    }
    next();
});

// exports.deleteReviewS = catchAsync(async (req, res, next) => {
//     if (!req.review)
//         return next(new AppError('No review found for this ID', 404));

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });

exports.deleteReviewS = factory.deleteOne('review');

// exports.deleteReviewDirect = catchAsync(async (req, res, next) => {
//     const review = await Review.findOneAndDelete({
//         tour: req.params.tourId,
//         user: req.currentUser._id
//     });

//     if (!review)
//         return next(new AppError('No review found for this tour', 404));

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });

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
//     const stats = await Review.aggregate(aggregation.stages);
//     res.status(200).json({
//         status: 'success',
//         results: stats.length,
//         data: {
//             stats
//         }
//     });
// });

exports.getStats = factory.getStats(Review);
