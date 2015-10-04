// var Twit = require('twit');
var swenApp = angular.module('swenApp', []);

swenApp.controller('mainCtrl', function($scope, $http) {

  $scope.thing = "Home Page";
  $scope.stocks = "Stocks Page";
  $scope.calendar = "Calendar Page";

  // Searches for stocks given a symbol or company name.
  $scope.searchStocks = function(searchField) {
    url = "http://localhost:8080/api/search?search=" + $scope.searchField;

    // get is a simple wrapper for request()
    // which sets the http method to GET
    console.log(url);
    var request = $http.get(url, function (response) {
      console.log(response);
      $scope.stockObjects = response;
    });
  };


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

  // var client = new Twit({
  //   consumer_key: 'r4cTkfnBkJJjSUTLlOD1EmsuU',
  //   consumer_secret: 'lbcsBYcvwQ78lG6jyRVvt2rvc1nBeo3zMGwsFjh6ZiAvSO3Q7K',
  //   access_token: '318712270-9QgkxVRxilSkMOMcUr1gNjGCUIIfwIhy6whDDRYq',
  //   access_token_secret: '5s834WgK6OBkiSY1gaeutaht7bNfvhoNwKG0X3mXa4fn4'
  // });
  // 
  // var stream = client.stream('user');
  // var tweetList = [];
  // 
  // stream.on('tweet', function(tweet) {
  //   tweetList.push(tweet);
  //   console.log(tweet.text);
  // });

});
