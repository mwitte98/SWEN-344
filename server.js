var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var Twit = require('twit');

// ********** Socket IO Setup **********

var server = require('http').Server(app);
var io = require('socket.io')(server);

require('./app/config/socket')(io);

// ********** End Socket IO Setup **********

// Config database connection
mongoose.connect('mongodb://localhost/SWEN344');

require('./app/config/passport')(passport); // pass passport for configuration

app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules/highcharts-ng/dist/'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'goodnightsweetprince' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/routes.js')(app, passport, Twit, io);

// PRIVATE API routes
app.use('/stocks', require('./app/stockRoutes.js'));
app.use('/calendar', require('./app/calendarRoutes.js'));
app.use('/messages', require('./app/messagesRoutes.js'));


// START SERVER

// Listen on 'port' -> localhost:8080
server.listen(port, function() {
   console.log("The magic happens on port " + port);
});
