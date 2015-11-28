var mongoose = require('mongoose');
require('mongoose-moment')(mongoose);
var Schema = mongoose.Schema;

// create a schema
var eventSchema = new Schema({
    title: String,
    start: 'Moment',
    end: 'Moment',
    location: String,
    description: String
});

// the schema is useless so far
// we need to create a model using it
var Event = mongoose.model('Event', eventSchema);

// make this available to our users in our Node applications
module.exports = Event;
