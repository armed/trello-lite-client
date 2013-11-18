angular.module('trelloLite').controller('IssueListCtrl', IssueListCtrl);

IssueListCtrl.$inject = ['$scope', '$http', '$routeParams', 'Commons'];
function IssueListCtrl ($scope, $http, $routeParams, Commons) {
  $scope.loading = true;
  $scope.issues = [];
  $scope.util = Commons;

  $http.get('/api/boards/' + $routeParams.productId + '/cards')
    .success(function (issues) {
      $scope.issues = issues;
      $scope.loading = false;
    });

  $scope.isEmpty = function () {
    return !$scope.loading && $scope.issues.length === 0;
  };

  $scope.issueId = Commons.issueCode;

  $scope.checkFilters = function (issue) {
    var status,
        number;

    if ($scope.search) {
      if ($scope.search.status) {
        status = $scope.search.status.name;
      }
      if ($scope.search.number) {
        number = $scope.search.number;
      }

      return (status ? $scope.util.issueStatus(issue) === status : true) &&
        (number ? $scope.issueId(issue).indexOf(number) >= 0 : true);
    }

    return true;
  };
}
