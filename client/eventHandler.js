//pile de gestion d'Etat

var TP = TP || {};
(function () {


    var eventHandler = function () {

        var __g__ = this;

        var objectStore = new TP.Store();
        var nextGuid = 1;
        //var saveEvent = new Object();


        __g__.getElem = function(name)
        {
            return objectStore.getData(name);
        }

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

        __g__.addEvent = function (elem, type, fn/*, fnID*/) //fonction took from book "JavaScript Ninja" from John Resig and Bear Bibeault (page 301)
        {

            if (elem == null || type == null || fn == null) {
                assert(false, "warning !!! parameters aren't completed or there are problems with its");
                console.log("elem= ", elem, " type=",type, " fn=",fn);
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
                
                if(fn.call){ //cheking if fn is a function or not
                    fn.available = true;
                    data.handlers[type] = fn;
                }
                else{
                    assert(false, "there is no function or fn parametter isn't a function type")
                    return false;
                }
            }
            else {
                //assert(false, "a reference to similar function already exist")
                assert(false, "Event already exist")
                return false;
            }

            if (!data.dispatcher) {

                //assert(true, "dispatcher")

                data.dispatcher = function (_event) {
                    //_event = fixEvent(_event);

                    var handlers = data.handlers[_event.type];

                    //console.log(handlers);

                    if (handlers != null) {
                        /*
                         var end = handlers.length;

                         for(var n = 0; n < end; n++){
                         if(handlers[n] != null)
                         handlers[n].call(elem, _event);
                         }
                         */
                        if (handlers.available == true)
                            handlers.call(elem, _event);
                        else
                            assert(false, "function isn't available !!!")
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
            return true;
        }
        
        
        __g__.deleteEvent = function (elem, type/*, id*/) {
            
            function isEmpty(object) {

                for (var key in object) {
                    return false;
                }
                return true;

            }

            var data = objectStore.getData(elem);


            if(data.handlers[type] != null)
            {

                delete data.handlers[type];

                if (document.removeEventListener) {
                    data.removeEventListener(type, data.dispatcher, false);
                }

                if (document.detachEvent) {
                    data.detachEvent("on" + type, data.dispatcher);
                }
                
            }
            else
            {
                assert(false, "warning : there is no event named : "+type)
            }

            if (isEmpty(data.handlers)) {
                delete data.handlers;
                delete data.dispatcher;
            }
        }
        
        __g__.eventIsAvailable = function(nameElem, nameEvent)
        {
            var data = __g__.getElem(nameElem);
            
            if(data != null){
                if(data.handlers[nameEvent] != null)
                    return true;
            }
            
            return false;
        }

        return __g__;
    }

    TP.eventHandler = eventHandler;
})(TP);