/* ========================================================================
 * AppModel
 * Author: JoeHand
 * ========================================================================
 */

define([
    'backbone',
    'underscore'
], function (Backbone, _) {

    var ONLINE_CHECK_DELAY = 5000; //time to wait between pinging server to see if it is up.

    var App = Backbone.Model.extend({

        defaults: {
            'dirty' : false,
            'offline': false,
        },

        initialize: function(opt) {
            this.on('change:offline', this.checkOnline, this);
        },

        checkOnline: function() {
            var collection = this.collection;

            $.ajax({
                context: this,
                type: 'GET',
                success: function() {
                    console.info('Server Connected');
                    this.set('offline', false);
                },
                error: function() {
                    console.info('Server Not Connected, Trying Again');

                    // https://github.com/jashkenas/underscore/issues/494
                    _(function() {
                        this.checkOnline();
                    }).chain().bind(this).delay(ONLINE_CHECK_DELAY);
                }
            });
        }
    });

    return App;
});
