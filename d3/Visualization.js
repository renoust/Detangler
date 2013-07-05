/************************************************************************
 * This module manipulates the svg representation of the graphs 
 * (e.g it can rearrange layouts, hide labels ...)
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

(function () {

    import_class("graphDrawing.js", "TP");
    import_class('context.js', 'TP');
    import_class("objectReferences.js", "TP");
    import_class('View.js', 'TP');

    var Visualization = function () {
        var __g__ = this;
        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();


        this.showhideLinks = function (event) {
			
			var target = event.associatedData.source;
			
            if (!target)return

            var svg = null
            svg = TP.Context().view[target].getSvg();

            TP.Context().view[target].setShowLinks(!TP.Context().view[target].getShowLinks());

            if (TP.Context().view[target].getShowLinks()) {
                svg.selectAll('g.link').attr("visibility", "visible");
                $('.ui-accordion-header').each(function(){if($(this).text()==='show links'){$(this).text('hide links')} })
            } else {
                $('.ui-accordion-header').each(function(){if($(this).text()==='hide links'){$(this).text('show links')} })
                svg.selectAll('g.link').attr("visibility", "hidden");
            }
        }

        // This function updates the entanglement values displayed in the 
        //entanglement frame of the substrate view
        // The entanglement intensity drives the color of the frame 
        //following a Brewer's scale (www.colorbrewer2.org).
        this.entanglementCaught = function (CurrentViewID, nothing) {
            var brewerSeq = ['#FEEDDE', '#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603']
			var target_source = CurrentViewID;
 
            if(nothing == null){
            	
            	$('#homogeneity')[0].innerHTML = objectReferences.ToolObject.round(TP.Context().entanglement_homogeneity, 5);
            	$('#intensity')[0].innerHTML = objectReferences.ToolObject.round(TP.Context().entanglement_intensity, 5);            	
            	          
	            var index = Math.round(TP.Context().entanglement_intensity * 5) % 6
	        	$('#bg')[0].style.cssText="background-color:"+ brewerSeq[index];	           
	        }
	        else{
	        	
	            $('#homogeneity')[0].innerHTML = objectReferences.ToolObject.round("0", 5);
            	$('#intensity')[0].innerHTML = objectReferences.ToolObject.round("0", 5);
            		
	        	$('#bg')[0].style.cssText="background-color:white";
	        
	        }
            /*TP.Context().svg_substrate.selectAll("rect.entanglementframe")

                .transition()
                .style('fill-opacity', .5)
                .style("fill", brewerSeq[index])*/
            d3.selectAll("rect.view").style("fill", brewerSeq[index])
            d3.selectAll("rect.brush").style("fill", brewerSeq[index])
            //d3.selectAll("polygon.brush").style("fill", brewerSeq[index])
            
            if (TP.Context().view[target_source].getLasso()) 
                TP.Context().view[target_source].getLasso().fillColor = brewerSeq[index]
        }
/*
        this.buildEdgeMatrices = function (target) { //catalyst at bingin of project, whithout generic code
            var matrixData = [];
            nbNodes = TP.Context().view[target].getGraph().nodes().length;
            for (i = 0; i < nbNodes; i++) {
                matrixData[i] = [];
                for (j = 0; j < nbNodes; j++)
                    matrixData[i][j] = [-1, 0.0];
            }

            var catalystToInd = {};
            TP.Context().view[target].getGraph().nodes().forEach(function (d, i) {
                catalystToInd[d.label] = i;         
                matrixData[i][i] = [d.baseID, d.frequency];         
            });
            TP.Context().view[target].getGraph().links().forEach(function (d) {
                var freq = JSON.parse(d.conditionalFrequency);
                i = catalystToInd[freq['order'][0]]
                j = catalystToInd[freq['order'][1]]
                matrixData[i][j] = [d.baseID, freq['values'][0]]
                matrixData[j][i] = [d.baseID, freq['values'][1]]
            });



            var overallSize = 200.0;
            var indSize = overallSize / nbNodes;
            overallSize = indSize * nbNodes + 1;



            function move() {

                assert(true, "toto = titi")

                objectReferences.VisualizationObject.parentNode.appendChild(this);
                var dragTarget = d3.select(this);
                var currentPanel = dragTarget
                panelPos = currentPanel.attr("transform")
                    .replace("translate(", "")
                    .replace(")", "")
                    .split(',');
                var posX = d3.event.dx
                var posY = d3.event.dy
                var newX = parseInt(panelPos[0]) + posX
                var newY = parseInt(panelPos[1]) + posY

                console.log(panelPos);

                dragTarget.attr("transform", function (d) {
                    d.panelPosX = newX;
                    d.panelPosY = newY;
                    return "translate(" + newX + "," + newY + ")"
                });
            };



            var mat = TP.Context().view[target].getSvg().selectAll("g.matrixInfo")
                .data(["matrix"])
                .enter()
                .append("g")
                .classed("matrixInfo", true)
                .attr("transform", function (d) {
                    return "translate(" + 500 + "," + 10 + ")";
                })
                .call(d3.behavior.drag()
                .on("drag", move))

            mat.append("rect")
                .classed("matrixInfo", true)
                .attr("width", overallSize + 20)
                .attr("height", overallSize + 30)
                .style("fill", TP.Context().defaultFillColor)
                .style("stroke-width", TP.Context().defaultBorderWidth)
                .style("stroke", TP.Context().defaultBorderColor)



            mat.append("text")
                .classed("matrixInfo", true)
                .text("X")
                .attr("dx", 208)
                .attr("dy", 18)
                .style("fill", "lightgray")
                .style("font-family", "EntypoRegular")
                .style("font-size", 30)
                .on("click", function (d) {
                    TP.Context().view[target].getSvg().selectAll("g.matrixInfo")
                        .data([])
                        .exit()
                        .remove();
                    gD = TP.Context().view[target].getGraphDrawing().draw()
                })
                .on("mouseover", function () {
                    d3.select(this).style("fill", "black")
                })
                .on("mouseout", function () {
                    d3.select(this).style("fill", "lightgray")
                })



            var brewerSeq = ['#FEEDDE', '#FDD0A2', '#FDAE6B', '#FD8D3C','#E6550D', '#A63603'];
            var index = function (x) {
                return Math.round(x * 5) % 6;
            };
            matrixData.forEach(function (d1, i) {
                d1.forEach(function (d2, j) {
                    piece = mat.append("rect")
                    piece.data(d2).enter()

                    piece.attr("class", "matrixUnit")
                        .classed("matrixInfo", true)
                        .attr("x", i * indSize + 10)
                        .attr("y", j * indSize + 18)
                        .attr("width", indSize)
                        .attr("height", indSize)
                        .style("fill", function () {
                            if (d2[0] == -1) {
                                return "lightgray";
                            } else {
                                return brewerSeq[index(d2[1])];
                            }
                        })
                        .style("fill-opacity", 1)
                        .style("stroke", "black")
                        .style("stroke-width", 0)
                        .on("mouseover", function () {
                            if (d2[0] != -1) {
                                d3.select(this).style("stroke-width", 1);
                            };
                            objectReferences.InteractionObject.highlight(d2[0], i, j, target);
                        })
                        .on("mouseout", function () {
                            d3.select(this).style("stroke-width", 0);
                        })

                })
            })
        }
*/


        this.resetView = function (event) {
        	
        	var target = event.associatedData.source;
        	
            var cGraph = null
            var svg = null
			
			
            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();
			/*
            nodeDatum = svg.selectAll("g.node").data()
            // strangely the matrix that should be applied by transform is 
            //squared?! so we adapt the nodes values
            nodeDatum.forEach(function (d) {
                d.currentX = d.x;
                d.currentY = d.y;
            });

            svg.selectAll(".node,.link")
                .attr("transform", "translate(" + 0 + "," + 0 + ") scale(" + 1 + ")")
            svg.selectAll("text.node").style("font-size", function () {
                return 12;
            });*/
            
    		//if(TP.Context().view[target].getAssociatedView("catalyst") != null)      
	            //objectReferences.VisualizationObject.entanglementCaught(target, TP.Context().view[target].getAssociatedView("catalyst")[0].getID());

	        TP.Context().view[target].getGraphDrawing().rescaleGraph(cGraph);
	        	        
	        TP.Context().view[target].getGraphDrawing().changeLayout(cGraph,0);
	        
	            
	       	objectReferences.VisualizationObject.entanglementCaught(target);
        }




        this.resetSize = function (event) {
        	        	       	
        	var target = event.associatedData.source;
        	
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            cGraph.nodes().forEach(function (d) {
                d.viewMetric = 3;
            })
            
            TP.Context().view[target].getGraphDrawing().resize(cGraph, 0)
        }




		this.rotateGraph = function (event) {
			
			var target = event.associatedData.source;
			
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();
    
            TP.Context().view[target].getGraphDrawing().rotate(target,5)
        }
        
        this.arrangeLabels = function (event) {
        	
        	var target = event.associatedData.source;
        	
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();
            //assert(true, "ArrangeLabels appelé depuis arrangeLabels (wtf)")
            //console.log(target, svg, cGraph);
            TP.Context().view[target].getGraphDrawing().arrangeLabels();
        }

        this.bringLabelsForward = function (target) {
            if (!target)
                return

            var svg = null
            var cGraph = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();
            
            TP.Context().view[target].getGraphDrawing().bringLabelsForward();
        }



        this.showhideLabels = function (event) {
			
			var target = event.associatedData.source;
			
            if (!target)
                return

            var svg = null
            svg = TP.Context().view[target].getSvg();

            //eval("TP.Context().show_labels_" + target + " = ! TP.Context().show_labels_" + target);
            //TP.Context().tabShowLabels[target] = !TP.Context().tabShowLabels[target]
            TP.Context().view[target].setShowLabels(!TP.Context().view[target].getShowLabels());

            if (TP.Context().view[target].getShowLabels()) {
                svg.selectAll('text.node').attr("visibility", function (d) {
                    return "visible";
                });
                $('.ui-accordion-header').each(function(){if($(this).text()==='show labels'){$(this).text('hide labels')} })                
            } else {
                svg.selectAll('text.node').attr("visibility", function (d) {

                        d.labelVisibility = false;
                        return "hidden";

                });
                $('.ui-accordion-header').each(function(){if($(this).text()==='hide labels'){$(this).text('show labels')} })
            }
        }



        // This function rescales the graph data in order to fit the svg window
        // data, the graph data (modified during the function)
        this.rescaleGraph = function(data)
        {

                //console.log("should be rescaling graphe, here is the data: ", data);

                // these should be set as globale variables
                var buttonWidth = 0//130.0
                var frame = 10.0
                var w = TP.Context().width-(buttonWidth+2*frame)
                var h = TP.Context().height-(2*frame)
                if (data.nodes.length<=0) return
                
                var minX = data.nodes[0].x
                var maxX = data.nodes[0].x
                var minY = data.nodes[0].y
                var maxY = data.nodes[0].y

        
                data.nodes.forEach(function(d){if (d.x < minX){minX = d.x}; if (d.x > maxX){maxX = d.x}; if (d.y < minY){minY = d.y}; if (d.y > maxY){maxY = d.y};})
        
                //data.nodes.forEach(function(d){console.log("Point: ",d.x,' ', d.y)})

                var delta = 0.00000000000000000001 //to avoid division by 0
                scale = Math.min.apply(null, [w/(maxX-minX+delta), h/(maxY-minY+delta)])
        
                data.nodes.forEach(function(d){d.x = (d.x-minX)*scale+buttonWidth+frame; d.y = (d.y-minY)*scale+frame; d.currentX = d.x; d.currentY = d.y;})
        }




        this.sizeMapping = function (event) {
        	
        	var parameter = event.associatedData.parameter;
        	var idView = event.associatedData.idView;
        	var scales = event.associatedData.scales;
        	
            var cGraph = null;
            var svg = null;
            var scaleMin = null;
            var scaleMax = null
            if (scales!=null){scaleMin=scales.valMin0; scaleMax=scales.valMax0}


            svg = TP.Context().view[idView].getSvg();
            cGraph = TP.Context().view[idView].getGraph();

            TP.Context().view[idView].getGraphDrawing().nodeSizeMap(cGraph, 0, {metric:parameter, scaleMin:scaleMin ,scaleMax:scaleMax });
            objectReferences.VisualizationObject.entanglementCaught(idView);

        };


        this.colorMapping = function (parameter, graphName) {

            var cGraph = null;
            var svg = null;

            svg = TP.Context().view[graphName].getSvg();
            cGraph = TP.Context().view[graphName].getGraph();

            TP.Context().view[graphName].getGraphDrawing().nodeColorMap(cGraph, 0, parameter);

    		//if(TP.Context().view[graphName].getAssociatedView("catalyst") != null)      
	            //objectReferences.VisualizationObject.entanglementCaught(target, TP.Context().view[graphName].getAssociatedView("catalyst")[0].getID());
	            objectReferences.VisualizationObject.entanglementCaught(graphName);
        };


/********************************** ON GOING ***********************************/
        this.changeColor = function(graphName, elem, newcolor){
            var cGraph = null;
            var svg = null;
            svg = TP.Context().view[graphName].getSvg();
            cGraph = TP.Context().view[graphName].getGraph();

            TP.Context().view[graphName].getGraphDrawing().changeColor(graphName, cGraph, elem, newcolor);

        }
/********************************** ON GOING ***********************************/

        return __g__;
    }
    return {Visualization: Visualization};
})()
