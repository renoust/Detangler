var lasso = function(svg)
{
	var g = {}
	g.cSvg = svg
	g.pointList = [];
	g.started = false;
	g.group = null

	g.canMove = false
	g.moveLasso = false
        g.isResizing = false
        g.resizeDirection = "none"
	g.prevMovePoint = []

	g.totalDistanceAlongDrag = 0.0
	g.distanceFromStartToEnd = 0.0

	g.fillColor = 'black'

        g.cSvg.style("cursor", "crosshair");

        //style("cursor", "crosshair");

	g.updateDistance = function(cPoint)
	{
		if (g.pointList.length > 0)
		{
			fPoint = g.pointList[0]
			lPoint = g.pointList[g.pointList.length-1]
			g.totalDistanceAlongDrag += Math.sqrt(((cPoint[0]-lPoint[0])*(cPoint[0]-lPoint[0])) + ((cPoint[1]-lPoint[1])*(cPoint[1]-lPoint[1])))
			g.distanceFromStartToEnd = Math.sqrt(((cPoint[0]-fPoint[0])*(cPoint[0]-fPoint[0])) + ((cPoint[1]-fPoint[1])*(cPoint[1]-fPoint[1]))			)
		}
		g.pointList.push([cPoint[0], cPoint[1]]);
	}
	
	g.isLasso = function()
	{
		//console.log(g.totalDistanceAlongDrag/g.distanceFromStartToEnd)
		return (g.totalDistanceAlongDrag/g.distanceFromStartToEnd) > 1.5 ;
	}

	g.mouseDown = function(e)
	{
		if (g.started || g.canMove || g.isResizing)
                        return;
     
		g.pointList= [];
		g.totalDistanceAlongDrag = 0;
		g.distanceFromStartToEnd = 0;
		g.cSvg.selectAll(".brush").data(g.pointList).exit().remove();
		g.pointList.push( [e[0], e[1]]);
		g.group = g.cSvg.append("g")
				.data(g.pointList)
				.attr("class", "brush")
				.on("mouseover", function(d){
					if (g.started || g.canMove) return
					g.canMove = true;
				})
				.on("mouseout", function(d){
					g.canMove = false;
				})
				.on("mousedown", function(d){
					//if (g.canMove) return;
					var p = d3.mouse(this);
					g.prevMovePoint = [p[0], p[1]];
					g.moveLasso = true;
				})
				.on("mousemove", function(d){
					if (g.moveLasso)
					{
						//console.log("should move the shapes!!!");
						var coord = d3.mouse(this);
						var dx = coord[0]-g.prevMovePoint[0];
						var dy = coord[1]-g.prevMovePoint[1];
						//console.log("moving mouse over: ",dx, ' ',dy)
						
						for (var i=0; i<d.length; i++)
						{
							d[i][0] = d[i][0]+dx;
							d[i][1] = d[i][0]+dy;
						}
						
						var strPointList = "";
						for (var i=0; i<g.pointList.length; i++)
						{
							g.pointList[i][0] = g.pointList[i][0]+dx;
							g.pointList[i][1] = g.pointList[i][1]+dy;
							var p = g.pointList[i]
							strPointList += p[0]+','+p[1]+' '
						}
		
						if (g.isLasso())
						{
							
							d3.select("polygon.brush").data(g.pointList)
								.attr("points", strPointList)
								.attr("style","fill:"+g.fillColor+";stroke:purple;stroke-width:2;fill-rule:evenodd;fill-opacity:.125")
						}else{
							var p0 = g.pointList[0]
							var p1 = g.pointList[g.pointList.length-1]

							d3.select("rect.view").data([1])
								.attr("x", Math.min(p0[0], p1[0]))
								.attr("y", Math.min(p0[1], p1[1]))
								.attr("width", Math.abs(p0[0]-p1[0]))
								.attr("height", Math.abs(p0[1]-p1[1]))
								.style("fill", g.fillColor)
								.style("fill-opacity", .125)
								.style("stroke", "purple")
								.style("stroke-width",2)

                                                        g.cSvg.selectAll("g.resize").data([]).exit().remove()
                                                        g.drawResizeRectangles(p0,p1);
								

						}
						//d3.select(this).attr("transform", function() { return "translate(" + dx + "," + dy + ")"; })
						g.checkIntersect();
						var p = d3.mouse(this);
						g.prevMovePoint = [p[0], p[1]];
					}
				})
				.on("mouseup", function(d){					
					if (g.moveLasso)
					{
						var coord = d3.mouse(this);
						var dx = coord[0]-g.prevMovePoint[0];
						var dy = coord[1]-g.prevMovePoint[1];
						
						for (var i=0; i<d.length; i++)
						{
							d[i][0] += dx;
							d[i][1] += dy;
						}
						
						var strPointList = "";
						for (var i=0; i<g.pointList.length; i++)
						{
							g.pointList[i][0] += dx;
							g.pointList[i][1] += dy;
							var p = g.pointList[i]
							strPointList += p[0]+','+p[1]+' '
						}
						d3.select("polygon.brush").data(g.pointList)
							.attr("points", strPointList)
						//d3.select(this).attr("transform", function(d) { return "translate(" + dx + "," + dy + ")"; })
						//g.prevMovePoint = []
					}
					g.moveLasso = false;
					//g.canMove = false;
					
				})

		
		g.cSvg.selectAll("text")
			.attr('unselectable', 'on')
			.style('-moz-user-select','none')
		        .style('-webkit-user-select','none')
		        .style('user-select','none')
		        .style('-ms-user-select','none')

		g.started = true
	}
	
        g.resizeRectangleEvent = function(current, p0, p1)
        {

                        if(g.isResizing)
                        {
                                console.log('we are resizing the rectangle: ', g.resizeDirection)
                                console.log("mouse: ", current)
                        }
                        
                        if (g.resizeDirection == "north")
                        {
                                maxP = p0[1] > p1[1] ? p0 : p1
                                minP = p0[1] > p1[1] ? p1 : p0
                        

                                if (current[1] >= maxP[1])
                                {
                                        g.resizeDirection = "south"
                                        g.resizeRectangleEvent(current, minP, maxP)
                                }
                                else
                                {
                                        minP[1] = current[1]
                                        g.cSvg.selectAll("g.resize").data([]).exit().remove()
                                        g.drawResizeRectangles(minP, maxP)
                                }
                        }

                        if (g.resizeDirection == "south")
                        {
                                maxP = p0[1] > p1[1] ? p0 : p1
                                minP = p0[1] > p1[1] ? p1 : p0
                        
                                if (current[1] <= minP[1])
                                {
                                        g.resizeDirection = "north"
                                        g.resizeRectangleEvent(current, minP, maxP)
                                }
                                else
                                {
                                        maxP[1] = current[1]
                                        console.log("min, max",minP,maxP)
                                        g.cSvg.selectAll("g.resize").data([]).exit().remove()
                                        g.drawResizeRectangles(minP, maxP)
                                }
                        }


                        if (g.resizeDirection == "east")
                        {
                                maxP = p0[0] > p1[0] ? p0 : p1
                                minP = p0[0] > p1[0] ? p1 : p0
                                
                                if (current[0] <= minP[0])
                                {
                                        g.resizeDirection = "west"
                                        g.resizeRectangleEvent(current, minP, maxP)
                                }else
                                {
                                        maxP[0] = current[0]
                                        console.log("min, max",minP,maxP)
                                        g.cSvg.selectAll("g.resize").data([]).exit().remove()
                                        g.drawResizeRectangles(minP, maxP)
                                }
                        }

                        if (g.resizeDirection == "west")
                        {
                                maxP = p0[0] > p1[0] ? p0 : p1
                                minP = p0[0] > p1[0] ? p1 : p0
                        
                                if (current[0] >= maxP[0])
                                {
                                        g.resizeDirection = "east"
                                        g.resizeRectangleEvent(current, minP, maxP)
                                }else
                                {
                                        minP[0] = current[0]
                                        console.log("min, max",minP,maxP)
                                        g.cSvg.selectAll("g.resize").data([]).exit().remove()
                                        g.drawResizeRectangles(minP, maxP)
                                }
                        }


                        if (g.resizeDirection == "south_west")
                        {
                                g.resizeDirection = "south"
                                g.resizeRectangleEvent(current, p0, p1)
                                g.resizeDirection = "west"
                                g.resizeRectangleEvent(current, p0, p1)
                                g.resizeDirection = "south_west"
                        }

                        if (g.resizeDirection == "north_west")
                        {
                                g.resizeDirection = "north"
                                g.resizeRectangleEvent(current, p0, p1)
                                g.resizeDirection = "west"
                                g.resizeRectangleEvent(current, p0, p1)
                                g.resizeDirection = "north_west"
                        }

                        if (g.resizeDirection == "north_east")
                        {
                                g.resizeDirection = "north"
                                g.resizeRectangleEvent(current, p0, p1)
                                g.resizeDirection = "east"
                                g.resizeRectangleEvent(current, p0, p1)
                                g.resizeDirection = "north_east"
                        }

                        if (g.resizeDirection == "south_east")
                        {
                                g.resizeDirection = "south"
                                g.resizeRectangleEvent(current, p0, p1)
                                g.resizeDirection = "east"
                                g.resizeRectangleEvent(current, p0, p1)
                                g.resizeDirection = "south_east"
                        }

                        d3.select("rect.view").data([1])
				.attr("x", Math.min(p0[0], p1[0]))
				.attr("y", Math.min(p0[1], p1[1]))
				.attr("width", Math.abs(p0[0]-p1[0]))
				.attr("height", Math.abs(p0[1]-p1[1]))
				.style("fill", g.fillColor)
				.style("fill-opacity", .125)
				.style("stroke", "purple")
				.style("stroke-width",2)
                        g.checkIntersect();
                        return
        }

	g.mouseMove = function(e)
	{
                if(g.isResizing)
                {
                        
                        var p0 = g.pointList[0]
                        var p1 = g.pointList[g.pointList.length-1]

                        var current = [e[0], e[1]]
                        g.resizeRectangleEvent(current, p0, p1)
                        
                }

		if (! g.started || g.canMove) return;
		var prevPoint = g.pointList[g.pointList.length-1];
		var newPoint = [e[0], e[1]];
		//console.log(g.pointList, '/', prevPoint, '/', newPoint);

		g.group.data(g.pointList).append("path")
			.attr("class", "brush")
			.attr("d", function() { return "M"+prevPoint[0]+" "+prevPoint[1] +" L"+newPoint[0]+" "+newPoint[1]; })
			.style("stroke", "gray")
			.style("stroke-width", function(d) { return 1;}) //Math.sqrt(d.value); })		

		//g.pointList.push([e[0], e[1]]);
		g.updateDistance(newPoint)

		g.group.selectAll("rect.brush").data([1]).exit().remove()
		if (! g.isLasso())
		{
			var p0 = g.pointList[0]
			var p1 = g.pointList[g.pointList.length-1]

			//console.log("#######################################################################################################lasso");
			g.group.append("rect")
				.data([1])
				.attr("class","brush")
				.attr("x", Math.min(p0[0], p1[0]))
				.attr("y", Math.min(p0[1], p1[1]))
				.attr("width", Math.abs(p0[0]-p1[0]))
				.attr("height", Math.abs(p0[1]-p1[1]))
				.style("fill", "black")
				.style("fill-opacity", .125)
		}
			
	}
        /*
        g.resizeRectangle = function(direction, mouse)
        {
                return;
                
               if(g.isResizing)
                {
                        var p0 = g.pointList[0]
                        var p1 = g.pointList[g.pointList.length-1]
                        var current = [mouse[0], mouse[1]]

                        if(g.isResizing)
                        {
                                console.log('we are resizing the rectangle: ', g.resizeDirection)
                                console.log("mouse: ", current)
                        }else{
                                return;
                        }
                        
                        if (g.resizeDirection == "north")
                        {
                                maxP = p0[1] > p1[1] ? p0 : p1
                                minP = p0[1] > p1[1] ? p1 : p0
                        
                                minP[1] = current[1]
                                console.log("min, max",minP,maxP)
                                g.cSvg.selectAll("g.resize").data([]).exit().remove()
                                g.drawResizeRectangles(minP, maxP)
                        }
                        return
                }

        }*/

        g.overResizeRectangle = function(point)
        {
                //var point = d3.mouse(g.cSvg)
                var strokeWidth = 3;

                var left = Math.min(g.pointList[0][0], g.pointList[g.pointList.length-1][0])
                var right = Math.max(g.pointList[0][0], g.pointList[g.pointList.length-1][0])
                var up = Math.min(g.pointList[0][1], g.pointList[g.pointList.length-1][1])
                var down = Math.max(g.pointList[0][1], g.pointList[g.pointList.length-1][1])

                var position = ""
  
                if (Math.abs(point[0] - left) <= strokeWidth)
                {
                        position += "L"
                }

                if (Math.abs(point[0] - right) <= strokeWidth)
                {
                        position += "R"
                }
 
                if (Math.abs(point[1] - down) <= strokeWidth)
                {
                        position += "D"
                }

                if (Math.abs(point[1] - up) <= strokeWidth)
                {
                        position += "U"
                } 
                console.log("position: ", point," ", position)

                
                if (position == "L")
                {
                        return "w-resize";
                }

                if (position == "R")
                {
                        return "e-resize";
                }
 
                if (position == "D")
                {
                        return "s-resize";
                }

                if (position == "U")
                {
                        return "n-resize";
                } 

                if (position == "RU")
                {
                        return "ne-resize";
                }

                if (position == "LD")
                {
                        return "sw-resize";
                }

                if (position == "RD") 
                {
                        return "se-resize";
                }

                if (position == "LU")
                {
                        return "nw-resize";
                }

                return "auto"                
                
 
        }
	
	g.mouseUp = function(e)
	{
                if (g.isResizing) g.isResizing = false;
		if (! g.started || g.canMove) return;
		var prevPoint = g.pointList[g.pointList.length-1];
		var newPoint = [e[0], e[1]];
		//console.log(g.pointList, '/', prevPoint, '/', newPoint);
		g.group.data(g.pointList).append("path")
			.attr("class", "brush")
			.attr("d", function() { return "M"+prevPoint[0]+" "+prevPoint[1] +" L"+newPoint[0]+" "+newPoint[1]; })
			.style("stroke", "gray")
			.style("stroke-width", function(d) { return 1;}) //Math.sqrt(d.value); })
		
		g.updateDistance(newPoint)
		
		
		if (g.isLasso())
		{
			prevPoint = g.pointList[0];
			g.group.data(g.pointList).append("path")
				.attr("class", "brush")
				.attr("d", function() { return "M"+newPoint[0]+" "+newPoint[1] +" L"+prevPoint[0]+" "+prevPoint[1]; })
				.style("stroke", "gray")
				.style("stroke-width", function(d) { return 1;}) //Math.sqrt(d.value); })
			g.pointList.push([prevPoint[0], prevPoint[1]]);
			var strPointList = ""
			for (i=0; i<g.pointList.length; i++)
			{
				var p = g.pointList[i]
				strPointList += p[0]+','+p[1]+' '
			}

			g.group.append("polygon").data(g.pointList)
				.attr("class", "brush")
				.attr("points", strPointList)
				.attr("style","fill:"+g.fillColor+";stroke:purple;stroke-width:2;fill-rule:evenodd;fill-opacity:.125")
		}else{
			var p0 = g.pointList[0]
			var p1 = g.pointList[g.pointList.length-1]

			g.group.append("rect")
				.data([1])
				.attr("class","view")
				.attr("x", Math.min(p0[0], p1[0]))
				.attr("y", Math.min(p0[1], p1[1]))
				.attr("width", Math.abs(p0[0]-p1[0]))
				.attr("height", Math.abs(p0[1]-p1[1]))
				.style("fill", g.fillColor)
				.style("fill-opacity", .125)
				.style("stroke", "purple")
				.style("stroke-width",2)
                                .style("cursor", "move")
			//g.pointList = [[p0[0], p0[1]],[p0[0], p1[1]], [p1[0], p1[1]], [p1[0], p0[1]]]
			//g.group.data(g.pointList)
                        /*
                        g.group.append("path")
                                .data([1])
                                .attr("class","pathview")
                                .attr("d", function() { return "M"+p0[0]+" "+p0[1] +" L"+p0[0]+" "+p1[1]+" L"+p1[0]+" "+p1[1]+" L"+p1[0]+" "+p0[1]+" Z"; })
                                .on("mousedown", function(d){g.isResizing = true;})
                                .on("mousemove", g.resizeRectangle)
                                .on("mouseup", function(d){g.isResizing = false;})
                                //.style("cursor", g.overResizeRectangle)
                                .style("stroke", "green")
				.style("stroke-width",3)
                                .style("fill", "none")
                                .on("mouseover", function(d){g.cSvg.style("cursor",g.overResizeRectangle(d3.mouse(this)))})
                        */
                        g.cSvg.selectAll("g.resize").data([]).exit().remove()
                        g.drawResizeRectangles(p0, p1);
                        

		}

		g.checkIntersect()		

		g.cSvg.selectAll("text")
			.attr('unselectable', 'off')
			.style('-moz-user-select','undefined')
		        .style('-webkit-user-select','undefined')
		        .style('user-select','undefined')
		        .style('-ms-user-select','undefined')

		g.started = false;
		g.group.selectAll("rect.brush").data([1]).exit().remove()
		g.cSvg.selectAll("path.brush").data(g.pointList).remove().exit()
		
	}

        g.drawResizeRectangles = function(p0, p1)
        {
                

                //g.group = g.cSvg.append("g")
		//		.data(g.pointList)
		//		.attr("class", "brush")

                var resizeGroup = g.cSvg.append("g").attr("class", "resize")
                resizeGroup.data([1]).enter()
                                                

                        //resizeGroup.selectAll("rect.resize").data([]).exit().remove()
                        resizeGroup.append("rect")
                                .data([1])
                                .classed("resize", true)
                                .classed("west", true)
                                .attr("x", Math.min(p0[0], p1[0]) - 5)
				.attr("y", Math.min(p0[1], p1[1]) + 5)
                                .attr("width", 10)
				.attr("height", Math.abs(Math.abs(p0[1]-p1[1]) - 10))
				.style("fill", "black")
				.style("fill-opacity", 0)
				.style("cursor", "w-resize")
                                .on("mousedown", function(){g.isResizing = true; g.resizeDirection = "west";})
                                .on("mouseup", function(){g.isResizing = false;})

                        resizeGroup.append("rect")
                                .data([1])
                                .classed("resize", true)
                                .classed("east", true)
                                .attr("x", Math.max(p0[0], p1[0]) - 5)
				.attr("y", Math.min(p0[1], p1[1]) + 5)
                                .attr("width", 10)
				.attr("height", Math.abs(Math.abs(p0[1]-p1[1]) - 10))
				.style("fill", "black")
				.style("fill-opacity", 0)
				.style("cursor", "e-resize")
                                .on("mousedown", function(){g.isResizing = true; g.resizeDirection = "east";})
                                .on("mouseup", function(){g.isResizing = false;})

                        resizeGroup.append("rect")
                                .data([1])
                                .classed("resize", true)
                                .classed("north", true)
                                .attr("x", Math.min(p0[0], p1[0]) + 5)
				.attr("y", Math.min(p0[1], p1[1]) - 5)
                                .attr("width", Math.abs(Math.abs(p0[0]-p1[0]) - 10))
				.attr("height", 10)
				.style("fill", "black")
				.style("fill-opacity", 0)
				.style("cursor", "n-resize")
                                .on("mousedown", function(){g.isResizing = true; g.resizeDirection = "north";})
                                .on("mousemove", function(){})//g.resizeRectangle("north",d3.mouse(this));})
                                .on("mouseup", function(){g.isResizing = false;})

                        resizeGroup.append("rect")
                                .data([1])
                                .classed("resize", true)
                                .classed("south", true)
                                .attr("x", Math.min(p0[0], p1[0]) + 5)
				.attr("y", Math.max(p0[1], p1[1]) - 5)
                                .attr("width", Math.abs(Math.abs(p0[0]-p1[0]) - 10))
				.attr("height", 10)
				.style("fill", "black")
				.style("fill-opacity", 0)
				.style("cursor", "s-resize")
                                .on("mousedown", function(){g.isResizing = true; g.resizeDirection = "south";})
                                .on("mouseup", function(){g.isResizing = false;})

                        resizeGroup.append("rect")
                                .data([1])
                                .classed("resize", true)
                                .classed("north_west", true)
                                .attr("x", Math.min(p0[0], p1[0]) - 5)
				.attr("y", Math.min(p0[1], p1[1]) - 5)
                                .attr("width", 10)
				.attr("height", 10)
				.style("fill", "red")
				.style("fill-opacity", 0)
				.style("cursor", "nw-resize")
                                .on("mousedown", function(){g.isResizing = true; g.resizeDirection = "north_west";})
                                .on("mouseup", function(){g.isResizing = false;})

                        resizeGroup.append("rect")
                                .data([1])
                                .classed("resize", true)
                                .classed("south_west", true)
                                .attr("x", Math.min(p0[0], p1[0]) - 5)
				.attr("y", Math.max(p0[1], p1[1]) - 5)
                                .attr("width", 10)
				.attr("height", 10)
				.style("fill", "red")
				.style("fill-opacity", 0)
				.style("cursor", "sw-resize")
                                .on("mousedown", function(){g.isResizing = true; g.resizeDirection = "south_west";})
                                .on("mouseup", function(){g.isResizing = false;})

                        resizeGroup.append("rect")
                                .data([1])
                                .classed("resize", true)
                                .classed("south_east", true)
                                .attr("x", Math.max(p0[0], p1[0]) - 5)
				.attr("y", Math.max(p0[1], p1[1]) - 5)
                                .attr("width", 10)
				.attr("height", 10)
				.style("fill", "red")
				.style("fill-opacity", 0)
				.style("cursor", "se-resize")
                                .on("mousedown", function(){g.isResizing = true; g.resizeDirection = "south_east";})
                                .on("mouseup", function(){g.isResizing = false;})

                        resizeGroup.append("rect")
                                .data([1])
                                .classed("resize", true)
                                .classed("north_east", true)
                                .attr("x", Math.max(p0[0], p1[0]) - 5)
				.attr("y", Math.min(p0[1], p1[1]) - 5)
                                .attr("width", 10)
				.attr("height", 10)
				.style("fill", "red")
				.style("fill-opacity", 0)
				.style("cursor", "ne-resize")
                                .on("mousedown", function(){g.isResizing = true; g.resizeDirection = "north_east";})
                                .on("mouseup", function(){g.isResizing = false;})
        }

	
	g.checkIntersect = function()
	{
		g.cSvg.selectAll("circle")
			.style('fill', function(){
				var x = d3.select(this).attr('cx');
				var y = d3.select(this).attr('cy');
				var pointArray = []
				if (g.isLasso())
				{
					pointArray = g.pointList
				}else{
					var p0 = g.pointList[0]
					var p1 = g.pointList[g.pointList.length-1]			
					pointArray = [[p0[0], p0[1]],[p0[0], p1[1]], [p1[0], p1[1]], [p1[0], p0[1]]]
				}
			
				if (g.intersect(pointArray, x, y))
					return 'red';
				else
                                {
                                        var e=window.event
                                        //console.log('control pushed ', e.ctrlKey)
                                        if (!e.ctrlKey)
					        return 'blue';
                                }
			});
	}


	g.intersect = function(polygon, x, y)
	{
		var i = 0
		var j = 0
		var c = 0;
		for (i = 0, j = polygon.length-1; i < polygon.length; j = i++) 
		{
			if ((((polygon[i][1] <= y) && (y < polygon[j][1])) ||
			((polygon[j][1] <= y) && (y < polygon[i][1]))) &&
			(x < (polygon[j][0] - polygon[i][0]) * (y - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]))
			c = !c;
      		}
      		return c;
	}

	return g
}

