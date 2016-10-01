
//contrib
var assert = require('assert');
var chai = require('chai');

var expect = chai.expect;

var thinlinc = require('../index.js');

describe('#thinlinc', function () {
    /*
    it('isinstalled', function(done) {
        thinlinc.isInstalled(function(err, installed) {
            if(err) throw err;
            expect(installed).to.equal(true);
            done();
        });
    });
    */

    var v = Date.now().toString();
    it('setConfig', function(done) {
        thinlinc.setConfig("TEST", v, function(err, value) {
            if(err) throw err;
            thinlinc.invalidateCache();
            thinlinc.getConfig("TEST", function(err, value) {
                if(err) throw err;
                expect(value).to.equal(v);
                done();
            });
        });
    });
    it('getConfig', function(done) {
        thinlinc.getConfig("TEST", function(err, value) {
            if(err) throw err;
            expect(value).to.equal(v);
            done();
        });
    });
});
