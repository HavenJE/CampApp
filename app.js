
// (process.env.NODE_ENV) is environment variable 
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET)
console.log(process.env.API_KEY)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');

const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
// const helmet = require('helmet');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const ExpressMongoSanitize = require('express-mongo-sanitize');
const MongoDBStore = require('connect-mongo');

// The name of the database is yelp-camp - then Colt passed our options e.g. useNewUrl but that for some reason caused Nodemon to crash! 
// || 
// process.env.DB_URL
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected');
});

const app = express();

// Tell app to use ejs engine 
app.engine('ejs', ejsMate);

//Setting up, the view engine - where path is the global object and __dirname holds current directory address. Views is the folder where our all web pages will be kept. 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

// To test hello.js alert
app.use(express.static(path.join(__dirname, 'public')))

// To sanitize mongo from injection
app.use(ExpressMongoSanitize({
    replaceWith: '_'
}))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'; 

// 
const store = new MongoDBStore({
    mongoUrl: dbUrl, // don't use url only 
    secret: secret,
    touchAfter: 24 * 60 * 60 // time in seconds 
})

store.on('error', function(e){
    console.log('SESSION STORE ERROR!', e)
})

// To set Express-session
const sessionConfig = {
    store: store, 
    name: 'session', // this is to avoid the default name connect.sid that anyone could find when inspect the page under application tab. 
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7, // time in mili-seconds 
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

// To set connect-flash
app.use(flash());

// To set helmet
// app.use(helmet({ contentSecurityPolicy: false }));

// To set passport authorisation 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

// these two methods below are added in thanks to plugin passport local mongoose
passport.serializeUser(User.serializeUser()); // this line means how do you store a user in the session 
passport.deserializeUser(User.deserializeUser()); // this line means how to unstore a user in the session 

// Define a middleware
app.use((req, res, next) => {
    console.log(req.query)
    res.locals.currentUser = req.user; // All the templates, we should have currentUser
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async (req, res) => {
//     // the line below is an instance of the user or can also be called a user object 
//     const user = new User({email: 'haven@gmail.com', username: 'haven'})
//     const newUser = await User.register(user, 'haven81') // 'haven81' is the password 
//     res.send(newUser); 
// })

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes) // we won't have acces to :id in the reviews route file becasue these routes are separate, unless we specify {mergeParams: true} to merge the params btw app.js & reviews.js
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


