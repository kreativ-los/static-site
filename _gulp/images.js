'use strict';

import config from './config.json';

import gulp from 'gulp';

/**
* Copy the images.
*/
gulp.task('copy:images', function() {
  return gulp.src(config.images.source)
  .pipe(gulp.dest(config.images.dest));
});
