(function () {
  'use strict';
  if (!(/^\/(dev|multipage)\//.test(window.location.pathname))) {
    return;
  }

  var fragid = '';
  try {
    fragid = decodeURIComponent(window.location.hash.slice(1));
  } catch (e) {
    fragid = window.location.hash.slice(1);
  }

  if (fragid && document.getElementById(fragid)) {
    return;
  }

  function hasFragment(obj, key) {
    return Boolean(obj && Object.prototype.hasOwnProperty.call(obj, key));
  }

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('GET', '/multipage/fragment-links.json');
  xhr.onload = function() {
    var fragmentLinks = xhr.response;

    // Handle section-foo.html links from the old old multipage version,
    // and broken foo.html from the new version. Only run this for 404s.
    if ((!fragid || !hasFragment(fragmentLinks, fragid)) && document.title === '404 Not Found') {
      var m = window.location.pathname.match(/\/(?:section-)?([\w\-]+)\.html/);
      if (m) {
        fragid = m[1];
      }
    }

    if (hasFragment(fragmentLinks, fragid)) {
      var page = fragmentLinks[fragid];
      if (typeof page === 'string') {
        if (page === '') {
          page = './';
        } else {
          page += '.html';
        }
        window.location.replace(page + '#' + encodeURIComponent(fragid));
      }
    }
  };
  xhr.send();
})();
