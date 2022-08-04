
const Campground = require('../models/campground');
const Review = require('../models/review');

// create review 
module.exports.createReview = async (req, res) => {
    // res.send('YOU MADE IT!!')
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review); // you wrote .review because in the show.ejs form, you specified the name attribue on the label/input to be review. 
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfuly created new review!');
    res.redirect(`/campgrounds/${campground._id}`); // we redirect to the show page 
}

// delete review 
module.exports.deleteReview = async (req, res) => {
    // res.send('DELETE MY REVIEW!')
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfuly deleted review!');
    res.redirect(`/campgrounds/${id}`); // this will send you back to the campground page 
}