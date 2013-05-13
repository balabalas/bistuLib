
/*
 * GET users listing.
 */

var search = require('../lib/search');

function parseArg(args){
    var res = {}
      , key = args.key || ''
      , match = args.match || 'qx';
      
    /*
     * query params should like this:
     *   search?key=node&match=qx&p=all
     * **/
    res.word = key;
    res.match = match;
    
    return res;
}

exports.query = function(req, res){
  
  var params = req.query
    , ip = req.ip
    , args = null;
  
  var handleAction = function(results){
      var data = null;
      if(typeof results === 'object'){
        data = JSON.stringify(results);
      }
      else {
        data = results;
      }
      res.set('Content-Type', 'text/plain;charset=utf-8');
      //res.set('Content-Length', data.length);
      res.end(data);
      //res.end();
  };
  
  if(!params){
      res.send('null');
  }
  else {
      args = parseArg(params);
  }
  
  search.query(args, handleAction);
  
};



