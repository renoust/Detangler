var TulipPosyVisualisation = function()
{
    var __g__ = this;


        var showhideLinks = function(target)
        {

                if (!target)
                        return

                var svg = null

                if (target == "catalyst")
                {
                        svg = svg_catalyst
                }
        
                if (target == "substrate")
                {
                        svg = svg_substrate
                }

                eval("show_links_"+target+" = ! show_links_"+target);

                if(eval("show_links_"+target))
                {
                    svg.selectAll('g.link').attr("visibility","visible");
                    svg.select('text.showHideLinks').text('hide links');
                }else{
                    svg.selectAll('g.link').attr("visibility","hidden");
                    svg.select('text.showhideLinks').text('show links');
                }
        }

        // This function updates the entanglement values displayed in the entanglement frame of the substrate view
        // The entanglement intensity drives the color of the frame following a Brewer's scale (www.colorbrewer2.org).
        var entanglementCaught = function()
        {
                var brewerSeq = ['#FEEDDE', '#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603']
                svg_substrate.selectAll("text.homogeneity").text(function(d){return ""+round(entanglement_homogeneity,5)});
                svg_substrate.selectAll("text.intensity").text(function(d){return ""+round(entanglement_intensity,5)});
                var index = Math.round(entanglement_intensity*5)%6
                svg_substrate.selectAll("rect.entanglementframe").transition().style('fill-opacity', .5)
                        .style("fill", brewerSeq[index])
                if(lasso_catalyst) lasso_catalyst.fillColor = brewerSeq[index]
                if(lasso_substrate) lasso_substrate.fillColor = brewerSeq[index]
        }

        var buildEdgeMatrices = function()
        {
            var matrixData = [];
            nbNodes = graph_catalyst.nodes().length;
            for(i=0; i<nbNodes; i++)
            {
                matrixData[i] = [];
                for(j=0; j<nbNodes; j++)
                    matrixData[i][j] = [-1, 0.0];
            }

            var catalystToInd = {};
            graph_catalyst.nodes().forEach(function(d,i){catalystToInd[d.label] = i; matrixData[i][i] = [d.baseID, d.frequency];});
            graph_catalyst.links().forEach(function(d){
                var freq = JSON.parse(d.conditionalFrequency);
                i = catalystToInd[freq['order'][0]]
                j = catalystToInd[freq['order'][1]]
                matrixData[i][j] = [d.baseID, freq['values'][0]]
                matrixData[j][i] = [d.baseID, freq['values'][1]]                 
            })
            

                
                var overallSize = 200.0;
                var indSize = overallSize/nbNodes;
                overallSize = indSize*nbNodes+1;
                        
            

                function move(){
                    //var e = window.event;
                    //if (e.ctrlKey || e.metaKey) return;
                    this.parentNode.appendChild(this);
                    var dragTarget = d3.select(this);
                    var currentPanel = dragTarget
                    //console.log("currentPanel:",);
                    //console.log("currentPanel:",currentPanel[0].transform);
                    panelPos = currentPanel.attr("transform").replace("translate(","").replace(")","").split(',');
                    var posX = d3.event.dx
                    var posY = d3.event.dy
                    var newX = parseInt(panelPos[0]) + posX
                    var newY = parseInt(panelPos[1]) + posY

                    //if(currentPanel.attr("x")

                    /*
                    if (currentPanel.panelPosX || currentPanel.panelPosY)
                    {
                        newX = currentPanel.panelPosX + posX
                        newY = currentPanel.panelPosY + posY
                    }else{
                        newX = currentPanel.x + posX
                        newY = currentPanel.y + posY                        
                    }*/

                    dragTarget.attr("transform", function(d){d.panelPosX = newX; d.panelPosY = newY; return "translate(" + newX + "," + newY + ")"});            
                };



                var mat = svg_catalyst.selectAll("g.matrixInfo").data(["matrix"]).enter().append("g")
                        .classed("matrixInfo", true)
                        .attr("transform", function(d){ return "translate(" + 500 + "," + 10 + ")";})
                        .call(d3.behavior.drag().on("drag", move))

                mat.append("rect")
                    .classed("matrixInfo", true)
                    .attr("width", overallSize+20)
                    .attr("height", overallSize+30)
                    //.attr("x", function (d){return d.x;})
                    //.attr("y", function (d){return d.y;})
                    .style("fill", defaultFillColor)
                    .style("stroke-width", defaultBorderWidth)
                    .style("stroke", defaultBorderColor)


                mat.append("text")
                    .classed("matrixInfo", true)
                    .text("X")
                    .attr("dx", 208 )
                    .attr("dy", 18)
                    .style("fill", "lightgray")
                    .style("font-family", "EntypoRegular")
                    .style("font-size", 30)
                    .on("click", function(d) {svg_catalyst.selectAll("g.matrixInfo").data([]).exit().remove(); gD = graphDrawing(graph_catalyst, svg_catalyst).draw()})
                    .on("mouseover", function(){d3.select(this).style("fill", "black")})
                    .on("mouseout", function(){d3.select(this).style("fill", "lightgray")})

                

            var brewerSeq = ['#FEEDDE', '#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603'];
            var index = function(x){return Math.round(x*5)%6;};
            matrixData.forEach(function(d1, i){ 
                d1.forEach(function(d2, j){
                    piece = mat.append("rect")
                    piece.data(d2).enter()

                      piece.attr("class", "matrixUnit")
                        //.classed("interfaceButton", 1)
                        .classed("matrixInfo", true)
                        .attr("x", i*indSize+10)
                        .attr("y", j*indSize+18)
                        .attr("width", indSize)
                        .attr("height", indSize)
                        .style("fill", function(){ if(d2[0] == -1){return "lightgray";}else{return brewerSeq[index(d2[1])];}})
                        .style("fill-opacity", 1)
                        .style("stroke","black")
                        .style("stroke-width", 0)
                        .on("mouseover", function(){if(d2[0]!=-1){d3.select(this).style("stroke-width", 1);}; highlight(d2[0], i, j);})
                        .on("mouseout", function(){d3.select(this).style("stroke-width", 0);})//style("fill", function(){ if(d2[0] == -1){return "lightgray";}else{return brewerSeq[index(d2[1])];}}])
                                                                    
                })
            })
        }
    


        var resetView = function(target)
        {
                var cGraph = null
                var svg = null

                if (target == 'substrate')
                {        
                        cGraph = graph_substrate
                        svg = svg_substrate
                }

                if (target == 'catalyst')
                {        
                        cGraph = graph_catalyst
                        svg = svg_catalyst
                }

                nodeDatum = svg.selectAll("g.node").data()
                // strangely the matrix that should be applied by transform is squared?! so we adapt the nodes values
                nodeDatum.forEach(function(d){d.currentX = d.x;
                                              d.currentY = d.y;});
                
                svg.selectAll(".node,.link").attr("transform","translate(" + 0 + "," +  0 + ") scale(" +  1 + ")")
                svg.selectAll("text.node").style("font-size", function(){ return 12;});
                addInterfaceSubstrate();
                addInterfaceCatalyst();
                entanglementCaught();
        }

        var resetSize = function(target)
        {
                var cGraph = null
                var svg = null

                if (target == 'substrate')
                {        
                        cGraph = graph_substrate
                        svg = svg_substrate
                }

                if (target == 'catalyst')
                {        
                        cGraph = graph_catalyst
                        svg = svg_catalyst
                }
                
                cGraph.nodes().forEach(function(d){d.viewMetric = 3;})
                graph_drawing = graphDrawing(cGraph, svg)
                graph_drawing.resize(cGraph, 0)
        }

       // 
        var showhideLabels = function(target)
        {

                if (!target)
                        return

                var svg = null

                if (target == "catalyst")
                {
                        svg = svg_catalyst
                }
        
                if (target == "substrate")
                {
                        svg = svg_substrate
                }

                eval("show_labels_"+target+" = ! show_labels_"+target); 

                if(eval("show_labels_"+target))
                {
                    //svg.selectAll('text.node').text(function(d) { return d.label; });
                    svg.selectAll('text.node').attr("visibility", function(d) { return "visible";});
                    svg.select('text.showHideLabels').text('hide labels');
                    svg.selectAll('g.node').on("mouseover", function(d){d.mouseOver = false; return null;})
                                           .on("mouseout", null);
                }else{
                    //svg.selectAll('text.node').text(function(d) {if (d.selected){return d.label;} else {return "";}});
                    svg.selectAll('text.node').attr("visibility", function(d) {if (d.selected || d.labelVisibility){d.labelVisibility = true; return "visible";} else {d.labelVisibility = false; return "hidden";}});
                    svg.select('text.showhideLabels').text('show labels');
                    //svg.selectAll('g.node').on("mouseover", function(d){d3.select(this).select("text.node").text(d.label);})
                    //                       .on("mouseout", function(d){d3.select(this).select("text.node").text("")});
                    svg.selectAll('g.node').on("mouseover", function(d){d.mouseOver = true; d3.select(this).select("text.node").attr("visibility", "visible");})
                                           .on("mouseout", function(d){if (!d.labelVisibility) { d.mouseOver = false; d3.select(this).select("text.node").attr("visibility", "hidden");}});
                }
        }


        // This function rescales the graph data in order to fit the svg window
        // data, the graph data (modified during the function)
        var rescaleGraph = function(data)
        {

                console.log("should be rescaling graphe, here is the data: ", data);

                // these should be set as globale variables
                var buttonWidth = 130.0
                var frame = 10.0
                var w = width-(buttonWidth+2*frame)
                var h = height-(2*frame)
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

       var sizeMapping = function(parameter, graphName)
        {

                var cGraph = null;
                var svg = null;

                if (graphName == 'substrate')
                {        
                        cGraph = graph_substrate;
                        svg = svg_substrate;
                }

                if (graphName == 'catalyst')
                {        
                        cGraph = graph_catalyst;
                        svg = svg_catalyst;
                }
        
                var graph_drawing = graphDrawing(cGraph, svg);
                graph_drawing.nodeSizeMap(cGraph, 0, parameter);

                addInterfaceSubstrate();
                addInterfaceCatalyst();
                entanglementCaught();

        };


        var colorMapping = function(parameter, graphName)
        {

                var cGraph = null;
                var svg = null;

                if (graphName == 'substrate')
                {        
                        cGraph = graph_substrate;
                        svg = svg_substrate;
                }

                if (graphName == 'catalyst')
                {        
                        cGraph = graph_catalyst;
                        svg = svg_catalyst;
                }
        
                var graph_drawing = graphDrawing(cGraph, svg);
                graph_drawing.nodeColorMap(cGraph, 0, parameter);

                addInterfaceSubstrate();
                addInterfaceCatalyst();
                entanglementCaught();

        };


        


    return __g__;

}
