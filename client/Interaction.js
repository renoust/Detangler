/************************************************************************
 * This module contains the interactors with the graph
 * (e.g. node selection and zoom)
 * @requires d3.js
 * @authors Guy Melancon, Benjamin Renoust, Damien Rosmorduc
 * @created May 2012
 ***********************************************************************/

var TP = TP || {};
(function () {


    var Interaction = function () {
        var __g__ = this;

        var contxt = TP.Context();

        var objectReferences = TP.ObjectReferences();


        // This function creates a lasso brush interactor for a specific 
        // target, it also redefined
        // the brush intersection function, and applies actions to the 
        // selected target.
        // target, the string value of the target svg view         
        this.createLasso_deprecated = function (target) {
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
            //TP.Context().view[target].setLasso(new TP.Lasso(target));
            //myL = TP.Context().view[target].getLasso();

            //myL.canMouseUp = __g__.MouseUp

            //myL.canMouseMove = __g__.MouseMove

            //myL.canMouseDown = __g__.MouseDown

        }

        __g__.MouseUp = function (e) {
            if (!TP.Context().mouse_over_button)
                this.mouseUp(e)
        }

        __g__.MouseMove = function (e) {
            if (!TP.Context().mouse_over_button)
                this.mouseMove(e)
        }

        __g__.MouseDown = function (e) {
            if (!TP.Context().mouse_over_button)
                this.mouseDown(e)
        }

        // redefines the intersection function
        // applies keyboard modifiers, control extends the selection,
        // shift removes from the currect selection
        // once the selection is made, it applies the synchronization
        // function syncGraph() to the selected nodes
        // selection colors are hardcoded but this should be changed
        this.checkIntersect_deprecated = function (object) {

            //assert(true, "checkIntersect");

            //var __g = this
            var target = null;
            target = object.associatedData.source;

            var svg = TP.Context().view[target].getSvg();

            var prevSelList = [];

            var __g = TP.Context().view[target].getLasso();

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
                    } else if (e.shiftKey && !intersects && d.selected == true) {
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
            TP.Context().view[target].setSourceSelection(selList);

            if (selList.length > 0)
                TP.Context().view[target].getController().sendMessage("nodeSelected", {selList: selList, prevSelList: prevSelList});
            else
                TP.Context().view[target].getController().sendMessage("selectionVide", {selList: selList});

        }

        //console.log("selection list: ", selList, " with length ", selList.length)


        this.nodeSelected_deprecated = function (object) {

            if (!object)
                return

            var selList = null;
            var currentViewID = null;
            var prevSelList = null;

            if (typeof object.associatedData == "object") {
                if (!object.associatedData.source || !object.associatedData.selList)
                    return;
                else {
                    currentViewID = object.associatedData.source;
                    selList = object.associatedData.selList;
                    prevSelList = object.associatedData.prevSelList;
                }
            }
            else
                return;

            //TODO: prevSelList is not managed anymore, should check it (no need to fire the server)
            prevSelList = TP.Context().view[currentViewID].getPreviousSourceSelection();
            if (!prevSelList) prevSelList = [];
            if (selList.length == prevSelList.length) {

                var i = 0;
                var iMax = selList.length;
                while (i < iMax && selList[i] == prevSelList[i])
                    i++;
                if (i != iMax) {
                    prevSelList.length = 0
                    prevSelList = selList.slice(0);
                    objectReferences.ClientObject.syncGraph(objectReferences.ClientObject.getSelection(currentViewID), currentViewID)
                }//else{
                //    assert(true, "nothing to compute")
                //}
            } else {
                prevSelList.length = 0
                prevSelList = selList.slice(0);
                objectReferences.ClientObject.syncGraph(objectReferences.ClientObject.getSelection(currentViewID), currentViewID)
            }

            TP.Context().view[currentViewID].setPreviousSourceSelection(selList);

        }


        this.updateViewFromSimpleSelection = function (_viewID, _selection) {

            //assert(true, "checkIntersect");


            var currentViewID = _viewID;
            var svg = TP.Context().view[currentViewID].getSvg();

            var prevSelList = [];

            //selList should be here an array of nodes
            var selList = _selection;

            //listening for keyboard event
            var e = d3.event


            svg.selectAll("g.node")
               .classed("selected", function(d){
                    if ((e.ctrlKey || e.metaKey || e.shiftKey) && d.selected == true)
                        return true;
                    d.selected = false;
                    return false;})

                    .select("g.glyph")
                        .select(".node")
                            .style('fill', function(d){
                                if ((e.ctrlKey || e.metaKey || e.shiftKey) && d.selected == true)
                                    return "red";
                                return TP.Context().view[_viewID].getNodesColor();
                            });


            svg.selectAll("g.node").data(selList, function(d){return d.baseID;})

                .classed("selected", function(d){
                    if (e.shiftKey)
                    {
                        d.selected = false;
                        return false;
                    }
                    d.selected = true;
                    return true;
                })

               //should restore keyboard event handler to append/remove from selection
               /*
                if ((e.ctrlKey || e.metaKey) && d.selected == true)return true;

                var intersects = __g.intersect(pointArray, x, y)
                //if (intersects) console.log("node intersects", d)

                if (e.shiftKey && intersects) {
                    //console.log("shift pressed and intersects so return false");
                    d.selected = false;
                } else if (e.shiftKey && !intersects && d.selected == true) {
                    //console.log("shift pressed and doesnt intersects and true so return true");
                    d.selected = true;
                } else {
                    d.selected = intersects;
                }
                //console.log("returning selection:", d.selected)
                return d.selected*/


                .select("g.glyph")
                    .select(".node")
                        .style('fill', function(d){
                            if (e.shiftKey)
                                return TP.Context().view[_viewID].getNodesColor();
                            return 'red';
                        });

                 /*
                 {
                    if (e.ctrlKey && d.selected == true) {
                        selList.push(d.baseID)
                        return 'red';
                    }
                    if (d.selected) {
                        selList.push(d.baseID)
                        return 'red';
                    } else {
                    // if (d._type == "catalyst")
                    // return TP.Context().tabNodeColor["catalyst"];
                    // else
                    // return TP.Context().tabNodeColor["substrate"];
                        return TP.Context().view[target].getNodesColor();
                    }
                }*/

            selList = []
            _selection = svg.selectAll("g.node.selected").data();

            _selection.forEach(function(d){selList.push(d.baseID)});

            selList.sort()

            TP.Context().view[currentViewID].setSourceSelection(selList);

            if (selList.length > 0)
                TP.Context().view[currentViewID].getController().sendMessage("nodeSelected", {selList: selList, prevSelList: prevSelList});
            else
                TP.Context().view[currentViewID].getController().sendMessage("emptySelection", {selList: selList});

        }


        this.emptyListAction = function (object) {

            //assert(false, "il n'y a rien");

            var selList = null;
            var target = null;

            target = object.associatedData.source;
            selList = object.associatedData.selList;


            var svg = TP.Context().view[target].getSvg();

            var combinedSvg = null;
            var catalystSvg = null;
            var substrateSvg = null;

            var combinedView = null;
            var catalystView = null;
            var substrateView = null;

            var combinedName = null;
            var catalystName = null;
            var substrateName = null;


            if (TP.Context().view[target].getAssociatedView("catalyst") != null || TP.Context().view[target].getType() == "catalyst") {
                catalystName = (TP.Context().view[target].getType() == "catalyst") ? target : TP.Context().view[target].getAssociatedView("catalyst")[0].getID();
                catalystView = TP.Context().view[catalystName];
                catalystSvg = (TP.Context().view[target].getType() == "catalyst") ? svg : catalystView.getSvg();
            }


            if (TP.Context().view[target].getAssociatedView("substrate") != null || TP.Context().view[target].getType() == "substrate") {
                substrateName = (TP.Context().view[target].getType() == "substrate") ? target : TP.Context().view[target].getAssociatedView("substrate")[0].getID();
                ;
                substrateView = TP.Context().view[substrateName];
                substrateSvg = (TP.Context().view[target].getType() == "substrate") ? svg : substrateView.getSvg();
            }


            if (TP.Context().view[target].getAssociatedView("combined") != null || TP.Context().view[target].getType() == "combined") {
                combinedName = (TP.Context().view[target].getType() == "combined") ? target : TP.Context().view[target].getAssociatedView("combined")[0].getID();
                combinedView = TP.Context().view[combinedName];
                combinedSvg = (TP.Context().view[target].getType() == "combined") ? svg : combinedView.getSvg();
            }

            if (catalystSvg != null) {


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
                    .style('fill', function (d) {
                        if (substrateSvg != null)
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
                //objectReferences.VisualizationObject.arrangeLabels(catalystName);
                TP.Controller().sendMessage("arrangeLabels", null, catalystName, catalystName);


            }

            if (substrateSvg != null) {

                var substrateNodeColor = substrateView.getNodesColor();

                substrateSvg.selectAll("g.node")
                    .style('opacity', 1.0)
                    .select("circle.node")
                    .style('fill', function (d) {
                        if (catalystSvg != null)
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
                //objectReferences.VisualizationObject.arrangeLabels(substrateName);
                TP.Controller().sendMessage("arrangeLabels", null, substrateName, substrateName);

            }

            if (combinedSvg != null && catalystSvg != null && substrateSvg != null) {


                var combinedNodeColor = combinedView.getNodesColor();

                combinedSvg.selectAll("g.node")
                    .style('opacity', 1.0)
                    .select("circle.node")
                    .style('fill', function (d) {
                        if (catalystSvg != null)
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
                    .style('fill', function (d) {
                        if (substrateSvg != null)
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

            if (catalystSvg != null)
            //TP.ObjectReferences().VisualizationObject.sizeMapping("entanglementIndice", catalystName);
                TP.Context().view[catalystName].getController().sendMessage("sizeMapping", {parameter: 'entanglementIndice', idView: catalystName})

            d3.select("#svg_" + target).select("g.brush").select("polygon").style('fill', "white");
            TP.Visualization().entanglementCaught(target, 1);

            //console.log("warning: the selection list is empty");

            //TP.Context().view["catalyst"].getSvg().selectAll("text.node").style("opacity", 1)
            //TP.Context().view["substrate"].getSvg().selectAll("text.node").style("opacity", 1)
            //TP.Context().view["combined"].getSvg().selectAll("text.node").style("opacity", 1)

            //assert(true, "arrangeLabels appele depuis le lasso");
            //objectReferences.VisualizationObject.arrangeLabels("substrate");
            //objectReferences.VisualizationObject.arrangeLabels("catalyst");
        }


        __g__.brushstart_deprecated = function (_event) {

            var svg = _event.associatedData.svg;
            svg.classed("selecting", true);

        }


        // This function associate a d3.svg.brush element to select nodes in a 
        // view target, the string value of the target svg view 
        // This function is deprecated but one can activate it anytime
        this.addBrush_deprecated = function (target) {


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
                    .on("brushstart", function () {
                        TP.Context().view[target].getController().sendMessage("brushstart", {svg: svg})
                    })
                    .on("brush", brushmove)
                    .on("brushend", brushend))
                .style('stroke', 'black')
                .style('stroke-width', 2)
                .style('fill-opacity', .125)
                .style('shape-rendering', 'crispEdges')


            var prevSelList = [];

            // This function will check the nodes intersections and synchronize 
            //accordingly

            function brushmove() {
                var e = d3.event.target.extent();
                //assert(false, "d3.event.target.extent()");
                //console.log(e);
                var node = svg.selectAll("g.node")
                var selList = []
                node.classed("selected", function (d) {
                    wNorm = w - buttonWidth
                    d.selected = e[0][0] <= (d.currentX - buttonWidth + 1) / wNorm && (d.currentY - buttonWidth + 1) / wNorm <= e[1][0] && e[0][1] <= d.currentY / h && d.currentY / h <= e[1][1];
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
                            objectReferences.ClientObject.syncGraph(objectReferences.ClientObject.getSelection(target), target)
                        }
                    } else {

                        prevSelList.length = 0
                        prevSelList = selList.slice(0);
                        objectReferences.ClientObject.syncGraph(
                            objectReferences.ClientObject
                                .getSelection(target), target)
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
        this.addLasso_deprecated = function (_event) {

            var target = null;

            target = _event.associatedData.source;

            //console.log("target : " + target)

            var view = TP.Context().view[target];

            var mySvg = null
            var myL = null

            mySvg = view.getSvg();
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

            mySvg.on("mouseup", function () {
                TP.Context().view[target].getController().sendMessage("mouseupLasso", {myL: myL, mouse: d3.mouse(this)})
            });
            mySvg.on("mousedown", function () {
                TP.Context().view[target].getController().sendMessage("mousedownLasso", {myL: myL, mouse: d3.mouse(this)})
            });
            mySvg.on("mousemove", function () {
                TP.Context().view[target].getController().sendMessage("mousemoveLasso", {myL: myL, mouse: d3.mouse(this)})
            });
        }


        // Removes the lasso interactor from a specific svg target's callbacks 
        //to its mouse events.
        // target, the string value of the target svg view         
        this.removeLasso_deprecated = function (_event) {

            var target = null;

            target = _event.associatedData.source;

            var svg = null
            svg = TP.Context().view[target].getSvg();

            svg.on("mouseup", null);
            svg.on("mousedown", null);
            svg.on("mousemove", null);

        }


        this.runZoom = function (_event) {

            var target = _event.associatedData.source;
            var wheelDelta = _event.associatedData.wheelDelta;
            var mousePos = _event.associatedData.mousePos;
            
            

            //assert(true, "wheelData : " + wheelDelta)

            //if (!TP.Context().view[target].getMoveMode())
               // return;

            var cible = d3.select("#svg" + target)[0][0]

            var cGraph = TP.Context().view[target].getGraph();
            var svg = TP.Context().view[target].getSvg();
            var time = 0;

            var delta = null;

            delta = wheelDelta


            var mouseOrigin = [];

            if (mousePos == null)
                mouseOrigin = d3.mouse(cible);
            else {
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
                .data(cGraph.nodes(), function (d) {
                    d.x = d.currentX;
                    d.y = d.currentY;
                    d.x = ((((d.x) - mouseOrigin[0]) * scale) + mouseOrigin[0]);
                    d.y = ((((d.y) - mouseOrigin[1]) * scale) + mouseOrigin[1]);
                    d.currentX = d.x;
                    d.currentY = d.y;
                    return d.baseID;
                })
                .transition().delay(time)

            node.select("circle")
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })

            node.select("rect")
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })

            var link = svg.selectAll("g.link")
                .data(cGraph.links(), function (d) {
                    return d.baseID
                })
                .transition().delay(time)
                .select("path")
                .attr("d", function (d) {
                    return "M" + d.source.x + " " + d.source.y + " L" + d.target.x + " " + d.target.y;
                })

            var label = svg.selectAll("text.node")
                .data(cGraph.nodes(), function (d) {
                    return d.baseID;
                })
                .transition().delay(time)

                //label.select("text")
                .attr("dx", function (d) {
                    return d.x;
                })
                .attr("dy", function (d) {
                    return d.y;
                })

            _event.preventDefault();

        }


        this.movingZoomDrag = function (_event) {

            var target = _event.associatedData.source;
            var data_translation = _event.associatedData.data;
            //console.log(data_translation);
            var svg = _event.associatedData.svg;
            var cGraph = _event.associatedData.cGraph;

            if (!TP.Context().view[target].getMoveMode())
                return;
			
            data_translation[0] = _event.associatedData.dx + data_translation[0];
            data_translation[1] = _event.associatedData.dy + data_translation[1];

            var nodeDatum = svg.selectAll("g.node").data()

            nodeDatum.forEach(function (d) {
                d.currentX = (d.x + data_translation[0]);
                d.currentY = (d.y + data_translation[1]);
            });


            svg.selectAll("rect")
                .data(nodeDatum, function (d) {
                    return d.baseID;
                })
                .attr("x", function (d) {
                    return d.currentX
                })
                .attr("y", function (d) {
                    return d.currentY
                })

            svg.selectAll("circle")
                .data(nodeDatum, function (d) {
                    return d.baseID;
                })
                .attr("cx", function (d) {
                    return d.currentX
                })
                .attr("cy", function (d) {
                    return d.currentY
                })

            svg.selectAll("text.node")
                .data(nodeDatum, function (d) {
                    return d.baseID;
                })
                .attr("dx", function (d) {
                    return d.currentX
                })
                .attr("dy", function (d) {
                    return d.currentY
                })


            svg.selectAll("g.link")
                .data(cGraph.links(), function (d) {
                    return d.baseID
                })
                .select("path")
                .attr("d", function (d) {
                    return "M" + d.source.currentX + " " + d.source.currentY + " L" + d.target.currentX + " " + d.target.currentY;
                })
        }

        this.movingZoomDragEnd = function (_event) {

            var data_translation = _event.associatedData.data;
            //console.log("movingZoomDragEnd : ")
            //console.log(data_translation);
            var svg = _event.associatedData.svg;

            var nodeDatum = svg.selectAll("g.node").data()

            nodeDatum.forEach(function (d) {
                d.x = d.currentX;
                d.y = d.currentY;
            });

            data_translation[0] = 0;
            data_translation[1] = 0;

            //console.log(data_translation);
        }

        // Adds a zoom interactor to a specific svg target as callbacks to its 
        //mouse events.       
        this.addZoom = function (_event) {

            var target = null;

            target = _event.associatedData.source;

            var svg = null;
            var cGraph = null;

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            svg.on("mousewheel", function () {

                var value = event.wheelDelta;

                TP.Context().view[target].getController().sendMessage("runZoom", {wheelDelta: value, mousePos: null});
            });
            //svg.on("drag", movingZoom(target));

/*
            var translation_tab = TP.Context().view[target].getDataTranslation();//TP.tabDataTranslation[target];//eval("TP.Context().data_translation_"+target);

            data_translation = [translation_tab[0], translation_tab[1]]

            //console.log(data_translation );
         
            svg.call(d3.behavior.drag()
                .on("drag", function () {
                    TP.Context().view[target].getController().sendMessage("movingZoomDrag", {cGraph: cGraph, data: data_translation, svg: svg, dx:d3.event.dx, dy:d3.event.dy});
                })
                .on("dragend", function () {
                    TP.Context().view[target].getController().sendMessage("movingZoomDragEnd", {data: data_translation, svg: svg});
                })
            );
*/
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

        this.addMove = function(_event)
        {
            
            var target = null;

            target = _event.associatedData.source;

            var svg = null;
            var cGraph = null;

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();
                                    
            var translation_tab = TP.Context().view[target].getDataTranslation();//TP.tabDataTranslation[target];//eval("TP.Context().data_translation_"+target);

            data_translation = [translation_tab[0], translation_tab[1]]
                        
            svg.call(d3.behavior.drag()
                .on("drag", function () {
                    TP.Context().view[target].getController().sendMessage("movingZoomDrag", {cGraph: cGraph, data: data_translation, svg: svg, dx:d3.event.dx, dy:d3.event.dy});
                })
                .on("dragend", function () {
                    TP.Context().view[target].getController().sendMessage("movingZoomDragEnd", {data: data_translation, svg: svg});
                })
            );
        }
        
        this.removeMove = function(_event)
        {
            var target = null;

            target = _event.associatedData.source;

            var svg = null
            svg = TP.Context().view[target].getSvg();


            svg.on("mousedown.drag", null);          
        }

        this.toggleSelection = function (_currentViewID) {
            //console.log(this);
            var cView = TP.Context().view[_currentViewID];
            var cGraph = cView.getGraph();
            var cSvg = cView.getSvg();
            var typeGraph = cView.getType();
            var associatedSelection = null;
            var associatedViews = null;
            if (typeGraph == "substrate")
                associatedViews = cView.getAssociatedView("catalyst");
            if (typeGraph == "catalyst")
                associatedViews = cView.getAssociatedView("substrate");
            if (!associatedViews) return;
            //console.log("the current type: ",typeGraph);
            //assert("true", "we have the associated view!");
            //console.log(associatedViews[0].getType());
            var cAssociatedView = associatedViews[0];
            associatedSelection = cAssociatedView.getTargetSelection();

            //console.log(associatedSelection);
            if (!associatedSelection) return;

            //assert(true, "the associated selection");
            //console.log(associatedSelection)

            var associatedGraph = cAssociatedView.getGraph();
            var associatedSvg = cAssociatedView.getSvg();

            var graph_drawing = cAssociatedView.getGraphDrawing();//TP.GraphDrawing(associatedGraph, associatedSvg, currentViewID);
            graph_drawing.resetSelection();
            graph_drawing.setSelection(associatedSelection);
            //console.log("target json");
            //console.log(objectReferences.ClientObject.getSelection(cAssociatedView.getID()));
            objectReferences.ClientObject.syncGraph(objectReferences.ClientObject.getSelection(cAssociatedView.getID()), cAssociatedView.getID())
        }


        // Removes the lasso interactor from a specific svg target's callbacks 
        // to its mouse events.
        // target, the string value of the target svg view         
        this.removeZoom = function (_event) {

            var target = null;

            target = _event.associatedData.source;

            var svg = null
            svg = TP.Context().view[target].getSvg();


            svg.on("mousedown.drag", null)
                .on("mousewheel", null);
        }


        this.toggleCatalystSyncOperator = function (target) {
            //console.log(target)
            if (TP.Context().tabOperator[target] == "OR") { //befrore, there was only catalyst
                TP.Context().tabOperator[target] = "AND";
                $('li.form > a').each(function () {
                    if ($(this).text() === 'Operator OR') {
                        $(this).text('Operator AND')
                    }
                })
            } else {
                TP.Context().tabOperator[target] = "OR"
                $('li.form > a').each(function () {
                    if ($(this).text() === 'Operator AND') {
                        $(this).text('Operator OR')
                    }
                })

            }
            /*
             TP.Context().view[target].getSvg().selectAll("g.toggleCatalystOp")
             .select("text")
             .text("operator " + TP.Context().tabOperator[target])*/
        }


        this.highlight = function (data, i, j, target) { //befrore, there was only catalyst
            TP.Context().view[target].getSvg().selectAll(TP.Context().view[target].getViewNodes() + ".node")
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


        this.delSelection = function (currentViewID) {

            var currentView = TP.Context().view[currentViewID]
            var svg = currentView.getSvg();
            var graph = currentView.getGraph();

            var newLinks = [];
            var newNodes = [];

            //console.log("the current view selection: ", currentView.getSourceSelection())

            graph.links().forEach(function (d) {
                if (!(currentView.getSourceSelection().indexOf(d.source.baseID) != -1 || currentView.getSourceSelection().indexOf(d.target.baseID) != -1)) {
                    newLinks.push(d);
                }
            })

            graph.nodes().forEach(function (d) {
                if (!(currentView.getSourceSelection().indexOf(d.baseID) != -1)) {
                    newNodes.push(d);
                }
            })

            var typeGraph = currentView.getType();

            graph.nodes(newNodes, typeGraph);
            graph.links(newLinks, typeGraph);
            graph.edgeBinding()

            svg.selectAll("g.node").data(graph.nodes(),function (d) {
                return d.baseID
            }).exit().remove();
            svg.selectAll("text.node").data(graph.nodes(),function (d) {
                return d.baseID
            }).exit().remove();
            svg.selectAll("g.link").data(graph.links(),function (d) {
                return d.baseID
            }).exit().remove();

            //TODO: delete also in server (!)

            //svg.selectAll("g.node").data(graph.nodes())
            //  .attr("visibility", function(d){if(TP.Context().syncNodes.indexOf(d.baseID) != -1){return "hidden"}else{return "visible"}})
            //svg.selectAll("g.link").data(graph.links())
            //  .attr("visibility", function(d){if(TP.Context().syncNodes.indexOf(d.source.baseID) != -1 || TP.Context().syncNodes.indexOf(d.target.baseID) != -1){return "hidden"}else{return "visible"}})


            //console.log(TP.Context().syncNodes);
        }

        return __g__;

    }
    TP.Interaction = Interaction;
})(TP);
