/* ========================================================================
 * AppView file
 * Author: JoeHand
 * ========================================================================
 */

define([
    'backbone',
    'underscore',
    'jquery',
], function (Backbone, _, $) {

    var AppView = Backbone.View.extend({

        events: {

        },

        initialize: function(opts) {
            var self = this;

            if (opts.childView != null) {
                /* Require our child views for specific page */
                require(['views/' + opts.childView], function (View) {
                    self.childView = new View({
                        collection: self.collection,
                    });
                    self.render();
                });
            } else {
                self.render();
            }
        },

        render: function() {
            console.log(this);
            return this;
        },

    });

    return AppView;
});
