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
            'contentDirty' : false,
        },

        initialize: function(opt) {
            var user = opt.user;
        }
    });

    return App;
});
