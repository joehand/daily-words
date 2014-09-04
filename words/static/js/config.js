require.config({
  deps: [
    "main"
  ],
  shim: {
    backbone: {
      deps: [
        "jquery",
        "underscore"
      ],
      exports: "Backbone"
    },
    "backbone.stickit": {
      deps: [
        "backbone"
      ]
    },
    underscore: {
      exports: "_"
    },
    jasmine: {
      exports: "jasmine"
    },
    "jasmine-html": {
      deps: [
        "jasmine"
      ],
      exports: "jasmine"
    }
  },
  paths: {
    models: "app/models",
    views: "app/views",
    backbone: "../ext/backbone/backbone",
    jquery: "../ext/jquery/dist/jquery",
    requirejs: "../ext/requirejs/require",
    underscore: "../ext/underscore/underscore",
    "backbone.stickit": "../ext/backbone.stickit/backbone.stickit",
    jasmine: "../ext/jasmine/lib/jasmine-core",
    "jasmine-html": "../ext/jasmine/lib/jasmine-core/jasmine-html",
    sinon: "../ext/sinon/lib/sinon",
    "jasmine-sinon": "../ext/jasmine-sinon/lib/jasmine-sinon"
  },
  packages: [

  ]
});
