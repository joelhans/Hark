module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({

    //
    // WATCHING
    //

    watch: {
      coffeescript: {
        files: [ 'assets/coffee/*.coffee' ],
        tasks: [ 'coffee', 'concat' ]
      },
      sass: {
        files: [ 'assets/scss/*.scss' ],
        tasks: [ 'compass', 'reload' ]
      }
    },

    //
    // STANDARDS
    //

    coffee: {
      compile: {
        files: {
          'assets/js/coffee.js': ['assets/coffee/*.coffee'], // compile and concat into single file
        }
      }
    },

    concat: {
      dev: {
        src: [ 
          'assets/js/vendor/jquery.jplayer.js',
          'assets/js/vendor/jquery.tinysort.js',
          'assets/js/vendor/jquery.history.js',
          'assets/js/vendor/jquery.moment.js',
          'assets/js/coffee.js'
        ],
        dest: 'public/js/app.js',
        separator: ';'
      },
      build: {
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

    uglify: {
      build: {
        files: {
          'build/public/js/app.js': ['assets/js/app.js']
        }
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
        outputstyle: 'expanded'
      },
      build: {
        src: 'assets/scss',
        dest: 'build/public/css',
        linecomments: false,
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
    },

    copy: {
      main: {
        files: [
          {src: ['lib/**'], dest: 'build/'},
          {src: ['public/**'], dest: 'build/'},
          {src: ['views/**'], dest: 'build/'},
          {src: ['app.js'], dest: 'build/', filter: 'isFile'},
          {src: ['favicon.ico'], dest: 'build/', filter: 'isFile'},
          {src: ['package.json'], dest: 'build/', filter: 'isFile'}
        ]
      }
    }

  });

  grunt.registerTask('dev', ['coffee', 'concat:dev', 'compass:dev']);
  grunt.registerTask('build', ['copy', 'coffee', 'concat:build', 'compass:build', 'uglify:build']);
  // grunt.registerTask('build', ['coffee', 'concat:build', 'compass:build', 'min']);
  
};