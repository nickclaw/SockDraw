var gulp = require('gulp'),
	gutil = require('gulp-util'),
	uglify = require('gulp-uglify')
	sass = require('gulp-sass'),
	concat = require('gulp-concat')
	es = require('event-stream')
	imagemin = require('gulp-imagemin')
	clean = require('gulp-clean');


// compile everything for production
gulp.task('default', function(){
	gulp.run('js', 'css', 'images', 'html');
});


// run once then watch for changes
gulp.task('watch', function() {
	gulp.run('default');

	gulp.watch('./src/static/js/*', function(evt) {
		gulp.run('js');
	});

	gulp.watch('./src/static/css/*.scss', function(evt) {
		gulp.run('css');
	});

	gulp.watch('./src/static/image/*', function(evt) {
		gulp.run('images');
	});

	gulp.watch('./src/static/*.html', function(evt) {
		gulp.run('html');
	});
});





gulp.task('clean', function() {
	gulp.src('./build/*', { read : false })
		.pipe(clean({ force : true }));
});

gulp.task('js', function() {
	es.concat(
			gulp.src('./src/static/js/external/*.js')
				.pipe(concat('externals.js')),

			gulp.src('./src/static/js/*.js')
				.pipe(uglify())
				.pipe(concat('locals.js'))
		)
		.pipe(concat('script.js'))
		.pipe(gulp.dest('./build/static/js/'));
});

gulp.task('css', function() {
	gulp.src('./src/static/css/style.scss')
		.pipe(sass({
			includePaths : ['./src/static/css/'],
			outputStyle : 'compressed'
		}))
		.pipe(gulp.dest('./build/static/css'));
});

gulp.task('images', function() {
	gulp.src('./src/static/image/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./build/static/image'));
});

gulp.task('html', function() {
	gulp.src('./src/static/*.html')
		.pipe(gulp.dest('./build/static/'));
});