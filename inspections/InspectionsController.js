const { json } = require('body-parser');
const { render } = require('ejs');
const { application } = require('express');
const { Op } = require("sequelize");
const express = require('express');
const { where } = require('sequelize');
const { default: slugify } = require('slugify');
const router = express.Router();
const Inspection = require('../inspections/Inspection');
const adminAuth = require('../middlewares/adminAuth');


router.get('/admin/inspections', adminAuth, (req, res) => {
    Inspection.findAll().then((inspections) => {
        res.render('admin/inspections/index', {
            inspections: inspections
        });
    })
});

router.get('/inspections', (req, res) => {
    Inspection.findAll().then((inspections) => {
        res.render('inspections', {
            inspections: inspections,
        })
    })
})

router.get('/inspections/:slug', (req, res) => {
    let slug = req.params.slug;
    Inspection.findOne({ where: { slug: slug } }).then((inspections) => {
        if (inspections != undefined) {
            res.render('inspectionView', {
                inspections: inspections
            })
        } else {
            res.render('error');
        }

    })
})

router.get('/admin/inspections/new', adminAuth, (req, res) => {
    res.render('admin/inspections/new')
});

router.post('/inspections/save', (req, res) => {
    let vendor = req.body.vendor;
    let enterprise = req.body.enterprise;
    let cnpj = req.body.cnpj;
    let contact = req.body.contact;
    let phone = req.body.phone;
    let email = req.body.email;
    let project = req.body.project
    let requestDate = req.body.requestDate;
    let scheduling_date = req.body.scheduling_date;
    let completionDate = req.body.completionDate;
    let user = req.body.user;
    let status = req.body.status;
    let observation = req.body.observation;

    /*
    res.json({
        vendor: vendor,
        enterprise: enterprise,
        cnpj: cnpj,
        contact: contact,
        phone: phone,
        project: project,
        requestDate: requestDate,
        completionDate: completionDate,
        user:user,
        status: status,
        slug: slugify(String(enterprise))
    })*/

    Inspection.create({
        vendor: vendor,
        enterprise: enterprise,
        cnpj: cnpj,
        contact: contact,
        phone: phone,
        email: email,
        request_date: requestDate,
        scheduling_date: scheduling_date,
        completion_date: completionDate,
        user: user,
        project: project,
        status: status,
        observation: observation,
        slug: slugify(String(enterprise))

    }).then(() => {
        res.redirect('/admin/inspections');
    }).catch((err) => {
        console.log(err);
    })
});

router.get('/admin/inspections/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id;

    Inspection.findByPk(id).then((inspections) => {
        res.render('admin/inspections/edit', {
            inspections: inspections
        })
    })
})

router.post('/inspections/update', (req, res) => {
    let id = req.body.id;
    let vendor = req.body.vendor;
    let enterprise = req.body.enterprise;
    let cnpj = req.body.cnpj;
    let contact = req.body.contact;
    let phone = req.body.phone;
    let email = req.body.email;
    let project = req.body.project
    let requestDate = req.body.requestDate;
    let scheduling_date = req.body.scheduling_date;
    let completionDate = req.body.completionDate;
    let user = req.body.user;
    let status = req.body.status;
    let observation = req.body.observation;

    Inspection.update({
        vendor: vendor,
        enterprise: enterprise,
        cnpj: cnpj,
        contact: contact,
        phone: phone,
        email: email,
        request_date: requestDate,
        scheduling_date: scheduling_date,
        completion_date: completionDate,
        user: user,
        project: project,
        status: status,
        observation: observation,
        slug: slugify(String(enterprise))

    }, {
        where: { id: id }
    }).then(() => {
        res.redirect('/admin/inspections');
    }).catch((err) => {
        console.log(err);
    })
})

router.post('/inspections/delete', adminAuth, (req, res) => {
    let id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)) {
            Inspection.destroy(
                {
                    where: {
                        id: id
                    }
                }).then(() => {
                    res.redirect('/admin/inspections/');
                });
        }
    } else {

    }
});

router.post('/inspections/', (req, res) => {
    let cnpj = req.body.cnpj;

    if (cnpj != undefined) {
        Inspection.findAll({
            where: {
                [Op.or]: [
                    {
                        cnpj: {
                            [Op.startsWith]: cnpj
                        }
                    },
                    {
                        enterprise: {
                            [Op.startsWith]: cnpj
                        }
                    }
                ]
            }
        }).then((inspections) => {
            res.render('inspections', {
                inspections: inspections
            });
        })
    } else {
        res.render('error');
    }
});

module.exports = router;