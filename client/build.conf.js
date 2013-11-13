function vendorFile (file) {
  return 'vendor/**/' + file;
}

module.exports = {
  buildDir: 'dist',

  pkg: require('./package.json'),

  vendorJs: [
    vendorFile('jquery.min.js'),
    vendorFile('bootstrap.min.js'),
    vendorFile('angular.min.js')
  ],

  vendorCss: [
    vendorFile('bootstrap.min.css')
  ],

  vendorFonts: [
    vendorFile('glyphicons-halflings-regular.*')
  ],

  htmlFiles: {
    '<%= buildDir %>/index.html': 'src/index.jade'
  },

  appJs: 'src/**/*.js',

  concatAppJs: [
    'app.prefix',
    '<%= appJs %>',
    'app.suffix'
  ]
};
