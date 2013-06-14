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

            svg = TP.Context().view[target].getSvg();
            //assert(false, "creerLAAALLAAAAASSSSSOOO")
            graph = TP.Context().view[target].getGraph();
			/*
            if (target == "catalyst") {
                TP.Context().lasso_catalyst = new TP.Lasso(svg);
                myL = TP.Context().lasso_catalyst
            }

            if (target == "substrate") {
                TP.Context().lasso_substrate = new TP.Lasso(svg);
                myL = TP.Context().lasso_substrate
            }

            if (target == "combined") {
                TP.Context().lasso_combined = new TP.Lasso(svg);
                myL = TP.Context().lasso_combined
            }*/
           
           //TP.Context().tabLasso[target] = new TP.Lasso(svg);
           TP.Context().view[target].setLasso(new TP.Lasso(svg));
           myL = TP.Context().view[target].getLasso();


            var prevSelList = [];

            myL.canMouseUp = function (e) {
                if (!TP.Context().mouse_over_button)
                    this.mouseUp(e)
            }

            myL.canMouseMove = function (e) {
                if (!TP.Context().mouse_over_button)
                    this.mouseMove(e)
            }

            myL.canMouseDown = function (e) {
                if (!TP.Context().mouse_over_button)
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
                    	
                        if (TP.Context().view[target].getType() == "combined" && d._type != TP.Context().combined_foreground)
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
                        } else {/*
                            if (d._type == "catalyst")
                                return TP.Context().tabNodeColor["catalyst"];
                            else
                                return TP.Context().tabNodeColor["substrate"];*/
                            return TP.Context().view[target].getNodesColor();
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
                            assert(true, "ttttttttttttttttt111111111111111111111111111111111")
                            objectReferences.ClientObject.syncGraph(objectReferences.ClientObject.getSelection(target), target)
                        }
                    } else {
                        prevSelList.length = 0
                        prevSelList = selList.slice(0);
                        assert(true, "ttttttttttttttttt222222222222222222222222222222")
                        objectReferences.ClientObject.syncGraph(objectReferences.ClientObject.getSelection(target), target)
                    }
                } else {

				
					assert(true, "1");
					
					var combinedSvg = null;
					var catalystSvg = null;
					var substrateSvg = null;
					
					var combinedView = null;
					var catalystView = null;
					var substrateView = null;
					
					var combinedName = null;
					var catalystName = null;
					var substrateName = null;
					
					assert(true, "2");	
					
					if(TP.Context().view[target].getAssociatedView("catalyst") != null  || TP.Context().view[target].getType() == "catalyst"){
						catalystName = (TP.Context().view[target].getType() == "catalyst") ? target : TP.Context().view[target].getAssociatedView("catalyst")[0].getID();
						catalystView = TP.Context().view[catalystName];
						catalystSvg = (TP.Context().view[target].getType() == "catalyst") ? svg : catalystView.getSvg();
					}

					assert(true, "3");
					
					
					if(TP.Context().view[target].getAssociatedView("substrate") != null  || TP.Context().view[target].getType() == "substrate"){
						substrateName = (TP.Context().view[target].getType() == "substrate") ? target : TP.Context().view[target].getAssociatedView("substrate")[0].getID();;
						substrateView = TP.Context().view[substrateName];
						substrateSvg = (TP.Context().view[target].getType() == "substrate") ? svg : substrateView.getSvg();
					}
					
					assert(true, "4");

					if(TP.Context().view[target].getAssociatedView("combined") != null  || TP.Context().view[target].getType() == "combined"){
						combinedName = (TP.Context().view[target].getType() == "combined") ? target : TP.Context().view[target].getAssociatedView("combined")[0].getID();
						combinedView = TP.Context().view[combinedName];
						combinedSvg = (TP.Context().view[target].getType() == "combined") ? svg : combinedView.getSvg();
					}
					/*
					var result1 = TP.Context().view[target].getAssociatedView("catalyst") != null;
					var result2 = TP.Context().view[target].getType() == "catalyst";
					
					
					
					catalystName = (result1 > result2) ? ((TP.Context().view[target].getAssociatedView("catalyst")[0].viewInitialized() == 1) ? TP.Context().view[target].getAssociatedView("catalyst")[0].getID() : null) : target;
					catalystView = (catalystName != null) ? TP.Context().view[catalystName] : null;
					catalystSvg =  (catalystView != null) ? catalystView.getSvg() : null;
					
					assert(true, catalystName);
					assert(true, catalystView);
					assert(true, catalystSvg);
					
					result1 = TP.Context().view[target].getAssociatedView("substrate") != null;
					result2 = TP.Context().view[target].getType() == "substrate";
					
					substrateName = (result1 > result2) ? ((TP.Context().view[target].getAssociatedView("substrate")[0].viewInitialized() == 1) ? TP.Context().view[target].getAssociatedView("substrate")[0].getID() : null) : target;
					substrateView = (substrateName != null) ? TP.Context().view[substrateName] : null;
					substrateSvg =  (substrateView != null) ? substrateView.getSvg() : null;

					assert(true, substrateName);
					assert(true, substrateView);
					assert(true, substrateSvg);		

					result1 = TP.Context().view[target].getAssociatedView("combined") != null;
					result2 = TP.Context().view[target].getType() == "combined";
									
					
					combinedName = (result1 > result2) ? ((TP.Context().view[target].getAssociatedView("combined")[0].viewInitialized() == 1) ? TP.Context().view[target].getAssociatedView("combined")[0].getID() : null) : target;
					combinedView = (combinedName != null) ? TP.Context().view[combinedName] : null;
					combinedSvg =  (combinedView != null) ? combinedView.getSvg() : null;

					assert(true, combinedName);
					assert(true, combinedView);
					assert(true, combinedSvg);
					
					*/
					if(catalystSvg != null){						

					
						var catalystNodeColor = catalystView.getNodesColor();
		
	                    catalystSvg.selectAll("g.node")
	                        .style('opacity', 1.0)
	                        .select("circle.node")
	                        .style('fill', catalystNodeColor)	                        
	                        .style("stroke-width", 0);
	                    catalystSvg.selectAll("g.node")
	                        .select("text.node")
	                        .attr("visibility", "visible");
	                    catalystSvg.selectAll("g.node")
	                        .select("rect.node")
	                        .style('fill',function(d){
	                        	if(substrateSvg != null)
	                        		return substrateView.getNodesColor();
	                        	else
	                        		return catalystNodeColor;
	                        	})
	                        .style("stroke-width", 0);
	                    catalystSvg.selectAll("g.link")
	                        .style('opacity', 1.0)
	                        .select("path.link")
	                        .style('stroke', catalystView.getLinksColor())
							.style('stroke-width', 1)
							
						
	                    //objectReferences.VisualizationObject.resetSize(catalystName);
	                    catalystSvg.selectAll("text.node").style("opacity", 1)
	                    objectReferences.VisualizationObject.arrangeLabels(catalystName);

                   }
                   
                   if(substrateSvg != null){ 
						
                  		var substrateNodeColor = substrateView.getNodesColor();                 

	                    substrateSvg.selectAll("g.node")
	                        .style('opacity', 1.0)
	                        .select("circle.node")
	                        .style('fill', function(d){
	                        	if(catalystSvg != null)	                        	
	                        		return catalystView.getNodesColor()
	                        	else
	                        		return substrateNodeColor;	                        
	                        })
	                        .style("stroke-width", 0);
	                    substrateSvg.selectAll("g.node")
	                        .select("text.node")
	                        .attr("visibility", "visible");
	                    substrateSvg.selectAll("g.node")
	                        .select("rect.node")
	                        .style('fill', substrateNodeColor)
	                        .style("stroke-width", 0);
	                    substrateSvg.selectAll("g.link")
	                        .style('opacity', 1.0)
	                        .select("path.link")
	                        .style('stroke', substrateView.getLinksColor())
	                        .style('stroke-width', 1)


	                    
	                    //objectReferences.VisualizationObject.resetSize(substrateName);
	                    substrateSvg.selectAll("text.node").style("opacity", 1)
	                    objectReferences.VisualizationObject.arrangeLabels(substrateName);

                   }

				   if(combinedSvg != null && catalystSvg != null && substrateSvg != null){

							
							var combinedNodeColor = combinedView.getNodesColor();

		                    combinedSvg.selectAll("g.node")
		                        .style('opacity', 1.0)
		                        .select("circle.node")
		                        .style('fill', function(d){
		                        	if(catalystSvg != null)
		                        		return catalystSvg.getNodesColor();		                        	
		                        	else
		                        		return combinedNodeColor;		                        	
		                        	})
		                        .style("stroke-width", 0);
		                        
		                    combinedSvg.selectAll("g.node")
		                        .select("text.node")
		                        .attr("visibility", "visible");
		                        
		                    combinedSvg.selectAll("g.node")
		                        .select("rect.node")
		                        .style('fill', function(d){
		                        	if(substrateSvg != null)
		                        		return substrateSvg.getNodesColor();
		                        	else
		                        		return combinedNodeColor;
		                        	})
		                        .style("stroke-width", 0);
	                        
	                    combinedSvg.selectAll("g.link")
	                        .style('opacity', 1.0)
	                        .select("path.link")
	                        .style('stroke', combinedNodeColor)
							.style('stroke-width', 1)
						
						//objectReferences.VisualizationObject.resetSize(combinedName);
						combinedSvg.selectAll("text.node").style("opacity", 1)
												
					}
					/*
                    objectReferences.VisualizationObject.resetSize("substrate");
                    objectReferences.VisualizationObject.resetSize("catalyst");
                    objectReferences.VisualizationObject.resetSize("combined");*/

                    prevSelList = selList.slice(0);
                    
                    if(catalystSvg != null)
                   		TP.ObjectReferences().VisualizationObject.sizeMapping("entanglementIndice", catalystName);   
                   assert(true, "15");
                                   	
                	d3.select("#svg_"+target).select("g.brush").select("polygon").style('fill', "white");
                	
                    //console.log("warning: the selection list is empty");

                    //TP.Context().view["catalyst"].getSvg().selectAll("text.node").style("opacity", 1)
                    //TP.Context().view["substrate"].getSvg().selectAll("text.node").style("opacity", 1)
                    //TP.Context().view["combined"].getSvg().selectAll("text.node").style("opacity", 1)
                    
                    //assert(true, "arrangeLabels appele depuis le lasso");    
                    //objectReferences.VisualizationObject.arrangeLabels("substrate");
                    //objectReferences.VisualizationObject.arrangeLabels("catalyst"); 
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

            svg = TP.Context().view[target].getSvg();
            graph = TP.Context().view[target].getGraph();

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
                    //return TP.Context().tabNodeColor["substrate"];
                    //return TP.Context().view[d._type].getNodesColor();
                    var targetTmp = TP.Context().view[target].getAssociatedView(d._type)[0];
                    return TP.Context().view[targetTmp].getNodesColor();
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

            mySvg = TP.Context().view[target].getSvg();
/*
            if (target == "catalyst") {
                myL = TP.Context().lasso_catalyst
            }

            if (target == "substrate") {
                myL = TP.Context().lasso_substrate
            }

            if (target == "combined") {
                myL = TP.Context().lasso_combined
            }*/
           
           	myL = TP.Context().view[target].getLasso();
           
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
            svg = TP.Context().view[target].getSvg();

            svg.on("mouseup", null);
            svg.on("mousedown", null);
            svg.on("mousemove", null);
            
            

        }
        


this.runZoom = function(target, deltaZoom, mousePos){
     
	 if (!TP.Context().view[target].getMoveMode())            
	     return;
	     
	 var cible = d3.select("#svg_"+target)[0][0]
	 
	 var cGraph = TP.Context().view[target].getGraph();
	 var svg = TP.Context().view[target].getSvg();
	 var time = 0;
	 
	 var delta = null;
	 
	 if(deltaZoom == null)
	 	delta = event.wheelDelta;
	 else
	 	delta = deltaZoom;

	 
	 var mouseOrigin = [];
	 
	 if(mousePos == null)
		 mouseOrigin = d3.mouse(cible);
	 else{
	 	 mouseOrigin[0] = mousePos[0];
	 	 mouseOrigin[1] = mousePos[1];
	 }
	 
	 var scale = 0;
					
	 if (delta > 0)
	 scale = 1.1;
	 else
	 scale = 0.9;

	 var data_translate = TP.Context().view[target].getDataTranslation();//TP.tabDataTranslation[target]//eval("TP.Context().data_translation_"+target);
				
	 var node = svg.selectAll("g.node")
	 .data(cGraph.nodes(),function(d){
		 d.x = d.currentX;
		 d.y = d.currentY;
		 d.x = ((((d.x)-mouseOrigin[0])*scale)+mouseOrigin[0]);
		 d.y = ((((d.y)-mouseOrigin[1])*scale)+mouseOrigin[1]);
	     d.currentX = d.x;
	     d.currentY = d.y;
	     return d.baseID;
	 })
	 .transition().delay(time)    
	                     			
	 node.select("circle")	 
	 .attr("cx", function(d){
	       return d.x;
	 })
	 .attr("cy", function(d){return d.y;})
            	
	 node.select("rect")
	 .attr("x", function(d){
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
	                return d.baseID;
	          })
	          .transition().delay(time)
	
	               //label.select("text")
	          .attr("dx", function(d){
	               return d.x;
	          }) 
	          .attr("dy", function(d){return d.y;})
	                                      
	 event.preventDefault();

}        
        
        
        
        // Adds a zoom interactor to a specific svg target as callbacks to its 
        //mouse events.       
        this.addZoom = function(target){
        	
			if (!target)
               return

            var svg = null;
            var cGraph = null;
            
            svg = TP.Context().view[target].getSvg();
			cGraph = TP.Context().view[target].getGraph();
				
			function movingZoom(target){
				
	            if (!target)
	                 return
	
				var translation_tab = TP.Context().view[target].getDataTranslation();//TP.tabDataTranslation[target];//eval("TP.Context().data_translation_"+target);
				
				data_translation = [translation_tab[0],translation_tab[1]]
	                
	            svg.call(d3.behavior.drag()
                    .on("drag", function (){
					
	                if (!TP.Context().view[target].getMoveMode())	           
                        return;
	              	        
	                data_translation[0] = d3.event.dx + data_translation[0];
	                data_translation[1] = d3.event.dy + data_translation[1];
	               
	                var nodeDatum = svg.selectAll("g.node").data()
	                
	                nodeDatum.forEach(function (d) {
	                    d.currentX = (d.x + data_translation[0]);
	                    d.currentY = (d.y + data_translation[1]); 
	                });
	                
	                
	               svg.selectAll("rect")
	               .data(nodeDatum, function(d){return d.baseID;})
	               .attr("x", function(d){return d.currentX})
	               .attr("y", function(d){return d.currentY})
	               
	               svg.selectAll("circle")
	               .data(nodeDatum, function(d){return d.baseID;})
	               .attr("cx", function(d){return d.currentX})
	               .attr("cy", function(d){return d.currentY})
	               
	               svg.selectAll("text.node")
	               .data(nodeDatum, function(d){return d.baseID;})
	               .attr("dx", function(d){return d.currentX})
	               .attr("dy", function(d){return d.currentY})	               
	               
	               
	               svg.selectAll("g.link")
                  	.data(cGraph.links(),function(d){return d.baseID})
                   	.select("path")
                    .attr("d", function(d) {
                       	return "M"+d.source.currentX+" "+d.source.currentY+" L"+d.target.currentX+" "+d.target.currentY; 
                    })
	                
	               //svg.selectAll("g.link,text.node").attr("transform", "translate(" + data_translation[0]+ "," + data_translation[1] + ")") 
	               //eval("TP.Context().data_translation_"+target+" = data_translation;");
	               //TP.tabDataTranslation[target] = data_translation;
	               //TP.Context().view[target].setDataTranslation(data_translation);
                })
                .on("dragend", function(){
					
					var nodeDatum = svg.selectAll("g.node").data()
	                
	                nodeDatum.forEach(function (d) {
	                   d.x = d.currentX;
	                   d.y = d.currentY; 
	                });
	                
	                data_translation = [0,0];
				})
                
                );
       		}

       		
			svg.on("mousewheel", function(){
					TP.Context().Interaction().runZoom(target, null, null);
			});	
			svg.on("drag", movingZoom(target));
			
			/*
			svg.on("keydown", function(){
					console.log(d3.event.keyCode);
				
				 switch (d3.event.keyCode) {
					case 8: {console.log("space");}
					case 46: { // delete
						console.log("delete");
					}
				}
				
				
			})*/
			
}


        // Removes the lasso interactor from a specific svg target's callbacks 
        // to its mouse events.
        // target, the string value of the target svg view         
        this.removeZoom = function (target) {
            if (!target)
                return

            var svg = null
            svg = TP.Context().view[target].getSvg();


            svg.on("mousedown.drag", null)
          	   .on("mousewheel",null);
        }


        this.toggleCatalystSyncOperator = function (target) {
        	console.log(target)
            if (TP.Context().tabOperator[target] == "OR") { //befrore, there was only catalyst
                TP.Context().tabOperator[target] = "AND";
                $('.ui-accordion-header').each(function(){if($(this).text()==='Operator OR'){$(this).text('Operator AND')}})
            } else {
                TP.Context().tabOperator[target] = "OR"
                $('.ui-accordion-header').each(function(){if($(this).text()==='Operator AND'){$(this).text('Operator OR')}})
            }
            /*
            TP.Context().view[target].getSvg().selectAll("g.toggleCatalystOp")
                .select("text")
                .text("operator " + TP.Context().tabOperator[target])*/
        }


        this.highlight = function (data, i, j, target) { //befrore, there was only catalyst
            TP.Context().view[target].getSvg().selectAll(TP.Context().view[target].getViewNodes()+".node")
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

            TP.Context().view[target].getSvg().selectAll("path.link")
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


		this.delSelection = function (target){
			
			assert("")
			
            svg = TP.Context().view[target].getSvg(); //before, it was only svg_substrate
            graph = TP.Context().view[target].getGraph();
      
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
			
			var typeGraph = TP.Context().view[target].getType();
			
            graph.nodes(newNodes, typeGraph);
            graph.links(newLinks, typeGraph);
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
