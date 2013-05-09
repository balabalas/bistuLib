/***
 * search book.
 * @author Allen Heavey
 * 
 * ***/

/** !!! cmatch !!!  匹配类型
 * qx  前向匹配
 * mh  模糊匹配
 * jq  精确匹配
 * **/

/** !!! library_id !!!  校区图书馆
 * A   健翔桥校区
 * B   清河校区
 * C   小营校区
 * **/

// default parameters.
var def = {
    'recordtype':'all'
    , 'library_id':'all'
    , 'kind':'simple'
    , 'cmatch':'qx'
    , 'searchtimes':1
    , 'type':'title'
    , 'orderby':'pudate_date'
    , 'ordersc':'desc'
    , 'size':500  // size of return search results once.
};

var http = require('http')
    , fs = require('fs')
    , jsdom = require('jsdom')
    , iconv = require('iconv-lite')
    , jquery = null;

if(global.jQuery){
    jquery = global.jQuery;
} else {
    try {
        jquery = fs.readFileSync('./jquery.js').toString();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * @params opt : Object
 *              query params.
 *         callback : functin
 *              callback function
 * **/
exports.query = function(opt, callback){

    if(typeof opt === 'string'){
        var _word = opt;
        opt = {
            word: _word
        };
    }
    
    var word = opt.word || ''
        , lib_id = opt.lib_id || def.library_id
        , cmatch = opt.cmatch || def.cmatch
        , size = opt.size || def.size;
    
    var params = 'recordtype=' + def.recordtype+ '&library_id=' + lib_id + '&kind=simple&word=' + word + '&cmatch=' + cmatch + '&searchtimes=1&type=title&orderby=pubdate_date&ordersc=desc&size=' + size;
    
    var httpOptions = {
        hostname:'211.68.37.131'
        , port: 80
        , path: '/book/search.jsp?' + params
        , method: 'GET'
        , header: {"charset":"GBK"}
    };
    
    var req = http.request(httpOptions, function(res){
        var result = ''
            , values = null;
        
        res.on('data', function(data){
            result += iconv.decode(data, 'gbk');
        });
        
        res.on('end', function(){
            jsdom.env({
                html: d,
                src: [jquery],
                done: function(errors, window){
                    
                    var $ = window.$
                    , trs = $('table[width="97%"]').filter($('*[cellpadding="2"]')).find('tr').not(':first')
                    , result_len = $('span.opac_red:first').text();
                    
                    if(result_len){
                        values = {};
                        values.length = result_len;
                        values.res = [];
                    }
                    // extract content from dom.
                    $.each(trs, function(key, val){
                        var trsChilds = $(this).children()
                            , contentTd = trsChilds[1]
                            , timeTd = trsChilds[5]
                            , bIdReg = /\w+/
                            , temp = ''
                            , resObj = {};
                        
                        if(contentTd){
                            temp = $(chArr[1]).find('a').attr('href').split(',')[1];
                            resObj.index = pattern.exec(temp)[0];
                            resObj.title = contentTd.text();
                        }
                        
                        if(timeTd){
                            resObj.relTime = timeTd.text().trim();
                        }
                        
                        values.res.push(resObj);
                    });
                    callback(values);
                }
            });
        });
    
        req.on('error', function(err){
            console.error(err);
        });
        
        req.end();
    });
};



