// here's import function

var imported = {};


function import_class(url, namespace) {

    function fetch_js (url)
    {
        var recieved_text= "null;";
        //maybe we should restrain the list url possible, or the format of url (for sake of security)

        function reqListener () {
          recieved_text = this.responseText;
           //console.log(recieved_text);
        }

        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.open("get", url, false);
        oReq.send();
        return recieved_text;

    }

    function extend_object(object1, object2)
    {
        for(var key in object2)
        {
            object1[key] = object2[key]
        }
        return object1
    }

    if (!(url in imported)) {
        // fetch content of the URL, should be synchronized
        content = fetch_js(url);
        //console.log('the content:', content)
        eval('var __s__ = ' + content); // __s__ has content execution results now
        //console.log('in namespace', __s__);
        if (namespace) {
            if (!(namespace in window)) {
                window[namespace] = {};
            }
            // extend as in python
            extend_object( window[namespace], __s__);
            //console.log(window[namespace]);
        }
        imported[url] = __s__;
    }
    return imported[url]
}

/*
// /ui/button.js
(function () {
    var button = function () {
    };
    
    var label = function () {
    };
    
    return {button: button, label: label};
})();

// alternate ui/button.js
(function () {
    var __bt__ = this
    var __bt__.trucMuche;
    __bt__.button = function () {
    };
    
    __bt__.label = function () {
    };
    
    return __bt__;
})();


// here's how you use it
import('/ui/button.js', 'UI');

var btn = new UI.button();
var lbl = new UI.label();


// you can also do like this

// /ui/console.js
(function(){
    var console = function () {
        // ...
    };
    
    return console;
})();

// use it
var Console = import('/ui/console.js');
var myconsole = new Console();
*/
