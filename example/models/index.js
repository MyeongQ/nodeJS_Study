/*
  mysql - Sequelize - Node 연결
*/
const Sequelize = require('sequelize');
const User = require('./user');
const Article = require('./article');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.passowrd, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Article = Article;

User.init(sequelize);
Article.init(sequelize);

User.associate(db);
Article.associate(db);

module.exports = db;

