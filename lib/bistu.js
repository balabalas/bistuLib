/******************************************
 * 
 * Init some needs.
 * 
 * 
 * 
 * 
 * ****************************************/

exports.init = function(){
    var jquery = null;
    
    try {
        jquery = fs.readFileSync('./jquery.js').toString();
        global.jQuery = jquery;
    }
    catch(error){
        console.error(error);
    }
    
}












