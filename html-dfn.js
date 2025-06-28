// A fork of https://resources.whatwg.org/dfn.js which works for HTML's multipage version by using xrefs.json.
'use strict';

(() => {
  // Detect if we're in a multipage spec (used for restoring cross-references)
  const isMultipage = document.documentElement.classList.contains('split');
  let dfnMapDone = false; // True once xrefs.json has been loaded
  let dfnMap = {};        // Parsed cross-reference data
  let dfnPanel = null;    // The floating panel element

  // Check if the definition is cross-spec (i.e., contains a link to another spec)
  const isCrossSpecDfn = dfn => dfn.firstChild instanceof HTMLAnchorElement;

  // Handle all document click events (capture clicks on <dfn> and headings)
  const handleClick = event => {
    if (event.button !== 0) return; // Only left-click

    let current = event.target;
    let node = null;
    let eventInDfnPanel = false;

    // Traverse up to find a definition node or detect clicks inside the panel
    while (current) {
      if (dfnPanel && current === dfnPanel) eventInDfnPanel = true;
      if (current.matches('dfn, h2[data-dfn-type], h3[data-dfn-type], h4[data-dfn-type], h5[data-dfn-type], h6[data-dfn-type]')) {
        node = current;
      }
      current = current.parentElement;
    }

    // Close the panel if click happened outside it
    if (!eventInDfnPanel) closePanel();
    if (!node) return;

    const id = node.id || node.parentNode?.id;
    const path = isMultipage ? location.pathname : '';
    const specURL = isCrossSpecDfn(node) ? node.firstChild.href : '';

    if (specURL) event.preventDefault(); // Prevent leaving the page

    loadReferences(id, path, specURL);
    node.appendChild(dfnPanel);

    // Save state in case user navigates back/forward (multipage only)
    if (isMultipage) {
      sessionStorage.dfnId = id;
      sessionStorage.dfnPath = path;
      sessionStorage.dfnSpecURL = specURL;
    }
  };

  // Load and show references for the selected definition
  const loadReferences = (id, path, specURL) => {
    dfnPanel?.remove(); // Remove existing panel if any
    dfnPanel = createPanel(id, path, specURL);

    const p = document.createElement('p');
    dfnPanel.appendChild(p);

    // Load xrefs.json if not already done
    if (!dfnMapDone) {
      p.textContent = 'Loading cross-references…';
      fetch('/xrefs.json')
        .then(res => {
          if (!res.ok) throw new Error('xrefs.json not found');
          return res.json();
        })
        .then(data => {
          dfnMap = data;
          dfnMapDone = true;
          if (dfnPanel) fillInReferences(id);
        })
        .catch(err => {
          console.error('Failed to load xrefs.json:', err);
          p.textContent = 'Error loading cross-references.';
        });
    } else {
      fillInReferences(id);
    }
  };

  // Create the floating definition panel
  const createPanel = (id, path, specURL) => {
    const panel = document.createElement('div');
    panel.className = 'dfn-panel on';
    panel.setAttribute('tabindex', '0'); // Keyboard accessibility
    panel.dataset.id = id;

    // Add permalink to the definition
    if (id) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = `${path}#${id}`;
      a.onclick = closePanel;
      a.textContent = `#${id}`;
      p.appendChild(a);
      panel.appendChild(p);
    }

    // Add cross-spec link if available
    if (specURL) {
      const p = document.createElement('p');
      p.className = 'spec-link';
      p.textContent = 'Spec: ';
      const a = document.createElement('a');
      a.href = specURL;
      a.onclick = closePanel;
      a.textContent = specURL;
      p.appendChild(a);
      panel.appendChild(p);
    }

    return panel;
  };

  // Fill the panel with references from xrefs.json
  const fillInReferences = id => {
    const p = dfnPanel.lastChild;

    if (!(id in dfnMap)) {
      p.textContent = 'No references in this specification.';
      return;
    }

    p.textContent = 'Referenced in:';
    const ul = document.createElement('ul');
    const anchorMap = dfnMap[id];

    for (const header in anchorMap) {
      const li = document.createElement('li');

      anchorMap[header].forEach((href, i) => {
        const a = document.createElement('a');
        a.href = isMultipage ? href : href.substring(href.indexOf('#'));
        a.onclick = movePanel;

        // First link: format the header
        if (i === 0) {
          a.innerHTML = formatHeader(header);
        } else {
          li.appendChild(document.createTextNode(' '));
          a.textContent = `(${i + 1})`;
        }

        li.appendChild(a);
      });

      ul.appendChild(li);
    }

    dfnPanel.appendChild(ul);
  };

  // Format the header label using basic heuristics and code tags
  const formatHeader = header =>
    header
      .replace(/</g, '&lt;') // Escape angle brackets
      .replace(/ ([^ ]+) (element(?!s)|attribute(?!s)|interface(?!s)|common interface|object)/g, ' <code>$1</code> $2')
      .replace(/<code>(Before|After|Other|The|on|an|for|user|User|custom|Custom|built-in|abstract|exotic|global|settings|Browser|Serializable|Transferable|HTML|IDL|document)<\/code>/, '$1')
      .replace(/(type=[^)]+)/g, '<code>$1</code>')
      .replace(/(Link type) "([^"]+)"/g, '$1 "<code>$2</code>"')
      .replace(/(ImageBitmap|WindowOrWorkerGlobalScope|multipart\/x-mixed-replace|registerProtocolHandler\(\)|registerContentHandler\(\))|storage|/, '<code>$1</code>');

  // Remove and destroy the panel
  const closePanel = event => {
    dfnPanel?.remove();
    dfnPanel = null;

    if (event) event.stopPropagation();

    if (isMultipage) {
      delete sessionStorage.dfnId;
      delete sessionStorage.dfnPath;
      delete sessionStorage.dfnSpecURL;
    }
  };

  // Move panel into "activated" state (i.e., follow link or highlight)
  const movePanel = event => {
    if (!dfnPanel) return;
    dfnPanel.classList.add('activated');
    if (event) event.stopPropagation();
  };

  // Restore panel after navigation (multipage only)
  const restoreOrClosePanelOnNav = () => {
    const { dfnId: id, dfnPath: path, dfnSpecURL: specURL } = sessionStorage;

    if (id) {
      if (!dfnPanel || dfnPanel.dataset.id !== id) {
        loadReferences(id, path, specURL);
        movePanel();
        document.body.insertBefore(dfnPanel, document.body.firstChild);
      }
    } else {
      closePanel();
    }
  };

  // ===== Setup =====

  // Add CSS hook to body for styling
  document.body.classList.add('dfnEnabled');

  // Global listeners
  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePanel();
  });

  // Multipage spec: restore previous panel state on load/history nav
  if (isMultipage) {
    document.addEventListener('DOMContentLoaded', restoreOrClosePanelOnNav);
    window.addEventListener('pageshow', restoreOrClosePanelOnNav);
  }
})();
