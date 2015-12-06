var swenApp = angular.module('swenApp', ['ngResource', 'ngSanitize', 'infinite-scroll', 'highcharts-ng']);

swenApp.controller('homeCtrl', function($scope, $resource, $timeout, $q, $rootScope) {

    $scope.postTweet = function() {
        postTweet($scope.tweetField);
    };

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
  $scope.profit = 0;

   // Gets a stock quote given a symbol and displays a graphical representation
   $scope.getStockQuote = function() {
    $scope.disable = false;
    $scope.stocksOwned = 0;
    getStockQuote($scope.searchField);
    getChartQuote($scope.searchField);
};

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
    getNotes();
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
      };

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
    if ($scope.purchaseAmount < 0) {
      return;
    }

    console.log($scope.stockQuote.LastPrice);
    console.log($scope.purchaseAmount);
    $scope.amountOwned += $scope.purchaseAmount;

    var stockData = {
      lastPrice: $scope.stockQuote.LastPrice,
      date: new Date(),
      buyAmount: $scope.purchaseAmount,
      stock: $scope.searchField
   };

    var request = $http.post("/stocks/stockBuy", stockData);
};

  $scope.stockSell = function() {
    console.log($scope.stockQuote.LastPrice);
    console.log($scope.sellAmount);

    if ($scope.sellAmount > $scope.amountOwned || $scope.sellAmount < 0) {
      $scope.sellError = true;
      return;
    }

    $scope.amountOwned -= $scope.sellAmount;
    var stockData = {
      lastPrice: $scope.stockQuote.LastPrice,
      date: new Date(),
      sellAmount: $scope.sellAmount,
      stock: $scope.searchField
   };

    var request = $http.post("/stocks/stockSell", stockData);
};

  $scope.delTransactions = function() {
    $http.get("/stocks/delTrans").then(function(res) {
      getStocks();
    });
  }

  $scope.addNote = function() {
    var noteData = {
      desc: $scope.noteDesc,
      stock: $scope.searchField
   };

    var request = $http.post("/stocks/addNote", noteData).then(function(res) {
      getNotes();
    });
};

  getStocks = function() {
    $scope.stocks = [];
    $scope.amountOwned = 0;
    $scope.profit = 0;
    $scope.totalProfit = 0;
    $http.get("/stocks/getStock").then(function(res) {
      $scope.allStocks = res.data;
      res.data.forEach(function(transaction) {
        $scope.totalProfit += (transaction.amount * transaction.price);
        if ($scope.searchField) {
          if (transaction.stock.toLowerCase() == $scope.searchField.toLowerCase()) {
            $scope.profit += (transaction.amount * transaction.price);
            $scope.amountOwned += transaction.amount;
            $scope.stocks.push(transaction);
          }
        }
      });
    });
};

  getNotes = function() {
    $scope.displayNote = '';
    $http.get("/stocks/getNotes").then(function(res) {
      res.data.forEach(function(note) {
        if ($scope.searchField) {
          if (note.stock == $scope.searchField) {
            $scope.displayNote = note.desc;
          }
        }
     });
  });
  };

  getStocks();
  getNotes();

});
