module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			dist: {
				src: [
				'src/genealogy/main.js', 
				'src/genealogy/individual.js', 
				'src/genealogy/relationship.js', 
				'src/genealogy/individual_node.js', 
				'src/genealogy/siblings_node.js', 
				'src/genealogy/renderer.js'],
				dest: 'static/js/genealogy.js'
			}
		},
		copy: {
			dist: {
				files: [
					{
						src: ['src/main.html'],
						dest: 'static/main.html'
					},
					{
						src: ['src/svg_pencil/svg_pencil.js'],
						dest: 'static/js/svg_pencil.js'
					},
					{
						src: ['src/hierarchydiagram/hierarchydiagram.js'],
						dest: 'static/js/hierarchydiagram.js'
					}
					]
			}
		},
		watch: {
			files: ['src/genealogy/*.js', 'src/svg_pencil/*.js', 'src/hierarchydiagram/hierarchydiagram.js', 'src/main.html'],
			tasks: ['jshint', 'concat:dist', 'copy:dist']
		},
		jshint: {
			options: {
				esversion: 6
			},
			files: ['src/genealogy/*.js', 'src/svg_pencil/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['concat:dist', 'copy:dist']);

}