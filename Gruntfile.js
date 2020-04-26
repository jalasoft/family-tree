module.exports = function(grunt) {
  grunt.iniConfig({
    concat: {
      src: ['src/*.js'],
      dest: 'all.bundle.js'
    }
  });
  
  grunt.loadNPMTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['concat']);
}
