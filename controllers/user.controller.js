const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Meal } = require('../models/meal.model');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');

// Utils
const { catchAsync } = require('../utils/CatchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config();

const getAllusers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    where: { status: 'active' },
    require: false,
    include: { model: Order },
  });

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role = 'normal' } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });

  // Delete password of the response
  newUser.password = undefined;

  // Send res
  res.status(201).json({
    status: 'success',
    data: { newUser },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const { sessionUser } = req;

  await sessionUser.update({ name, email });

  res.status(200).json({
    status: 'success',
    data: { sessionUser },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  await sessionUser.update({ status: 'disabled' });

  res.status(204).json({ status: 'success' });
});

const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Wrong credentials', 400));
  }

  // Remove password
  user.password = undefined;

  // Generate JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Response
  res.status(200).json({
    status: 'success',
    data: { token },
  });
});

const orderUser = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const user = await User.findOne({
    where: { id },
    attributes: ['id', 'name', 'email'],
    include: {
      model: Order,
      attributes: ['id', 'totalPrice', 'quantity', 'status'],
      include: {
        model: Meal,
        attributes: ['id', 'name', 'price', 'status'],
        include: {
          model: Restaurant,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      },
    },
  });

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

const getOrdersById = catchAsync(async (req, res, next) => {
  const { order } = req;
  const user = req.sessionUser;

  res.status(200).json({
    status: 'success',
    data: {
      user,
      order,
    },
  });
});

module.exports = {
  getAllusers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  orderUser,
  getOrdersById,
};
