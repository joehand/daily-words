/* ========================================================================
 * AppModel
 * Author: JoeHand
 * ========================================================================
 */

define([
    'backbone',
    'underscore'
], function (Backbone, _) {

    var SERVER_CHECK_DELAY = 1000,//initial wait between pinging server to see if it is up.
        SERVER_CHECK_DELAY_MULT = 2, // multiplier for above between each check.
        SERVER_CHECK_DELAY_MAX = 60000; // max time to wait between checks

    var App = Backbone.Model.extend({

        defaults: {
            'dirty' : false,
            'offline': false,
        },

        initialize: function(opt) {
            this.on('change:offline', this.checkServer, this);
        },

        checkServer: function() {
            if (!this.get('offline')) {
                // Don't run if we are back online
                return;
            }

            $.ajax({
                context: this,
                type: 'GET',
                success: function() {
                    console.info('Server Connected');
                    this.set('offline', false);
                },
                error: function() {
                    console.info('Server Not Connected, Trying Again in: ', SERVER_CHECK_DELAY/1000, ' s');
                    this.set('server_check_delay', SERVER_CHECK_DELAY);

                    // https://github.com/jashkenas/underscore/issues/494
                    _(function() {
                        this.checkServer();
                    }).chain().bind(this).delay(SERVER_CHECK_DELAY);

                    if (SERVER_CHECK_DELAY <= SERVER_CHECK_DELAY_MAX) {
                        SERVER_CHECK_DELAY = SERVER_CHECK_DELAY_MULT * SERVER_CHECK_DELAY;
                    } else {
                        SERVER_CHECK_DELAY = SERVER_CHECK_DELAY_MAX;    
                    }
                }
            });
        }
    });

    return App;
});
