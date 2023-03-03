const { app } = require('./app');
const { initModel } = require('./models/initModel');
const { db } = require('./database/db.js');
const express = require('express');
const { mealsRouter } = require('./routes/meals.routes');
const { usersRouter } = require('./routes/user.routes');
const { ordersRouter } = require('./routes/orders.routes');
const { restaurantRouter } = require('./routes/restaurant.routes');
const { reviewsRouter } = require('./routes/reviews.routes');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.paths = {
      user: '/api/v1/users',
      restaurant: '/api/v1/restaurant',
      meal: '/api/v1/meal',
      order: '/api/v1/order',
    };
    this.database = db;
    this.middlewares();
    this.routes();
  }
  middleware() {
    this.app.use(cors());
    this.app.use(express.json()); //me permite q el front envie json al back
  }
  routes() {
    this.app.use(this.paths.meals, mealsRouter);
    this.app.use(this.paths.user, usersRouter);
    this.app.use(this.paths.order, ordersRouter);
    this.app.use(this.paths.restaurant, restaurantRouter);
    this.app.use(this.paths.reviews, reviewsRouter);
  }
  database() {
    db.authenticate()
      .then(() => console.log('Db authenticate'))
      .catch(error => console.log('Error authenticating'));

    db.sync().then(() =>
      console.log('Db Synced').catch(error => console.log('Error syncing'))
    );
  }
  listeners() {
    this.app.listeners(this.port, () => {
      console.log('listening on port ' + this.port);
    });
  }
}

module.exports = Server;
