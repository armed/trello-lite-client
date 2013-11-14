angular.module('trelloLite', ['ngSanitize', 'ngRoute'])
  .config(Config);

Config.$inject = ['$routeProvider', '$locationProvider'];
function Config ($routeProvider, $locationProvider) {

  $routeProvider
    .when('/', {
      templateUrl: '/partials/mainCtrl.tpl.html',
      controller: 'MainCtrl'
    });
  $locationProvider.html5Mode(true);
}
