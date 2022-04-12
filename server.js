const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('express-flash');
const session = require('express-session');

const User = require("./models/User");

const path = require('path');

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
app.get('/appointments',(req,res)=>{
    res.render('appointments');
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/register',(req,res)=>{
    res.render('register');
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
// load assets
//app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
//app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
//app.use('/js', express.static(path.resolve(__dirname, "assets/js")))


app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});
