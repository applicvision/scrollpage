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
        .pipe(gulp.dest("./dev/"));
});

gulp.task("browserify-dist", function () {
    browserify("./javascript/index.js")
        .bundle()
        .on("error", getErrorHandler("browserify"))
        .pipe(source("bundle.min.js"))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest("./dist/"));
});

//TODO: Maybe consolidate all dist tasks, and embed streams in jade template, instead of writing files.
gulp.task("jade-dist", function () {
    var locals = pageOptions;
    locals.dist = true;
    gulp.src("templates/**/*.jade")
        .pipe(jade({
            locals: locals
        }))
        .on("error", getErrorHandler("jade"))
        .pipe(concat("index.dist.html"))
        .pipe(gulp.dest("./"));
});

gulp.task('minify-css', function() {
  gulp.src('./css/*.css')
    .pipe(minifyCSS())
    .pipe(concat("all.min.css"))
    .pipe(gulp.dest('./dist/'))
});

gulp.task("jade", function () {
    gulp.src("templates/**/*.jade")
        .pipe(jade({
            locals: pageOptions
        }))
        .on("error", getErrorHandler("jade"))
        .pipe(embedlr())
        .pipe(gulp.dest("./"));
});

gulp.task("watch", function () {
    gulp.watch("javascript/**/*.js", ["browserify"]);

    //TODO: Fix so that jade task is run whenever json file changes
    gulp.watch("templates/**/*.jade", ["jade"]);
    gulp.watch(["index.html", "dev/**", "css/**", "images/**"]).on("change", function (file) {
        livereload().changed(file.path);
    });
});

gulp.task("default", ["browserify", "jade", "watch"]);
gulp.task("dist", ["browserify-dist", "minify-css", "jade-dist"])
