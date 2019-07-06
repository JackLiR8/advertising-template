var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var babel = require('gulp-babel')
var sass = require('gulp-sass')

sass.compiler = require('node-sass')

gulp.task('script',function(){  
    return gulp.src('src/js/*.js')
        .pipe(babel())
        .pipe(concat('build.js'))   // 合并
        .pipe(uglify())             // 压缩
        .pipe(
            rename({                // 重命名
                suffix:'.min'
            })
        )
        .pipe(gulp.dest('./dist/js/'))
})

gulp.task('scss',function(){        // 将scss合并、编译成css、重命名
    return gulp.src('./src/scss/*.scss')
        .pipe(concat('build.css'))
        .pipe(
            sass.sync({outputStyle:'compressed'}).on('error',sass.logError)
        )
        .pipe(
            rename({
                suffix:'.min'
            })
        )
        .pipe(gulp.dest('dist/css/'))
})

gulp.task('sass:watch', function () {
    gulp.watch('./src/scss/*.scss', ['scss']);
});

gulp.task('default',['script','scss'])
