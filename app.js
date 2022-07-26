
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utilities/CatchAsync');
const ExpressError = require('./utilities/ExpressError');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const Review = require('./models/review');
const review = require('./models/review');

// The name of the database is yelp-camp - then Colt passed our options e.g. useNewUrl but that for some reason caused Nodemon to crash! 
mongoose.connect('mongodb://localhost:27017/yelp-camp')

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

const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

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
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    // Then we pass that to a template called index.ejs within the campgrounds folder
    res.render('campgrounds/index', { campgrounds })
}));

// New campground route (new)
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// This route is for making a new campground 
// To set the endpoint, the /campgrounds as POST where the form is submitted 
// We added catchAsync to catch any error and then hand it over by next() to the error handler app.use() at the end of the page. 
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.Campground) throw new ExpressError('Invalid Campground Data', 400) // 400 code is for incomplete/invalid data 
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Campgrounds show route => eventually going to be the Details Page 
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    // Then we pass that to a template 
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // console.log(campground)
    res.render('campgrounds/show', { campground });
}));

// Campground Edit & Update - we need to look up the thing we are editing, so that could pre populate the form with the information. 
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));


// After installing, requiring method override, we can set the PUT request 
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    // res.send('IT WORKED! ITS UPDATED!')
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Route to remove a campground 
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

// Route to create a review 
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    // res.send('YOU MADE IT!!')
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review); // you wrote .review because in the show.ejs form, you specified the name attribue on the label/input to be review. 
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`); // we redirect to the show page 
}))

// route for deleting the review 
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    // res.send('DELETE MY REVIEW!')
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`); // this will send you back to the campground page 
}))


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


