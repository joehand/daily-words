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
        RATE_LIMIT_TIME = 2000;

    var ItemView = Backbone.View.extend({

        el: "#writr-item",

        /* Bindings for Backbone.StickIt. Binds Model to Element for two way sync*/
        bindings: {
            '.item-content' : {
                observe: 'content',
                updateView: false,
                updateModel: '_rateLimiter'
            },
            '.item-dirty' : 'dirty',
            '.item-word-count' : 'word_count',

        },

        _rateLimiter: function(val, e, opts) {
            /*Limits rate of model change events
              Limiters:
              - Model not dirty but new content
              - Time (RATE_LIMIT_TIME)
              - Characters added/removed (RATE_LIMIT_CHARS)
              - Newline character/Space

              Returns True/False whether to update model
            */
            if (!this.model.get('dirty')) {
                // update right away if we are just starting, sets dirty=True
                return true;
            }

            if (val !== '' &&
                        !_.isNull(val[val.length-1].match(/[\n\r\s]/g))) {
                // Match newline or space character to adjust input size & wordcount
                // TODO: This also matches any change if old newline is at bottom
                return true;
            }

            var charsLimit = false, timeLimit = false,
                contentLen = this.model.get('content').length || 0,
                lastUpdate = this.model.get('last_update');

            charsUpperLimit = contentLen + RATE_LIMIT_CHARS < val.length;
            charsLowerLimit = contentLen - RATE_LIMIT_CHARS > val.length;
            timeLimit = lastUpdate + RATE_LIMIT_TIME < e.timeStamp

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
