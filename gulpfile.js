const gulp = require('gulp');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');
const imageminMozjpeg = require('imagemin-mozjpeg');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const webpack = require('webpack-stream');
const notify = require('gulp-notify');
const connect = require('gulp-connect-php');

gulp.task('bundle', () => {

  return gulp
    .src('./src/assets/js/app.js')
    .pipe(webpack({
      watch: true,
      devtool: 'inline-source-map',
      mode: 'development',
      entry: {
        app: './src/assets/js/app.js'
      },
      output: {
        filename: 'app.js',
      },
      performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },
          {
            test: /\.scss$/,
            use: [
              'css-loader',
              {
                loader: 'sass-loader'
              }
            ]
          }
        ]
      }
    }))
    .pipe(notify('Success! The styles and scripts were compiled.'))
    .pipe(gulp.dest('./dist/js'));

})

gulp.task('sass', function() {

  gulp.src('./src/assets/scss/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css'));

});

gulp.task('imagemin', function() {
  gulp.src('./src/assets/img/**/*')
    .pipe(imagemin([
      imageminMozjpeg({
        quality: 90
      }),

      imageminOptipng({
        optimizationLevel: 5
      }),

      imageminSvgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest('./dist/img'))
});

gulp.task('connect-sync', function() {

  connect.server({
    port: 8080,
    keepalive: true
  });

});

gulp.task('browser-sync', ['connect-sync'], function() {

  browserSync({

    files: "**/*.php",
    proxy: '127.0.0.1:8080/src/views/',
    open: true,
    notify: false

  });

});

gulp.task('default', ['browser-sync', 'sass', 'imagemin'], function () {
  gulp.watch("src/assets/scss/**/*.*", ['sass']);
});

gulp.task('webpack', ['bundle']);
