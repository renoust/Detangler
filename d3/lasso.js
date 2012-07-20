var lasso = function(svg)
{
        console.log('creating a lasso object with', svg)
	//this.this = {}
        var __g = this
	this.cSvg = svg
	this.pointList = [];
	this.started = false;
	this.group = null

	this.canMove = false
	this.moveLasso = false
        this.isResizing = false
        this.resizeDirection = "none"
	this.prevMovePoint = []

	this.totalDistanceAlongDrag = 0.0
	this.distanceFromStartToEnd = 0.0

	this.fillColor = 'black'

        this.cSvg.style("cursor", "crosshair");

        //style("cursor", "crosshair");

	this.updateDistance = function(cPoint)
	{
		if (__g.pointList.length > 0)
		{
			fPoint = __g.pointList[0]
			lPoint = __g.pointList[__g.pointList.length-1]
			__g.totalDistanceAlongDrag += Math.sqrt(((cPoint[0]-lPoint[0])*(cPoint[0]-lPoint[0])) + ((cPoint[1]-lPoint[1])*(cPoint[1]-lPoint[1])))
			__g.distanceFromStartToEnd = Math.sqrt(((cPoint[0]-fPoint[0])*(cPoint[0]-fPoint[0])) + ((cPoint[1]-fPoint[1])*(cPoint[1]-fPoint[1]))			)
		}
		__g.pointList.push([cPoint[0], cPoint[1]]);
	}
	
	this.isLasso = function()
	{
		//console.log(this.totalDistanceAlongDrag/this.distanceFromStartToEnd)
		return (__g.totalDistanceAlongDrag/__g.distanceFromStartToEnd) > 1.5 ;
	}

	this.mouseDown = function(e)
	{
		if (__g.started || __g.canMove || __g.isResizing)
                        return;
     
		__g.pointList= [];
		__g.totalDistanceAlongDrag = 0;
		__g.distanceFromStartToEnd = 0;
		__g.cSvg.selectAll(".brush").data(this.pointList).exit().remove();
		__g.pointList.push( [e[0], e[1]]);
		__g.group = __g.cSvg.append("g")
				.data(__g.pointList)
				.attr("class", "brush")
				.on("mouseover", function(d){
					if (__g.started || __g.canMove) return
					__g.canMove = true;
				})
				.on("mouseout", function(d){
					__g.canMove = false;
				})
				.on("mousedown", function(d){
					//if (this.canMove) return;
					var p = d3.mouse(this);
					__g.prevMovePoint = [p[0], p[1]];
					__g.moveLasso = true;
                                        console.log("svg to move:", svg)
				})
				.on("mousemove", function(d){
                                        //console.log('g object:',this)
					if (__g.moveLasso)
					{
						//console.log("should move the shapes!!!");
						var coord = d3.mouse(this);
						var dx = coord[0]-__g.prevMovePoint[0];
						var dy = coord[1]-__g.prevMovePoint[1];
						//console.log("moving mouse over: ",dx, ' ',dy)
						
						for (var i=0; i<d.length; i++)
						{
							d[i][0] = d[i][0]+dx;
							d[i][1] = d[i][0]+dy;
						}
						
						var strPointList = "";
                                                //console.log('g:', this);
                                                //console.log('the pointList:', this.pointList)
						for (var i=0; i<__g.pointList.length; i++)
						{
							__g.pointList[i][0] = __g.pointList[i][0]+dx;
							__g.pointList[i][1] = __g.pointList[i][1]+dy;
							var p = __g.pointList[i]
							strPointList += p[0]+','+p[1]+' '
						}
		
						if (__g.isLasso())
						{
							
							__g.cSvg.select("polygon.brush").data(__g.pointList)
								.attr("points", strPointList)
								.attr("style","fill:"+__g.fillColor+";stroke:purple;stroke-width:2;fill-rule:evenodd;fill-opacity:.125")
						}else{
							var p0 = __g.pointList[0]
							var p1 = __g.pointList[__g.pointList.length-1]

							__g.cSvg.select("rect.view").data([1])
								.attr("x", Math.min(p0[0], p1[0]))
								.attr("y", Math.min(p0[1], p1[1]))
								.attr("width", Math.abs(p0[0]-p1[0]))
								.attr("height", Math.abs(p0[1]-p1[1]))
								.style("fill", this.fillColor)
								.style("fill-opacity", .125)
								.style("stroke", "purple")
								.style("stroke-width",2)

                                                        __g.cSvg.selectAll("g.resize").data([]).exit().remove()
                                                        __g.drawResizeRectangles(p0,p1);
								

						}
						//d3.select(this).attr("transform", function() { return "translate(" + dx + "," + dy + ")"; })
						__g.checkIntersect();
						var p = d3.mouse(this);
						__g.prevMovePoint = [p[0], p[1]];
					}
				})
				.on("mouseup", function(d){					
					if (__g.moveLasso)
					{
						var coord = d3.mouse(this);
						var dx = coord[0]-__g.prevMovePoint[0];
						var dy = coord[1]-__g.prevMovePoint[1];
						
						for (var i=0; i<d.length; i++)
						{
							d[i][0] += dx;
							d[i][1] += dy;
						}
						
						var strPointList = "";
						for (var i=0; i<__g.pointList.length; i++)
						{
							__g.pointList[i][0] += dx;
							__g.pointList[i][1] += dy;
							var p = __g.pointList[i]
							strPointList += p[0]+','+p[1]+' '
						}
						__g.cSvg.select("polygon.brush").data(__g.pointList)
							.attr("points", strPointList)
						//d3.select(this).attr("transform", function(d) { return "translate(" + dx + "," + dy + ")"; })
						//this.prevMovePoint = []
					}
					__g.moveLasso = false;
					//this.canMove = false;
					
				})

		
		__g.cSvg.selectAll("text")
			.attr('unselectable', 'on')
			.style('-moz-user-select','none')
		        .style('-webkit-user-select','none')
		        .style('user-select','none')
		        .style('-ms-user-select','none')

		__g.started = true
	}
	
        this.resizeRectangleEvent = function(current, p0, p1)
        {

                        if(__g.isResizing)
                        {
                                console.log('we are resizing the rectangle: ', this.resizeDirection)
                                console.log("mouse: ", current)
                        }
                        
                        if (__g.resizeDirection == "north")
                        {
                                maxP = p0[1] > p1[1] ? p0 : p1
                                minP = p0[1] > p1[1] ? p1 : p0
                        

                                if (current[1] >= maxP[1])
                                {
                                        __g.resizeDirection = "south"
                                        __g.resizeRectangleEvent(current, minP, maxP)
                                }
                                else
                                {
                                        minP[1] = current[1]
                                        __g.cSvg.selectAll("g.resize").data([]).exit().remove()
                                        __g.drawResizeRectangles(minP, maxP)
                                }
                        }

                        if (__g.resizeDirection == "south")
                        {
                                maxP = p0[1] > p1[1] ? p0 : p1
                                minP = p0[1] > p1[1] ? p1 : p0
                        
                                if (current[1] <= minP[1])
                                {
                                        __g.resizeDirection = "north"
                                        __g.resizeRectangleEvent(current, minP, maxP)
                                }
                                else
                                {
                                        maxP[1] = current[1]
                                        //console.log("min, max",minP,maxP)
                                        __g.cSvg.selectAll("g.resize").data([]).exit().remove()
                                        __g.drawResizeRectangles(minP, maxP)
                                }
                        }


                        if (__g.resizeDirection == "east")
                        {
                                maxP = p0[0] > p1[0] ? p0 : p1
                                minP = p0[0] > p1[0] ? p1 : p0
                                
                                if (current[0] <= minP[0])
                                {
                                        __g.resizeDirection = "west"
                                        __g.resizeRectangleEvent(current, minP, maxP)
                                }else
                                {
                                        maxP[0] = current[0]
                                        //console.log("min, max",minP,maxP)
                                        __g.cSvg.selectAll("g.resize").data([]).exit().remove()
                                        __g.drawResizeRectangles(minP, maxP)
                                }
                        }

                        if (__g.resizeDirection == "west")
                        {
                                maxP = p0[0] > p1[0] ? p0 : p1
                                minP = p0[0] > p1[0] ? p1 : p0
                        
                                if (current[0] >= maxP[0])
                                {
                                        __g.resizeDirection = "east"
                                        __g.resizeRectangleEvent(current, minP, maxP)
                                }else
                                {
                                        minP[0] = current[0]
                                        //console.log("min, max",minP,maxP)
                                        __g.cSvg.selectAll("g.resize").data([]).exit().remove()
                                        __g.drawResizeRectangles(minP, maxP)
                                }
                        }


                        if (__g.resizeDirection == "south_west")
                        {
                                __g.resizeDirection = "south"
                                __g.resizeRectangleEvent(current, p0, p1)
                                __g.resizeDirection = "west"
                                __g.resizeRectangleEvent(current, p0, p1)
                                __g.resizeDirection = "south_west"
                        }

                        if (__g.resizeDirection == "north_west")
                        {
                                __g.resizeDirection = "north"
                                __g.resizeRectangleEvent(current, p0, p1)
                                __g.resizeDirection = "west"
                                __g.resizeRectangleEvent(current, p0, p1)
                                __g.resizeDirection = "north_west"
                        }

                        if (__g.resizeDirection == "north_east")
                        {
                                __g.resizeDirection = "north"
                                __g.resizeRectangleEvent(current, p0, p1)
                                __g.resizeDirection = "east"
                                __g.resizeRectangleEvent(current, p0, p1)
                                __g.resizeDirection = "north_east"
                        }

                        if (__g.resizeDirection == "south_east")
                        {
                                __g.resizeDirection = "south"
                                __g.resizeRectangleEvent(current, p0, p1)
                                __g.resizeDirection = "east"
                                __g.resizeRectangleEvent(current, p0, p1)
                                __g.resizeDirection = "south_east"
                        }

                        __g.cSvg.select("rect.view").data([1])
				.attr("x", Math.min(p0[0], p1[0]))
				.attr("y", Math.min(p0[1], p1[1]))
				.attr("width", Math.abs(p0[0]-p1[0]))
				.attr("height", Math.abs(p0[1]-p1[1]))
				.style("fill", this.fillColor)
				.style("fill-opacity", .125)
				.style("stroke", "purple")
				.style("stroke-width",2)
                        __g.checkIntersect();
                        return
        }

	this.mouseMove = function(e)
	{
                //console.log("status",this)
                if(__g.isResizing)
                {
                        
                        var p0 = __g.pointList[0]
                        var p1 = __g.pointList[__g.pointList.length-1]

                        var current = [e[0], e[1]]
                        __g.resizeRectangleEvent(current, p0, p1)
                        
                }

		if (! __g.started || __g.canMove) return;
		var prevPoint = __g.pointList[__g.pointList.length-1];
		var newPoint = [e[0], e[1]];
		//console.log(this.pointList, '/', prevPoint, '/', newPoint);

		__g.group.data(__g.pointList).append("path")
			.attr("class", "brush")
			.attr("d", function() { return "M"+prevPoint[0]+" "+prevPoint[1] +" L"+newPoint[0]+" "+newPoint[1]; })
			.style("stroke", "gray")
			.style("stroke-width", function(d) { return 1;}) //Math.sqrt(d.value); })		

		//__g.pointList.push([e[0], e[1]]);
		__g.updateDistance(newPoint)

		__g.group.selectAll("rect.brush").data([1]).exit().remove()
		if (! __g.isLasso())
		{
			var p0 = __g.pointList[0]
			var p1 = __g.pointList[__g.pointList.length-1]

			//console.log("#######################################################################################################lasso");
			__g.group.append("rect")
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
	
	this.mouseUp = function(e)
	{
                if (__g.isResizing) __g.isResizing = false;
		if (! __g.started || __g.canMove) return;
		var prevPoint = __g.pointList[__g.pointList.length-1];
		var newPoint = [e[0], e[1]];
		//console.log(this.pointList, '/', prevPoint, '/', newPoint);
		this.group.data(__g.pointList).append("path")
			.attr("class", "brush")
			.attr("d", function() { return "M"+prevPoint[0]+" "+prevPoint[1] +" L"+newPoint[0]+" "+newPoint[1]; })
			.style("stroke", "gray")
			.style("stroke-width", function(d) { return 1;}) //Math.sqrt(d.value); })
		
		__g.updateDistance(newPoint)
		
		
		if (__g.isLasso())
		{
			prevPoint = __g.pointList[0];
			__g.group.data(__g.pointList).append("path")
				.attr("class", "brush")
				.attr("d", function() { return "M"+newPoint[0]+" "+newPoint[1] +" L"+prevPoint[0]+" "+prevPoint[1]; })
				.style("stroke", "gray")
				.style("stroke-width", function(d) { return 1;}) //Math.sqrt(d.value); })
			__g.pointList.push([prevPoint[0], prevPoint[1]]);
			var strPointList = ""
			for (i=0; i<this.pointList.length; i++)
			{
				var p = __g.pointList[i]
				strPointList += p[0]+','+p[1]+' '
			}

			__g.group.append("polygon").data(__g.pointList)
				.attr("class", "brush")
				.attr("points", strPointList)
				.attr("style","fill:"+__g.fillColor+";stroke:purple;stroke-width:2;fill-rule:evenodd;fill-opacity:.125")
		}else{
			var p0 = __g.pointList[0]
			var p1 = __g.pointList[__g.pointList.length-1]

			__g.group.append("rect")
				.data([1])
				.attr("class","view")
				.attr("x", Math.min(p0[0], p1[0]))
				.attr("y", Math.min(p0[1], p1[1]))
				.attr("width", Math.abs(p0[0]-p1[0]))
				.attr("height", Math.abs(p0[1]-p1[1]))
				.style("fill", this.fillColor)
				.style("fill-opacity", .125)
				.style("stroke", "purple")
				.style("stroke-width",2)
                                .style("cursor", "move")
			//__g.pointList = [[p0[0], p0[1]],[p0[0], p1[1]], [p1[0], p1[1]], [p1[0], p0[1]]]
			//__g.group.data(this.pointList)
                        /*
                        this.group.append("path")
                                .data([1])
                                .attr("class","pathview")
                                .attr("d", function() { return "M"+p0[0]+" "+p0[1] +" L"+p0[0]+" "+p1[1]+" L"+p1[0]+" "+p1[1]+" L"+p1[0]+" "+p0[1]+" Z"; })
                                .on("mousedown", function(d){__g.isResizing = true;})
                                .on("mousemove", __g.resizeRectangle)
                                .on("mouseup", function(d){__g.isResizing = false;})
                                //.style("cursor", __g.overResizeRectangle)
                                .style("stroke", "green")
				.style("stroke-width",3)
                                .style("fill", "none")
                                .on("mouseover", function(d){__g.cSvg.style("cursor",this.overResizeRectangle(d3.mouse(this)))})
                        */
                        __g.cSvg.selectAll("g.resize").data([]).exit().remove()
                        __g.drawResizeRectangles(p0, p1);
                        

		}

		__g.checkIntersect()		

		__g.cSvg.selectAll("text")
			.attr('unselectable', 'off')
			.style('-moz-user-select','undefined')
		        .style('-webkit-user-select','undefined')
		        .style('user-select','undefined')
		        .style('-ms-user-select','undefined')

		__g.started = false;
                //console.log("setting this.started", this.started);
		__g.group.selectAll("rect.brush").data([1]).exit().remove()
		__g.cSvg.selectAll("path.brush").data(this.pointList).remove().exit()
		
	}

        this.drawResizeRectangles = function(p0, p1)
        {
                

                //this.group = this.cSvg.append("g")
		//		.data(this.pointList)
		//		.attr("class", "brush")

                var resizeGroup = __g.cSvg.append("g").attr("class", "resize")
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
                                .on("mousedown", function(){__g.isResizing = true; __g.resizeDirection = "west";})
                                .on("mouseup", function(){__g.isResizing = false;})

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
                                .on("mousedown", function(){__g.isResizing = true; __g.resizeDirection = "east";})
                                .on("mouseup", function(){__g.isResizing = false;})

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
                                .on("mousedown", function(){__g.isResizing = true; __g.resizeDirection = "north";})
                                .on("mousemove", function(){})//this.resizeRectangle("north",d3.mouse(this));})
                                .on("mouseup", function(){__g.isResizing = false;})

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
                                .on("mousedown", function(){__g.isResizing = true; __g.resizeDirection = "south";})
                                .on("mouseup", function(){__g.isResizing = false;})

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
                                .on("mousedown", function(){__g.isResizing = true; __g.resizeDirection = "north_west";})
                                .on("mouseup", function(){__g.isResizing = false;})

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
                                .on("mousedown", function(){__g.isResizing = true; __g.resizeDirection = "south_west";})
                                .on("mouseup", function(){__g.isResizing = false;})

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
                                .on("mousedown", function(){__g.isResizing = true; __g.resizeDirection = "south_east";})
                                .on("mouseup", function(){__g.isResizing = false;})

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
                                .on("mousedown", function(){__g.isResizing = true; __g.resizeDirection = "north_east";})
                                .on("mouseup", function(){__g.isResizing = false;})
        }

	
	this.checkIntersect = function()
	{
		__g.cSvg.selectAll("circle")
			.style('fill', function(){
				var x = d3.select(this).attr('cx');
				var y = d3.select(this).attr('cy');
				var pointArray = []
				if (__g.isLasso())
				{
					pointArray = __g.pointList
				}else{
					var p0 = __g.pointList[0]
					var p1 = __g.pointList[__g.pointList.length-1]			
					pointArray = [[p0[0], p0[1]],[p0[0], p1[1]], [p1[0], p1[1]], [p1[0], p0[1]]]
				}
			
				if (__g.intersect(pointArray, x, y))
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


	this.intersect = function(polygon, x, y)
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

	return this
}

