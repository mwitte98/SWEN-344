// Stocks Router API
// Anything Stock Related Goes Here


var stocksApiRouter = require('express').Router();
var http = require('http');

// This will get called every time someone uses this route (/stocks)
stocksApiRouter.use(function(req, res, next) {
    next();
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the login page
    res.redirect('/login');
}

stocksApiRouter.get('/', isLoggedIn, function(req, res) {
    res.render('stocks.ejs', {user : req.user});
});

stocksApiRouter.get('/search', isLoggedIn, function(req, res) {

    console.log(req.query);

    // This is the url we hit to get JSON back from the Markit API
    // ***** Apparently the 'document moved' to the url below that now includes 'MODApis' *****
    var lookupUrl = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=" + req.query.search;

    var request = http.get(lookupUrl, function (response) {

        // Data is streamed in chunks from the server, so we have to handle the "data" event
        var buffer = "", data, route;

        response.on("data", function (chunk) {
            buffer += chunk;
        });

        response.on("end", function (err) {
            // Finished transferring data, dump the raw data
            //console.log("Search Buffer: " + buffer);
            res.send(JSON.parse(buffer));
        });
    });
});

stocksApiRouter.get('/quote', isLoggedIn, function(req, res) {

    console.log(req.query);

    var quoteUrl = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=" + req.query.symbol;

    var request = http.get(quoteUrl, function (response) {

        var buffer = "", data, route;

        response.on("data", function (chunk) {
            buffer += chunk;
        });

        response.on("end", function (err) {
            //console.log("Quote Buffer: " + buffer);
            res.send(JSON.parse(buffer));
        });
    });
});

stocksApiRouter.get('/chart', isLoggedIn, function(req, res) {

    console.log(req.query);

    var today = new Date(); // Get today's date
    var todayISO = today.toISOString(); // Put date into ISO format (for Markit API)
    console.log("Today ISO: " + todayISO);

    var lastYearToday = new Date();
    lastYearToday.setYear(lastYearToday.getFullYear() - 1);
    var lastYearTodayISO = lastYearToday.toISOString();
    console.log("Last Year ISO: " + lastYearTodayISO);

    var chartInput = JSON.stringify({
        Normalized: false,
        NumberOfDays: 365,
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

    var chartUrl = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=" + chartInput;

    var request = http.get(chartUrl, function (response) {

        var buffer = "", data, route;

        response.on("data", function (chunk) {
            buffer += chunk;
        });

        response.on("end", function (err) {
            console.log("Chart Buffer: " + buffer);
            res.send(JSON.parse(buffer));
        });
    });

});

module.exports = stocksApiRouter;
