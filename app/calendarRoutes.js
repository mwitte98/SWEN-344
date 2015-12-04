var calApiRouter = require('express').Router();
var User = require('../app/models/user');
var Event = require('../app/models/event');

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
    // Send events array for logged in user
    res.send(req.user.events);
});

calApiRouter.get('/new', isLoggedIn, function(req, res) {
    // Create new event
    var newEvent = Event({
        title: req.query.title,
        start: req.query.start,
        end: req.query.end,
        location: req.query.location,
        description: req.query.description
    });
    
    // Return error if event already exists
    var events = req.user.events;
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (newEvent.title == event.title &&
            newEvent.start == event.start &&
            newEvent.end == event.end &&
            newEvent.location == event.location &&
            newEvent.description == event.description) {
            res.send({ "error": true });
            return;
        }
    }
    
    // Save new event
    newEvent.save(function(err) {
        if (err) throw err;
        
        // Add event to events array of logged in user
        events.push(newEvent);
        
        // Update events array of logged in user in the db
        User.findOneAndUpdate({ 'twitterID': req.user.twitterID }, {$set: { 'events': events }}, { new: true }, function(err, updatedUser) {
            if (err) throw err;
        });
        
        // AJAX request is expecting JSON back
        res.send({ "success": "Event created successfully" });
    });
    
});

calApiRouter.get('/delete', isLoggedIn, function(req, res) {
    
    var newEvent = {
        title: req.query.title,
        start: req.query.start,
        end: req.query.end,
        location: req.query.location,
        description: req.query.description
    };
    
    // find event from req.query in req.user.events
    var events = req.user.events;
    for (var eventIndex = 0; eventIndex < events.length; eventIndex++) {
        var event = events[eventIndex];
        if (newEvent.title == event.title &&
            newEvent.start == event.start &&
            newEvent.end == event.end &&
            newEvent.location == event.location &&
            newEvent.description == event.description) {
            break;
        }
    }
    
    // remove that event from array
    events.splice(eventIndex, 1);
    
    // save updated user
    User.findOneAndUpdate({ 'twitterID': req.user.twitterID }, {$set: { 'events': events }}, { new: true }, function(err, updatedUser) {
        if (err) throw err;
        
        // delete event
        Event.findOneAndRemove(newEvent, function(err) {
            if (err) throw err;
        });
    });
    
    // AJAX request is expecting JSON back
    res.send({ "success": "Event deleted successfully" });
    
});

module.exports = calApiRouter;
