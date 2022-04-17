const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('express-flash');
const session = require('express-session');

const User = require("./models/User");
const Day = require("./models/Day");

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
    console.log("From: " + JSON.stringify(req.body.generate.from));
    console.log("To: " + JSON.stringify(req.body.generate.to));
    res.render("generateDays");
})
let monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
for (let i = 1; i<monthNames.length; i++){
    for (let j = 1; j <= 31; j++){
        app.get(`/${monthNames[i]}-${j}`, (req,res) => {
            Day.getDay(`${monthNames[i]}-${j}`).then(function(day){
                res.render("selectTime", {date: day});
            }).catch(function(error){
                res.error("Something went wrong! " + error);
            });
        })
    }
}


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
