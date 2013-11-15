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
            expand: true,
            flatten: true
          },
          {
            src: '<%= vendorCss %>',
            dest: '<%= buildDir %>/css',
            expand: true,
            flatten: true
          },
          {
            src: '<%= vendorDevJs %>',
            dest: '<%= buildDir %>/js/',
            expand: true,
            flatten: true
          }
        ]
      }
    },
    // less
    less: {
      dev: {
        files: {
          '<%= buildDir %>/css/app.css': '<%= appLess %>'
        }
      },
      prod: {
        options: {
          cleancss: true
        },
        files: {
          '<%= buildDir %>/css/app.min.css': '<%= appLess %>'
        }
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
        files: [
          {
            src: '<%= htmlFiles %>',
            dest: '<%= buildDir %>',
            expand: true,
            flatten: true,
            ext: '.html'
          },
          {
            src: '<%= partials %>',
            dest: '<%= buildDir %>/partials',
            expand: true,
            flatten: true,
            ext: '.tpl.html'
          }
        ]
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
    },
    // watch and rebuild
    watch: {
      src: {
        files: ['src/**/*.*', './*.js'],
        tasks: ['default'],
        options: {
          interrupt: true,
        },
      }
    }
  });

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'clean', 'copy',
    'less:dev', 'concat', 'jade:dev']);
  grunt.registerTask('prod', ['jshint', 'clean', 'copy',
    'less:prod', 'concat', 'jade:prod', 'uglify']);
};
