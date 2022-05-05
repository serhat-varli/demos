const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

// Load plugins

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();
const cssimport = require("gulp-cssimport");

// Clean assets

function clear() {
    const sources = ["../../wwwroot/src/js/*", "../../wwwroot/src/css/*"]
    return src(sources, {
        read: false,
    })
        .pipe(clean({ force: true }));
}

// JS function 

function BaseScriptsjs() {
    // const source = 'src/assets/js/vendors/**.min.js';
    const sources = [
        'src/assets/js/vendors/jquery-3.2.1.min.js',
        'src/assets/js/vendors/bootstrap.min.js',
    ];
    const source = 'src/dist/js/**.min.js';

    return src(sources)
        .pipe(changed(source))
        .pipe(concat("basescripts"))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('src/dist/js/'))
        .pipe(browsersync.stream());
}

function CustomScripts() {
    const source = 'src/assets/js/*.js';

    return src(source)
        .pipe(changed(source))
        .pipe(concat("scripts"))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('src/dist/js/'))
        .pipe(browsersync.stream());
}

// CSS function 
function StyleCompiler() {
    const source = 'src/assets/css/styles.scss'; 
    return src(source)
        .pipe(changed(source))
        .pipe(sass())
        .pipe(cssimport({
            extensions: ["css"]
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({
            basename: "styles",
            extname: '.min.css'
        }))
        .pipe(
            cssnano({
                zindex: false
            })
        )
        .pipe(dest('src/dist/css/'))
        .pipe(browsersync.stream());
}

// Optimize images
function imgOptimizer() {
    const sources = ['./assets/img/*','./assets/img/**/*', './assets/img/**/**/*']
    return src(sources)
        .pipe(imagemin())
        .pipe(dest('src/dist/img/'));
}

// Watch files
function watchFiles() {
    watch(["src/assets/css/*.scss"], series(StyleCompiler));
    // watch(['./src/assets/img/*','src/assets/img/**/*', 'src/assets/img/**/**/*'], img);
    // watch(['src/assets/js/*.js', 'src/assets/js/*.min.js', 'src/assets/js/**/*.js', 'src/assets/js/**/*.min.js'], js);
}

// BrowserSync

function browserSync() {
    browsersync.init({
        server: {
            baseDir: './src/'
        },
        stream: true,
        port: 5501,
        open: true,
        notify: false
    });
}

// Tasks to define the execution of the functions simultaneously or in series

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(BaseScriptsjs, CustomScripts, StyleCompiler, imgOptimizer));