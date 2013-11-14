function vendorFile (file) {
  return 'vendor/**/' + file;
}

module.exports = {
  buildDir: 'dist',

  pkg: require('./package.json'),

  vendorJs: [
    vendorFile('jquery.min.js'),
    vendorFile('bootstrap.min.js'),
    vendorFile('angular.min.js'),
    vendorFile('angular-route.min.js'),
    vendorFile('angular-sanitize.min.js')
  ],

  vendorDevJs: [
    vendorFile('jquery.js'),
    vendorFile('bootstrap.js'),
    vendorFile('angular.js'),
    vendorFile('angular-route.js'),
    vendorFile('angular-sanitize.js')
  ],

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

  appCss: 'src/css/**/*.css'
};
