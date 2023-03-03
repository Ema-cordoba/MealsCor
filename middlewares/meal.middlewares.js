const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

const { catchAsync } = require('../utils/CatchAsync.util');
const { AppError } = require('../utils/appError.util');
const { response } = require('express');

const mealExist = catchAsync(async (req, res = response, next) => {
    const { id } = req.params;

    const meal = await Meal.findOne({
        where: {
            id,
            status: true,
        },
        attributes: { exclude: ['status'] },
        include: [
            {
                model: Restaurant,
                attributes: {
                    exclude: ['status'],
                },
            },
        ],
    });

    if (!meal) {
        return next(new AppError('The meal is not found', 404));
    }

    req.meal = meal;

    next();
});

module.exports = { mealExist };
