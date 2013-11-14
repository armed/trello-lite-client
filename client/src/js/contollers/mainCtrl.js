angular.module('trelloLite').controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$scope', '$routeParams', '$window', 'Products'];
function MainCtrl ($scope, $routeParams, $window, Products) {
  $scope.products = Products.products;

  $scope.isSelected = function (productId) {
    return $routeParams.productId === productId;
  };

  $scope.logout = function () {
    $window.location.href = '/logout';
  };
}
