  const Joi = require('joi'); 
  
  // The line below, will validate our data before we even attempt to save it with Mongoose, before we attempt to save it with Mongoose. 
  module.exports.campgroundSchema = Joi.object({
    campground: Joi.object().required({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        locatoin: Joi.string().required(),
        desciption: Joi.string().required()
    })
}); 

