const express = require('express');
const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

module.exports = { userRouter: router };
// Controllers
const {
  getAllusers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  orderUser,
  getOrdersById,
} = require('../controllers/user.controller');

// Middlewares
const { usersExist } = require('../middlewares/user.middlewares');
const {
  createUserValidators,
  loginValidations,
} = require('../middlewares/validators.middlewares');
// --Auth
const {
  protectAdmin,
  protectUsersAccount,
  protectSession,
} = require('../middlewares/auth.middlewares');

// Using routes
const usersRouter = express.Router();

usersRouter.post('/signup', createUserValidators, createUser);

usersRouter.post('/login', loginValidations, loginUser);

// Endpoinds protected
usersRouter.use(protectSession);

// Use Admin
usersRouter.get('/', protectAdmin, getAllusers);

usersRouter.get('/orders', orderUser);

usersRouter.get('/orders/:id', getOrdersById);

usersRouter.patch('/:id', usersExist, protectUsersAccount, updateUser);

usersRouter.delete('/:id', usersExist, protectUsersAccount, deleteUser);

module.exports = { usersRouter };
