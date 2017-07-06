'use strict';

import config from './config.json';

import gulp from 'gulp';

/**
* Copy root files.
*/
gulp.task('copy:root', function() {
  return gulp.src(config.root.source)
  .pipe(gulp.dest(config.root.dest));
});
