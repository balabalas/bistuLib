/***
 * The books that user has borrowed.
 * @author  ista.allen@gmail.com (Allen Heavey)
 ***/

var http = require('http');
var iconv = require('iconv-lite');
var domParser = require('jsdom');

var serverHost = '211.68.37.131';

var cookieOptions = {
  host: serverHost,
  method: 'POST',
  headers: {
    'Content-Type':'application/x-www-form-urlencoded'
  },
  path: '/reader/login.jsp?str_kind=login'
};

function handleDOM(domString, cb){

  var jquery = global.jQuery;

  /***
   * Parse return html document.
   * @param {Error} err   when parse dom encounter error.
   * @param {Object} w   window
   ***/
  domParser.env({
    html: domString,
    src: [jquery],
    done: function(err, w){
      var $ = w.$;
      var tRows = $('table[width="90%"][bgcolor="#F7FBFF"]').find('tr:has(td:first[align="center"])');

      cb();
    }
  });
}

modules.export = function(user, callback){

    if(!user && typeof user !== 'object'){
      throw new ReferenceError('You should input at least one user code.');
    }

    // create post request for user's cookie
    var cookieReq = http.request(cookieOptions, function(res){
      // get the cookie
      var outCookie = (res.headers['set-cookie'] + '').split(';')[0];

      // @Depracated
      res.on('data', function(chunk){});

      // while cookie response ended.
      res.on('end', function(){

        var listOptions = {
          host: serverHost,
          method: 'GET',
          path: '/reader/infoList.jsp',
          headers: outCookie
        };

        // query borrowed book list.
        var listReq = http.get(listOptions, function(listRes){
          var data = '';

          listRes.on('data', function(chunk){
            data += iconv.decode(chunk, 'gbk');
          });

          listRes.on('end', function(){
            handleDOM(data, callback);
          });

        });

        listReq.on('error', function(err){
          console.log('Error: ' + err.name + ' <--> ' + err.message);
          throw new Error('Query borrowed book list error.');
        });

      });
    });
    
    // when request cookie encounter an error.
    cookieReq.on('error', function(err){
      console.log('Error: ' + err.name + ' <--> ' + err.message);
      throw new Error('Query user cookie encounter an error.');
    });

    // pass user's id and password.
    cookieReq.write('barcode=' + user.number + '&fangshi=0&password=' + user.password + '&x=10&y=5');

    // end request cookie.
    cookieReq.end();
};

