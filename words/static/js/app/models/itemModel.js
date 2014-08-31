/* ========================================================================
 * Item Model and Collection
 * Author: JoeHand
 * ========================================================================
 */

define([
    'backbone',
    'underscore'
], function (Backbone, _) {

    var Item = Backbone.Model.extend({
        initialize: function(opts) {
            this.url = this.collection.url + this.id;
        },
    });

    var Items = Backbone.Collection.extend({
        model : Item,
        initialize: function(models, opts) {
            this.url = opts.url;
        }
    });

    return Items;
});
