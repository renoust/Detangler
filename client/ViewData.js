var TP = TP || {};
(function () {


    var ViewData = function (id, bouton, name, type, idAssociation) {

        var __g__ = new TP.ViewTemplate(id, name, type, idAssociation, bouton);

        __g__.updateEventHandler = new TP.UpdateEventHandler("data", __g__.ID);

        __g__.addView = function () {

            if (__g__.controller != null)
                __g__.controller.initController(__g__.ID, "view");

            __g__.interactorListTreatment();
            __g__.createDialog();
        }

        __g__.remove = function () {
            __g__.removeViewTemplate();
            __g__.updateEventHandler = null
        }
        
        __g__.initStates = function () {
            
            __g__.controller.addEventState("updateOtherView",  function(event){
                /*console.log("avant otherViews : source = ", event.associatedData.source, " target : ", event.associatedData.target, " data : ", event.associatedData.data, " type : ", event.associatedData.type);*/ __g__.updateOtherViews(event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})

            __g__.controller.addEventState("updateView",  function(event){
                /*console.log("avant updateViewGraph : source = ", event.associatedData.source, " target : ", event.associatedData.target, " data : ", event.associatedData.data, " type : ", event.associatedData.type);*/ __g__.updateEventHandler.treatUpdateEvent(event); __g__.updateOtherViews(event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})

            __g__.controller.setCurrentState(null);

        }

        return __g__;
    }

    TP.ViewData = ViewData;

})(TP);