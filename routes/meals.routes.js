const express = require('express');
const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

module.exports = { mealsRouter: router };
// Controllers
const {
  getAllMeals,
  mealsById,
  createMeals,
  updateMeal,
  deleteMeal,
} = require('../controllers/meals.controller');

// Middlewares
const { mealExist } = require('../middlewares/meal.middlewares');
const { restaurantExist } = require('../middlewares/restaurant.middlewares');
const {
  createMealsValidators,
} = require('../middlewares/validators.middlewares');
// --Auth
const {
  protectSession,
  protectAdmin,
} = require('../middlewares/auth.middlewares');

// Using routes
const mealsRouter = express.Router();

mealsRouter.get('/', getAllMeals);

mealsRouter.get('/:id', mealExist, mealsById);

// Endpoinds protected and admin
mealsRouter.use(protectSession);
mealsRouter.use(protectAdmin);

mealsRouter.post('/:id', restaurantExist, createMealsValidators, createMeals);

mealsRouter.patch('/:id', mealExist, updateMeal);

mealsRouter.delete('/:id', mealExist, deleteMeal);

module.exports = { mealsRouter };
