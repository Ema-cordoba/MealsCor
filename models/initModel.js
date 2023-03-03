const { Meal } = require('../models/meal.model');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');
const { User } = require('../models/user.model');

const initModel = () => {
  // 1 Restaurant <----> M Meal
  Restaurant.hasMany(Meal, { foreignKey: 'restaurantId' });
  Meal.belongsTo(Restaurant);

  // 1 Restaurant <----> M Review
  Restaurant.hasMany(Review, { foreignKey: 'restaurantId' });
  Review.belongsTo(Restaurant);

  // 1 Meal <----> 1 Order
  Meal.hasOne(Order, { foreignKey: 'mealId' });
  Order.belongsTo(Meal);

  // 1 User <----> M Order
  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User);

  // 1 User <----> M Review
  User.hasMany(Review, { foreignKey: 'userId' });
  Review.belongsTo(User);
};

module.exports = { initModel };
