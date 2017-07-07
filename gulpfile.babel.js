'use strict';

import config from './_gulp/config.json';

import gulp from 'gulp';
import browserSyncNode from 'browser-sync';
import requireDir from 'require-dir';
import {argv} from 'yargs';

if (argv.env === 'production') {
  console.log('Environment: production');
} else {
  console.log('Environment: development');
}

// require gulp tasks
requireDir('_gulp');

global.browserSync = browserSyncNode.create();

let browserSync = global.browserSync;

function reload(done) {
  setTimeout(browserSync.reload, 200);
  done();
}

function watch(done) {
  gulp.watch(config.templates.source).on('change', gulp.series('build:templates'));
  gulp.watch(config.data.content).on('change', gulp.series('build:templates'));
  gulp.watch(config.styles.source).on('change', gulp.series('build:stylesheets'));
  gulp.watch(config.scripts.source).on('change', gulp.series('build:scripts'));
  gulp.watch(config.images.source).on('change', gulp.series('copy:images'));
  gulp.watch(config.root.source).on('change', gulp.series('copy:root'));
  done();
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: config.build,
    },
  });

  gulp.watch(config.templates.source).on('change', gulp.series('build:templates', reload));
  gulp.watch(config.data.content).on('change', gulp.series('build:templates', reload));
  gulp.watch(config.styles.source).on('change', gulp.series('build:stylesheets'));
  gulp.watch(config.scripts.source).on('change', gulp.series('build:scripts', reload));
  gulp.watch(config.images.source).on('change', gulp.series('copy:images', reload));
  gulp.watch(config.root.source).on('change', gulp.series('copy:root', reload));
  done();
}

/**
* Build all.
*/
gulp.task('build', gulp.series('build:templates', 'build:stylesheets', 'build:scripts', 'copy:images', 'copy:root'));

/**
* Build all and start watch task.
*/
gulp.task('watch', gulp.series('build', watch));

gulp.task('serve', gulp.series('build', serve));
