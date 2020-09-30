var gulp = require('gulp')
var sass = require('gulp-sass')
var cleanCss = require('gulp-clean-css')
var sourcemaps = require('gulp-sourcemaps')

// define browserSync and create a server
var browserSync = require('browser-sync').create()

var imagemin = require('gulp-imagemin')

sass.compiler = require('node-sass')

gulp.task("sass", function(cb){
  // we want to run "sass css/app.scss app.css --watch"
  return gulp.src("src/css/app.scss")
    .pipe(sourcemaps.init())  
    .pipe(sass())
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
  gulp.watch("src/css/app.scss", gulp.series("sass"))
  gulp.watch("src/fonts/*", gulp.series("fonts"))
  gulp.watch("src/img/*", gulp.series("images"))
  cb()
})

gulp.task('default', gulp.series("html", "sass", "fonts", "images", "watch"))