require.config({
    baseUrl: "static/js",
    urlArgs: 'cb=' + Math.random(),
    shim: {
      backbone: {
        deps: [
          "jquery",
          "underscore"
        ],
        exports: "Backbone"
      },
      'backbone.stickit': {
        deps: [
          "backbone"
        ]
      },
      underscore: {
        exports: "_"
      },
      jasmine: {
          exports: 'jasmine'
      },
      'jasmine-html': {
          deps: ['jasmine'],
          exports: 'jasmine'
      }
    },
    paths: {
      backbone: "../ext/backbone/backbone",
      jquery: "../ext/jquery/dist/jquery",
      requirejs: "../ext/requirejs/require",
      underscore: "../ext/underscore/underscore",
      'backbone.stickit': "../ext/backbone.stickit/backbone.stickit",
      jasmine: "../ext/jasmine/lib/jasmine-core/jasmine",
      'jasmine-html': '../ext/jasmine/lib/jasmine-core/jasmine-html',
    },
});
