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

// embedded full-spec search form
(function() {
  const headerElement = document.querySelector("header"),
    searchForm = document.createElement("form"),
    searchInput = document.createElement("input"),
    searchSubmit = document.createElement("input"),
    searchSelectDiv = document.createElement("div"),
    searchSelect = document.createElement("select"),
    searchButton = document.createElement("p"),
    searchWidget = document.createElement("div"),
    searchWidgetClose = document.createElement("div"),
    searchWidgetStyle = document.createElement("style"),
    searchWidgetStyleProperties = `
      #searchbutton {
         position: fixed;
         top: 0;
         right: 18px;
         background: #eee;
         font-size: 12px;
         padding: 2px 5px 2px 5px;
         border-radius: 0 0 6px 6px;
         z-index: 10;
         cursor: pointer;
      }
      #searchwidget {
        display: none;
        width: 308px;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 11;
        padding-right: 12px;
        padding-bottom: 20px;
        background-color: #eee;
        box-shadow: 0 0 3px #999;
      }
      #searchwidget select:empty {
        display: none;
      }
      input#txtAutoComplete {
        width: 240px;
        height: 18px;
        vertical-align: middle;
      }
      #searchwidget form {
        margin-top: 24px;
        margin-left: 20px
      }
      #searchwidget input[type="submit"] {
        vertical-align: middle;
        border: none;
        font-size: 120%;
        cursor: pointer;
        background-color: #eee;
      }
      #searchwidgetclose {
        position: fixed;
        top: 0px;
        right: 18px;
        color: #999;
        font-size: 24px;
        font-family: sans-serif;
        line-height: 22px;
        z-index: 12;
        cursor: pointer;
      }
      // move doc title and WHATWG logo down to make room for search button
      .head { padding: 1.5em 0 0 0 }
      .head .logo img { top: 1.5em }`,
    resultsOverlay = document.createElement("div"),
    resultsClose = document.createElement("div"),
    results = document.createElement("div"),
    resultsModalBackground = document.createElement("div"),
    resultsStyle = document.createElement("style"),
    resultsStyleProperties = `
      .results-wrapper-visible {
        opacity: 1 !important;
        visibility: visible !important;
      }
      .results-wrapper-overlay {
        border: none;
        margin: auto;
        border-radius: 1px;
        overflow: auto;
        height: 80%;
        box-shadow: 0px 3px 10px rgba(34, 25, 25, 0.4);
        border-collapse: separate;
        background: white;
        padding: 30px;
        width: 70%;
        position: fixed !important;
        top: 5%;
        left: 12%;
        opacity: 0;
        z-index: 100002;
        visibility: hidden;
        -webkit-transition: all 0.25s linear;
        -moz-transition: all 0.25s linear;
        -ms-transition: all 0.25s linear;
        -o-transition: all 0.25s linear;
        transition: all 0.25s linear;
        -ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=7, Direction=135, Color='#888888')";
        filter: progid:DXImageTransform.Microsoft.Shadow(Strength=7, Direction=135, Color='#888888');
      }
      #resultsclose {
        position: fixed;
        top: 6.5%;
        right: 15%;
        color: #999;
        font-size: 24px;
        font-family: sans-serif;
        line-height: 22px;
        cursor: pointer;
      }
      @media (max-width: 1410px) { #resultsclose { right: 14.8%; } }
      @media (max-width: 1360px) { #resultsclose { right: 14.6%; } }
      @media (max-width: 1310px) { #resultsclose { right: 14.4%; } }
      @media (max-width: 1260px) { #resultsclose { right: 14.2%; } }
      @media (max-width: 1210px) { #resultsclose { right: 14.0%; } }
      @media (max-width: 1160px) { #resultsclose { right: 13.8%; } }
      @media (max-width: 1110px) { #resultsclose { right: 13.7%; } }
      @media (max-width: 1050px) { #resultsclose { right: 13.6%; } }
      @media (max-width:  960px) { #resultsclose { right: 13.5%; } }
      @media (max-width:  910px) { #resultsclose { right: 13.4%; } }
      @media (max-width:  860px) { #resultsclose { right: 13.3%; } }
      @media (max-width:  810px) { #resultsclose { right: 13.2%; } }
      @media (max-width:  785px) { #resultsclose { right: 13.1%; } }
      @media (max-width:  760px) { #resultsclose { right: 13.0%; } }
      @media (max-width:  710px) { #resultsclose { right: 12.0%; } }
      @media (max-width:  785px) { #resultsclose { right: 11.5%; } }
      @media (max-width:  660px) { #resultsclose { right: 11%;   } }
      @media (max-width:  610px) { #resultsclose { right: 10%;   } }
      @media (max-width:  560px) { #resultsclose { right: 9%;    } }
      @media (max-width:  510px) { #resultsclose { right: 8%;    } }
      @media (max-width:  460px) { #resultsclose { right: 7%;    } }
      @media (max-width:  410px) { #resultsclose { right: 6%;    } }
      @media (max-width:  360px) { #resultsclose { right: 5%;    } }
      .results-modal-background {
        position: fixed !important;
        top: 0px;
        left: 0px;
        height: 130%;
        width: 100%;
        z-index: 100001;
        background-color: white;
        opacity: 0;
        -ms-filter: "alpha(opacity=0)";
        filter: alpha(opacity=0);
        display: none;
        -webkit-transition: all 0.25s linear;
        -moz-transition: all 0.25s linear;
        -ms-transition: all 0.25s linear;
        -o-transition: all 0.25s linear;
        transition: all 0.25s linear;
      }
      .results-modal-background-visible {
        opacity: 0.8;
        -ms-filter: "alpha(opacity=80)";
        filter: alpha(opacity=80);
        display: block;
      }
      .result {
        margin-bottom: 26px;
      }
      .result h4 {
        font-size: 18px;
        margin-top: 0px;
        margin-bottom: 3px;
        font-weight: normal;
      }
      .resulturl {
        color: #3c790a;
      }
      .resultsnippet em {
        font-style: normal;
        font-weight: bold;
      }
      .result p {
        font-size: 13px;
      }
      #results {
        padding-left: 8px;
        margin-bottom: 40px;
      }
      #resultsCount {
        font-size: 13px;
        line-height: 43px;
        color: #808080;
        margin-bottom: 12px;
      }`,
    searchbase = "https://search.sideshowbarker.net/solr/select",
    searchparams = "&fl=id,inboundlinks_anchortext_txt,sku&wt=json&rows=99&hl=true";

  searchForm.action = "javascript:void(0)";
  searchInput.id = "txtAutoComplete";
  searchInput.name = "query";
  searchSubmit.type = "submit";
  searchSubmit.value = "🔍";
  searchSelect.id="suggestionslist";
  searchSelect.name="choice";
  searchSelect.size="0";
  placeholderText = "Search the full text of the spec";
  searchButton.id = "searchbutton";
  searchButton.textContent = "Search";
  searchButton.title = placeholderText;
  searchButton.tabIndex = 0;
  searchWidget.id = "searchwidget";
  searchWidgetClose.id = "searchwidgetclose";
  searchWidgetClose.textContent = "×";
  searchWidgetClose.tabIndex = 0;
  searchWidgetStyle.textContent = searchWidgetStyleProperties;
  resultsOverlay.className = "results-wrapper-overlay";
  resultsClose.id = "resultsclose";
  resultsClose.textContent = "×";
  resultsClose.tabIndex = 0;
  resultsModalBackground.className = "results-modal-background";
  resultsStyle.textContent = resultsStyleProperties;
  results.id = "results";

  headerElement.appendChild(searchButton);
  headerElement.appendChild(searchWidget);
  headerElement.appendChild(resultsOverlay);
  headerElement.appendChild(resultsModalBackground);
  searchForm.appendChild(searchInput);
  searchForm.appendChild(searchSubmit);
  searchSelectDiv.appendChild(searchSelect);
  searchForm.appendChild(searchSelectDiv);
  searchWidget.appendChild(searchWidgetClose);
  searchWidget.appendChild(searchWidgetStyle);
  searchWidget.appendChild(searchForm);
  resultsOverlay.appendChild(resultsStyle);
  resultsOverlay.appendChild(resultsClose);
  resultsOverlay.appendChild(results);

  searchWidgetClose.addEventListener("click",
    e => searchWidget.style.display = "none");
  searchWidgetClose.addEventListener("keyup",
    e => {
      if (e.keyCode === 13) {
        searchWidget.style.display = "none"
      }
    });
  searchButton.addEventListener("click",
    function() {
      searchWidget.style.display = "block";
      searchInput.placeholder = placeholderText;
      searchInput.focus();
    });
  searchButton.addEventListener("keyup",
    e => {
      if (e.keyCode === 13) {
        searchWidget.style.display = "block";
        searchInput.placeholder = placeholderText;
        searchInput.focus();
      }
    });
  resultsClose.addEventListener("click",
    function() {
      resultsOverlay.classList.remove('results-wrapper-visible');
      resultsModalBackground.classList.remove('results-modal-background-visible');
    });
  resultsClose.addEventListener("keyup",
    e => {
      if (e.keyCode === 13) {
        resultsOverlay.classList.remove('results-wrapper-visible');
        resultsModalBackground.classList.remove('results-modal-background-visible');
      }
    });
  resultsOverlay.addEventListener("transitionend",
    e => {
      var firstResultLink = document.querySelector(".result a");
      if (firstResultLink) {
        firstResultLink.focus();
      }
    });

  const suggestionslist = document.querySelector("#suggestionslist");
  var suggestbase = "https://search.sideshowbarker.net/suggest.json?q=";
  searchInput.addEventListener("keyup",
    function (e) { showSuggestions(e) }, false);
  suggestionslist.addEventListener("keyup",
    function(e) { changeFocus(e) }, true);
  suggestionslist.addEventListener("change",
    function() { searchInput.value = suggestionslist.value }, false);

  searchForm.addEventListener("submit", fetchSearchResults, false);

  function fetchSearchResults() {
    const searchString = encodeURIComponent(searchInput.value);
    fetch(searchbase + "?query=" + searchString + searchparams)
    .then(response => response.json())
    .then(data => showSearchResults(data))
  }

  function showSearchResults(data) {
    results.innerHTML = "";
    resultsOverlay.classList.add("results-wrapper-visible");
    resultsModalBackground.classList.add("results-modal-background-visible");
    const docs = data.response.docs,
      highlighting = data.highlighting,
      resultsCount = document.createElement("p");
    resultsCount.id = "resultsCount";
    results.appendChild(resultsCount);
    if (docs.length === 0) {
      resultsCount.textContent = "No results";
    } else if (docs.length === 1) {
      resultsCount.textContent = "1 result";
    } else {
      resultsCount.textContent = "About " + docs.length + " results";
    }
    for (var i = 0; i < docs.length; i += 1) {
      const doc = docs[i];
      result = document.createElement("div"),
      resultTitle = document.createElement("h4"),
      resultLink = document.createElement("a"),
      resultURL = document.createElement("p"),
      resultSnippet = document.createElement("p");

      result.className = "result";
      resultURL.className = "resulturl";
      resultSnippet.className = "resultsnippet";
      resultLink.href = doc.sku;
      resultURL.textContent = doc.sku;
      resultLink.innerHTML = "HTML Standard";
      resultLink.tabIndex = 0;
      if (doc.inboundlinks_anchortext_txt) {
        if (doc.inboundlinks_anchortext_txt[0] === "Table of Contents"
          && doc.inboundlinks_anchortext_txt[2]) {
          resultLink.innerHTML = doc.inboundlinks_anchortext_txt[2];
        } else if (doc.inboundlinks_anchortext_txt[3]) {
          resultLink.innerHTML = doc.inboundlinks_anchortext_txt[3];
        }
      }
      resultTitle.appendChild(resultLink);
      result.appendChild(resultTitle);
      result.appendChild(resultURL);
      if (highlighting
          && highlighting[doc.id]
          && highlighting[doc.id].text_t) {
        resultSnippet.innerHTML = highlighting[doc.id].text_t[0];
        result.appendChild(resultSnippet);
      }
      results.appendChild(result);
    }
  }

  function showSuggestions(e) {
    if (searchInput.value === "") {
      suggestionslist.innerHTML = "";
      return;
    }
    if (e.keyCode === 38 || e.keyCode === 40) {
      suggestionslist.focus();
      return;
    }
    fetch(suggestbase + encodeURIComponent(searchInput.value))
    .then(response => response.json())
    .then(data => updateDataList(data))
  }
  function updateDataList(data) {
    var suggestions = data[1];
    if (searchInput.value === "") {
      suggestionslist.innerHTML = "";
      return;
    }
    if (suggestions.length > 0) {
      var hits = "";
      for (var i = 0; i < suggestions.length; i += 1) {
        var hit = suggestions[i];
        hits += "<option>" + hit + "</option>";
      }
      suggestionslist.size = suggestions.length;
      if (suggestions.length === 1) {
        // ensure we get the right styling when we have only one option
        suggestionslist.size = 2;
      }
      suggestionslist.innerHTML = hits;
    }
  }
  function changeFocus(e) {
    if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 9) {
      return;
    }
    if (e.keyCode === 13) {
      suggestionslist.innerHTML = "";
    }
    searchInput.focus();
  }
})();
