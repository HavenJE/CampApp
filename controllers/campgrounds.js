
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

// campground index page 
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    // Then we pass that to a template called index.ejs within the campgrounds folder
    res.render('campgrounds/index', { campgrounds })
}

// new campground  
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

// Create campground
// Here, we can associate the campground we creating to the with the currnetly logged in user, do it before the save 
module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.Campground) throw new ExpressError('Invalid Campground Data', 400) // 400 code is for incomplete/invalid data 

    const campground = new Campground(req.body.campground);
    // line below; we are mapping over the array that has been added to req.files by Multer, and we only one to present the image path, and image filename 
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfuly made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

// show campground 
module.exports.showCampground = async (req, res) => {
    // Then we pass that to a template 
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author' // populate on each of the reviews their authors 
        }
    }).populate('author'); // then separately populate the one author on this campground 

    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds') // redirect to index page 
    }
    res.render('campgrounds/show', { campground });
}


// Edit campground 
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    // first, find the campground 
    const campground = await Campground.findById(id);
    // Second, check if there is no campground at all - then sorry, we can't find it 
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds') // redirect to index page 
    }
    res.render('campgrounds/edit', { campground });
}

// update campground
module.exports.updateCampground = async (req, res) => {
    // res.send('IT WORKED! ITS UPDATED!')
    const { id } = req.params;
    console.log(req.body); 
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs); // to add more images to the existing ones, we need to push into the imgs with the spread operator 
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); // to delete the img filename from cloudinary 
        }
        // pull from the images array, all the images where the filename of that image is in the req.body.deleteImages array 🤦‍♂️
       await campground.updateOne({ $pull: {images: {filename: {$in: req.body.deleteImages}}}})
       // console.log(campground)
    }
    req.flash('success', 'Successfuly updated campground!');    
    res.redirect(`/campgrounds/${campground._id}`)
}

// delete campground 
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfuly deleted campground!');
    res.redirect('/campgrounds');
}

