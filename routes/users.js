const express = require('express');
const router = express.Router();
const passport = require('passport'); 
const catchAsync = require('../utilities/CatchAsync');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register'); // users is a folder under vies, within users we have register file
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        // res.send(req.body) // this is to check our enteries on the register form is working 
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', 'Welcome to CampApp');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

}))

// login routes - two routes 
router.get('/login', (req, res) => {
    res.render('users/login');
})

// this is the one that make sure we are login in - ('local) => here is a passport strategy 
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!'); 
    res.redirect('/campgrounds')
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('sucess', 'You logged out! Goodbye!')
    res.redirect('/campgrounds'); 
})

module.exports = router; 