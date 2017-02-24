/************************************************************************
 * This container takes care of the actual drawing of the graph (e.g.
 * nodes and links) and of its direct interaction
 * This structure compiles the drawing functions, parameters
 * _graph, the graph object to manipulate
 * _svg, the svg object to manipulate the graph
 *
 * something to check with the currentX/currentY association that is
 * repeated here not harmful yet, but doesn't seem to be really
 * useful either.
 *
 * @requires d3.js
 * @authors Guy Melancon, Benjamin Renoust, Damien Rosmorduc
 * @created May 2012
 ***********************************************************************/


var TP = TP || {};
(function () {


    var GraphDrawing = function (_graph, _svg, currentViewID) {

        // g, the return variable
        // cGraph, the current graph
        // svg, the current svg
        var g = {};
        g.cGraph = _graph;
        g.svg = _svg;
        g.linkContainer = g.svg.selectAll("g.linkContainer").data([1])
            .enter()
                .append("g").attr("class", "linkContainer");

        g.nodeContainer = g.svg.selectAll("g.nodeContainer").data([1])
            .enter()
                .append("g").attr("class", "nodeContainer");

        g.labelContainer = g.svg.selectAll("g.labelContainer").data([1])
            .enter()
                .append("g").attr("class", "labelContainer");


        var contxt = TP.Context();


        // this function draws the graph, first the links then the nodes
        g.draw = function (_forceLinks) {
            if (g.cGraph.links().length < 1000 || _forceLinks != undefined) {
                g.drawLinks();
            }


            g.drawNodes(TP.Context().view[currentViewID].getViewNodes());
            g.recenterNodes();
            
            g.drawLabels();
        };


        g.moveNode = function (tabb) {
            //var dragTarget = d3.select(this);
            var dragTarget = tabb[0];
            var circleTarget = dragTarget.select("circle.node");
            var rectTarget = dragTarget.select("rect.node");
            var currentNode = dragTarget.data()[0];
            var labelTarget = g.labelContainer.select("text.node" + currentNode.baseID);

            if (tabb[1] == null) {
                var posX = d3.event.dx;
                var posY = d3.event.dy;
                currentNode.x += posX;
                currentNode.y += posY;
                currentNode._currentX += posX;
                currentNode._currentY += posY;
            } else {
                currentNode.x = tabb[1];
                currentNode.y = tabb[2];
                currentNode._currentX = tabb[3];
                currentNode._currentY = tabb[4];
            }

            var currentBaseID = currentNode.baseID;

            if (circleTarget) {
                circleTarget
                    .attr("cx", function () {
                        return currentNode.x;
                    })
                    .attr("cy", function () {
                        return currentNode.y;
                    });
            }

            if (rectTarget) {
                rectTarget
                    .attr("x", function () {
                        return currentNode.x;
                    })
                    .attr("y", function () {
                        return currentNode.y;
                    });
            }

            labelTarget
                .attr("dx", function () {
                    return currentNode.x;
                })
                .attr("dy", function () {
                    return currentNode.y;
                });

            var links = g.linkContainer.selectAll("g.link").data(g.cGraph.links(), function (d) {
                return d.baseID;
            });
            links.select("path.link")
                .attr("d", function (d) {
                    return g.drawOneLink(d);
                })
                .style("stroke-width", function (d) {
                    return 1;
                });
        };


        g.dragNode = function (_event) {
            var tab1 = [];
            tab1[0] = _event.associatedData.node;
            tab1[1] = null;
            tab1[2] = null;

            //g.moveNode(tab1);
            
            tabb = tab1;
             
            var snippet = _event.associatedData.snippet;
            if(snippet)
            {
                var currentNode = snippet.data()[0];
                var view_node = snippet[0][0].tagName;
                var posX = d3.event.dx;
                var posY = d3.event.dy;
                currentNode.x += posX;
                currentNode.y += posY;
                currentNode._currentX += posX;
                currentNode._currentY += posY;                
                var currentBaseID = currentNode.baseID;

                    snippet.select("rect")
                        .attr("x", function () {
                            return currentNode.x;
                        })
                        .attr("y", function () {
                            return currentNode.y;
                        });

                    snippet.select("circle")
                        .attr("cx", function () {
                            return currentNode.x;
                        })
                        .attr("cy", function () {
                            return currentNode.y;
                        });
 
                var labelTarget = g.svg.selectAll("text.snippet");
 
                labelTarget
                    .attr("dx", function () {
                        return currentNode.x;
                    })
                    .attr("dy", function () {
                        return currentNode.y;
                    });

                var links = g.svg.selectAll("path.snippet")
                .attr("d", function (d) {
                    return g.drawOneLink(d);
                });
            }
        };


        g.showHideLabelNode = function (_event) {
            var dragTarget = _event.associatedData.node;
            var currentNode = dragTarget.data()[0];
            var labelTarget = g.labelContainer.select("text.node" + currentNode.baseID);
            var nodeTarget = dragTarget.select("circle.node");
            var hidden = labelTarget.attr("visibility") == 'hidden';

            labelTarget.attr("visibility", function (d) {
                if (!hidden && !d.mouseOver || d.labelVisibility) {
                    d.labelVisibility = false;
                    nodeTarget.style("stroke", "white");
                    return "hidden";
                } else {
                    d.labelVisibility = true;
                    nodeTarget.style("stroke", "lightpink");
                    return "visible";
                }
            });
        };


        g.showLabelNode = function (_event) {
            
            
            var currentNode = _event.associatedData.data;
            
            // find in out edges
            ng = g.cGraph.neighborhood(currentNode);
            ng.nodes.push(currentNode);
            g.show_snippet(ng, currentNode);
                
            return; 
            

        };

        g.mouseOutNode = function () {
            var o = g.svg.selectAll(".snippet").data([]).exit().remove();
            
            currentView = TP.Context().view[currentViewID];
            var currentNodeColor = currentView.getNodesColor();
 
        };
        
        function limitLabel(lbl)
        {
           var label = lbl;
           if (label && label.length > TP.Context().view[currentViewID].labelDisplayWidth)//TP.Context().defaultLabelMaxLength)
           {
              label = label.substring(0, TP.Context().view[currentViewID].labelDisplayWidth-3)+"...";
           }                    
           return label;

        }
        
        g.attachNodeInteraction = function()
        {
             g.nodeContainer.selectAll("g.node")
                            .call(d3.behavior.drag()
                    .on("dragstart", function (d) {

                    })
                    .on("drag", function (d) {
                        //TP.Context().view[currentViewID].getController().sendMessage("dragNode", {node: d3.select(this)});
                    })

                    .on("dragend", function () {
                        //TP.Context().view[currentViewID].getController().sendMessage("dragNodeEnd", {node: d3.select(this)});
                    }))
                .on("click", function (d) {
                    //TP.Context().view[currentViewID].getController().sendMessage("showHideLabelNode", {node: d3.select(this)})
                })
                .on("mouseover", function (d) {
                    if (g.dragStarted == true) return;
                    g.showLabelNode(d)
                    //TP.Context().view[currentViewID].getController().sendMessage("mouseoverShowLabelNode", {data: d});
                })
                .on("mouseout", function () {
                    
                });

        };

        // this function draws the nodes using d3
        // we associate to each graph node an svg:g (indexed by baseID)
        // each svg:g sets the interaction for the nodes (click, 
        // mouseover, mouseout)
        // to each group are added an svg:circle (placed according to the node 
        // property x and y) and an svg:text printing the node property label
        g.drawNodes = function (view_nodes) {
            var saveUndo = 0;
            var undo = null;
            var redo = null;


            //créer tout les noeud (rectangle, cercle) depuis les données contenu dans cGraph.nodes (= données des noeuds passé dans un tableaux)


            var node = g.nodeContainer.selectAll("g.node").data(g.cGraph.nodes(), function (d) {
                return d.baseID;
            })
                .enter()
                .append("g")
                .attr("class", function (d) {
                    return d._type;
                })
                .classed("node", true)
                .attr("transform", function (d) {
                    d._currentX = d.x;
                    d._currentY = d.y;
                    return;
                })
                
                /*
                .call(d3.behavior.drag()
                    .on("dragstart", function (d) {

                    })
                    .on("drag", function (d) {
                        //TP.Context().view[currentViewID].getController().sendMessage("dragNode", {node: d3.select(this)});
                    })

                    .on("dragend", function () {
                        //TP.Context().view[currentViewID].getController().sendMessage("dragNodeEnd", {node: d3.select(this)});
                    }))
                .on("click", function (d) {
                    //TP.Context().view[currentViewID].getController().sendMessage("showHideLabelNode", {node: d3.select(this)})
                })*/
                
                
                .on("mouseover", function (d) {
                    if (g.dragStarted == true) return;
                    TP.Context().view[currentViewID].getController().sendMessage("mouseoverShowLabelNode", {data: d});
                })
                /*.on("mouseout", function () {
                    
                })*/
               
                .append("g")
                .attr("class", function (d) {
                    return d._type;
                })
                .classed("glyph", true);


            /*
             var glyphR = g.svg.selectAll("g.glyph.substrate")
             .append("rect")
             .attr("class", function (d) {return d._type})
             .classed("node", true)
             .classed("rect", true)
             .style("fill", TP.Context().tabNodeColor["substrate"])
             .attr("x", function (d) {
             d._currentX = d.x;
             return d._currentX
             })
             .attr("y", function (d) {
             d._currentY = d.y;
             return d._currentY
             })
             .attr("width", 2 * 5)
             .attr("height", 2 * 5)

             var glyphC = g.svg.selectAll("g.glyph.catalyst")
             .append("circle")
             .attr("class", function (d) {return d._type})
             .classed("node", true)
             .classed("circle", true)
             .style("fill", TP.Context().tabNodeColor["catalyst"])
             .attr("cx", function (d) {
             d._currentX = d.x;
             return d._currentX
             })
             .attr("cy", function (d) {
             d._currentY = d.y;
             return d._currentY
             })
             .attr("r", 5)
             */

            //var glyphR = g.svg.selectAll("g.glyph."+target)
            var glyphR = g.nodeContainer.selectAll("g.glyph." + TP.Context().view[currentViewID].getType())
                .append(view_nodes)
                .attr("class", function (d) {
                    return d._type;
                })
                .classed("node", true)
                .classed(view_nodes, true)
                .style("opacity", TP.Context().defaultNodeOpacity)
                .style("fill", function(d){
                    var c = TP.Context().view[currentViewID].getNodesColor();
                    //var c = g.nodesColor;
                    if (d._color == undefined)
                        d._color = c;
                    return d._color;
                    });

            if (view_nodes == "rect" && glyphR != null) {
                // assert(true, "rect")
                glyphR.attr("x", function (d) {
                    d._currentX = d.x;
                    return d._currentX;
                })
                    .attr("y", function (d) {
                        d._currentY = d.y;
                        return d._currentY;
                    })
                    .attr("width", function(d){
                        d._size = 5;
                        return 2 * d._size;
                        })
                    .attr("height", function(d){return 2*d._size;});
            }
            if (view_nodes == "circle" && glyphR != null) {
                // assert(true, "circle");
                glyphR.attr("cx", function (d) {
                    d._currentX = d.x;
                    return d._currentX;
                })
                    .attr("cy", function (d) {
                        d._currentY = d.y;
                        return d._currentY;
                    })
                    .attr("r", function(d){
                        d._size = 5;
                        return d._size;
                    });
            }


            var selection = g.labelContainer.selectAll("text.node");
            //var selection = g.svg.selectAll("g.node")
            selection.data(g.cGraph.nodes(),function (d) {
                return d.baseID;
            }).enter()
                //selection
                .append("text")
                .attr("class", function (d) {
                    return "node" + d.baseID + " " + d._type;
                })
                .classed("node", true).classed("text", true)
                .attr("dx", function (d) {
                    d._currentX = d.x;
                    return d._currentX;
                })
                .attr("dy", function (d) {
                    d._currentY = d.y;
                    return d._currentY;
                })

                //.attr('unselectable', 'on')
                //.on('selectstart', function(){return false;})
                .style("font-size",function(){
                    return TP.Context().view[currentViewID].labelFontSize;
                })
                .style("opacity", TP.Context().defaultLabelOpacity)
                .text(function (d) {                    
                    return limitLabel(d.label);
                })
                .on("mouseover", function (d) {
                    if (g.dragStarted == true) return;
                    TP.Context().view[currentViewID].getController().sendMessage("mouseoverShowLabelNode", {data: d});
                });


            g.arrangeLabels();

            if ("viewMetric" in g.svg.select("g.node").data()[0]) {
                g.resize(g.cGraph, 0);
            }

        };


        g.drawLabels = function () {
            return;                  // return???
            /*var labelNode = g.svg.selectAll("text.node")
             .data(g.cGraph.nodes(),function(d){return d.baseID}).enter().append("g")
             .attr("class", function(d){return d._type})
             .classed("text", true)
             .style("fill", TP.Context().view[currentViewID].getLabelsColor())
             var labelContent= labelNode
             .append("text")
             .attr("class", function(d){return "node" + d.baseID + " " + d._type})
             .classed("node", true).classed("text", true)
             .attr("dx", function(d){return d._currentX})
             .attr("dy", function(d){return d._currentY})
             .text(function(d) {  return d.label; });
             g.arrangeLabels();     */

        };


        // This function rescales the graph data in order to fit the svg window
        // data, the graph data (modified during the function)
        g.rescaleGraph = function (graph, width_, height_) {

            if (!graph)
                graph = g.cGraph;
            
            var leftFrame = 10;
            var rightFrame = 100;
            var topFrame = 20;
            var bottomFrame = 10;
            
            //var frame = 60.0            
            
            if (!width_)
                width_ = TP.Context().width;
            //var w = width_ - (2 * frame)
            var w = width_ - (leftFrame + rightFrame);

            if (!height_)
                height_ = TP.Context().height ;
            
            //var h = height_ - (2 * frame)
            var h = height_ - (topFrame + bottomFrame);

            var node = graph.nodes();
            
            if (node.length <= 0)
                return;

            var Xminmax = d3.extent(node, function (d) {
                return d.x;
            });
            var Yminmax = d3.extent(node, function (d) {
                return d.y;
            });

            var delta = 0.00000000000000000001; //to avoid division by 0
            var scale = Math.min.apply(null, [w / (Xminmax[1] - Xminmax[0] + delta), h / (Yminmax[1] - Yminmax[0] + delta)]);
            node.forEach(function (d) {
                d.x = (d.x - Xminmax[0]) * scale + leftFrame;
                d.y = (d.y - Yminmax[0]) * scale + topFrame;
                d._currentX = d.x;
                d._currentY = d.y;
            });

            //g.arrangeLabels();
        };


        g.rotate = function (currentViewID, angle) {
            
            angle = (angle/360.0)*Math.PI;
            var x_minx, y_minx, x_center, y_center;
            var x_tmp, y_tmp;

            x_minx = d3.extent(g.cGraph.nodes(), function (d) {
                return d.x;
            });
            y_minx = d3.extent(g.cGraph.nodes(), function (d) {
                return d.y;
            });

            x_center = (x_minx[0] + x_minx[1]) / 2;
            y_center = (y_minx[0] + y_minx[1]) / 2;

            g.cGraph.nodes().forEach(
                function (d) {
                    x_tmp = (Math.cos(angle) * (d.x - x_center)) + (Math.sin(angle) * (d.y - y_center)) + x_center;
                    y_tmp = ((-1 * Math.sin(angle)) * (d.x - x_center)) + (Math.cos(angle) * (d.y - y_center)) + y_center;
                    d.x = x_tmp;
                    d.y = y_tmp;
                    
                }
            );
            
            var currentView = TP.Context().view[currentViewID]; 
            g.rescaleGraph(currentView.getGraph(), currentView.dialog.dialog().width(), currentView.dialog.dialog().height());
            g.changeLayout(g.cGraph, 0);
        };


        g.delLinks = function () {
            var links = g.svg.selectAll("g.link")
                .data([])
                .exit()
                .remove();
        };


        g.delLabels = function () {
            var selection = g.labelContainer.selectAll("g.text")
                .data([])
                .exit()
                .remove();
        };


        // this function draws the links using d3
        // we associate to each graph link an svg:g (indexed by baseID)
        // each svg:g sets the interaction for the links (click, mouseover, 
        // mouseout)
        // to each group are added an svg:path (placed according to the related
        // nodes property x and y)
        g.drawLinks = function () {
            var links = g.linkContainer.selectAll("g.link");
            var transform = null;

            if (!links.empty()) {
                transform = links.attr("transform");
            }
            g.linkContainer.selectAll("g.link")
                .data([])
                .exit()
                .remove();
            
            var link = g.linkContainer.selectAll("g.link")
                .data(g.cGraph.links(), function (d) {
                    return d.baseID;
                })
                .enter()
                .append("g")
                .attr("class", function (d) {
                    return d._type;
                })
                .classed("link", true);

            link.append("path")
                .attr("class", function (d) {
                    return d._type;
                })
                .classed("link", true)
                .classed("path", 1)
                .attr("d", function (d) {
                    d.shape = "curved";
                    return g.drawOneLink(d);

                })
                .style("fill","transparent")
                .style("stroke", TP.Context().view[currentViewID].getLinksColor()) //before, there was catalyst
                .style("opacity", TP.Context().defaultLinkOpacity)
                .style("stroke-width", function (d) {
                    return 1;
                });


            link.attr("transform", transform);
        };


        // this function moves the nodes and links
        // _graph, the new graph placement
        // dTime, the delay in ms to apply the movement
        // we select each svg:g and its node from their identifier (baseID), 
        // and associate 
        // the new x and y values (d3 does the transition) 
        g.changeLayout = function (_graph, dTime) {
            
            g.cGraph = _graph;

            //assert(true, "assigning g.node_s")

            var node = g.nodeContainer.selectAll("g.node")
                .data(g.cGraph.nodes(), function (d) {
                    d._currentX = d.x;
                    d._currentY = d.y;
                    return d.baseID;
                });
            /*.transition()
             .delay(dTime)*/

            //assert(true, "assigning cirle")

            node.select("circle")
                .attr("cx", function (d) {
                    d._currentX = d.x;
                    d._currentY = d.y;
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });

            //assert(true, "assigning rect")

            node.select("rect")
                .attr("x", function (d) {
                    d._currentX = d.x;
                    d._currentY = d.y;
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                });

            //assert(false, "g.node.text -- should be empty")

            var node = g.svg.selectAll("g.node");
            node.select("text")
                .attr("dx", function (d) {
                    return d.x;
                })
                .attr("dy", function (d) {
                    return d.y;
                });

            //assert(true, "assigning g.link_s")

            var link = g.linkContainer.selectAll("g.link")
                .data(g.cGraph.links(), function (d) {
                    return d.baseID;
                })
                /*.transition()
                 .delay(dTime)*/
                .style("fill","transparent")
                .select("path")
                .attr("d", function (d) {
                    d.shape = "curved";
                    return g.drawOneLink(d);
                    //return "M" + d.source.x + " " + d.source.y + " L" + d.target.x + " " + d.target.y;
                });
                

            //var label = g.svg.selectAll("g.text")
            //   	.data(g.cGraph.nodes(),function(d){
            //   	    d._currentX = d.x; d._currentY = d.y; return d.baseID;
            //    })
            //.transition().delay(dTime)
            // 	.select("text")
            //assert(true, "assigning text.node_s")

            var label = g.labelContainer.selectAll("text.node")
                .data(g.cGraph.nodes(), function (d) {
                    return d.baseID;
                })
                .attr("dx", function (d) {
                    //assert(false,"moving a label")
                    d._currentX = d.x;
                    d._currentY = d.y;
                    return d.x;
                })
                .attr("dy", function (d) {
                    return d.y;
                });

            g.arrangeLabels();


        };

        g.drawOneLink = function(d)
        {
            var shapeOperator = " L";
            if (d.shape == undefined)
            {
                d.shape = "straight";
            }

            if (d.layout == undefined)
            {
                d.layout = [[d.source._currentX, d.source._currentY], [d.target._currentX, d.target._currentY]];
            }
            
            if((TP.Context().view[currentViewID].linkCurvature < 10/100 && TP.Context().view[currentViewID].linkCurvature > -10/100) || d.shape == "direct")
            {
                d.shape = "straight";
                d.layout = [[d.source._currentX, d.source._currentY], [d.target._currentX, d.target._currentY]];                
            }

           
            if (d.shape == "curved")
            {
                var x1 = d.source._currentX;
                var x2 = d.target._currentX;
                var y1 = d.source._currentY;
                var y2 = d.target._currentY;
                
                var xL = x2 - x1;
                var yL = Math.abs(y2 - y1);
                var ab = Math.sqrt(xL*xL + yL*yL);
                
                var cosa = (ab>0) ? xL / ab : 0;
                var sina = (ab>0) ? yL / ab : 0;
                
                var xM = (x1+x2)/2.0; 
                var yM = (y1+y2)/2.0;
                
                var L = TP.Context().view[currentViewID].linkCurvature * ab;
                
                
                var yM2 = yM + cosa*L;
                var xM2 = xM + sina*L;
                
                d.layout = [[d.source._currentX, d.source._currentY], [xM2, yM2], [d.target._currentX, d.target._currentY]];
                shapeOperator = " Q";
            }
            
            var drawString = "M" + d.layout[0] + shapeOperator;
            d.layout.forEach(function(p, i){ if (i>0) drawString += p + " ";});//p[0] + " " + p[1] + " "})
            return drawString;

        };
        // this function resizes the nodes
        // _graph, the new graph with size
        // dTime, the delay in ms to resize
        // we select each svg:g and its node from their identifier (baseID), 
        // and associate 
        // the node's 'viewMetric' property to the svg:circle's 'r' attribute
        g.resize = function (_graph, dTime) {
            //For backward compatibility only
            g.nodeSizeMap(_graph, dTime, {metric: "viewMetric"});
        };

        g.nodeSizeMap = function (_graph, dTime, params) {
            g.cGraph = _graph;

            var scaleMin = 3.0;
            var scaleMax = 12.0;
            var parameter = "";
            if (params.metric) parameter = params.metric;
            if (params.scaleMin) scaleMin = params.scaleMin;
            if (params.scaleMax) scaleMax = params.scaleMax;
            
            if (parameter == "") return;


            var valMin = null;
            var valMax = null;
            g.cGraph.nodes()
                .forEach(function (n) {
                    val = eval("n[\"" + parameter + "\"]");
                    if(!val)val = 3;
                    if (valMin == null | val < valMin)
                        valMin = val;
                    if (valMax == null | val > valMax)
                        valMax = val;
                });

            //linear
            if (valMax == valMin || valMax - valMin < 0.0001) {
                scaleMin = 5;
            }


            var dom = [valMin, valMax];
            var range = [scaleMin, scaleMax];
            var scale = d3.scale.linear().domain(dom).range(range);
            var node = g.nodeContainer.selectAll("g.node")
                .data(g.cGraph.nodes(), function (d) {
                    return d.baseID;
                });

            node.select("circle.node").attr("r", function (d) {
                var val = eval('d[\"'+parameter+'\"]');
                if(!val)val = 1;
                d._size = scale(val); 
                return d._size;

            });
            //error: d n'a plus de ViewMetric par défaut...
            node.select("rect.node")
                .attr("width", function (d) {
                    var val = eval('d[\"'+parameter+ '\"]');
                    if(!val)val = 3;
                    d._size = scale(val); 
                    return 2 * d._size;
                })
                .attr("height", function (d) {
                    //var val = eval('d[\"'+parameter+ '\"]');
                    //if(!val)val = 3;
                    //d._size = scale(val);
                    return 2 * d._size;
                });

            var link = g.linkContainer.selectAll("g.link")

                .data(g.cGraph.links(), function (d) {
                    return d.baseID;
                });


            link.select("path.link")
                .style("stroke-width", function (d) {
                    return 1;
                });
           
           g.recenterNodes();
        };
        
        
        g.recenterNodes = function(){

            g.nodeContainer.selectAll("g.glyph")
                .attr("transform", function(d){
                    
                    //return g.recenterNode(d)
                    var nodeData = d;
                     if(nodeData._type == "catalyst")
                        {
                            return;
                        }
                        var centering = "";
                        
                        var node1 = d3.selectAll("g.node").filter(function (d) { return d.baseID === nodeData.baseID; });
                        if(node1 != null){
                            var node = node1.select("rect");
                            var x = node.attr("x");
                            var y = node.attr("y");
                            var height = node.attr("height");
                            var width = node.attr("width");
                            var transX = -width/2.0;
                            var transY = -height/2.0;  
                            var trans =  "translate("+transX+","+transY+")";        
                            
                            centering = trans;
                                
                            
                        }
                        return centering;
                    
                    
                });
        };


        g.nodeColorMap = function (_graph, dTime, parameter, diff) {
            diff = true;
            g.cGraph = _graph;
            //we would like it better as a parameter
            //assert(false, "turlututu");
            scaleMin = 3.0;
            scaleMax = 12.0;

            valMin = null;
            valMax = null;

            g.cGraph.nodes().forEach(function (n) {
                val = eval("n[\"" + parameter+"\"]");
                if (valMin == null | val < valMin)
                    valMin = val;
                if (valMax == null | val > valMax)
                    valMax = val;
            });

            var color = d3.scale.quantize()
                .domain([valMin, valMax])
                .range(colorbrewer.GnBu[9]);

            if (diff == true)
                color = d3.scale.category20();

            var node = g.nodeContainer.selectAll("g.node")
                .data(g.cGraph.nodes(), function (d) {
                    return d.baseID;
                });

            node.select("g.glyph")
                .select(".node")
                .style("fill", function (d) {
                    c = color(eval('d[\"' + parameter +'\"]'));
                    d._color = d3.rgb(c);
                    return d._color;
                });

            var link = g.linkContainer.selectAll("g.link")
                .data(g.cGraph.links(), function (d) {
                    return d.baseID;
                });

            link.select("path.link")
                .style("stroke-width", function (d) {
                    return 1;
                });
        };

        /********************************** ON GOING **********************************/
        g.changeColor = function (graphName, _graph, elem, color) {
            g.cGraph = _graph;
            if (elem == "node") {
                var node = g.nodeContainer.selectAll("g.node")
                    .data(g.cGraph.nodes(), function (d) {
                        return d.baseID;
                    });

                node.select("g.glyph").select(".node")
                    .style("fill", function (d) {
                        var c = d3.rgb(color);
                        d._color = c;
                        return c;
                    });
            } else if (elem === "link") {
                var link = g.linkContainer.selectAll("g.link")
                    .data(g.cGraph.links(), function (d) {
                        return d.baseID;
                    });

                link.select("path.link")
                    .style("stroke", function (d) {
                        return d3.rgb(color);
                    })
                    .style("stroke-width", function (d) {
                        return 1;
                    });
            } else if (elem === "bg") {
                $("#zone" + graphName).css("background-color", color);
            } else if (elem === "label") {
                var labels = g.svg.selectAll("text.node.text")
                    .style('fill', function (d) {
                        var c = d3.rgb(color);
                        return c;
                    })
                    .style('stroke', function (d) {
                        return d3.rgb(color);
                    });
                g.drawLabels();
                //var label = g.svg.selectAll("g.text").style('fill',color);
            } else {
                console.log("erreur g.changeColor");

            }
        };

        g.changeSettingsLabels = function(graphName, _graph, elem, value){
            g.cGraph = _graph;
            g.labelContainer.selectAll("text.node.text")
                .style(elem,value);

        };
        /********************************** ON GOING ***********************************/
        //never used. Then there is still "substrate", "catalyst" etc.
        /*g.resetDrawing = function(){

         // assert(true, "resetDrawing")

         var node = g.svg.selectAll("g.node")
         .style("opacity", .5)
         .select("g.glyph").select("circle.node")
         .style('fill', TP.Context().view[currentViewID].getAsociated("catalyst")[0].getNodesColor())
         .attr('r', 5)
         .style("stroke-width", 0)
         .style("stroke", "black")

         var node = g.svg.selectAll("g.node")
         .select("g.glyph").select("rect.node")
         .style('fill', TP.Context().view[currentViewID].getAsociated("substrate")[0].getNodesColor())
         .attr('width', 2*5)
         .attr('height', 2*5)
         .style("stroke-width", 0)
         .style("stroke", "black")

         var node = g.svg.selectAll("text.node")
         //.select("text.node")
         //.attr("visibility", "hidden")
         .style("opacity", .5)

         var link = g.svg.selectAll("g.link")
         .style("opacity", .25)
         .select("path.link")
         .style("stroke", TP.Context().view[currentViewID].getAsociated("substrate")[0].getLinksColor())
         .style("stroke-width", function(d) { return 1;})

         var link = g.svg.selectAll("g.link")
         .style("opacity", .25)
         .select("path.link")
         .style("stroke", TP.Context().view[currentViewID].getAsociated("catalyst")[0].getLinksColor())
         .style("stroke-width", function(d) { return 1;})
         }*/

        g.show_snippet = function (_graph, currentNode) {
            
            var fuzz=g.svg
                        .append("rect")
                        .classed("snippet",1)
                        .style("fill","white")
                        .style("opacity",.5)
                        .attr("x",0)
                        .attr("y",0)
                        .attr("width",function(d){ return g.svg.style("width").replace("px", "");})
                        .attr("height",function(d){return g.svg.style("height").replace("px", "");})
                        .on("mouseover", function(d){ 
                            if(g.dragStarted == true){return;}
                            TP.Context().view[currentViewID].getController().sendMessage("mouseOutNode");});
                        
            
            currentView = TP.Context().view[currentViewID];
            currentGlyph = currentView.getViewNodes();
            currentGlyphClass = currentGlyph + ".node";
            
            snippetGroup = g.svg.append("g")
                            .classed("snippet", 1)
                            .on("mouseout",function(d){
                            if(g.dragStarted == true){return;}
                            TP.Context().view[currentViewID].getController().sendMessage("mouseOutNode"); });
                                                

            snippetGroup.selectAll("path.snippet").data(_graph.links).enter()
                .append("path")
                    .classed("link", true)
                    .classed("snippet", true)
                    .classed("path", 1)
                    .attr("d", function (d) {
                        d.shape = "curved";
                        return g.drawOneLink(d);
                    })
                    .style("fill","transparent")
                    .style("stroke", "#009933") //before, there was catalyst
                    .style("opacity", TP.Context().defaultLinkOpacity)
                    .style("stroke-width", function (d) {
                        return 1;
                });
           
           view_nodes = (currentView.getType() == "substrate") ? "rect" : "circle";

           var glyphR = snippetGroup.selectAll(view_nodes+".snippet").data(_graph.nodes).enter()
                .append("g")
                .classed("glyph", true)
                .classed("snippet", true)
                .classed(view_nodes, true)
                .style("stroke","#009933")
                .style("stroke-width", 1)
                .style("opacity",1)
                .call(d3.behavior.drag()
                    .on("dragstart", function (d) {
                        g.dragStarted = true;

                    })
                    .on("drag", function (d) {
                        TP.Context().view[currentViewID].getController().sendMessage("dragNode", 
                            {snippet: d3.select(this), 
                                 node:g.svg.selectAll(view_nodes+".node").filter(function(dd){return d.baseID == dd.baseID;})
                            });
                    })

                    .on("dragend", function (d) {
                        g.dragStarted = false;
                        //return
                        var currentView = TP.Context().view[currentViewID];
                        currentView.getGraphDrawing().changeLayout(currentView.getGraph(), 0);
                        currentView.getController().sendMessage("dragNodeEnd", 
                            {snippet: d3.select(this), 
                             node:g.svg.selectAll(view_nodes+".node").filter(function(dd){return d.baseID == dd.baseID;}
                         )});
                    })
                )
                .on("click", function (d) {
                    //TP.Context().view[currentViewID].getController().sendMessage("showHideLabelNode", 
                    //  {snippet: d3.select(this), 
                    //   node:g.svg.selectAll(view_nodes+".node").filter(function(dd){return d.baseID == dd.baseID;})
                    //});
                });

            if (view_nodes == "rect" && glyphR != null) {
                // assert(true, "rect")
                glyphR
                 .append(view_nodes)
                   .attr("transform", function(d){
                    var trans = g.svg.selectAll("g.node")
                                    .filter(function(dd){return d.baseID == dd.baseID;})
                                    .select(".glyph").attr("transform");
                    return trans;
                })
                    .attr("x", function (d) {
                    d._currentX = d.x;
                    return d._currentX;
                })
                    .attr("y", function (d) {
                        d._currentY = d.y;
                        return d._currentY;
                    })
                    .attr("width", function(d){var rects = g.svg.selectAll("g.node")
                                                                .filter(function(dd){return d.baseID == dd.baseID;})
                                                                .select("rect");
                    return rects.attr("width");})//2 * 5})
                    .attr("height", function(d){var rects = g.svg.selectAll("g.node")
                                                            .filter(function(dd){return d.baseID == dd.baseID;})
                                                            .select("rect");
                    return rects.attr("height");})//2 * 5})
                    //.style("opacity", TP.Context().defaultNodeOpacity)
                    .style("fill-opacity", 0);
                
            }
            if (view_nodes == "circle" && glyphR != null) {
                // assert(true, "circle");
                glyphR
                 .append(view_nodes)
                  .attr("cx", function (d) {
                    d._currentX = d.x;
                    return d._currentX;
                   })
                    .attr("cy", function (d) {
                        d._currentY = d.y;
                        return d._currentY;
                    })
                    .attr("r", function(d){
                        var circles = g.svg.selectAll("g.node")
                            .filter(function(dd){return d.baseID == dd.baseID;})
                            .select("circle");
                        return Math.abs(circles.attr("r"));
                        })
                    .style("fill-opacity", 0);
            }
            
            glyphR  
                .append("text")
                .attr("dx", function (dd) {
                    return dd._currentX;
                })
                .attr("dy", function (dd) {
                    return dd._currentY;
                })
                .classed("snippet", 1)
                .style("fill",function(d){
                    var c = TP.Context().view[currentViewID].getLabelsColor();
                    return c;
                    })
                .style("stroke",TP.Context().view[currentViewID].getLabelsColor())
                .style("stroke-width",1)
                .style("font-size", TP.Context().view[currentViewID].labelFontSize)
                .text(function (dd) {
                    if(dd.visible || dd.baseID == currentNode.baseID)
                        return dd.label;
                });
            
            return;
        };


        // this function puts forward a selection of nodes
        // _graph, the new graph selection
        // dTime, the delay in ms to apply the selection
        // we initialized all the nodes and then select all the nodes passed in
        // the given graph and change their aspect (size and color)
        //
        // this function name doesn't seem appropriate
        // we assign to the nodes the new data, and reassign the original data
        // we might want to apply persistant colors and sizes stored in the 
        // data
        g.show = function (_graph) {
            // redraw the previous nodes to the default values
            //g.arrangeLabels();
            //g.resetDrawing();
           
            currentView = TP.Context().view[currentViewID];
            currentGlyph = currentView.getViewNodes();
            currentGlyphClass = currentGlyph + ".node";

            var node = g.nodeContainer.selectAll("g.node")
                .style("opacity", .5);


            var glyphG = node.select("g.glyph");
            var glyph = glyphG.select(currentGlyphClass)
                .style('fill', function(d){
                    var c = currentView.getNodesColor();
                    if (d._color == undefined)
                        d._color = c;

                    return d._color;
                    });


            if (currentGlyph == "circle") {
                glyph.attr('r', function(d){
                        return d._size;
                    })
                    .style("stroke-width", 0)
                    .style("stroke", "black");
            }
            if (currentGlyph == "rect") {
                glyph.attr('width', function(d){
                        return 2*d._size;
                    })
                    .attr('height', function(d){
                        return 2* d._size;
                    })
                    .style("stroke-width", 0)
                    .style("stroke", "black");
            }


            var node = g.nodeContainer.selectAll("g.node")
                .select("text.node")
                .attr("visibility", "hidden");


            g.labelContainer.selectAll("text.node")
                .style("opacity", 0.5);


            var link = g.linkContainer.selectAll("g.link")
                .style("opacity", .25)
                .select("path.link")
                .style("stroke", currentView.getLinksColor())
                .style("stroke-width", function (d) {
                    return 3;
                });

            //we would like it better as a parameter
            var scaleMin = 3.0;
            var scaleMax = 12.0;
            var parameter = "entanglementIndex";
            var valMin = null;
            var valMax = null;

            var nodeIDList = []; 
            var paramMap = {};
             _graph.nodes().forEach(function(d){
                 nodeIDList.push(d.baseID);
                 var val = d[parameter];
                 paramMap[d.baseID] = val;
                    if (valMin == null | val < valMin)
                        valMin = val;
                    if (valMax == null | val > valMax)
                        valMax = val;

             });


            /*_graph.nodes()
                .forEach(function (n) {
                    val = eval("n." + parameter);
                    //val = n[parameter]
                    if (valMin == null | val < valMin)
                        valMin = val;
                    if (valMax == null | val > valMax)
                        valMax = val;
                });*/

            //linear

            var equalScales = false;
            if (valMax == valMin || valMax - valMin < 0.0001) {
                equalScales = true;
                scaleMin = 5;
            }

            var dom = [valMin, valMax];
            var range = [scaleMin, scaleMax];
            var scale = d3.scale.linear().domain(dom).range(range);

            var linkIDList = []; 
             _graph.links().forEach(function(d){
                 linkIDList.push(d.baseID);
             });
            // assign the new data
            var node = g.nodeContainer.selectAll("g.node")
                .classed("shown", 1)
                .filter(function(d){return nodeIDList.indexOf(d.baseID) != -1;})
                //.data(_graph.nodes(), function (d) {
                //    return d.baseID
                //})
                .style("opacity", TP.Context().defaultNodeOpacity);

            var link = g.linkContainer.selectAll("g.link")
                .classed("shown", 1)
                .filter(function(d){return linkIDList.indexOf(d.baseID) != -1;})
                //.data(_graph.links(), function (d) {
                //    return d.baseID
                //})
                .style("opacity", TP.Context().defaultLinkOpacity);

            var label = g.labelContainer.selectAll("text.node")
                .classed("shown", 1)
                .filter(function(d){return nodeIDList.indexOf(d.baseID) != -1;})
                //.data(_graph.nodes(), function (d) {
                //    return d.baseID
                //})
                .style("opacity", TP.Context().defaultLabelOpacity);

            // update the nodes

            node.select("circle.node")
                .attr("r", function (d) {
                    d._size = Math.abs(scale(paramMap[d.baseID]));  
                    return d._size;
                })
                .style("stroke-width", function (d) {
                    return 3;
                })
                .style("stroke", "brown");


            node.select("rect.node")
                //.attr("width", function (d) {
                //    r = scale(d[parameter])//eval("d." + parameter + "*factor+scaleMin");
                    //r = d[parameter] * factor + scaleMin
                    //if (!r || equalScales) {
                    //    r = scaleMin;
                    //}
                //    return 2 * r;
                //})
                //.attr("height", function (d) {
                //    r = scale(d[parameter])//eval("d." + parameter + "*factor+scaleMin");
                    //r = d[parameter] * factor + scaleMin

                    //if (!r || equalScales) {
                    //    r = scaleMin;
                    //}
                //    return 2 * r;
                //})
                .style("stroke-width", function (d) {
                    return 3;
                })
                .style("stroke", "brown");

            node.select("text.node")
                .attr("visibility", "visible");

            link.select("path.link")
                .style("stroke-width", function (d) {
                    return 2    ;
                })
                .style("stroke", "brown");

            label.select("text.node")
                .attr("visibility", "visible")
                .style('color', contxt.labelColor);

            // reassign the original data
            
            /*

            g.nodeContainer.selectAll("g.node")
                .data(g.cGraph.nodes(), function (d) {
                    return d.baseID
                })

            g.linkContainer.selectAll("g.link")
                .data(g.cGraph.links(), function (d) {
                    return d.baseID
                })

            g.labelContainer.selectAll("g.text")
                .data(g.cGraph.nodes(), function (d) {
                    return d.baseID
                })
           */
        };


        // this function removes the nodes and links removed from the old data
        // _graph, the new graph
        // dTime, the delay in ms to apply the modification  
        // we only use d3's data association then 'exit()' and 'remove()'
        g.exit = function (_graph, dTime) {
            g.cGraph = _graph;
            nodeIds = [];
            linkIds = [];
            _graph.nodes()
                .forEach(function (d) {
                    nodeIds.push(d.baseID);
                });
            _graph.links()
                .forEach(function (d) {
                    linkIds.push(d.baseID);
                });
            var node = g.nodeContainer.selectAll("g.node")
                .data(_graph.nodes(), function (d) {
                    return d.baseID;
                });
            node.exit().remove();

            var link = g.linkContainer.selectAll("g.link")
                .data(_graph.links(), function (d) {
                    return d.baseID;
                });
            link.exit().remove();

            var label = g.labelContainer.selectAll("text.node")
                .data(_graph.nodes(), function (d) {
                    return d.baseID;
                });
            label.exit().remove();
        };


        // this function clears the graphs, removes all the nodes and links 
        //(similarly to previously)
        g.clear = function () {
            var node = g.svg.selectAll("g.node").data([]);
            node.exit().remove();

            var link = g.svg.selectAll("g.link").data([]);
            link.exit().remove();

            var label = g.svg.selectAll("text").data([]);
            label.exit().remove();
        };


        g.arrangeLabels = function () {
            var intersect = function (rectDiag, point) {
                var xList = (rectDiag[0][0] <= rectDiag[1][0]) ? [rectDiag[0][0], rectDiag[1][0]]: [rectDiag[1][0], rectDiag[0][0]]; 
                var yList = (rectDiag[0][1] <= rectDiag[1][1]) ? [rectDiag[0][1], rectDiag[1][1]]: [rectDiag[1][1], rectDiag[1][0]];

                if (xList[0] <= point[0] && xList[1] >= point[0] &&
                    yList[0] <= point[1] && yList[1] >= point[1])
                    return true;
                return false;
            };

            var labels = g.labelContainer.selectAll("text.node")
                .attr("visibility", "visible")
                //.style("fill", TP.Context().view[currentViewID].getLabelsColor())
                .style("font-size", function(){
                    return TP.Context().view[currentViewID].labelFontSize;
                })
                .text(function(dd){
                    return limitLabel(dd[TP.Context().view[currentViewID].label_property]);
                });
            var labelsArray = [];
            var iterArray = [];
            //assert(true,"Les labels au moment de leur traitement")
            var combineArray = [];
            var currentView = TP.Context().view[currentViewID];
            var metricOrdering = currentView.labelMetric;//"nbDescriptors";//null
            
            labels[0].forEach(function (d) {
                
                
                combineArray.push([d3.select(d), d.getBBox()]);
            });
            
            if(metricOrdering != null)
            {
                combineArray.sort(function(a, b){
                    return (b[0].data()[0][metricOrdering] - a[0].data()[0][metricOrdering]);
                });
            }else{
                combineArray.sort(function(a, b){
                    if (a[1].x != b[1].x)
                    { return a[1].x - b[1].x; }
                    else
                    { return a[1].y - b[1].y; }
                    
                });
            }

            var iterate = function (combineArray) {
                var margin = currentView.labelPadding;
                var anyChange = false,
                    noChange = false;


                //var end = iterArray.length - 1;
                var blackList = [];
                var end = combineArray.length - 1;

                for (var iLabel = 0; iLabel < end; ++iLabel) {

                    var label_i = combineArray[iLabel][0];

                    if (blackList.indexOf(iLabel) == -1 && label_i.attr("visibility") == "visible") {
                        
                        var bbox = combineArray[iLabel][1];
                        var margin_height = (margin > -bbox.height/2.0) ? margin : -bbox.height/2.0;
                        var margin_width = (margin > -bbox.width/2.0) ? margin : -bbox.width/2.0;
                        

                        var minX = bbox.x - margin_width;
                        var minY = bbox.y - margin_height;
                        var maxX = bbox.x + bbox.width + margin_width;
                        var maxY = bbox.y + bbox.height + margin_height;   
                    
                        var polygon = [
                            [minX, minY],
                            [maxX, minY],
                            [minX, maxY],
                            [maxX, maxY]
                        ];
                        var testList = [[minX, minY], [maxX, maxY]];

                        //noChange = true;

                        var end2 = combineArray.length;

                        for (var iLabel2 = iLabel + 1; iLabel2 < end2; ++iLabel2) {
                        //for (var iLabel2 = 0; iLabel2 < end2; ++iLabel2) {
                            
                            var label_j = combineArray[iLabel2][0];
                            
                            if (iLabel != iLabel2 && blackList.indexOf(iLabel2) == -1 && label_j.attr("visibility") == "visible") {
                                var bbox2 = combineArray[iLabel2][1];
                                
                                var margin_height = (margin > -bbox2.height/2.0) ? margin : -bbox2.height/2.0;
                                var margin_width = (margin > -bbox2.width/2.0) ? margin : -bbox2.width/2.0;
                                

                                var minX = bbox2.x - margin_width;
                                var minY = bbox2.y - margin_height;
                                var maxX = bbox2.x + bbox2.width + margin_width;
                                var maxY = bbox2.y + bbox2.height + margin_height;   
                            
                                var polygon2 = [
                                    [minX, minY],
                                    [maxX, minY],
                                    [minX, maxY],
                                    [maxX, maxY]
                                ];
                                var testList2 = [[minX, minY], [maxX, maxY]];


                                var end3 = 4;//polygon2.length;

                                noChange = true;
                                
                                var iPoint = 0;
                                while(noChange && iPoint < 4)
                                {
                                    var test = intersect(testList, polygon2[iPoint]);
                                    if(test)
                                    {
                                        blackList.push(iLabel2);
                                        label_j.attr("visibility", "hidden");
                                        noChange = false;
                                        anyChange = true;                                        
                                    }
                                    else
                                    {
                                    test = intersect(testList2, polygon[iPoint]);
                                        if(test)
                                        {
                                            blackList.push(iLabel2);
                                            label_j.attr("visibility", "hidden");
                                            noChange = false;
                                            anyChange = true;                                        
                                        }                                        
                                    }
                                    iPoint++;
                                }
                            }
                        }
                    }
                }
                return anyChange;
            };

            iterate(combineArray);

        };

        g.removeNodeOverlap = function () {
            //fast overlap removal in javascript...
        };


        g.bringLabelsForward = function () {
            g.delLabels();
            g.addLabels();
        };


        g.resetSelection = function () {

            var nodeColor = TP.Context().view[currentViewID].getNodesColor();
            var linkColor = TP.Context().view[currentViewID].getLinksColor();

            g.nodeContainer.selectAll("g.node")
                .classed("selected", false)
                .style('opacity', TP.Context().defaultNodeOpacity)
                .select("circle.node")
                .style('fill', function(d){
                    var c = nodeColor;
                    if (d._color == undefined)
                        d._color = c;
                    return d._color;
                })
                .style("stroke-width", 0);
            g.nodeContainer.selectAll("g.node")
                .select("text.node")
                .attr("visibility", "visible");
            g.nodeContainer.selectAll("g.node")
                .select("rect.node")
                .style('fill', function(d){
                    var c = nodeColor;
                    if (d._color == undefined)
                        d._color = c;
                    return d._color;
                })
                .style("stroke-width", 0);
            g.linkContainer.selectAll("g.link")
                .style('opacity', TP.Context().defaultLinkOpacity)
                .select("path.link")
                .style('stroke', linkColor)
                .style('stroke-width', 1);

            g.cGraph.nodes().forEach(function (d) {
                d.selected = false;
            });

            //objectReferences.VisualizationObject.resetSize(catalystName);
            g.labelContainer.selectAll("text.node").style("opacity", TP.Context().defaultLabelOpacity);
            //objectReferences.VisualizationObject.arrangeLabels(catalystName);
        };

        g.setSelection = function (nodeIDList) {
            nodeList = [];

            //appends to the actual node list and set the "selected" flag to true
            g.cGraph.nodes().forEach(function (d) {
                if (nodeIDList.indexOf(d.baseID) != -1) {
                    d.selected = true;
                    nodeList.push(d);
                }
            });
            var nodes = g.svg.selectAll("g.node");

            //does the selection work with only the array of baseID?
            //.data(nodeList, function(d){return d.baseID;})
            //should we reassign the data each time to access the data?
            //nodes.data(g.cGraph, function(d){return d.baseID;})
            g.nodeContainer.selectAll("g.node")
                .classed("selected", function (d) {
                    return d.selected;
                })
                .select(".node")
                .style('fill', function (d) {
                    if (d.selected)
                        return "red";
                    else
                        var c = TP.Context().view[currentViewID].getNodesColor();
                        if (d._color == undefined)
                            d._color = c;
                        return d._color;
                });

            //g.svg.selectAll("g.node")
            //	.data(g.cGraph, function(d){return d.baseID;})
        };

        return g;
    };
    TP.GraphDrawing = GraphDrawing;
})(TP);
