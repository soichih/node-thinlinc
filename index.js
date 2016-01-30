
//node
var fs = require('fs');

//contrib
var Winreg = require('winreg');

exports.isInstalled = function(cb) {
    switch(process.platform) {
    case "win32":
        //try getting one of the key from thinlinc registry
        exports.getConfig("AUTHENTICATION_METHOD", function(err, value) {
            if(err) return cb(null, false);
            cb(null, true);
        });
        break;
    case "darwin":
        //TODO..
        break;
    case "linux":
        //fs.stat(process.env.HOME+"/.thinlinc/tlclient.conf", function(err, stats) {
        fs.stat("/opt/thinlinc/bin/tlclient", function(err, stats) {
            //console.dir(err);
            //console.dir(stats);
            if(err) return cb(null, false);
            cb(null, true);
        });
        break;
    case "default":
        cb(new Error("unsupported os"));
    }
}

var config_cache = null;
function getConfig(cb) {
    if(config_cache) return cb(null, config_cache);
    switch(process.platform) {
    case "win32":
        cb(new Error("nothing to cache for accessing registry"));
        break;
    case "darwin":
        //TODO..
        break;
    case "linux":
        fs.readFile(process.env.HOME+"/.thinlinc/tlclient.conf", {encoding: 'utf8'}, function(err, text) {
            if(err) return cb(err);
            config_cache = {};
            text.split("\n").forEach(function(line) {
                var tokens = line.split("=");
                config_cache[tokens[0]] = tokens[1]; 
            });
            cb(null, config_cache);
        });
        break;
    case "default":
        cb(new Error("unsupported os"));
    }
}

exports.getConfig = function(key, cb) {
    switch(process.platform) {
    case "win32":
        var tlclient = new Winreg({hive: Winreg.HKCU, key: '\\Software\\Cendio\\ThinLinc\\tlclient'});
        tlclient.get(key, function(err, item) { 
            if(err) return cb(err);
            cb(null, item.value);
        });
        break;
    case "darwin":
        //TODO..
        break;
    case "linux":
        getConfig(function(err, config) {
            if(err) return cb(err);
            cb(null, config[key]);
        });
        break;
    case "default":
        cb(new Error("unsupported os"));
    }
     
};
