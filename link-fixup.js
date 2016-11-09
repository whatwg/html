(function () {
  'use strict';
  if (window.location.hash.length < 1) {
    return;
  }

  var fragid = window.location.hash.substr(1);

  if (fragid && document.getElementById(fragid)) {
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('GET', '/multipage/fragment-links.json');
  xhr.onload = function() {
    var fragmentLinks = xhr.response;

    // handle section-foo.html links from the old old multipage version,
    // and broken foo.html from the new version
    if (!fragid || !(fragid in fragmentLinks)) {
      var m = window.location.pathname.match(/\/(?:section-)?([\w\-]+)\.html/);
      if (m) {
        fragid = m[1];
      }
    }

    var page = fragmentLinks[fragid];
    if (page) {
      window.location.replace(page + '.html#' + fragid);
    }
  };
  xhr.send();
})();
