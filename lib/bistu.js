/******************************************
 * 
 * Init some needs.
 * 
 * 
 * 
 * 
 * ****************************************/

var fs = require('fs');

exports.init = function(){
    var jquery = null
      , options = {
        "encoding":"utf8"
      }
      , path = __dirname + '/jquery.js';
    
    try {
        fs.readFile(path, options ,function(err, data){
          
          if(err){
            console.error(err);
          }
          
          jquery = data;
          global.jQuery = jquery;
        });
    }
    catch(error){
        console.error(error);
    }
};












