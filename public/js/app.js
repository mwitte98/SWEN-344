// var Twit = require('twit');
var swenApp = angular.module('swenApp', []);

swenApp.controller('mainCtrl', function($scope) {

  $scope.index = "Home Page";
  $scope.stocks = "Stocks Page";
  $scope.calendar = "Calendar Page";

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
