// fetch-json
// Tasks

// Imports
const babel =       require('gulp-babel');
const gulp =        require('gulp');
const header =      require('gulp-header');
const mergeStream = require('merge-stream');
const replace =     require('gulp-replace');
const rename =      require('gulp-rename');
const size =        require('gulp-size');

// Setup
const pkg = require('./package.json');
const banner = [
   `//! fetch-json v${pkg.version}\n`,
   `//! ${pkg.description}\n`,
   `//! ${pkg.homepage} -- ${pkg.license} License\n`
   ];
const transpileES6 = ['@babel/env', { modules: false }];
const minify =       { presets: [transpileES6, 'minify'], comments: false };

// Tasks
const task = {
   build: () => {
      const semVerPattern = /\d+[.]\d+[.]\d+/g;
      const updateBanner = () => {
         return gulp.src('fetch-json.js')
            .pipe(replace(/\/\/!.*\n/g, ''))
            .pipe(replace(semVerPattern, pkg.version))
            .pipe(header(banner.join('')))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('.'));
         };
      const minifyJs = () => {
         return gulp.src('fetch-json.js')
            .pipe(rename({ extname: '.min.js' }))
            .pipe(babel(minify))
            .pipe(header(banner[0] + banner[2]))
            .pipe(replace(semVerPattern, pkg.version))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('.'));
         };
      return mergeStream(updateBanner(), minifyJs());
      }
   };

// Gulp
gulp.task('build', task.build);
