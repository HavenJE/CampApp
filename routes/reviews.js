
const express = require('express');
const router = express.Router({mergeParams: true}); 
// The two models 
const Campground = require('../models/campground');
const Review = require('../models/review');

// This is our Joi schema, not mongoose schmea 
const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/CatchAsync');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Route to create a review 
router.post('/', validateReview, catchAsync(async (req, res) => {
    // res.send('YOU MADE IT!!')
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review); // you wrote .review because in the show.ejs form, you specified the name attribue on the label/input to be review. 
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`); // we redirect to the show page 
}))

// route for deleting the review 
router.delete('/:reviewId', catchAsync(async (req, res) => {
    // res.send('DELETE MY REVIEW!')
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`); // this will send you back to the campground page 
}))

module.exports = router; 