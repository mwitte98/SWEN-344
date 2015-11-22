var swenApp = angular.module('swenApp', ['ngResource', 'ngSanitize', 'infinite-scroll', 'highcharts-ng']);

swenApp.controller('homeCtrl', function($scope, $http, $timeout) {

    var numToShow = 0;
    var busy = false;
    var tweets = [];
    $scope.tweetsToShow = [];
    $scope.infiniteScrolling = false;

    $scope.getTweets = function() {

        if (busy)
        {
            console.log("Returning from busy");
            return;
        }
        else
        {
            var tweetsShowing = numToShow;
            numToShow += 20;
            
            if ($scope.tweetsToShow.length == 0) {
                var url = "/twitter/tweets";
                var request = $http.get(url).then(function (response) {
                    tweets = tweets.concat(response.data);
                    busy = false;

                    if (tweets == null) {
                        console.log("No tweets returned");
                        return;
                    }
                    
                    // sort tweets highest id (newest) to lowest id (oldest)
                    tweets.sort(function(a, b)
                    {
                        return b.id - a.id;
                    });
                    
                    $timeout(function() {
                        for(var i = tweetsShowing; i < numToShow; i++) {
                            $scope.tweetsToShow.push(tweets[i]);
                        };
                        console.log("*GET TWEETS* tweetsToShow length: " + $scope.tweetsToShow.length);
                    });
                });
            }
            else if (numToShow >= tweets.length)
            {
                $scope.infiniteScrolling = true;
                for(var i = tweetsShowing; i < tweets.length; i++) {
                    $scope.tweetsToShow.push(tweets[i]);
                };
                console.log("*TURN OFF INFINITE SCROLLING* tweetsToShow length: " + $scope.tweetsToShow.length);
            }
            else
            {
                for(var i = tweetsShowing; i < numToShow; i++) {
                    $scope.tweetsToShow.push(tweets[i]);
                };
                console.log("*SHOW TWEETS* tweetsToShow length: " + $scope.tweetsToShow.length);
            }

            // render tweets with widgets.js
            $timeout(function() {
                twttr.widgets.load();
            }, 30);
        }
    };

});

swenApp.controller('mainCtrl', function($scope, $http) { // ***** CHANGE THIS TO "stockCtrl" FOR PRODUCTION ***
  $scope.disable = true;
  $scope.purchaseAmount = 0;
  $scope.sellAmount = 0;
  $scope.amountOwned = 0;

   // Gets a stock quote given a symbol and displays a graphical representation
   $scope.getStockQuote = function() {
    $scope.disable = false;
    $scope.stocksOwned = 0;
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

  $scope.stockBuy = function() {
    console.log($scope.stockQuote.LastPrice);
    console.log($scope.purchaseAmount);
    $scope.amountOwned += $scope.purchaseAmount;

    var stockData = {
      lastPrice: $scope.stockQuote.LastPrice,
      date: new Date(),
      buyAmount: $scope.purchaseAmount
    }

    var request = $http.post("/stocks/stockBuy", stockData);
  }

  $scope.stockSell = function() {
    console.log($scope.stockQuote.LastPrice);
    console.log($scope.sellAmount);

    if ($scope.sellAmount > $scope.amountOwned) {
      $scope.sellError = true;
      return;
    }

    $scope.amountOwned -= $scope.sellAmount;
    var stockData = {
      sellAmount: $scope.sellAmount
    }

    var request = $http.post("/stocks/stockSell", stockData);
  }

});
