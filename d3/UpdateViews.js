/************************************************************************
 * This module updates the graph views by drawing a new graph from a 
 * given set of data
 * @requires d3.js
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

(function () {

    import_class('context.js', 'TP');
    import_class("objectReferences.js", "TP");
    import_class("graph.js", "TP");
    import_class("graphDrawing.js", "TP");
    import_class("Metric.js", "TP");


    var UpdateViews = function () {
        var __g__ = this;

        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();


        this.syncLayoutsFromData = function (data, target) {
        	
        	assert(true, "syncLayoutsFromData");
        	
            var cGraph = null;
            var svg = null;

            cGraph = TP.Context().tabGraph["graph_"+target]; //substrate before generic code
            svg = TP.Context().view[target].getSvg(); //substrate...

            // we need to rescale the graph so it will fit the current svg 
            //frame and wont overlap with the buttons
            //console.log("syncLayoutData: ", data.data);
            //objectReferences.VisualizationObject.rescaleGraph(data);
            var graph_drawing = TP.GraphDrawing(cGraph, svg, +target); //substrate before generic code
            //graph_drawing.rescaleGraph(contxt,data);
            cGraph.nodes(data.nodes, +target);
            cGraph.links(data.links, +target);
            cGraph.edgeBinding();
            graph_drawing.move(cGraph, 0);
            objectReferences.VisualizationObject.rescaleGraph(data);

            var newGraph = JSON.parse(data.data.graph);
            var newLinks = newGraph.links;

            TP.Context().tabGraph["graph_combined"].nodes(TP.Context().tabGraph["graph_substrate"].nodes(), "substrate");
            TP.Context().tabGraph["graph_combined"].addNodes(TP.Context().tabGraph["graph_catalyst"].nodes());
            TP.Context().tabGraph["graph_combined"].links(newLinks);
            TP.Context().tabGraph["graph_combined"].specialEdgeBinding("substrate", "catalyst");

            var p1_s = data.data[target][0];
            var p2_s = data.data[target][1];
            var p1prime_s;
            var p2prime_s;

            TP.Context().tabGraph["graph_"+target].nodes().forEach(function (d) {
                if (d.baseID == p1_s.baseID) {
                    p1prime_s = d;
                }
                if (d.baseID == p2_s.baseID) {
                    p2prime_s = d;
                }
            });
            var delta = 0.0000000000000001;
            var scaleX_s = (p2prime_s.x-p1prime_s.x) / (p2_s.x-p1_s.x+delta)
            var scaleY_s = (p2prime_s.y-p1prime_s.y) / (p2_s.y-p1_s.y+delta)

            var deltaX_s = p2prime_s.x - p2_s.x * scaleX_s
            var deltaY_s = p2prime_s.y - p2_s.y * scaleY_s
            //console.log("delta substrate: ",scaleX_s,scaleY_s,deltaX_s, deltaY_s)

            var p1_c = data.data['catalyst'][0];
            var p2_c = data.data['catalyst'][1];
            var p1prime_c;
            var p2prime_c;


            TP.Context().tabGraph["graph_catalyst"].nodes()
                .forEach(function (d) {
                if (d.baseID == p1_c.baseID) {
                    p1prime_c = d;
                }
                if (d.baseID == p2_c.baseID) {
                    p2prime_c = d;
                }
            });
            delta = 0.0000000000000001

            var scaleX_c = (p2prime_c.x-p1prime_c.x) / (p2_c.x-p1_c.x+delta)
            var scaleY_c = (p2prime_c.y-p1prime_c.y) / (p2_c.y-p1_c.y+delta)
            var deltaX_c = p2prime_c.x - p2_c.x * scaleX_c
            var deltaY_c = p2prime_c.y - p2_c.y * scaleY_c

            //console.log("delta catalyst points: ", p2prime_c.y, p2_c.y)
            //console.log("delta catalyst: ",scaleX_c,scaleY_c,deltaX_c,deltaY_c)

            TP.Context().tabGraph["graph_combined"].nodes()
                .forEach(function (nprime) {
                if (nprime._type == target) {
                    var newX = ((nprime.x-deltaX_s)/scaleX_s)*scaleX_c+deltaX_c;
                    nprime.x = newX;
                    var newY = ((nprime.y-deltaY_s)/scaleY_s)*scaleY_c+deltaY_c;
                    nprime.y = newY;
                };
            });

            var graph_drawing = TP.GraphDrawing(TP.Context().tabGraph["graph_combined"], TP.Context().view["combined"].getSvg(), "combined");
            graph_drawing.clear();
            graph_drawing.draw();

            TP.ObjectReferences().VisualizationObject.sizeMapping("entanglementIndice", "catalyst");
            assert(true, "Arrange labels depuis la synchronisation des layouts")
            TP.ObjectContext().TulipPosyVisualizationObject.arrangeLabels(target);
			TP.ObjectContext().TulipPosyVisualizationObject.arrangeLabels("catalyst"); 
        }


        this.buildGraphFromData = function (data, target) { //substrate at bigin of project
            console.log('creating in tulip, and recieved data: ', data)
            //console.log("here should be sid: ", data.data.sid)
            TP.Context().sessionSid = data.data.sid
            //console.log("the session sid has just been affected: ", TP.Context().sessionSid);
            //objectReferences.VisualizationObject.rescaleGraph(data)
            
            //TP.GraphDrawing(TP.Context().getViewGraph("substrate"),TP.Context().getViewSVG("substrate")).rescaleGraph(contxt,data);

        
            TP.Context().tabGraph["graph_"+target].nodes(data.nodes, target) //substrate
            TP.Context().tabGraph["graph_"+target].links(data.links, target) //substrate
            TP.Context().tabGraph["graph_"+target].edgeBinding() //...
            graph_drawing = TP.GraphDrawing(TP.Context().tabGraph["graph_"+target], TP.Context().view[target].getSvg(), target)
            assert(true, "graphDrawing created") 
            graph_drawing.move(TP.Context().tabGraph["graph_"+target], 0)
            assert(true, "moved") 
            //assert(true, "arrangeLabels appele dans buildgraph")
            //graph_drawing.arrangeLabels();
        }


        this.applySubstrateAnalysisFromData = function (data, target) { //catalyst at bingin of project, without generic programmation
            //console.log("received data after analysis:")
            //console.log(data);
            TP.GraphDrawing(TP.Context().getViewGraph(target),TP.Context().view[target].getSvg(), target).rescaleGraph(contxt,data);

            //objectReferences.VisualizationObject.rescaleGraph(data)
            TP.Context().tabGraph["graph_"+target].nodes(data.nodes, target) //catalyst
            TP.Context().tabGraph["graph_"+target].links(data.links, target) //catalyst
            TP.Context().tabGraph["graph_"+target].edgeBinding()
            graph_drawing = TP.GraphDrawing(TP.Context().tabGraph["graph_"+target], TP.Context().view[target].getSvg(), target)
            graph_drawing.clear()
            graph_drawing.draw()
            TP.Context().entanglement_homogeneity = data['data']['entanglement homogeneity']
            TP.Context().entanglement_intensity = data['data']['entanglement intensity']
            objectReferences.VisualizationObject.entanglementCaught();
        }


        this.applyLayoutFromData = function (data, graphName) {
            //assert(true, "here");;
			TP.Context().getViewGraph(graphName).updateNodes(data.nodes, true);
			//assert(true, "there");
			TP.Context().getViewGraph(graphName).updateLinks(data.links, true);
			//assert(true, "again");

			var graph = null;
            var svg = null;
            svg = TP.Context().view[graphName].getSvg();
            graph = TP.Context().getViewGraph(graphName);

			TP.GraphDrawing(graph,svg,graphName).rescaleGraph(contxt,data);
            //objectReferences.VisualizationObject.rescaleGraph(data);
            //graph.nodes(data.nodes, graphName);
            //graph.links(data.links, graphName);
            //graph.edgeBinding();
            var graph_drawing = TP.GraphDrawing(graph, svg, graphName);
            graph_drawing.move(graph, 0);
        }


        this.applyInducedSubGraphFromData = function (data, graphName) {
            var graph = null;
            var svg = null;
            svg = TP.Context().view[graphName].getSvg();
            graph = TP.Context().getViewGraph(graphName);
            graph.nodes(data.nodes, graphName);
            graph.links(data.links, graphName);
            graph.edgeBinding();
            var graph_drawing = TP.GraphDrawing(graph, svg, graphName);
            graph_drawing.exit(graph, 0);
        }


        this.applyFloatAlgorithmFromData = function (data, graphName) {


			//assert(true, "here");;
			TP.Context().getViewGraph(graphName).updateNodes(data.nodes, true);
			//assert(true, "there");
			TP.Context().getViewGraph(graphName).updateLinks(data.links, true);
			//assert(true, "again");

			//data.nodes.forEach(function(d){console.log(d)});
			//TP.Context().getViewGraph(graphName).nodes().forEach(function(d){console.log(d)});
			
            var graph = null;
            var svg = null;

            svg = TP.Context().view[graphName].getSvg();
            graph = TP.Context().getViewGraph(graphName);


            TP.GraphDrawing(graph,svg).rescaleGraph(contxt,data, graphName);
            
            //objectReferences.VisualizationObject.rescaleGraph(data);
            //graph.nodes(data.nodes, graphName);
            //graph.links(data.links, graphName);
            //graph.edgeBinding();
            
            var graph_drawing = TP.GraphDrawing(graph, svg, graphName);
            graph_drawing.resize(graph, 0);

            var pileCentrality = new TP.Metric();
            
            /*
            var char = d3.selectAll("g.node.substrate");
            char.attr("x", function(d){ console.log("viewMetric : "+ d.viewMetric); pileCentrality.addMetric(d.viewMetric, d); return d.x; });
          
            TP.Context().metric_substrate_BC = pileCentrality.transformToArray("BarChart");
            TP.Context().metric_substrate_SP = pileCentrality.transformToArray("ScatterPlot");*/
           
           var char = d3.selectAll("g.node."+graphName);
           char.attr("x", function(d){ console.log("viewMetric : "+ d.viewMetric); pileCentrality.addMetric(d.viewMetric, d); return d.x; });

            TP.Context().view[graphName].setMetric_BC(pileCentrality.transformToArray("BarChart"));
            TP.Context().view[graphName].setMetric_SP(pileCentrality.transformToArray("ScatterPlot"));           
            
            objectReferences.VisualizationObject.entanglementCaught();
        }


        this.syncGraphRequestFromData = function (data, selection, graphName) {
        	
        	assert(true, "syncGraphRequestFromData");
        	
            var graph = null
            var svg = null
            if (graphName == 'substrate') {
                graph = TP.Context().tabGraph["graph_catalyst"]
                svg = TP.Context().view["catalyst"].getSvg();
            }

            if (graphName == 'catalyst') {
                //console.log('target is catalyst');
                graph = TP.Context().tabGraph["graph_substrate"]
                //console.log(selection)
                svg = TP.Context().view["substrate"].getSvg();
            }

            if (graphName == 'combined') {
                graph = TP.Context().tabGraph["graph_combined"];
                //console.log("synGraph combined:", selection);
                svg = TP.Context().view["combined"].getSvg();
            }


            //console.log("received data after synchronization: ")
            //console.log(data);

            var tempGraph = new TP.Graph()
            tempGraph.nodes(data.nodes, graphName)
            tempGraph.links(data.links, graphName)

            if (graphName == 'catalyst'){
                TP.Context().syncNodes = []
                data.nodes.forEach(function(d){
                    TP.Context().syncNodes.push(d.baseID);
                });
            }else{
                TP.Context().syncNodes = undefined;
            } 

            tempGraph.edgeBinding()


            var graph_drawing = TP.GraphDrawing(graph, svg, graphName)

            graph_drawing.show(tempGraph)


            if (graphName == 'combined') {
                var svg_target;
                var graph_target;
                if (TP.Context().combined_foreground == 'substrate') {
                    svg_target = TP.Context().view["catalyst"].getSvg();
                    graph_target = TP.Context().tabGraph["graph_catalyst"]
                }
                if (TP.Context().combined_foreground == 'catalyst') {
                    svg_target = TP.Context().view["substrate"].getSvg();
                    graph_target = TP.Context().tabGraph["graph_substrate"]
                }

                
                var graph_drawing = TP.GraphDrawing(graph_target, svg_target, graphName);
                graph_drawing.show(tempGraph);
            } else {
                var tempCombined = new TP.Graph();
                var nodeSelection = JSON.parse(selection)
                    .nodes;
                var nodeSelList = [];
                nodeSelection.forEach(function (d) {
                    nodeSelList.push(d.baseID);
                });
                var nodeTargetList = [];
                data.nodes.forEach(function (d) {
                    nodeTargetList.push(d.baseID);
                });
                var dataType = (graphName=="substrate")?"catalyst":"substrate";
                tempCombined.nodes(data.nodes, dataType);
                tempCombined.addNodes(nodeSelection, graphName);
                var tempLinks = [];
                TP.Context().tabGraph["graph_combined"].links()
                    .forEach(function (d) {
                        if (!d.source.baseID || !d.target.baseID) console.log(d);
                        if (nodeSelList.indexOf(d.source.baseID) != -1 && nodeTargetList.indexOf(d.target.baseID) != -1 || nodeSelList.indexOf(d.target.baseID) != -1 && nodeTargetList.indexOf(d.source.baseID) != -1) {
                            console.log("selected:", d, d.source, d.target);
                            tempLinks.push(d);
                        }
                    })
                tempCombined.links(tempLinks);

                
                tempCombined.specialEdgeBinding("substrate", "catalyst");
                var graph_drawing = TP.GraphDrawing(TP.Context().tabGraph["graph_combined"], TP.Context().view["combined"].getSvg(), "combined");
                graph_drawing.show(tempCombined);
            }

			
            if ('data' in data) {
                TP.Context().entanglement_homogeneity = data['data']['entanglement homogeneity'];
                TP.Context().entanglement_intensity = data['data']['entanglement intensity'];
                objectReferences.VisualizationObject.entanglementCaught();
            }
            
        }


        return __g__;
    }
    return {UpdateViews: UpdateViews}
})()
