var requestAnimationFrame = require("./requestAnimationFrame");
var translateY = require("./translateY3d");
var scrollTo = require("./scrollTo");

var lastScrollY = 0;
var lastWindowHeight = window.innerHeight;
var lastSection = -1;
var isUpdating = false;
var isResizing = false;
var header;
var sectionLinks;
var numberOfSections;
var lastSectionLink;
var icon;
var background;
var shouldParallax;
var parallaxConstant = 0.5;



function scrollHandler () {
    lastScrollY = window.scrollY;
    if (!isUpdating) {
        requestAnimationFrame(update);
        isUpdating = true;
    }
}

function resizeHandler () {
    var windowHeight = window.innerHeight;
    if (!isResizing && (windowHeight !== lastWindowHeight)) {
        lastWindowHeight = windowHeight;
        requestAnimationFrame(setBackgroundSize);
        isResizing = true;
    }
}

function update () {
    var currentSection = getCurrentSection(lastScrollY);

    if (currentSection !== lastSection) {
        var last = sectionLinks[lastSection];
        if (last) {
            last.classList.remove("current");
        }
        var current = sectionLinks[currentSection];
        if (current) {
            current.classList.add("current");
            history.replaceState(null, null, current.href);
        } else {
            history.replaceState(null, null, "#");
        }
        lastSection = currentSection;
    }
    if (shouldParallax) {
        translateY(background, parallaxConstant * lastScrollY);
    }
    
    isUpdating = false;
}

function getCurrentSection(scrollOffset) {
    return Math.floor(Math.abs(scrollOffset + lastWindowHeight / 4) / lastWindowHeight) - 1;
}

getLinkListener = function (link) {
    var targetElement = document.querySelector(link.hash);
    return function (e) {
        //temporarily deactivate the scroll listener
        window.onscroll = null;

        //Do not allow default anchor action
        e.preventDefault();

        scrollTo(targetElement, function () {
            //update the scroll position and update state
            lastScrollY = window.scrollY;
            update();

            //Reactivate scroll listener
            window.onscroll = scrollHandler;
        });
    };
}

function setBackgroundSize() {
    background.style.height = lastWindowHeight * (1 + (1 - parallaxConstant) * numberOfSections) + "px";
    isResizing = false;
}

window.onload = function () {
    var i, link;

    icon = document.querySelector(".iconholder");
    header = document.querySelector(".header");
    sectionLinks = header.querySelectorAll("a");
    numberOfSections = sectionLinks.length;
    background = document.querySelector(".background");
    shouldParallax = background.classList.contains("parallax");
    setBackgroundSize();

    for (i = 0; i < numberOfSections; i++) {
        link = sectionLinks[i];
        link.onclick = getLinkListener(link);
    }

    window.onscroll = scrollHandler;
    window.onresize = resizeHandler;
};

