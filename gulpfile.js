"use strict";
//TODO: Split the components up into some modules

var gulp = require("gulp"),
    livereload = require("gulp-livereload"),
    browserify = require("browserify"),
    jade = require("gulp-jade"),
    embedlr = require("gulp-embedlr"),
    source = require("vinyl-source-stream"),
    streamify = require("gulp-streamify"),
    uglify = require("gulp-uglify"),
    minifyCSS = require("gulp-minify-css"),
    concat = require("gulp-concat"),
    errorhandler = require("./gulp/errorhandler");

var pageOptions = require("./mypage.json");

gulp.task("browserify", function () {
    browserify("./javascript/index.js")
        .bundle({debug: true})
        .on("error", errorhandler("browserify"))
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("./dev/"));
});

gulp.task("browserify-dist", function () {
    return browserify("./javascript/index.js")
        .bundle()
        .on("error", errorhandler("browserify"))
        .pipe(source("bundle.min.js"))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest("./dist/"));
});

//TODO: Maybe consolidate all dist tasks, and embed streams in jade template, instead of writing files.
gulp.task("dist", ["browserify-dist", "minify-css"], function () {
    var locals = pageOptions;
    locals.dist = true;
    gulp.src("templates/**/*.jade")
        .pipe(jade({
            locals: locals
        }))
        .on("error", errorhandler("jade"))
        .pipe(concat("index.dist.html"))
        .pipe(gulp.dest("./"));
});

gulp.task("minify-css", function () {
    return gulp.src("./css/*.css")
        .pipe(minifyCSS())
        .pipe(concat("all.min.css"))
        .pipe(gulp.dest("./dist/"));
});

gulp.task("jade", function () {
    gulp.src("templates/**/*.jade")
        .pipe(jade({
            locals: pageOptions
        }))
        .on("error", errorhandler("jade"))
        .pipe(embedlr())
        .pipe(gulp.dest("./"));
});

gulp.task("reloadoptions", function () {
    delete require.cache[require.resolve("./mypage.json")];
    pageOptions = require("./mypage.json");
});

gulp.task("watch", function () {
    gulp.watch("javascript/**/*.js", ["browserify"]);

    //TODO: Fix so that jade task is run whenever json file changes
    gulp.watch("mypage.json", ["reloadoptions", "jade"]);
    gulp.watch("templates/**/*.jade", ["jade"]);
    gulp.watch(["index.html", "dev/bundle.js", "css/**", "images/**"]).on("change", function (file) {
        livereload().changed(file.path);
    });
});

gulp.task("default", ["browserify", "jade", "watch"]);
