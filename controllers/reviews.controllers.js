// Models
const { Review } = require('../models/review.model');

// Utils
const { catchAsync } = require('../utils/CatchAsync.util');

const dotenv = require('dotenv');

dotenv.config();

const createReviewByRestaurant = catchAsync(async (req, res, next) => {
    
    const restaurantId = req.restaurant.id;

    // const { id } = req.params;

    const userId = req.sessionUser.id;

    const { comment, rating } = req.body;

    const newReview = await Review.create({
        userId,
        comment,
        rating,
        restaurantId,
    });

    res.status(201).json({
        status: 'success',
        data: { newReview },
    });
});

const updateReviewById = catchAsync(async (req, res, next) => {
    const { review } = req;

    const { comment, rating } = req.body;

    await review.update({
        comment,
        rating,
    });

    res.status(200).json({
        status: 'success',
        review,
    });
});

const deleteReviewById = catchAsync(async (req, res, next) => {
    const { review } = req;

    await review.update({
        status: 'deleted,',
    });

    res.status(204).json({
        status: 'success',
    });
});

module.exports = {
    createReviewByRestaurant,
    updateReviewById,
    deleteReviewById,
};
