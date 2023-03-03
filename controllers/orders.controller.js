const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// Models
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');
const { Meal } = require('../models/meal.model');

const { catchAsync } = require('../utils/CatchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config();

const createOrder = catchAsync(async (req, res, next) => {

    const { sessionUser } = req; 

    const { quantity, mealId } = req.body;

    const meal = await Meal.findOne({
        where: { id: mealId, status: 'active' },
    });

    if (!meal) {
        return next(new AppError(404,'Meal not found'));
    }

    const newOrder = await Order.create({
        mealId,
        userId: sessionUser.id,
        totalPrice: quantity * meal.price,
        quantity,
    });

    res.status(201).json({
        status: 'success',
        data: { newOrder },
    });
});

const getOrdersUser = catchAsync(async (req, res, next) => {
    const order = await Order.findAll({
        where: {
            userId: sessionUser.id,
        },
        include: [
            {
                model: Meal,
                attributes: {
                    exclude: ['status'],
                },
                include: [
                    {
                        model: Restaurant,
                        attributes: {
                            exclude: ['status'],
                        },
                    },
                ],
            },
        ],
    });

    res.json({
        status: 'success',
        data: { order },
    });
});

const updateOrder = catchAsync(async (req, res, next) => {
    const { order } = req;

    await order.update({ status: 'completed' });

    res.status(200).json({
        status: 'success',
        order,
    });
});

const deleteOrder = catchAsync(async (req, res, next) => {
    const { order } = req;

    await order.update({ status: 'cancelled' });

    res.status(204).json({ status: 'success' });
});

module.exports = { getOrdersUser, createOrder, updateOrder, deleteOrder };
