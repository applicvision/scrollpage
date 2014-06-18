/*globals backgrounds */
"use strict";
var requestAnimationFrame = require("./requestAnimationFrame");
var translateY = require("./translateY3d");
var scrollToElement = require("./scrollToElement");

var lastScrollY = 0;
var lastWindowHeight = window.innerHeight;
var lastSection = -1;
var isUpdating = false;
var isResizing = false;
var header;
var sectionLinks;
var numberOfSections;
var background;
var downArrow;
var shouldParallax;
var parallaxConstant = 0.5;



function scrollHandler() {
    lastScrollY = window.scrollY;
    if (!isUpdating) {
        requestAnimationFrame(update);
        isUpdating = true;
    }
}

function resizeHandler() {
    var windowHeight = window.innerHeight;
    if (!isResizing && (windowHeight !== lastWindowHeight)) {
        lastWindowHeight = windowHeight;
        requestAnimationFrame(setBackgroundSize);
        isResizing = true;
    }
}

function update() {
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
    var downArrowOpacity = Math.pow((Math.max(0, lastWindowHeight - lastScrollY)) / lastWindowHeight, 2);
    if (0 <= downArrowOpacity && downArrowOpacity <= 0.82) {
        downArrow.style.opacity = downArrowOpacity;
        // translateY(downArrow, (1 - downArrowOpacity) * 40);
    }
    isUpdating = false;
}

function getCurrentSection(scrollOffset) {
    return Math.floor(Math.abs(scrollOffset + lastWindowHeight / 4) / lastWindowHeight) - 1;
}

function getLinkListener(link) {
    var targetElement = document.querySelector(link.hash);
    return function (e) {
        //temporarily deactivate the scroll listener
        window.onscroll = null;

        //Do not allow default anchor action
        e.preventDefault();

        scrollToElement({
            element: targetElement,
            step: function (scrollPosition) {
                lastScrollY = scrollPosition;
                update();
            },
            complete: function () {
                //Reactivate scroll listener
                window.onscroll = scrollHandler;
            }
        });
    };
}

function setBackgroundSize() {
    background.style.height = lastWindowHeight * (1 + (1 - parallaxConstant) * numberOfSections) + "px";
    isResizing = false;
}

window.onload = function () {
    var i, link;

    header = document.querySelector(".header");
    sectionLinks = header.querySelectorAll("a");
    numberOfSections = sectionLinks.length;
    background = document.querySelector(".background");
    downArrow = document.querySelector(".downarrow span");
    shouldParallax = background.classList.contains("parallax");
    //If options specify multiple backgrounds, let's pick one randomly.
    if (backgrounds) {
        background.style.backgroundImage = "url(" + backgrounds[Math.floor(Math.random() * backgrounds.length)] + ")";    
    }
    setBackgroundSize();

    for (i = 0; i < numberOfSections; i++) {
        link = sectionLinks[i];
        link.onclick = getLinkListener(link);
    }
    //clicking downarrow is the same as clicking the first section link.
    downArrow.onclick = getLinkListener(sectionLinks[0]);

    window.onscroll = scrollHandler;
    window.onresize = resizeHandler;
};
