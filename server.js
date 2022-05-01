require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs');
const User = require("./models/User");
const DayModel = require("./models/Day");

let adminEmail = "test@gmail.com";

const {
    checkAuthenticated,
    checkNotAuthenticated,
} = require('./middlewares/auth');

const app = express();

const path = require('path');
const { allowedNodeEnvironmentFlags } = require('process');

const initializePassport = require('./passport-config');
const { db } = require('./models/User');
initializePassport(
    passport,
    async(email) => {
        const userFound = await User.findOne({ email })
        return userFound;
    },
    async(id) => {
        const userFound = await User.findOne({ _id: id });
        return userFound;
    }
);

// set view engine
app.set("view engine", "ejs");
// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }))
//.env file allows you to change your localhost connection port
dotenv.config({ path: 'config.env' })
const PORT = process.env.PORT || 8080
// log requests
app.use(morgan('tiny'));
//flash messages
app.use(flash());
app.use(
    session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static("views"));
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
})

//to check whether user is authenitcated or not
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
})
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register');
})
app.get('/aboutUs', (req, res) => {
    res.render('aboutUs');
})
app.get('/index', (req, res) => {
    res.render('index');
})

// Calendar Start //

//checks whether authentication is supported
app.get('/selectDay', checkAuthenticated, (req, res) => {
    res.render('selectDay',{ name: req.user.name });
})
app.get('/generateDays', (req, res) => {
    res.render("generateDays");
})

app.post('/generateDays', async (req, res) => {
    let from = new Date(req.body.generate.from);
    let to = new Date(req.body.generate.to);

    from.setHours(9);

    from.setDate(from.getDate() + 1);
    to.setDate(to.getDate() + 1);

    let times = [];

    let currentDate = from;

    while (currentDate < to) {

        // iterating from 9 am to 4 pm
        while (currentDate.getHours() <= 16) {
            times.push(currentDate.getHours() <= 12 ? currentDate.getHours() : currentDate.getHours() - 12);
            currentDate.setHours(currentDate.getHours() + 1);
        }
        // saving the data
        try {
            const date = new DayModel({ date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0), timeSlots: times });
            console.log(date)
            await date.save();
          } catch (err) {
            console.log('err' + err);
            res.status(500).send(err);
        }

        // incrementing day and resetting time
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(9);
        times = [];

    }
    
    res.render("generateDays");
})

let monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
for (let i = 1; i<monthNames.length; i++){
    for (let j = 1; j <= 31; j++){
        app.get(`/${monthNames[i]}-${j}`, (req,res) => {
            DayModel.getDay(`${monthNames[i]}-${j}`).then(function(day){
                console.log(day)
                res.render("selectTime", {date: day});
            }).catch(function(error){
                res.error("Something went wrong! " + error);
            });
        })
    }
}

app.post('/selectTime', (req,res) =>{
    const date = new Date(req.body.selectedTime.date)
    let timeSlotSelection = req.body.selectedTime.hour
    let month = date.getMonth() + 1
    let day = date.getDate()
    DayModel.getDay(monthNames[month] + '-' + day).then(async function(day){
        const index = day[0].timeSlots.indexOf(timeSlotSelection);
        day[0].timeSlots.splice(index, 1);
        await DayModel.updateOne({date: day[0].date}, {timeSlots: day[0].timeSlots})
        let appointment = {date: day[0].date, time: timeSlotSelection};
        req.user.appointments.push(appointment);
        await User.updateOne({email: req.user.email}, {appointments: req.user.appointments});
    });

    res.redirect('/selectDay');
    
})

// Calendar End //

//decides where the user get directed depending on their authentication status
app.post(
    "/login",
    checkNotAuthenticated,
    passport.authenticate("local", {
        //Successful authentication will redirect them to day selection
        successRedirect: "/",
        //Failure will redirect them to login page
        failureRedirect: "/login",
        failureFlash: true,
    })
);

app.post("/register", checkNotAuthenticated, async(req, res) => {
    const userFound = await User.findOne({ email: req.body.email })
    console.log(req)
    if (userFound) {
        req.flash("error", "User with that email already exists")
        res.redirect("/register")
    } else {
        try {
            //schema for user input
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            let admin = false;
            if(req.body.email == adminEmail){
                admin = true;
            }
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                isAdmin: admin,
            })
            //redirects user to login if sign up is successful
            await user.save();
            res.redirect("/login");
            //otherwise, keeps them in the sign up now page
        } catch (error) {
            console.log(error)
            res.redirect("/register");

        }
    }
});

//displays the appointments only for the logged in User
app.get('/myAppointments', checkAuthenticated, (req,res) => {
    if(req.user.isAdmin){
        db.collection('users').find().toArray()
        .then(results => {
            res.render('appointmentManager', {user: results})
        })
        .catch()
    }
    else{
        res.render('myAppointments', {appointments: req.user.appointments});
    }
    
});

app.delete("/logout", (req, res) => {
    req.logOut()
    req.session.destroy();
    res.redirect("/");
})

mongoose
    .connect('mongodb://localhost:27017/auth?directConnection=true', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })


app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) });
