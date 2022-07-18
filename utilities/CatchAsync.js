// Here, we returning a function that accepts a function 

module.exports = func => {
    return (req, res, next) => { // a new function is returned here that as func executed and then catches any errors and passes them to next. 
        func(req, res, next).catch(next); 
    }
}