module.exports = function(grunt){

	// 01 Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Define Path
		dirs: {
			inputSCSS			: 'app/scss',
			outputCSS			: 'app/css',
		},

		sass: {
			options: {
				outputStyle: 'expanded'
			},
			files: {
				src: '<%= dirs.inputSCSS %>/main.scss',
				dest: '<%= dirs.outputCSS %>/main.css',
			}
		},

		watch: {
			scripts: {
				files: [
					'<%= dirs.inputSCSS %>/*.scss',				// app/sass/*.scss
					'<%= dirs.inputSCSS %>/*/*.scss',			// app/sass/*/*.scss
				],
				tasks: ['sass'],
				options: {
					spawn: false,
					livereload: true
				},
			},
		},
	});

  	grunt.loadNpmTasks('grunt-sass');
  	grunt.loadNpmTasks('grunt-contrib-watch');

	// Task Developer
	grunt.registerTask('dev', [
		'sass',
		'watch',
	]);
}

