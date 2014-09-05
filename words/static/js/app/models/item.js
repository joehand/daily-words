/* ========================================================================
 * Item Model
 * Author: JoeHand
 * ========================================================================
 */

define([
    'backbone',
    'underscore'
], function (Backbone, _) {

    var Item = Backbone.Model.extend({

        defaults: {
            'last_update': new Date().getTime(),
            'word_count': 0,
        },

        initialize: function(opts) {
            if (!_.isUndefined(this.get('content'))) {
                this.setWordCount();
                this.updateWordsTyped(false);
            }
            this.on('change:content', this.onContentChange, this);
        },

        onContentChange: function() {
            this.setWordCount();
            this.updateTime();
            this.updateWordsTyped(true);
        },

        setWordCount: function() {
            this.set('word_count', this.get('content').split(' ').length);
        },

        updateWordsTyped: function(previous) {
            /*Updates typing_speed array (previous = true when not new model)
              For each change event, record:
              - change in word count (could be negative)
              - change in time
            */
            var wordDelta = this.get('word_count') || 0,
                timeDelta = 0,
                typingSpeed = this.get('typing_speed') || [];

            if (previous === true) {
                wordDelta = this.get('word_count') - this.previous('word_count');
                timeDelta = this.get('last_update') - this.previous('last_update');
            }

            typingSpeed.push({
                        'word_delta': wordDelta,
                        'time_delta':timeDelta,
                    });

            this.set('typing_speed', typingSpeed);
        },

        updateTime: function() {
            this.set('last_update', new Date().getTime());
        },
    });

    return Item;
});
