angular.module('trelloLite').directive('uploader', Uploader);

function Uploader () {
  return {
    restrict: 'AC',
    templateUrl: '/partials/uploader.tpl.html',
    scope: {
      url: '@',
      attachments: '='
    },
    link: function (scope, element) {
      var model = scope.model = {
        files: [],
        percentage: 0
      };

      var input = element.find('input[type="file"]');

      input.on('change', function (event) {
        var file = event.target.files[0];
        model.files.push(file);
        file.sent = false;

        if (file.size > 1024 * 1024 * 2) {
          file.error = 'File max allowed size is 2Mb';
        } else {
          file.sending = true;
          send(file);
        }

        scope.$digest();
      });

      scope.chooseFile = function () {
        input.click();
      };

      function send (file) {
        var xhr = new XMLHttpRequest(),
            formData = new FormData();

        formData.append('file', file);

        xhr.onload = function(xhr) {
          var attmts = JSON.parse(xhr.target.response),
              last = Array.isArray(attmts) ? _.last(attmts) : attmts;

          file.sent = true;
          file.sending = false;
          scope.attachments.unshift(last);
          scope.$apply();
        };

        xhr.upload.onprogress = function (e) {
          model.percentage = Math.round(e.loaded / e.total * 100);
          scope.$digest();
        };

        xhr.open('post', scope.url, true);
        xhr.send(formData);
      }
    }
  };
}
