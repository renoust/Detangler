var lasso = function(svg)
{
	var g = {}
	g.cSvg = svg
	g.pointList = [];
	g.started = false;
	g.group = null

	g.canMove = false
	g.moveLasso = false
	g.prevMovePoint = []

	g.totalDistanceAlongDrag = 0.0
	g.distanceFromStartToEnd = 0.0

	g.fillColor = 'black'

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
		if (g.started || g.canMove) return;

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
	
	g.mouseMove = function(e)
	{
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
	
	g.mouseUp = function(e)
	{
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
			//g.pointList = [[p0[0], p0[1]],[p0[0], p1[1]], [p1[0], p1[1]], [p1[0], p0[1]]]
			//g.group.data(g.pointList)

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
					return 'blue';
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

