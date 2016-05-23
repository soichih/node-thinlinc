* isInstalled

Returns cb(null, true) if thinlinc is installed.

```
thinlinc.isInstalled(function(err, installed) {
    if(err) throw err;
    if(installed) console.log("installed");
    else console.log("not installed");
});
```

* getConfig

Get configuration parameter for ThinLinc

```
thinlinc.getConfig("AUTHENTICATION_METHOD", function(err, value) {
    if(err) throw err;
    console.log(value);
});
```
