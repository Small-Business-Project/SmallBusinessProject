require("dotenv").config();
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
//mongoose.connect('mongodb://localhost:27017/test');

const path = require('path');
const { allowedNodeEnvironmentFlags } = require('process');

const {
    checkAuthenticated,
    checkNotAuthenticated,
} = require('./middlewares/auth');


const initializePassport = require('./passport-config')
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

const app = express();
//.env file allows you to change your localhost connection port
dotenv.config({ path: 'config.env' })
const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny'));


// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index');
})
app.get('/selectDay', (req, res) => {
    res.render('selectDay');
})
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
})
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register');
})
app.get('/aboutUs', (req, res) => {
    res.render('aboutUs');
})
app.get('/generateDays', (req, res) => {
    res.render("generateDays");
})
app.post('/generateDays', (req, res) => {
    let from = new Date(req.body.generate.from);
    let to = new Date(req.body.generate.to);
    let startHour = 9;

    from.setHours(startHour);

    from.setDate(from.getDate() + 1);
    to.setDate(to.getDate() + 1);

    let times;
    let date;

    let currentDate = from;

    while (currentDate <= to) {
        times = [];
        while (currentDate.getHours() <= 16) {
            times.push(currentDate);
            currentDate.setHours(currentDate.getHours() + 1);
        }
        date = new DayModel({ date: currentDate, timeslots: times });

        date.save().then(function() {
            console.log("Added day to database!");
        }).catch(function(error) {
            console.log("Failed to add day to database!");
        });
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(startHour);

    }
    res.render("generateDays");
})

app.post(
    "/local",
    checkNotAuthenticated,
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })
);

app.post("/register", checkNotAuthenticated, async(req, res) => {
    const userFound = await User.findOne({ email: req.body.email })

    if (userFound) {
        req.flash("error", "User with that email already exists")
        res.redirect("/register")
    } else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })

            await user.save();
            res.redirect("/login");
        } catch (error) {
            console.log(error)
            res.redirect("/register");

        }
    }
});

app.delete("/logout", (req, res) => {
    req.logOut()
    res.redirect("/login");
})

app.get("/listTest", function(req, res) {
    DayModel.listAllDays().then(function(days) {
        res.render("listTest", { days: days });
    }).catch(function(error) {
        res.error("Something went wrong! " + error);
    });

});



// set view engine
app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.use(flash());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))


mongoose
    .connect('mongodb://localhost:27017/auth', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })


app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) });
