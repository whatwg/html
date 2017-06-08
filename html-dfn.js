// A fork of https://resources.whatwg.org/dfn.js which works for HTML's multipage version by using xrefs.json.
'use strict';

(function() {

var dfnMapDone = false;
var dfnMap = {};
var dfnPanel;
var dfnTimeout;
function dfnLoad(event) {
  var node = event.target;
  if (node && node instanceof HTMLAnchorElement) {
    return;
  }
  dfncheck:
  if (node.tagName !== "DFN") {
    while (node.parentNode) {
      node = node.parentNode;
      if (node.tagName === "DFN") {
        break dfncheck;
      }
      if (node.tagName === "BODY") {
        return;
      }
    }
    return;
  }
  if (dfnPanel) {
    dfnPanel.parentNode.removeChild(dfnPanel);
    dfnPanel = null;
  }
  if (!dfnMapDone) {
    document.body.classList.remove('dfnEnabled');
    dfnPanel = document.createElement('div');
    dfnPanel.className = 'dfnPanel';
    dfnPanel.innerHTML = 'Loading cross-references…';
    dfnMovePanel(null);
    fetch('/xrefs.json')
      .then(response => response.json())
      .then(data => {
        dfnMap = data;
        dfnMapDone = true;
        document.body.classList.add('dfnEnabled');
        dfnPanel.parentNode.removeChild(dfnPanel);
        dfnPanel = null;
        dfnShow(event);
      });
  } else {
    dfnShow(event);
  }
}
function dfnShow(event) {
  var isMultipage = document.documentElement.classList.contains('split');
  if (dfnTimeout) {
    clearTimeout(dfnTimeout);
    dfnTimeout = null;
  }
  if (dfnMapDone) {
    var node = event.target;
    while (node && (!node instanceof HTMLElement || !(node.localName == 'dfn' || (node instanceof HTMLHeadingElement && node.hasAttribute('data-dfn-type'))))) {
      node = node.parentNode;
    }
    if (node) {
      event.preventDefault();
      var panel = document.createElement('div');
      panel.className = 'dfnPanel';
      if (node.id || node.parentNode.id) {
        var permalinkP = document.createElement('p');
        var permalinkA = document.createElement('a');
        permalinkA.href = '#' + (node.id || node.parentNode.id);
        permalinkA.textContent = '#' + (node.id || node.parentNode.id);
        permalinkP.appendChild(permalinkA);
        panel.appendChild(permalinkP);
      }
      if (node.firstChild instanceof HTMLAnchorElement) {
        var realLinkP = document.createElement('p');
        realLinkP.className = 'spec-link';
        realLinkP.textContent = 'Spec: ';
        var realLinkA = document.createElement('a');
        realLinkA.href = node.firstChild.href;
        realLinkA.textContent = node.firstChild.href;
        realLinkP.appendChild(realLinkA);
        panel.appendChild(realLinkP);
      }
      var p = document.createElement('p');
      panel.appendChild(p);
      if (node.id in dfnMap || node.parentNode.id in dfnMap) {
        p.textContent = 'Referenced in:';
        var ul = document.createElement('ul');
        var anchorMap = {};
        if (node.id in dfnMap) {
          anchorMap = dfnMap[node.id];
        }
        if (node.parentNode.id in dfnMap) {
          anchorMap = dfnMap[node.parentNode.id];
        }
        for (var header in anchorMap) {
          var li = document.createElement('li');
          for (var i = 0; i < anchorMap[header].length; i += 1) {
            var a = document.createElement('a');
            a.onclick = dfnMovePanel;
            a.href = anchorMap[header][i];
            if (!isMultipage) {
              a.href = a.href.substring(a.href.indexOf('#'));
            }
            if (i === 0) {
              var headerFormatted = header.replace(/</g, '&lt;');
              headerFormatted = headerFormatted.replace(/ ([^ ]+) (element(?!s)|attribute(?!s)|interface(?!s)|common interface|object)/g, ' <code>$1</code> $2');
              headerFormatted = headerFormatted.replace(/<code>(Before|After|Other|The|on|an|for|user|User|custom|Custom|built-in|abstract|exotic|global|settings|Browser|Serializable|Transferable|HTML|IDL|document)<\/code>/, '$1');
              headerFormatted = headerFormatted.replace(/(type=[^\)]+)/g, '<code>$1</code>');
              headerFormatted = headerFormatted.replace(/(Link type) "([^"]+)"/g, '$1 "<code>$2</code>"');
              headerFormatted = headerFormatted.replace(/(ImageBitmap|WindowOrWorkerGlobalScope|multipart\/x-mixed-replace|registerProtocolHandler\(\)|registerContentHandler\(\))|storage|/, '<code>$1</code>');
              a.innerHTML = headerFormatted;
            } else {
              li.appendChild(document.createTextNode(' '));
              a.appendChild(document.createTextNode('(' + (i + 1) + ')'));
            }
            li.appendChild(a);
          }
          ul.appendChild(li);
        }
        panel.appendChild(ul);
      } else {
        p.textContent = 'No references in this specification.';
      }
      node.appendChild(panel);
      dfnPanel = panel;
    }
  } else {
    dfnTimeout = setTimeout(dfnLoad, 250, event);
  }
}

function dfnMovePanel(event) {
  if (!dfnPanel) {
    return;
  }
  dfnPanel.style.position = 'fixed';
  dfnPanel.style.left = '1em';
  dfnPanel.style.bottom = '1em';
  dfnPanel.style.maxWidth = '20em';
  dfnPanel.style.maxHeight = '50vh';
  dfnPanel.style.overflow = 'auto';
  document.body.appendChild(dfnPanel);
  if (event) {
    event.stopPropagation();
  }
}

document.body.classList.add('dfnEnabled');
document.addEventListener('click', dfnLoad, true);

})();
