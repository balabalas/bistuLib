

var http = require('http');
var iconv = require('iconv-lite');
var domParser = require('jsdom');
var fs = require('fs');

var header = {
  'Content-Type':'application/x-www-form-urlencoded'
};

var options = {
  host: '211.68.37.131',
  port: 80,
  method: 'POST',
  path: '/reader/login.jsp?str_kind=login',
  headers: header
};

var innerOptions = {
  host: '211.68.37.131',
  port: 80,
  method: 'GET',
  path: '/reader/infoList.jsp',
};

var req = http.request(options, function(res){
  // console.log('Header: ' + JSON.stringify(res.headers));
  var outCookie = (res.headers['set-cookie'] + '').split(';')[0];
  res.on('data', function(chunk){
    //console.log('chunk: ' + iconv.decode(chunk, 'gbk'));
    var innerHeader = {
      'Cookie': outCookie,
    };

    innerOptions.headers = innerHeader;

    var innerReq = http.request(innerOptions, function(innerRes){
      // console.log('innerHeader: ' + JSON.stringify(innerRes.headers));
      var str = '';
      
      innerRes.on('data', function(innerChunk){
        str += iconv.decode(innerChunk, 'gbk');
      });

      innerRes.on('end', function(){
        var jquery = fs.readFileSync('../lib/jquery.js').toString();
        domParser.env({
          html: str, 
          src: [jquery],
          done: function(err, w){
            var $ = w.$;
            var tRows = $('table[width="90%"][bgcolor="#F7FBFF"]').find('tr:has(td:first[align="center"])');
            $.each(tRows, function(key, value){
              var t = $($(this).children(':nth-child(2)')[0]).text();
              console.log('At: ' + key + ' <--> ' + t.split('=')[0].trim());
            });
          }
        });
      });

    });

    innerReq.on('error', function(err){
      console.log('Error: ' + err);
    });

    innerReq.end();
  });
});


req.on('error', function(e){
  console.log('Error ' + e);
});


req.write('barcode=2009010864&fangshi=0&password=&x=10&y=5');

req.end();








