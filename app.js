
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , bistu = require('./lib/bistu')
  , search = require('./routes/search')
  , book = require('./routes/book')
  , notfind = require('./routes/notfind')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 8118);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// init global settings.
bistu.init();

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/search', search.query);

app.get('/book', book.query);

app.get('*', notfind.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('BistuLib listening on port ' + app.get('port'));
});
