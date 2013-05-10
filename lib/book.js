/**
 * This module use to get details of a book.
 * 
 * **/

var http = require('http')
  , iconv = require('iconv-lite')
  , jsdom = require('jsdom')
  , jquery = null;

function check_jQuery(){
  
  if(!!global.jQuery){
    jquery = global.jQuery;
  }
  else {
    var fs = require('fs');
    try {
      jquery = fs.readFileSync(__dirname + '/jquery.js').toString();
    }
    catch(err){
      console.error(err);
    }
  }
}

exports.info = function(book_id, callback){
  // http://211.68.37.131/book/detailBook.jsp?rec_ctrl_id=01h0173359
  
  var bId = book_id || '01h0173359'
    , params = 'rec_ctrl_id=' + bId;
  
  check_jQuery();
  
  var httpOptions = {
      hostname:'211.68.37.131'
    , port: 80
    , path: '/book/detailBook.jsp?' + params
    , method: 'GET'
    , header: {"charset":"GBK"}
  };
  
  var req = http.request(httpOptions, function(res){
    
    var result = ''
      , rVaule = '';
    
    res.on('data', function(data){
      result += iconv.decode(data, 'gbk');
    });
    
    res.on('end', function(){
      fs.writeFile('info.html', d, function(err){
        console.log(err);
      });
    });
    
  });
  
  req.on('error', function(reqError){
    console.error(reqError);
  });
  
  req.end();
  
  
};







