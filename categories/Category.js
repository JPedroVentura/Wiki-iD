const Sql = require('sequelize');
const Connection = require('../Database/db');

const Category = Connection.define('categories',
    {
        title: {
            type: Sql.STRING,
            allowNull: false
        }, slug: {
            type: Sql.STRING,
            allowNull: false
        }
    });

module.exports = Category;