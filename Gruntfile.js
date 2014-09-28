module.exports = function(grunt) {
  var buildDir = '<%= pkg.name %>/static/build/',
      srcJSDir = '<%= pkg.name %>/static/js/';

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
    clean: [buildDir]
  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bower-requirejs');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-clean');


  // Default task(s).
  grunt.registerTask('build', ['clean','requirejs', 'bowercopy', 'uglify']);
  grunt.registerTask('default', ['build']);

};
