
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); 
const Campground = require('./models/campground');
const methodOverride = require('method-override');

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
});

// New campground route (new)
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
// To set the endpoint, the /campgrounds as POST where the form is submitted 
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

// Campgrounds show route => eventually going to be the Details Page 
app.get('/campgrounds/:id', async (req, res) => {
    // Then we pass that to a template 
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

// Campground Edit & Update - we need to look up the thing we are editing, so that could pre populate the form with the information. 
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})


// After installing, requiring method override, we can set the PUT request 
app.put('/campgrounds/:id', async (req, res) => {
    // res.send('IT WORKED! ITS UPDATED!')
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds'); 
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
});


