var swenApp = angular.module('swenApp', ['ngResource', 'ngSanitize', 'infinite-scroll', 'highcharts-ng']);

swenApp.controller('homeCtrl', function($scope, $http, $timeout) {

    var numPulled = 0;
    var numToShow = 0;
    var busy = false;
    var max_id = 0;
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
            
            if (numPulled >= 800 && numToShow >= tweets.length)
            {
                $scope.infiniteScrolling = true;
                console.log("Turning off infinite scrolling. numPulled: " + numPulled);
                for(var i = tweetsShowing; i < tweets.length; i++) {
                    $scope.tweetsToShow.push(tweets[i]);
                };
                console.log("*800 PULLED* tweetsToShow length: " + $scope.tweetsToShow.length);
            }
            else if (numToShow >= tweets.length)
            {
                if (max_id == null) {
                    console.log("max_id is null");
                    return;
                }
                busy = true;
                var url = "/twitter/tweets/" + max_id.toString();
                max_id = null;
                var request = $http.get(url).then(function (response) {
                    tweets = tweets.concat(response.data);
                    busy = false;
                    
                    if (tweets == null) {
                        console.log("No tweets returned");
                        return;
                    }
                    numPulled += 200; //we pull 200 tweets at a time
                    
                    // sort tweets highest id (newest) to lowest id (oldest)
                    tweets.sort(function(a, b)
                    {
                        return b.id - a.id;
                    });
                    
                    max_id = tweets[tweets.length-1].id - 1; //twitter uses max_id inclusively
                    
                    $timeout(function() {
                        for(var i = tweetsShowing; i < numToShow; i++) {
                            $scope.tweetsToShow.push(tweets[i]);
                        };
                        console.log("*GET TWEETS* tweetsToShow length: " + $scope.tweetsToShow.length);
                    });
                });
                request = null;
            }
            else
            {
                for(var i = tweetsShowing; i < numToShow; i++) {
                    $scope.tweetsToShow.push(tweets[i]);
                };
                console.log("*SHOW TWEETS* tweetsToShow length: " + $scope.tweetsToShow.length);
            }
            
            // render tweets with widgets.js
            $timeout(function () {
                twttr.widgets.load();
            }, 30);
        }
    };

});

swenApp.controller('mainCtrl', function($scope, $http) {

    // Searches for stocks given a symbol or company name.
    $scope.searchStocks = function(searchField) {
        url = "/stocks/search?search=" + $scope.searchField;
    
        var request = $http.get(url).then(function(response) {
            $scope.stockObjects = response.data;
        });
    }
  
    // Gets a stock quote given a symbol.
    $scope.getStockQuote = function() {
        stockQuote($scope.queryField);
        chartQuote($scope.queryField);
    }
  
    stockQuote = function(symbol) {
        url = "/stocks/quote?symbol=" + symbol;
    
        var request = $http.get(url).then(function (response) {
            $scope.stockQuote = response.data;
        });
    }
  
    chartQuote = function(symbol) {
        chartUrl = "/stocks/chart?symbol=" + symbol;
        
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
        });
    }

});
