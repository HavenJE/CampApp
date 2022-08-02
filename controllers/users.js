
const User = require('../models/user');


module.exports.renderRegister =  (req, res) => {
    res.render('users/register'); // users is a folder under vies, within users we have register file
}

// register a user
module.exports.register = async (req, res, next) => {
    try {
        // res.send(req.body) // this is to check our enteries on the register form is working 
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            } else {
                console.log(registeredUser);
                req.flash('success', 'Welcome to CampApp');
                res.redirect('/campgrounds');
            }
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

// render user login 
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}


module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/compgrounds'; 
    delete req.session.returnTo; 
    res.redirect(redirectUrl)
}

// user logout 
module.exports.logout = (req, res) => {
    req.logout(function(err) {
        if(err) return next(err); 
    }); 
    req.flash('sucess', 'You logged out! See you soon!')
    res.redirect('/campgrounds');
}