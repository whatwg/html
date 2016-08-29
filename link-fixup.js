(function () {
  'use strict';
  if (window.location.hash.length < 1) {
    return;
  }

  var fragmentLinks = {
    /* WATTSI_INSERTS_FRAGMENT_LINKS_HERE */
  };

  var fragid = window.location.hash.substr(1);

  if (fragid && document.getElementById(fragid)) {
    return;
  }

  // handle section-foo.html links from the old old multipage version,
  // and broken foo.html from the new version
  if ((!fragid) || !(fragid in fragment_links)) {
    var m = window.location.pathname.match(/\/(?:section-)?([\w\-]+)\.html/);
    if (m) {
      fragid = m[1];
    }
  }

  var page = fragmentLinks[fragid];
  if (page) {
    window.location.replace(page + '.html#' + fragid);
  }
})();
