const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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


//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'

}));
app.set('view engine','handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
            res.redirect('/ideas');
        });
    }
});


const port = 5000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});