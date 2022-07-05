// we are going to make this file self-contained so that we can run this file from its own separately from our Node app every time we want to seed our database. 
// we connect to mangoose 

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities'); 
const { places, descriptors } = require('./seedHelpers'); // this help us pick random place & descriptor 

// The name of the database is yelp-camp - then Colt passed our options e.g. useNewUrl but that for some reason caused Nodemon to crash! 
mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected'); 
});


// To pick a random number from an array 
const sample = array => array[Math.floor(Math.random() * array.length)]; 


// make an aysnc function - we delete everything, then we make some new campgrounds 
const seedDB = async () => {
    await Campground.deleteMany({}); 
    // const c = new Campground({title: 'purple field'}); 
    // await c.save(); 

    // below we goingt to pick a random number btw 1-1000 to pick a city from cities.js file that contains 1000 cities data 
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000) 

        // we make a new Campground and set the location of it 
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save(); 
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})


// random1000 represents one of the cities array e.g. 
// {
//     city: "New York",
//     growth_from_2000_to_2013: "4.8%",
//     latitude: 40.7127837,
//     longitude: -74.0059413,
//     population: "8405837",
//     rank: "1",
//     state: "New York",
// }

// [random1000].city represents the city e.g. "New York"