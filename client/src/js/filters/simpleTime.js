angular.module('trelloLite').filter('simpleTime', SimpleTime);

function SimpleTime () {
  moment.lang('en');

  var delta = 0;

  return function (input) {
    var userTime = moment(),
        serverTime = moment(input);

    if (userTime + delta < serverTime) {
      delta = serverTime - userTime;
    }

    return moment(input).from(userTime + delta);
  };
}
