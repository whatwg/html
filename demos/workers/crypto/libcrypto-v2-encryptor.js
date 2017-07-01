onmessage = function (e) {
  var key = e.data;
  e.ports[0].onmessage = function (e) {
    var s = e.data;
    postMessage(_encrypt(key, s));
  }
}

function _encrypt(k, s) {
  return 'encrypted-' + k + ' ' + s;
}
