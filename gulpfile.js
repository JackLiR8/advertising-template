var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var babel = require('gulp-babel')
var sass = require('gulp-sass')
var htmlmin = require('gulp-htmlmin')
var livereload = require('gulp-livereload')
var connect = require('gulp-connect')
var gulpLoadPlugins = require('gulp-load-plugins')
const plugins = gulpLoadPlugins()

sass.compiler = require('node-sass')
const env = process.env.NODE_ENV
let target = env==='production' ? './dist' : './pre'

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
        .pipe(gulp.dest(`${target}/js/`))
        .pipe(livereload())
        .pipe(connect.reload())
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
        .pipe(gulp.dest(`${target}/css/`))
        .pipe(livereload())
        .pipe(connect.reload())
})

/* gulp.task('sass:watch', function () {
    gulp.watch('./src/scss/*.scss', ['scss']);
}); */

gulp.task('html',function(){        // 压缩html
    return gulp.src('src/*.html')
        .pipe(
                htmlmin({
                    collapseWhitespace:true
                })
        )
        .pipe(gulp.dest(`${target}/`))
        .pipe(livereload())
        .pipe(connect.reload())
})

gulp.task('watch',function(){   // 监听并自动刷新
    livereload.listen()
    gulp.watch(['src/js/*.js','src/scss/*.scss','src/*.html'],['script','scss','html'])
})

// 实现浏览器的自动刷新
gulp.task('connect',function(){
    connect.server({
        root:`${target}`,
        port:'8092',
        livereload:true
    })
})
if(env === 'production'){
    gulp.task('default',['script','scss','html'])
} else {
    gulp.task('default',['script','scss','html','watch','connect'])
}

