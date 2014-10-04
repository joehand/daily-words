/* ========================================================================
 * Item Model
 * Author: JoeHand
 * ========================================================================
 */

define([
    'backbone',
    'underscore'
], function (Backbone, _) {

    var SAVE_DELAY = 1500,
        FORCE_SAVE_TIME = 5000,//Force a save after this duration regardless of typing
        FORCE_SAVE_CHARS = 100; //Force a save after this content change regardless of typing

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

            var last_save = this.get('last_save');
            if (!_.isUndefined(last_save)){
                var time_diff = new Date().getTime() - last_save['time'],
                    char_diff =  Math.abs(this.get('content').length - last_save['length']);
                if (time_diff > FORCE_SAVE_TIME || char_diff > FORCE_SAVE_CHARS) {
                    //console.log('doing force save');
                    this.doSave();
                }
            } else {
                last_save = {
                    'time':new Date().getTime(),
                    'length':this.get('content').length
                }
                this.set('last_save', last_save);
            }
        },

        checkSave: _.debounce(function() {
            /*Check if we should save based on SAVE_DELAY timeout
              Make sure model is dirty before we save
            */
            if (this.get('dirty') == true) {
                this.doSave();
            }
        }, SAVE_DELAY),

        doSave: _.throttle(function() {
            /*Saves model to server after updating words typed array
            */
            this.updateWordsTyped(true);
            this.save(null, {
                success: function(model, resp, opts) {
                    model.set('dirty', false);
                    if (opts.dirty) {
                        // saved locally
                        model.set('local_save', true);
                        console.info('Data saved locally');
                    } else {
                        // saved remotely
                        last_save = {
                            'time':new Date().getTime(),
                            'length':model.get('content').length
                        }
                        model.set('last_save', last_save);
                        console.log('server save success');
                    }
                },
                error: function(val, resp, opts)  {
                    // TODO
                    console.error('server error');
                }
            });
        }, 100),

        setWordCount: function() {
            var regex = /\s+/gi,
                wordRegex = /[\w]+/,
                words = this.get('content').trim()
                        .replace(/<br\s*[\/]?>/gi, '\n').replace(/&nbsp;/g, ' ') // replace pesky things
                        .replace(/[^a-zA-Z0-9\s]/g, '') // replace pesky things
                        .replace(regex, ' ').split(' ');
                len = _.filter(words, function(word){ return word.match(wordRegex) }).length;
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
