// A fork of https://resources.whatwg.org/dfn.js which works for HTML's multipage version by using xrefs.json.
'use strict';

(function() {

var isMultipage = document.documentElement.classList.contains('split');
var dfnMapDone = false;
var dfnMap = {};
var dfnPanel;

function isCrossSpecDfn(dfn) {
  return dfn.firstChild && dfn.firstChild instanceof HTMLAnchorElement;
}

function dfnLoad(event) {
  var current = event.target;
  var node;
  var eventInDfnPanel = false;
  while (current) {
    if (current.localName === 'dfn') {
      node = current;
    }
    if (dfnPanel && current === dfnPanel) {
      eventInDfnPanel = true;
    }
    current = current.parentElement;
  }
  if (!eventInDfnPanel) {
    dfnClosePanel();
  }
  if (!node) {
    return;
  }
  if (isCrossSpecDfn(node)) {
    event.preventDefault();
  }
  dfnPanel = document.createElement('div');
  dfnPanel.className = 'dfnPanel';
  if (node.id || node.parentNode.id) {
    var permalinkP = document.createElement('p');
    var permalinkA = document.createElement('a');
    permalinkA.href = '#' + (node.id || node.parentNode.id);
    permalinkA.onclick = dfnClosePanel;
    permalinkA.textContent = '#' + (node.id || node.parentNode.id);
    permalinkP.appendChild(permalinkA);
    dfnPanel.appendChild(permalinkP);
  }
  if (isCrossSpecDfn(node)) {
    var realLinkP = document.createElement('p');
    realLinkP.className = 'spec-link';
    realLinkP.textContent = 'Spec: ';
    var realLinkA = document.createElement('a');
    realLinkA.href = node.firstChild.href;
    realLinkA.onclick = dfnClosePanel;
    realLinkA.textContent = node.firstChild.href;
    realLinkP.appendChild(realLinkA);
    dfnPanel.appendChild(realLinkP);
  }
  var p = document.createElement('p');
  dfnPanel.appendChild(p);
  if (!dfnMapDone) {
    p.textContent = 'Loading cross-references…';
    node.appendChild(dfnPanel);
    fetch('/xrefs.json')
      .then(response => response.json())
      .then(data => {
        dfnMap = data;
        dfnMapDone = true;
        if (dfnPanel) {
          dfnShow(p, node);
        }
      }).catch(err => {
        p.textContent = 'Error loading cross-references.';
      });
  } else {
    dfnShow(p, node);
  }
  node.appendChild(dfnPanel);
}
function dfnShow(p, node) {
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
    dfnPanel.appendChild(ul);
  } else {
    p.textContent = 'No references in this specification.';
  }
}

function dfnClosePanel(event) {
  if (dfnPanel) {
    dfnPanel.remove();
    dfnPanel = null;
  }
  if (event) {
    event.stopPropagation();
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

document.documentElement.classList.add('dfnEnabled');
document.addEventListener('click', dfnLoad);

})();
