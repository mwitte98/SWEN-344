var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models/user');

var configAuth = require('./auth');

module.exports = function(passport) {

   // used to serialize the user for the session
   passport.serializeUser(function(user, done) {
       done(null, user.id);
   });

   // used to deserialize the user
   passport.deserializeUser(function(id, done) {
      // done(null, {username: 'mumush'});
      User.findById(id, function(err, user) {
          done(err, user);
      });
   });

   passport.use(new TwitterStrategy({
       consumerKey: configAuth.twitterAuth.consumerKey,
       consumerSecret: configAuth.twitterAuth.consumerSecret,
       callbackURL: configAuth.twitterAuth.callbackURL
     },
     function(token, tokenSecret, profile, done) {

      process.nextTick(function() { // do this async

         User.findOne({ 'twitterID' : profile.id }, function(err, user) {

            // if the user is found then log them in
            if (user) {
               return done(null, user); // user found, return that user
            }
            else {
               // if there is no user, create them
               var newUser = new User();

               // set all of the user data that we need
               newUser.twitterID = profile.id;
               newUser.token = token;
               newUser.tokenSecret = tokenSecret;
               newUser.username = profile.username;
               newUser.displayName = profile.displayName;

               // save our user into the database
               newUser.save(function(err) {
               if (err) {
                  throw err;
               }
                  return done(null, newUser);
               });
            } // end else

         }); // end User.findOne

      });

   })); // end async and Strategy



} // end module.exports
