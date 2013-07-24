var TP = TP || {};
(function () {


    var ViewScatterPlot = function (parameters){//id, bouton, name, type, idAssociation) {

        //var __g__ = new TP.ViewTemplate(id, name, type, idAssociation, bouton);

        var __g__ = new TP.ViewTemplate(parameters);

        __g__.updateEventHandler = new TP.UpdateEventHandler("scatterPlot", __g__.ID);

        __g__.addView = function () {

            if (__g__.controller != null)
                __g__.controller.initController(__g__.ID, "view");

            __g__.interactorListTreatment();
            __g__.createDialog();

            __g__.svg = d3.select("#zone" + __g__.ID)
                .append("svg")
                .attr('class', 'scatterPlot' + __g__.ID)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("id", "svg"+__g__.ID)
                .attr("idView", __g__.ID);
        }

        __g__.remove = function () {
            __g__.removeViewTemplate();
            __g__.updateEventHandler = null;
        }


        __g__.initStates = function () {

            __g__.controller.addEventState("mouseoverScatterPlot",  function (_event) {/*assert(true, "mouseoverScatterPlot");*/
                TP.ScatterPlot().mouseoverScatterPlot(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("mouseoutScatterPlot",  function (_event) {/*assert(true, "mouseoutScatterPlot");*/
                TP.ScatterPlot().mouseoutScatterPlot(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("mouseclickScatterPlot",  function (_event) {/*assert(true, "mouseclickScatterPlot");*/
                TP.ScatterPlot().mouseclickScatterPlot(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("zoomScatterPlot",  function (_event) {/*assert(true, "zoomScatterPlot");*/
                TP.ScatterPlot().zoomScatterPlot(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});


            __g__.controller.addEventState("updateOtherView",   function(_event){
                /*console.log("avant otherViews : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type);*/ __g__.updateOtherViews(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})		

            __g__.controller.addEventState("updateView",  function(_event){
                /*console.log("avant updateViewGraph : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type);*/ __g__.updateEventHandler.treatUpdateEvent(_event); __g__.updateOtherViews(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})			

            __g__.controller.setCurrentState(null);

        }


        return __g__;
    }

    TP.ViewScatterPlot = ViewScatterPlot;

})(TP);