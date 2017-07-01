onmessage = function (e) {
  var k = _generateKeyPair();
  e.ports[0].postMessage(k[0]);
  e.ports[0].postMessage(k[1]);
  close();
}

function _generateKeyPair() {
  return [Math.random(), Math.random()];
}
