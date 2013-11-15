angular.module('trelloLite').service('Resolver', Resolver);

Resolver.$inject = ['$http', '$q', '$route'];
function Resolver ($http, $q, $route) {
  return {
    newResolver: function (items, itemCache, url) {
      return function () {
        var defer = $q.defer();
        if (!items.length) {
          $http.get(url)
            .success(function (data) {
              _.each(data, function (p) {
                items.push(p);
                itemCache.put(p.id, p);
              });
              defer.resolve();
            });
        } else {
          defer.resolve();
        }
        return defer;
      };
    },
    newStatusResolver: function (cache) {
      return function () {
        var defer = $q.defer(),
            pId = $route.current.params.productId;

        if (!cache.get(pId)) {
          $http.get('/api/boards/' + pId + '/lists')
            .success(function (statuses) {
              cache.put(pId, {
                statuses: statuses,
                statusMap: {}
              });
              defer.resolve();
            });
        } else {
          defer.resolve();
        }
        return defer;
      };
    }
  };
}
