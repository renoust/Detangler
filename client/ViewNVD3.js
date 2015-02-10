//pile de gestion d'Etat

var TP = TP || {};
(function () {


    var ViewNVD3Template = function (parameters){//id, bouton, name, type, idAssociation) {

        //var __g__ = new TP.ViewTemplate(id, name, type, idAssociation, bouton);


        var __g__ = this;
        __g__.currentSelector = "nodes";
        __g__.numeric = true;

        var tl2 = [
            [7,{id:"nodeProperty"},
                {
                    source: function(searchStr, sourceCallback){
                        var propertyList = [];
                        console.log("current selector", __g__.currentSelection)
                        
                        if (__g__.currentSelection == "nodes")
                        {                        
                            var oneNode = TP.Context().view[__g__.idSourceAssociatedView].getGraph().nodes()[0];
                            for (var algo in oneNode)
                            {
                                var patt = new RegExp(searchStr.term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
                                var isAlgo = patt.test(algo);
                                if (__g__.numeric == false || isAlgo && typeof(oneNode[algo]) == "number") propertyList.push(algo);
                            }
                            sourceCallback(propertyList);
                        }
                        else
                        {
                            var oneEdge = TP.Context().view[__g__.idSourceAssociatedView].getGraph().links()[0];
                            for (var algo in oneEdge)
                            {
                                var patt = new RegExp(searchStr.term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
                                var isAlgo = patt.test(algo);
                                if  (__g__.numeric || isAlgo && typeof(oneEdge[algo]) == "number") propertyList.push(algo);
                            }
                            sourceCallback(propertyList);
                            
                        }
                    },
                    minLength: 0
                }]];

        var nodeEdgeSelection = [
            [7,{id:"nodeEdgeSelection"},
                {
                    source: ['nodes','edges'],
                    minLength: 0
                    
                }]];


        var interactors = [
            {interactorLabel:'X-axis data',interactorParameters:tl2,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(paramList){
                    __g__.getController().sendMessage('updateXAxis', {nodeProperty:paramList.nodeProperty, idView: TP.Context().activeView});
                }}},
            {interactorLabel:'Y-axis data',interactorParameters:tl2,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(paramList){
                    __g__.getController().sendMessage('updateYAxis', {nodeProperty:paramList.nodeProperty, idView: TP.Context().activeView});
                }}},
            
            {interactorLabel:'Nodes or edges',interactorParameters:nodeEdgeSelection,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(paramList){
                    __g__.currentSelector = paramList.nodeEdgeSelection;
                    __g__.getController().sendMessage('updateXAxis', {nodeProperty:paramList.nodeProperty, idView: TP.Context().activeView});
                    __g__.getController().sendMessage('updateYAxis', {nodeProperty:paramList.nodeProperty, idView: TP.Context().activeView});
                    //__g__.scatterProperties.x = "baseID";
                    //__g__.scatterProperties.y = "baseID";
                    //__g__.getController().sendMessage('updateYAxis', {nodeProperty:paramList.nodeProperty, idView: TP.Context().activeView});
                }}},
            {interactorLabel:'Change background',interactorParameters:[],callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(paramList){
                    return;
                    //__g__.getController().sendMessage('updateYAxis', {nodeProperty:paramList.nodeProperty, idView: TP.Context().activeView});
                }}, interactorGroup:"View"},

            ];


        parameters.interactorList = interactors;
        __g__ = new TP.ViewTemplate(parameters);

        __g__.scatterProperties = {x:'x', y:'y', size:'viewMetric'};
        __g__.yProperty = 'y';

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



        };

        __g__.remove = function () {
            __g__.removeViewTemplate();
        };


        __g__.initStates = function () {
            //console.log("states view nvd3 initializing")

            __g__.controller.addEventState("simpleSelectionMadeView", function(_event){
                __g__.updateSelectionView(_event.associatedData.selection);
                var graph = [];
                _event.associatedData.selection.data().forEach(function(n)
                {
                    graph.push(n.node);
                });
                __g__.getController().sendMessage("simpleSelectionMade", {selection:graph, idView:__g__.getID(), associated:__g__.idSourceAssociatedView}, "principal", __g__.getID());

            });
            
            __g__.controller.addEventState("groupSelectionMadeView", function(_event){
                __g__.updateGroupSelectionView(_event.associatedData.selection, _event.associatedData.bar);
                var graph = [];
                _event.associatedData.selection.forEach(function(n)
                {
                    graph.push(n);
                });
                __g__.getController().sendMessage("simpleSelectionMade", {selection:graph, idView:__g__.getID(), associated:__g__.idSourceAssociatedView}, "principal", __g__.getID());
            });

            __g__.controller.addEventState("updateXAxis", function(_event){
                //console.log("UPDATING X-AXIS DATA: ", _event);
                __g__.updateAxis(_event.associatedData.nodeProperty, "x");
            });

            __g__.controller.addEventState("updateYAxis", function(_event){
                //console.log("UPDATING Y-AXIS DATA: ", _event);
                __g__.updateAxis(_event.associatedData.nodeProperty, "y");
            });

            __g__.controller.setCurrentState(null);

        };

        __g__.updateAxis = function (nodeProperty, viewAxis)
        {

            __g__.scatterProperties[viewAxis] = nodeProperty;

            __g__.chart.xAxis.axisLabel(__g__.scatterProperties.x);
            __g__.chart.yAxis.axisLabel(__g__.scatterProperties.y);


            d3.select("#zone" + __g__.ID + " svg")
                .datum((function(graph){
                    var values = [];
                    var iterateOn = graph.nodes(); 
                    if (__g__.currentSelector == "nodes")
                        iterateOn = graph.nodes(); 
                    else
                        iterateOn = graph.links();
                        
                         
                    iterateOn.forEach(
                        function(d){
                            //return null;
                            var scatterPoint = {};
                            for (p in __g__.scatterProperties)
                            {
                                if(__g__.scatterProperties[p] in d)
                                   scatterPoint[p] = d[__g__.scatterProperties[p]];
                                else
                                   scatterPoint[p] = 0;
                                
                            }
                            scatterPoint['node'] = d;
                            values.push(scatterPoint);
                        });
                    return [{key:'nodes', values:values}];
                })(TP.Context().view[__g__.idSourceAssociatedView].getGraph()));

            __g__.chart.update();
        };
        __g__.updateSelectionView = function (selection)
        {

            //should be passing the subgraph, but I am reconverting in order to reroute with the old function
            __g__.svg.selectAll('.nv-point').style('fill', '#1f77b4');
            selection[0].forEach(function(n){d3.select(n).style('fill', 'red');});
        };

        __g__.updateGroupSelectionView = function (selection, group)
        {

            //should be passing the subgraph, but I am reconverting in order to reroute with the old function
            __g__.svg.selectAll('.nv-bar').style('fill', '#1f77b4');
            
            //console.log("turn red here", selection, d3.select(group[0]));
            //console.log(d3.select(group).select('rect'));
                group.style('fill', 'red');
        };


        return __g__;
    };

    TP.ViewNVD3Template = ViewNVD3Template;

    var ViewNVD3ScatterPlot = function () {


        var __g__ = this;


        __g__.drawScatterPlot = function (_event) {

            var target = _event.associatedData.source;

            var svg = null;
            svg = TP.Context().view[target].getSvg();

            __g__.graph = TP.Context().view[target].getGraph();

            var margin = {top: 20, right: 15, bottom: 60, left: 60};

            var width = 960 - margin.left - margin.right;
            var height = 500 - margin.top - margin.bottom;

            //var id = "" + TP.Context().getIndiceView();

            //TP.Context().view[id] = 
            var myView = new TP.ViewNVD3Template({//id:id, 
                                                  name:"NVD3_ScatterPlot" + TP.view[target].getName(), 
                                                  type:"nvd3_scatterplot", 
                                                  idSourceAssociatedView:target});
                                                
            var id = myView.getID();
            
            TP.Context().view[id].addView();

            
            //TP.Context().view[id].buildLinks();
            
            nv.addGraph(function() {
                  myView.chart = nv.models.scatterChart()
                                .showDistX(false)
                                .showDistY(false)
                                .color(d3.scale.category10().range());
                
                  myView.chart.xAxis.tickFormat(d3.format('.02f'));
                  myView.chart.yAxis.tickFormat(d3.format('.02f'));

                  myView.chart.xAxis.axisLabel(myView.scatterProperties.x);
                  myView.chart.yAxis.axisLabel(myView.scatterProperties.y);



                d3.select("#zone" + id + " svg")
                      .datum((function(graph){
                          var values = [];
                          graph.nodes().forEach(
                              function(d){

                                  var scatterPoint = {};
                                  for (p in myView.scatterProperties)
                                  {
                                      scatterPoint[p] = d[myView.scatterProperties[p]];
                                  }
                                  scatterPoint['node'] = d;
                                  values.push(scatterPoint);

                              });
                          return [{key:'nodes', values:values}];
                      })(__g__.graph))
                     .transition().duration(500)
                      .call(myView.chart);
                
                  nv.utils.windowResize(myView.chart.update);


                  return myView.chart;
            });


            __g__.lasso = d3.custom.Lasso()
                .on("brushDrawStart", function(d, i){
                    var lbox = myView.getSvg()[0][0].getBoundingClientRect(); 
                    var bbox = myView.getSvg().select('g.nv-groups')[0][0].getBoundingClientRect();
                    //console.log(lbox, bbox); 
                    __g__.lasso.svgOffsets(lbox.left - bbox.left, lbox.top - bbox.top);
                    })
                .on("brushDrawMove", function(d, i){})
                .on("brushDrawEnd", function(d, i){
                    console.log(d);
                    myView.getController().sendMessage("simpleSelectionMadeView", {selection:d, idView:myView.getID()});
                })
                .on("brushDragStart", function(d, i){})
                .on("brushDragMove", function(d, i){ //console.log("brushDragMove");
                    myView.getController().sendMessage("simpleSelectionMadeView", {selection:d, idView:myView.getID()});
                })
                .on("brushDragEnd", function(d, i){ //console.log("brushDragEnd", d, d.data(), d[0]);
                    //console.log("sending message of selection")
                    myView.getController().sendMessage("simpleSelectionMadeView", {selection:d, idView:myView.getID()});
                    //myView.getController().sendMessage("simpleSelectionMadeView", {selection:graph, idView:myView.getID()})
                });


            myView.getSvg().on('mouseover', function(d, i){
                //console.log("capturing mouseover") ;
                var nodeSelection = d3.select(this).selectAll(/*cirlce*/'.nv-point');
                __g__.lasso.shapes(nodeSelection);
            });

            myView.getSvg().call(__g__.lasso);

        };

        return __g__;

    };
    
    TP.ViewNVD3ScatterPlot = ViewNVD3ScatterPlot;
    
    
    var ViewNVD3BarChart = function () {


        var __g__ = this;


        __g__.drawBarChart = function (_event) {

            var target = _event.associatedData.source;

            var svg = null;
            svg = TP.Context().view[target].getSvg();

            __g__.graph = TP.Context().view[target].getGraph();

            var margin = {top: 20, right: 15, bottom: 60, left: 60};

            var width = 960 - margin.left - margin.right;
            var height = 500 - margin.top - margin.bottom;

            //var id = "" + TP.Context().getIndiceView();

            //TP.Context().view[id] = 
            var myView = new TP.ViewNVD3Template({//id:id, 
                                                  name:"NVD3_BarChart" + TP.view[target].getName(), 
                                                  type:"nvd3_barchart", 
                                                  idSourceAssociatedView:target});
                                                
            var id = myView.getID();
            
            TP.Context().view[id].addView();

            
            //TP.Context().view[id].buildLinks();
            myView.scatterProperties.x = "label";
            myView.scatterProperties.y = "nbDescriptors";
            
            nv.addGraph(function() {
               myView.chart = nv.models.discreteBarChart()
                  .x(function(d) { return d.x; })    //Specify the data accessors.
                  .y(function(d) { return d.y; })
                  .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
                  .tooltips(false)        //Don't show tooltips
                  .showValues(true)       //...instead, show the bar value right on top of each bar.
                  //.transitionDuration(350)
                  ;
            
            
              //nv.utils.windowResize(chart.update);
             //myView.chart.xAxis.axisLabel(myView.barchartProperties.x);
             //myView.chart.yAxis.axisLabel(myView.barchartProperties.y);

              d3.select("#zone" + id + " svg")
                      .datum((function(graph){
                          var values = [];
                          var mymap = [];
                          graph.nodes().forEach(
                              function(d){

                                  //var scatterPoint = {};
                                  var val = d[myView.scatterProperties.y];
                                  if (! (val in mymap))
                                  {
                                      mymap[val] = [];
                                      mymap[val]["value"] = 0;
                                      mymap[val]["ids"] = [];

                                  } 
                                  mymap[val]["value"] += 1;
                                  mymap[val]["ids"].push(d);
                                  //for (p in myView.scatterProperties)
                                  //{
                                  //    scatterPoint[p] = d[myView.scatterProperties[p]];
                                  //}
                                  
                                  //scatterPoint['node'] = d;
                                  //values.push(scatterPoint);

                              });
                          for (d in mymap){
                             values.push({'x': d, 'y': mymap[d]["value"], 'ids': mymap[d]["ids"]}); 
                          };
                          return [{key:'nodes', values:values}];
                      })(__g__.graph))
                     .transition().duration(500)
                     .call(myView.chart);
                
                  nv.utils.windowResize(myView.chart.update);


                  return myView.chart;
            }//);
            
            ,
            
            function(){
            d3.select("#zone" + id + " svg").selectAll(".nv-bar").on('click',
               function(d){
                   myView.getController().sendMessage("groupSelectionMadeView", {selection:d['ids'], idView:myView.getID(), bar:d3.select(this)});
                   //  console.log("test", d);
           });
        });
            
            

            
            
            /*
            __g__.lasso = d3.custom.Lasso()
                .on("brushDrawStart", function(d, i){lbox = myView.getSvg()[0][0].getBoundingClientRect(); bbox = myView.getSvg().select('g.nv-groups')[0][0].getBoundingClientRect(); __g__.lasso.svgOffsets(lbox.left - bbox.left, lbox.top - bbox.top);})
                .on("brushDrawMove", function(d, i){})
                .on("brushDrawEnd", function(d, i){
                    myView.getController().sendMessage("simpleSelectionMadeView", {selection:d, idView:myView.getID()});
                })
                .on("brushDragStart", function(d, i){})
                .on("brushDragMove", function(d, i){ //console.log("brushDragMove");
                    myView.getController().sendMessage("simpleSelectionMadeView", {selection:d, idView:myView.getID()});
                })
                .on("brushDragEnd", function(d, i){ //console.log("brushDragEnd", d, d.data(), d[0]);
                    //console.log("sending message of selection")
                    myView.getController().sendMessage("simpleSelectionMadeView", {selection:d, idView:myView.getID()});
                    //myView.getController().sendMessage("simpleSelectionMadeView", {selection:graph, idView:myView.getID()})
                });


            myView.getSvg().on('mouseover', function(d, i){
                //console.log("capturing mouseover") ;
                var nodeSelection = d3.select(this).selectAll('.nv-point');
                __g__.lasso.shapes(nodeSelection);
            });

            myView.getSvg().call(__g__.lasso);
           */

        };

        return __g__;

    };
    
    TP.ViewNVD3BarChart = ViewNVD3BarChart;
    
})(TP);