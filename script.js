
var lastScrollY = 0;
var lastSection = -1;
var isUpdating = false;
var header;
var sectionLinks;
var lastSectionLink;
var icon;
var background;

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
        icon.classList.remove("small");
        header.classList.remove("show");
        if (currentSection !== -1) {
            icon.classList.add("small");
            header.classList.add("show");
            if (lastSectionLink) {
                lastSectionLink.classList.remove("current");
            }
            lastSectionLink = sectionLinks[currentSection];
            lastSectionLink.classList.add("current");
            history.replaceState(null, null, lastSectionLink.href);
        } else {
            history.replaceState(null, null, "#");
            lastSectionLink = null;
        }
        lastSection = currentSection;
    }
    background.style.webkitTransform = "translateY(" + 0.9 * lastScrollY + "px)";
    isUpdating = false;
}

function getCurrentSection(scrollOffset) {
    return Math.floor(Math.abs(scrollOffset) / window.innerHeight) - 1;
}

window.onload = function () {
    icon = document.querySelector(".icon");
    header = document.querySelector(".header");
    sectionLinks = header.querySelectorAll("a");
    background = document.querySelector("img.background");

    window.onscroll = scrollHandler;
}