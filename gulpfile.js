var gulp = require('gulp'),
    // path = require('path'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    jspm = require('gulp-jspm'),
    rename = require('gulp-rename'),
    handlebars = require('gulp-compile-handlebars'),
    fileExists = require('file-exists');

/**
 * Build template files.
 */
gulp.task('build:templates', function(done) {
    var pages = require('./source/data/pages.json');

    var options = {
        batch: ['./source/includes/'],
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

        var template = 'default';
        if (page.template) {
            template = page.template;
        }

        var fileName = 'page-' + i;
        if (i === 0) {
            fileName = 'index';
        }

        if (page.url) {
            if (!fileExists('./build/' + page.url + '.php')) {
                fileName = page.url;
            }
        }

        gulp.src('./source/' + template + '.hbs')
            .pipe(handlebars(page, options))
            .pipe(rename(fileName + '.php'))
            .pipe(gulp.dest('./build/'));
    }
    done();
});

/**
 * Build scripts.
 */
gulp.task('build:scripts', function() {
    return gulp.src('./source/assets/js/*.js')
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
        .pipe(gulp.dest('./build/assets/css/'));
});

/**
 * Copy the images.
 */
gulp.task('build:images', function() {
    return gulp.src('./source/assets/img/**/*.*')
        .pipe(gulp.dest('./build/assets/img/'));
});

function watch(done) {
    gulp.watch('./source/**/*.hbs').on('change', gulp.series('build:templates'));
    gulp.watch('./source/data/pages.json').on('change', gulp.series('build:templates'));
    gulp.watch('./source/assets/sass/**/*.scss').on('change', gulp.series('build:stylesheets'));
    gulp.watch('./source/assets/js/**/*.js').on('change', gulp.series('build:scripts'));
    gulp.watch('./source/assets/img/**/*.*').on('change', gulp.series('build:images'));
    done();
}

/**
* Build all.
*/
gulp.task('build', gulp.series('build:templates', 'build:stylesheets', 'build:scripts', 'build:images', function(done) {
    done();
}));

/**
 * Build all and start watch task.
 */
gulp.task('watch', gulp.series('build', watch));
