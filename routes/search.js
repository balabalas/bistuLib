
/*
 * GET users listing.
 */

var search = require('../lib/search');

function parseArg(args){
    var result = {};
    var key = args.key || '';
    var match = args.match || 'qx';
      
    /*
     * query params should like this:
     *   search?key=node&match=qx&p=all
     * **/
    result.word = key;
    result.match = match;
    
    return result;
}

exports.query = function(req, res){
  
  var params = req.query;
  var ip = req.ip;
  var args = null;
  
  var handleAction = function(results){

      var data = null;

      if(results && typeof results === 'object'){
        data = JSON.stringify(results);
      }
      else if(results) {
        data = results;
      }
      // console.log(Buffer.byteLength(data, 'utf-8'));
      // console.log(data.length);
      res.set({
        'Content-Type': 'text/plain;charset=utf-8',
        'Content-Length': Buffer.byteLength(data, 'utf-8')
      });

      res.end(data);
      // res.end();
  };
  
  if(!params){
      args = null;
  }
  else {
      args = parseArg(params);
  }
  
  search.query(args, handleAction);
  
};



