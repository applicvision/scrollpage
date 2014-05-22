"use strict";
var notify = require("gulp-notify");

module.exports = function errorhandler(title) {
    return notify.onError({
        message: "<%= error.message %>",
        title: "ERROR: " + title
    });
};
