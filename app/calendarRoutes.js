var calApiRouter = require('express').Router();
var User = require('../app/models/user');
var Event = require('../app/models/event');
var moment = require('moment');

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

calApiRouter.get('/all', isLoggedIn, function(req, res) {
    console.log("calendarRoutes.js - /all");
    console.log(req.user);
    
    // Send events array for logged in user
    res.send(req.user.events);
});

calApiRouter.get('/new', isLoggedIn, function(req, res) {
    console.log("calendarRoutes.js - /new");
    console.log(req.query);
    
    // Create new event
    var newEvent = Event({
        title: req.query.title,
        start: moment(req.query.startDate),
        end: moment(req.query.endDate),
        location: req.query.location,
        description: req.query.description
    });
    console.log("New event: " + newEvent);
    
    // Save new event
    newEvent.save(function(err) {
        if (err) throw err;
        
        console.log('Event created!');
        
        // Add event to events array of logged in user
        var events = req.user.events;
        events.push(newEvent);
        console.log("Events: " + events);
        
        // Update events array of logged in user in the db
        User.findOneAndUpdate({ 'twitterID': req.user.twitterID }, {$set: { 'events': events }}, { new: true }, function(err, updatedUser) {
            if (err) throw err;
            
            console.log("Updated user: " + updatedUser);
        });
        
        // AJAX request is expecting JSON back
        res.send({});
    });
    
});

calApiRouter.get('/delete', isLoggedIn, function(req, res) {
    console.log("calendarRoutes.js - /delete");
    console.log(req.query);
    
    // find event from req.query in req.user.events
    
    // remove that event from array
    
    // save updated user
    
    // delete event
    
    // AJAX request is expecting JSON back
    res.send({});
    
});

module.exports = calApiRouter;
