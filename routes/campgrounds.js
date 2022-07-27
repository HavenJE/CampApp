const express = require('express');
const router = express.Router(); 
const catchAsync = require('../utilities/CatchAsync');
const { campgroundSchema} = require('../schemas.js');
const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground');


const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Will set different routes for Campgrounds e.g. campgrounds index "/campgrounds"
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    // Then we pass that to a template called index.ejs within the campgrounds folder
    res.render('campgrounds/index', { campgrounds })
}));

// New campground route (new)
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

// This route is for making a new campground 
// To set the endpoint, the /campgrounds as POST where the form is submitted 
// We added catchAsync to catch any error and then hand it over by next() to the error handler router.use() at the end of the page. 
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.Campground) throw new ExpressError('Invalid Campground Data', 400) // 400 code is for incomplete/invalid data 
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Campgrounds show route => eventually going to be the Details Page 
router.get('/:id', catchAsync(async (req, res) => {
    // Then we pass that to a template 
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // console.log(campground)
    res.render('campgrounds/show', { campground });
}));

// Campground Edit & Update - we need to look up the thing we are editing, so that could pre populate the form with the information. 
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));


// After installing, requiring method override, we can set the PUT request 
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    // res.send('IT WORKED! ITS UPDATED!')
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Route to remove a campground 
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router; 