
var lastScrollY = 0;
var lastSection = -1;
var isUpdating = false;
var header;
var sectionLinks;
var lastSectionLink;
var icon;
var sectionHeight;
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
        icon.classList.remove("small");
        header.classList.remove("show");
        if (currentSection !== -1) {
            icon.classList.add("small");
            header.classList.add("show");
            var last = sectionLinks[lastSection];
            if (last) {
                last.classList.remove("current");
            }
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
        background.style.webkitTransform = "translate3d(0," + 0.3 * lastScrollY + "px, 0)";
    }
    
    isUpdating = false;
}

function getCurrentSection(scrollOffset) {
    return Math.floor(Math.abs(scrollOffset + sectionHeight / 3) / sectionHeight) - 1;
}

window.onload = function () {
    icon = document.querySelector(".iconholder");
    header = document.querySelector(".header");
    sectionLinks = header.querySelectorAll("a");
    background = document.querySelector("img.background");
    shouldParallax = background.classList.contains("parallax");
    sectionHeight = document.querySelector("section").clientHeight;

    window.onscroll = scrollHandler;
}