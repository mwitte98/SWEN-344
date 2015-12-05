var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var noteSchema = new Schema({
    desc: String,
    stock: String,
});

// the schema is useless so far
// we need to create a model using it
var Note = mongoose.model('Note', noteSchema);

// make this available to our users in our Node applications
module.exports = Note;
