module.exports = function (grunt) {
  grunt.initConfig({
    nodeunit: {
      all: ['tests']
    },
    watch: {
      tests: {
        files: ['tests/**/*.js', 'src/**/*.js'],
        tasks: ['jshint', 'nodeunit'],
        options: {
          interrupt: true,
        },
      },
    },
    jshint: {
      grunt: 'gruntfile.js',
      app: ['src/**/*.js', 'config.js', 'server.js'],
      test: 'tests/**/*.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint','nodeunit']);
};
