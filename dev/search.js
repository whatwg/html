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

function resultTemplate(result) {
  return `<li><a href="${result.url}">${result.text} <span>Section ${result.section}</span></a></li>`;
}

function findSections(word, responses) {
  // If input is empty, show nothing.
  if (!word) {
    return [];
  }

  return responses
    .filter((response) => {
      const regex = new RegExp(word, 'gi');
      return response.text.match(regex);
    })
    .map(response => resultTemplate(response))
    .slice(0, maxResults).join('');
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
document.addEventListener('keyup', (event) => {
  if (event.keyCode === 191) {
    query.focus();
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

  const nextLI = currentEl.parentNode.nextSibling;
  return nextLI ? nextLI.firstChild : query;
}

function getPreviousNavigationElement(currentEl) {
  const allResults = resultsList.querySelectorAll('a');

  if (currentEl === query) {
    return allResults.length > 0 ? allResults[allResults.length - 1] : null;
  }

  const prevLI = currentEl.parentNode.previousSibling;
  return prevLI ? prevLI.firstChild : query;
}

})();
