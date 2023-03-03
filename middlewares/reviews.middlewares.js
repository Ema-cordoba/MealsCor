// Models
const { Review } = require('../models/review.model');
// utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/CatchAsync.util');

const reviewExist = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findOne({ where: { id, status: 'active' } });

    if (!review) return next(new AppError('Bad request', 404));

    req.review = review;
    next();
});

const userAlreadyMadeReview = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { id } = req.params;
    const review = await Review.findOne({
        where: { restaurantId: id, userId: sessionUser.id },
    });

    if (review) return next(new AppError('The user already made a restaurant review', 401));

    next();
});

module.exports = { reviewExist, userAlreadyMadeReview };
