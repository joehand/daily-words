describe("Item Model :: ", function() {
    var ItemModel;

    beforeEach(function(done) {
        require(['models/item'], function(_ItemModel) {
            ItemModel = _ItemModel;
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
            expect(this.item.get('content')).toEqual('Coffee is delicious');
        });

        it("should generate a word count", function() {
            expect(this.item.get('wordCount')).toEqual(3);
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
              this.item.set('id', 1);
              expect(this.item.url()).toEqual("/api/1");
            });
          });
        });

    });
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
