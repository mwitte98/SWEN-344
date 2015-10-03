//  Server Stuff

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');
var http = require('http');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(methodOverride()); // simulate DELETE and PUT



// Any routes defined in apiRoutes.js will be mounted to the /api prefix
app.use('/api', require('./app/apiRoutes.js'));

//  If we don't know the route (ex: '/hello'), then do this
app.get('/', function(req, res) {
   res.sendFile("public/views/index.html", {root: __dirname });
})


// Set to the port to run the server on
var port = process.env.PORT || 8080;

// START SERVER

// Listen on 'port' -> localhost:8080
app.listen(port, function() {
   console.log("Live on port " + port);
});

// Expose the app module to module exports to be used in other files
exports = module.exports = app;
