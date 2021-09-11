<!DOCTYPE HTML>
<html lang="en">
 <head>
  <meta charset="utf-8">
  <title>Worker example: Crypto library</title>
  <script>
   const cryptoLib = new Worker('libcrypto-v1.js'); // or could use 'libcrypto-v2.js'
   function startConversation(source, message) {
     const messageChannel = new MessageChannel();
     source.postMessage(message, [messageChannel.port2]);
     return messageChannel.port1;
   }
   function getKeys() {
     let state = 0;
     startConversation(cryptoLib, "genkeys").onmessage = function (e) {
       if (state === 0)
         document.getElementById('public').value = e.data;
       else if (state === 1)
         document.getElementById('private').value = e.data;
       state += 1;
     };
   }
   function enc() {
     const port = startConversation(cryptoLib, "encrypt");
     port.postMessage(document.getElementById('public').value);
     port.postMessage(document.getElementById('input').value);
     port.onmessage = function (e) {
       document.getElementById('input').value = e.data;
       port.close();
     };
   }
   function dec() {
     const port = startConversation(cryptoLib, "decrypt");
     port.postMessage(document.getElementById('private').value);
     port.postMessage(document.getElementById('input').value);
     port.onmessage = function (e) {
       document.getElementById('input').value = e.data;
       port.close();
     };
   }
  </script>
  <style>
   textarea { display: block; }
  </style>
 </head>
 <body onload="getKeys()">
  <fieldset>
   <legend>Keys</legend>
   <p><label>Public Key: <textarea id="public"></textarea></label></p>
   <p><label>Private Key: <textarea id="private"></textarea></label></p>
  </fieldset>
  <p><label>Input: <textarea id="input"></textarea></label></p>
  <p><button onclick="enc()">Encrypt</button> <button onclick="dec()">Decrypt</button></p>
 </body>
</html>
