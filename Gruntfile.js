module.exports = function(grunt) {
  'use strict';

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
    require('time-grunt')(grunt);

    grunt.initConfig({

        config: {
            src: 'src',
            dist: 'dist',
            pages: 'gh-pages',
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
                        "<%= config.tmp %>/{,*/}*.html",
                        "<%= config.tmp %>/assets/css/{,*/}*.css",
                        "<%= config.src %>/assets/{,*/}*"
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        port: 3000,
                        baseDir: ["<%= config.tmp %>","./"]
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
            build: {
                options:{
                    style: 'compressed'
                },
                files: {
                  '<%= config.dist %>/assets/css/app.css': '<%= config.src %>/assets/scss/app.scss'
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
                    flatten: true,
                    src: '.tmp/assets/css/*.css',
                    dest: '.tmp/assets/css/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.tmp %>/assets/css/',
                    src: '{,*/}*.css',
                    dest: '<%= config.dist %>/assets/css/'
                }]
            }
        },

        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.tmp %>/index.html',
            //css: '<%= config.tmp %>/assets/css/app.css'
        },

        usemin: {
            options: {
                assetsDirs: ['<%= config.tmp %>','bower_components']
            },
            html: ['<%= config.tmp %>/{,*/}*.html'],
            css: ['<%= config.tmp %>/assets/css/*.css']
        },

        imagemin: {
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/assets/img/',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.tmp %>/assets/img/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/assets/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/assets/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/assets/images',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/assets/images'
                }]
            }
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
                }]
            },
            serverhtml: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>',
                    dest: '<%= config.tmp %>',
                    src: [
                        '{,*/}*.{html,htm}']
                }]
            },
            serverjs: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>',
                    dest: '<%= config.tmp %>',
                    src: [
                        'assets/scripts/*.*']
                }]
            },
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,jpg,txt}',
                        '.htaccess',
                        'assets/fonts/{,*/}*.*']
                }]
            }
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
          all: ['Gruntfile.js', 'src/**/*.js']
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


        clean: ['<%= config.dist %>','<%= config.tmp %>'],

        concurrent: {
            server: [
                'sass:server',
                'autoprefixer:server',
                'imagemin:server',
                'copy:server'
            ],
            dist: [
                'sass:build',
                'autoprefixer:dist',
                'imagemin:dist',
                'svgmin',
                //'concat',
                'uglify'
            ]
        }
    });

    grunt.registerTask('serve', [
        'clean',
        'jshint',
        'concurrent:server',
        'browserSync',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'copy:build',
        'useminPrepare',
        'concurrent:dist',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

};
