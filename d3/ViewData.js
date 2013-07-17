var TP = TP || {};
(function () {


    var ViewData = function (id, bouton, name, type, idAssociation) {

        var __g__ = new TP.ViewTemplate(id, name, type, idAssociation, bouton);

        __g__.updateEventHandler = new TP.UpdateEventHandler("data", __g__.ID);

        __g__.addView = function () {

            if (__g__.controller != null)
                __g__.controller.initListener(__g__.ID, "view");

            __g__.buttonTreatment();
            __g__.createDialog();
        }

        __g__.remove = function () {
            __g__.removeViewTemplate();
        }
        
        __g__.initStates = function () {
            
            __g__.controller.addState({name : "updateOtherView", bindings : null, func:function(event){
                /*console.log("avant otherViews : source = ", event.associatedData.source, " target : ", event.associatedData.target, " data : ", event.associatedData.data, " type : ", event.associatedData.type);*/ __g__.updateOtherViews(event);
            }}, "all", true)

            __g__.controller.addState({name : "updateView", bindings : null, func:function(event){
                /*console.log("avant updateViewGraph : source = ", event.associatedData.source, " target : ", event.associatedData.target, " data : ", event.associatedData.data, " type : ", event.associatedData.type);*/ __g__.updateEventHandler.treatUpdateEvent(event); __g__.updateOtherViews(event);
            }}, "all", true)

            __g__.controller.setCurrentState(null);

        }

        return __g__;
    }

    TP.ViewData = ViewData;

})(TP);