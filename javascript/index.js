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
var sectionLinks;
var numberOfSections;
var background;
var downArrow;
var shouldParallax;
var isMobile;
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

        //Do not allow default anchor action
        e.preventDefault();

        scrollPageToSection(targetElement);
    };
}

function scrollPageToSection(section) {

    //temporarily deactivate the scroll listener
    window.onscroll = null;

    //Do not pass step and complete handlers if we are in mobile environment.
    scrollToElement({
        element: section,
        step: !isMobile && function (scrollPosition) {
            lastScrollY = scrollPosition;
            update();
        },
        complete: !isMobile && function () {
            //Reactivate scroll listener
            window.onscroll = scrollHandler;
        }
    });
}

function setBackgroundSize() {
    background.style.height = lastWindowHeight * (1 + (1 - parallaxConstant) * numberOfSections) + "px";
    isResizing = false;
}

window.onload = function () {
    var i, link, headerMenu, headerIcon;

    headerMenu = document.querySelector(".header .menu");
    sectionLinks = headerMenu.querySelectorAll("a");
    headerIcon = headerMenu.querySelector("img.icon");
    numberOfSections = sectionLinks.length;
    background = document.querySelector(".background");
    downArrow = document.querySelector(".downarrow img");
    shouldParallax = background.classList.contains("parallax");

    //If options specify multiple backgrounds, let's pick one randomly.
    if (backgrounds) {
        background.style.backgroundImage = "url(" + backgrounds[Math.floor(Math.random() * backgrounds.length)] + ")";
    }

    for (i = 0; i < numberOfSections; i++) {
        link = sectionLinks[i];
        link.onclick = getLinkListener(link);
    }
    headerIcon.onclick = scrollPageToSection.bind(this, "top");
    //clicking downarrow is the same as clicking the first section link.
    downArrow.onclick = getLinkListener(sectionLinks[0]);

    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    //Let's not handle the scroll on mobile
    if(isMobile) {
        background.style.position = "fixed";
    } else {
        window.onscroll = scrollHandler;
    }

    setBackgroundSize();

    window.onresize = resizeHandler;
};
