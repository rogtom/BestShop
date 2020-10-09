const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const colors = require('ansi-colors');
const browserSync = require('browser-sync').create();
const notifier = require("node-notifier");

sass.compiler = require('sass'); //node-sass

const showError = function(err) {
    notifier.notify({
        title: 'Error in sass',
        message: err.messageFormatted
    });

    console.log(colors.red('==============================='));
    console.log(colors.red(err.messageFormatted));
    console.log(colors.red('==============================='));
    this.emit('end');
}


const server = (cb) => {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        notify: false, //czy pokazywać tooltipa
        //host: "192.168.0.24", //IPv4 Address Wirless LAN adapter WiFi from ipconfig
        //port: 3000, //port na którym otworzy
        //browser: "google chrome" //jaka przeglądarka ma być otwierana - zaleznie od systemu - https://stackoverflow.com/questions/24686585/gulp-browser-sync-open-chrome-only
    });
    cb();
}


const css = () => {
    return gulp.src('./scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded' //nested, expanded, compact, compressed
        }).on('error', showError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
}


const watch = (cb) => {
    gulp.watch('./scss/**/*.scss', gulp.series(css));
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('./js/*.js').on('change', browserSync.reload); //nie bundlujemy js, odswiezamy tylko przy zmianach
    cb();
}


exports.watch = watch;
exports.css = css;
exports.default = gulp.parallel(server, css, watch);
