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
    let startHour = 9;
    
    from.setHours(startHour);
    
    from.setDate(from.getDate() + 1);
    to.setDate(to.getDate() + 1);
    
    let times;
    let date;

    let currentDate = from;

    while(currentDate <= to){
        times = [];
        while(currentDate.getHours() <= 16){
            times.push(currentDate);
            currentDate.setHours(currentDate.getHours() + 1);
        } 
        date = new DayModel({date: currentDate, timeslots: times});

        date.save().then(function(){
            console.log("Added day to database!");
        }).catch(function(error){
            console.log("Failed to add day to database!");
        });
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(startHour);
        
    }
    res.render("generateDays");
})

app.get("/listTest", function(req, res){
    DayModel.listAllDays().then(function(days){
        res.render("listTest", {days: days});
    }).catch(function(error){
        res.error("Something went wrong! " + error);
    });
    
});



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
