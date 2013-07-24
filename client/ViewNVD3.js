//pile de gestion d'Etat

var TP = TP || {};
(function () {


    var ViewNVD3Template = function (parameters){//id, bouton, name, type, idAssociation) {

        //var __g__ = new TP.ViewTemplate(id, name, type, idAssociation, bouton);

        var __g__ = new TP.ViewTemplate(parameters);


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

            /*__g__.lasso = d3.custom.Lasso()
                .on("brushDrawStart", function(d, i){ console.log("brushDrawStart"); })
                .on("brushDrawMove", function(d, i){ console.log("brushDrawMove"); })
                .on("brushDrawEnd", function(d, i){ console.log("brushDrawEnd"); })
                .on("brushDragStart", function(d, i){ console.log("brushDragStart"); })
                .on("brushDragMove", function(d, i){ console.log("brushDragMove"); })
                .on("brushDragEnd", function(d, i){ console.log("brushDragEnd"); });
            */



        }

        __g__.remove = function () {
            __g__.removeViewTemplate();
        }


        __g__.initStates = function () {
            console.log("states view nvd3 initializing")
            __g__.controller.addEventState("simpleSelectionMadeView", function(_event){
                console.log("SIMPLE SELECTION DETECTED IN VIEW: ", _event);
                __g__.updateSelectionView(_event.associatedData.selection);
                var graph = []
                _event.associatedData.selection.data().forEach(function(n)
                {
                    graph.push(n.node)
                })
                __g__.getController().sendMessage("simpleSelectionMade", {selection:graph, idView:__g__.getID()}, "principal", __g__.getID())

            });
            __g__.controller.setCurrentState(null);

        }

        __g__.updateSelectionView = function (selection)
        {

            //should be passing the subgraph, but I am reconverting in order to reroute with the old
            selection[0].forEach(function(n){d3.select(n).style('fill', 'red')})
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

            //var id = "" + TP.Context().getIndiceView();

            //TP.Context().view[id] = 
            var myView = new TP.ViewNVD3Template({//id:id, 
                                                  name:"NVD3_" + TP.view[target].getName(), 
                                                  type:"nvd3", 
                                                  idSourceAssociatedView:target});
                                                
            var id = myView.getID();
            
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
                                          size:d.size,
                                          node:d
                                      })
                              })
                          return [{key:'nodes', values:values}]
                      })(__g__.graph))
                     .transition().duration(500)
                      .call(chart);
                
                  nv.utils.windowResize(chart.update);


                  return chart;
            });


            __g__.lasso = d3.custom.Lasso()
                .on("brushDrawStart", function(d, i){ console.log("brushDrawStart"); })
                .on("brushDrawMove", function(d, i){ console.log("brushDrawMove"); })
                .on("brushDrawEnd", function(d, i){ console.log("brushDrawEnd"); })
                .on("brushDragStart", function(d, i){ console.log("brushDragStart"); })
                .on("brushDragMove", function(d, i){ console.log("brushDragMove"); })
                .on("brushDragEnd", function(d, i){ //console.log("brushDragEnd", d, d.data(), d[0]);
                    console.log("sending message of selection")
                    myView.getController().sendMessage("simpleSelectionMadeView", {selection:d, idView:myView.getID()})
                    //myView.getController().sendMessage("simpleSelectionMadeView", {selection:graph, idView:myView.getID()})
                });


            myView.getSvg().on('mouseover', function(d, i){
                console.log("capturing mouseover") ;
                var nodeSelection = d3.select(this).selectAll(/*cirlce*/'.nv-point');
                __g__.lasso.shapes(nodeSelection);
            })

            myView.getSvg().call(__g__.lasso)

        }

        return __g__;

    }
    
    TP.ViewNVD3 = ViewNVD3;
})(TP);