var gulp = require ('gulp');
var realFavicon = require ('gulp-real-favicon');
var htmlmin = require('gulp-htmlmin');
var $ = require('gulp-load-plugins')();
var fs = require('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
	realFavicon.generateFavicon({
		masterPicture: './src/assets/images/picture.png',
		dest: './dist',
		iconsPath: '/',
		design: {
			ios: {
				pictureAspect: 'noChange',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#da532c',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#ffffff',
				manifest: {
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			}
		},
		settings: {
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
});



// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
	return gulp.src([ './src/misc/*.html' ])
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest('./src/staging'));
});



// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
	});
});

gulp.task('minify', function() {
  return gulp.src('./src/staging/*.html')
    .pipe(htmlmin({collapseWhitespace: true, collapseInlineTagWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('./src/images/*.{jpg,png}')
    .pipe($.responsive({
      '*.{jpg,png}': [{
        width: 100,
        rename: {
          suffix: '-100px',
          extname: '.jpg',
        },
        format: 'jpeg',
      }, {
        width: 240,
        rename: {
          suffix: '-240px',
          extname: '.jpg',
        },
        format: 'jpeg',
      }, {
        width: 320,
        rename: {
          suffix: '-320px',
          extname: '.jpg',
        },
        format: 'jpeg',
      }, {
        width: 500,
        rename: {
          suffix: '-500px',
          extname: '.jpg',
        },
        format: 'jpeg',
      }, {
        width: 640,
        rename: {
          suffix: '-640px',
          extname: '.jpg',
        },
        // format option can be omitted because
        // format of output image is detected from new filename
        // format: 'jpeg'
      }, {
        width: 800,
        rename: {
          suffix: '-800px',
          extname: '.jpg',
        },
        format: 'jpeg',
      }, {
        width: 1600,
        rename: {
          suffix: '-1600px',
          extname: '.jpg',
        },
        format: 'jpeg',
      }, {
        width: 2048,
        rename: {
          suffix: '-2048px',
          extname: '.jpg',
        },
        // Do not enlarge the output image if the input image are already less than the required dimensions.
        withoutEnlargement: true,
      }, {
        // Convert images to the webp format
        width: 100,
        rename: {
          suffix: '-100px',
          extname: '.webp',
        },
      }, {
        // Convert images to the webp format
        width: 240,
        rename: {
          suffix: '-240px',
          extname: '.webp',
        },
      }, {
        // Convert images to the webp format
        width: 320,
        rename: {
          suffix: '-320px',
          extname: '.webp',
        },
      }, {
        // Convert images to the webp format
        width: 500,
        rename: {
          suffix: '-500px',
          extname: '.webp',
        },
      }, {
        // Convert images to the webp format
        width: 640,
        rename: {
          suffix: '-640px',
          extname: '.webp',
        },
      }, {
        // Convert images to the webp format
        width: 800,
        rename: {
          suffix: '-800px',
          extname: '.webp',
        },
      }, {
        // Convert images to the webp format
        width: 1600,
        rename: {
          suffix: '-1600px',
          extname: '.webp',
        },
      }, {
        // Convert images to the webp format
        width: 2048,
        rename: {
          suffix: '-2048px',
          extname: '.webp',
        },
      }],
    }, {
      // Global configuration for all images
      // The output quality for JPEG, WebP and TIFF output formats
      quality: 80,
      // Use progressive (interlace) scan for JPEG and PNG output
      progressive: true,
      // Strip all metadata
      withMetadata: false,
      // Do not emit the error when image is enlarged.
      errorOnEnlargement: false,
    }))
    .pipe(gulp.dest('./dist/img'));
});
