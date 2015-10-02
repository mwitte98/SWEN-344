//  Server Stuff

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');

var app = express();

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(methodOverride()); // simulate DELETE and PUT

// Set to the port to run the server on
var port = process.env.PORT || 8080;

// Listen on 'port' -> localhost:8080
app.listen(port);
console.log('Magic happens on port: ' + port);


// Expose the app module to mod exports to be used in other files
exports = module.exports = app;
