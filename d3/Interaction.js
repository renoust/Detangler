/************************************************************************
 * This module contains the interactors with the graph
 * (e.g. node selection and zoom)
 * @requires d3.js
 * @authors Guy Melancon, Benjamin Renoust, Damien Rosmorduc
 * @created May 2012
 ***********************************************************************/

(function () {

    import_class('context.js', 'TP');
    import_class("objectReferences.js", "TP");
    import_class('lasso.js', 'TP');

    var Interaction = function () {
        var __g__ = this;

        var contxt = TP.Context();

        var objectReferences = TP.ObjectReferences();


        // This function creates a lasso brush interactor for a specific 
        // target, it also redefined
        // the brush intersection function, and applies actions to the 
        // selected target.
        // target, the string value of the target svg view         
        this.createLasso = function (target) {
            if (!target)
                return

            var svg = null
            var graph = null
            var myL = null

            svg = contxt.getViewSVG(target);
            graph = contxt.getViewGraph(target);
			/*
            if (target == "catalyst") {
                contxt.lasso_catalyst = new TP.Lasso(svg);
                myL = contxt.lasso_catalyst
            }

            if (target == "substrate") {
                contxt.lasso_substrate = new TP.Lasso(svg);
                myL = contxt.lasso_substrate
            }

            if (target == "combined") {
                contxt.lasso_combined = new TP.Lasso(svg);
                myL = contxt.lasso_combined
            }*/
           
           contxt.tabLasso[target] = new TP.Lasso(svg);
           myL = contxt.tabLasso[target];


            var prevSelList = [];

            myL.canMouseUp = function (e) {
                if (!contxt.mouse_over_button)
                    this.mouseUp(e)
            }

            myL.canMouseMove = function (e) {
                if (!contxt.mouse_over_button)
                    this.mouseMove(e)
            }

            myL.canMouseDown = function (e) {
                if (!contxt.mouse_over_button)
                    this.mouseDown(e)
            }

            // redefines the intersection function
            // applies keyboard modifiers, control extends the selection, 
            // shift removes from the currect selection
            // once the selection is made, it applies the synchronization 
            // function syncGraph() to the selected nodes
            // selection colors are hardcoded but this should be changed
            myL.checkIntersect = function () {
                var __g = this
                var selList = []
                var e = window.event
                svg.selectAll("g.node")
                    .classed("selected", function (d) {
                        if (target == "combined" && d._type != contxt.combined_foreground)
                            return false;
                        //console.log('current obj', d)
                        var x = 0;
                        var y = 0;
                        if (!('currentX' in d)) {
                            x = d.x;
                            y = d.y;
                        } else {
                            x = d.currentX;
                            y = d.currentY;
                        }
                        var pointArray = [];
                        if (__g.isLasso()) {
                            pointArray = __g.pointList;
                        } else {
                            if (__g.pointList.length > 0) {
                                var p0 = __g.pointList[0];
                                var p1 = __g.pointList[__g.pointList.length - 1];
                                pointArray = [
                                                [p0[0], p0[1]],
                                                [p0[0], p1[1]],
                                                [p1[0], p1[1]],
                                                [p1[0], p0[1]]
                                            ];
                            } else {
                                pointArray = []
                            }
                        }


                        if ((e.ctrlKey || e.metaKey) && d.selected == true)return true;

                        var intersects = __g.intersect(pointArray, x, y)
                        //if (intersects) console.log("node intersects", d)

                            if (e.shiftKey && intersects) {
                                //console.log("shift pressed and intersects so return false");
                                d.selected = false;
                            } else if (e.shiftKey && !intersects && d.selected==true){
                                //console.log("shift pressed and doesnt intersects and true so return true");
                                d.selected = true;
                            } else {
                                d.selected = intersects;
                            }
                            //console.log("returning selection:", d.selected)
                            return d.selected
                    })
                    .select("g.glyph")
                    .select(".node")
                    .style('fill', function (d) {
                        if (e.ctrlKey && d.selected == true) {
                            selList.push(d.baseID)
                            return 'red';
                        }
                        if (d.selected) {
                            selList.push(d.baseID)
                            return 'red';
                        } else {
                            if (d._type == "catalyst")
                                return contxt.tabNodeColor["catalyst"];
                            else
                                return contxt.tabNodeColor["substrate"];
                        }
                    });

                selList.sort()
                //console.log("selection list: ", selList, " with length ", selList.length)

                if (selList.length > 0) {
                    if (selList.length == prevSelList.length) {
                        var i = 0;
                        var iMax = selList.length;
                        while (i < iMax && selList[i] == prevSelList[i])
                            i++;
                        if (i != iMax) {
                            prevSelList.length = 0
                            prevSelList = selList.slice(0);
                            objectReferences.ClientObject.syncGraph(objectReferences.ClientObject.getSelection(target), target)
                        }
                    } else {
                        prevSelList.length = 0
                        prevSelList = selList.slice(0);
                        objectReferences.ClientObject.syncGraph(objectReferences.ClientObject.getSelection(target), target)
                    }
                } else {


                    contxt.tabSvg["svg_catalyst"].selectAll("g.node")
                        .style('opacity', 1.0)
                        .select("circle.node")
                        .style('fill', contxt.tabNodeColor["catalyst"])
                        .style("stroke-width", 0);
                    contxt.tabSvg["svg_catalyst"].selectAll("g.node")
                        .select("text.node")
                        .attr("visibility", "visible");
                    contxt.tabSvg["svg_catalyst"].selectAll("g.node")
                        .select("rect.node")
                        .style('fill', contxt.tabNodeColor["substrate"])
                        .style("stroke-width", 0);
                    contxt.tabSvg["svg_catalyst"].selectAll("g.link")
                        .style('opacity', 1.0)
                        .select("path.link")
                        .style('stroke', contxt.tabLinkColor["catalyst"]);
                    contxt.tabSvg["svg_substrate"].selectAll("g.node")
                        .style('opacity', 1.0)
                        .select("circle.node")
                        .style('fill', contxt.tabNodeColor["catalyst"])
                        .style("stroke-width", 0);
                    contxt.tabSvg["svg_substrate"].selectAll("g.node")
                        .select("text.node")
                        .attr("visibility", "visible");
                    contxt.tabSvg["svg_substrate"].selectAll("g.node")
                        .select("rect.node")
                        .style('fill', contxt.tabNodeColor["substrate"])
                        .style("stroke-width", 0);
                    contxt.tabSvg["svg_substrate"].selectAll("g.link")
                        .style('opacity', 1.0)
                        .select("path.link")
                        .style('stroke', contxt.tabLinkColor["substrate"]);
                    contxt.tabSvg["svg_combined"].selectAll("g.node")
                        .style('opacity', 1.0)
                        .select("circle.node")
                        .style('fill', contxt.tabNodeColor["catalyst"])
                        .style("stroke-width", 0);
                    contxt.tabSvg["svg_combined"].selectAll("g.node")
                        .select("text.node")
                        .attr("visibility", "visible");
                    contxt.tabSvg["svg_combined"].selectAll("g.node")
                        .select("rect.node")
                        .style('fill', contxt.tabNodeColor["substrate"])
                        .style("stroke-width", 0);
                    contxt.tabSvg["svg_combined"].selectAll("g.link")
                        .style('opacity', 1.0)
                        .select("path.link")
                        .style('stroke', contxt.tabLinkColor["combined"]);

                    objectReferences.VisualizationObject.resetSize("substrate");
                    objectReferences.VisualizationObject.resetSize("catalyst");
                    objectReferences.VisualizationObject.resetSize("combined");
                    prevSelList = selList.slice(0);
                    TP.ObjectReferences().VisualizationObject.sizeMapping("entanglementIndice", 'catalyst')     
                    //console.log("warning: the selection list is empty");

                    contxt.tabSvg["svg_catalyst"].selectAll("text.node").style("opacity", 1)
                    contxt.tabSvg["svg_substrate"].selectAll("text.node").style("opacity", 1)
                    contxt.tabSvg["svg_combined"].selectAll("text.node").style("opacity", 1)
                    
                    //assert(true, "arrangeLabels appele depuis le lasso");    
                    objectReferences.VisualizationObject.arrangeLabels("substrate");
                    objectReferences.VisualizationObject.arrangeLabels("catalyst"); 
                }
            }
        }


        // This function associate a d3.svg.brush element to select nodes in a 
        // view target, the string value of the target svg view 
        // This function is deprecated but one can activate it anytime
        this.addBrush = function (target) {
            var svg = null
            var graph = null

            if (!target)
                return

            svg = contxt.getViewSVG(target);
            graph = contxt.getViewGraph(target);

            var h = svg.attr("height")
            var w = svg.attr("width")
            var buttonWidth = 131

            var xScale = d3.scale.linear().range([buttonWidth, w])
            var yScale = d3.scale.linear().range([0, h])

            //console.log("svg element: ", svg, w, h)


            var brush = svg.append("g")
                .attr("class", "brush" + target)
                .call(d3.svg.brush()
                .x(xScale)
                .y(yScale)
                .on("brushstart", brushstart)
                .on("brush", brushmove)
                .on("brushend", brushend))
                .style('stroke', 'black')
                .style('stroke-width', 2)
                .style('fill-opacity', .125)
                .style('shape-rendering', 'crispEdges')



                function brushstart() {
                    svg.classed("selecting", true);
                }

            var prevSelList = [];

            // This function will check the nodes intersections and synchronize 
            //accordingly

            function brushmove() {
                var e = d3.event.target.extent();
                var node = svg.selectAll("g.node")
                var selList = []
                node.classed("selected", function (d) {
                    wNorm = w - buttonWidth
                    d.selected=e[0][0]<=(d.currentX-buttonWidth+1)/wNorm && (d.currentY - buttonWidth + 1) / wNorm <= e[1][0] && e[0][1] <= d.currentY / h && d.currentY / h <= e[1][1];
                    return d.selected;
                })
                .select("circle.node")
                .style('fill', function (d) {
                    if (d.selected) {
                        selList.push(d.baseID);
                        return 'red';
                    }
                    return contxt.tabNodeColor["substrate"];
                })

                selList.sort()
                if (selList.length > 0) {
                    if (selList.length == prevSelList.length) {
                        var i = 0;
                        var iMax = selList.length;
                        while (i < iMax && selList[i] == prevSelList[i])
                            i++;
                        if (i != iMax) {
                            prevSelList.length = 0
                            prevSelList = selList.slice(0);
                            objectReferences.ClientObject.syncGraph(objectReferences.ClientObject.getSelection(target),target)
                        }
                    } else {

                        prevSelList.length = 0
                        prevSelList = selList.slice(0);
                        objectReferences.ClientObject.syncGraph(
                            objectReferences.ClientObject
                                .getSelection(target),target)
                    }
                }
            }

            function brushend() {
                svg.classed("selecting", !d3.event.target.empty());
            }
        }


        // Applies the lasso interactor to a specific svg target as callback
        // to the mouse events.
        // target, the string value of the target svg view         
        this.addLasso = function (target) {
            if (!target)
                return

            var mySvg = null
            var myL = null

            mySvg = contxt.getViewSVG(target);
/*
            if (target == "catalyst") {
                myL = contxt.lasso_catalyst
            }

            if (target == "substrate") {
                myL = contxt.lasso_substrate
            }

            if (target == "combined") {
                myL = contxt.lasso_combined
            }*/
           
           	myL = contxt.tabLasso[target];
           
            mySvg.on("mouseup", function (d) {myL.canMouseUp(d3.mouse(this))});
            mySvg.on("mousedown", function (d) {myL.canMouseDown(d3.mouse(this))});
            mySvg.on("mousemove", function (d) {myL.canMouseMove(d3.mouse(this))});
        }


        // Removes the lasso interactor from a specific svg target's callbacks 
        //to its mouse events.
        // target, the string value of the target svg view         
        this.removeLasso = function (target) {

			//console.log("calling remove LASSO"); 
            if (!target)
                return

            var svg = null
            svg = contxt.getViewSVG(target);

            svg.on("mouseup", null);
            svg.on("mousedown", null);
            svg.on("mousemove", null);
        }


        // Adds a zoom interactor to a specific svg target as callbacks to its 
        //mouse events.       
        this.addZoom = function(target){

			if (!target)
               return

            var svg = null
            var cGraph = null
            svg = contxt.getViewSVG(target);
			cGraph = contxt.getViewGraph(target);
				
			function movingZoom(target){
	            if (!target)
	                 return
	
				var data_translation = TP.tabDataTranslation[target];//eval("contxt.data_translation_"+target);
	                
	            svg.call(d3.behavior.drag()
                    .on("drag", function (){
					
	                if (!TP.Context().tabMoveMode[target])	           
                        return;
	              	               
	                data_translation[0] = d3.event.dx + data_translation[0];
	                data_translation[1] = d3.event.dy + data_translation[1];
	               
	                var nodeDatum = svg.selectAll("g.node").data()
	                
	                nodeDatum.forEach(function (d) {
	                    d.currentX = (d.x + data_translation[0]);
	                    d.currentY = (d.y + data_translation[1]);
	                });
	                
	               svg.selectAll("g.node,g.link,text.node").attr("transform", "translate(" + data_translation[0]+ "," + data_translation[1] + ")") 
	               //eval("contxt.data_translation_"+target+" = data_translation;");
	               TP.tabDataTranslation[target] = data_translation;
                }));
       		}

       		
			svg.on("mousewheel", function(){               
                if (!TP.Context().tabMoveMode[target])            
                    return;
            
				var time = 0;
				var delta = event.wheelDelta;
				var mouseOrigin = d3.mouse(this);
				var scale = 0;
				
				if (delta > 0)
					scale = 1.1;
				else
					scale = 0.9;
					
				var data_translate = TP.tabDataTranslation[target]//eval("contxt.data_translation_"+target);
				
				var node = svg.selectAll("g.node")
                    .data(cGraph.nodes(),function(d){
                   	    d.x = ((((d.x+data_translate[0])-mouseOrigin[0])*scale)+mouseOrigin[0])-data_translate[0];
                        d.y = ((((d.y+data_translate[1])-mouseOrigin[1])*scale)+mouseOrigin[1])-data_translate[1];
                        d.currentX = d.x;
                   	    d.currentY = d.y;
                   	    return d.baseID;
                   })
                   .transition().delay(time)
                        			
                node.select("circle")
                   	.attr("cx", function(d){
                        d.currentX = d.x;
                   		d.currentY = d.y;
                   		return d.x;
                    })
                   	.attr("cy", function(d){return d.y;})
                                	
                node.select("rect")
                   	.attr("x", function(d){
                        d.currentX = d.x; 
                		d.currentY = d.y;
                		return d.x;
                    })
                    .attr("y", function(d){return d.y;})
                    
                var link = svg.selectAll("g.link")
                  	.data(cGraph.links(),function(d){return d.baseID})
                   	.transition().delay(time)
                   	.select("path")
                    .attr("d", function(d) {
                       	return "M"+d.source.x+" "+d.source.y+" L"+d.target.x+" "+d.target.y; 
                    })
                                							
                var label = svg.selectAll("text.node")
                	.data(cGraph.nodes(),function(d){
                        d.currentX = d.x; 
                        d.currentY = d.y; 
                        return d.baseID;
                    })
                   	.transition().delay(time)

               //label.select("text")
               		.attr("dx", function(d){
                        d.currentX = d.x; 
                      	d.currentY = d.y;
                       	return d.x;
                    }) 
                    .attr("dy", function(d){return d.y;})                    
                event.preventDefault();
			});	
			svg.on("mousedown", movingZoom(target));
		}


        // Removes the lasso interactor from a specific svg target's callbacks 
        // to its mouse events.
        // target, the string value of the target svg view         
        this.removeZoom = function (target) {
            if (!target)
                return

            var svg = null
            svg = contxt.getViewSVG(target);


            svg.on("mousedown.drag", null)
          	   .on("mousewheel",null);
        }


        this.toggleCatalystSyncOperator = function () {
            if (TP.Context().tabOperator["catalyst"] == "OR") {
                TP.Context().tabOperator["catalyst"] = "AND";
            } else {
                TP.Context().tabOperator["catalyst"] = "OR"
            }
            contxt.tabSvg["svg_catalyst"].selectAll("g.toggleCatalystOp")
                .select("text")
                .text("operator " + TP.Context().tabOperator["catalyst"])
        }


        this.highlight = function (data, i, j) {
            contxt.tabSvg["svg_catalyst"].selectAll("circle.node")
                .style("opacity", function (d) {
                    if (i == j && d.baseID == data) {
                        return 1
                    } else {
                        return .25;
                    }
                })
                .style("stroke", function (d) {
                    if (i == j && d.baseID == data) {
                        return "red"
                    } else {
                        return "gray";
                    }
                })
                .style("stroke-width", function (d) {
                    if (i == j && d.baseID == data) {
                        return 5
                    } else {
                        return 0;
                    }
                })

            contxt.tabSvg["svg_catalyst"].selectAll("path.link")
                .style("stroke", function (d) {
                    if (i != j && d.baseID == data) {
                        return "red"
                    } else {
                        return "gray";
                    }
                })
                .style("stroke-width", function (d) {
                    if (i != j && d.baseID == data) {
                        return 5
                    } else {
                        return 1;
                    }
                })
                .style("opacity", function (d) {
                    if (i != j && d.baseID == data) {
                        return 1
                    } else {
                        return .25;
                    }
                })
        }


		this.delSelection = function (){

            svg = TP.Context().tabSvg["svg_substrate"];
            graph = TP.Context().tabGraph["graph_substrate"];
      
            newLinks = []
            newNodes = []
            graph.links().forEach(function(d){
                if(!(TP.Context().syncNodes.indexOf(d.source.baseID) != -1 || TP.Context().syncNodes.indexOf(d.target.baseID) != -1)){
                    newLinks.push(d); 
                }        
            })

            graph.nodes().forEach(function(d){
                if(!(TP.Context().syncNodes.indexOf(d.baseID) != -1)){
                    newNodes.push(d); 
                }
            })

            graph.nodes(newNodes, "substrate");
            graph.links(newLinks, "substrate");
            graph.edgeBinding()

            svg.selectAll("g.node").data(graph.nodes(), function(d){return d.baseID}).exit().remove();
            svg.selectAll("text.node").data(graph.nodes(), function(d){return d.baseID}).exit().remove();
            svg.selectAll("g.link").data(graph.links(), function(d){return d.baseID}).exit().remove();

            //svg.selectAll("g.node").data(graph.nodes())
            //  .attr("visibility", function(d){if(TP.Context().syncNodes.indexOf(d.baseID) != -1){return "hidden"}else{return "visible"}})
            //svg.selectAll("g.link").data(graph.links())
            //  .attr("visibility", function(d){if(TP.Context().syncNodes.indexOf(d.source.baseID) != -1 || TP.Context().syncNodes.indexOf(d.target.baseID) != -1){return "hidden"}else{return "visible"}})
        
      
            //console.log(TP.Context().syncNodes);
        } 

        return __g__;

    }
    return {Interaction: Interaction};
})()
