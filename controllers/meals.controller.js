
const dotenv = require('dotenv');

// Models
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');
const { User } = require('../models/user.model');
const { Review } = require('../models/review.model');
// Utils
const { catchAsync } = require('../utils/CatchAsync.util');


dotenv.config();

const createMeals = catchAsync(async (req, res, next) => {
    const { id}   = req.restaurant;

    const { name, price } = req.body;

    const newMeal = await Meal.create({
        name,
        price,
        restaurantId: id,
    });

    res.status(201).json({
        status: 'success',
        data: { newMeal },
    });
});

const getAllMeals = catchAsync(async (req, res, next) => {
    const meals = await Meal.findAll({
        where: { status: 'active' },
        attributes: ['id', 'name', 'price'],
        include: {
            model: Restaurant,
            where: { status: 'active' },
            attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
            include: {
                model: Review,
                where: { status: 'active' },
                require: false,
                attributes: ['id', 'comment', 'rating'],
                include: {
                    model: User,
                    attributes: ['id', 'name', 'email'],
                },
            },
        },
    });

    res.status(200).json({
        status: 'success',
        data: { meals },
    });
});

const mealsById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const meals = await Meal.findOne({
        where: { id, status: 'active' },
        attributes: ['id', 'name', 'price'],
        include: [
            {
                model: Restaurant,
                attributes: ['id', 'name'],
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { meals },
    });
});

const updateMeal = catchAsync(async (req, res, next) => {
    const { name, price } = req.body;

    const { meal } = req;

    await meal.update({ name, price });

    res.status(200).json({
        status: 'success',
        data: { meal },
    });
});

const deleteMeal = catchAsync(async (req, res, next) => {
    const { meal } = req;

    await meal.update({ status: 'disabled' });

    res.status(200).json({
        status: 'success',
    });
});

module.exports = {
    getAllMeals,
    mealsById,
    createMeals,
    updateMeal,
    deleteMeal,
};
