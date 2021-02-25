const {src, dest, parallel, series, watch} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const svgSprite = require('gulp-svg-sprite');
const fileInclude = require('gulp-file-include');
const sourcemaps = require('gulp-sourcemaps');
const rev = require('gulp-rev');
const group_media = require("gulp-group-css-media-queries");
const revRewrite = require('gulp-rev-rewrite');
const revDel = require('gulp-rev-delete-original');
const htmlmin = require('gulp-htmlmin');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const image = require('gulp-image');
const { readFileSync } = require('fs');
const concat = require('gulp-concat');

let isProd = false; // dev by default

let project_foldaer = require("path").basename(__dirname);

const clean = () => {
	return del([project_foldaer + '/*'])
}

//svg sprite
const svgSprites = () => {
  return src('./src/images/svg/**.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg" //sprite file name
        }
      },
    }))
    .pipe(dest(`./${project_foldaer}/images`));
}

const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(sass().on("error", notify.onError()))
    .pipe(group_media())
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpif(!isProd, sourcemaps.write('.')))
    .pipe(dest(`./${project_foldaer}/css/`))
    .pipe(browserSync.stream());
};

const stylesBackend = () => {
	return src('./src/scss/**/*.scss')
		.pipe(sass().on("error", notify.onError()))
    .pipe(autoprefixer({
      cascade: false,
		}))
		.pipe(dest(`./${project_foldaer}/css/`))
};

const scripts = () => {
	src('./src/js/vendor/**.js')
		.pipe(concat('vendor.js'))
		.pipe(gulpif(isProd, uglify().on("error", notify.onError())))
		.pipe(dest(`./${project_foldaer}/js/`))
  return src(
    ['./src/js/functions/**.js', './src/js/components/**.js', './src/js/main.js'])
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(concat('main.js'))
    .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
    .pipe(gulpif(!isProd, sourcemaps.write('.')))
    .pipe(dest(`./${project_foldaer}/js`))
    .pipe(browserSync.stream());
}

const scriptsBackend = () => {
	src('./src/js/vendor/**.js')
    .pipe(concat('vendor.js'))
    .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
		.pipe(dest(`./${project_foldaer}/js/`))
	return src(['./src/js/functions/**.js', './src/js/components/**.js', './src/js/main.js'])
    .pipe(dest(`./${project_foldaer}/js`))
};

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest(`./${project_foldaer}`))
}

const images = () => {
  return src(['./src/images/**.jpg', './src/images/**.png', './src/images/**.jpeg', './src/images/*.svg'])
    .pipe(gulpif(isProd, image()))
    .pipe(dest(`./${project_foldaer}/images`))
};

const htmlInclude = () => {
  return src(['./src/*.html'])
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest(`./${project_foldaer}`))
    .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: `./${project_foldaer}`
    },
  });

  watch('./src/scss/**/*.scss', styles);
  watch('./src/js/**/*.js', scripts);
  watch('./src/partials/*.html', htmlInclude);
  watch('./src/*.html', htmlInclude);
  watch('./src/resources/**', resources);
  watch('./src/images/*.{jpg,jpeg,png,svg}', images);
  watch('./src/images/svg/**.svg', svgSprites);
}

const cache = () => {
  return src(`${project_foldaer}/**/*.{css,js,svg,png,jpg,jpeg,woff2}`, {
    base: `${project_foldaer}`})
    .pipe(rev())
    .pipe(dest(`${project_foldaer}`))
    .pipe(revDel())
    .pipe(rev.manifest('rev.json'))
    .pipe(dest(`${project_foldaer}`));
};

const rewrite = () => {
  const manifest = readFileSync(`${project_foldaer}/rev.json`);

  return src(`${project_foldaer}/**/*.html`)
    .pipe(revRewrite({
      manifest
    }))
    .pipe(dest(project_foldaer));
}

const htmlMinify = () => {
	return src(`${project_foldaer}/**/*.html`)
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest(project_foldaer));
}

const toProd = (done) => {
  isProd = true;
  done();
};

exports.default = series(clean, htmlInclude, scripts, styles, resources, images, svgSprites, watchFiles);

exports.build = series(toProd, clean, htmlInclude, scripts, styles, resources, images, svgSprites, htmlMinify);

exports.cache = series(cache, rewrite);

exports.backend = series(toProd, clean, htmlInclude, scriptsBackend, stylesBackend, resources, images, svgSprites);
