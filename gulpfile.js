// fetch-json ~ MIT License
// Tasks

// Imports
import babel from       'gulp-babel';
import gap from         'gulp-append-prepend';
import gulp from        'gulp';
import rename from      'gulp-rename';
import replace from     'gulp-replace';
import size from        'gulp-size';

// Setup
const transpileES6 =  ['@babel/env', { modules: false }];
const babelMinifyJs = { presets: [transpileES6, 'minify'], comments: false };
const browserEnv =    'if (typeof window === "object") { window.fetchJson = fetchJson; window.FetchJson = FetchJson; }';

// Tasks
const task = {
   minifyJs: () => {
      return gulp.src('build/fetch-json.js')
         .pipe(replace(/^import .* from .*;\n/m, ''))
         .pipe(replace(/^export { .* };/m, browserEnv))
         .pipe(rename({ extname: '.dev.js' }))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build'))
         .pipe(babel(babelMinifyJs))
         .pipe(rename('fetch-json.min.js'))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(size({ showFiles: true, gzip: true }))
         .pipe(gulp.dest('build'));
      },
   };

// Gulp
gulp.task('minify-js', task.minifyJs);
