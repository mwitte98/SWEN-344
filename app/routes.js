module.exports = function(app, passport, Twit) {

   var configAuth = require('../app/config/auth.js');

   app.get('/', function(req, res) {
      res.render('index.ejs'); // load the index.ejs file
   });

   app.get('/profile', isLoggedIn, function(req, res) {
      res.render('profile.ejs', {user : req.user}); // get the user out of session and pass to template

      initTwitterStream(req.user);

   });

   app.get('/logout', function(req, res) {
       req.logout();
       res.redirect('/');
   });

   app.get('/auth/twitter', passport.authenticate('twitter'));
   app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect : '/profile', failureRedirect : '/'}) );

   function isLoggedIn(req, res, next) {

       // if user is authenticated in the session, carry on
       if (req.isAuthenticated()) {
           return next();
       }

       // if they aren't redirect them to the home page
       res.redirect('/');
   }


   function initTwitterStream(user) {

      var T = new Twit({
         consumer_key: configAuth.twitterAuth.consumerKey,
         consumer_secret: configAuth.twitterAuth.consumerSecret,
         access_token: user.token,
         access_token_secret: user.tokenSecret
      });
      
      var tweets = [];
      
      T.get('statuses/home_timeline', { screen_name: user.username, count: 5 },  function (err, data, response) {
         console.log(data[0].text);
         console.log(data[1].text);
         console.log(data[2].text);
         console.log(data[3].text);
         console.log(data[4].text);
         tweets.push(data[0]);
         tweets.push(data[1]);
         tweets.push(data[2]);
         tweets.push(data[3]);
         tweets.push(data[4]);
      });

      var stream = T.stream('user');

      stream.on('tweet', function (tweet) {
        console.log(tweet.text);
        tweets.push(tweet);
      });

   }


}
