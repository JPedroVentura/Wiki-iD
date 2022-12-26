const Connection = require('../Database/db');

const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');

//Import Controllers/Routes
const categoriesController = require('../categories/CategoriesController');
const articlesController = require('../articles/ArticlesController');
const userController = require('../user/UserController');
const inspectionsController = require('../inspections/InspectionsController');

const HOST = 'localhost';
const PORT = 8181;

//Database Connection
Connection
    .authenticate()
    .then(() => {
        console.log('Connection succefull!!');
    })
    .catch((err) => {
        console.log(err);
    });

const Article = require('../articles/Article');
const Category = require('../categories/Category');
const User = require('../user/User');
const Inspection = require('../inspections/Inspection.js');

//View Engine
app.set('view engine', 'ejs');

//Sessions
app.use(session({
    secret: 'GHID',
    cookie: {
        maxAge: 36000000 //Valor em milessegundos
    }
}));

//Static
app.use(express.static('public'));


//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Controllers
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', userController);
app.use('/', inspectionsController);
//Routes

app.get('/', (req, res) => {

    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then((articles) => {
        Category.findAll().then((categories) => {
            res.render('home', {
                articles: articles,
                categories: categories
            });
        })
    })
});

app.get('/:slug', (req, res) => {
    let slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then((article) => {
        if(article != undefined){
            Category.findAll().then((categories) => {
                res.render('article', {
                    articles: article,
                    categories: categories
                });
            })
        } else {
            res.render('error');
        }
    })
})

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }]
    }).then((category) => {
        if(category != undefined) {
            Category.findAll().then((categories) => {
                res.render('home', {
                    articles: category.articles,
                    categories: categories
                })
            })
        } else {
            res.render('error');
        }

    })
})
app.listen(PORT, () => {
    console.log(`Server on: http://${HOST}:${PORT}`);
});