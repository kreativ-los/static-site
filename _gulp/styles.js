'use strict';

import config from './config.json';

import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';

/**
* Build stylesheets.
*/
gulp.task('build:stylesheets', function() {
  return gulp.src(config.styles.source)
  .pipe(sass(
    {includePaths: ['./node_modules'], noCache: true}
  ))
  .pipe(autoprefixer())
  .pipe(cleanCSS())
  .pipe(gulp.dest(config.styles.dest))
  .pipe(global.browserSync.stream());
});
