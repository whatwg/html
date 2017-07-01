importScripts('io.js');
var timer;
var symbol;
function update() {
  postMessage(symbol + ' ' + get('stock.cgi?' + symbol));
  timer = setTimeout(update, 10000);
}
onmessage = function (event) {
  if (timer)
    clearTimeout(timer);
  symbol = event.data;
  update();
};
