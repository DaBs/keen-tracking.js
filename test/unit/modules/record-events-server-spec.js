var chai = require('chai'),
    expect = require('chai').expect,
    spies = require('chai-spies');

chai.use(spies);

var Keen = require('../../../lib/server');
var config = require('../helpers/client-config');

// Keen.debug = true;

describe('.recordEvent(s) methods (server)', function() {

  beforeEach(function(){
    this.client = new Keen({
      projectId: config.projectId,
      writeKey: config.writeKey
    });
  });

  // afterEach(function(){});

  describe('.recordEvent()', function() {

    it('should make an HTTP request',function(done){
      this.client.recordEvent( config.collection, config.properties, function(err, res) {
        expect(err).to.be.null;
        expect(res).to.deep.equal( JSON.parse(config.responses.success) );
        done();
      });
    });

    it('should not make an HTTP request if Keen.enabled is set to \'false\'', function(done){
      Keen.enabled = false;
      this.client.recordEvent( config.collection, config.properties, function(err, res){
        expect(err).to.exist;
        expect(res).to.not.exist;
        done();
      });
      Keen.enabled = true;
    });

    it('should return an error message if event collection is omitted', function(done){
      this.client.recordEvent( null, config.properties, function(err, res){
        expect(err).to.exist;
        expect(res).to.not.exist;
        done();
      });
    });

  });

  describe('.recordEvents()', function() {

    beforeEach(function() {
      this.batchData = {
        'pageview': [
          { page: 'this one' },
          { page: 'same!' }
        ],
        'click': [
          { page: 'tada!' },
          { page: 'same again' }
        ]
      };
      this.batchResponse = {
        click: [
          { 'success': true },
          { 'success': true }
        ],
        pageview: [
          { 'success': true },
          { 'success': true }
        ]
      };
    });

    it('should make an HTTP request',function(done){
      var self = this;
      self.client.recordEvents( self.batchData, function(err, res) {
        expect(err).to.be.null;
        expect(res).to.deep.equal( self.batchResponse );
        done();
      });
    });

    it('should not send events if Keen.enabled is set to \'false\'', function(){
      Keen.enabled = false;
      this.client.recordEvents(this.batchData, function(err, res){
        expect(err).to.exist;
        expect(res).to.be.null;
      });
      Keen.enabled = true;
    });

    it('should return an error message if first argument is not an object', function(){
      this.client.recordEvents([], function(err, res){
        expect(err).to.exist;
        expect(res).to.be.null;
      });
    });

  });

});
