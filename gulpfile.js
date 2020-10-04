var gulp = require('gulp')

// css
var cleanCss = require('gulp-clean-css')
var postcss = require("gulp-postcss")
var sourcemaps = require('gulp-sourcemaps')
var concat = require("gulp-concat")

// define browserSync and create a server
var browserSync = require('browser-sync').create()

//images
var imagemin = require('gulp-imagemin')

// github
var ghpages = require('gh-pages');


gulp.task("css", function(cb){
  // we want to run "sass css/app.scss app.css --watch"
  return gulp.src([
    "src/css/reset.css",
    "src/css/typography.css",
    "src/css/app.css"
  ])
    .pipe(sourcemaps.init())  
    .pipe(
      postcss([
        require('autoprefixer'),
        require('postcss-preset-env')({
          stage: 1, // allows us to apply beta conversions
          browsers: ['IE 11', 'last 2 versions'] // allows support for IE11 and the last 2 versions of any browser
        })
      ])
    )
    // concatenate our css files together
    .pipe(concat("app.css"))

    // create minified CSS file with i8 compatibile syntax
    .pipe(
			cleanCss({
				compatibility: 'ie8'
				})
      )
    .pipe(sourcemaps.write()) // identifies which line of code relates to what after being minified
    .pipe(gulp.dest("dist"))
    // tell browserSync to stream these updates
    .pipe(browserSync.stream())

    cb()
})

// copy our index.html file into the final destination, dist folder
gulp.task("html", function(cb){
  return gulp.src("src/*.html")
    .pipe(gulp.dest("dist"))
    cb()
})

// copy all font files into the dist folder
gulp.task("fonts",function(cb){
  return gulp.src("src/fonts/*")
    .pipe(gulp.dest("dist/fonts"))
    cb()
})

// read all image files in our /img folder, 
// optimise them using imagemin and then copy into the dist folder
gulp.task("images", function(cb){
  return gulp.src("src/img/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"))
    cb()
})

gulp.task("watch", function(cb){

    // initialise the browserSync server
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  })

  // if any changes to our html files, the scss file, the fonts folder and the image folder, rerun and reload.
  gulp.watch("src/*.html", gulp.series("html")).on('change', browserSync.reload)
  gulp.watch("src/css/*.css", gulp.series("css"))
  gulp.watch("src/fonts/*", gulp.series("fonts"))
  gulp.watch("src/img/*", gulp.series("images"))
  cb()
})

gulp.task("deploy", function(cb){
  ghpages.publish('dist');
  cb()
})

gulp.task('default', gulp.series("html", "css", "fonts", "images", "watch"))