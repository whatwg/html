// Derived from https://github.com/speced/bikeshed/blob/3a2640eecd45fd5d8abe5d37b5adaf23cc945b88/bikeshed/stylescript/var-click-highlighting.js with an addition for var-scope.
/*
Color-choosing design:

* Colors are ordered by goodness.
* On clicking a var, give it the earliest color
    with the lowest usage in the algorithm.
* On re-clicking, re-use the var's most recent color
    if that's not currently being used elsewhere.
*/

const COLOR_COUNT = 7;

document.addEventListener("click", e=>{
    if(e.target.nodeName == "VAR") {
        highlightSameAlgoVars(e.target);
    }
});

function highlightSameAlgoVars(v) {
    // Find the algorithm container.
    let algoContainer = findAlgoContainer(v);

    // Not highlighting document-global vars,
    // too likely to be unrelated.
    if(algoContainer == null) return;

    const varName = nameFromVar(v);
    if(!v.hasAttribute("data-var-color")) {
        const newColor = chooseHighlightColor(algoContainer, v);
        for(const el of algoContainer.querySelectorAll("var")) {
            if(nameFromVar(el) == varName) {
                el.setAttribute("data-var-color", newColor);
                el.setAttribute("data-var-last-color", newColor);
            }
        }
    } else {
        for(const el of algoContainer.querySelectorAll("var")) {
            if(nameFromVar(el) == varName) {
                el.removeAttribute("data-var-color");
            }
        }
    }
}
function findAlgoContainer(el) {
    while(el != document.body) {
        if(el.hasAttribute("data-algorithm") || el.hasAttribute("data-var-scope")) return el;
        el = el.parentNode;
    }
    return null;
}
function nameFromVar(el) {
    return el.textContent.replace(/(\s|\xa0)+/g, " ").trim();
}
function colorCountsFromContainer(container) {
    const namesFromColor = Array.from({length:COLOR_COUNT}, x=>new Set());
    for(let v of container.querySelectorAll("var[data-var-color]")) {
        let color = +v.getAttribute("data-var-color");
        namesFromColor[color].add(nameFromVar(v));
    }

    return namesFromColor.map(x=>x.size);
}
function leastUsedColor(colors) {
    // Find the earliest color with the lowest count.
    let minCount = Infinity;
    let minColor = null;
    for(var i = 0; i < colors.length; i++) {
        if(colors[i] < minCount) {
            minColor = i;
            minCount = colors[i];
        }
    }
    return minColor;
}
function chooseHighlightColor(container, v) {
    const colorCounts = colorCountsFromContainer(container);
    if(v.hasAttribute("data-var-last-color")) {
        let color = +v.getAttribute("data-var-last-color");
        if(colorCounts[color] == 0) return color;
    }
    return leastUsedColor(colorCounts);
}
