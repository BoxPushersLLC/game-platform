const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const babelify = require('babelify');
const browserify = require('browserify');
const browserSync = require('browser-sync');
const buffer = require('vinyl-buffer');
const cache = require('gulp-cache');
const concat = require('gulp-concat');
const del = require('del');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const jshint = require('gulp-jshint');
const lazypipe = require('lazypipe');
const livereload = require('tiny-lr')();            //preferred to gulp-livereload
const mocha = require('gulp-mocha');
const minifycss = require('gulp-cssnano');          //gulp-minify-css is depricated
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const sass = require('gulp-ruby-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const stylish = require('jshint-stylish');
const uglify = require('gulp-uglify');
    
var reload = browserSync.reload;
    
var lint = lazypipe()
	.pipe(jshint)
	.pipe(jshint.reporter, stylish);

var jsTransform = lazypipe()
	.pipe(babel)
	.pipe(uglify);

    
gulp.task( 'validate', function() {
    return gulp.src( [ './src/*.js',  '!./**/vendor/**'], {read: true} )
			   .pipe( lint() );
});


gulp.task( 'run-tests', function() {
    return gulp.src( [ './src/test/*Tests.js' ], {read: false} )
    .pipe( mocha( { reporter: 'spec',
					useColors: true,
					compilers: [ 'js:babel-core/register' ],
					//globals: { chai: require('chai') },  // this seems to do nothing
					ui: 'bdd' 
	} ) );
});

//gulp.task('build', () => {
//	return gulp.src('./src/**/*.js')
//			   .pipe( lint() )
//			   .pipe( jsTransform() )
//			   .pipe(gulp.dest('dist'));
//});
    
gulp.task( 'watch-test', function(){
	gulp.watch( [ './src/**' ], [ 'run-tests' ] );
});

    
gulp.task( 'default', ['run-tests', 'validate'] );  // gulp wants a default but we never use it

gulp.task( 'test-all', ['run-tests', 'validate', 'watch-test' ] );

gulp.task( 'test-with-args', function() {
	var testFiles = [];
	// grab every other arg because we don't want the --option flags that's before each file
	for (var ii = 4; ii < process.argv.length; ii+=2 ) {
		testFiles.push( './src/test/' + process.argv[ii] + 'Tests.js' );
	}
	return gulp.src( testFiles, {read: false} )
		.pipe( lint() )
		.pipe( jsTransform() )
	    .pipe( mocha( { reporter: 'spec',
						useColors: true,
						compilers: [ 'js:babel-core/register' ],
						//globals: { chai: require('chai') },  // this seems to do nothing
						ui: 'bdd' 
					  } ) );
} );


gulp.task( 'express-start', function() {
	nodemon({
		script: './src/www/index.js',
    })
	.on('restart', function () {
		console.log('restarted!');
		livereload.changed( {body: { files: __dirname }} );
	});
	
	livereload.listen(35729);
	
	gulp.watch(['./views/**/*.jade' ], function(event){
		var fileName = require('path').relative('3000', event.path);
		livereload.changed({
			body: { files: [fileName] }
		});
	});

	
});