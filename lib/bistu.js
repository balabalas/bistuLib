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
    var jquery = null;
    
    try {
        jquery = fs.readFileSync(__dirname + '/jquery.js').toString();
        global.jQuery = jquery;
    }
    catch(error){
        console.error(error);
    }
    
};












