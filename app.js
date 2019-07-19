const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{
    useNewUrlParser: true
})
.then(()=> console.log('MongoDB connected'))
.catch(err => console.log(err));

//Load models
require('./models/Idea');
const Idea = mongoose.model('ideas');

//MIDDLEWARES
//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'

}));
app.set('view engine','handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//method override middleware
app.use(methodOverride('_method'));

//Session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//flash middleware
app.use(flash());

//GLOBAL variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//ROUTES
//Index route
app.get('/',(req, res)=>{
    
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//About route
app.get('/about', (req, res)=>{

    res.render('about');
});

//idea index page

app.get('/ideas', (req, res)=>{

    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas =>{
        res.render('ideas/index', {
            ideas: ideas
        });
    });

    
});

//add ideia form

app.get('/ideas/add', (req, res)=>{

    res.render('ideas/add');
});

// edit idea form
app.get('/ideas/edit/:id', (req, res)=>{

    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        res.render('ideas/edit',{
            idea: idea
        });
    });
    
});

//Process form

app.post('/ideas', (req, res)=>{

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
            details: req.body.details
        };

        new Idea(newUser).save()
        .then(idea => {
            req.flash('success_msg', 'Video Idea added');
            res.redirect('/ideas');
        });
    }
});

//edit form process
app.put('/ideas/:id',(req, res) =>{

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
app.delete('/ideas/:id', (req, res)=>{

    Idea.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg', 'Video Idea removed');
        res.redirect('/ideas');
    });
});

const port = 5000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});