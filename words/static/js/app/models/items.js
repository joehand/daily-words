/* ========================================================================
 * Items Collection
 * Author: JoeHand
 * ========================================================================
 */

define([
    'backbone',
    'underscore',
    'models/item',
], function (Backbone, _, Item) {

    var Items = Backbone.Collection.extend({
        model : Item,
        initialize: function(models, opts) {
            this.url = opts.url;
        }
    });

    return Items;
});
