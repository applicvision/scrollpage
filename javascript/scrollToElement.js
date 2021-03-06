"use strict";

var requestAnimationFrame = require("./requestAnimationFrame");

module.exports = function scrollTo(argument) {
    var elemOrID = argument.element,
        step = argument.step,
        callback = argument.complete,
        start = null,
        startPosition = window.scrollY,
        targetPosition,
        scrollAmount,
        duration;

    //A bit sneaky, but "top" is treated as a special case.
    if (elemOrID === "top") {
        targetPosition = 0;
    } else {
        targetPosition = elemOrID.offsetTop || document.querySelector("#elemOrID").offsetTop;    
    }
    scrollAmount = targetPosition - startPosition;
    if (scrollAmount === 0) {
        if (callback) {
            callback();
        }
        return;
    }

    duration = 20 * Math.sqrt(Math.abs(scrollAmount));

    function scrollStep(timeStamp) {
        var timePassed, progress, scrollPosition;
        if (!start) {
            start = timeStamp;
            timePassed = 0;
        } else {
            timePassed = timeStamp - start;
        }
        //break if the time has passed.
        if (timePassed > duration) {
            if (callback) {
                callback();
            }
            return;
        }
        progress = (1 - Math.cos(timePassed * Math.PI / duration)) / 2;
        scrollPosition = startPosition + scrollAmount * progress;
        window.scroll(0, scrollPosition);
        if (step) {
            step(scrollPosition);
        }
        requestAnimationFrame(scrollStep);
    }

    requestAnimationFrame(scrollStep);
};
