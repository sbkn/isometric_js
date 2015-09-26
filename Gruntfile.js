module.exports = function (grunt) {
	"use strict";

	/*eslint-disable no-var */
	var libs = [
			/*eslint-enable no-var */
			"node_modules/jquery/dist/jquery.js"
		],

		srcFiles = [
			"js/common/_begin.es6",
			"js/*.es6",
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
			target: ["js/*.es6",
				"Gruntfile.js"]
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
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-babel");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
		
	// concat mycode, lint, transpile, concat with libs, concat css, minify
	grunt.registerTask("build", ["eslint", "concat:mycode", "babel", "concat:allcode", "concat:css", "uglify"]);

	grunt.registerTask("default", ["build", "watch"]);
};
