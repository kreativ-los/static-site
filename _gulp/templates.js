'use strict';

import config from './config.json';

import gulp from 'gulp';
import yargs from 'yargs';
import rename from 'gulp-rename';
import handlebars from 'gulp-compile-handlebars';
import fs from 'fs';

let argv = yargs.argv;

/**
* Build template files.
*/
gulp.task('build:templates', function(done) {
  var pages = JSON.parse(fs.readFileSync(config.data.content, 'utf8'));

  var options = {
    batch: [config.templates.includes],
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

    if (argv.env === 'production') {
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

    gulp.src(config.templates.source + template + '.hbs')
    .pipe(handlebars(page, options))
    .pipe(rename(fileName + '.html'))
    .pipe(gulp.dest(config.templates.dest));
  }

  done();
});
