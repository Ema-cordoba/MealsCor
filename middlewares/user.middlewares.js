// Models
const { User } = require('../models/user.model');
const { AppError } = require('../utils/appError.util');
// Utils
const { catchAsync } = require('../utils/CatchAsync.util');

const usersExist = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findOne({
        attributes: { exclude: ['password'] },
        where: { id },
    });

    // check user exist, send message error
    if (!user) return next(new AppError('User not found', 401))

    req.user = user;
    next();
});

module.exports = { usersExist };
