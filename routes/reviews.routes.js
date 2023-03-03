const express = require('express');
const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

module.exports = { reviewsRouter: router };
// Controllers
const {
  updateReviewById,
  createReviewByRestaurant,
  deleteReviewById,
} = require('../controllers/reviews.controllers');

// Middlewares
const {
  userAlreadyMadeReview,
  reviewExist,
} = require('../middlewares/reviews.middlewares');
// Middlewares Restaurants
const { restaurantExist } = require('../middlewares/restaurant.middlewares');
const {
  createReviewsValidators,
} = require('../middlewares/validators.middlewares');
// --Auth
const {
  protectReviewOwners,
  protectSession,
} = require('../middlewares/auth.middlewares');

// Using routes
const reviewRouter = express.Router();

// Endpoinds protected
reviewRouter.use(protectSession);

reviewRouter.post(
  '/:restaurantId',
  restaurantExist,
  createReviewsValidators,
  createReviewByRestaurant
);

reviewRouter.use(protectReviewOwners);

reviewRouter.patch(
  '/:id',
  reviewExist,
  userAlreadyMadeReview,
  updateReviewById
);

reviewRouter.delete('/:id', reviewExist, deleteReviewById);

module.exports = { reviewRouter };
