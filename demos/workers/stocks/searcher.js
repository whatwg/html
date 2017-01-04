importScripts('io.js');
onmessage = function (event) {
  postMessage(get('search.cgi?' + event.data));
};
