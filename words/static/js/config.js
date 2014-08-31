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
    }
  },
  paths: {
    backbone: "../ext/backbone/backbone",
    jquery: "../ext/jquery/dist/jquery",
    requirejs: "../ext/requirejs/require",
    underscore: "../ext/underscore/underscore",
    "backbone.stickit": "../ext/backbone.stickit/backbone.stickit"
  },
  packages: [

  ]
});
