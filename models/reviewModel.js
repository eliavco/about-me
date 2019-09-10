const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'A review must have a title'],
            unique: true,
            trim: true,
            maxlength: [40, 'Your review title is too long'],
            // validate: [validator.isAlpha, 'A title has to contain only letters'],
            minlength: [7, 'Your review title is too short']
        },
        slug: String,
        rating: {
            type: Number,
            default: 4.5,
            min: [0.0, 'Rating has to be higher'],
            max: [5.0, 'Rating has to be lower']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A review must belong to a user']
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'A review must belong to a tour']
        },
        theme: {
            type: String,
            trim: true,
            lowercase: true,
            default: 'green',
            select: false
        },
        content: {
            type: String,
            trim: true,
            required: [true, 'A tour must have content']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
