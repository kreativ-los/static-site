var gulp = require('gulp'),
  // path = require('path'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  jspm = require('gulp-jspm'),
  rename = require('gulp-rename'),
  handlebars = require('gulp-compile-handlebars'),
  fileExists = require('file-exists'),
  fs = require('fs'),
  browserSync = require('browser-sync').create(),
  cleanCSS =require('gulp-clean-css'),
  yargs = require('yargs').argv;

/**
* Build template files.
*/
gulp.task('build:templates', function(done) {
  var pages = JSON.parse(fs.readFileSync('./source/data/pages.json', 'utf8'));

  var options = {
    batch: ['./source/templates/includes/'],
    helpers: {
      times: function(n, block) {
        var accum = '';
        for (var a = 0; a < n; ++a) {
          accum += block.fn({
            loopIndex: a + 1,
            parent: block.data.root,
          });
        }
        return accum;
      },
      ifCond: function(v1, operator, v2, block) {
        /* eslint no-extra-parens: 0  */
        /* eslint eqeqeq: 0 */
        /* eslint no-negated-condition: 0 */
        switch (operator) {
          case '==':
            return (v1 == v2) ? block.fn(this) : block.inverse(this);
          case '===':
            return (v1 === v2) ? block.fn(this) : block.inverse(this);
          case '!=':
            return (v1 != v2) ? block.fn(this) : block.inverse(this);
          case '!==':
            return (v1 !== v2) ? block.fn(this) : block.inverse(this);
          case '<':
            return (v1 < v2) ? block.fn(this) : block.inverse(this);
          case '<=':
            return (v1 <= v2) ? block.fn(this) : block.inverse(this);
          case '>':
            return (v1 > v2) ? block.fn(this) : block.inverse(this);
          case '>=':
            return (v1 >= v2) ? block.fn(this) : block.inverse(this);
          case '&&':
            return (v1 && v2) ? block.fn(this) : block.inverse(this);
          case '||':
            return (v1 || v2) ? block.fn(this) : block.inverse(this);
          default:
            return block.inverse(this);
        }
      },
    },
  };

  for (var i = 0; i < pages.length; i++) {
    var page = pages[i];
    page.index = i + 1;
    page.indexNext = i + 2;
    page.pageCount = pages.length;

    if (yargs.env === 'production') {
      page.production = true;
    } else {
      page.development = true;
    }

    var template = 'default';
    if (page.template) {
      template = page.template;
    }

    var fileName = 'page-' + i;
    if (i === 0) {
      fileName = 'index';
    }

    if (page.url) {
      // if (!fileExists('./build/' + page.url + '.html')) {
      fileName = page.url;
      // }
    }

    gulp.src('./source/templates/' + template + '.hbs')
    .pipe(handlebars(page, options))
    .pipe(rename(fileName + '.html'))
    .pipe(gulp.dest('./build/'));
  }

  done();
});

/**
* Build scripts.
*/
gulp.task('build:scripts', function() {
  return gulp.src(['./source/assets/js/**/*.js', '!./source/assets/js/modules/**/*'])
  .pipe(jspm({selfExecutingBundle: true}))
  .pipe(rename(path => {
    path.basename = path.basename.replace('.bundle', '');
  }))
  .pipe(gulp.dest('./build/assets/js'));
});

/**
* Build stylesheets.
*/
gulp.task('build:stylesheets', function() {
  return gulp.src('./source/assets/sass/**/*.scss')
  .pipe(sass(
    {includePaths: ['./node_modules'], noCache: true}
  ))
  .pipe(autoprefixer())
  .pipe(cleanCSS())
  .pipe(gulp.dest('./build/assets/css/'))
  .pipe(browserSync.stream());
});

/**
* Copy the images.
*/
gulp.task('copy:images', function() {
  return gulp.src('./source/assets/img/**/*.*')
  .pipe(gulp.dest('./build/assets/img/'));
});

/**
* Copy root files.
*/
gulp.task('copy:root', function() {
  return gulp.src('./source/*.*')
  .pipe(gulp.dest('./build/'));
});

function reload(done) {
  setTimeout(browserSync.reload, 200);
  done();
}

function watch(done) {
  gulp.watch('./source/templates/**/*.hbs').on('change', gulp.series('build:templates'));
  gulp.watch('./source/data/pages.json').on('change', gulp.series('build:templates'));
  gulp.watch('./source/assets/sass/**/*.scss').on('change', gulp.series('build:stylesheets'));
  gulp.watch('./source/assets/js/**/*.js').on('change', gulp.series('build:scripts'));
  gulp.watch('./source/assets/img/**/*.*').on('change', gulp.series('copy:images'));
  gulp.watch('./source/*.*').on('change', gulp.series('copy:root'));
  done();
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: './build/',
    },
  });

  gulp.watch('./source/templates/**/*.hbs').on('change', gulp.series('build:templates', reload));
  gulp.watch('./source/data/pages.json').on('change', gulp.series('build:templates', reload));
  gulp.watch('./source/assets/sass/**/*.scss').on('change', gulp.series('build:stylesheets'));
  gulp.watch('./source/assets/js/**/*.js').on('change', gulp.series('build:scripts', reload));
  gulp.watch('./source/assets/img/**/*.*').on('change', gulp.series('copy:images', reload));
  gulp.watch('./source/*.*').on('change', gulp.series('copy:root', reload));
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
