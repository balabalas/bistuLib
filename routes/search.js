
/*
 * GET users listing.
 */

var search = require('../lib/search');

function parseArg(args){
    var res = {};
    /**
     * TODO: detect different params.
     * **/
    
    res.word = args;
    
    return res;
    
}

exports.query = function(req, res){
  
  var params = req.params.book
    , args = null;
  
  var handleAction = function(results){
      var data = null;
      if(typeof results === 'object'){
          data = JSON.stringify(results);
      }
      else {
          data = results;
      }
      res.send(data);
      res.end();
  };
  
  if(!params){
      res.send('null');
  }
  else {
      args = parseArg(params);
  }
  
  search.query(args, handleAction);
  
};



