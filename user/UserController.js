const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./User');
const adminAuth = require('../middlewares/adminAuth');


router.get('/admin/users', adminAuth,(req, res) => {
    User.findAll().then((users) => {
        res.render('admin/users/index', {
            users: users
        });
    });
});

router.get('/admin/users/create', adminAuth,(req, res) => {
    res.render('admin/users/create');
})

router.post('/user/create', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ where: { email: email } }).then((user) => {
        if (user == undefined) {

            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/admin/users');
            }).catch((err) => {
                res.redirect('/');
            })
        } else {
            res.redirect('/admin/users/create')
        }
    })
});

router.get('/admin', (req, res) => {
    res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
        where: {
            email: email,
        }
    }).then((user) => {
        if (user != undefined) {
            let corret = bcrypt.compareSync(password, user.password);

            if (corret) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles');
            } else {
                res.redirect('/admin');
            }
        } else {
            res.redirect('/admin');
        }
    })
});

router.get('/admin/users/edit/:id', adminAuth,(req, res) => {
    let id = req.params.id;

    User.findByPk(id).then((users) => {
        res.render('admin/users/edit', {
            users: users
        })
    })
})

router.post('/user/update', (req, res) => {
    let id = req.body.id
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ where: { email: email } }).then((user) => {
        if(user != undefined) {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);

            User.update({
                email: email,
                password: hash
            }, {
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/users');
            })
        } else {
            res.redirect('/');
        }
    })
    })


module.exports = router;