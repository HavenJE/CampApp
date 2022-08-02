
const express = require('express');
const router = express.Router({mergeParams: true}); 
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
// The two models 
const Campground = require('../models/campground');
const Review = require('../models/review');
// The controller 
const reviews = require('../controllers/reviews'); 
// This is our Joi schema, not mongoose schmea 
const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/CatchAsync');


// Route to create a review 
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// route for deleting the review 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router; 