var calApiRouter = require('express').Router();

// This will get called every time someone uses this route (/calendar)
calApiRouter.use(function(req, res, next){
   next();
});

calApiRouter.get('/', function(req, res) {
   res.render('calendar');
});

module.exports = calApiRouter;
