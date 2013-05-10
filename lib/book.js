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
      var bookInfo = {}
        , bookStat = {}
        , cbObj = {}
        , cbJson = '';
      jsdom.env({
        html: result,
        src: [jquery],
        done: function(errors, window){
            var $ = window.$
              , items = null
              , tArray = []
              , len = 0;

            bookInfo.title = $('td:contains("并列题名") ~ td').text() || '';
            bookInfo.publisher = $('td:contains("出版") ~ td').text() || '';
            bookInfo.series = $('td:contains("丛编") ~ td').text() || '';
            bookInfo.annotation = $('td:contains("附注") ~ td').text() || '';
            bookInfo.intro = $('td:contains("简介") ~ td').text() || '';
            bookInfo.author = $('td:contains("责任者"):last ~ td').text() || '';
            bookInfo.subject = $('td:contains("主题") ~ td').text() || '';
            bookInfo.size = $('td:contains("载体形态") ~ td').text() || '';
            
            items = $($('p[align="center"] ~ table:gt(0)')[0]).find('td font[style="color:red;font-style:bolder;font-weight:bold"]');
            
            items.each(function(index){
              if((index+1)%3){
                tArray.push($(this).text());
              }
            });
            
            if(tArray.length > 0){
              bookStat.number = tArray[0];
              bookStat.list = tArray.filter(function(val, index){
                return (index%2);
              });
            }
            
            cbObj = {
              bookStat:bookStat,
              bookInfo:bookInfo
            };
            
            cbJson = JSON.stringify(cbObj);
            callback(cbJson);
        }
      });
      
    });
  });
  
  req.on('error', function(reqError){
    console.error(reqError);
  });
  
  req.end();
};

