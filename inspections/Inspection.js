const Sql = require('sequelize');
const Connection = require('../Database/db');

const Inspection = Connection.define('inspections', {
    vendor: {
        type: Sql.STRING,
        allowNull: false
    },
    enterprise: {
        type: Sql.TEXT,
        allowNull: false
    },
    cnpj: {
        type: Sql.TEXT,
        allowNull: false
    },
    project:{
        type: Sql.TEXT,
        allowNull: false
    },
    contact: {
        type: Sql.TEXT,
        allowNull: false
    },
    phone: {
        type: Sql.TEXT,
        allowNull: false
    },
    email: {
        type: Sql.TEXT,
        allowNull: false
    },
    request_date: {
        type: Sql.DATEONLY,
        allowNull: false
    },
    scheduling_date: {
        type: Sql.DATEONLY,
        allowNull: true
    },
    completion_date:{
        type: Sql.DATEONLY,
        allowNull: true
    },
    user: {
        type: Sql.TEXT,
        allowNull: false
    },
    status:{
        type: Sql.TEXT,
        allowNull: false
    },
    observation: {
        type: Sql.TEXT,
        allowNull: true
    },
    slug:{
        type: Sql.TEXT,
        allowNull: false
    }
});

module.exports = Inspection;