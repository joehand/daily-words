describe("App Model :: ", function() {
    var AppModel,
        app,
        fakeUser = {'email':'test@test.com', 'id':'1'};

    beforeEach(function(done) {
        require(['models/app'], function(_AppModel) {
            AppModel = _AppModel;
            done();
        });
    });

    describe('when instantiated', function() {

        beforeEach(function() {
            app = new AppModel({'user':fakeUser})
        });

        it("should exhibit attributes", function() {
            expect(app.get('user')).toEqual(fakeUser);
        });

        it("should set defaults", function() {
            expect(app.get('contentDirty')).toEqual(false);
        });

    });

});