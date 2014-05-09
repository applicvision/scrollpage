var requestAnimationFrame = require("./requestAnimationFrame");
var translateY = require("./translateY3d");

var lastScrollY = 0;
var windowHeight = window.innerHeight;
var lastSection = -1;
var isUpdating = false;
var isResizing = false;
var header;
var sections;
var sectionLinks;
var lastSectionLink;
var icon;
var background;
var shouldParallax;



function scrollHandler () {
    lastScrollY = window.scrollY;
    if (!isUpdating) {
        requestAnimationFrame(update);
        isUpdating = true;
    }
}

function update () {
    var currentSection = getCurrentSection(lastScrollY);

    if (currentSection !== lastSection) {
        var last = sectionLinks[lastSection];
        if (last) {
            console.log("removing last");
            last.classList.remove("current");
        }
        if (currentSection !== -1) {
            // header.classList.add("show");
            var current = sectionLinks[currentSection];
            if (current) {
                current.classList.add("current");
                history.replaceState(null, null, current.href);
            } else {
                console.log("strange, current", currentSection);
            }
        } else {
            history.replaceState(null, null, "#");
            lastSectionLink = null;
        }
        lastSection = currentSection;
    }
    if (shouldParallax) {
        translateY(background, 0.3 * lastScrollY);
    }
    
    isUpdating = false;
}

function getCurrentSection(scrollOffset) {
    var sectionHeight = window.innerHeight;
    return Math.floor(Math.abs(scrollOffset + sectionHeight / 4) / sectionHeight) - 1;
}

window.onload = function () {
    icon = document.querySelector(".iconholder");
    header = document.querySelector(".header");
    sectionLinks = header.querySelectorAll("a");
    background = document.querySelector(".background");
    shouldParallax = background.classList.contains("parallax");

    window.onscroll = scrollHandler;
};

