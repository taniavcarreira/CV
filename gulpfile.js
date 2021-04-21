// gulpfile.js
const gulp  = require('gulp'),
    browserSync = require('browser-sync').create(),
    htmlmin = require('gulp-htmlmin'),
    nunjucksRender = require('gulp-nunjucks-render'); // importing the plugin

const PATHS = {
    output: 'dist',
    templates: 'src/templates',
    pages: 'src/pages',
}

// Load all required plugins (listed in package.json)
const plugins = require("gulp-load-plugins")({
    pattern: "*"
  });


// writing up the gulp nunjucks task
gulp.task('nunjucks', function() {
    console.log('Rendering nunjucks files..');
    return gulp.src(PATHS.pages + '/**/*.+(html|js|css)')
        .pipe(nunjucksRender({
          path: [PATHS.templates],
          watch: true,
        }))
        .pipe(gulp.dest(PATHS.output));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: PATHS.output
        },
    });
});

// Compile Sass
gulp.task("styles", () =>
  gulp
    .src("./src/scss/index.scss")
    .pipe(
      plugins.sass({
        onError: function(err) {
          return notify().write(err);
        }
      })
    )
    .pipe(gulp.dest("./src/css/"))
);

// Compile JS
gulp.task("scripts", () =>
  gulp
    .src("./src/js/**/*.js")
    .pipe(plugins.concat("index.js"))
    .pipe(gulp.dest("./src/js/"))
);

// Linters
gulp.task("lint-styles", () =>
  gulp
    .src(["./src/scss/**/*.scss", "!assets/scss/vendor/**/*.scss"])
    .pipe(plugins.sassLint())
    .pipe(plugins.sassLint.format())
    .pipe(plugins.sassLint.failOnError())
);

gulp.task("lint-scripts", () =>
  gulp
    .src(["./src/js/**/*.js", "!node_modules/**"])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
);

gulp.task('minify', function() {
  return gulp.src(PATHS.output + '/*.html')
    .pipe(htmlmin({
        collapseWhitespace: true,
        cssmin: true,
        jsmin: true,
        removeOptionalTags: true,
        removeComments: false
    }))
    .pipe(gulp.dest(PATHS.output));
});

// Merge and minify files
gulp.task("concat-styles", () =>
  gulp
    .src(["./src/css/index.css"])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat("styles.css"))
    .pipe(plugins.minifyCss())
    .pipe(
      plugins.rename({
        suffix: ".min"
      })
    )
    .pipe(
      plugins.autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest("./dist/"))
);

gulp.task("concat-js", () =>
  gulp
    .src(["./src/js/index.js", "./src/js/vendor/**/*.js"])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat("bundle.js"))
    .pipe(plugins.uglify())
    .pipe(
      plugins.rename({
        suffix: ".min"
      })
    )
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest("./dist/"))
);

gulp.task("compress-images", () =>{
  gulp.src('src/images/*').pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
    })
  ]));
});

gulp.task("move-images", () =>{
  gulp.src(['src/images/**/*']).pipe(gulp.dest('dist/images'));
});
gulp.task("move-fonts", () =>{
  gulp.src(['src/fonts/**/*']).pipe(gulp.dest('dist/fonts'));
});

gulp.task("watch", () => {
  // Watch sass files
  gulp.watch("src/scss/**/*.scss", gulp.series("styles","concat-styles"));
  // Watch js files
  gulp.watch("src/js/**/*.js", gulp.series("scripts"));

  // Watch njk files
  gulp.watch(
    ["src/pages/**/*.+(html|njk)", "src/templates/**/*.+(html|njk)"],
    gulp.series("nunjucks")
  );
})

// Gulp tasks
gulp.task("serve",  gulp.parallel("browser-sync", "watch") );

  gulp.task("default",  gulp.series("watch")); // Default gulp task
  gulp.task("lint", gulp.series("lint-styles", "lint-scripts")); // Lint css + js files
  gulp.task("merge", gulp.series("concat-styles", "concat-js")); // Merge & minify css + js
  gulp.task("build", gulp.series("nunjucks", "styles", "merge", "move-images", "move-fonts")); // Compile sass, concat and minify css + js
