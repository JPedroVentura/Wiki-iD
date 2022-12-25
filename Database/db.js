const Sql = require('sequelize');

const Connection = new Sql('azarpress', 'root', 'root',
    {
        host: 'localhost',
        dialect: 'mysql',
        timezone: '-03:00'
    });

module.exports = Connection;

