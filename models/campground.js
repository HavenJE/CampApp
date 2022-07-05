const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

// Making our schema - we could write the line below is new mongoose.Schema({ })
// Later on we could add another properties e.g. author, reviews 
const CampgroundSchema = new Schema({
    title: String, 
    price: String,
    description: String, 
    location: String
})

module.exports = mongoose.model('Campground', CampgroundSchema); 