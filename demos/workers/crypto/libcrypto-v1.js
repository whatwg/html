function handleMessage(e) {
  if (e.data == "genkeys")
    genkeys(e.ports[0]);
  else if (e.data == "encrypt")
    encrypt(e.ports[0]);
  else if (e.data == "decrypt")
    decrypt(e.ports[0]);
}

function genkeys(p) {
  var keys = _generateKeyPair();
  p.postMessage(keys[0]);
  p.postMessage(keys[1]);
}

function encrypt(p) {
  var key, state = 0;
  p.onmessage = function (e) {
    if (state == 0) {
      key = e.data;
      state = 1;
    } else {
      p.postMessage(_encrypt(key, e.data));
    }
  };
}

function decrypt(p) {
  var key, state = 0;
  p.onmessage = function (e) {
    if (state == 0) {
      key = e.data;
      state = 1;
    } else {
      p.postMessage(_decrypt(key, e.data));
    }
  };
}

// support being used as a shared worker as well as a dedicated worker
if ('onmessage' in this) // dedicated worker
  onmessage = handleMessage;
else // shared worker
  onconnect = function (e) { e.port.onmessage = handleMessage; }


// the "crypto" functions:

function _generateKeyPair() {
  return [Math.random(), Math.random()];
}

function _encrypt(k, s) {
  return 'encrypted-' + k + ' ' + s;
}

function _decrypt(k, s) {
  return s.substr(s.indexOf(' ')+1);
}
