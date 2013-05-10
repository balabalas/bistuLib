

var params = 'recordtype=all&library_id=all&kind=simple&word=node&cmatch=qx&searchtimes=1&type=title&orderby=pubdate_date&ordersc=desc&size=500';

// word=mysql&type=title&cmatch=qx&recordtype=all&library_id=all&kind=simple&searchtimes=1&size=10&curpage=1&orderby=pubdate_date&ordersc=desc&page=1&pagesize=10
//http://211.68.37.131/book/search.jsp?recordtype=all&library_id=all&kind=simple&word=node&cmatch=qx&searchtimes=1&type=title

var http = require('http')
    , fs = require('fs')
    , jsdom = require('jsdom')
    //, Iconv = require('iconv').Iconv
    , iconv = require('iconv-lite')
    , jquery = fs.readFileSync('../lib/jquery.js').toString()
    , options = {
        hostname:'211.68.37.131'
        , port: 80
        , path: '/book/detailBook.jsp?rec_ctrl_id=01h0173359'
        , method: 'GET'
        , header: {"charset":"GBK"}
    };

//var iconv = new Iconv('GBK', 'UTF-8');

var req = http.request(options, function(res){
    //console.log(res.statusCode);
    var d = '';

    res.on('data', function(data){
        d += iconv.decode(data, 'gbk');
    });
    res.on('end', function(){

        // fs.writeFile('info.html', d, function(err){
        //     if(err) console.log(err);
        //     else console.log("done");
        // });

        jsdom.env({
            html: d,
            src: [jquery],
            done: function(errors, window){
                var $ = window.$, arr = [];
                //var tttt = $('td:contains("载体形态") ~ td').text();
                var pTable = $($('p[align="center"] ~ table:gt(0)')[0]).find('td font[style="color:red;font-style:bolder;font-weight:bold"]');
                pTable.each(function(key, value){
                    if((key+1)%3)arr.push($(this).text());
                });
                
                var list = arr.filter(function(val, index){
                    return (index%2);
                });
                console.log(list.join('---'));
            }
        });
    });

});
/**
 * [ description]
 * @param  {[type]} err){    console.log('err: ' + err);}
 * @return {[type]}
 */
req.on('error', function(err){
    console.log('err: ' + err);
});

req.end();








