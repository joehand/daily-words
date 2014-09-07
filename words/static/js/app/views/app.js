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
            this.listenTo(this.collection, 'change:dirty', this.setDirty);
            this.listenTo(this.collection, 'change:local_save', this.offlineSave);
            this.listenTo(this.collection, 'sync', this.collectionSync);

            this.listenTo(this.model, 'change:offline', this.checkOnline)

            if (opts.childView != null) {
                /* Require our child views for specific page */
                require(['views/' + opts.childView], function (View) {
                    self.childView = new View({
                        collection: self.collection,
                    });
                    self.render();
                });
            } else {
                this.render();
            }
        },

        render: function() {
            console.log(this);
            return this;
        },

        setDirty: function(model, val, opts) {
            console.log('dirty collection');
            this.model.set('dirty', model.get('dirty'))
        },

        offlineSave: function(model, val, opts) {
            console.log('offline save');
            this.model.set('offline', model.get('local_save'))
        },

        collectionSync: function() {
            console.log('sync collection');
        },

        checkOnline: function() {
            if (!this.model.get('offline')) {
                this.collection.syncDirtyAndDestroyed();
            }
        }

    });

    return AppView;
});
