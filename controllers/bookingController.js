const stripe = require('stripe');
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const factory = require('./../controllers/factoryGenerator');
// const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);
    const stripeActivated = stripe(
        process.env.STRIPE_MODE === 'T'
            ? process.env.STRIPE_SECRET_KEY_TEST
            : process.env.STRIPE_SECRET_KEY_LIVE
    );

    const session = await stripeActivated.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${
            req.params.tourId
        }&user=${req.currentUser.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
        customer_email: req.currentUser.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [
                    // `${req.protocol}://${req.get('host')}/img/tours/${
                    //     tour.imageCover
                    // }`
                    `https://natours.dev/${tour.imageCover}`
                ],
                amount: tour.price * 100,
                currency: 'usd',
                quantity: 1
            }
        ]
    });

    res.status(200).json({
        status: 'success',
        session
    });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    // TEMPORARY BECAUSE PEOPLE CAN MAKE BOOKINGS WITHOUT PAYING
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();

    await Booking.create({ tour, user, price });
    res.redirect(req.originalUrl.split('?')[0]);
});

exports.getAllBookings = factory.getAll(Booking);

exports.createBooking = factory.createOne(Booking);

exports.updateBookingF = catchAsync(async (req, res, next) => {
    req.upDoc = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        // upsert: true,
        runValidators: true
    });
    next();
});

exports.updateBookingS = factory.updateOne;

exports.deleteBookingF = catchAsync(async (req, res, next) => {
    req.delDoc = await Booking.findByIdAndDelete(req.params.id);
    next();
});

exports.deleteBookingS = factory.deleteOne('booking');

exports.getStats = factory.getStats(Booking);
