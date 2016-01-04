window.addEventListener('DOMContentLoaded', function () {
  if (window.location.hash.length < 1)
    return;

  var fragid = window.location.hash.substr(1);
  if (fragid && document.getElementById(fragid))
    return;

  var script = document.createElement('script');
  script.src = '/multipage/fragment-links.js';
  document.body.appendChild(script);
});
