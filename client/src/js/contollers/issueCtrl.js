angular.module('trelloLite').controller('IssueCtrl', IssueCtrl);

IssueCtrl.$inject = ['$scope', '$http', '$routeParams', 'Members', 'Commons'];
function IssueCtrl ($scope, $http, $routeParams, Members, Commons) {
  $scope.loading = true;
  $scope.util = Commons;

  $http.get(['/api/boards/', $routeParams.productId, '/cards/', $routeParams.idShort].join(''))
    .success(function (data) {
      $scope.issue = data;
      $scope.comments = [];
      $scope.attachments = [];
      $scope.loading = false;

      $scope.attachmentUrl = '/api/cards/' + $scope.issue.id + '/attachment';

      _.forEach($scope.issue.actions, function (action) {
        if (isAttach(action)) {
          $scope.attachments.push(action);
        } else if (isComment(action) || isCreate(action) || isStatus(action)) {
          $scope.comments.push(action);
        }
      });
    });

  function isAttach (action) {
    return action.type === 'addAttachmentToCard';
  }

  function isComment (action) {
    return action.type === 'commentCard';
  }

  function isCreate (action) {
    return action.type === 'createCard';
  }

  function isStatus (action) {
    return action.type === 'updateCard' &&
      action.data.listBefore && action.data.listAfter;
  }

  $scope.commentBody = function (comment) {
    if (isStatus(comment)) {
      return comment.data.listBefore.name + ' → ' + comment.data.listAfter.name;
    } else if (isCreate(comment)) {
      return '→ ' + comment.data.list.name;
    } else {
      return Commons.extractText(comment.data.text);
    }
  };

  $scope.isSystem = function (comment) {
    return !isComment(comment);
  };

  $scope.memberName = function (comment) {
    var cmt = isComment(comment),
        crt = isCreate(comment);

    if (cmt || crt) {
      var dataText = cmt ? comment.data.text : $scope.issue.desc;

      var login = Commons.extractLogin(dataText);
      if (login) {
        return login;
      }
    }
    var member = Members.memberById(comment.idMemberCreator);
    return member ? member.fullName : '';
  };

  $scope.noComments = function () {
    return !$scope.loading && $scope.comments.length === 0;
  };

  $scope.hasComments = function () {
    return !$scope.loading && $scope.comments.length > 0;
  };

  $scope.issueId = Commons.issueCode;
  $scope.extractText = Commons.extractText;
  $scope.extractLogin = Commons.extractLogin;
}
