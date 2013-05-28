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


        this.syncLayoutsFromData = function (data) {
            var cGraph = null;
            var svg = null;

            cGraph = contxt.graph_substrate;
            svg = contxt.svg_substrate;

            // we need to rescale the graph so it will fit the current svg 
            //frame and wont overlap with the buttons
            //console.log("syncLayoutData: ", data.data);
            //objectReferences.VisualizationObject.rescaleGraph(data);
            var graph_drawing = TP.GraphDrawing(cGraph, svg);
            //graph_drawing.rescaleGraph(contxt,data);
            cGraph.nodes(data.nodes, "substrate");
            cGraph.links(data.links, "substrate");
            cGraph.edgeBinding();
            graph_drawing.move(cGraph, 0);
            objectReferences.VisualizationObject.rescaleGraph(data);

            var newGraph = JSON.parse(data.data.graph);
            var newLinks = newGraph.links;

            contxt.graph_combined.nodes(contxt.graph_substrate.nodes(), "substrate");
            contxt.graph_combined.addNodes(contxt.graph_catalyst.nodes());
            contxt.graph_combined.links(newLinks);
            contxt.graph_combined.specialEdgeBinding("substrate", "catalyst");

            var p1_s = data.data['substrate'][0];
            var p2_s = data.data['substrate'][1];
            var p1prime_s;
            var p2prime_s;

            contxt.graph_substrate.nodes().forEach(function (d) {
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


            contxt.graph_catalyst.nodes()
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

            contxt.graph_combined.nodes()
                .forEach(function (nprime) {
                if (nprime._type == "substrate") {
                    var newX = ((nprime.x-deltaX_s)/scaleX_s)*scaleX_c+deltaX_c;
                    nprime.x = newX;
                    var newY = ((nprime.y-deltaY_s)/scaleY_s)*scaleY_c+deltaY_c;
                    nprime.y = newY;
                };
            });

            var graph_drawing = TP.GraphDrawing(contxt.graph_combined, contxt.svg_combined);
            graph_drawing.clear();
            graph_drawing.draw();

            TP.ObjectReferences().VisualizationObject.sizeMapping("entanglementIndice", "catalyst");
            assert(true, "Arrange labels depuis la synchronisation des layouts")
            TP.ObjectContext().TulipPosyVisualizationObject.arrangeLabels("substrate");
			TP.ObjectContext().TulipPosyVisualizationObject.arrangeLabels("catalyst"); 
        }


        this.buildGraphFromData = function (data) {
            //console.log('creating in tulip, and recieved data: ', data)
            //console.log("here should be sid: ", data.data.sid)
            contxt.sessionSid = data.data.sid
            //console.log("the session sid has just been affected: ", contxt.sessionSid);
            //objectReferences.VisualizationObject.rescaleGraph(data)
            TP.GraphDrawing(contxt.getViewGraph("substrate"),contxt.getViewSVG("substrate")).rescaleGraph(contxt,data);

        
            contxt.graph_substrate.nodes(data.nodes, "substrate")
            contxt.graph_substrate.links(data.links, "substrate")
            contxt.graph_substrate.edgeBinding()
            graph_drawing = TP.GraphDrawing(contxt.graph_substrate, contxt.svg_substrate)
            graph_drawing.move(contxt.graph_substrate, 0)
            //assert(true, "arrangeLabels appele dans buildgraph")
            //graph_drawing.arrangeLabels();
        }


        this.applySubstrateAnalysisFromData = function (data) {
            //console.log("received data after analysis:")
            //console.log(data);
            TP.GraphDrawing(contxt.getViewGraph("catalyst"),contxt.getViewSVG("catalyst")).rescaleGraph(contxt,data);

            //objectReferences.VisualizationObject.rescaleGraph(data)
            contxt.graph_catalyst.nodes(data.nodes, "catalyst")
            contxt.graph_catalyst.links(data.links, "catalyst")
            contxt.graph_catalyst.edgeBinding()
            graph_drawing = TP.GraphDrawing(contxt.graph_catalyst, contxt.svg_catalyst)
            graph_drawing.clear()
            graph_drawing.draw()
            contxt.entanglement_homogeneity = data['data']['entanglement homogeneity']
            contxt.entanglement_intensity = data['data']['entanglement intensity']
            objectReferences.VisualizationObject.entanglementCaught();
        }


        this.applyLayoutFromData = function (data, graphName) {
            var graph = null;
            var svg = null;
            svg = contxt.getViewSVG(graphName);
            graph = contxt.getViewGraph(graphName);

			TP.GraphDrawing(graph,svg).rescaleGraph(contxt,data);
            //objectReferences.VisualizationObject.rescaleGraph(data);
            graph.nodes(data.nodes, graphName);
            graph.links(data.links, graphName);
            graph.edgeBinding();
            var graph_drawing = TP.GraphDrawing(graph, svg);
            graph_drawing.move(graph, 0);
        }


        this.applyInducedSubGraphFromData = function (data, graphName) {
            var graph = null;
            var svg = null;
            svg = contxt.getViewSVG(graphName);
            graph = contxt.getViewGraph(graphName);
            graph.nodes(data.nodes, graphName);
            graph.links(data.links, graphName);
            graph.edgeBinding();
            var graph_drawing = TP.GraphDrawing(graph, svg);
            graph_drawing.exit(graph, 0);
        }


        this.applyFloatAlgorithmFromData = function (data, graphName) {

            var graph = null;
            var svg = null;
            svg = contxt.getViewSVG(graphName);
            graph = contxt.getViewGraph(graphName);

            TP.GraphDrawing(graph,svg).rescaleGraph(contxt,data);
            //objectReferences.VisualizationObject.rescaleGraph(data);
            graph.nodes(data.nodes, graphName);
            graph.links(data.links, graphName);
            graph.edgeBinding();
            var graph_drawing = TP.GraphDrawing(graph, svg);
            graph_drawing.resize(graph, 0);

            var pileCentrality = new TP.Metric();
            
            var char = d3.selectAll("g.node.substrate");
            char.attr("x", function(d){ console.log("viewMetric : "+ d.viewMetric); pileCentrality.addMetric(d.viewMetric, d); return d.x; });
          
            contxt.metric_substrate_BC = pileCentrality.transformToArray("BarChart");
            contxt.metric_substrate_SP = pileCentrality.transformToArray("ScatterPlot");
            
            objectReferences.VisualizationObject.entanglementCaught();
        }


        this.syncGraphRequestFromData = function (data, selection, graphName) {
            var graph = null
            var svg = null

            if (graphName == 'substrate') {
                graph = contxt.graph_catalyst
                svg = contxt.svg_catalyst
            }

            if (graphName == 'catalyst') {
                //console.log('target is catalyst');
                graph = contxt.graph_substrate
                //console.log(selection)
                svg = contxt.svg_substrate
            }

            if (graphName == 'combined') {
                graph = contxt.graph_combined;
                //console.log("synGraph combined:", selection);
                svg = contxt.svg_combined;
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


            var graph_drawing = TP.GraphDrawing(graph, svg)

            graph_drawing.show(tempGraph)


            if (graphName == 'combined') {
                var svg_target;
                var graph_target;
                if (contxt.combined_foreground == 'substrate') {
                    svg_target = contxt.svg_catalyst
                    graph_target = contxt.graph_catalyst
                }
                if (contxt.combined_foreground == 'catalyst') {
                    svg_target = contxt.svg_substrate
                    graph_target = contxt.graph_substrate
                }
                var graph_drawing = TP.GraphDrawing(graph_target, svg_target);
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
                contxt.graph_combined.links()
                    .forEach(function (d) {
                        if (!d.source.baseID || !d.target.baseID) console.log(d);
                        if (nodeSelList.indexOf(d.source.baseID) != -1 && nodeTargetList.indexOf(d.target.baseID) != -1 || nodeSelList.indexOf(d.target.baseID) != -1 && nodeTargetList.indexOf(d.source.baseID) != -1) {
                            console.log("selected:", d, d.source, d.target);
                            tempLinks.push(d);
                        }
                    })
                tempCombined.links(tempLinks);

                tempCombined.specialEdgeBinding("substrate", "catalyst");
                var graph_drawing = TP.GraphDrawing(contxt.graph_combined, contxt.svg_combined);
                graph_drawing.show(tempCombined);
            }


            if ('data' in data) {
                contxt.entanglement_homogeneity = data['data']['entanglement homogeneity'];
                contxt.entanglement_intensity = data['data']['entanglement intensity'];
                objectReferences.VisualizationObject.entanglementCaught();
            }
        }


        return __g__;
    }
    return {UpdateViews: UpdateViews}
})()