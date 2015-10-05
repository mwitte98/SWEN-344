// var Twit = require('twit');
var swenApp = angular.module('swenApp', []);

swenApp.controller('mainCtrl', function($scope, $http) {

  $scope.thing = "Home Page";
  $scope.stocks = "Stocks Page";
  $scope.calendar = "Calendar Page";

  // Searches for stocks given a symbol or company name.
  $scope.searchStocks = function(searchField) {
    url = "http://127.0.0.1:8080/stocks/search?search=" + $scope.searchField;

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
    url = "http://127.0.0.1:8080/stocks/quote?symbol=" + symbol;

    // get is a simple wrapper for request()
    // which sets the http method to GET
    console.log(url);
    var request = $http.get(url).then(function (response) {
      //console.log(response.data);
      $scope.stockQuote = response.data;
    });
  }

  chartQuote = function(symbol) {

    chartUrl = "http://127.0.0.1:8080/stocks/chart?symbol=" + symbol;
    console.log("got here");
    var chartRequest = $http.get(chartUrl).then(function (response) {
      console.log(response.data);
      $scope.stockQuoteChart = response.data;
      console.log($scope.stockQuoteChart);
    });
    console.log("got here too");
  }

});
