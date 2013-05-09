

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            lib: {
                src: ['./lib/*.js', './routes/*.js','!./lib/jquery.js'],
                options: {
                    laxcomma: true
                    , debug: true
                    , curly: true // use braces around block always;
                    , eqnull: true // check variables == null or undifined;
                    , globals: {
                      jQuery: true,
                      console: true,
                      module: true,
                      exports: true
                    }
                }
            }
        }
        
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    grunt.registerTask('hint', ['jshint:lib']);
    grunt.registerTask('default', ['jshint']);

};





