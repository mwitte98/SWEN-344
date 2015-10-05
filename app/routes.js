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

      var stream = T.stream('user');

      stream.on('tweet', function(tweet) {
        console.log(tweet);
      });

   }


}
