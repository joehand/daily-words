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

    var OFFLINE_MESSAGE = "Offline!",
        ONLINE_MESSAGE = 'App Online. Write Away!',
        ONLINE_MESSAGE_FADE = 5000, // ms to show online message
        WINDOW_CLOSE_MESSAGE = "========================= \
                                Content not saved! Please save before leaving. \
                                =========================";

    var AppView = Backbone.View.extend({

        /* Bindings for Backbone.StickIt. Binds Model to Element for sync*/
        bindings: {
            '.app-offline' : {
                observe: 'offline',
                update: function($el, val, model, options) {
                    if (model.get('offline') === true) {
                        $el.addClass('offline')
                            .text(OFFLINE_MESSAGE)
                            .fadeIn('slow');
                    } else {
                        $el.text(ONLINE_MESSAGE)
                            .fadeOut(ONLINE_MESSAGE_FADE)
                            .removeClass('offline');
                    }
                }
            },
        },

        events: {

        },

        initialize: function(opts) {
            var self = this;
            this.listenTo(this.collection, 'change:dirty', this.setDirty);
            this.listenTo(this.collection, 'change:local_save', this.offlineSave);
            this.listenTo(this.collection, 'sync', this.collectionSync);

            this.listenTo(this.model, 'change:offline', this.checkServer)

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
            this.stickit();
            return this;
        },

        setDirty: function(model, val, opts) {
            //console.log('dirty collection');
            this.model.set('dirty', model.get('dirty'))
        },

        offlineSave: function(model, val, opts) {
            console.log('offline save');
            this.model.set('offline', model.get('local_save'))
        },

        collectionSync: function() {
            //console.log('sync collection');
        },

        checkServer: function() {
            if (!this.model.get('offline')) {
                this.collection.syncDirtyAndDestroyed();
            }
        }

    });

    return AppView;
});
