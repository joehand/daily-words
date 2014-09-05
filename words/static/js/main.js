/*! =======================================================================
 * Main JS
 * Author: JoeHand
 * ======================================================================== */

define([
    'backbone',
    'jquery',
    'underscore',
    'views/app',
    'models/app',
    'models/items',
    'backbone.stickit',
], function (Backbone, $, _, AppView, AppModel, Items) {

    var appView, appModel, itemsCol;

    appModel = new AppModel(NAMESPACE);

    itemsCol = new Items(NAMESPACE.itemsBootstrap, {url:NAMESPACE.apiURL});

    appView = new AppView({
        model      : appModel,
        collection : itemsCol,
        el         : $('.document').get(0),
        childView  : NAMESPACE.childView,
    });

});
