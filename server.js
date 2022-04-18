const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('express-flash');
const session = require('express-session');

const User = require("./models/User");
const DayModel = require("./models/Day");
mongoose.connect('mongodb://localhost:27017/test');

const path = require('path');
const { allowedNodeEnvironmentFlags } = require('process');

/*
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    async(email) => {
        const userFound = await User.findOne({email})
        return userFound;
    },
    async(id) => {
        const userFound = await User.findOne({ _id: id});
        return userFound;
    }
);
*/

const app = express();
//.env file allows you to change your localhost connection port
dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny'));


// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

app.get('/',(req,res)=>{
    res.render('index');
})
app.get('/selectDay',(req,res)=>{
    res.render('selectDay');
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/register',(req,res)=>{
    res.render('register');
})
app.get('/aboutUs',(req,res)=>{
    res.render('aboutUs');
})
app.get('/generateDays', (req,res) => {
    res.render("generateDays");
})
app.post('/generateDays', (req,res) => {
    let from = new Date(req.body.generate.from);
    let to = new Date(req.body.generate.to);
    let startHour = 9 ;
    
    let startDate = from;
    startDate.setHours(startHour);
    
    startDate.setDate(startDate.getDate() + 1);
    to.setDate(to.getDate() + 1);
    
    let times;
    let date;

    while(startDate <= to){
        let firstHour = startDate;
        times = [];
        while(startDate.getHours() <= 16){
            times.push(startDate);
            startDate.setHours(startDate.getHours() + 1);
        } 
        date = new DayModel({date: firstHour, timeslots: times});

        date.save().then(function(){
            console.log("Added day to database!");
        }).catch(function(error){
            console.log("Failed to add day to database!");
        });
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(startHour);
        
    }
    res.render("generateDays");
})





// set view engine
app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.urlencoded({extended: true}));
//app.use(express.flash());
/*
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
})
);
app.use(passport.initialize())
app.use(passport.session())
*/
/*
mongoose
    .connect('mongodb://localhost:3000',{
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
*/


app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});
