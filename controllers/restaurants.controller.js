const dotenv = require('dotenv');

// Models
const { Restaurant } = require('../models/restaurant.model');
const { User } = require('../models/user.model');
const { Meal } = require('../models/meal.model');
const { Review } = require('../models/review.model');

// Utils
const { catchAsync } = require('../utils/CatchAsync.util');

dotenv.config();

const createRestaurant = catchAsync(async (req, res, next) => {
    const { name, address, rating } = req.body;

    const newRestaurant = await Restaurant.create({
        name,
        address,
        rating,
    });

    res.status(201).json({
        status: 'success',
        data: { newRestaurant },
    });
});
const getAllRestaurants = catchAsync(async (req, res, next) => {

    const restaurant = await Restaurant.findAll({
        where: { status: 'active' },
        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: Review,
                required: false,
                where: { status: 'active' },
                attributes: ['id', 'comment', 'rating'],
                include: {
                    model: User,
                    required: false,
                    where: { status: 'active' },
                    attributes: ['id', 'name', 'email'],
                },
            },
            {
                model: Meal,
                required: false,
                where: { status: 'active' },
                attributes: ['id', 'name', 'price'],
            },
        ],
    })

    res.status(200).json({
        status: 'success',
        data: { restaurant },
    });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({
        where: { id, status: 'active' },
        attributes: ['id', 'name', 'address', 'rating'],
        include: [
            {
                model: Meal,
                required: false,
                attributes: ['id', 'name', 'price'],
            },
            {
                model: Review,
                required: false,
                attributes: [
                    'id',
                    'userId',
                    'restaurantId',
                    'comment',
                    'rating',
                ],
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { restaurant },
    });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
    const { name, address } = req.body;
    const { restaurant } = req;

    await restaurant.update({ name, address });

    res.status(200).json({
        status: 'success',
        data: { restaurant },
    });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
    const { restaurant } = req;

    await restaurant.update({ status: 'deleted' });

    res.status(200).json({
        status: 'success',
    });
});

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
};
