// Private API calls
// Could be to database, or general purpose routes, we can work this out later

var stocksApiRouter = require('express').Router();
var http = require('http');

// This will get called every time someone uses this route (/stocks)
stocksApiRouter.use(function(req, res, next){
   console.log('Request made to /stocks/' + req.method); // Print out the HTTP method used -> usually GET or POST
   next();
});

stocksApiRouter.get('/', function(req, res) {
   res.render('stocks.ejs');
});

stocksApiRouter.get('/search', function(req, res) {
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

stocksApiRouter.get('/quote', function(req, res) {
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

stocksApiRouter.get('/chart', function(req, res) {
    console.log(req.query);

    var chartInput = JSON.stringify({
        Normalized: false,
        NumberOfDays: 5,
        DataPeriod: "Day",
        Elements: [
            {
                Symbol: req.query.symbol,
                Type: "price",
                Params: ["ohlc"] // ohlc, c = close only
            },
            {
                Symbol: req.query.symbol,
                Type: "volume"
            }
        ]
    });

    url = "http://dev.markitondemand.com/Api/v2/InteractiveChart/json?parameters=" + chartInput;

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

module.exports = stocksApiRouter;
