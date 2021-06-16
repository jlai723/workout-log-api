const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:afd60085930c46f0923426a39dc78dfc@localhost:5432/workout-log');

module.exports = sequelize;