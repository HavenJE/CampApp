
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

// The name of the database is yelp-camp - then Colt passed our options e.g. useNewUrl but that for some reason caused Nodemon to crash! 
mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected');
});

const app = express();


//Setting up, the veiw engine - where path is the global object and __dirname holds current directory address. Views is the folder where our all web pages will be kept. 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

// Up to PART 412 
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({title: "My Backyard", description: "cheap camping"})
//     await camp.save(); 
//     res.send(camp)
// })

// Will set different routes for Campgrounds e.g. campgrounds index "/campgrounds"
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    // Then we pass that to a template called index.ejs within the campgrounds folder
    res.render('campgrounds/index', { campgrounds })
})

// Campgrounds show route => eventually going to be the Details Page 
app.get('/campgrounds/:id', async (req, res) => {
    // Then we pass that to a template 
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground }); 
})

app.listen(3000, () => {
    console.log("Serving port 3000")
})


