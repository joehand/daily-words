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

        _rateLimiter: function(val, e, opts) {
            /*Limits rate of model change events
              Limiters:
              - Time (RATE_LIMIT_TIME)
              - Characters added/removed (RATE_LIMIT_CHARS)
              - Newline character

              Returns True/False whether to update model
            */
            if (val !== '' &&
                        !_.isNull(val[val.length-1].match(/[\n\r]/g))) {
                // Match newline character to adjust input size
                return true;
            }

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
            this.id = this.$el.data('id');
            this.$inputEl = this.$el.find('.item-content');
            this.model = this.collection.get(this.id);

            if (this.$inputEl.hasClass('writr-edit')) {
                this.adjustContentSize();
            }
            this.listenTo(this.model, 'change:content', this.contentChanged);
            this.render();
        },

        render: function() {
            console.log(this);
            this.stickit();
            return this;
        },

        contentChanged: function() {
            console.log('model changed');
            //console.log(this.model);

            this.adjustContentSize();
        },

        adjustContentSize: function() {
            this.$inputEl.height( 0 );
            this.$inputEl.height( this.$inputEl[0].scrollHeight );
            if (this.$inputEl[0].selectionStart == this.$inputEl.val().length) {
                // keep scroll at bottom if we are there, typewriter effect
                $(document).scrollTop($(document).height());
            }
        },
    });

    return ItemView;
});
