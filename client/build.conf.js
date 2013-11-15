var libs = [
  'lodash',
  'jquery',
  'moment',
  'bootstrap',
  'angular',
  'angular-route',
  'angular-sanitize'
];

function vendorFile (file) {
  return 'vendor/**/' + file;
}

function vendorLibs (ext) {
  return libs.map(function (l) {
    return vendorFile(l + ext);
  });
}

module.exports = {
  buildDir: 'dist',

  pkg: require('./package.json'),

  vendorJs: vendorLibs('.min.js'),

  vendorDevJs: vendorLibs('.js'),

  vendorCss: [
    vendorFile('bootstrap.min.css')
  ],

  vendorFonts: [
    vendorFile('glyphicons-halflings-regular.*')
  ],

  htmlFiles: [
    'src/index.jade'
  ],

  partials: [
    'src/**/*.tpl.jade'
  ],

  appJs: 'src/**/*.js',

  concatAppJs: [
    'app.prefix',
    '<%= appJs %>',
    'app.suffix'
  ],

  appLess: 'src/css/**/*.less'
};
