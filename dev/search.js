'use strict';
// Find-as-you-type search

(function() {

const search = document.getElementById('search');
const query = document.getElementById('query');
const resultsList = document.getElementById('results');
const maxResults = 10;

const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;

let jsonResponses = [];

fetch('search-index.json')
  .then(response => response.json())
  .then(data => jsonResponses = data)
  .catch(err => console.error('Error loading search-index.json'));

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resultTemplate(result) {
  const url = encodeURI(result.url);
  const text = escapeHTML(result.text);
  const section = escapeHTML(result.section);
  return `<li><a href="${url}">${text} <span>Section ${section}</span></a></li>`;
}

function findSections(word, responses) {
  // If input is empty, show nothing.
  if (!word) {
    return '';
  }

  const queryLower = word.toLowerCase().trim();
  if (!queryLower) {
    return '';
  }

  return responses
    .filter(response => response && response.text && response.text.toLowerCase().includes(queryLower))
    .slice(0, maxResults)
    .map(response => resultTemplate(response))
    .join('');
}

function renderResults(results) {
  resultsList.innerHTML = findSections(results, jsonResponses);
}

query.addEventListener('input', (event) => {
  renderResults(event.target.value);
});

// Move between query and results with keyboard
document.addEventListener('keydown', (event) => {
  const current = getCurrentNavigationElement();
  if (!current) {
    return;
  }

  const keyCode = event.keyCode;
  let element;
  if (keyCode === UP_KEY_CODE) {
    element = getPreviousNavigationElement(current);
  }
  if (keyCode === DOWN_KEY_CODE) {
    element = getNextNavigationElement(current);
  }

  if (element) {
    element.focus();
    event.preventDefault();
  }
});

// Focus element on mouse over
resultsList.addEventListener('mousemove', (event) => {
  const target = event.target;
  if (target && target.nodeName === 'A') {
    target.focus();
  }
});

// If we go back from other place and click on the input, do the search again.
query.addEventListener('click', event => renderResults(query.value));

// When click on search area focus on input
search.addEventListener('click', event => query.focus());

// Slash to search '/'
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
    const active = document.activeElement;
    const tag = active ? active.tagName.toLowerCase() : '';
    if (tag !== 'input' && tag !== 'textarea' && !(active && active.isContentEditable)) {
      event.preventDefault();
      query.focus();
    }
  }
});

// Clean results when click outside the search bar
document.addEventListener('click', (event) => {
  if (event.target !== query) {
    renderResults('');
  }
});

function getCurrentNavigationElement() {
  const active = document.activeElement;
  if (active === query) {
    return active;
  }

  const parent = active.parentNode;
  if (parent) {
    const grandparent = parent.parentNode;
    if (grandparent === resultsList) {
      return active;
    }
  }
  return null;
}

function getNextNavigationElement(currentEl) {
  if (currentEl === query) {
    return resultsList.querySelector('a');
  }

  const nextLI = currentEl.parentNode.nextElementSibling;
  return nextLI ? nextLI.querySelector('a') : query;
}

function getPreviousNavigationElement(currentEl) {
  const allResults = resultsList.querySelectorAll('a');

  if (currentEl === query) {
    return allResults.length > 0 ? allResults[allResults.length - 1] : null;
  }

  const prevLI = currentEl.parentNode.previousElementSibling;
  return prevLI ? prevLI.querySelector('a') : query;
}

})();
