//pile de gestion d'Etat

var TP = TP || {};
(function () {


    var eventHandler = function () {

        var __g__ = this;

        var objectStore = new TP.Store();
        var nextGuid = 1;


        __g__.setMessAvailable = function (elem, type) {
            var data = objectStore.getData(elem);

            if (data.handlers[type] != null)
                data.handlers[type].available = true;
        }

        __g__.setMessNotAvailable = function (elem, type) {
            var data = objectStore.getData(elem);

            if (data.handlers[type] != null)
                data.handlers[type].available = false;
        }

        __g__.setMessNotAvailable = function (type) {
            tabNotAvailable[type] = tabAvailable[type];
            tabAvailable[type] = null;
        }


        __g__.addElement = function (name, elem) {
            return(objectStore.setData(name, elem));
        }

        __g__.deleteElement = function (name) {
            objectStore.removeData(name);
        }

        __g__.addEvent = function (elem, type, fn, fnID) //fonction took from book "JavaScript Ninja" from John Resig and Bear Bibeault (page 301)
        {

            if (elem == null || type == null || fn == null) {
                assert(false, "warning !!! parameters aren't completed or there are problems with its")
                return;
            }

            var data = objectStore.getData(elem);

            //console.log(data)

            if (data == null) return;

            if (!data.handlers) data.handlers = {};

            if (!data.handlers[type])
            //data.handlers[type] = [];
                data.handlers[type] = null;

            /*
             var tmp = data.handlers[type];
             var find = 0;

             var end = tmp.length;

             for(var p = 0; p < end; p++)
             {
             if(tmp[p] === fn)
             find = 1;
             }
             */
            //if(find === 0){
            if (data.handlers[type] === null) {
                //if(!fn.id) fn.id = (fnID != null) ? fnID : nextGuid++;
                //data.handlers[type].push(fn);
                fn.available = true;
                data.handlers[type] = fn;
            }
            else {
                //assert(false, "a reference to similar function already exist")
                assert(false, "function already exist")
                return;
            }

            if (!data.dispatcher) {

                //assert(true, "dispatcher")

                data.dispatcher = function (event) {
                    //event = fixEvent(event);

                    var handlers = data.handlers[event.type];

                    //console.log(handlers);

                    if (handlers != null) {
                        /*
                         var end = handlers.length;

                         for(var n = 0; n < end; n++){
                         if(handlers[n] != null)
                         handlers[n].call(elem, event);
                         }
                         */
                        if (handlers.available == true)
                            handlers.call(elem, event);
                    }
                };
            }

            //assert(true, "avantaddEventListener")

//			if(data.handlers[type].length == 1){
            //assert(true, "addEventListener")
            if (document.addEventListener) { //for DOM
                //assert(true, "addEventListener")
                data.addEventListener(type, data.dispatcher, false);
            }
            else if (document.attachEvent) {
                data.attachEvent("on" + type, data.dispatcher);
            }
            //}

        }


        __g__.removeEvent = function (elem, type, id) {
            function isEmpty(object) {

                for (var key in object) {
                    return false;
                }
                return true;

            }

            var data = objectStore.getData(elem);

            if (typeof id === "number") {
                var handlers = data.handlers[type];

                var end = handlers.length;

                for (var n = 0; n < end; n++) {
                    if (handlers[n].id != null)
                        if (handlers[n].id === id)
                            delete handlers[n];
                }

            }
            if (id === "all") {
                var handlers = data.handlers[type];

                var end = handlers.length;

                for (var n = 0; n < end; n++) {
                    delete handlers[n];
                }
            }

            if (data.handlers[type].length === 0) {

                delete data.handlers[type];

                if (document.removeEventListener) {
                    data.removeEventListener(type, data.dispatcher, false);
                }

                if (document.detachEvent) {
                    data.detachEvent("on" + type, data.dispatcher);
                }
            }

            if (isEmpty(data.handlers)) {
                delete data.handlers;
                delete data.dispatcher;
            }
        }


        return __g__;
    }

    TP.eventHandler = eventHandler;
})(TP);