const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/CatchAsync');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register'); // users is a folder under vies, within users we have register file
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        // res.send(req.body) // this is to check our enteries on the register form is working 
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            } else {
                console.log(registeredUser);
                req.flash('success', 'Welcome to CampApp');
                res.redirect('/campgrounds');
            }
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

// login routes - two routes 
router.get('/login', (req, res) => {
    res.render('users/login');
})

// this is the one that make sure we are login in - ('local') => here is a passport strategy 
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/compgrounds'; 
    delete req.session.returnTo; 
    res.redirect('/campgrounds')
})

// Logout route - req.logout() is now an asynchronous function - check link: https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if(err) return next(err); 
    }); 
    req.flash('sucess', 'You logged out! See you soon!')
    res.redirect('/campgrounds');
})

module.exports = router; 