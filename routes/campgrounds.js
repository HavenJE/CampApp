const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds'); 
const catchAsync = require('../utilities/CatchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');
// Multer middleware 
const multer  = require('multer')
// Cloudinary 
const {storage} = require('../cloudinary')
const upload = multer({ storage }); 



// Will set different routes for Campgrounds e.g. campgrounds index "/campgrounds"
router.get('/', catchAsync(campgrounds.index));

// New campground route (new)
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// This route is for making a new campground 
// To set the endpoint, the /campgrounds as POST where the form is submitted 
// We added catchAsync to catch any error and then hand it over by next() to the error handler router.use() at the end of the page. 
// upload.array('image') this should match the name attribute in our Form name="image"
// 
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

// Campgrounds show route => eventually going to be the Details Page 
router.get('/:id', catchAsync(campgrounds.showCampground));

// Campground Edit & Update - we need to look up the thing we are editing, so that could pre populate the form with the information. 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// Campground Update Route 
// After installing, requiring method override, we can set the PUT request 
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground));

// Route to remove a campground 
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router; 