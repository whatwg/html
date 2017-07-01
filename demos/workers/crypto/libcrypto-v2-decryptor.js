onmessage = function (e) {
  var key = e.data;
  e.ports[0].onmessage = function (e) {
    var s = e.data;
    postMessage(_decrypt(key, s));
  }
}

function _decrypt(k, s) {
  return s.substr(s.indexOf(' ')+1);
}
