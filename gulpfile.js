// fetch-json ~ MIT License
// Tasks

// Imports
const babel =         require('gulp-babel');
const gap =           require('gulp-append-prepend');
const gulp =          require('gulp');
const header =        require('gulp-header');
const htmlHint =      require('gulp-htmlhint');
const htmlValidator = require('gulp-w3c-html-validator');
const mergeStream =   require('merge-stream');
const rename =        require('gulp-rename');
const replace =       require('gulp-replace');
const size =          require('gulp-size');

// Setup
const pkg =            require('./package.json');
const home =           pkg.repository.replace('github:', 'github.com/');
const bannerJs =       '//! fetch-json v' + pkg.version + ' ~ ' + home + ' ~ MIT License\n\n';
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

   makeDistribution: () => {
      const buildDts = () =>
         gulp.src('build/fetch-json.d.ts')
            .pipe(header(bannerJs))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'));
      const buildEsm = () =>
         gulp.src('build/fetch-json.js')
            .pipe(replace(headerComments.js, ''))
            .pipe(header(bannerJs))
            .pipe(replace('[VERSION]', pkg.version))
            .pipe(size({ showFiles: true }))
            .pipe(rename({ extname: '.esm.js' }))
            .pipe(gulp.dest('dist'));
      const buildUmd = () =>
         gulp.src('build/umd/fetch-json.js')
            .pipe(header(bannerJs))
            .pipe(replace('[VERSION]', pkg.version))
            .pipe(rename({ extname: '.umd.js' }))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'));
      const buildJs = () =>
         gulp.src('build/fetch-json.js')
            .pipe(replace(headerComments.js, ''))
            .pipe(header(bannerJs))
            .pipe(replace('[VERSION]', pkg.version))
            .pipe(replace(/^export { (.*) };/m, 'if (typeof window === "object") window.$1 = $1;'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'))
            .pipe(babel(babelMinifyJs))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(header(bannerJs.replace('\n\n', '\n')))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(size({ showFiles: true, gzip: true }))
            .pipe(gulp.dest('dist'));
      return mergeStream(buildDts(), buildEsm(), buildUmd(), buildJs());
      },

   };

// Gulp
gulp.task('lint-html', task.analyzeHtml);
gulp.task('make-dist', task.makeDistribution);
