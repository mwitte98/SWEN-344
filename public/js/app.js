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
    var request = $http.get(url)
    .then(function(response) {
      $scope.stockObjects = response.data;
    })
  };


  // Gets a stock quote given a symbol.
  $scope.getStockQuote = function() {
    stockQuote($scope.queryField);
    chartQuote($scope.queryField);
  }

  stockQuote = function(symbol) {
    url = "http://localhost:8080/api/quote?symbol=" + symbol;

    // get is a simple wrapper for request()
    // which sets the http method to GET
    console.log(url);
    var request = $http.get(url).then(function (response) {
      //console.log(response.data);
      $scope.stockQuote = response.data;
    });
  }

  chartQuote = function(symbol) {

    chartUrl = "http://localhost:8080/api/chart?symbol=" + symbol;
    console.log("got here");
    var chartRequest = $http.get(chartUrl).then(function (response) {
      console.log(response.data);
      $scope.stockQuoteChart = response.data;
      console.log($scope.stockQuoteChart);
    });
    console.log("got here too");
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
