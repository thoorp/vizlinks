var gulp = require('gulp');
var del = require('del');

//cleanup dist folder
gulp.task('clean-dist', function () {
    return del('dist/**', { force: true });
});

//move html/js/css/img files
gulp.task('client', function () {
    return gulp.src('src/client/**/*')
        .pipe(gulp.dest('dist'))
});

//move frontend css
gulp.task('jquery-typeahead-css', function () {
    return gulp.src('node_modules/jquery-typeahead/dist/jquery.typeahead.min.css')
        .pipe(gulp.dest('dist/css'))
});

gulp.task('bootstrap-css', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('dist/css'))
});


//move frontend js
gulp.task('vue', function () {
    return gulp.src('node_modules/vue/dist/vue.js')
        .pipe(gulp.dest('dist/js'))
});

gulp.task('jquery', function () {
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('dist/js'))
});

gulp.task('jquery-typeahead-js', function () {
    return gulp.src('node_modules/jquery-typeahead/dist/jquery.typeahead.min.js')
        .pipe(gulp.dest('dist/js'))
});

gulp.task('bootstrap-slider', function () {
    return gulp.src('node_modules/bootstrap-slider/dist/bootstrap-slider.min.js')
        .pipe(gulp.dest('dist/js'))
});

gulp.task('file-saver-js', function () {
    return gulp.src('node_modules/filesaver.js/FileSaver.min.js')
        .pipe(gulp.dest('dist/js'))
});

gulp.task('svg-pan-zoom', function () {
    return gulp.src('node_modules/svg-pan-zoom/dist/svg-pan-zoom.min.js')
        .pipe(gulp.dest('dist/js'))
});

gulp.task('screenfull', function () {
    return gulp.src('node_modules/screenfull/dist/screenfull.js')
        .pipe(gulp.dest('dist/js'))
});

gulp.task('sketch.js', function () {
    return gulp.src('node_modules/sketch.js/lib/sketch.js')
        .pipe(gulp.dest('dist/js'))
});

gulp.task('clean-build', ['clean-dist', 'build']);

gulp.task('build', ['client', 'jquery-typeahead-css', 'bootstrap-css', 'vue', 'jquery', 'jquery-typeahead-js', 'bootstrap-slider', 'file-saver-js', 'svg-pan-zoom', 'screenfull', 'sketch.js']
);

gulp.task('watch', function () {
    gulp.watch('src/**/*.*', ['build']);
});