
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session'); 
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const methodOverride = require('method-override');

const campgrounds = require('./routes/campgrounds'); 
const reviews = require('./routes/reviews'); 

// The name of the database is yelp-camp - then Colt passed our options e.g. useNewUrl but that for some reason caused Nodemon to crash! 
mongoose.connect('mongodb://localhost:27017/yelp-camp', )

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected');
});

const app = express();

// Tell app to use ejs engine 
app.engine('ejs', ejsMate);

//Setting up, the veiw engine - where path is the global object and __dirname holds current directory address. Views is the folder where our all web pages will be kept. 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

// To test hello.js alert
app.use(express.static(path.join(__dirname, 'public')))

// To set Express-session
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false, 
    saveUninitialized: true, 
}
app.use(session(sessionConfig))

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews) // we won't have acces to :id in the reviews route file becasue these routes are separate, unless we specify {mergeParams: true} to merge the params btw app.js & reviews.js
app.get('/', (req, res) => {
    res.render('home')
})

// Up to PART 412 
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({title: "My Backyard", description: "cheap camping"})
//     await camp.save(); 
//     res.send(camp)
// })

// Here, we are testing our Express error class - app.all => is for every single request - ('*') => referring to every path 
app.all('*', (req, res, next) => {
    // res.send('404!!!')
    next(new ExpressError('Page Not Found', 404)) // we pass the message inside the ExpressError 
})

// This is our basic error handling - or catcher for any error - the error comes from any of the previous routes and passed into the handler as long as the routes has next()
app.use((err, req, res, next) => {
    // res.send('Ooh boy....something went wrong') 
    // const { statusCode = 500, message = 'Something Went Wrong!' } = err;
    const { statusCode = 500 } = err;
    if (!err.message) err.message('Oh No....Something Went Wrong!')
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
});


