const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Model
const { User } = require('../models/user.model');

const { catchAsync } = require('../utils/CatchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
  // Token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('Invalid session', 403));

  // Verify token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) return next('The owner of the session is no longer active', 403);

  req.sessionUser = user;
  next();
});

const protectReviewOwners = (req, res, next) => {
  const { sessionUser, review } = req;

  if (sessionUser.id !== review.userId) {
    return next(new AppError('This review does not belong to you.', 403));
  }
  req.sessionUser = User;
  next();
};

const protectAdmin = (req, res, next) => {
  const { sessionUser } = req;

  if (sessionUser.role !== 'admin') {
    return next(
      new AppError('You do not have the access level for this data.', 403)
    );
  }

  next();
};

const protectUsersAccount = (req, res, next) => {
  const { sessionUser, user } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError('You are not the owner of this account.', 403));
  }

  next();
};

const protectOrderOwner = (req, res, next) => {
  const { sessionUser, order } = req;

  if (sessionUser.id !== order.userId) {
    return next(new AppError('This order does not belong to you.', 403));
  }

  next();
};

module.exports = {
  protectSession,
  protectReviewOwners,
  protectAdmin,
  protectUsersAccount,
  protectOrderOwner,
};
