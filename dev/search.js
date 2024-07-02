'use strict';

// Find-as-you-type search
document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('search');
  const query = document.getElementById('query');
  const resultsList = document.getElementById('results');
  const maxResults = 10;

  const UP_KEY_CODE = 38;
  const DOWN_KEY_CODE = 40;

  let jsonResponses = [];

  async function fetchSearchIndex() {
    try {
      const response = await fetch('search-index.json');
      jsonResponses = await response.json();
    } catch (err) {
      console.error('Error loading search-index.json', err);
    }
  }

  fetchSearchIndex();

  const resultTemplate = (result) =>
    `<li><a href="${result.url}">${result.text} <span>Section ${result.section}</span></a></li>`;

  const findSections = (word, responses) => {
    if (!word) return [];

    const regex = new RegExp(word, 'gi');
    return responses
      .filter((response) => response.text.match(regex))
      .map(resultTemplate)
      .slice(0, maxResults)
      .join('');
  };

  const renderResults = (results) => {
    resultsList.innerHTML = findSections(results, jsonResponses);
  };

  query.addEventListener('input', (event) => {
    renderResults(event.target.value);
  });

  document.addEventListener('keydown', (event) => {
    const current = getCurrentNavigationElement();
    if (!current) return;

    let element;
    if (event.keyCode === UP_KEY_CODE) {
      element = getPreviousNavigationElement(current);
    }
    if (event.keyCode === DOWN_KEY_CODE) {
      element = getNextNavigationElement(current);
    }

    if (element) {
      element.focus();
      event.preventDefault();
    }
  });

  resultsList.addEventListener('mousemove', (event) => {
    const target = event.target;
    if (target && target.nodeName === 'A') {
      target.focus();
    }
  });

  query.addEventListener('click', () => renderResults(query.value));

  search.addEventListener('click', () => query.focus());

  document.addEventListener('keyup', (event) => {
    if (event.keyCode === 191) {
      query.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target !== query) {
      renderResults('');
    }
  });

  const getCurrentNavigationElement = () => {
    const active = document.activeElement;
    if (active === query) return active;

    const parent = active.parentNode;
    if (parent && parent.parentNode === resultsList) {
      return active;
    }
    return null;
  };

  const getNextNavigationElement = (currentEl) => {
    if (currentEl === query) {
      return resultsList.querySelector('a');
    }

    const nextLI = currentEl.parentNode.nextSibling;
    return nextLI ? nextLI.firstChild : query;
  };

  const getPreviousNavigationElement = (currentEl) => {
    const allResults = resultsList.querySelectorAll('a');

    if (currentEl === query) {
      return allResults.length > 0 ? allResults[allResults.length - 1] : null;
    }

    const prevLI = currentEl.parentNode.previousSibling;
    return prevLI ? prevLI.firstChild : query;
  };
});
