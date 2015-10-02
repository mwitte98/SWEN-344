//  Server Stuff

var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

var app = express();

// Set to the port to run the server on
var port = process.env.PORT || 8080;

// Get all data from POST parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Listen on 'port' -> localhost:8080
app.listen(port);
console.log('Magic happens on port: ' + port);


// Expose the app module to mod exports to be used in other files
exports = module.exports = app;
