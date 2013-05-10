

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
    //var cd = iconv.decode(d, 'GBK');
    res.on('end', function(){

        fs.writeFile('info.html', d, function(err){
            if(err) console.log(err);
            else console.log("done");
        });

        // jsdom.env({
        //     html: d,
        //     src: [jquery],
        //     done: function(errors, window){
        //         var $ = window.$;
        //         var trs = $('table[width="97%"]').filter($('*[cellpadding="2"]')).find('tr').not(':first'); // ,cellpadding="2"
        //         var len = $('span.opac_red:first').text();
        //         console.log(len);
        //         $.each(trs, function(key, val){
        //             //console.log($(this).children().length);
        //             // $(this).children().each(function(_key, _value){
        //             //     console.log(key + '--' + $(this).text());
        //             // });
        //             var chArr = $(this).children()
        //                 , pattern = /\w+/g;
        //             var rrrr = $(chArr[1]).find('a').attr('href').split(',')[1];
        //             console.log(pattern.exec(rrrr)[0]); // this is we need.
        //             console.log($(chArr[1]).text());
        //             console.log($(chArr[5]).text().trim());
        //         });
        //         // http://211.68.37.131/book/detailBook.jsp?rec_ctrl_id=01h0173359  
        //         // use that code to query book content.
        //         /**************************       This is an item.        ***************************
        //         <tr bgcolor=#EBF0F2>                
        //           <td align=center>2&nbsp;</td>
        //           <!--20091207屏蔽索书号-->
        //           <!--<td><a href="javascript:popup('detailBook.jsp','01h0180547')" class=opac_blue> </a></td>-->
        //           <td><a href="javascript:popup('detailBook.jsp','01h0180547')" class=opac_blue> Node.js开发指南</a></td>
        //           <td>BYVoid编著&nbsp;</td>
        //           <td>人民邮电出版社&nbsp;</td>
        //           <td>978-7-115-28399-3&nbsp;</td>
        //           <td>无&nbsp;</td>    
        //         </tr>
        //         ***************************************************************************************/

        //     }
        // });
    });

});

req.on('error', function(err){
    console.log('err: ' + err);
});

req.end();








