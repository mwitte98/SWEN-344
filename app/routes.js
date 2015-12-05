module.exports = function(app, passport, Twit) {

    var configAuth = require('../app/config/auth.js');

    app.get('/login', function(req, res) {
        res.render('login');
    });

    app.get('/', isLoggedIn, function(req, res) {
        res.render('index.ejs', {user : req.user}); // get the user out of session and pass to template
    });

    app.get('/logout', isLoggedIn, function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate(
        'twitter', {successRedirect : '/', failureRedirect : '/login'}) );

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        }

        // if they aren't redirect them to the login page
        res.redirect('/login');
    }


    var Twitter = null;
    var tweetsArray = [];
    var tweets = [];

    app.get('/twitter/tweets', function(req, res) {

        if (Twitter === null) {
            Twitter = new Twit({
                consumer_key: configAuth.twitterAuth.consumerKey,
                consumer_secret: configAuth.twitterAuth.consumerSecret,
                access_token: req.user.token,
                access_token_secret: req.user.tokenSecret
            });
        }
        else {
            tweetsArray = [];
            tweets = [];
        }

        Twitter.get('statuses/home_timeline', {count: 200},  function(err, data, response) {
            tweets = data;
            if (tweets.length === 0) {
                res.send(null);
            }
            tweets.forEach(function(tweet) {
                getOEmbed(tweet);
            });

        });

        function getOEmbed(tweet) {

            // oEmbed request params
            var params = {
                "id": tweet.id_str
            };

            // request data
            Twitter.get('statuses/oembed', params, function (err, data, resp) {
                tweet.oEmbed = data;
                tweetsArray.push(tweet);
                if( tweetsArray.length == tweets.length ) {
                    res.send(tweetsArray);
                }
            });

        } // end getOEmbed

    });


    app.get('/twitter/post/:tweet', function(req, res) {

        if (Twitter === null) {
            Twitter = new Twit({
                consumer_key: configAuth.twitterAuth.consumerKey,
                consumer_secret: configAuth.twitterAuth.consumerSecret,
                access_token: req.user.token,
                access_token_secret: req.user.tokenSecret
            });
        }

        Twitter.post('statuses/update', { status: req.params.tweet }, function(err, data, response) {
            res.send("Posted tweet");
        });

    });


}; // end module.exports
