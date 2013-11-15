angular.module('trelloLite').service('Products', Products);

Products.$inject = ['$routeParams', '$cacheFactory', 'Resolver'];
function Products ($routeParams, $cacheFactory, Resolver) {
  var prodCache = $cacheFactory('Products'),
      products = [];

  return {
    products: products,
    resolve: Resolver.newResolver(products, prodCache, '/api/boards'),
    product: function () {
      return prodCache.get($routeParams.productId) || '';
    },
    productCode: function () {
      var desc = this.product().desc;
      return desc ? desc.split(/\W/g)[0] : '';
    }
  };
}
