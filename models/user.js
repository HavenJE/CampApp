const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const passportLocalMongoose = require('passport-local-mongoose'); 

const UserSchema = new Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    }
})

// We installed passportLocalMongoose to use Schema.plugin => this is going to add on a username & password to our Schema 
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema); 
