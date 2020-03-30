const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const del = require('del');
const spawn = require('child_process').spawn;

/**
 * Cleans the build build in the server directory.
 */
gulp.task('build:clean', () => {
  return del('dist');
});

/**
 * Copies the build build to the server directory while renaming the
 * node_modules directory so services like App Engine will upload it.
 */
gulp.task('build:asset', () => {
  const pattern = 'node_modules';
  const replacement = 'asset';

  // move robot.txt to root dist

  return gulp.src('build/**')
    .pipe(rename(((path) => {
      path.basename = path.basename.replace(pattern, replacement);
      path.dirname = path.dirname.replace(pattern, replacement);
    })))
    .pipe(replace(pattern, replacement))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series(
  'build:clean',
  'build:asset'
));

/**
 * Gulp task to run `tsc --watch` and `polymer serve` in parallel.
 */
gulp.task('serve', () => {
  const spawnOptions = {
    // `shell` option for Windows compatability. See:
    // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
    shell: true,
    stdio: 'inherit'
  };
  spawn('tsc', ['--watch'], spawnOptions);
  spawn('polymer', ['serve'], spawnOptions);
});
