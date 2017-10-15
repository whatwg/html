(function () {
  'use strict';
  if (!(/^\/(dev|multipage)\//.test(window.location.pathname))) {
    return;
  }

  var fragid = decodeURIComponent(window.location.hash.substr(1));

  if (fragid && document.getElementById(fragid)) {
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('GET', '/multipage/fragment-links.json');
  xhr.onload = function() {
    var fragmentLinks = xhr.response;

    // Handle section-foo.html links from the old old multipage version,
    // and broken foo.html from the new version. Only run this for 404s.
    if ((!fragid || !(fragid in fragmentLinks)) && document.title === '404 Not Found') {
      var m = window.location.pathname.match(/\/(?:section-)?([\w\-]+)\.html/);
      if (m) {
        fragid = m[1];
      }
    }

    if (fragid in fragmentLinks) {
      var page = fragmentLinks[fragid];
      if (page === '') {
        page = './';
      } else {
        page += '.html';
      }
      window.location.replace(page + '#' + encodeURIComponent(fragid));
    }
  };
  xhr.send();
})();
