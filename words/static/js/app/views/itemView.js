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

        /* Bindings for Backbone.StickIt. Binds Model to Element for two way sync */
        bindings: {

        },

        events: {

        },

        initialize: function(opts) {
            if (this.$el.hasClass('writr-edit')) {
                this.adjustContentSize();
            }

            this.render();
        },

        render: function() {
            this.stickit();
            console.log(this);
            return this;
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
