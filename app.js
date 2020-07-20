var elwire = require("./elworado/elwire");
var splash = require("./splash");
var moment = require("moment");
var soundPlayer = require("./elworado/soundPlayer");
var fullscreen = require("./elworado/fullscreen");
require("./elworado/domhelper");
require("./elworado/httphelper");
var widgets = require("./elworado/elwidget");
widgets.registerStdWidgets();

window.app = new elwire.ElApp.install(function(scope)
{
   fullscreen.on();
   scope.setupVisible = false;
   scope.setup = 
   {
       theme:"beep",
       doSounds: true
   }
    splash.showSplash(false);
   
    
   var zerot = null;
   
   checkZerot();
   function checkZerot()
   {
       var storageitem = localStorage.getItem("zerot");
       if(storageitem  == null)
       {
        zerot = moment().add(1,'minute');
        localStorage.setItem("zerot",zerot.toISOString());
       }
       else
        zerot = moment(storageitem);
     
   }
   scope.checkTheme = function()
   {
        var storageitem = localStorage.getItem("theme");
        if(scope.theme == null)
            if(storageitem  == null)
            {              
                scope.theme =   
                    {"name":"beep","value":"beep",
                        "data":
                        {
                            "beep":"theme/beep/beep.ogg",
                            "short":"theme/beep/short.mp3"
                        }
                    }          
            }
            else
                scope.theme = JSON.parse(storageitem);
        localStorage.setItem("theme",JSON.stringify(scope.theme,null,2));
   }

   scope.checkTheme();

    var secsCounter = -60;
    function timeChange()
    {
        var now = moment();
        var duration = moment.duration(now.diff(zerot));
        secsCounter = Math.round(duration.asSeconds());
    
    
      
        var secs = Math.abs(secsCounter%60);
        var minCounter = Math.trunc(secsCounter/60);
        var neg = secsCounter<0;
        var mins = Math.abs(minCounter);
        scope.mins = neg ? (-mins-1):mins;
        scope.time = (neg ? "-":"")+(mins)+":"+(("00" + secs).slice(-2));
        if(scope.setup.doSounds)
        {
            if(secs == 0)
                soundPlayer.play(scope.theme.data.beep,3);
            else if((!neg && secs > 56) || (neg && secs < 4))
                soundPlayer.play(scope.theme.data.short);          
        }
        scope.clock.elbind.bind();
    }
    scope.toggleInterval = function()
    {
        if(scope.interval)
            scope.cancelInterval();
        else
            scope.runInterval();
    }
    scope.resetInterval = function()
    {
        zerot = null;
        localStorage.removeItem("zerot");
        checkZerot();
        scope.elbind.bind();
    }
    scope.runInterval = function()
    {
        if(scope.interval)
            return;
         scope.interval = window.setInterval(timeChange,1000);
    }
    scope.cancelInterval = function()
    {
        if(!scope.interval)
            return;
        window.clearInterval(scope.interval);
        scope.interval = null;
    }
    scope.toggleSetup = function()
    {
        scope.setupVisible = !scope.setupVisible
        scope.elbind.bind();
    }
    scope.bindTheme = function(val,item)
    {
        if(val != null)
        {
            scope.theme = item;
            scope.checkTheme();
        }
        return scope.theme.value;        
            
    }
    scope.bindZerot = function(val,el)
    {
        if(val === undefined)
        {
            return zerot.format("YYYY-MM-DDTHH:mm:ss");
        }
        else
        {
            zerot = moment(val);
            localStorage.setItem("zerot",zerot.toISOString());
            scope.clock.bind();
        }
    }
    scope.runInterval();
});

