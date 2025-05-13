const { Sequelize} = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:root@localhost:5438/database_development') // Example for postgres

exports.sequelize = sequelize;

