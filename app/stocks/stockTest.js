// Stock API calls.
// Run this file from the command line and type in
// a stock symbol when prompted..
// Needs to be hooked up to front end.
// Run "npm install prompt" if you get an error.


// Searches for stocks given a symbol or company name.
function searchStocks(symbolOrName) {
    var http = require("http");
        url = "http://dev.markitondemand.com/Api/v2/Lookup/json?input=" + symbolOrName;

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
            console.log("Searching for '" + symbolOrName + "'...\n")
            console.log(buffer);
            console.log("\n");
            data = JSON.parse(buffer);
        }); 
    });
}


// Pulls up a stock quote given a symbol.
function getStockQuote(symbol) {
    var http = require("http");
        url = "http://dev.markitondemand.com/Api/v2/Quote/json?symbol=" + symbol;

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
            console.log("Getting stock quote of '" + symbol + "'...\n")
            console.log(buffer);
            console.log("\n");
            data = JSON.parse(buffer);
        });
    });
}


// Gets the required chart data given JSON encoded input parameters.
function getStockChartData(chartInput) {
    var http = require("http");
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
            console.log("Getting chart data...\n")
            console.log(buffer);
            console.log("\n");
            data = JSON.parse(buffer);
        });
    });
}

// Prompt for command-line input and display results of API calls:

var prompt = require('prompt');

  var properties = [
    {
      name: 'symbol'
    }
  ];

  prompt.start();

  prompt.get(properties, function (err, result) {
    if (err) { return onErr(err); }
    var tickerSymbol = result.symbol

    searchStocks(tickerSymbol);
    getStockQuote(tickerSymbol);

    var chartInput = JSON.stringify({  
        Normalized: false,
        NumberOfDays: 5,
        DataPeriod: "Day",
        Elements: [
            {
                Symbol: tickerSymbol,
                Type: "price",
                Params: ["ohlc"] // ohlc, c = close only
            },
            {
                Symbol: tickerSymbol,
                Type: "volume"
            }
        ]
    });

    getStockChartData(chartInput);

  });


// Log error if there is one..
function onErr(err) {
    console.log(err);
    return 1;
}
