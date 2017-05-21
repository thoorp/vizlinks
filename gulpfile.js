var gulp = require('gulp');
var del = require('del');

//cleanup dist folder
gulp.task('clean-dist', function () {
    return del('dist/**', { force: true });
});

//move server files
gulp.task('server', function () {
    return gulp.src(['src/server/**/*', '!src/server/**/*.ts'])
        .pipe(gulp.dest('dist/server'))
});

//move html/js/css/img files
gulp.task('client', function () {
    return gulp.src('src/client/**/*')
        .pipe(gulp.dest('dist'))
});

//move frontend css/fonts
gulp.task('bootstrap-css', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('dist/css'))
});

gulp.task('bootstrap-fonts', function () {
    return gulp.src('node_modules/bootstrap/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('bootstrap-slider-css', function () {
    return gulp.src('node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css')
        .pipe(gulp.dest('dist/css'))
});

gulp.task('font-awesome-css', function () {
    return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
        .pipe(gulp.dest('dist/css'))
});

gulp.task('font-awesome-fonts', function () {
    return gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
});

//move frontend js
gulp.task('vue', function () {
    return gulp.src('node_modules/vue/dist/vue.min.js')
        .pipe(gulp.dest('dist/js'))
});


gulp.task('jquery', function () {
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
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

gulp.task('clean-build', ['clean-dist', 'build']);

gulp.task('build', ['server', 'client', 'bootstrap-css', 'bootstrap-fonts', 'bootstrap-slider-css',
    'font-awesome-css', 'font-awesome-fonts', 'vue', 'jquery', 'bootstrap-slider', 'file-saver-js', 'svg-pan-zoom', 'screenfull']
);

gulp.task('watch', function () {
    gulp.watch('src/**/*.*', ['build']);
});