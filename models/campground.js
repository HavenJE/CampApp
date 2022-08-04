const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


// we separated the images from the CampgroundSchema and made it as a separate schema so that we could add a virtual property
// this is say; every image has a url and filename
const ImageSchema = new Schema({
    url: String,
    filename: String
})

// setting up a virtual property to resize the images 
ImageSchema.virtual('thumbnail').get(function () {
   return this.url.replace('/upload', '/upload/w_200/h_200'); 
})

// Making our schema - we could write the line below is new mongoose.Schema({ })
// Later on we could add another properties e.g. author, reviews 
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // its going to refer to the User model 
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

// 'findOneAndDelete' => is a query middleware and its going to pass in a document (doc) if found and deleted it to the function 
// what we are saying below that, this (doc) has reviews, and we are going to delete all reviews where their ID field (_id:) is in our doc.reviews that was just deleted 
// in its reviews array. 
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    // console.log('DELETED!')
    // console.log(doc)
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema); 