var swenApp = angular.module('swenApp', ['ngResource', 'ngSanitize', 'infinite-scroll', 'highcharts-ng']);

swenApp.controller('homeCtrl', function($scope, $resource, $timeout, $q, $rootScope) {

    $scope.limit = 0;
    $scope.tweetsToShow = [];
    $scope.infiniteScrolling = false;

    $scope.getTweets = function() {
        
        $scope.limit += 20;
        
        if ($scope.tweetsToShow.length == 0) {
            var deferred = $q.defer();
            var resource = $resource("/twitter/tweets");
            resource.query(function (res) {
                $scope.tweetsToShow = res;
                
                if ($scope.tweetsToShow == null) {
                    console.log("No tweets returned");
                    return;
                }
                
                $scope.tweetsToShow.sort(function(a, b) {
                    return b.id - a.id;
                });
                
                console.log("*GET TWEETS* tweetsToShow length: " + $scope.tweetsToShow.length);
                
                $timeout(function() {
                    twttr.widgets.load();
                }, 30);
                
                deferred.resolve(res);
                $rootScope.$$phase || $rootScope.$apply();
            });
        }
        else {
            if ($scope.limit >= $scope.tweetsToShow.length) {
                $scope.infiniteScrolling = true;
            }
            $timeout(function() {
                twttr.widgets.load();
            }, 30);
        }
    };
    
    $scope.postTweet = function() {
        postTweet($scope.tweetField);
    }

    function postTweet(tweet) {
    
        var resource = $resource("/twitter/post/" + tweet);
        resource.get(function (res) {
            console.log("POSTED A TWEET!");
            $scope.tweetsToShow = [];
            $scope.infiniteScrolling = false;
            $scope.getTweets();
        });
    
    }

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
    getStocks();
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

  //console.log(thing);

  }

  $scope.stockBuy = function() {
    console.log($scope.stockQuote.LastPrice);
    console.log($scope.purchaseAmount);
    $scope.amountOwned += $scope.purchaseAmount;

    var stockData = {
      lastPrice: $scope.stockQuote.LastPrice,
      date: new Date(),
      buyAmount: $scope.purchaseAmount,
      stock: $scope.searchField
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
      lastPrice: $scope.stockQuote.LastPrice,
      date: new Date(),
      sellAmount: $scope.sellAmount,
      stock: $scope.searchField
    }

    var request = $http.post("/stocks/stockSell", stockData);
  }

  getStocks = function() {
    $scope.stocks = [];
    $scope.amountOwned = 0;
    $http.get("/stocks/getStock").then(function(res) {
      res.data.forEach(function(transaction) {
        console.log(transaction);
        if (transaction.stock.toLowerCase() == $scope.searchField.toLowerCase()) {
          $scope.amountOwned += transaction.amount;
          $scope.stocks.push(transaction);
        }
      });
    
      /*
      for (item in x) {
        console.log(x);
        console.log(item);
        if (item.stock.toLowerCase() == $scope.searchField.toLowerCase()) {
          $scope.stocks.push(item);
        }
      }
      */

    });
  }

});
