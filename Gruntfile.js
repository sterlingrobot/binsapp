/* globals module */
module.exports = function(grunt) {
	'use strict';

	var dist =  'binsapp',
			buildPathHTML = 'build/',
			buildPathCSS =  'build/css/',
			buildPathJS =  'build/js/',
			buildPathIMG = 'build/img/';

	var thefilename = [];
	var aNN = 0;

	var devReplace = [{
		pattern: /\/\/!-minified /ig,
		replacement: ''
	}];

	////////////////////////////////////////////
	// INIT
	////////////////////////////////////////////

	var initObj = {
		pkg: grunt.file.readJSON('package.json'),

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// WATCH
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		watch: {
			options: {
				livereload: true
			},
			html: {
				files: ['*.html'],
				tasks: ['htmlbuild']
			},
			css: {
				files: ['css/*.css'],
				tasks: ['css']
			},
			js: {
				files: ['js/*.js'],
				tasks: ['js']
			}
		},

		//////////////////////////////////////////////////////////////////////////////////////////
		// HTMLBUILD
		//////////////////////////////////////////////////////////////////////////////////////////
		htmlbuild: {
			dist: {
				src: ['*.html'],
				dest: buildPathHTML,
				options: {
					basePath: true,
					sections: {
						header: 'templates/header.html'
					}
				}
			}
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// CSS MIN
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		cssmin: {
			target: {
				files: {
					'build/css/binsapp.css': [
						'css/jquery-ui.min.css',
						'css/bootstrap.min.css',
						'DataTables/datatables.css',
						'css/style.css'
					]
				}
			}
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// IMPORT FOR JS
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		'import': {
			js: {
				options: {

				},
				files: [{
					expand: true,
					cwd: 'js/',
					src: ['build.js'],
					dest: buildPathJS,
					ext: '.js'
				}]
			}
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// UGLIFY - MINIFY JS FILES
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		uglify: {
			options: {
				report: 'min',
				maxLineLen: 0,
				preserveComments: /^\/*!/,
				mangle: false,
				compress: {
					unused: false,
					hoist_funs: false,
					sequences: false
				}
			},
			js: {
				files: [{
					src: [
						'node_modules/jquery/dist/jquery.min.js',
						buildPathJS+'build.js'
					],
					dest: '<%= buildPathJS %><%= dist %>.js'
				}]
			}
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// STRING REPLACE
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		'string-replace': {

			// standard file clean up and variable search for JS only
			js: {
				options: {
					replacements: devReplace
				},
				files: [{
					expand: true,
					cwd: buildPathJS,
					src: ['build.js'],
					dest: buildPathJS,
					filter: function(filepath) {
						thefilename[aNN] = filepath.replace(/.*[/\\]/,'');
						aNN++;
						return true;
					}
				}]
			}
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// IMAGE MIN
		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		imagemin: {
			options: {
				optimizationLevel: 3,
				svgoPlugins: [{ removeViewBox: false }]
			},
			files: {
				expand: true,
				cwd: 'img/',
				src: ['**/*.{png,jpg,gif,svg}'],
				dest: buildPathIMG,
				rename: function(dest, src) {
					return buildPathIMG + src;
				}
			}
		},


	};

	// Project configuration.
	grunt.initConfig(initObj);

	// Load plugins
	grunt.loadNpmTasks('grunt-import');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-html-build');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	// Default task(s).
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('css', ['cssmin']);
	grunt.registerTask('js', ['import:js', 'string-replace:js', 'uglify:js']);
	grunt.registerTask('cleanup', ['clean:builddir']);
	grunt.registerTask('build',
		['cleanup',
			'css',
			'js'
		]);

};
