angular.module('trelloLite', ['ngSanitize', 'ngRoute'])
  .config(Config)
  .constant('LOGIN_PREFIX', '\n\n---\n');

Config.$inject = ['$routeProvider', '$locationProvider'];
function Config ($routeProvider, $locationProvider) {

  var resolveOpts = {
    products: ['Products', function (Products) {
      return Products.resolve();
    }],
    members: ['Members', function (Members) {
      return Members.resolve();
    }],
    statuses: ['Statuses', function (Statuses) {
      return Statuses.resolve();
    }]
  };

  $routeProvider
    .when('/', {
      templateUrl: '/partials/main.tpl.html',
      controller: 'MainCtrl',
      resolve: {
        products: resolveOpts.products,
        members: resolveOpts.members
      }
    })
    .when('/products/:productId/issues', {
      templateUrl: '/partials/issueList.tpl.html',
      controller: 'IssueListCtrl',
      resolve: resolveOpts
    })
    .when('/products/:productId/issues/create', {
      templateUrl: '/partials/newIssue.tpl.html',
      controller: 'NewIssueCtrl',
      resolve: resolveOpts
    })
    .when('/products/:productId/issues/:idShort', {
      templateUrl: '/partials/issue.tpl.html',
      controller: 'IssueCtrl',
      resolve: resolveOpts
    });
  $locationProvider.html5Mode(true);
}
