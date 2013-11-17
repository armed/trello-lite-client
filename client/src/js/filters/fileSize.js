angular.module('trelloLite').filter('fileSize', FileSize);

function FileSize () {
  var K = 1000,
      M = K * 1000;

  return function (size) {
    if (size >= K && size < M) {
      size = Math.round(size * 100 / K) / 100;
      size += 'Kb';
    } else if (size >= M) {
      size = Math.round(size * 100 / M) / 100;
      size += 'Mb';
    } else {
      size += 'b';
    }

    return size;
  };
}
