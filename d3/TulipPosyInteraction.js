(function(){
var TulipPosyInteraction = function(contexte, objectcontext)
{
    var __g__ = this;

	var contxt = contexte;
	var objectContext = objectcontext;

       // This function creates a lasso brush interactor for a specific target, it also redefined
        // the brush intersection function, and applies actions to the selected target.
        // target, the string value of the target svg view         
        this.createLasso = function(target)
        {
                if (!target)
                        return

                var svg = null
                var graph = null
                var myL = null

                if (target == "catalyst")
                {
                        svg = contxt.svg_catalyst
                        graph = contxt.graph_catalyst        
                        contxt.lasso_catalyst = new lasso(svg);
                        myL = contxt.lasso_catalyst                
                }
        
                if (target == "substrate")
                {
                        svg = contxt.svg_substrate
                        graph = contxt.graph_substrate
                        contxt.lasso_substrate = new lasso(svg);
                        myL = contxt.lasso_substrate
                }
                
                var prevSelList = [];

                myL.canMouseUp = function(e)
                {
                    if (!contxt.mouse_over_button)
                        this.mouseUp(e)
                }
            
                myL.canMouseMove = function(e)
                {
                    if (!contxt.mouse_over_button)
                        this.mouseMove(e)
                }
                
                myL.canMouseDown = function(e)
                {
                    if (!contxt.mouse_over_button)
                        this.mouseDown(e)
                }

                // redefines the intersection function
                // applies keyboard modifiers, control extends the selection, shift removes from the currect selection
                // once the selection is made, it applies the synchronization function syncGraph() to the selected nodes
                // selection colors are hardcoded but this should be changed
                myL.checkIntersect = function()
                {
                        var __g = this
                        var selList = []
                        var e=window.event
                        //console.log('control pushed ', e.ctrlKey)
                        //console.log("svg operating the selection", svg)
                        svg.selectAll("g.node").classed("selected", function(d){
                                        console.log('current obj', d)
                                        var x = 0;
                                        var y = 0;
                                        if (!('currentX' in d))
                                        {
                                                x = d.x;
                                                y = d.y;
                                        } else
                                        { 
                                                x = d.currentX;
                                                y = d.currentY;
                                        }
                                        var pointArray = [];
                                        if (__g.isLasso())
                                        {
                                                pointArray = __g.pointList;
                                        }else{
                                            if (__g.pointList.length>0)
                                            {
                                                var p0 = __g.pointList[0];
                                                var p1 = __g.pointList[__g.pointList.length-1];                        
                                                pointArray = [[p0[0], p0[1]],[p0[0], p1[1]], [p1[0], p1[1]], [p1[0], p0[1]]];
                                            }else{
                                                pointArray = []
                                            }
                                        }
                                        //console.log("before")
                                        

                                        if ((e.ctrlKey || e.metaKey) && d.selected == true)
                                                return true;

                                        var intersects = __g.intersect(pointArray, x, y)
                                        if (intersects) console.log("node intersects", d)
                                        //console.log('result of intersects? ',intersects,pointArray,x,y)

                                        if (e.shiftKey && intersects)
                                        {
                                                console.log("shift pressed and intersects so return false");
                                                d.selected = false;
                                        }
                                        else if (e.shiftKey && !intersects && d.selected == true)
                                        {
                                                console.log("shift pressed and doesnt intersects and true so return true");
                                                d.selected = true;
                                        }else
                                        {    
                                                //console.log ("d.selected = ",intersects);
                                                d.selected = intersects;
                                        }
                                        console.log("returning selection:",d.selected)
                                        return d.selected

                                })
                                .select("circle.node").style('fill', function(d){
                                        if (e.ctrlKey && d.selected == true)
                                        {
                                                selList.push(d.baseID)
                                                return 'red';
                                        }
                                        if (d.selected){
                                                selList.push(d.baseID)
                                                return 'red';
                                        }else
                                                return 'steelblue';
                                });

                        
                        selList.sort()
                        console.log("selection list: ",selList, " with length ", selList.length)
                        
                        if(selList.length>0)// && target == "substrate")
                        {        
                                if(selList.length == prevSelList.length)
                                {
                                        var i = 0;
                                        var iMax = selList.length;
                                        while(i<iMax && selList[i] == prevSelList[i])
                                                i++;
                                        if (i != iMax)
                                        {
                                                prevSelList.length = 0
                                                prevSelList = selList.slice(0);
                                                objectContext.TulipPosyClientObject.syncGraph(objectContext.TulipPosyClientObject.getSelection(target), target)
                                        }
                                }else{
                                        
                                                prevSelList.length = 0
                                                prevSelList = selList.slice(0);
                                                objectContext.TulipPosyClientObject.syncGraph(objectContext.TulipPosyClientObject.getSelection(target), target)
                                }
                        }
                        else
                        {   
                            svg.selectAll("g.node").select("circle.node").style('fill', 'steelblue');
                            svg.selectAll("g.link").select("path.link").style('stroke', 'gray');
                            if (target == "catalyst")
                                objectContext.TulipPosyVisualizationObject.resetSize("substrate");
                            if (target == "substrate")
                                objectContext.TulipPosyVisualizationObject.resetSize("catalyst");
                            prevSelList = selList.slice(0);
                            console.log("warning: the selection list is empty");
                            
                        }
                }        
                
        }

        // This function associate a d3.svg.brush element to select nodes in a view
        // target, the string value of the target svg view 
        // This function is unused and a bit deprecated but one can activate it anytime
        this.addBrush = function(target)
        {
                var svg = null
                var graph = null

                if (target == "catalyst")
                {
                        svg = contxt.svg_catalyst
                        graph = contxt.graph_catalyst                        
                }
        
                if (target == "substrate")
                {
                        svg = contxt.svg_substrate
                        graph = contxt.graph_substrate
                }
                        
                if (!target)
                        return

                var h = svg.attr("height")
                var w = svg.attr("width")
                var buttonWidth = 131
                
                var xScale = d3.scale.linear().range([buttonWidth, w])
                var yScale = d3.scale.linear().range([0,h])

                console.log("svg element: ",svg, w, h)
                

                var brush = svg.append("g")
                    .attr("class", "brush"+target)
                    .call(d3.svg.brush().x(xScale).y(yScale)
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

                // This function will check the nodes intersections and synchronize accordingly
                function brushmove() {
                          var e = d3.event.target.extent();
                          var node = svg.selectAll("g.node")
                          var selList = []
                          node.classed("selected", function(d) {
                                        //console.log('object d ',d);
                                        //console.log('pos (',e,') against (',d.x/w,',',d.y/h);
                                    wNorm = w - buttonWidth
                                    d.selected = e[0][0] <= (d.currentX-buttonWidth+1)/wNorm && (d.currentY-buttonWidth+1)/wNorm <= e[1][0]
                                        && e[0][1] <= d.currentY/h && d.currentY/h <= e[1][1];
                                    return d.selected;
                                  }).select("circle.node").style('fill', function(d){
                                        if (d.selected)
                                        { selList.push(d.baseID); return 'red';}
                                        return 'steelblue';
                          })

                        selList.sort()
                        if(selList.length>0)
                        {        
                                if(selList.length == prevSelList.length)
                                {
                                        var i = 0;
                                        var iMax = selList.length;
                                        while(i<iMax && selList[i] == prevSelList[i])
                                                i++;
                                        if (i != iMax)
                                        {
                                                prevSelList.length = 0
                                                prevSelList = selList.slice(0);
                                                objectContext.TulipPosyClientObject.syncGraph(objectContext.TulipPosyClientObject.getSelection(target), target)
                                        }
                                }else{
                                        
                                                prevSelList.length = 0
                                                prevSelList = selList.slice(0);
                                                objectContext.TulipPosyClientObject.syncGraph(objectContext.TulipPosyClientObject.getSelection(target), target)
                                }
                        }
                                
                        
                
                
                  //syncGraph(getSelection(target), target)
                //console.log(nbSelected, 'elements selected')
                }

                function brushend() {
                  svg.classed("selecting", !d3.event.target.empty());
                }



        }

        // Applies the lasso interactor to a specific svg target as callback to the mouse events.
        // target, the string value of the target svg view         
        this.addLasso = function(target)
        {
                if (!target)
                        return

                var mySvg = null
                var myL = null

                if (target == "catalyst")
                {
                        mySvg = contxt.svg_catalyst
                        myL = contxt.lasso_catalyst                
                }
        
                if (target == "substrate")
                {
                        mySvg = contxt.svg_substrate
                        myL = contxt.lasso_substrate
                }

                mySvg.on("mouseup", function(d){myL.canMouseUp(d3.mouse(this))});
                mySvg.on("mousedown", function(d){myL.canMouseDown(d3.mouse(this))});
                mySvg.on("mousemove", function(d){myL.canMouseMove(d3.mouse(this))});        
        }


        // Removes the lasso interactor from a specific svg target's callbacks to its mouse events.
        // target, the string value of the target svg view         
        this.removeLasso = function(target)
        {
                if (!target)
                        return

                var svg = null

                if (target == "catalyst")
                {
                        svg = contxt.svg_catalyst
                }
        
                if (target == "substrate")
                {
                        svg = contxt.svg_substrate
                }

                svg.on("mouseup", null);
                svg.on("mousedown", null);
                svg.on("mousemove", null);
        }


      // Adds a zoom interactor to a specific svg target as callbacks to its mouse events.
        // target, the string value of the target svg view         
        this.addZoom = function(target)
        {

                if (!target)
                        return

                var svg = null

                if (target == "catalyst")
                {
                        svg = contxt.svg_catalyst
                }
        
                if (target == "substrate")
                {
                        svg = contxt.svg_substrate
                }

                // Defines the zoom behavior and updates that data currentX and currentY values to match with intersections
                console.log("preparing to add zoom in view",target);
                svg.call (d3.behavior.zoom()
                            .translate ([0, 0])
                            .scale (1.0)
                            .scaleExtent([0.5, 2.0])
                            .on("zoom", function() {
                                
                                if (!eval("contxt.move_mode_"+target))
                                {
                                         return;
                                }

                                nodeDatum = svg.selectAll("g.node").data()
                                // strangely the matrix that should be applied by transform is squared?! so we adapt the nodes values
                                //nodeDatum.forEach(function(d){d.currentX = (d.x*Math.pow(d3.event.scale,2)+d3.event.translate[0]*(1+d3.event.scale));
                                //                              d.currentY = (d.y*Math.pow(d3.event.scale,2)+d3.event.translate[1]*(1+d3.event.scale));
                                //                                });

                                nodeDatum.forEach(function(d){d.currentX = (d.x*d3.event.scale+d3.event.translate[0]);
                                                              d.currentY = (d.y*d3.event.scale+d3.event.translate[1]);
                                                                });
                                

                                svg.selectAll("g.node,g.link").attr("transform","translate(" + d3.event.translate[0] + "," +  d3.event.translate[1] + ") scale(" +  d3.event.scale + ")")
                                svg.selectAll("text.node").style("font-size", function(){ return Math.ceil(12/d3.event.scale);});
                                objectContext.TulipPosyInterfaceObject.addInterfaceSubstrate();
                                objectContext.TulipPosyInterfaceObject.addInterfaceCatalyst();
                                objectContext.TulipPosyVisualizationObject.entanglementCaught();
        
                            })
                        );
        }



        // Removes the lasso interactor from a specific svg target's callbacks to its mouse events.
        // target, the string value of the target svg view         
        this.removeZoom = function(target)
        {
                if (!target)
                        return

                var svg = null

                if (target == "catalyst")
                {
                        svg = contxt.svg_catalyst
                }
        
                if (target == "substrate")
                {
                        svg = contxt.svg_substrate
                }
        svg.on("mousedown.zoom", null)
            .on("mousewheel.zoom", null)
            .on("mousemove.zoom", null)
            .on("DOMMouseScroll.zoom", null)
            .on("dblclick.zoom", null)
            .on("touchstart.zoom", null)
            .on("touchmove.zoom", null)
            .on("touchend.zoom", null)
            //.on("click",null);
               // svg.on("mouseup", null);
               // svg.on("mousedown", null);
               // svg.on("mousemove", null);
        }


        this.toggleCatalystSyncOperator = function()
        {
            if (contxt.catalyst_sync_operator == "OR")
            {
                contxt.catalyst_sync_operator = "AND";
            }else{
                contxt.catalyst_sync_operator = "OR"
            }
            contxt.svg_catalyst.selectAll("g.toggleCatalystOp")
                .select("text")
                .text("operator "+contxt.catalyst_sync_operator)

        }

        this.highlight = function (data, i, j)
        {
            contxt.svg_catalyst.selectAll("circle.node")
                //.style("fill", function(d){if(i == j && d.baseID == data){return "pink"}else{ return "steelblue";}})
                .style("opacity", function(d){if(i == j && d.baseID == data){return 1}else{ return .25;}})
                .style("stroke", function(d){if(i == j && d.baseID == data){return "red"}else{return "gray";}})
                .style("stroke-width", function(d){ if(i == j && d.baseID == data){return 5}else{return 0;}})
            contxt.svg_catalyst.selectAll("path.link")
                .style("stroke", function(d){if(i != j && d.baseID == data){return "red"}else{return "gray";}})
                .style("stroke-width", function(d){ if(i != j && d.baseID == data){return 5}else{return 1;}})
                .style("opacity", function(d){if(i != j && d.baseID == data){return 1 }else{ return .25;}})
        }



    return __g__;

}
    return {TulipPosyInteraction:TulipPosyInteraction};
})()
