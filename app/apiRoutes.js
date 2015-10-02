// Private API calls
// Could be to database, or general purpose routes, we can work this out later

var privateApiRouter = require('express').Router();

// This will get called every time someone uses this route (/api)
privateApiRouter.use(function(req, res, next){
   console.log('Request made to /api/' + req.method); // Print out the HTTP method used -> usually GET or POST
   next();
});

privateApiRouter.get('/', function(req, res) {
   res.send("Hello from Private API router");
});

module.exports = privateApiRouter;
