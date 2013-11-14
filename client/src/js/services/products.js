angular.module('trelloLite').service('Products', Products);

Products.$inject = ['$routeParams', '$cacheFactory', '$http', '$q'];
function Products ($routeParams, $cacheFactory, $http, $q) {
  var products = [];

  return {
    products: products,
    resolve: function () {
      var defer = $q.defer()
      if (!products.length) {
        $http.get('/api/boards')
          .success(function (data) {
            _.each(data, function (board) {
              products.push(board)
            })
            defer.resolve()
          })
      } else {
        defer.resolve()
      }
      return defer
    },
    product: function () {
      var productId = $routeParams.productId;

      if (!productCache.get(productId)) {
        productCache[productId] = _.find(this.products, function (product) {
          return product.id === productId;
        });
      }
      return productCache[productId] || '';
    },
    productCode: function () {
      var desc = this.product().desc;
      if (desc) {
        return desc.split(/\W/g)[0];
      }
      return '';
    }
  };
}
