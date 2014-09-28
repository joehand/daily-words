require.config({
  //baseUrl: '/static/',
  deps: [
    'main'
  ],
  shim: {
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    'backbone.stickit': {
      deps: ['backbone']
    },
    'Backbone.dualStorage': {
      deps: ['backbone']
    },
    underscore: {
      exports: '_'
    }
  },
  paths: {
    models: 'app/models',
    views: 'app/views',
    backbone: '../ext/backbone/backbone',
    jquery: '../ext/jquery/dist/jquery',
    requirejs: '../ext/requirejs/require',
    underscore: '../ext/underscore/underscore',
    'backbone.stickit': '../ext/backbone.stickit/backbone.stickit',
    'Backbone.dualStorage': '../ext/Backbone.dualStorage/Backbone.dualStorage',
  }
});
