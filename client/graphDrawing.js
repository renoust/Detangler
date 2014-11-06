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
                g.drawLinks()
            }


            g.drawNodes(TP.Context().view[currentViewID].getViewNodes());
            g.drawLabels()
        }


        g.moveNode = function move(tabb) {
            //var dragTarget = d3.select(this);
            var dragTarget = tabb[0];
            var circleTarget = dragTarget.select("circle.node");
            var rectTarget = dragTarget.select("rect.node");
            var currentNode = dragTarget.data()[0]
            var labelTarget = g.labelContainer.select("text.node" + currentNode.baseID);

            if (tabb[1] == null) {
                var posX = d3.event.dx
                var posY = d3.event.dy
                // console.log("first");
                currentNode.x += posX
                currentNode.y += posY
                currentNode.currentX += posX
                currentNode.currentY += posY
            } else {
                // console.log("second");
                currentNode.x = tabb[1]
                currentNode.y = tabb[2]
                currentNode.currentX = tabb[3]
                currentNode.currentY = tabb[4]
            }

            var currentBaseID = currentNode.baseID

            if (circleTarget) {
                circleTarget
                    .attr("cx", function () {
                        return currentNode.x
                    })
                    .attr("cy", function () {
                        return currentNode.y
                    });
            }

            if (rectTarget) {
                rectTarget
                    .attr("x", function () {
                        return currentNode.x
                    })
                    .attr("y", function () {
                        return currentNode.y
                    });
            }

            labelTarget
                .attr("dx", function () {
                    return currentNode.x
                })
                .attr("dy", function () {
                    return currentNode.y
                });

            // console.log("current svg:", g.svg, g.cGraph.links());
            var links = g.linkContainer.selectAll("g.link").data(g.cGraph.links(), function (d) {
                return d.baseID
            })
                .select("path.link")
                .attr("d", function (d) {
                    //console.log("updating the graph");
                    return "M" + d.source.x + " " + d.source.y + " L" + d.target.x + " " + d.target.y;
                })
                .style("stroke-width", function (d) {
                    return 1;
                })
        };


        g.dragNode = function (_event) {
            var tab1 = [];
            tab1[0] = _event.associatedData.node;
            tab1[1] = null;
            tab1[2] = null;

            g.moveNode(tab1);
        }


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
            
            
            var currentNode = _event.associatedData.data
            
            // find in out edges
            ng = g.cGraph.neighborhood(currentNode);
            ng.nodes.push(currentNode)
            var tempGraph = new TP.Graph()
            tempGraph.nodes(ng.nodes)
            tempGraph.links(ng.links)
            g.show_snippet(ng, currentNode)
            
            
                
            return 
            
            /*
            g.svg.selectAll("path.snippet").data(ng.links).enter()
                .append("path")
                    .classed("link", true)
                    .classed("snippet", true)
                    .classed("path", 1)
                    .attr("d", function (d) {
                        return "M" + d.source.x + " " + d.source.y + " L" + d.target.x + " " + d.target.y;
                    })
    
                    .style("stroke", "black") //before, there was catalyst
                    .style("opacity", TP.Context().defaultLinkOpacity)
                    .style("stroke-width", function (d) {
                        return 1;
                });
           
           view_nodes = (currentNode._type == "substrate") ? "rect" : "circle";

           var glyphR = g.svg.selectAll(view_nodes+".snippet").data(ng.nodes).enter()
                .append(view_nodes)
                .classed("glyph", true)
                .classed("snippet", true)
                .classed(view_nodes, true)
                .style("opacity", TP.Context().defaultNodeOpacity)
                .style("fill", TP.Context().view[currentViewID].getNodesColor())
                .style("stroke-width", 1)

            if (view_nodes == "rect" && glyphR != null) {
                // assert(true, "rect")
                glyphR.attr("x", function (d) {
                    d.currentX = d.x;
                    return d.currentX
                })
                    .attr("y", function (d) {
                        d.currentY = d.y;
                        return d.currentY
                    })
                    .attr("width", 2 * 5)
                    .attr("height", 2 * 5)
            }
            if (view_nodes == "circle" && glyphR != null) {
                // assert(true, "circle");
                glyphR.attr("cx", function (d) {
                    d.currentX = d.x;
                    return d.currentX
                })
                    .attr("cy", function (d) {
                        d.currentY = d.y;
                        return d.currentY
                    })
                    .attr("r", 5)
            }
            */
            
                
                           
            //g.linkContainer.selectAll("g.link")
        }

        g.mouseOutNode = function () {
            var o = g.svg.selectAll(".snippet").data([]).exit().remove();
            
            currentView = TP.Context().view[currentViewID];
            var currentNodeColor = currentView.getNodesColor();
           
           /*
            g.svg.selectAll("g.glyph")
                    .style('opacity', 1.0)
                    .select("circle.node")
                        .style('fill', function (d) {
                            return currentNodeColor;
                        })
                        .style("stroke-width", function(d){return 0});
            g.svg.selectAll("g.node")
                    .select("text.node")
                     .attr("visibility", function(d){return "visible"});
           
            g.svg.selectAll("g.link")
                    .style('opacity', function(d){return 1.0})
                    .select("path.link")
                        .style('stroke', function(d){return currentView.getLinksColor()})
                        .style('stroke-width', function(d){return 1.0})

            
             g.svg.selectAll("g.node")
                    .style("opacity", 1)
                    .select("rect.node")
                        .style('fill', function(d){return currentNodeColor})
                        .style("stroke-width", function(d){return 0});
                        

                //objectReferences.VisualizationObject.resetSize(substrateName);
            g.svg.selectAll("text.node").style("opacity", 1)
            */
 
        }
        
        function limitLabel(lbl)
        {
           var label = lbl;
           if (label && label.length > TP.Context().defaultLabelMaxLength)
           {
              label = label.substring(0, TP.Context().defaultLabelMaxLength-3)+"...";
           }                    
           return label;

        }

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
                return d.baseID
            })
                .enter()
                .append("g")
                .attr("class", function (d) {
                    //console.log(d._type);
                    return d._type
                })
                .classed("node", true)
                .attr("transform", function (d) {
                    d.currentX = d.x;
                    d.currentY = d.y;
                    return
                })
                .call(d3.behavior.drag()
                    .on("dragstart", function (d) {/*
                     var tab = []
                     tab[0] = d3.select(this);
                     tab[1] = tab[0].data()[0].x;
                     tab[2] = tab[0].data()[0].y;
                     tab[3] = tab[0].data()[0].currentX;
                     tab[4] = tab[0].data()[0].currentY;

                     undo = function(){move(tab);}*/
                    })
                    .on("drag", function (d) {
                        TP.Context().view[currentViewID].getController().sendMessage("dragNode", {node: d3.select(this)});
                        //g.dragNode(d3.select(this));
                        /*
                         //save for redo
                         var tab2 = []
                         tab2[0] = d3.select(this);
                         tab2[1] = tab2[0].data()[0].x;
                         tab2[2] = tab2[0].data()[0].y;
                         tab2[3] = tab2[0].data()[0].currentX;
                         tab2[4] = tab2[0].data()[0].currentY;

                         redo = function(){*/
                        /*console.log(tab2);*/
                        /* g.moveNode(tab2);}
                         //TP.Context().changeStack.addChange("moveSommet", undo, redo);
                         */
                    })

                    .on("dragend", function () {
                        TP.Context().view[currentViewID].getController().sendMessage("dragNodeEnd", {node: d3.select(this)});
                        /*
                     console.log("mouseDown, mouseDown");

                     //g.arrangeLabels();
                     //if(saveUndo == 1){

                     TP.Context().changeStack.addChange("moveSommet", undo, redo);
                     undo = null;
                     redo = null;
                     saveUndo = 0;
                     //}
                     */
                    }))
                .on("click", function (d) {
                    TP.Context().view[currentViewID].getController().sendMessage("showHideLabelNode", {node: d3.select(this)})
                })
                .on("mouseover", function (d) {
                    //console.log("appending a snippet");
                    TP.Context().view[currentViewID].getController().sendMessage("mouseoverShowLabelNode", {data: d});
                })
                .on("mouseout", function () {
                    
                })
                .append("g")
                .attr("class", function (d) {
                    return d._type;
                })
                .classed("glyph", true)


            /*
             var glyphR = g.svg.selectAll("g.glyph.substrate")
             .append("rect")
             .attr("class", function (d) {return d._type})
             .classed("node", true)
             .classed("rect", true)
             .style("fill", TP.Context().tabNodeColor["substrate"])
             .attr("x", function (d) {
             d.currentX = d.x;
             return d.currentX
             })
             .attr("y", function (d) {
             d.currentY = d.y;
             return d.currentY
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
             d.currentX = d.x;
             return d.currentX
             })
             .attr("cy", function (d) {
             d.currentY = d.y;
             return d.currentY
             })
             .attr("r", 5)
             */

            //var glyphR = g.svg.selectAll("g.glyph."+target)
            var glyphR = g.nodeContainer.selectAll("g.glyph." + TP.Context().view[currentViewID].getType())
                .append(view_nodes)
                .attr("class", function (d) {
                    return d._type
                })
                .classed("node", true)
                .classed(view_nodes, true)
                .style("opacity", TP.Context().defaultNodeOpacity)
                .style("fill", TP.Context().view[currentViewID].getNodesColor())

            if (view_nodes == "rect" && glyphR != null) {
                // assert(true, "rect")
                glyphR.attr("x", function (d) {
                    d.currentX = d.x;
                    return d.currentX
                })
                    .attr("y", function (d) {
                        d.currentY = d.y;
                        return d.currentY
                    })
                    .attr("width", 2 * 5)
                    .attr("height", 2 * 5)
            }
            if (view_nodes == "circle" && glyphR != null) {
                // assert(true, "circle");
                glyphR.attr("cx", function (d) {
                    d.currentX = d.x;
                    return d.currentX
                })
                    .attr("cy", function (d) {
                        d.currentY = d.y;
                        return d.currentY
                    })
                    .attr("r", 5)
            }


            var selection = g.labelContainer.selectAll("text.node")
            //var selection = g.svg.selectAll("g.node")
            selection.data(g.cGraph.nodes(),function (d) {
                return d.baseID
            }).enter()
                //selection
                .append("text")
                .attr("class", function (d) {
                    return "node" + d.baseID + " " + d._type
                })
                .classed("node", true).classed("text", true)
                .attr("dx", function (d) {
                    d.currentX = d.x;
                    return d.currentX
                })
                .attr("dy", function (d) {
                    d.currentY = d.y;
                    return d.currentY
                })

                //.attr('unselectable', 'on')
                //.on('selectstart', function(){return false;})
                .style("font-size",12)
                .style("opacity", TP.Context().defaultLabelOpacity)
                .text(function (d) {                    
                    return limitLabel(d.label);
                });


            g.arrangeLabels();

            if ("viewMetric" in g.svg.select("g.node").data()[0]) {
                g.resize(g.cGraph, 0);
            }

        }


        g.drawLabels = function () {
            return;                  // return???
            //console.log("drawLabels " + g.svg.attr("id"));
            /*var labelNode = g.svg.selectAll("text.node")
             .data(g.cGraph.nodes(),function(d){return d.baseID}).enter().append("g")
             .attr("class", function(d){return d._type})
             .classed("text", true)
             .style("fill", TP.Context().view[currentViewID].getLabelsColor())
             console.log(TP.Context().view[currentViewID].getLabelsColor())
             console.log("GraphDrawing -> drawLabels")
             var labelContent= labelNode
             .append("text")
             .attr("class", function(d){return "node" + d.baseID + " " + d._type})
             .classed("node", true).classed("text", true)
             .attr("dx", function(d){return d.currentX})
             .attr("dy", function(d){return d.currentY})
             .text(function(d) { console.log(d); return d.label; });
             console.log(labelNode)
             g.arrangeLabels();     */

        }


        // This function rescales the graph data in order to fit the svg window
        // data, the graph data (modified during the function)
        g.rescaleGraph = function (graph, width_, height_) {

            if (!graph)
                graph = g.cGraph
            
            var leftFrame = 10
            var rightFrame = 100
            var topFrame = 20
            var bottomFrame = 10
            
            //var frame = 60.0            
            
            if (!width_)
                width_ = TP.Context().width
            //var w = width_ - (2 * frame)
            var w = width_ - (leftFrame + rightFrame)

            if (!height_)
                height_ = TP.Context().height 
            
            //var h = height_ - (2 * frame)
            var h = height_ - (topFrame + bottomFrame)

            var node = graph.nodes();
            //console.log("Rescaling the graphe, here is the data: ", data);

            if (node.length <= 0)
                return

            var Xminmax = d3.extent(node, function (d) {
                return d.x;
            });
            var Yminmax = d3.extent(node, function (d) {
                return d.y;
            });

            var delta = 0.00000000000000000001 //to avoid division by 0
            var scale = Math.min.apply(null, [w / (Xminmax[1] - Xminmax[0] + delta), h / (Yminmax[1] - Yminmax[0] + delta)])
            node.forEach(function (d) {
                d.x = (d.x - Xminmax[0]) * scale + leftFrame;
                d.y = (d.y - Yminmax[0]) * scale + topFrame;
                d.currentX = d.x;
                d.currentY = d.y;
            })

            //g.arrangeLabels();
        }


        g.rotate = function (currentViewID, valeur) {
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
                    //console.log(d.x +" "+ d.y);
                    x_tmp = (Math.cos(valeur) * (d.x - x_center)) + (Math.sin(valeur) * (d.y - y_center)) + x_center;
                    y_tmp = ((-1 * Math.sin(valeur)) * (d.x - x_center)) + (Math.cos(valeur) * (d.y - y_center)) + y_center;
                    d.x = x_tmp;
                    d.y = y_tmp;
                    //console.log("res:", d.x, d.y)
                }
            );

            g.rescaleGraph(TP.Context().view[currentViewID].getGraph());
            g.changeLayout(g.cGraph, 0);
        }


        g.delLinks = function () {
            var links = g.svg.selectAll("g.link")
                .data([])
                .exit()
                .remove();
        }


        g.delLabels = function () {
            var selection = g.labelContainer.selectAll("g.text")
                .data([])
                .exit()
                .remove();
        }


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
                //console.log("link transforms: ", links.attr("transform"));
                transform = links.attr("transform");
            }
            g.linkContainer.selectAll("g.link")
                .data([])
                .exit()
                .remove();
            //console.log("the current trasformation", transform);

            var link = g.linkContainer.selectAll("g.link")
                .data(g.cGraph.links(), function (d) {
                    return d.baseID
                })
                .enter()
                .append("g")
                .attr("class", function (d) {
                    return d._type
                })
                .classed("link", true)

            link.append("path")
                .attr("class", function (d) {
                    return d._type
                })
                .classed("link", true)
                .classed("path", 1)
                .attr("d", function (d) {
                    return "M" + d.source.x + " " + d.source.y + " L" + d.target.x + " " + d.target.y;
                })

                .style("stroke", TP.Context().view[currentViewID].getLinksColor()) //before, there was catalyst
                .style("opacity", TP.Context().defaultLinkOpacity)
                .style("stroke-width", function (d) {
                    return 1;
                })


            link.attr("transform", transform);
        }


        // this function moves the nodes and links
        // _graph, the new graph placement
        // dTime, the delay in ms to apply the movement
        // we select each svg:g and its node from their identifier (baseID), 
        // and associate 
        // the new x and y values (d3 does the transition) 
        g.changeLayout = function (_graph, dTime) {
            //console.log("this is layout change")

            // assert(true, "que le move soit avec toi (maitre Yoda)");

            g.cGraph = _graph

            //assert(true, "assigning g.node_s")

            var node = g.nodeContainer.selectAll("g.node")
                .data(g.cGraph.nodes(), function (d) {
                    d.currentX = d.x;
                    d.currentY = d.y;
                    return d.baseID;
                })
            /*.transition()
             .delay(dTime)*/

            //assert(true, "assigning cirle")

            node.select("circle")
                .attr("cx", function (d) {
                    d.currentX = d.x;
                    d.currentY = d.y;
                    return d.x
                })
                .attr("cy", function (d) {
                    return d.y
                })

            //assert(true, "assigning rect")

            node.select("rect")
                .attr("x", function (d) {
                    d.currentX = d.x;
                    d.currentY = d.y;
                    return d.x
                })
                .attr("y", function (d) {
                    return d.y
                });

            //assert(false, "g.node.text -- should be empty")

            var node = g.svg.selectAll("g.node")
            node.select("text")
                .attr("dx", function (d) {
                    return d.x
                })
                .attr("dy", function (d) {
                    return d.y
                })

            //assert(true, "assigning g.link_s")

            var link = g.linkContainer.selectAll("g.link")
                .data(g.cGraph.links(), function (d) {
                    return d.baseID
                })
                /*.transition()
                 .delay(dTime)*/
                .select("path")
                .attr("d", function (d) {

                    //assert(false, "edge does not match or isn't bounded")

                    //console.log(d)                 	

                    return "M" + d.source.x + " " + d.source.y + " L" + d.target.x + " " + d.target.y;
                })

            //var label = g.svg.selectAll("g.text")
            //   	.data(g.cGraph.nodes(),function(d){
            //   	    d.currentX = d.x; d.currentY = d.y; return d.baseID;
            //    })
            //.transition().delay(dTime)
            // 	.select("text")
            //assert(true, "assigning text.node_s")

            var label = g.labelContainer.selectAll("text.node")
                .data(g.cGraph.nodes(), function (d) {
                    return d.baseID
                })
                .attr("dx", function (d) {
                    //assert(false,"moving a label")
                    d.currentX = d.x;
                    d.currentY = d.y;
                    return d.x
                })
                .attr("dy", function (d) {
                    return d.y
                });

            //console.log("arrangeLabels after GraphDrawing.move()");

            //assert(true, "arranging labels")
            g.arrangeLabels();


        }


        // this function resizes the nodes
        // _graph, the new graph with size
        // dTime, the delay in ms to resize
        // we select each svg:g and its node from their identifier (baseID), 
        // and associate 
        // the node's 'viewMetric' property to the svg:circle's 'r' attribute
        g.resize = function (_graph, dTime) {
            //For backward compatibility only
            g.nodeSizeMap(_graph, dTime, {metric: "viewMetric"})
        }


        g.nodeSizeMap = function (_graph, dTime, params) {
            g.cGraph = _graph

            var scaleMin = 3.0
            var scaleMax = 12.0
            var parameter = ""
            if (params.metric) parameter = params.metric;
            if (params.scaleMin) scaleMin = params.scaleMin;
            if (params.scaleMax) scaleMax = params.scaleMax;
            //console.log("params.metric : ", params.metric)

            if (parameter == "") return


            var valMin = null
            var valMax = null
            g.cGraph.nodes()
                .forEach(function (n) {
                    //console.log("node:", n)
                    val = eval("n[\"" + parameter + "\"]");
                    if(!val)val = 3;
                    //console.log("val:", val)
                    if (valMin == null | val < valMin)
                        valMin = val;
                    if (valMax == null | val > valMax)
                        valMax = val;
                });

            //linear
            if (valMax == valMin || valMax - valMin < 0.0001) {
                scaleMin = 5
            }


            var dom = [valMin, valMax]
            var range = [scaleMin, scaleMax]
            var scale = d3.scale.linear().domain(dom).range(range)
            var node = g.nodeContainer.selectAll("g.node")
                .data(g.cGraph.nodes(), function (d) {
                    return d.baseID
                })

            node.select("circle.node").attr("r", function (d) {
                var val = eval('d[\"'+parameter+'\"]');
                if(!val)val = 1;
                return scale(val);

            })
            //error: d n'a plus de ViewMetric par défaut...
            node.select("rect.node")
                .attr("width", function (d) {
                    //console.log(d)
                    var val = eval('d[\"'+parameter+ '\"]');
                    if(!val)val = 3;
                    return 2 * scale(val)
                })
                .attr("height", function (d) {
                    var val = eval('d[\"'+parameter+ '\"]');
                    if(!val)val = 3;
                    return 2 * scale(val)
                })

            var link = g.linkContainer.selectAll("g.link")

                .data(g.cGraph.links(), function (d) {
                    return d.baseID
                })


            link.select("path.link")
                .style("stroke-width", function (d) {
                    return 1;
                })
        }


        g.nodeColorMap = function (_graph, dTime, parameter, diff) {
            diff = true;
            g.cGraph = _graph
            //console.log(g.cGraph);
            //we would like it better as a parameter
            //assert(false, "turlututu");
            scaleMin = 3.0
            scaleMax = 12.0

            valMin = null
            valMax = null

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
                    return d.baseID
                })

            node.select("g.glyph")
                .select(".node")
                .style("fill", function (d) {
                    c = color(eval('d[\"' + parameter +'\"]'));
                    return d3.rgb(c);
                })

            var link = g.linkContainer.selectAll("g.link")
                .data(g.cGraph.links(), function (d) {
                    return d.baseID
                })

            link.select("path.link")
                .style("stroke-width", function (d) {
                    return 1;
                })
        }

        /********************************** ON GOING **********************************/
        g.changeColor = function (graphName, _graph, elem, color) {
            g.cGraph = _graph
            // console.log(g);
            // console.log(g.cGraph);
            if (elem == "node") {
                var node = g.nodeContainer.selectAll("g.node")
                    .data(g.cGraph.nodes(), function (d) {
                        return d.baseID
                    })

                node.select("g.glyph").select(".node")
                    .style("fill", function (d) {
                        return d3.rgb(color);
                    })
            } else if (elem === "link") {
                var link = g.linkContainer.selectAll("g.link")
                    .data(g.cGraph.links(), function (d) {
                        return d.baseID
                    })

                link.select("path.link")
                    .style("stroke", function (d) {
                        return d3.rgb(color);
                    })
                    .style("stroke-width", function (d) {
                        return 1;
                    })
            } else if (elem === "bg") {
                $("#zone" + graphName).css("background-color", color);
            } else if (elem === "label") {
                var labels = g.svg.selectAll("text.node.text")
                    .style('fill', function (d) {
                        return d3.rgb(color);
                    })
                    .style('stroke', function (d) {
                        return d3.rgb(color);
                    });
                g.drawLabels();
                //var label = g.svg.selectAll("g.text").style('fill',color);
            } else {
                console.log("erreur g.changeColor");

            }
        }

        g.changeSettingsLabels = function(graphName, _graph, elem, value){
            console.log(elem, value)
            g.cGraph = _graph;
            //console.log(elem, value)
            g.labelContainer.selectAll("text.node.text")
                .style(elem,value)

        }
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
                        .on("mouseover", function(d){ TP.Context().view[currentViewID].getController().sendMessage("mouseOutNode");})
            
            currentView = TP.Context().view[currentViewID]
            currentGlyph = currentView.getViewNodes()
            currentGlyphClass = currentGlyph + ".node"
            
            snippetGroup = g.svg.append("g")
                            .classed("snippet", 1)
                            .on("mouseout",function(d){ TP.Context().view[currentViewID].getController().sendMessage("mouseOutNode"); })

            snippetGroup.selectAll("path.snippet").data(_graph.links).enter()
                .append("path")
                    .classed("link", true)
                    .classed("snippet", true)
                    .classed("path", 1)
                    .attr("d", function (d) {
                        return "M" + d.source.x + " " + d.source.y + " L" + d.target.x + " " + d.target.y;
                    })
    
                    .style("stroke", "#009933") //before, there was catalyst
                    .style("opacity", TP.Context().defaultLinkOpacity)
                    .style("stroke-width", function (d) {
                        return 1;
                });
           
           view_nodes = (currentView.getType() == "substrate") ? "rect" : "circle";

           var glyphR = snippetGroup.selectAll(view_nodes+".snippet").data(_graph.nodes).enter()
                .append(view_nodes)
                .classed("glyph", true)
                .classed("snippet", true)
                .classed(view_nodes, true)
                .style("stroke","#009933")
                .style("stroke-width", 1)
                .style("opacity",1)

            if (view_nodes == "rect" && glyphR != null) {
                // assert(true, "rect")
                glyphR.attr("x", function (d) {
                    d.currentX = d.x;
                    return d.currentX
                })
                    .attr("y", function (d) {
                        d.currentY = d.y;
                        return d.currentY
                    })
                    .attr("width", function(d){var rects = g.svg.selectAll("g.node").data([d], function(d){return d.baseID}).select("rect");
                    return rects.attr("width");})//2 * 5})
                    .attr("height", function(d){var rects = g.svg.selectAll("g.node").data([d], function(d){return d.baseID}).select("rect");
                    return rects.attr("height");})//2 * 5})
                    //.style("opacity", TP.Context().defaultNodeOpacity)
                    .style("fill-opacity", 0)//TP.Context().view[currentViewID].getNodesColor())
                
            }
            if (view_nodes == "circle" && glyphR != null) {
                // assert(true, "circle");
                glyphR.attr("cx", function (d) {
                    d.currentX = d.x;
                    return d.currentX
                })
                    .attr("cy", function (d) {
                        d.currentY = d.y;
                        return d.currentY
                    })
                    .attr("r", function(d){
                        var circles = g.svg.selectAll("g.node").data([d], function(d){return d.baseID}).select("circle")
                        return circles.attr("r");
                        })
                    .style("fill-opacity", 0)
            }
            
            snippetGroup.selectAll("text.snippet").data(ng.nodes).enter()
                .append("text")
                .attr("dx", function (dd) {
                    return dd.currentX
                })
                .attr("dy", function (dd) {
                    return dd.currentY
                })
                .classed("snippet", 1)
                .style("fill",TP.Context().view[currentViewID].getLabelsColor())
                .style("stroke",TP.Context().view[currentViewID].getLabelsColor())
                .style("stroke-width",1)
                .text(function (dd) {
                    if(dd.visible || dd.baseID == currentNode.baseID)
                        return dd.label
                });
            
            return;
        }


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

            currentView = TP.Context().view[currentViewID]
            currentGlyph = currentView.getViewNodes()
            currentGlyphClass = currentGlyph + ".node"

            var node = g.nodeContainer.selectAll("g.node")
                .style("opacity", .5)


            var glyphG = node.select("g.glyph")
            var glyph = glyphG.select(currentGlyphClass)
                .style('fill', currentView.getNodesColor())


            if (currentGlyph == "circle") {
                glyph.attr('r', 5)
                    .style("stroke-width", 0)
                    .style("stroke", "black")
            }
            if (currentGlyph == "rect") {
                glyph.attr('width', 2 * 5)
                    .attr('height', 2 * 5)
                    .style("stroke-width", 0)
                    .style("stroke", "black")
            }


            var node = g.nodeContainer.selectAll("g.node")
                .select("text.node")
                .attr("visibility", "hidden")


            g.labelContainer.selectAll("text.node")
                .style("opacity", 0.5)


            var link = g.linkContainer.selectAll("g.link")
                .style("opacity", .25)
                .select("path.link")
                .style("stroke", currentView.getLinksColor())
                .style("stroke-width", function (d) {
                    return 3;
                })

            //we would like it better as a parameter
            var scaleMin = 3.0
            var scaleMax = 12.0
            var parameter = "entanglementIndex"

            var valMin = null
            var valMax = null

            _graph.nodes()
                .forEach(function (n) {
                    val = eval("n." + parameter);
                    //val = n[parameter]
                    if (valMin == null | val < valMin)
                        valMin = val;
                    if (valMax == null | val > valMax)
                        valMax = val;
                });

            //linear

            var equalScales = false
            if (valMax == valMin || valMax - valMin < 0.0001) {
                equalScales = true
                scaleMin = 5
            }

            var dom = [valMin, valMax]
            var range = [scaleMin, scaleMax]
            var scale = d3.scale.linear().domain(dom).range(range)

            // assign the new data
            var node = g.nodeContainer.selectAll("g.node")
                .classed("shown", 1)
                .data(_graph.nodes(), function (d) {
                    return d.baseID
                })
                .style("opacity", TP.Context().defaultNodeOpacity)

            var link = g.linkContainer.selectAll("g.link")
                .classed("shown", 1)
                .data(_graph.links(), function (d) {
                    return d.baseID
                })
                .style("opacity", TP.Context().defaultLinkOpacity)

            var label = g.labelContainer.selectAll("text.node")
                .classed("shown", 1)
                .data(_graph.nodes(), function (d) {
                    return d.baseID
                })
                .style("opacity", TP.Context().defaultLabelOpacity)

            // update the nodes

            node.select("circle.node")
                .attr("r", function (d) {
                    r = scale(d[parameter])//eval("d." + parameter + "*factor+scaleMin");
                    //r = d[parameter] * factor + scaleMin
                    //if (!r || equalScales) {
                    //    r = scaleMin;
                    //}
                    return r;
                })
                .style("stroke-width", function (d) {
                    return 3;
                })
                .style("stroke", "brown")


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
                .style("stroke", "brown")

            node.select("text.node")
                .attr("visibility", "visible")

            link.select("path.link")
                .style("stroke-width", function (d) {
                    return 2    ;
                })
                .style("stroke", "brown")

            label.select("text.node")
                .attr("visibility", "visible")
                .style('color', contxt.labelColor)

            // reassign the original data

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
        }


        // this function removes the nodes and links removed from the old data
        // _graph, the new graph
        // dTime, the delay in ms to apply the modification  
        // we only use d3's data association then 'exit()' and 'remove()'
        g.exit = function (_graph, dTime) {
            g.cGraph = _graph
            nodeIds = []
            linkIds = []
            _graph.nodes()
                .forEach(function (d) {
                    nodeIds.push(d.baseID)
                })
            _graph.links()
                .forEach(function (d) {
                    linkIds.push(d.baseID)
                })
            //console.log(nodeIds)
            var node = g.nodeContainer.selectAll("g.node")
                .data(_graph.nodes(), function (d) {
                    return d.baseID
                })
            node.exit().remove()

            var link = g.linkContainer.selectAll("g.link")
                .data(_graph.links(), function (d) {
                    return d.baseID
                })
            link.exit().remove()

            var label = g.labelContainer.selectAll("text.node")
                .data(_graph.nodes(), function (d) {
                    return d.baseID
                })
            label.exit().remove()
        }


        // this function clears the graphs, removes all the nodes and links 
        //(similarly to previously)
        g.clear = function () {
            var node = g.svg.selectAll("g.node").data([])
            node.exit().remove()

            var link = g.svg.selectAll("g.link").data([])
            link.exit().remove()

            var label = g.svg.selectAll("text").data([])
            label.exit().remove()
        }


        g.arrangeLabels = function () {
            var intersect = function (rectDiag, point) {
                if (rectDiag[0][0] <= point[0] && rectDiag[1][0] >= point[0] &&
                    rectDiag[0][1] <= point[1] && rectDiag[1][1] >= point[1])
                    return true;
                return false;
            }

            var labels = g.labelContainer.selectAll("text.node")
                .attr("visibility", "visible")
                .style("fill", TP.Context().view[currentViewID].getLabelsColor())
                .text(function(dd){
                    return limitLabel(dd.label);
                });
            var labelsArray = []
            var iterArray = []
            //assert(true,"Les labels au moment de leur traitement")
            labels[0].forEach(function (d) {
                labelsArray.push(d3.select(d));
                //console.log(d.getBBox(), d3.select(d).data()[0].x, d3.select(d).data()[0].y, d3.select(d).data()[0].currentX, d3.select(d).data()[0].currentY)
                iterArray.push(d.getBBox());
            });

            /*
             function sortPoints(xA, xB, yA, yB)
             {
             var diffX = xA - xB
             if (diffX != 0) return diffX;
             var diffY = yA - yB
             return diffY;
             }

             labelsArray.sort(function(b,a){ return sortPoints(a.currentX, b.currentX, a.currentY, b.currentY)})
             iterArray.sort(function(b,a){ return sortPoints(a.x, b.x, a.y, b.y)})
             */

            var margin = 1;

            var iterate = function () {
                var anyChange = false,
                    noChange = false;
                //We should reduce the complexity of this algo!!


                var end = iterArray.length - 1;

                for (var iLabel = 0; iLabel < end; iLabel++) {

                    var bbox = iterArray[iLabel];

                    if (labelsArray[iLabel].attr("visibility") == "visible") {

                        var polygon = [
                            [bbox.x - margin, bbox.y - margin],
                            [bbox.x + bbox.width + margin, bbox.y - margin],
                            [bbox.x - margin, bbox.y + bbox.height + margin],
                            [bbox.x + bbox.width + margin, bbox.y + bbox.height
                                + margin]
                        ];

                        noChange = false;

                        var end2 = iterArray.length;

                        for (var iLabel2 = iLabel + 1; iLabel2 < end2; iLabel2++) {

                            if (labelsArray[iLabel2].attr("visibility") == "visible") {
                                var bbox2 = iterArray[iLabel2];
                                var polygon2 = [
                                    [bbox2.x - margin, bbox2.y - margin],
                                    [bbox2.x + bbox2.width + margin, bbox2.y
                                        - margin],
                                    [bbox2.x - margin, bbox2.y + bbox2.height
                                        + margin],
                                    [bbox2.x + bbox2.width + margin, bbox2.y
                                        + bbox2.height + margin]
                                ];

                                var end3 = polygon2.length;

                                for (var iPoint = 0; iPoint < end3 && !noChange; iPoint++) {
                                    if (intersect([polygon[0], polygon[3]], polygon2[iPoint])) {
                                        labelsArray[iLabel2].attr("visibility", "hidden");
                                        noChange = true;
                                        anyChange = true;
                                        break;
                                    }
                                }
                                for (var iPoint = 0; iPoint < end3
                                    && !noChange; iPoint++) {
                                    if (intersect([polygon2[0], polygon2[3]],
                                        polygon[iPoint])) {
                                        labelsArray[iLabel2].attr("visibility",
                                            "hidden");
                                        noChange = true;
                                        anyChange = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                return anyChange;
            }
            // I think normally just one pass of the algorithm should do it!
            var count = 0;
            while (iterate()) {
                count++
            }
            ;
            //console.log("iterated: ", count);

        }

        g.removeNodeOverlap = function () {
            //fast overlap removal in javascript...
        }


        g.bringLabelsForward = function () {
            g.delLabels();
            g.addLabels();
        }


        g.resetSelection = function () {

            var nodeColor = TP.Context().view[currentViewID].getNodesColor();
            var linkColor = TP.Context().view[currentViewID].getLinksColor();

            g.nodeContainer.selectAll("g.node")
                .classed("selected", false)
                .style('opacity', TP.Context().defaultNodeOpacity)
                .select("circle.node")
                .style('fill', nodeColor)
                .style("stroke-width", 0);
            g.nodeContainer.selectAll("g.node")
                .select("text.node")
                .attr("visibility", "visible");
            g.nodeContainer.selectAll("g.node")
                .select("rect.node")
                .style('fill', nodeColor)
                .style("stroke-width", 0);
            g.linkContainer.selectAll("g.link")
                .style('opacity', TP.Context().defaultLinkOpacity)
                .select("path.link")
                .style('stroke', linkColor)
                .style('stroke-width', 1)

            g.cGraph.nodes().forEach(function (d) {
                d.selected = false;
            })

            //objectReferences.VisualizationObject.resetSize(catalystName);
            g.labelContainer.selectAll("text.node").style("opacity", TP.Context().defaultLabelOpacity)
            //objectReferences.VisualizationObject.arrangeLabels(catalystName);
        }

        g.setSelection = function (nodeIDList) {
            nodeList = []

            //appends to the actual node list and set the "selected" flag to true
            g.cGraph.nodes().forEach(function (d) {
                if (nodeIDList.indexOf(d.baseID) != -1) {
                    d.selected = true;
                    nodeList.push(d)
                }
            })
            //assert(true, "the node list");
            //console.log(nodeList);
            var nodes = g.svg.selectAll("g.node")
            //console.log(nodes);
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
                    //console.log(d);
                    if (d.selected)
                        return "red";
                    else
                        return TP.Context().view[currentViewID].getNodesColor();
                })

            //g.svg.selectAll("g.node")
            //	.data(g.cGraph, function(d){return d.baseID;})
        }

        return g;
    }
    TP.GraphDrawing = GraphDrawing;
})(TP);
