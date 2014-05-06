var gulp = require("gulp"),
    livereload = require("gulp-livereload"),
    browserify = require("browserify"),
    jade = require("gulp-jade"),
    embedlr = require("gulp-embedlr"),
    source = require("vinyl-source-stream");

var pageOptions = require("./mypage.json");

gulp.task("browserify", function () {
    browserify('./javascript/index.js')
        .bundle({debug: true})
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("./out/"));
});

gulp.task("jade", function () {
    gulp.src("templates/**/*.jade")
        .pipe(jade({
            locals: pageOptions
        }))
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

gulp.task("default", ["watch"]);
