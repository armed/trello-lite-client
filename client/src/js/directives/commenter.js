angular.module('trelloLite').directive('commenter', Commenter);

Commenter.$inject = ['$http'];
function Commenter ($http) {
  return {
    restrict: 'AC',
    templateUrl: '/partials/commenter.tpl.html',
    scope: {
      issueId: '@',
      comments: '='
    },
    link: function (scope, element) {
      var prompt = 'Write comment',
          save = 'Save',
          wait = 'Please wait...',
          unsubmittedComment = '';

      scope.submitting = false;
      scope.comment = prompt;
      scope.submitText = save;

      scope.mousedown = function () {
        if (scope.comment && scope.comment.trim()) {
          scope.submitting = true;
          scope.submitText = wait;

          $http.post('/api/cards/' + scope.issueId + '/comments', { text: scope.comment })
            .success(function (data) {
              scope.comments.unshift(data);
              scope.submitting = false;
              scope.submitText = save;
              scope.comment = prompt;
              unsubmittedComment = '';
              scope.blur();
            });
        }
      };

      scope.focus = function () {
        element.addClass('focus');
        scope.comment = unsubmittedComment;
      };

      scope.blur = function () {
        if (!scope.submitting) {
          element.removeClass('focus');
          unsubmittedComment = scope.comment;
          scope.comment = prompt;
        }
      };
    }
  };
}
