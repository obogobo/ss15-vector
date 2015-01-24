var browserify = require('gulp-browserify2'),
    gulp = require('gulp')
    ;

gulp.task('default', function(){
  gulp.src('js/app.js')
  .pipe(browserify({
    fileName: 'index.js',
    transform: require('jadeify'),
    options: {
      debug: false
    }
  })).pipe(gulp.dest('js/'));
});
