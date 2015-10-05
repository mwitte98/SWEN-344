module.exports = function(app, passport, Twit) {

   var configAuth = require('../app/config/auth.js');

   app.get('/login', function(req, res) {
      res.render('login');
   });

   app.get('/', isLoggedIn, function(req, res) {
      res.render('index.ejs', {user : req.user}); // get the user out of session and pass to template

      initTwitterStream(req.user);
   });

   app.get('/logout', function(req, res) {
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
