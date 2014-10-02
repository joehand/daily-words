module.exports = function(grunt) {
  var buildDir = '<%= pkg.name %>/static/build/',
      srcJSDir = '<%= pkg.name %>/static/js/';

  // Load all grunt tasks except template-jasmine-requirejs which is required in
  // the jasmine task below.
  require('matchdep').filterDev('grunt-!(template-jasmine-requirejs)').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
        target: {
          rjsConfig: '<%= pkg.name %>/static/js/config.js'
        }
    },
    uglify: {
        options: {
        },
        build: {
          src: buildDir + 'require.js',
          dest: buildDir + 'require.js',
        }
    },
    bowercopy: {
        options: {
            // Task-specific options go here
            report:false
        },
        libs: {
            options: {
                destPrefix: buildDir
            },
            files: {
                'require.js': 'requirejs/require.js'
            },
        },
    },
    requirejs: {
      compile: {
        options: {
          appDir: srcJSDir,
          dir: buildDir,
          mainConfigFile: srcJSDir + 'config.js',
          paths: {
            main: 'main'
          },
          modules: [
                {
                  name: "main"
                }
          ],
          wrapShim: true,
          findNestedDependencies: true,
          optimize: 'uglify2',
          removeCombined:true
        }
      }
    },
    clean: [buildDir],
    connect: {
        test : {
            port : 8000
        }
    },
    jasmine: {
        test: {
          src: 'static/**/*.js',
          options: {
            specs: 'tests/**/*.spec.js',
            host: 'http://127.0.0.1:8000/',
            //display:'short',
            vendor: [
              'words/static/ext/sinonjs/sinon.js',
            ],
            template: require('grunt-template-jasmine-requirejs'),
            templateOptions: {
              requireConfigFile: 'tests/js/config.js',
              requireConfig: {
                baseUrl: srcJSDir,
                deps:[''] //overwrite specRunner dep
              }
            }
          }
        }
    },
  });

  // task(s).
  grunt.registerTask('test', ['connect:test', 'jasmine:test']);
  grunt.registerTask('build', ['clean','requirejs', 'bowercopy', 'uglify']);
  grunt.registerTask('default', ['build']);

};
