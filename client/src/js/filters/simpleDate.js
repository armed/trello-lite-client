angular.module('trelloLite').filter('simpleDate', SimpleDate);

function SimpleDate () {
  return function (input) {
    return moment(input).format('llll');
  };
}
