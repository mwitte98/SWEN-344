var messagesApiRouter = require('express').Router();
var Message = require('../app/models/message');

// This will get called every time someone uses this route (/messages)
messagesApiRouter.use(function(req, res, next){
    next();
});

messagesApiRouter.get('/', isLoggedIn, function(req, res) {

   Message.find({}, { _id: false, sender: true, body: true }, function(err, messages) {
     if (err) throw err;

     res.render('messages.ejs', {user : req.user, messages: messages, requestTweets: false}); // get the user out of session and pass to template

   }).lean();

});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the login page
    res.redirect('/login');
}

module.exports = messagesApiRouter;
