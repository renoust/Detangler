var TP = TP || {};
(function () {


    var ViewBarchart = function (id, bouton, name, type, idAssociation, typeBarchart) {

        var __g__ = new TP.ViewTemplate(id, name, type, idAssociation, bouton);

        __g__.typeBarChart = typeBarchart;

        __g__.getTypeBarChart = function () {
            return __g__.typeBarChart;
        }

        __g__.addView = function () {

            if (__g__.controller != null)
                __g__.controller.initListener(__g__.ID, "view");

            __g__.buttonTreatment();
            __g__.createDialog();

            __g__.svg = d3.select("#zone" + __g__.ID)
                .append("svg")
                .attr('class', 'chart_' + __g__.typeBarChart + "_" + __g__.ID)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("id", "svg"+__g__.ID)
                .attr("idView", __g__.ID);
        }

        __g__.remove = function () {
            __g__.removeViewTemplate();

            __g__.typeBarChart = null;
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

            __g__.controller.setCurrentState(null);

        }


        return __g__;
    }

    TP.ViewBarchart = ViewBarchart;

})(TP);