
//node
var fs = require('fs');

//contrib
var Winreg = require('winreg');

//doing this won't hurt other OSes
var winreg = new Winreg({hive: Winreg.HKCU, key: '\\Software\\Cendio\\ThinLinc\\tlclient'});

function homedir() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

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
function _loadConfig(cb) {
    if(config_cache) return cb(null, config_cache);
    switch(process.platform) {
    case "win32":
        cb(new error("nothing to cache for accessing registry"));
        break;
    case "darwin":
        //todo..
        break;
    case "linux":
        fs.readFile(homedir()+"/.thinlinc/tlclient.conf", {encoding: 'utf8'}, function(err, text) {
            if(err) return cb(err);
            config_cache = {};
            text.split("\n").forEach(function(line) {
                var pos = line.indexOf("=");
                var k = line.substr(0, pos);
                var v = line.substr(pos+1);
                if(k) config_cache[k] = v;
            });
            cb(null, config_cache);
        });
        break;
    case "default":
        cb(new error("unsupported os"));
    }
}
exports.invalidateCache = function() {
    config_cache = null;
}

function _saveConfig(config, cb) {
    switch(process.platform) {
    case "win32":
        cb(new error("nothing to cache for accessing registry"));
        break;
    case "darwin":
        //todo..
        break;
    case "linux":
        //construct key=value list
        var str = "";
        for(var k in config) {
            var v = config[k];
            str += k+"="+v+"\n";
        }
        fs.writeFile(homedir()+"/.thinlinc/tlclient.conf", str, cb);
        break;
    case "default":
        cb(new error("unsupported os"));
    }
}

exports.getConfig = function(key, cb) {
    switch(process.platform) {
    case "win32":
        winreg.get(key, function(err, item) { 
            if(err) return cb(err);
            cb(null, item.value);
        });
        break;
    case "darwin":
        //TODO..
        break;
    case "linux":
        _loadConfig(function(err, config) {
            if(err) return cb(err);
            cb(null, config[key]);
        });
        break;
    case "default":
        cb(new Error("unsupported os"));
    }
};

exports.setConfig = function(key, value, cb) {
    switch(process.platform) {
    case "win32":
        winreg.set(key, Winreg.REG_SZ, value, function(err) {
            if(err) return cb(err);
            cb(null);
        });
        break;
    case "darwin":
        //TODO..
        break;
    case "linux":
        _loadConfig(function(err, config) {
            if(err) return cb(err);
            config[key] = value;
            _saveConfig(config, cb);
        });
        break;
    case "default":
        cb(new Error("unsupported os"));
    }
     
};
