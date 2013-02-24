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
                if (g.cGraph.links().length < 1000)
                {
                    g.drawLinks()
                }
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
                    var circleTarget = dragTarget.select("circle.node");
                    var rectTarget = dragTarget.select("rect.node");
                    //var labelTarget = dragTarget.select("text.node");
                    var currentNode = dragTarget.data()[0]
                    var posX = d3.event.dx
                    var posY = d3.event.dy
                    var labelTarget = dragTarget.select("text.node"+currentNode.baseID);
                    
                    currentNode.x += posX
                    currentNode.y += posY
                    currentNode.currentX += posX
                    currentNode.currentY += posY
                    

                    //dragTarget.data([currentNode])
                
                    var currentBaseID = currentNode.baseID
                    
                    if(circleTarget)
                    {
                        circleTarget
                            .attr("cx", function(){return d3.event.dx + parseInt(circleTarget.attr("cx"))})
                            .attr("cy", function(){return d3.event.dy + parseInt(circleTarget.attr("cy"))});
                    }

                    if (rectTarget)
                    {
                        rectTarget
                            .attr("x", function(){return d3.event.dx + parseInt(rectTarget.attr("x"))})
                            .attr("y", function(){return d3.event.dy + parseInt(rectTarget.attr("y"))});
                    }
    
                    labelTarget
                        .attr("dx", function(){return d3.event.dx + parseInt(labelTarget.attr("dx"))})
                        .attr("dy", function(){return d3.event.dy + parseInt(labelTarget.attr("dy"))});

                    //dragTarget.attr("transform", function(d){d.x += posX; d.y+= posY; d.currentX += posX; d.currentY += posY;});

                    //g.drawLinks();
                    console.log("current svg:", g.svg, g.cGraph.links());
                    var links = g.svg.selectAll("g.link")
                            .data(g.cGraph.links(),function(d){return d.baseID})
                            .select("path.link")
                            .attr("d", function(d) {console.log("updating the graph");return "M"+d.source.x+" "+d.source.y +" L"+d.target.x+" "+d.target.y; })
                            //.attr("d", function(d) {return "M"+0+" "+0 +" L"+0+" "+0; })
                            //.style("stroke", "gray")
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
                        .attr("class", function(d){console.log(d._type); return d._type})
                        .classed("node", true)
                        .attr("transform", function(d) { d.currentX = d.x; d.currentY = d.y; return })
                        .call(d3.behavior.drag().on("drag", move))
                        .on("click", showHideLabel)
                        .append("g")
                                .attr("class", function(d){return d._type})
                                .classed("glyph", true)
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

                            

                var glyphR = g.svg.selectAll("g.glyph.substrate")//.data(g.cGraph.nodes().filter(function(d){return d._type == "substrate"})).enter()
                            .append("rect")
                            .attr("class", function(d){return d._type})
                            .classed("node", true).classed("rect", true)
                            .style("fill", "sienna")
                            .attr("x", function(d){d.currentX = d.x; return d.currentX})
                            .attr("y", function(d){d.currentY = d.y; return d.currentY})
                            .attr("width", 2*5)
                            .attr("height", 2*5)
                            
                 var glyphC = g.svg.selectAll("g.glyph.catalyst")//.data(g.cGraph.nodes().filter(function(d){return d._type == "catalyst"})).enter()
                            .append("circle")
                            .attr("class", function(d){return d._type})
                            .classed("node", true).classed("circle", true)
                            .style("fill", "steelblue")
                            .attr("cx", function(d){d.currentX = d.x; return d.currentX})
                            .attr("cy", function(d){d.currentY = d.y; return d.currentY})
                            .attr("r", 5)
                        

                //textNode = node.append("g").attr("class", "node")
                //        .classed("textGroup", 1)
                        
                var node = g.svg.selectAll("g.node")
                node.append("text")
                        .attr("class", function(d){return "node"+d.baseID+" "+d._type})
                        .classed("node", true).classed("text", true)
                        .attr("dx", function(d){d.currentX = d.x; return d.currentX})
                        .attr("dy", function(d){d.currentY = d.y; return d.currentY})
                        .style("stroke", "black")
                        .style("stroke-width", 0.5)
                        .style("font-family", "Arial")
                        .style("font-size", 12)
                        .text(function(d) { return d.label; });                
        }

        g.delLinks = function()
        {
            var links = g.svg.selectAll("g.link").data([]).exit().remove();
        }

        g.delLabels = function()
        {
            var selection = g.svg.selectAll("text.node").data([]).exit().remove();
        }
        
        g.addLabels = function()
        {
            var selection = g.svg.selectAll("text.node")
            //var selection = g.svg.selectAll("g.node")            
            selection.data(g.cGraph.nodes()).enter()
            //selection
                    .append("text")
                    .attr("class", function(d){return "node"+d.baseID+" "+d._type})
                    .classed("node", true).classed("text", true)
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
                        .attr("class", function(d){return d._type})
                        .classed("link", true)
                        
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
                        
                //console.log("Before the problem occures: ", g.cGraph.links());

                link.append("path")
                        .attr("class", function(d){return d._type})
                        .classed("link", true).classed("path", 1)
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
                        node.select("rect")
                                .attr("x", function(d){d.currentX = d.x; d.currentY = d.y; return d.x})
                                .attr("y", function(d){return d.y});

                var node = g.svg.selectAll("g.node")                                
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
                //For backward compatibility only
                g.nodeSizeMap(_graph, dTime, "viewMetric")
                /*
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
                */        
                        

        }


        g.nodeSizeMap = function(_graph, dTime, parameter)
        {
                // TODO: USE D3 ARRAY OPERATIONS!
                // TODO: USE D3 SCALES!

                g.cGraph = _graph

                //we would like it better as a parameter
                var scaleMin = 3.0
                var scaleMax = 12.0

                var valMin = null
                var valMax = null

                g.cGraph.nodes().forEach(
                    function(n)
                    {
                        val = eval("n."+parameter);
                        if(valMin == null | val < valMin)
                            valMin = val;

                        if(valMax == null | val > valMax)
                            valMax = val;
                    });
            
                //linear
                var factor = scaleMin
                var equalScales = false
                if (valMax == valMin || valMax-valMin < 0.0001)
                {
                    equalScales = true
                    scaleMin = 7
                    factor = factor/valMin
                }
                else
                {
                    factor =  (scaleMax-scaleMin) / (valMax-valMin)
                }    

                var node = g.svg.selectAll("g.node")
                        .data(g.cGraph.nodes(),function(d){return d.baseID})
                        .transition().delay(dTime)
                node.select("circle.node")
                        .attr("r", function(d){r = eval("d."+parameter+"*factor+scaleMin"); if(!r || equalScales){r = scaleMin;} return r;})
                        //.attr("transform", function(d) { console.log(d); return "scale(" + d.viewMetric + "," + d.viewMetric + ")"; })
                node.select("rect.node")
                        .attr("width", function(d){ r = eval("d."+parameter+"*factor+scaleMin"); if(!r || equalScales){r = scaleMin;} return 2*r;})
                        .attr("height", function(d){r = eval("d."+parameter+"*factor+scaleMin"); if(!r || equalScales){r = scaleMin;} return 2*r;})

                var link = g.svg.selectAll("g.link")
                        .data(g.cGraph.links(),function(d){return d.baseID})
                        .transition().delay(dTime)
                link.select("path.link")
                        .style("stroke-width", function(d) { return 1;})
                        
                        

        }


        g.nodeColorMap = function(_graph, dTime, parameter)
        {
                g.cGraph = _graph

                //we would like it better as a parameter
                scaleMin = 3.0
                scaleMax = 12.0

                valMin = null
                valMax = null

                g.cGraph.nodes().forEach(
                    function(n)
                    {
                        val = eval("n."+parameter);
                        if(valMin == null | val < valMin)
                            valMin = val;

                        if(valMax == null | val > valMax)
                            valMax = val;
                    });


                var color = d3.scale.quantize()
                    .domain([valMin, valMax])
                    .range(colorbrewer.GnBu[9]);
                                

                var node = g.svg.selectAll("g.node")
                        .data(g.cGraph.nodes(),function(d){return d.baseID})
                        .transition().delay(dTime)

                node.select("g.glyph").select(".node")
                        .style("fill", function(d){c = color(eval("d."+parameter)); return d3.rgb(c);})
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
                        .style("opacity", .5)
                        .select("g.glyph").select("circle.node")
                            .style('fill', 'steelblue')
                            .attr('r', 5)
                            .style("stroke-width", 0)
                            .style("stroke", "black")

                var node = g.svg.selectAll("g.node")
                        .select("g.glyph").select("rect.node")
                            .style('fill', 'sienna')
                            .attr('width', 2*5)
                            .attr('height', 2*5)
                            .style("stroke-width", 0)
                            .style("stroke", "black")

                var node = g.svg.selectAll("g.node")
                        .select("text.node")
                            .attr("visibility", "hidden")

                var link = g.svg.selectAll("g.link")
                        .style("opacity", .25)
                        .select("path.link")
                        .style("stroke", "gray")
                        .style("stroke-width", function(d) { return 1;})

               //we would like it better as a parameter
               var scaleMin = 3.0
               var scaleMax = 12.0
               var parameter = "entanglementIndice"

               var valMin = null
               var valMax = null

                _graph.nodes().forEach(
                    function(n)
                    {
                        val = eval("n."+parameter);
                        if(valMin == null | val < valMin)
                            valMin = val;

                        if(valMax == null | val > valMax)
                            valMax = val;
                    });
            
                //linear
                
                var factor = scaleMin
                var equalScales = false
                if (valMax == valMin || valMax-valMin < 0.0001)
                {
                    equalScales = true
                    scaleMin = 7
                }
                else
                {
                    factor =  (scaleMax-scaleMin) / (valMax-valMin)
                }    


                // assign the new data
                var node = g.svg.selectAll("g.node")
                        //.data(g.cGraph.nodes(),function(d){return d.baseID})
                        .data(_graph.nodes(),function(d){return d.baseID})
                        .transition().delay(500)
                        .style("opacity", 1)

                var link = g.svg.selectAll("g.link")
                        //.data(g.cGraph.nodes(),function(d){return d.baseID})
                        .data(_graph.links(),function(d){return d.baseID})
                        .transition().delay(500)
                        .style("opacity", 1)

           

                // update the nodes
                //node.select("circle.node")
                //        .attr("r", function(d){r = eval("d."+parameter+"*factor+scaleMin"); if(!r){r = scaleMin;} return r;})
                        
                node.select("circle.node")
                        .attr("r", function(d){r = eval("d."+parameter+"*factor+scaleMin"); if(!r || equalScales){r = scaleMin;} return r;})
                        .style("stroke-width", function(d) { return 2;})
                        .style("stroke", "brown")
                        //.attr("transform", function(d) { console.log(d); return "scale(" + d.viewMetric + "," + d.viewMetric + ")"; })
                node.select("rect.node")
                        .attr("width", function(d){ r = eval("d."+parameter+"*factor+scaleMin"); if(!r || equalScales){r = scaleMin;} return 2*r;})
                        .attr("height", function(d){r = eval("d."+parameter+"*factor+scaleMin"); if(!r || equalScales){r = scaleMin;} return 2*r;})
                        .style("stroke-width", function(d) { return 2;})
                        .style("stroke", "brown")
                        

                node.select("text.node")
                        .attr("visibility", "visible")

                link.select("path.link")
                        .style("stroke-width", function(d) { return 2;})
                        .style("stroke", "brown")

                //var node2 = g.svg.selectAll("g.node")
                //        .data(_graph.nodes(),function(d){return d.baseID})
                //        .transition().delay(1000)

                //node.select("g.glyph")
                //        .style("fill", "pink")
                        //.attr("transform", function(d) { console.log(d); return "scale(" + d.viewMetric + "," + d.viewMetric + ")"; })

                //link.select("path.link")
                //        .style("stroke", "pink")

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


        g.arrangeLabels = function()
        {


            var intersect = function(rectDiag, point)
            {
                if (rectDiag[0][0] <= point[0] && rectDiag[1][0] >= point[0] 
                    && rectDiag[0][1] <= point[1] && rectDiag[1][1] >= point[1])
                    return true;
               return false;
            }


            var labels = g.svg.selectAll("text.node")
                .attr("visibility", "visible");
            //console.log("labels:", labels[0]);
            var labelsArray = []
            var iterArray = []
            //var bboxArray = []
            //console.log(svg); 
            //console.log(svg.contentDocument);
            labels[0].forEach(function(d){labelsArray.push(d3.select(d)); iterArray.push(d.getBBox());});
            
            var margin = 1;
            
            var iterate = function()
            {
                var anyChange = false, noChange = false;
                //We should reduce the complexity of this alg!!
                for (var iLabel = 0; iLabel < iterArray.length-1; iLabel++)
                {
                    //var d = iterArray[iLabel];
                    //var bbox = d.getBBox();
                    var bbox = iterArray[iLabel];

                     if(labelsArray[iLabel].attr("visibility") == "visible")
                     {


                        
                        var polygon = [[bbox.x-margin, bbox.y-margin],
                                       [bbox.x + bbox.width+margin, bbox.y-margin],
                                       [bbox.x-margin, bbox.y + bbox.height+margin],
                                       [bbox.x + bbox.width+margin, bbox.y + bbox.height+margin],
                                     ];

                        noChange = false;
                        for (var iLabel2 = iLabel+1; iLabel2 < iterArray.length; iLabel2++)
                        {
                            //var d2 = iterArray[iLabel2];
                            if(labelsArray[iLabel2].attr("visibility") == "visible")// && d != d2)
                            {
                                //var bbox2 = d2.getBBox();
                                var bbox2 = iterArray[iLabel2];
                                var polygon2 = [[bbox2.x-margin, bbox2.y-margin],
                                               [bbox2.x + bbox2.width+margin, bbox2.y-margin],
                                               [bbox2.x-margin, bbox2.y + bbox2.height+margin],
                                               [bbox2.x + bbox2.width+margin, bbox2.y + bbox2.height+margin],
                                             ];
                                for(var iPoint = 0; iPoint<polygon2.length && !noChange; iPoint++)
                                {
                                    if(intersect([polygon[0], polygon[3]], polygon2[iPoint]))
                                    {
                                        labelsArray[iLabel2].attr("visibility", "hidden");
                                        noChange = true;
                                        anyChange = true;
                                        break;
                                    }
                                }
                                for(var iPoint = 0; iPoint<polygon2.length && !noChange; iPoint++)
                                {
                                    if(intersect([polygon2[0], polygon2[3]], polygon[iPoint]))
                                    {
                                        labelsArray[iLabel2].attr("visibility", "hidden");
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
            while(iterate()){count++};
            console.log("iterated: ",count);
    
        }

        g.removeNodeOverlap = function()
        {
            //fast overlap removal in javascript...
        }

        g.bringLabelsForward = function()
        {
            g.delLabels();
            g.addLabels();
            //g.svg.selectAll("text.node")
            // .text(function(d){return d.label.slice(0,10)+"...";});
        }

        return g
}
