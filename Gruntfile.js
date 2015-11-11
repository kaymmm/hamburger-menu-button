module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    config: {
      root: './',
      src: 'src',
      dist: 'dist',
      bin: 'bin',
      tmp: '.tmp'
    },

    watch: {
      gruntfile: {
        files: ['Gruntfile.js']
      },
      html: {
      files: ['<%= config.src %>/{,*/}/*.{html,htm}'],
      tasks: ['newer:copy:serverhtml']
    },
    sass : {
      files: ['<%= config.src %>/assets/scss/{,*/}*.{scss,css}'],
      tasks: ['sass:server','autoprefixer:server']
    },
    img : {
      files: ['<%= config.src %>/assets/images/*.{jpg,jpeg,png,gif}'],
      tasks: ['newer:imagemin:server']
    },
    js : {
      files: ['<%= config.src %>/assets/scripts/*.js'],
      tasks: ['jshint','copy:serverjs']
    }
  },

  browserSync: {
    dev: {
      bsFiles: {
        src : [
          '<%= config.tmp %>/{,*/}*.html',
          '<%= config.tmp %>/assets/css/{,*/}*.css',
          '<%= config.src %>/assets/{,*/}*'
        ]
      },
      options: {
        watchTask: true,
        server: {
          port: 3000,
          baseDir: ['<%= config.tmp %>','./']
        },
        ui: {
          port: 3001
        }
      }
    }
  },

  sass: {
    options: {
      lineNumbers: true,
      loadPath: 'bower_components/'
    },
    server: {
      files: {
        '<%= config.tmp %>/assets/css/app.css': '<%= config.src %>/assets/scss/app.scss'
      }
    },
    dist: {
      options:{
        style: 'compressed'
      },
      files: {
        '<%= config.tmp %>/assets/css/app.css': '<%= config.src %>/assets/scss/app.scss'
      }
    }
  },

  autoprefixer: {
    options: {
      browsers: ['last 2 versions', 'ie 8', 'ie 9']
    },
    server:{
      files: [{
        expand: true,
        src: '<%= config.tmp %>/assets/css/{,*/}*.css',
        dest: '<%= config.tmp %>/assets/css/'
      }]
    },
    dist: {
      files: [{
        expand: true,
        src: '<%= config.tmp %>/assets/css/{,*/}*.css',
        dest: '<%= config.tmp %>/assets/css/'
      }]
    }
  },

    useminPrepare: {
      options: {
        dest: '<%= config.dist %>',
        staging: '<%= config.tmp %>',
        root: '<%= config.root %>'
      },
      html: '<%= config.src %>/index.html',
      //css: '<%= config.tmp %>/assets/css/app.css'
    },

    usemin: {
      options: {
        assetsDirs: [
          '<%= config.tmp %>',
          'bower_components'
        ]
      },
      html: ['<%= config.dist %>/index.html'],
      //css: ['<%= config.dist %>/assets/css/*.css'],
      //js: ['<%= config.dist %>/assets/scripts/*.js']
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: false,
          collapseWhitespace: false,
          removeAttributeQuotes: false,
          removeCommentsFromCDATA: false,
          removeEmptyAttributes: false,
          removeOptionalTags: false,
          removeRedundantAttributes: false,
          useShortDoctype: false
        },
        files: [{
          expand: true,
          cwd: '<%= config.tmp %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    copy: {
      server: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.src %>',
          dest: '<%= config.tmp %>',
          src: [
            '{,*/}*.{html,htm}',
            '*.{ico,png,jpg,txt}',
            '.htaccess',
            'assets/fonts/{,*/}*.*',
            'assets/scripts/{,*/}*.js'
          ]
        },{
          expand: true,
          dot: true,
          cwd: 'bower_components/materialize/',
          src: 'font/{,*/}*.*',
          dest: '<%= config.tmp %>'
        }]
      },

      serverhtml: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.src %>',
          dest: '<%= config.tmp %>',
          src: [
            '{,*/}*.{html,htm}'
          ]
        }]
      },

      serverjs: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.src %>',
          dest: '<%= config.tmp %>',
          src: [
            'assets/scripts/*.*'
          ]
        }]
      },

      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.src %>',
          dest: '<%= config.dist %>',
          src: [
            '{,*/}*.{html,htm}'
          ]
        },{
          expand: true,
          dot: true,
          cwd: 'bower_components/materialize/',
          src: 'font/{,*/}*.*',
          dest: '<%= config.dist %>/assets/'
        }]
      },

      bin: {
        files: [{
          expand: true,
          dot: true,
          dest: '<%= config.bin %>',
          flatten: true,
          src: [
            '<%= config.dist %>/assets/css/hamburger-menu-button.css',
            '<%= config.dist %>/assets/scripts/hamburger-menu-button.min.js'
          ]
        }]
      },
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/**/*.js'
      ]
    },

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          '<%= config.dist %>/assets/scripts/hamburger-menu-button.min.js': ['<%= config.src %>/assets/scripts/main.js']
        }
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['<%= config.src %>/index.html'],
        //exclude: ['bower_components/bootstrap/dist/js/bootstrap.js']
      }
    },


    clean: {
      all: ['<%= config.dist %>','<%= config.tmp %>','<%= config.bin %>'],
      server: ['<%= config.tmp %>'],
      dist: ['<%= config.dist %>'],
      bin: ['<%= config.bin %>'],
    },

    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: '**/*'
    },

    'release-it': {
      options: {
        pkgFiles: ['package.json'],
        commitMessage: 'Release %s',
        tagName: '%s',
        tagAnnotation: 'Release %s',
        buildCommand: false
      }
    }

  });

  grunt.registerTask('serve', [
    'clean:server',
    'jshint',
    'sass:server',
    'autoprefixer:server',
    'copy:server',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:all',
    'jshint',
    'sass:dist',
    'autoprefixer:dist',
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'copy:dist',
    'usemin',
    //'htmlmin',
    'copy:bin'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
