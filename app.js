const express = require('express');

const app = express();
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const apiDocRouter = require('./routes/apiDocRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

app.use(helmet());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: {
        status: 'error',
        message: 'Too many requests, please try again later'
    },
    handler: function(req, res /*, next*/) {
        res.status(this.statusCode).json(this.message);
    }
});

app.use('/api', limiter);

const apiVersion = 1;
app.use(
    express.json({
        limit: '10kb'
    })
);
app.use(express.static(`${__dirname}/public`));

app.use('api/v1/users/login', mongoSanitize());
app.use('api/v1/users/signup', mongoSanitize());
app.use(xss());
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

// custom middleware
app.use((req, res, next) => {
    // console.log('Hello from the middleware 👋');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan());
}

// Routes Middleware
app.use(`/api`, apiDocRouter);
app.use(`/api/v${apiVersion}/tours`, tourRouter);
app.use(`/api/v${apiVersion}/users`, userRouter);
app.use(`/api/v${apiVersion}/reviews`, reviewRouter);

app.all(`/api/*`, (req, res, next) => {
    next(new AppError(`The URL path ${req.originalUrl} was not found`, 404));
});

//
// ERROR HANDLING FUNCTION
app.use(globalErrorHandler);

module.exports = app;
