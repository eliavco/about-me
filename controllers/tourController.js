const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
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

exports.alias = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
