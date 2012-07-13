/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
        dist: {
          src: ['js/ender.min.js', 'js/codemirror.js', 'js/xml.js', 'js/markdown.js', 'js/javascript.js', 'js/html.js', 'js/gfm.js', 'js/vim.js', 'js/script.js'],
          dest: 'js/built.js'
        }
      },
      min: {
        dist: {
          src: ['<config:concat.dist.dest>'],
          dest: 'js/built.min.js'
        }
      }
  })
  grunt.registerTask('default', 'concat min');
};
