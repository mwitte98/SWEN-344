// var Twit = require('twit');

var swenApp = angular.module('swenApp', ['ngSanitize', 'highcharts-ng']);

swenApp.controller('homeCtrl', function($scope, $http) {

   init = function() {
      getTweets();
  }

   // Searches for stocks given a symbol or company name.
   getTweets = function() {

      console.log("Call getTweets");

       url = "http://127.0.0.1:8080/twitter/tweets/";

       // get is a simple wrapper for request()
       // which sets the http method to GET
       var request = $http.get(url)
          .then(function(response) {
          $scope.tweets = response.data;
       });

   };

   init();

});

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
    var chartRequest = $http.get(chartUrl).then(function (response) {
      $scope.stockQuoteChart = response.data;

      console.log(response.data.Elements[0].DataSeries.high.max);
      console.log(new Date(response.data.Elements[0].DataSeries.high.maxDate).getTime());

      $scope.chartConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          series: [],
          title: {
              text: symbol.toUpperCase() + ' stock history'
          },
          useHighStocks: true
      }

      $scope.chartConfig.series.push({
        id: 1,
        data: [
              [new Date(response.data.Dates[0]).getTime(), response.data.Elements[0].DataSeries.high.values[0]],
              [new Date(response.data.Dates[1]).getTime(), response.data.Elements[0].DataSeries.high.values[1]],
              [new Date(response.data.Dates[2]).getTime(), response.data.Elements[0].DataSeries.high.values[2]],
          ]
      });
    })
  };

});
