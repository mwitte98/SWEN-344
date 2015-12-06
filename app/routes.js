module.exports = function(app, passport, Twit, io) {

    var configAuth = require('../app/config/auth.js');
    var moment = require('moment');
    var Twitter = null;

    // After the user goes to the index page for the first time, this is set to true
    // So that we don't create new socket handlers every time the '/' route is hit
    var TWITTER_EVENT_HANDLERS_SET = false;

    app.get('/login', function(req, res) {
        res.render('login');
    });

    app.get('/', isLoggedIn, function(req, res) {

        // Get today's events

        var today = new Date();
        var todayString = today.toDateString();
        var todaysEvents = [];
        var events = req.user.events;

        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            var startDate = new Date(event.start);
            var endDate = new Date(event.end);
            var startString = startDate.toDateString();
            var endString = endDate.toDateString();
            if (startString <= todayString && todayString <= endString) {
                event.start = moment(event.start).format('M/D/YYYY h:mm a');
                event.end = moment(event.end).format('M/D/YYYY h:mm a');
                todaysEvents.push(event);
            }
        }

      // Get tweets from twitter and establish a stream through socket

      if (Twitter === null) {
         Twitter = new Twit({
             consumer_key: configAuth.twitterAuth.consumerKey,
             consumer_secret: configAuth.twitterAuth.consumerSecret,
             access_token: req.user.token,
             access_token_secret: req.user.tokenSecret
         });
      }

      if(!TWITTER_EVENT_HANDLERS_SET) { // We haven't yet set up the twitter/socket event handlers (first time to index page)

         io.sockets.on('connection', function(socket) {

            socket.on('request tweets', function() { // User is on the home page on the front-end

               console.log('Request Tweets Event Fired on Server');

               var TWEET_COUNT = 20;

               Twitter.get('statuses/home_timeline', {count: TWEET_COUNT}, function(err, tweets, response) {
                  if (err) {
                     socket.emit('twitter api error', {error: "HomeTimeline Error"});
                  }
                  else {
                     console.log("Got Home Timeline Tweets");
                     tweets.forEach(function(tweet, index) {
                        Twitter.get('statuses/oembed', {id: tweet.id_str}, function(err, oEmbedData, response) {

                           if( err ) {
                              socket.emit('twitter api error', {error: "oEmbed Error"});
                           }
                           else {

                              tweet.oEmbed = oEmbedData;
                              if( index == TWEET_COUNT - 1 ) { // if this is the last tweet that we got from the API, send a flag for the front-end
                                 console.log('Last Tweet on Server');
                                 socket.emit('new tweet', {tweet: tweet, lastTweet: true});
                              }
                              else {
                                 socket.emit('new tweet', {tweet: tweet, lastTweet: false});
                              }

                           }

                        });
                     });
                  }
               });

            });

            socket.on('request twitter stream', function() { // User is on the home page on the front-end

               // ***** Get Tweets From Twitter *****

               console.log('Request Twitter Stream on Server');

               var stream = Twitter.stream('user');

               stream.on('tweet', function(tweet) {
                  console.log("New tweet: " + tweet.id);
                  Twitter.get('statuses/oembed', {id: tweet.id_str}, function(err, data, response) {
                     if(err) {
                        socket.emit('twitter api error', {error: "oEmbed Error"});
                        stream.stop();
                     }
                     else {
                        tweet.oEmbed = data;
                        socket.emit('new stream tweet', tweet);
                     }
                  });
               });

               stream.on('connect', function() {
                  console.log('Attempting to Connect to Twitter...');
               });

               stream.on('connected', function() {
                  console.log('Twitter Stream Connected');
               });

               stream.on('limit', function() {
                  console.log('******* Twitter Rate Limit Hit *******');
               });

            });

         });

         TWITTER_EVENT_HANDLERS_SET = true;

      } // end TWITTER_EVENT_HANDLERS_SET if statement

      res.render('index.ejs', {user : req.user, requestTweets: true, events: todaysEvents}); // get the user out of session and pass to template

    });

    app.get('/logout', isLoggedIn, function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect : '/', failureRedirect : '/login'}) );

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        }

        // if they aren't redirect them to the login page
        res.redirect('/login');
    }

    app.post('/twitter/post', function(req, res) {

        if (Twitter === null) {
            Twitter = new Twit({
                consumer_key: configAuth.twitterAuth.consumerKey,
                consumer_secret: configAuth.twitterAuth.consumerSecret,
                access_token: req.user.token,
                access_token_secret: req.user.tokenSecret
            });
        }

        Twitter.post('statuses/update', { status: req.body.tweet }, function(err, data, response) {
            res.send("Posted tweet");
        });

    });


}; // end module.exports
