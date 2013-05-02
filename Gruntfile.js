module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-watch');

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
      dev: {
        files: {
          'assets/js/coffee.js': ['assets/coffee/*.coffee']
        }
      },
      build: {
        files: {
          'build/assets/js/coffee.js': ['build/assets/coffee/*.coffee']
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
          'build/assets/js/vendor/jquery.jplayer.js',
          'build/assets/js/vendor/jquery.tinysort.js',
          'build/assets/js/vendor/jquery.history.js',
          'build/assets/js/vendor/jquery.moment.js',
          'build/assets/js/coffee.js'
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
        src: 'build/assets/scss',
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
          {src: ['assets/**'], dest: 'build/'},
          {src: ['lib/**'], dest: 'build/'},
          {src: ['public/**'], dest: 'build/'},
          {src: ['views/**'], dest: 'build/'},
          {src: ['app.js'], dest: 'build/', filter: 'isFile'},
          {src: ['favicon.ico'], dest: 'build/', filter: 'isFile'},
          {src: ['package.json'], dest: 'build/', filter: 'isFile'}
        ]
      }
    },

    replace: {
      build: {
        src: ['build/views/layout/head.jade'],
        overwrite: true,
        replacements: [{ 
          from: '/css/screen.css',
          to: '/css/screen.css?rel=<%= new Date().getTime() %>'
        }, {
          from: '/js/app.js',
          to: '/js/app.js?rel=<%= new Date().getTime() %>'
        }]
      }
    }

  });

  // grunt.registerTask('coffee', ['coffee:dev', 'concat:dev']);
  grunt.registerTask('dev', ['coffee:dev', 'concat:dev', 'compass:dev']);
  grunt.registerTask('build', ['copy', 'coffee:build', 'concat:build', 'compass:build', 'uglify:build', 'replace:build']);

};
