describe("Item Model :: ", function() {
    var ItemModel;

    beforeEach(function(done) {
        require(['models/items', 'models/item'], function(_ItemsCollection,_ItemModel) {
            ItemModel = _ItemModel;
            this.ItemsCollection = _ItemsCollection;
            done();
        });
    });

    describe('when instantiated : ', function() {
        beforeEach(function() {
            this.item = new ItemModel({
                    'content':'Coffee is delicious',
                });
        });

        it("should exhibit attributes", function() {
            expect(this.item.get('content'))
                .toEqual('Coffee is delicious');
        });

        it("should generate a word count", function() {
            expect(this.item.get('word_count'))
                .toEqual(3);
        });

        it("should generate a last update time", function() {
            expect(this.item.get('last_update')/100)
                .toBeCloseTo(new Date().getTime()/100, 0);
        });

        it("should create a words typed array", function() {
            expect(this.item.get('typing_speed').length)
                .toEqual(1);
            expect(this.item.get('typing_speed')[0]['word_delta'])
                .toEqual(3)
            expect(this.item.get('typing_speed')[0]['time_delta']/100)
                .toBeCloseTo(0, 0)
        });

        describe("url", function() {
          beforeEach(function() {
            var collection = {
              url: "/api/"
            };
            this.item.collection = collection;
          });

          describe("when no id is set", function() {
            it("should return the collection URL", function() {
              expect(this.item.url()).toEqual("/api/");
            });
          });

          describe("when id is set", function() {
            it("should return the collection URL and id", function() {
              this.item.set('_id', 1);
              expect(this.item.url()).toEqual("/api/1");
            });
          });
        });
    }); // describe when instantiated


    describe('when changed : ', function() {
        beforeEach(function() {
            this.item = new ItemModel({
                    '_id':123,
                    'content':'Coffee is delicious',
                });
        });

        it("should set dirty to true", function() {
            this.item
                .set('content', 'Okay dokey!');
            expect(this.item.get('dirty'))
                .toBeTruthy();
        });

        it("should update the word count", function() {
            this.item
                .set('content', 'Coffee is really really delicious!');
            expect(this.item.get('word_count'))
                .toEqual(5);
        });

        it("should change last update time", function() {
            this.item.set('content', 'Bleep Bloop');
            expect(this.item.get('last_update')/100)
                .toBeCloseTo(new Date().getTime()/100, 0);
        });

        it("should call check save function", function() {
            console.log(this.item);
            var spy = sinon.spy(this.item, 'checkSave');
            this.item
                .set('content', 'Walk as if you are kissing the Earth with your feet.');
            expect(spy.calledOnce).toBeTruthy();
        });

        describe('after a delay ', function() {
            // TODO: How do I get this to work?

            xit("should save to server", function() {

            });

            xit("should add to typing speed array", function() {
                this.item
                    .set('content', 'Coffee is delicious, I think.');

                var time_delta = new Date().getTime() - this.item.previous('last_update');

                console.log(this.item.get('typing_speed'));

                expect(this.item.get('typing_speed').length)
                    .toEqual(2);
                expect(this.item.get('typing_speed')[1])
                    .toEqual({
                        'word_delta' : 2,
                        'time_delta' : time_delta,
                    });
            });
        }); // describe after delay

        describe('when offline ', function() {
            // TODO: How do I get this to work?

            xit("should save locally", function() {

            });

            xit("should add offline attribute", function() {

            });

        }); // describe when offline

    }); // describe when changed


    describe("API interaction : ", function() {
        beforeEach(function() {
            this.server = sinon.fakeServer.create();
            this.item = new ItemModel({_id:123});
            this.item.urlRoot = '/api' // no collection to use URL base from
        });

        afterEach(function() {
            this.server.restore();
        });

        it("should fire the change event on GET", function() {
            var callback = sinon.spy();

            // Set how the fake server will respond
            this.server.respondWith("GET", "/api/123",
              [200, {"Content-Type": "application/json"},
              '{"id":123,"content":"Sunshine is oh so nice!"}']);

            // Bind to the change event on the model
            this.item.bind('change', callback);

            // makes an ajax request to the server
            this.item.fetch();

            // Fake server responds to the request
            this.server.respond();

            // Expect that the spy was called with the new model
            expect(callback.called).toBeTruthy();
            expect(callback.getCall(0).args[0].attributes)
                .toEqual(jasmine.objectContaining({
                    id: 123,
                    content: "Sunshine is oh so nice!"
                }));
        });

        it("should make the correct server request when saved", function() {
            // Spy on jQuery's ajax method
            var spy = sinon.spy(jQuery, 'ajax');

            this.item.set('content', 'mmm chocolate');
            // Save the model
            this.item.save();

            // Spy was called
            expect(spy).toHaveBeenCalled();
            // Check url property of first argument
            expect(spy.getCall(0).args[0].url)
                .toEqual("/api/123");

            // Restore jQuery.ajax to normal
            jQuery.ajax.restore();
        });

    }); // describe API interaction
});


describe("Item Collection :: ", function() {
    var Items;

    beforeEach(function(done) {
        require(['models/items', 'models/item'], function(_ItemsCollection,_ItemModel) {
            Items = _ItemsCollection;
            this.Item = _ItemModel;
            done();
        });
    });

    describe('when instantiated : ', function() {
        beforeEach(function() {
            this.itemStub = sinon.stub(window, 'Item');
            this.model = new Backbone.Model({
              id: 5,
              content: "Drink coffee with butter"
            });
            this.itemStub.returns(this.model);
            this.items = new Items([],{'url':'/api'});
            this.items.model = Item; // reset model relationship to use stub
            this.items.add({
              id: 5,
              title: "Foo"
            });
         });

        afterEach(function() {
            this.itemStub.restore();
        });

        it("should add a model", function() {
            expect(this.items.length).toEqual(1);
        });

        it("should find a model by id", function() {
            expect(this.items.get(5).get("id")).toEqual(5);
        });

    });
});
