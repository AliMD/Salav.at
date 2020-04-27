const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

/**
 * Copies the build build to the server directory while renaming the
 * node_modules directory so services like App Engine will upload it.
 */
gulp.task('build:asset', () => {
  const pattern = 'node_modules';
  const replacement = 'asset';

  return gulp.src('build/**')
    .pipe(rename(((path) => {
      path.basename = path.basename.replace(pattern, replacement);
      path.dirname = path.dirname.replace(pattern, replacement);
    })))
    .pipe(replace(pattern, replacement))
    .pipe(gulp.dest('server/build'));
});

gulp.task('build', gulp.series(
  'build:asset'
));
