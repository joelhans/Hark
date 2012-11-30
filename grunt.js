module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-reload');

  grunt.initConfig({

    watch: {
      files: [ 'assets/scss/*.scss', 'assets/coffee/*.coffee' ],
      tasks: [ 'compass', 'coffee', 'concat', 'reload' ]
      // tasks: [ 'compass', 'coffee' ]
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
          'assets/js/application.js',
          'assets/js/coffee.js'
        ],
        dest: 'public/js/app.js',
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
        require: [],
        debugsass: true,
        images: 'public/images',
        relativeassets: true
      }
    },

    reload: {
      port: 35729, // LR default
      liveReload: {}
    }

  });
  
};