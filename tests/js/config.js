require.config({
  baseUrl: "static/js/",
  deps: [
    'specRunner',
  ],
  urlArgs: 'cb=' + Math.random(),
  shim: {
    backbone: {
      deps: [
        "jquery",
        "underscore"
      ],
      exports: "Backbone"
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
    },
    'boot': {
        deps: ['jasmine', 'jasmine-html'],
        exports: 'boot'
    },
    'sinon':{
        exports:'sinon'
    },
    'jasmine-sinon': {
        deps: ['jasmine', 'sinon'],
    },
  },
  paths: {
    spec: '/spec',
    specRunner: '/specRunner',
    models: 'app/models',
    views: 'app/views',
    backbone: "../ext/backbone/backbone",
    jquery: "../ext/jquery/dist/jquery",
    requirejs: "../ext/requirejs/require",
    underscore: "../ext/underscore/underscore",
    jasmine: "../ext/jasmine/lib/jasmine-core/jasmine",
    'jasmine-html': '../ext/jasmine/lib/jasmine-core/jasmine-html',
    'boot': '../ext/jasmine/lib/jasmine-core/boot',
    sinon: "../ext/sinon/lib/sinon",
    "jasmine-sinon": "../ext/jasmine-sinon/lib/jasmine-sinon"
  },
});
