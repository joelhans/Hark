module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-reload');

  grunt.initConfig({

    build: {
      files: [ 'assets/scss/*.scss', 'assets/coffee/*.coffee' ],
      tasks: [ 'compass', 'coffee', 'concat', 'min' ]
    },

    dev_coffee: {
      files: [ 'assets/coffee/*.coffee' ],
      tasks: [ 'coffee', 'concat', 'min' ]
    },

    watch: {
      files: [ 'assets/scss/*.scss', 'assets/coffee/*.coffee' ],
      tasks: [ 'compass', 'coffee', 'concat', 'min', 'reload' ]
    },

    coffee: {
      compile: {
        files: {
          'assets/js/coffee.js': ['assets/coffee/*.coffee'], // compile and concat into single file
        }
      }
    },

    concat: {
      dist: {
        src: [ 
          'assets/js/vendor/jquery.jplayer.js',
          'assets/js/vendor/jquery.tinysort.js',
          'assets/js/vendor/jquery.history.js',
          'assets/js/vendor/jquery.moment.js',
          'assets/js/coffee.js'
        ],
        dest: 'assets/js/app.js',
        separator: ';'
      }
    },

    min: {
      dist: {
        src: ['assets/js/app.js'],
        dest: 'public/js/app.js'
      }
    },

    compass: {
      dev: {
        src: 'assets/scss',
        dest: 'public/css',
        linecomments: true,
        forcecompile: true,
        require: [
          'susy'
        ],
        debugsass: false,
        images: 'public/images',
        relativeassets: true,
        outputstyle: 'compressed'
      }
    },

    reload: {
      port: 35729, // LR default
      liveReload: {}
    }

  });
  
};