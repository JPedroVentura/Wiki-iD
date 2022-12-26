const { json } = require('body-parser');
const { render } = require('ejs');
const { application } = require('express');
const express = require('express');
const { default: slugify } = require('slugify');
const router  = express.Router();
const Inspection = require('../inspections/Inspection');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/inspections', adminAuth,(req, res) => {
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
    Inspection.findOne({where: { slug: slug}}).then((inspections) => {
        if(inspections != undefined) {
            res.render('inspectionView', {
                inspections: inspections
            })
        } else { 
            res.render('error');
        }

    })
})

router.get('/admin/inspections/new', adminAuth,(req, res) => {
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
        email:email,
        request_date: requestDate,
        scheduling_date: scheduling_date,
        completion_date: completionDate,
        user:user,
        project:project,
        status: status,
        observation: observation,
        slug: slugify(String(enterprise))

    }).then(() => {
        res.redirect('/admin/inspections');
    }).catch((err) => {
        console.log(err);
    })
})

module.exports = router;