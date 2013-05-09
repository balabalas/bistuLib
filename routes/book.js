

var book = require('../lib/book');

exports.query = function(req, res){
  
  var queries = req.query
    , bookId = queries.id || ''
    , handleAction = function(result){
      
    };
  
  book.info(bookId, handleAction);
  
};


