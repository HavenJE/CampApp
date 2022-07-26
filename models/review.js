const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const reviewSchema = new Schema({
    body: String, 
    rating: Number
}); 

module.exports = mongoose.model('Review', reviewSchema); 

// we are going to connect review model with campground model in a one-to-many relationship 
// we are going to embed an array of object IDs in each campground, that means, we need to update campground Schema 