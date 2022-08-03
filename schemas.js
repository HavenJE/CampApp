  const Joi = require('joi'); 
  
  // The line below, will validate our data before we even attempt to save it with Mongoose, before we attempt to save it with Mongoose. 
  module.exports.campgroundSchema = Joi.object({
    campground: Joi.object().required({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        locatoin: Joi.string().required(),
        desciption: Joi.string().required()
    }).required()
}); 

// Review schema 
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required()
})