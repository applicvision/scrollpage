//TODO: Split the components up into some modules

var gulp = require("gulp"),
    livereload = require("gulp-livereload"),
    browserify = require("browserify"),
    jade = require("gulp-jade"),
    embedlr = require("gulp-embedlr"),
    source = require("vinyl-source-stream"),
    notify = require("gulp-notify");

var pageOptions = require("./mypage.json");

function getErrorHandler(title) {
    return notify.onError({
        message: "<%= error.message %>",
        title: "ERROR: " + title
    });
}

gulp.task("browserify", function () {
    browserify("./javascript/index.js")
        .bundle({debug: true})
        .on("error", getErrorHandler("browserify"))
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("./out/"));
});

gulp.task("jade", function () {
    gulp.src("templates/**/*.jade")
        .pipe(jade({
            locals: pageOptions
        }))
        .on("error", getErrorHandler("jade"))
        .pipe(embedlr())
        .pipe(gulp.dest("./out/"));
});

gulp.task("watch", function () {
    gulp.watch("javascript/**/*.js", ["browserify"]);
    gulp.watch("templates/**/*.jade", ["jade"]);
    gulp.watch("out/**").on("change", function (file) {
        livereload().changed(file.path);
    });
});

gulp.task("default", ["browserify", "jade", "watch"]);
