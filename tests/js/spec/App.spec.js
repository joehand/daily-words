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
            expect(app.get('dirty')).toEqual(false);
        });

    });

    describe('when children models are changed', function() {

        beforeEach(function() {
            app = new AppModel({'user':fakeUser})
            // TODO: add a collection w/ model here
        });

        xit("should update dirty", function() {
            expect(app.get('dirty')).toEqual(true);
        });

    });


    describe('when app goes offline', function() {

        beforeEach(function() {
            //TODO: make fake server & go offline
            app.set('offline', true);
        });

        xit("should change offline attribute", function() {
            expect(app.get('offline')).toEqual(true);
        });

        xit("should start checking for connection", function() {

        });

        describe('when reconnected to server', function() {

            beforeEach(function() {
                //TODO: reconnect to server
            });

            xit("should change offline attribute", function() {
                expect(app.get('offline')).toEqual(false);
            });
        });
    });

});
