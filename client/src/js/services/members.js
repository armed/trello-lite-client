angular.module('trelloLite').service('Members', Members);

function Members () {
  var memberCache = {};

  return {
    members: [],
    memberById: function (memberId) {

      if (!memberCache[memberId]) {
        memberCache[memberId] = _.find(this.members, function (member) {
          return member.id === memberId;
        });
      }
      return memberCache[memberId];
    }
  };
}
