var calApiRouter = require('express').Router();

// This will get called every time someone uses this route (/stocks)
calApiRouter.use(function(req, res, next){
   console.log('Request made to /calendar/' + req.method); // Print out the HTTP method used -> usually GET or POST
   next();
});

calApiRouter.get('/', function(req, res) {
   res.render('calendar');
});

module.exports = calApiRouter;
