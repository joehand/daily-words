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

    var ItemView = Backbone.View.extend({

        el: "#writr-item",

        /* Bindings for Backbone.StickIt. Binds Model to Element for two way sync*/
        bindings: {
            '.item-content' : {
                observe: 'content',
                updateView: false,
            },
            '.item-dirty' : {
                observe: 'dirty',
                update: function($el, val, model, options) {
                    // debounce so we don't flash saved/unsaved
                    var update = _.debounce(function(){
                        if (model.get('dirty') === true) {
                            $el.addClass('dirty');
                            $el.text('Unsaved');
                        } else {
                            $el.removeClass('dirty');
                            $el.text('Saved');
                        }
                    }, 100);
                    update();
                }
            },
            '.item-word-count' : {
                observe: 'word_count',
                updateView: true,
            }
        },

        events: {
            'keydown .item-content' : '_contentKeydown',
        },

        _contentKeydown: function(e) {
            this.scrollBottom();
            if (e.keyCode == 13) {
                //enter key
                e.preventDefault();
                this.insertBreakTags();
                return false;
            } else if ((e.ctrlKey || e.metaKey) && e.which == 83) {
                //cmd/ctrl + s (save)
                e.preventDefault();
                this.forceSave();
                return false;
            }
            return true;
        },

        initialize: function(opts) {
            this.id = this.$el.data('id');
            this.$inputEl = this.$el.find('.item-content');
            this.model = this.collection.get(this.id);

            this.listenTo(this.model, 'change:content', this.contentChanged);
            this.render();
        },

        render: function() {
            console.log(this);
            this.stickit();
            this.$inputEl.focus();
            return this;
        },

        contentChanged: function() {
            //console.log('model changed');
        },

        forceSave: function() {
            this.model.doSave();
        },

        insertBreakTags: function() {
            // inserts break tags instead of divs or other weird things in contenteditable
            document.execCommand('insertHTML', false, '<br><br>');
        },

        scrollBottom: function() {
            // Keeps scroll at bottom, typewriter effect
            // http://stackoverflow.com/questions/7451468/contenteditable-div-how-can-i-determine-if-the-cursor-is-at-the-start-or-end-o/7478420#7478420
            var el = this.$inputEl[0],
                atEnd = false,
                selRange, testRange;

            if (window.getSelection) {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    selRange = sel.getRangeAt(0);
                    testRange = selRange.cloneRange();

                    testRange.selectNodeContents(el);
                    testRange.setStart(selRange.endContainer, selRange.endOffset);
                    atEnd = (testRange.toString() == "");
                }
            }

            if (atEnd === true) {
                $(document).scrollTop($(document).height());
            }
        },
    });

    return ItemView;
});
