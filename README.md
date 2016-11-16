Static Site
===========

A generator for easily creating static sites. Handlebars is used as templating engine.

Installation
------------

1. Update node. Used version v7.1.0.
2. Install gulp 4. `$ npm install -g gulp-cli`.
3. `$ npm install`

Tasks
-----

1. `$ gulp build` Builds the project.
2. `$ gulp watch` Builds the project and watches for changes.

Files
-----

### `default.hbs`
This is the default template, used when no specific template is defined.

### `includes/`
Here you can put your partials. Typically there are: `_header.hbs` and `_footer.hbs` for shared headers and footers across all templates.

### `data/`
Here are your data json files, f. ex. the `pages.json` where all pages are defined.

### `data/pages.json`
The file that defines your pages.

Every item of this array defines one page. The html title is set by `"title"`.

The pages filename is automatically generated.
The first item in the array represents the index page. The other pages are named by the following pattern: `page-PAGEINDEX.php`.
If you want to use a custom filename, simply define it by setting `"url"`.

By default the `default.hbs`template is used as template. If you want to use a specific one, just set it with `"template"`.

```json
[
    {
        "title": "Lorem Ipsum"
    },
    {
        "title": "Dolor Sit Amet",
        "template": "other"
    },
    {
        "title": "Page with individual name.",
        "url": "some-name"
    }
]
```