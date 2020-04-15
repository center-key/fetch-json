// fetch-json ~ MIT License
// Tasks

// Imports
const babel =         require('gulp-babel');
const gap =           require('gulp-append-prepend');
const gulp =          require('gulp');
const header =        require('gulp-header');
const htmlHint =      require('gulp-htmlhint');
const htmlValidator = require('gulp-w3c-html-validator');
const replace =       require('gulp-replace');
const rename =        require('gulp-rename');
const size =          require('gulp-size');

// Setup
const pkg =            require('./package.json');
const home =           pkg.repository.replace('github:', 'github.com/');
const bannerJs =       '//! fetch-json v' + pkg.version + ' ~ ' + home + ' ~ MIT License\n';
const htmlHintConfig = { 'attr-value-double-quotes': false };
const headerComments = /^[/][/].*\n/gm;
const transpileES6 =   ['@babel/env', { modules: false }];
const babelMinifyJs =  { presets: [transpileES6, 'minify'], comments: false };

// Tasks
const task = {
   analyzeHtml: () => {
      return gulp.src('docs/*.html')
         .pipe(htmlHint(htmlHintConfig))
         .pipe(htmlHint.reporter())
         .pipe(htmlValidator())
         .pipe(htmlValidator.reporter())
         .pipe(size({ showFiles: true }));
      },
   buildDistribution: () => {
      return gulp.src('fetch-json.js')
         .pipe(replace(headerComments, ''))
         .pipe(header(bannerJs))
         .pipe(replace('[VERSION]', pkg.version))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('dist'))
         .pipe(babel(babelMinifyJs))
         .pipe(rename({ extname: '.min.js' }))
         .pipe(header(bannerJs))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(size({ showFiles: true, gzip: true }))
         .pipe(gulp.dest('dist'));
      },
   };

// Gulp
gulp.task('lint-html',  task.analyzeHtml);
gulp.task('build-dist', task.buildDistribution);
