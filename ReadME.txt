# Pure CSS Static Site Generation Personal Site

Site built with HTML templating using Nunjucks. Including a gulp-sass-workflow, linting and prettier.

## Basic Setup

1.  Clone / Download

2.  Install dependencies

```
$ npm install
```

3.  Run on `http://localhost:3000/`

```
$ gulp
```

## Gulp tasks

```
$ gulp watch (default task)
```

Watches for changes to scss, js and nunjucks (njk) files. Compiles on save.

```
$ gulp styles
```

Compiles sass to css.

```
$ gulp lint
```

Lints scss and js files.

```
$ gulp merge
```

Concats and minifies css (inc vendor) and js files.

```
$ gulp build
```

Runs any compiling tasks and merge.