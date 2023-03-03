const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');
// utils
const { catchAsync } = require('../utils/CatchAsync.util');
const { AppError } = require('../utils/appError.util')

const orderExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.sessionUser.id;

    const order = await Order.findOne({
        where: { id, userId },
        attributes: ['id', 'totalPrice', 'quantity', 'status'],
        include: {
            model: Meal,
            attributes: ['id', 'name', 'price', 'status'],
            include: {
                model: Restaurant,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
        },
    });

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    req.order = order;
    next();
});

module.exports = { orderExists };
