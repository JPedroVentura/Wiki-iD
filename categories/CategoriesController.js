const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const slugify = require('slugify');
const { where } = require('sequelize');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories/new', adminAuth,(req, res) => {
    res.render('admin/categories/new');
});

router.post('/categories/save', adminAuth,(req, res) => {
    let title = req.body.title

    if (title !== undefined || title !== null) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories');
        });

    } else {
        res.redirect('/admin/categories/new');
    }
});


router.get('/admin/categories', adminAuth,(req, res) => {

    Category.findAll(
        {
            raw: true
        }
    ).then((categories) => {
        res.render('admin/categories/index',
            {
                categories: categories
            });
    })
});

router.post('/categories/delete', adminAuth,(req, res) => {
    let id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)) {
            Category.destroy(
                {
                    where: {
                        id: id
                    }
                }).then(() => {
                    res.redirect('/admin/categories/');
                });
        }
    } else {

    }
});

router.get('/admin/categories/edit/:id', adminAuth,(req, res) => {
    let id = req.params.id;

    Category.findByPk(id).then((category) => {

        if (isNaN(id)) res.redirect('/admin/categories');

        if (category != undefined) {
            res.render('admin/categories/edit', {
                category: category
            });
        } else {

        }
    })
});

router.post('/categories/update', adminAuth,(req, res) => {
    let id = req.body.id;
    let title = req.body.title;

    Category.update(
        {
            title: title,
            slug: slugify(title)
        },
        {
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/categories');
        })
})

module.exports = router;