'use strict';

import config from './config.json';

import gulp from 'gulp';
import jspm from 'gulp-jspm';
import rename from 'gulp-rename';

/**
* Build scripts.
*/
gulp.task('build:scripts', function() {
  return gulp.src(config.scripts.source)
  .pipe(jspm({selfExecutingBundle: true}))
  .pipe(rename(path => {
    path.basename = path.basename.replace('.bundle', '');
  }))
  .pipe(gulp.dest(config.scripts.dest));
});
