const Sql = require('sequelize');
const Connection = require('../Database/db');
const Category = require('../categories/Category');

const Article = Connection.define('articles',
    {
        title: {
            type: Sql.STRING,
            allowNull: false
        }, slug: {
            type: Sql.STRING,
            allowNull: false
        },
        body: {
            type: Sql.TEXT,
            allowNull: false
        }
    });

Category.hasMany(Article); //hasMany = Category tem muitos Article (Relacionamento 1-para-M)
Article.belongsTo(Category); // belongsTo = Article pertence a Category (Relacionamento 1-para-1)

module.exports = Article;