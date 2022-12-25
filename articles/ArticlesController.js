const express = require('express');
const router = express.Router();
const Article = require('./Article');
const Category = require('../categories/Category');
const slugify = require('slugify');
const { where } = require('sequelize');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/articles', adminAuth,(req, res) => {
    Article.findAll({
        include: [{ model: Category, required: true }]
    }).then((articles) => {
        res.render('admin/articles/index', { articles: articles })
    });
});

router.get('/admin/articles/new', adminAuth,(req, res) => {
    Category.findAll({ raw: true }).then(categories => {
        res.render('admin/articles/new',
            {
                categories: categories
            });
    })
});


router.post('/articles/save', (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category //Chave estrangeira ( Cria o relacionamento entre tabelas )
    }).then(() => {
        res.redirect('/admin/articles');
    })


});

router.post('/articles/delete', adminAuth,(req, res) => {
    let id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy(
                {
                    where: {
                        id: id
                    }
                }).then(() => {
                    res.redirect('/admin/articles/');
                });
        }
    } else {

    }
});

router.get('/admin/articles/edit/:id', adminAuth,(req, res) => {
    let id = req.params.id;

    Article.findByPk(id).then((article) => {
        Category.findAll().then((category) => {
            res.render('admin/articles/edit', {
                articles: article,
                categories: category
            });
        })
    })
})

router.post('/articles/update', (req, res) => {
    let title = req.body.title;
    let id = req.body.id;
    let body = req.body.body;
    let category = req.body.category;

    Article.update({
        title: title,
        body: body,
        slug: slugify(title),
        categoryId: category
    },
        {
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/articles')
        });
});


//Logica de paginação
router.get('/articles/page/:num', (req, res) => {
    let page = req.params.num;

    let offset = 0;

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) -1) * 4;
    }

    Article.findAndCountAll({
        limit: 4, //Limite de dado por pagina
        offset: offset, //Mostrar dados a partir de um ponto
        order: [
            ['id', 'DESC']
        ],
    }).then((articles) => {
        let next;
        if (offset + 4 >= articles.count) {
            next = false;
        } else {
            next = true;
        }

        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }


        Category.findAll().then((categories) => {
            res.render('admin/articles/page', {
                result: result,
                categories: categories
            })
        })
    })
})


module.exports = router;