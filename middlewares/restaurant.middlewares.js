// Model
const { Restaurant } = require('../models/restaurant.model');
const { AppError } = require('../utils/appError.util');

// Utils
const { catchAsync } = require('../utils/CatchAsync.util');

const restaurantExist = catchAsync(async (req, res, next) => {
    const id  = req.params.id || req.params.restaurantId;

    const restaurant = await Restaurant.findOne({
        where: { id, status: 'active' },
    });

    if (!restaurant) return next(new AppError('Restaurant not found', 404))

    req.restaurant = restaurant;
    next();
});

module.exports = { restaurantExist };
