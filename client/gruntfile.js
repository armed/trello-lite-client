var _ = require('lodash'),
    bc = require('./build.conf');

module.exports = function (grunt) {
  var config = _.extend(bc, {
    // copy vendor assets
    copy: {
      vendor: {
        files: [
          {
            src: '<%= vendorFonts %>',
            dest: '<%= buildDir %>/fonts',
            cwd: '.',
            expand: true,
            flatten: true
          },
          {
            src: '<%= vendorCss %>',
            dest: '<%= buildDir %>/css',
            cwd: '.',
            expand: true,
            flatten: true
          }
        ]
      }
    },

    // clean dist folder
    clean: {
      dist: '<%= buildDir %>'
    },

    // concat js files
    concat: {
      options: {
        separator: ''
      },
      vendorJs: {
        src: '<%= vendorJs %>',
        dest: '<%= buildDir %>/js/vendor.min.js'
      },
      appJs: {
        src: '<%= concatAppJs %>',
        dest: '<%= buildDir %>/js/app.js'
      }
    },

    jshint: {
      options: {
        globals: {
          angular: true,
          jQuery: true,
          $: true
        }
      },
      grunt: ['gruntfile.js'],
      app: ['src/**/*.js']
    },

    // compile jade templates
    jade: {
      dev: {
        options: {
          data: { dev: true, version: Number(new Date()) }
        },
        files: '<%= htmlFiles %>'
      },
      prod: {
        options: {
          data: { dev: false, version: '<%= pkg.version %>' }
        },
        files: '<%= htmlFiles %>'
      }
    },

    // uglify code
    uglify: {
      appJs: {
        files: {
          '<%= buildDir %>/js/app.min.js': '<%= concat.appJs.dest %>'
        }
      }
    }
  });

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'clean', 'copy', 'concat', 'jade:dev']);
  grunt.registerTask('prod', ['jshint', 'clean', 'copy', 'concat', 'jade:prod', 'uglify']);
};
