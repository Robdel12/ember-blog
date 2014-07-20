var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('default', ['sass', 'scripts', 'lint']);

// Lint Task
gulp.task('lint', function() {
  return gulp.src('dropkick.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('production/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src(['js/libs/*.js', 'js/*.js', 'js/controllers/*.js', 'js/models/*.js'])
    .pipe(rename('app.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('js/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('dropkick.js', ['lint', 'scripts']);
  gulp.watch('css/*.scss', ['sass']);
});

