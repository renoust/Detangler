//pile de gestion d'Etat

var TP = TP || {};
(function () {


    var ViewNVD3Template = function (parameters){//id, bouton, name, type, idAssociation) {

        //var __g__ = new TP.ViewTemplate(id, name, type, idAssociation, bouton);

        var __g__ = new TP.ViewTemplate({id:parameters.id, 
                                         name:parameters.name, 
                                         type:parameters.type, 
                                         idSourceAssociatedView:parameters.idSourceAssociatedView, 
                                         interactorList:parameters.interactorList});


        __g__.addView = function () {

            if (__g__.controller != null)
                __g__.controller.initListener(__g__.ID, "view");

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
        }


        __g__.initStates = function () {

            __g__.controller.setCurrentState(null);

        }


        return __g__;
    }

    TP.ViewNVD3Template = ViewNVD3Template;

    var ViewNVD3 = function () {


        var __g__ = this;


        __g__.drawScatterPlot = function (_event) {

            var target = _event.associatedData.source;

            var svg = null
            svg = TP.Context().view[target].getSvg();

            __g__.graph = TP.Context().view[target].getGraph()

            var margin = {top: 20, right: 15, bottom: 60, left: 60}

            var width = 960 - margin.left - margin.right;
            var height = 500 - margin.top - margin.bottom;

            var id = "" + TP.Context().getIndiceView();

            TP.Context().view[id] = new TP.ViewNVD3Template({id:id, 
                                                            name:"NVD3_" + TP.view[target].getName(), 
                                                            type:"nvd3", 
                                                            idSourceAssociatedView:target});
            TP.Context().view[id].addView();

            //TP.Context().view[id].buildLinks();
            
            nv.addGraph(function() {
                  var chart = nv.models.scatterChart()
                                .showDistX(true)
                                .showDistY(true)
                                .color(d3.scale.category10().range());
                
                  chart.xAxis.tickFormat(d3.format('.02f'))
                  chart.yAxis.tickFormat(d3.format('.02f'))
                                  
                  d3.select("#zone" + id + " svg")
                      .datum((function(graph){
                          var values = []
                          graph.nodes().forEach(
                              function(d){
                                  values.push(
                                      {
                                          x:d.x,
                                          y:d.y,
                                          size:d.size
                                      })
                              })
                          return [{key:'nodes', values:values}]
                      })(__g__.graph))
                     .transition().duration(500)
                      .call(chart);
                
                  nv.utils.windowResize(chart.update);
                
                  return chart;
                });


        }

        return __g__;

    }
    
    TP.ViewNVD3 = ViewNVD3;
})(TP);