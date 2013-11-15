angular.module('trelloLite').service('Statuses', Statuses);

Statuses.$inject = ['$routeParams', '$cacheFactory', 'Resolver'];
function Statuses ($routeParams, $cacheFactory, Resolver) {
  var statusCache = $cacheFactory('Statuses');

  function getProductStatuses () {
    return statusCache.get($routeParams.productId);
  }

  return {
    resolve: Resolver.newStatusResolver(statusCache),
    isInCache: function (productId) {
      return statusCache.get(productId);
    },
    statuses: function () {
      var cache = getProductStatuses();
      return cache ? cache.statuses : [];
    },
    statusById: function (statusId) {
      var productCache = getProductStatuses();

      if (!productCache) return '';

      var statusMap = productCache.statusMap,
          statuses = productCache.statuses;

      if (!statusMap[statusId]) {
        statusMap[statusId] = _.find(statuses, function (status) {
          return status.id === statusId;
        });
      }
      return statusMap[statusId];
    }
  };
}
