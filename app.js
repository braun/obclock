var elwire = require("./elworado/elwire");
var splash = require("./splash");

window.app = new elwire.ElApp(function(scope)
{
   
    splash.showSplash(false);
});

