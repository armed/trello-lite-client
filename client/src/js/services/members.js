angular.module('trelloLite').service('Members', Members);

Members.$inject = ['Resolver', '$cacheFactory'];
function Members (Resolver, $cacheFactory) {
  var memCache = $cacheFactory('Members'),
      members = [];

  return {
    members: members,
    resolve: Resolver.newResolver(members, memCache, '/api/members'),
    memberById: function (memberId) {
      return memCache.get(memberId) || '';
    }
  };
}
