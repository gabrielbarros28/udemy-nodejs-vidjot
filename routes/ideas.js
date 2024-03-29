const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Load models
require('../models/Idea');
const Idea = mongoose.model('ideas');

//idea index page

router.get('/', ensureAuthenticated, (req, res)=>{

    Idea.find({user: req.user.id})
    .sort({date: 'desc'})
    .then(ideas =>{
        res.render('ideas/index', {
            ideas: ideas
        });
    });

    
});

//add ideia form

router.get('/add', ensureAuthenticated, (req, res)=>{

    res.render('ideas/add');
});

// edit idea form
router.get('/edit/:id', ensureAuthenticated, (req, res)=>{

    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        }else{
            res.render('ideas/edit',{
                idea: idea
            });
        }
    });
    
});

//Process form

router.post('/', ensureAuthenticated, (req, res)=>{

    let errors = [];
    if(!req.body.title){
        errors.push({text: 'Pleas add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'Pleas add details'});
    }

    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else{
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };

        new Idea(newUser).save()
        .then(idea => {
            req.flash('success_msg', 'Video Idea added');
            res.redirect('/ideas');
        });
    }
});

//edit form process
router.put('/:id', ensureAuthenticated, (req, res) =>{

    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea =>{
            req.flash('success_msg', 'Video Idea updated');
            res.redirect('/ideas')
        });
    })
});

//delete idea
router.delete('/:id', ensureAuthenticated, (req, res)=>{

    Idea.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg', 'Video Idea removed');
        res.redirect('/ideas');
    });
});


module.exports = router;