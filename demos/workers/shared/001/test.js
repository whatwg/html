onconnect = function(e) {
  var port = e.ports[0];
  port.postMessage('Hello World!');
}
