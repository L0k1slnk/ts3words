module.exports = function (grunt) {
    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'release/styles/style.css': 'source/styles/style.scss'
                }
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: ['> 1%']
                    }),
                    require('cssnano')({
                        zindex: false
                    })
                ]
            },
            dist: {
                src: 'release/styles/*.css'
            }
        },
        concat: {
            scripts: {
                files: {
                    'release/scripts/background.js': [
                        'source/scripts/background.js',
                        'source/scripts/tabs.js'
                    ],
                    'release/scripts/content.js': [
                        'source/scripts/vendor/jquery.js',
                        'source/scripts/vendor/jquery-ui.js',
                        'source/scripts/content.js'
                    ],
                    'release/scripts/browser.js': [
                        'source/scripts/browser.js'
                    ]
                }
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            dist: {
                files: {
                    'release/scripts/main.min.js': ['release/scripts/main.js']
                }
            }
        },
        watch: {
            styles: {
                files: ['source/styles/**/*.scss'],
                tasks: ['sass', 'postcss'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['source/scripts/**/*.js'],
                tasks: ['concat']
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-newer');

    grunt.registerTask("default", ["newer:sass", "newer:concat", "newer:postcss", "watch"]);
    grunt.registerTask("all", ["sass", "concat", "postcss"]);
    grunt.registerTask("dist", ["uglify"]);

};