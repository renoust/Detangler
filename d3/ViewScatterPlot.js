var TP = TP || {};
(function () {


    var ViewScatterPlot = function (id, bouton, name, type, idAssociation) {

        var __g__ = new TP.ViewTemplate(id, name, type, idAssociation, bouton);

        __g__.addView = function () {

            if (__g__.controller != null)
                __g__.controller.initListener(__g__.ID, "view");

            __g__.buttonTreatment();
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
        }


        __g__.initStates = function () {

            __g__.controller.addState({name: "mouseoverScatterPlot", bindings: null, func: function (_event) {/*assert(true, "mouseoverScatterPlot");*/
                TP.ScatterPlot().mouseoverScatterPlot(_event);
            }}, "all", true);
            __g__.controller.addState({name: "mouseoutScatterPlot", bindings: null, func: function (_event) {/*assert(true, "mouseoutScatterPlot");*/
                TP.ScatterPlot().mouseoutScatterPlot(_event);
            }}, "all", true);
            __g__.controller.addState({name: "mouseclickScatterPlot", bindings: null, func: function (_event) {/*assert(true, "mouseclickScatterPlot");*/
                TP.ScatterPlot().mouseclickScatterPlot(_event);
            }}, "all", true);

            __g__.controller.addState({name: "zoomScatterPlot", bindings: null, func: function (_event) {/*assert(true, "zoomScatterPlot");*/
                TP.ScatterPlot().zoomScatterPlot(_event);
            }}, "all", true);


            __g__.controller.setCurrentState(null);

        }


        return __g__;
    }

    TP.ViewScatterPlot = ViewScatterPlot;

})(TP);