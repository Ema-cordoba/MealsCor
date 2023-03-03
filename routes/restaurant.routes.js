const express = require('express');
const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

module.exports = { restaurantRouter: router };
// Controllers
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurants.controller');

// Middlewares
const { restaurantExist } = require('../middlewares/restaurant.middlewares');
const {
  createRestaurantValidators,
} = require('../middlewares/validators.middlewares');

// --Auth
const {
  protectSession,
  protectAdmin,
} = require('../middlewares/auth.middlewares');

// Using routes
const restaurantRouter = express.Router();

// const { reviewsRouter } = require('./reviews.routes')

restaurantRouter.get('/', getAllRestaurants);

restaurantRouter.get('/:id', getRestaurantById);

// Endpoinds protected
restaurantRouter.use(protectSession);

// restaurantRouter.use('/reviews', reviewsRouter)

restaurantRouter.post('/', createRestaurantValidators, createRestaurant);

restaurantRouter.patch('/:id', protectAdmin, restaurantExist, updateRestaurant);

restaurantRouter.delete(
  '/:id',
  protectAdmin,
  restaurantExist,
  deleteRestaurant
);

module.exports = { restaurantRouter };
