/* ========================================================================
 * ItemView for Writr
 * Author: JoeHand
 * ========================================================================
 */

define([
    'backbone',
    'underscore',
    'jquery',
], function (Backbone, _, $) {

    var RATE_LIMIT_CHARS = 50,
        RATE_LIMIT_TIME = 5000;

    var ItemView = Backbone.View.extend({

        el: "#writr-item",

        /* Bindings for Backbone.StickIt. Binds Model to Element for two way sync*/
        bindings: {
            '.item-content' : {
                observe: 'content',
                updateView: false,
                updateModel: '_rateLimiter'
            },
        },

        _rateLimiter: function(val, event, opts) {
            var charsLimit = false, timeLimit = false,
                contentLen = this.model.get('content').length || 0,
                lastUpdate = this.model.get('last_update');

            charsUpperLimit = contentLen + RATE_LIMIT_CHARS < val.length;
            charsLowerLimit = contentLen - RATE_LIMIT_CHARS > val.length;
            timeLimit = lastUpdate + RATE_LIMIT_TIME < event.timeStamp

            return charsUpperLimit || charsLowerLimit || timeLimit;
        },

        events: {

        },

        initialize: function(opts) {
            var id = this.$el.data('id');
            this.model = this.collection.get(id);
            if (this.$el.hasClass('writr-edit')) {
                this.adjustContentSize();
            }
            this.listenTo(this.model, 'change:content', this.changed);
            this.render();
        },

        render: function() {
            console.log(this);
            this.stickit();
            return this;
        },

        changed: function() {
            console.log('model changed');
            console.log(this.model);
        },

        adjustContentSize: function() {
            this.$el.height( this.$el[0].scrollHeight );
            if (this.$el[0].selectionStart == this.$el.val().length) {
                // keep scroll at bottom if we are there, typewriter effect
                $(document).scrollTop($(document).height());
            }
        },
    });

    return ItemView;
});
