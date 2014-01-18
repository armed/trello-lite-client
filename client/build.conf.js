function vGlob(file) {
  return 'vendor/**/' + file;
}

module.exports = {
  pkg: require('./package.json'),
  dist: 'dist',
  vendor: {
    fonts: vGlob('glyphicons-halflings-regular.*'),
    less: vGlob('bootstrap.less'),
    js: [
      'lodash',
      'jquery',
      'moment',
      'bootstrap',
      'angular',
      'angular-route',
      'angular-sanitize'
    ].map(function (l) {
      return vGlob(l + '.min.js');
    })
  },
  app: {
    html: 'src/index.jade',
    partials: 'src/**/*.tpl.jade',
    js: ['app.prefix', 'src/js/**/*.js', 'app.suffix'],
    less: 'src/css/**/*.less'
  },

  cssmin: {
    keepSpecialComments: 0
  },
  flatten: {
    css: {newPath: 'css'},
    js: {newPath: 'js'},
    fonts: {newPath: 'fonts'},
    partials: {newPath: 'partials'},
    jade: {
      dev: {
        data: {dev: true, version: Number(new Date())}
      }
    }
  }
};
