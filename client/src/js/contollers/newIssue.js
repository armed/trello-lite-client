angular.module('trelloLite').controller('NewIssueCtrl', NewIssueCtrl);

NewIssueCtrl.$inject = ['$scope', '$http', '$routeParams', '$location', 'Commons'];
function NewIssueCtrl ($scope, $http, $routeParams, $location, Commons) {
  var issue = $scope.issue = {
    sending: false,
    priority: 'blue'
  };

  $scope.createIssue = function () {
    var params;

    if ($scope.issueForm.$valid) {
      if (!issue.sending) {
        issue.sending = true;

        params = {
          name: issue.name,
          desc: issue.desc,
          idList: Commons.firstStatus().id,
          pos: 'top'
        };

        $http.post('/api/cards', params).success(appendPriority);
      }
    }
  };

  function appendPriority (createdIssue) {
    issue.id = createdIssue.id;
    issue.idShort = createdIssue.idShort;
    $http.post('/api/cards/' + issue.id + '/labels', {
      value: issue.priority
    }).success(goToCreatedIssue);
  }

  function goToCreatedIssue () {
    $location.path('/products/' + $routeParams.productId + '/issues/' + issue.idShort);
  }

  $scope.setPriority = function (p) {
    issue.priority = p;
  };

  $scope.isInValid = function (field) {
    return $scope.issueForm[field].$dirty && $scope.issueForm[field].$invalid;
  };
}
