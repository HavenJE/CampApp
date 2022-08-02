const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/CatchAsync');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');



// Will set different routes for Campgrounds e.g. campgrounds index "/campgrounds"
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    // Then we pass that to a template called index.ejs within the campgrounds folder
    res.render('campgrounds/index', { campgrounds })
}));

// New campground route (new)
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

// This route is for making a new campground 
// To set the endpoint, the /campgrounds as POST where the form is submitted 
// We added catchAsync to catch any error and then hand it over by next() to the error handler router.use() at the end of the page. 
// Here, we can associate the campground we creating to the with the currnetly logged in user, do it before the save - line 41
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.Campground) throw new ExpressError('Invalid Campground Data', 400) // 400 code is for incomplete/invalid data 
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfuly made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Campgrounds show route => eventually going to be the Details Page 
router.get('/:id', catchAsync(async (req, res) => {
    // Then we pass that to a template 
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author' // populate on each of the reviews their authors 
        }
    }).populate('author'); // then separately populate the one author on this campground 
    console.log(campground)
    
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds') // redirect to index page 
    }
    res.render('campgrounds/show', { campground });
}));

// Campground Edit & Update - we need to look up the thing we are editing, so that could pre populate the form with the information. 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    // first, find the campground 
    const campground = await Campground.findById(id);
    // Second, check if there is no campground at all - then sorry, we can't find it 
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds') // redirect to index page 
    }
    res.render('campgrounds/edit', { campground });
}));

// Campground Update Route 
// After installing, requiring method override, we can set the PUT request 
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    // res.send('IT WORKED! ITS UPDATED!')
    const { id } = req.params;
    const campground = await Campground.findById(AndUpdate(id, { ...req.body.campground }))
    req.flash('success', 'Successfuly updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Route to remove a campground 
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfuly deleted campground!');
    res.redirect('/campgrounds');
}));

module.exports = router; 