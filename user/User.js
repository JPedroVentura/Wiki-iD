const Sql = require('sequelize');
const Connection = require('../Database/db');

const User = Connection.define('users',
    {
        email: {
            type: Sql.STRING,
            allowNull: false
        }, password: {
            type: Sql.STRING,
            allowNull: false
        }
    });

module.exports = User;