//graph drawing basics
var graphDrawing = function(_graph, _svg)
{
	var g = {}
	g.cGraph = _graph
	g.svg = _svg

	g.draw = function()
	{
		g.drawLinks()
		g.drawNodes()
	}

	g.drawNodes = function()
	{
		/*
		console.log(g.cGraph)
		
		var node = g.svg.selectAll("node").data(g.cGraph.nodes()).enter().append("g")
		node.append("circle")
			.attr("cx", function(d){return d.x})
			.attr("cy", function(d){return d.y})
			.attr("r", function(d){return 5})
			.style("fill", "steelblue")
		*/

		var node = g.svg.selectAll("node")
			.data(g.cGraph.nodes()).enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

			.on("click", function(){
				var o = d3.select(this); 
				if (o.classed("selected"))
				{
					o.classed("selected",0)
					o.select("circle").style("fill","steelblue");
				}else{
					o.classed("selected",1)
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
		       });

		
		node.append("circle").attr("class", ".node.circle")
			//.attr("cx", function(d){return d.x})
			//.attr("cy", function(d){return d.y})
			.attr("r", 5)
			.style("fill", "steelblue")
			

		node.append("svg:text").attr("class", ".node.text")
			//.attr("dx", function(d){return d.x})
			//.attr("dy", function(d){return d.y})
			.style("stroke", "black")
			.style("stroke-width", 0.5)
			.style("font-family", "Arial")
			.style("font-size", 12)
			.text(function(d) { console.log(d); return d.label; });		
	}

	g.drawLinks = function()
	{
		var link = g.svg.selectAll("link")
			.data(g.cGraph.links()).enter().append("g")
			.attr("class", "link")
			.attr("transform", function(d) { return "translate(" + d.source.x + "," + d.source.y + ")"; })
			.on("click", function(){
				var o = d3.select(this); 
				if (o.classed("selected"))
				{
					o.classed("selected",0)
					o.select("path").style("stroke","gray");
				}else{
					o.classed("selected",1)
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
			});
			

		link.append("path").attr("class", ".link.path")
			.attr("d", function(d) { return "M"+0+" "+0 +" L"+(d.target.x - d.source.x)+" "+(d.target.y - d.source.y); })
			.style("stroke", "gray")
			.style("stroke-width", function(d) { return 1;}) //Math.sqrt(d.value); })

	}

	g.move = function(_graph, dTime)
	{
		g.cGraph = _graph

		var node = g.svg.selectAll(".node")
			.data(g.cGraph.nodes())
			.transition().delay(dTime)
			.attr("transform", function(d) { console.log(d); return "translate(" + d.x + "," + d.y + ")"; })

		var link = g.svg.selectAll(".link")
			.data(g.cGraph.links())
			.transition().delay(dTime)
			.attr("transform", function(d) { console.log(d); return "translate(" + d.source.x + "," + d.source.y + ")"; })
			.select("path")
				.attr("d", function(d) { return "M"+0+" "+0 +" L"+(d.target.x - d.source.x)+" "+(d.target.y - d.source.y); })
	}

	return g
}
