// var Twit = require('twit');

var swenApp = angular.module('swenApp', ['ngResource', 'ngSanitize', 'infinite-scroll', 'highcharts-ng']);

swenApp.controller('homeCtrl', function($scope, $resource, $timeout) {

   init = function() {
      getTweets();
  }

   // Searches for stocks given a symbol or company name.
   getTweets = function() {

       console.log("Call getTweets");

       $scope.tweets = $resource('/twitter/tweets', {});

       $scope.tweetsResult = [];

       $scope.tweets.query( { }, function (res) {

           $scope.tweetsResult = $scope.tweetsResult.concat(res);

           // render tweets with widgets.js
           $timeout(function () {
               twttr.widgets.load();
           }, 30);
       });

   };

   init();

});

swenApp.controller('mainCtrl', function($scope, $http) { // ***** CHANGE THIS TO "stockCtrl" FOR PRODUCTION ***

   // Gets a stock quote given a symbol and displays a graphical representation
   $scope.getStockQuote = function() {
      getStockQuote($scope.searchField);
      getChartQuote($scope.searchField);
   }

   function getStockQuote(symbol) {

      var quoteUrl = "/stocks/quote?symbol=" + symbol;

      // get is a simple wrapper for request()
      // which sets the http method to GET
      var request = $http.get(quoteUrl).then(function (response) {
         $scope.stockQuote = response.data;
      });

   }

  function getChartQuote(symbol) {

    var chartUrl = "/stocks/chart?symbol=" + symbol;

    var chartRequest = $http.get(chartUrl).then( function(response) {

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
              text: null
          },
          useHighStocks: true
      }

      var chartData = [];

      for( var i = 0; i < response.data.Dates.length; i++ ) {
         chartData[i] = [new Date(response.data.Dates[i]).getTime(), response.data.Elements[0].DataSeries.high.values[i]];
      }

      $scope.chartConfig.series.push({
        id: 1,
        data: chartData
      });

   });

  }

});
