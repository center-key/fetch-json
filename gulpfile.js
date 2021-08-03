// fetch-json ~ MIT License
// Tasks

// Imports
import babel from       'gulp-babel';
import gap from         'gulp-append-prepend';
import gulp from        'gulp';
import header from      'gulp-header';
import mergeStream from 'merge-stream';
import rename from      'gulp-rename';
import replace from     'gulp-replace';
import size from        'gulp-size';
import { readFileSync } from 'fs';

// Setup
const pkg =            JSON.parse(readFileSync('./package.json'));
const home =           pkg.repository.replace('github:', 'github.com/');
const bannerJs =       '//! fetch-json v' + pkg.version + ' ~ ' + home + ' ~ MIT License\n\n';
const headerComments = { js: /^[/][/].*\n/gm };
const transpileES6 =   ['@babel/env', { modules: false }];
const babelMinifyJs =  { presets: [transpileES6, 'minify'], comments: false };
const browserEnv =     'if (typeof window === "object") { window.fetchJson = fetchJson; window.FetchJson = FetchJson; }';

// Tasks
const task = {

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
            .pipe(rename({ extname: '.umd.cjs' }))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'));
      const buildJs = () =>
         gulp.src('build/fetch-json.js')
            .pipe(replace(headerComments.js, ''))
            .pipe(header(bannerJs))
            .pipe(replace('[VERSION]', pkg.version))
            .pipe(replace(/^import .* from .*;\n/m, ''))
            .pipe(replace(/^export { .* };/m, browserEnv))
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
gulp.task('make-dist', task.makeDistribution);
