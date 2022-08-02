
const { campgroundSchema, reviewSchema } = require('./schemas.js');

const ExpressError = require('./utilities/ExpressError'); 
const Campground = require('./models/campground'); 
const Review = require('./models/review'); 

module.exports.isLoggedIn = (req, res, next) => {
   
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next(); 
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// middleware to verfiy an author to a campground
module.exports.isAuthor = async(req, res, next) => {
    // in the line below, we take the id from the url 
    const { id } = req.params; 
    // in the line below, we look to the campground with that ID 
    const campground = await Campground.findById(id); 
    // the condition below is to check if the logged in user is the same to the campground auther to be allowed to update the campground, if not, will be redirected
    // And if you do, then you will be able to findByIdAndUpdate 
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!'); 
        return res.redirect(`/campgrounds/${id}`); 
    }
    next(); 
}

// middleware to verfiy reviews 
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// middleware to verfiy an author to a review
module.exports.isReviewAuthor = async(req, res, next) => {
    // in the line below, we take the id from the url 
    const { id, reviewId } = req.params; 
    // in the line below, we look to the Review with that reviewId 
    const review = await Review.findById(reviewId); 
    // the condition below is to check if the logged in user is the same to the review auther to be allowed to update the review, if not, will be redirected
    // And if you do, then you will be able to findByIdAndUpdate 
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!'); 
        return res.redirect(`/campgrounds/${id}`); 
    }
    next(); 
}