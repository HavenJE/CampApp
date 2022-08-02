
const express = require('express');
const router = express.Router({mergeParams: true}); 
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
// The two models 
const Campground = require('../models/campground');
const Review = require('../models/review');

// This is our Joi schema, not mongoose schmea 
const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/CatchAsync');


// Route to create a review 
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    // res.send('YOU MADE IT!!')
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review); // you wrote .review because in the show.ejs form, you specified the name attribue on the label/input to be review. 
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfuly created new review!');
    res.redirect(`/campgrounds/${campground._id}`); // we redirect to the show page 
}))

// route for deleting the review 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    // res.send('DELETE MY REVIEW!')
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfuly deleted review!');
    res.redirect(`/campgrounds/${id}`); // this will send you back to the campground page 
}))

module.exports = router; 