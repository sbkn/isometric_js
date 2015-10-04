module.exports = function (grunt) {
	"use strict";

	/*eslint-disable no-var */
	var libs = [
			/*eslint-enable no-var */
			"node_modules/jquery/dist/jquery.js"
		],

		srcFiles = [
			"js/common/_begin.es6",
            "js/Camera.es6",
            "js/init.es6",
			"js/Point.es6",
			"js/Ghost.es6",
			"js/main.es6",
			"js/input.es6",
			"js/common/_end.es6"
		],

		finalize = [].concat(
			"js/common/_begin.js",
			libs,
			"dist/app-transpiled.js",
			"js/common/_end.js"
		),

		cssFiles = [
			"style.css"
		];

	grunt.initConfig({

		concat: {

			options: {
				separator: "\n"
			},

			mycode: {
				src: srcFiles,
				dest: "dist/app-concat.es6"
			},

			allcode: {
				src: finalize,
				dest: "dist/app.js"
			},

			css: {
				src: cssFiles,
				dest: "css/app.css"
			}
		},

		eslint: {
			target: ['dist/app-concat.es6']
		},

		babel: {
			options: {
				sourceMap: true
			},

			dist: {
				files: {
					"dist/app-transpiled.js": "dist/app-concat.es6"
				}
			}
		},

		uglify: {

			options: {
				mangle: {
					except: ["jQuery"]
				}
			},

			target: {
				files: {
					"dist/app.min.js": ["dist/app.js"]
				}
			}

		},

		watch: {
			scripts: {
				files: [].concat("Gruntfile.js", srcFiles, cssFiles),
				tasks: ["build"],
				options: {
					spawn: false,
					livereload: true
				}
			}
		},

		esdoc : {
			dist : {
				options: {
					source: './js',
					destination: './doc'
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-babel");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks('grunt-esdoc');
		
	// concat mycode, lint, transpile, concat with libs, concat css, minify
	grunt.registerTask("build", ["concat:mycode", "eslint", "babel", "concat:allcode", "concat:css", "uglify"]);
    grunt.registerTask("release", ["build", "esdoc"]);

	grunt.registerTask("default", ["build", "watch"]);
};
