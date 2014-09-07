/* ========================================================================
 * Item Model
 * Author: JoeHand
 * ========================================================================
 */

define([
    'backbone',
    'underscore'
], function (Backbone, _) {

    var SAVE_DELAY = 5000;

    var Item = Backbone.Model.extend({

        idAttribute: '_id', //MongoDB ID attr

        defaults: {
            'last_update': new Date().getTime(),
            'word_count': 0,
            'content' : '',
            'dirty' : false,
        },

        initialize: function(opts) {
            if (!_.isUndefined(this.get('last_update'))) {
                // need to make sure this is JS timestamp
                var date = new Date(this.get('last_update'));
                this.set('last_update', date.getTime())
            }
            if (this.get('content') !== '') {
                this.setWordCount();
            }

            this.updateWordsTyped(false); // adds time for break from last update
            this.set('last_update', new Date().getTime());

            // watch for changes; fired by StickIt binding.
            this.on('change:content', this.onContentChange, this);
        },

        onContentChange: function() {
            this.set('dirty', true);
            this.setWordCount();
            this.updateTime();

            this.checkSave();
        },

        checkSave: _.debounce(function() {
            /*Saves model to server after time duration
              Check if it is dirty b/c doSave() can be run directly
            */
            if (this.get('dirty') == true) {
                this.doSave();
            }
        }, SAVE_DELAY),

        doSave: function() {
            /*Saves model to server
            */
            this.updateWordsTyped(true);
            this.save(null, {
                success: function(model, resp, opts) {
                    model.set('dirty', false);
                    console.log('server save success');
                },
                error: function(val, resp, opts)  {
                    // TODO
                    console.log('server error');
                }
            });
        },

        setWordCount: function() {
            var regex = /\s+/gi,
                len = this.get('content').trim()
                        .replace(regex, ' ').split(' ').length;
            this.set('word_count', len);
        },

        updateWordsTyped: function(previous) {
            /*Updates typing_speed array (previous = true when not new model)
              For each change event, record:
              - change in word count (could be negative)
              - change in time
            */
            var wordDelta = 0,
                timeDelta = new Date().getTime() - this.get('last_update'),
                typingSpeed = this.get('typing_speed') || [];

            if (previous === true) {
                wordDelta = this.get('word_count') - this.previous('word_count');
                timeDelta = this.get('last_update') - this.previous('last_update');
            } else {
                if (typingSpeed.length === 0) {
                    wordDelta = this.get('word_count');
                }
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
