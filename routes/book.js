

var book = require('../lib/book');

exports.query = function(req, res){
  
  var queries = req.query
    , bookId = queries.id || ''
    , handleAction = function(result){
      if(typeof result === 'string'){
        res.send(result);
      }
      else {
        res.send('not find');
      }
    };
  
  book.info(bookId, handleAction);
  
};


