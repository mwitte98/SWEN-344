var calApiRouter = require('express').Router();

// This will get called every time someone uses this route (/calendar)
calApiRouter.use(function(req, res, next){
    next();
});

calApiRouter.get('/', isLoggedIn, function(req, res) {
    res.render('calendar');
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the login page
    res.redirect('/login');
}

module.exports = calApiRouter;
