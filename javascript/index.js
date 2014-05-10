var requestAnimationFrame = require("./requestAnimationFrame");
var translateY = require("./translateY3d");
var scrollTo = require("./scrollTo");

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

getLinkListener = function (link) {
    var targetElement = document.querySelector(link.hash);
    return function (e) {
        //temporarily deactivate the scroll listener
        window.onscroll = null;

        //Do not do ordinary anchor action
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

window.onload = function () {
    var i, link;

    icon = document.querySelector(".iconholder");
    header = document.querySelector(".header");
    sectionLinks = header.querySelectorAll("a");
    background = document.querySelector(".background");
    shouldParallax = background.classList.contains("parallax");

    for (i = 0; i < sectionLinks.length; i++) {
        link = sectionLinks[i];
        link.onclick = getLinkListener(link);
    }

    window.onscroll = scrollHandler;
};

