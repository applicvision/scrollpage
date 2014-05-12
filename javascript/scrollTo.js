var requestAnimationFrame = require("./requestAnimationFrame");

module.exports = function scrollTo(elemOrID, callback) {
    var start, startPosition, scrollAmount, duration, targetPosition;

    targetPosition = elemOrID.offsetTop || document.querySelector("#elemOrID").offsetTop;
    startPosition = window.scrollY;
    scrollAmount = targetPosition - startPosition;
    duration = 8 * Math.sqrt(Math.abs(scrollAmount));

    function scrollStep(timeStamp) {
        var timePassed, progress, scrollValue;
        if (!start) {
            start = timeStamp;
            timePassed = 0;
        } else {
            timePassed = timeStamp - start;
        }
        progress = timePassed / duration;
        scrollValue = scrollAmount * progress
        window.scroll(0, startPosition + scrollValue);
        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        } else {
            callback();
        }
    }

    requestAnimationFrame(scrollStep);
};
