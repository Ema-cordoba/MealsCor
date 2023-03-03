const express = require('express');
const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

module.exports = { ordersRouter: router };
// Controllers
const {
  getOrdersUser,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orders.controller');

// Middlewares
const { orderExists } = require('../middlewares/order.middlewares');
const {
  createOrdersValidators,
} = require('../middlewares/validators.middlewares');
// --Auth
const {
  protectSession,
  protectOrderOwner,
} = require('../middlewares/auth.middlewares');

// Using routes
const orderRouter = express.Router();

// Endpoinds protected
orderRouter.use(protectSession);

orderRouter.post('/', createOrdersValidators, createOrder);

orderRouter.get('/me', getOrdersUser);

orderRouter.patch('/:id', orderExists, protectOrderOwner, updateOrder);

orderRouter.delete('/:id', orderExists, protectOrderOwner, deleteOrder);

module.exports = { orderRouter };
