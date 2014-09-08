describe("App View :: ", function() {
    var AppView;

    beforeEach(function(done) {
        require(['views/app'], function(_AppView) {
            AppView = _AppView;
            done();
        });
    });

    describe('something', function() {

        xit("should do things", function() {

        });

    });

});

describe("Item View :: ", function() {
    var ItemView;

    beforeEach(function(done) {
        require(['views/item'], function(_ItemView) {
            ItemView = _ItemView;
            done();
        });
    });

    describe('something', function() {

        xit("should do things", function() {

        });

    });

});
