/* ========================================================================
 * AppModel
 * Author: JoeHand
 * ========================================================================
 */

define([
    'backbone',
    'underscore'
], function (Backbone, _) {

    var App = Backbone.Model.extend({

        defaults: {
            'dirty' : false,
        },

        initialize: function(opt) {

        },
    });

    return App;
});
