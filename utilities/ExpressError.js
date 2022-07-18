class ExpressError extends Error {
    constructor (message, statusCode) {
        super(); 
        this.message = message;
        this.statusCode = statusCode; 
    }
}

module.exports = ExpressError; 

// if we need this ExpressError utility, we can throw it somewhere 