module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			dist: {
				src: ['src/genealogy/main.js', 'src/genealogy/individual.js', 'src/genealogy/relationship.js', 'src/genealogy/renderer.js'],
				dest: 'views/static/genealogy.js'
			}
		},
		copy: {
			dist: {
				files: [
					{
						src: ['src/main.html'],
						dest: 'views/main.html'
					},
					{
						src: ['src/svg_pencil/svg_pencil.js'],
						dest: 'views/static/svg_pencil.js'
					},
					{
						src: 'src/ext/bootstrap.css',
						dest: 'views/static/bootstrap.css'
					}
					]
			}
		},
		watch: {
			files: ['src/genealogy/*.js', 'src/svg_pencil/*.js'],
			tasks: ['concat:dist', 'copy:dist']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat:dist', 'copy:dist']);

}