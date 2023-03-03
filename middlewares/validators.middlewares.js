const { body, validationResult, check } = require('express-validator');
const { AppError } = require('../utils/appError.util');

const validations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);

    const message = errorMessages.join(' .');

    return next(new AppError(message, 400));
  }

  next();
};

const createUserValidators = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  body('email').isEmail().withMessage('Must provide a valid email'),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validations,
];

const createRestaurantValidators = [
  body('name')
    .isString()
    .withMessage('Name of Restaurant must be a string')
    .notEmpty()
    .withMessage('Name of Restaurant cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Name of Restaurant must be at least 3 characters'),
  body('address')
    .isString()
    .withMessage('Address must be a string')
    .notEmpty()
    .withMessage('Address cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Address must be at least 3 characters'),
  body('rating')
    .isInt({ min: 1 })
    .withMessage('Rating must be a number')
    .notEmpty()
    .withMessage('Rating cannot be empty')
    .isLength({ min: 1, max: 5 }),
  validations,
];

const loginValidations = [
  body('email').isEmail().withMessage('Must provide a valid email'),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validations,
];

const createMealsValidators = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  body('price')
    .isInt({ min: 1 })
    .withMessage('Price must be a number')
    .notEmpty()
    .withMessage('Price cannot be empty'),
  validations,
];
const createOrdersValidators = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a integer.'),
  body('mealId').isInt({ min: 1 }).withMessage('MealId must be a integer.'),
  validations,
];

const createReviewsValidators = [
  body('comment')
    .isString()
    .withMessage('Comment must be a string')
    .notEmpty()
    .withMessage('Name cannot be empty')
    .withMessage('Name cannot be empty')
    .isLength({ min: 3 }),
  body('rating').isInt({ min: 1 }).withMessage('Rating must be a integer.'),
  validations,
];

module.exports = {
  createUserValidators,
  createRestaurantValidators,
  createMealsValidators,
  createOrdersValidators,
  createReviewsValidators,
  loginValidations,
};
