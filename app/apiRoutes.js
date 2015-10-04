// Private API calls
// Could be to database, or general purpose routes, we can work this out later

var privateApiRouter = require('express').Router();
var http = require('http');

// This will get called every time someone uses this route (/api)
privateApiRouter.use(function(req, res, next){
   console.log('Request made to /api/' + req.method); // Print out the HTTP method used -> usually GET or POST
   next();
});

privateApiRouter.get('/', function(req, res) {
   res.send("Hello from Private API router");
});

privateApiRouter.get('/search', function(req, res) {
    console.log(req.query);
    url = "http://dev.markitondemand.com/Api/v2/Lookup/json?input=" + req.query.search;

    // get is a simple wrapper for request()
    // which sets the http method to GET
    var request = http.get(url, function (response) {
        // data is streamed in chunks from the server
        // so we have to handle the "data" event    
        var buffer = "", 
            data,
            route;

        response.on("data", function (chunk) {
            buffer += chunk;
        }); 

        response.on("end", function (err) {
            // finished transferring data
            // dump the raw data
            console.log(buffer);
            res.send(JSON.parse(buffer));
        }); 
    });
});

privateApiRouter.get('/quote', function(req, res) {
    console.log(req.query);
    url = "http://dev.markitondemand.com/Api/v2/Quote/json?symbol=" + req.query.symbol;

    // get is a simple wrapper for request()
    // which sets the http method to GET
    var request = http.get(url, function (response) {
        // data is streamed in chunks from the server
        // so we have to handle the "data" event    
        var buffer = "", 
            data,
            route;

        response.on("data", function (chunk) {
            buffer += chunk;
        }); 

        response.on("end", function (err) {
            // finished transferring data
            // dump the raw data
            console.log(buffer);
            res.send(JSON.parse(buffer));
        }); 
    });
});

privateApiRouter.get('/chart', function(req, res) {
    console.log(req.query);
    url = "http://dev.markitondemand.com/Api/v2/InteractiveChart/json?parameters=" + req.query.parameters;

    // get is a simple wrapper for request()
    // which sets the http method to GET
    var request = http.get(url, function (response) {
        // data is streamed in chunks from the server
        // so we have to handle the "data" event    
        var buffer = "", 
            data,
            route;

        response.on("data", function (chunk) {
            buffer += chunk;
        }); 

        response.on("end", function (err) {
            // finished transferring data
            // dump the raw data
            console.log(buffer);
            res.send(JSON.parse(buffer));
        }); 
    });
});

module.exports = privateApiRouter;
