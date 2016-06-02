'use strict';

module.exports = function(grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    eslint: {
      options: {
        configFile: '.eslintrc',
      },
      gruntfile: {
        src: 'Gruntfile.js',
      },
      lib: {
        src: ['lib/**/*.js'],
      },
      test: {
        src: ['test/**/*.js'],
      },
    },
    mochacli: {
      options: {
        reporter: 'spec',
        bail: false,
      },
      all: ['test/*.js'],
    },
    watch: {
      gruntfile: {
        files: '<%= eslint.gruntfile.src %>',
        tasks: ['eslint:gruntfile'],
      },
      lib: {
        files: '<%= eslint.lib.src %>',
        tasks: ['eslint:lib', 'mochacli'],
      },
      test: {
        files: '<%= eslint.test.src %>',
        tasks: ['eslint:test', 'mochacli'],
      },
    },
  });

  // Default task.
  grunt.registerTask('default', ['eslint', 'mochacli']);
};
