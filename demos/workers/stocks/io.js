function get(url) {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    return xhr.responseText;
  } catch (e) {
    return ''; // turn all errors into empty results
  }
}
