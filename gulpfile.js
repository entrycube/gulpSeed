var fp = require('path'), // We use path to give filenames without the whole the whole... path.
    chalk = require('chalk'); //Chalk for colors in console

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    livereload = require('gulp-livereload'),
      connect = require('connect'),
      server = connect(),
      serveStatic = require('serve-static'),
    prefix = require('gulp-autoprefixer');

var paths = {
  css : './dist/css/',
	html : {
    dist : './dist/**/*.html',
    src : './src/**/*.html'
  },
  sass : './src/sass/**/*.scss'
};

function endTaskMsg(){
  endTime = new Date();
  console.log('\n Task '+ chalk.bgGreen('completed') + ' at ' + endTime.toTimeString() + '\n');
}
function fileChangedMsg(fl){

  console.log('\n File ' + chalk.yellow( prettyPath(fl.path) ) + ' changed \n');

}
function prettyPath(path){
  return fp.relative(__dirname, path);
}
function handleError(err) {
  console.log('\u0007');
  console.log(err.toString() + '\n ' + chalk.bgMagenta('gulp is waiting...'));
  this.emit('end');
}

gulp.task('sass', function () {
    gulp.src(paths.sass)
    .pipe(sass({sourcemap: true}))
    .on('error', handleError)
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest(paths.css));

    endTaskMsg();
});

gulp.task('server', function(next) {

  server.use(connect.static('./dist/')).listen(process.env.PORT || 80, next);
});

gulp.task('watch', ['server'], function() {
  livereload.listen();

  gulp.watch(paths.css + '/*.css').on('change', livereload.changed);

  gulp.watch(paths.html.dist).on('change', livereload.changed);

  gulp.watch(paths.sass, ['sass']).on('change', function(file){
    fileChangedMsg(file);
  });
});

gulp.task('default', ['server', 'watch']);


console.log(paths.html.dist);
