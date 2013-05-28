/************************************************************************
 * This module is used to simulate the behavior of classes in Javascript
 * @authors Fabien Gelibert
 * @created February 2013
 ***********************************************************************/

(function () {

    this.imported = {};
    this.importing = {};

    this.import_class = function (url, namespace) {

        function fetch_js(url) {
            var recieved_text = "null;";
            //maybe we should restrain the list url possible, or the format of 
            //url (for sake of security)

            function reqListener() {
                recieved_text = this.responseText;
            }

            var oReq = new XMLHttpRequest();
            oReq.onload = reqListener;
            oReq.open("get", url, false);
            oReq.send();
            return recieved_text;
        }

        function extend_object(object1, object2) {
            for (var key in object2) {
                object1[key] = object2[key]
            }
            return object1
        }

        if (!(url in imported) && !(url in importing)) {
            importing[url] = "processing";
            // fetch content of the URL, should be synchronized
            content = fetch_js(url);
            eval('var __s__ = ' + content); 
            // __s__ has content execution results now
            if (namespace) {
                if (!(namespace in window)) {
                    window[namespace] = {};
                }
                // extend as in python
                extend_object(window[namespace], __s__);
            }
            imported[url] = __s__;
            importing["url"] = "done";
        }
        
        return imported[url]
    }
})();
