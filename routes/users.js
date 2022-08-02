const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/CatchAsync');
const User = require('../models/user');
// for user controller
const users = require('../controllers/users'); 

router.get('/register', users.renderRegister)

router.post('/register', catchAsync(users.register))

// login routes - two routes 
router.get('/login', users.renderLogin)

// this is the one that make sure we are login in - ('local') => here is a passport strategy 
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// Logout route - req.logout() is now an asynchronous function - check link: https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
router.get('/logout', users.logout)

module.exports = router; 