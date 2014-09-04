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
        initialize: function(opts) {
            if (!_.isUndefined(this.get('content'))) {
                this.setWordCount();
            }
        },
        setWordCount: function() {
            this.set('wordCount', this.get('content').split(' ').length);
        }
    });

    return Item;
});
