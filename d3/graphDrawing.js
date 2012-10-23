/************************************************************************
 * This container takes care of the actual drawing of the graph (e.g.
 * nodes and links) and of its direct interaction
 * @requires d3.js
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

// This structure compiles the drawing functions, parameters
// _graph, the graph object to manipulate
// _svg, the svg object to manipulate the graph
//
// something to check with the currentX/currentY association that is repeated here
// not harmful yet, but doesn't seem to be really useful either
var graphDrawing = function(_graph, _svg)
{

        // g, the return variable
        // cGraph, the current graph
        // svg, the current svg
        var g = {}
        g.cGraph = _graph
        g.svg = _svg


        // this function draws the graph, first the links then the nodes
        g.draw = function()
        {
                g.drawLinks()
                g.drawNodes()
                //g.addInteraction()
        }


        // this function draws the nodes using d3
        // we associate to each graph node an svg:g (indexed by baseID)
        // each svg:g sets the interaction for the nodes (click, mouseover, mouseout)
        // to each group are added an svg:circle (placed according to the node property x and y)
        // and an svg:text printing the node property label
        g.drawNodes = function()
        {
        
                function move(){
                    //var e = window.event;
                    //if (e.ctrlKey || e.metaKey) return;
                    this.parentNode.appendChild(this);
                    var dragTarget = d3.select(this);
                    var nodeTarget = dragTarget.select("circle.node");
                    var labelTarget = dragTarget.select("text.node");
                    var currentNode = dragTarget.data()[0]
                    var posX = d3.event.dx
                    var posY = d3.event.dy

                    
                    currentNode.x += posX
                    currentNode.y += posY
                    currentNode.currentX += posX
                    currentNode.currentY += posY
                    

                    //dragTarget.data([currentNode])
                
                    var currentBaseID = currentNode.baseID
                    
                    nodeTarget
                        .attr("cx", function(){return d3.event.dx + parseInt(nodeTarget.attr("cx"))})
                        .attr("cy", function(){return d3.event.dy + parseInt(nodeTarget.attr("cy"))});
                    labelTarget
                        .attr("dx", function(){return d3.event.dx + parseInt(labelTarget.attr("dx"))})
                        .attr("dy", function(){return d3.event.dy + parseInt(labelTarget.attr("dy"))});

                    //dragTarget.attr("transform", function(d){d.x += posX; d.y+= posY; d.currentX += posX; d.currentY += posY;});

                    //g.drawLinks();
                    var links = g.svg.selectAll("g.link")
                            .data(g.cGraph.links(),function(d){return d.baseID})
                            .select("path.link")
                            .attr("d", function(d) { return "M"+d.source.x+" "+d.source.y +" L"+d.target.x+" "+d.target.y; })
                            .style("stroke", "gray")
                            .style("stroke-width", function(d) { return 1;})
                                        
            
                };

                function showHideLabel(){
                    //var e = window.event;
                    //if (!e.ctrlKey && !e.metaKey) return; 
                    this.parentNode.appendChild(this);
                    var dragTarget = d3.select(this);
                    var labelTarget = dragTarget.select("text.node");
                    var nodeTarget = dragTarget.select("circle.node");
                    var hidden = labelTarget.attr("visibility") == 'hidden';

                    labelTarget.attr("visibility", function(d)
                            {
                                if (!hidden && !d.mouseOver || d.labelVisibility)
                                {
                                    d.labelVisibility = false; 
                                    nodeTarget.style("stroke", "white");
                                    return "hidden";
                                }else {
                                    d.labelVisibility = true; 
                                    nodeTarget.style("stroke", "lightpink");
                                    return "visible"; 
                                }
                            });
                };

               
                var node = g.svg.selectAll("g.node")
                        .data(g.cGraph.nodes(),function(d){return d.baseID}).enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) { d.currentX = d.x; d.currentY = d.y; return })
                        .call(d3.behavior.drag().on("drag", move))
                        .on("click", showHideLabel);

                        /*.on("click", function(d){
                                var o = d3.select(this); 
                                if (o.classed("selected"))
                                {
                                        d.selected = true
                                        o.classed("selected", false)
                                        o.select("circle").style("fill","steelblue");
                                }else{
                                        d.selected = false
                                        o.classed("selected", true)
                                        o.select("circle").style("fill","red");
                                }
                        })                        
                       .on("mouseover", function(){d3.select(this).select("circle").style("fill","yellow"); })
                       .on("mouseout",function(){
                                var o = d3.select(this); 
                                if (o.classed("selected")) 
                                {
                                        o.select("circle").style("fill","red");
                                }else{
                                        o.select("circle").style("fill","steelblue");
                                }
                       });*/

                
                node.append("circle").attr("class", "node").classed("circle", 1)
                        .attr("cx", function(d){d.currentX = d.x; return d.currentX})
                        .attr("cy", function(d){d.currentY = d.y; return d.currentY})
                        .attr("r", 5)
                        .style("fill", "steelblue")
                        
                        

                //textNode = node.append("g").attr("class", "node")
                //        .classed("textGroup", 1)
                        
                node.append("text").attr("class", "node").classed("text", 1)
                        .attr("dx", function(d){d.currentX = d.x; return d.currentX})
                        .attr("dy", function(d){d.currentY = d.y; return d.currentY})
                        .style("stroke", "black")
                        .style("stroke-width", 0.5)
                        .style("font-family", "Arial")
                        .style("font-size", 12)
                        .text(function(d) { return d.label; });                
        }


        // this function draws the links using d3
        // we associate to each graph link an svg:g (indexed by baseID)
        // each svg:g sets the interaction for the links (click, mouseover, mouseout)
        // to each group are added an svg:path (placed according to the related nodes property x and y)
        g.drawLinks = function()
        {
                var links = g.svg.selectAll("g.link");
                var transform = null;
 
                if (!links.empty())
                {
                     console.log("link transforms: ", links.attr("transform"));
                     transform = links.attr("transform");
                }
                g.svg.selectAll("g.link").data([]).exit().remove();
                console.log("the current trasformation", transform);                
 
                var link = g.svg.selectAll("g.link")
                        .data(g.cGraph.links(),function(d){return d.baseID}).enter().append("g")
                        .attr("class", "link")
                        //.attr("transform", function(d) { return "translate(" + d.source.x + "," + d.source.y + ")"; })
                        /*.on("click", function(){
                                var o = d3.select(this); 
                                if (o.classed("selected"))
                                {
                                        o.classed("selected",true)
                                        o.select("path").style("stroke","gray");
                                }else{
                                        o.classed("selected",false)
                                        o.select("path").style("stroke","red");
                                }
                        })                        
                       .on("mouseover", function(){d3.select(this).select("path").style("stroke","yellow"); })
                       .on("mouseout",function(){
                                var o = d3.select(this); 
                                if (o.classed("selected")) 
                                {
                                        o.select("path").style("stroke","red");
                                }else{
                                        o.select("path").style("stroke","gray");
                                }
                        });*/
                        
                console.log("Before the problem occures: ", g.cGraph.links());

                link.append("path").attr("class", "link").classed("path", 1)
                        //.attr("d", function(d) { return "M"+0+" "+0 +" L"+(d.target.x - d.source.x)+" "+(d.target.y - d.source.y); })
                        .attr("d", function(d) { return "M"+d.source.x+" "+d.source.y +" L"+d.target.x+" "+d.target.y; })
                        .style("stroke", "gray")
                        .style("stroke-width", function(d) { return 1;}) //Math.sqrt(d.value); })
                link.attr("transform", transform);

        }


        // this function moves the nodes and links
        // _graph, the new graph placement
        // dTime, the delay in ms to apply the movement
        // we select each svg:g and its node from their identifier (baseID), and associate 
        // the new x and y values (d3 does the transition) 
        g.move = function(_graph, dTime)
        {       
                g.cGraph = _graph

                var node = g.svg.selectAll("g.node")
                        .data(g.cGraph.nodes(),function(d){d.currentX = d.x; d.currentY = d.y; return d.baseID;})
                        .transition().delay(dTime)
                        node.select("circle")
                                .attr("cx", function(d){d.currentX = d.x; d.currentY = d.y; return d.x})
                                .attr("cy", function(d){return d.y})
                        node.select("text")//.transition().delay(dTime)
                                .attr("dx", function(d){return d.x})
                                .attr("dy", function(d){return d.y})
                        //.attr("transform", function(d) { /*console.log(d);*/ return "translate(" + d.x + "," + d.y + ")"; })

                var link = g.svg.selectAll("g.link")
                        .data(g.cGraph.links(),function(d){return d.baseID})
                        .transition().delay(dTime)
                        //.attr("transform", function(d) { /*console.log(d);*/ return "translate(" + d.source.x + "," + d.source.y + ")"; })
                        .select("path")
                                //.attr("d", function(d) { return "M"+0+" "+0 +" L"+(d.target.x - d.source.x)+" "+(d.target.y - d.source.y); })
                                .attr("d", function(d) { return "M"+d.source.x+" "+d.source.y +" L"+d.target.x+" "+d.target.y; })
        }


        // this function resizes the nodes
        // _graph, the new graph with size
        // dTime, the delay in ms to resize
        // we select each svg:g and its node from their identifier (baseID), and associate 
        // the node's 'viewMetric' property to the svg:circle's 'r' attribute
        g.resize = function(_graph, dTime)
        {
                g.cGraph = _graph

                var node = g.svg.selectAll("g.node")
                        .data(g.cGraph.nodes(),function(d){return d.baseID})
                        .transition().delay(dTime)
                node.select("circle.node")
                        .attr("r", function(d){return d.viewMetric*2})
                        //.attr("transform", function(d) { console.log(d); return "scale(" + d.viewMetric + "," + d.viewMetric + ")"; })

                var link = g.svg.selectAll("g.link")
                        .data(g.cGraph.links(),function(d){return d.baseID})
                        .transition().delay(dTime)
                link.select("path.link")
                        .style("stroke-width", function(d) { return 1;})
                        
                        

        }

        // this function puts forward a selection of nodes
        // _graph, the new graph selection
        // dTime, the delay in ms to apply the selection
        // we initialized all the nodes and then select all the nodes passed in 
        // the given graph and change their aspect (size and color)
        //
        // this function name doesn't seem appropriate
        // we assign to the nodes the new data, and reassign the original data
        // we might want to apply persistant colors and sizes stored in the data
        g.show = function(_graph, dTime)
        {
                //g.cGraph = _graph

                // redraw the previous nodes to the default values
                var node = g.svg.selectAll("g.node")
                        .select("circle.node")
                            .style('fill', 'steelblue')
                            .attr('r', 5)
                var node = g.svg.selectAll("g.node")
                        .select("text.node")
                            .attr("visibility", "hidden")

                var link = g.svg.selectAll("g.link")
                        .select("path.link")
                        .style("stroke", "gray")
                        .style("stroke-width", function(d) { return 1;})

                // assign the new data
                var node = g.svg.selectAll("g.node")
                        //.data(g.cGraph.nodes(),function(d){return d.baseID})
                        .data(_graph.nodes(),function(d){return d.baseID})
                        .transition().delay(500)

                var link = g.svg.selectAll("g.link")
                        //.data(g.cGraph.nodes(),function(d){return d.baseID})
                        .data(_graph.links(),function(d){return d.baseID})
                        .transition().delay(500)

                // update the nodes
                node.select("circle.node")
                        .attr("r", function(d){return 10})
                node.select("text.node")
                        .attr("visibility", "visible")

                link.select("path.link")
                        .style("stroke-width", function(d) { return 2;})

                //var node2 = g.svg.selectAll("g.node")
                //        .data(_graph.nodes(),function(d){return d.baseID})
                //        .transition().delay(1000)

                node.select("circle.node")
                        .style("fill", "pink")
                        //.attr("transform", function(d) { console.log(d); return "scale(" + d.viewMetric + "," + d.viewMetric + ")"; })

                link.select("path.link")
                        .style("stroke", "pink")

                // reassign the original data
                g.svg.selectAll("g.node")
                        .data(g.cGraph.nodes(),function(d){return d.baseID})                        

                g.svg.selectAll("g.link")
                        .data(g.cGraph.links(),function(d){return d.baseID})                        


        }


        // this function removes the nodes and links removed from the old data
        // _graph, the new graph
        // dTime, the delay in ms to apply the modification  
        // we only use d3's data association then 'exit()' and 'remove()'
        g.exit = function(_graph, dTime)
        {
                g.cGraph = _graph
                nodeIds = []
                linkIds = []
                _graph.nodes().forEach(function (d){nodeIds.push(d.baseID)})
                _graph.links().forEach(function (d){linkIds.push(d.baseID)})
                console.log(nodeIds)
                var node = g.svg.selectAll("g.node").data(_graph.nodes(),function(d){return d.baseID})
                node.exit().remove()

                var link = g.svg.selectAll("g.link").data(_graph.links(),function(d){return d.baseID})
                link.exit().remove()
        }

        // this function clears the graphs, removes all the nodes and links (similarly to previously)
        g.clear = function()
        {
                var node = g.svg.selectAll("g.node").data([])
                node.exit().remove()

                var link = g.svg.selectAll("g.link").data([])
                link.exit().remove()
        }

        return g
}
