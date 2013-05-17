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
    
    if(!!global.jQuery){
        jquery = global.jQuery;
    } else {
        try {
            jquery = fs.readFileSync(__dirname + '/jquery.js').toString();
        }
        catch(error){
            console.error(error);
        }
    }
    
    var word = opt.word || ''
      , lib_id = opt.lib_id || def.library_id
      , cmatch = opt.match || def.cmatch
      , size = opt.size || def.size
      , convs = iconv.toEncoding(word, 'GBK');
    
    var rconvs = Array.prototype.reduce.call(convs, function(x,y){
      return x + '%' + y.toString(16);
    }, '');
    
    // console.log(rconvs);
    
    var params = 'recordtype=' + def.recordtype+ '&library_id=' + lib_id + '&kind=simple&word=' + rconvs + '&cmatch=' + cmatch + '&searchtimes=1&type=title&orderby=pubdate_date&ordersc=desc&size=' + size;
    
    var httpOptions = {
        hostname:'211.68.37.131'
      , port: 80
      , path: '/book/search.jsp?' + params
      , method: 'GET'
      , header: {"charset":"gbk"}
    };
    
    var req = http.request(httpOptions, function(response){
        var result = ''
          , values = null
          , sValue = '';
        
        // use iconv tranform encoding from GBK to UTF-8
        response.on('data', function(data){
            result += iconv.decode(data, 'gbk');
        });
        
        response.on('end', function(){
            jsdom.env({
                html: result,
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
                            temp = $(contentTd).find('a').attr('href').split(',')[1];
                            resObj.index = bIdReg.exec(temp)[0];
                            resObj.title = $(contentTd).text().trim();
                        }
                        
                        if(timeTd){
                            resObj.relTime = $(timeTd).text().trim();
                        }
                        
                        // filter relTime if it equals '无'
                        if(resObj.relTime != '无'){
                          values.res.push(resObj);
                        }
                        else {
                          values.length -= 1;
                        }
                        
                    });
                    
                    sValue = JSON.stringify(values);
                    callback(sValue);
                }
            });
        });
        
    });
    
    /**
     * TODO: should handle error connect.
     *   This error will occur when server can't connect library server;
     * **/
    req.on('error', function(err){
        console.error('Connect host ' + err);
    });
    
    req.end();
};




