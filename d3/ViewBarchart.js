var TP = TP || {};
(function () {


    //typeBarchart
    var ViewBarchart = function (parameters){//id, bouton, name, type, idAssociation, typeBarchart) {

        //var __g__ = new TP.ViewTemplate(id, name, type, idAssociation, bouton);
        
        var __g__ = new TP.ViewTemplate(parameters);

        if (!('typeBarchart' in parameters) || parameters.typeBarchart == undefined)
            parameters.typeBarchart = 'barchart'

        __g__.typeBarChart = parameters.typeBarchart;

		__g__.updateEventHandler = new TP.UpdateEventHandler("barchart", __g__.ID);

        __g__.getTypeBarChart = function () {
            return __g__.typeBarChart;
        }

        __g__.addView = function () {

            if (__g__.controller != null)
                __g__.controller.initListener(__g__.ID, "view");

            __g__.interactorListTreatment();
            __g__.createDialog();

            __g__.svg = d3.select("#zone" + __g__.ID)
                .append("svg")
                .attr('class', "barchart_" + __g__.ID)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("id", "svg"+__g__.ID)
                .attr("idView", __g__.ID);
        }

        __g__.remove = function () {
            __g__.removeViewTemplate();

            __g__.typeBarChart = null;
        }

		__g__.modifUpdate = function(){
			assert(true, "je suis la vue Barchart : "+__g__.ID)
		}	

        __g__.initStates = function () {
            __g__.controller.addState({name: "mouseoverBarChartRect", bindings: null, func: function (_event) {/*assert(true, "mouseoverBarChartRect");*/
                TP.BarChart().mouseoverBarChartRect(_event);
            }}, "all", true);
            __g__.controller.addState({name: "mouseoutBarChartRect", bindings: null, func: function (_event) {/*assert(true, "mouseoutBarChartRect");*/
                TP.BarChart().mouseoutBarChartRect(_event);
            }}, "all", true);
            __g__.controller.addState({name: "mouseclickBarChartRect", bindings: null, func: function (_event) {/*assert(true, "mouseclickBarChartRect");*/
                TP.BarChart().mouseclickBarChartRect(_event);
            }}, "all", true);
            
			__g__.controller.addState({name : "updateOtherView", bindings : null, func:function(event){
				console.log("avant otherViews : source = ", event.associatedData.source, " target : ", event.associatedData.target, " data : ", event.associatedData.data, " type : ", event.associatedData.type); __g__.updateOtherViews(event);
			}}, "all", true)		
			
			__g__.controller.addState({name : "updateView", bindings : null, func:function(event){
				console.log("avant updateViewGraph : source = ", event.associatedData.source, " target : ", event.associatedData.target, " data : ", event.associatedData.data, " type : ", event.associatedData.type); __g__.updateEventHandler.treatUpdateEvent(event); __g__.updateOtherViews(event);
			}}, "all", true)

            __g__.controller.setCurrentState(null);

        }


        return __g__;
    }

    TP.ViewBarchart = ViewBarchart;

})(TP);