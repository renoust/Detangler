
var TulipPosy = function()
{ 
	var width = 960,
	    height = 500;
	 
	var color = d3.scale.category20();
	 
	 
	var force = d3.layout.force()
	    .charge(-240)
	    .linkDistance(40)
	    .size([width, height]);

	var tulip_address = "http://localhost:8085"
	var json_address = "http://mbostock.github.com/d3/ex/miserables.json"
	json_address = "./cluster1.json"
	//json_address = "./miserables.json"

	var getSelection = function()
	{
		console.log("The node selection= ");
		var u = d3.selectAll("circle.node.selected").data();

		var toStringify = {};
		toStringify.nodes = new Array();

		for (i=0; i<u.length; i++)
		{
			var node = {};
			node.name = u[i].name;
			console.log(u[i]);
			toStringify.nodes.push(node);
		}
		console.log(JSON.stringify(toStringify));
		return JSON.stringify(toStringify)
	};



	var graphToJSON = function()
	{
		console.log("The node selection= ");
		var u = d3.selectAll("circle.node.selected").data();

		var toStringify = {};
		toStringify.nodes = new Array();

		for (i=0; i<u.length; i++)
		{
			var node = {};
			node.name = u[i].name;
			console.log(u[i]);
			toStringify.nodes.push(node);
		}
		console.log(JSON.stringify(toStringify));
		return JSON.stringify(toStringify)

	};



	var sendSelection = function(json)
	{
		$.post(tulip_address, { type:"update", graph:json }, function(data){
			var old = d3.selectAll("circle.node.selected").data();
			/*for (i=0; i<old.length; i++)
			{
				old[i].x = data.nodes[i].x
				old[i].y = data.nodes[i].y
			}*/
			console.log(data);

		  var n = data.nodes.length;
		  var ox = 0, oy = 0;
		  data.nodes.forEach(function(d) { ox += d.x, oy += d.y; });
		  ox = ox / n - width / 2, oy = oy / n - height / 2;
		  data.nodes.forEach(function(d) { d.x -= ox, d.y -= oy; });


			force
			      .nodes(data.nodes)
			      .links(data.links)
			      .start()
			      .stop();

			var link = svg.selectAll("line.link")
			      .data(data.links)
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; })
				.exit().remove()

		
			var node = svg.selectAll("circle.node")
			      .data(data.nodes)
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
				.exit().remove()
			      .call(force.drag)
			
		});

	};




	var callLayout = function(layoutName)
	{

		var params = {type:"layout", name:layoutName}
	

		$.post(tulip_address, {type:'algorithm', parameters:JSON.stringify(params)}, function(data){
			var old = d3.selectAll("circle.node.selected").data();
			console.log(data);


		  rescaleGraph(data)

			force
			      .nodes(data.nodes)
			      .links(data.links)
			      .start()
			      .stop();

			var link = svg.selectAll("line.link")
			      .data(data.links)
				.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; })
						.exit().remove()

		
			var node = svg.selectAll("circle.node")
			      .data(data.nodes)
				.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; })
				.exit().remove()
			      .call(force.drag)
			

			//d3.selectAll("circle.node.selected").data(old).exit().remove()
			/*enter().append("circle")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.style("fill","purple")
			.classed("selected", 0);*/
		});
	};


	var callFloatAlgorithm = function(floatAlgorithmName)
	{

		var params = {type:"float", name:floatAlgorithmName}
	

		$.post(tulip_address, {type:'algorithm', parameters:JSON.stringify(params)}, function(data){
			var old = d3.selectAll("circle.node.selected").data();
			/*for (i=0; i<old.length; i++)
			{
				old[i].x = data.nodes[i].x
				old[i].y = data.nodes[i].y
			}*/
			console.log(data);

		  var n = data.nodes.length;
		  var ox = 0, oy = 0;
		  data.nodes.forEach(function(d) { ox += d.x, oy += d.y; });
		  ox = ox / n - width / 2, oy = oy / n - height / 2;
		  data.nodes.forEach(function(d) { d.x -= ox, d.y -= oy; });


			force
			      .nodes(data.nodes)
			      .links(data.links)
			      .start()
			      .stop();

			var link = svg.selectAll("line.link")
			      .data(data.links)
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; })
				.exit().remove()

		
			var node = svg.selectAll("circle.node")
			      .data(data.nodes)
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
		.attr("r", function(d) { return d.viewMetric; })
				.exit().remove()
			      .call(force.drag)
			

			//d3.selectAll("circle.node.selected").data(old).exit().remove()
			/*enter().append("circle")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.style("fill","purple")
			.classed("selected", 0);*/
		});
	};


	var convertLinks = function(data)
	{
		//console.log(data)
		var nodeId = []
		data.nodes.forEach(function(d, i){nodeId.push(d.id); d.id = i})
		//console.log(nodeId)
		data.links.forEach(function(d){d.source=nodeId.indexOf(d.source); d.target=nodeId.indexOf(d.target);})
	}

	var loadJSON = function(data)
	{

		var n = data.nodes.length;
		var ox = 0, oy = 0;
		data.nodes.forEach(function(d) { ox += d.x, oy += d.y; });
		ox = ox / n - width / 2, oy = oy / n - height / 2;
		data.nodes.forEach(function(d) { d.x -= ox, d.y -= oy; });

		force
			.nodes(data.nodes)
			.links(data.links)
			.start()
			.stop();

		var link = svg.selectAll("line.link")
			.data(data.links).enter().append("line").attr("class", "link")
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; })


		var node = svg.selectAll("circle.node")
			.data(data.nodes).enter().append("circle").attr("class", "node")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.attr("r", 5)
			.call(force.drag)

		node.append("title")
			.text(function(d) { return d.name; });		

	}


	var createGraph = function(json)
	{
	  var n = json.nodes.length;
	  var ox = 0, oy = 0;
	  json.nodes.forEach(function(d) { ox += d.x, oy += d.y; });
	  ox = ox / n - width / 2, oy = oy / n - height / 2;
	  json.nodes.forEach(function(d) { d.x -= ox, d.y -= oy; });

	  force
	      .nodes(json.nodes)
	      .links(json.links)
	      .start()
	      .stop();

	  var link = svg.selectAll("line.link")
	      .data(json.links)
	      .enter().append("line")
	      .attr("class", "link")
	      .attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; })
	      .style("stroke-width", function(d) { return Math.sqrt(d.value); })
	      .on("mouseover", function(){d3.select(this).style("fill","red");});

	  var node = svg.selectAll("circle.node")
	      .data(json.nodes)
	      .enter().append("circle")
	      .attr("class", "node")
	      .attr("r", 5)
	      .attr("id", function(d, i) {return i;})
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; })
	      .style("fill", function(d) { return color(d.group); })
	      .call(force.drag)
	      .on("click", function(){
			var o = d3.select(this); 
			if (o.classed("selected"))
			{
			o.classed("selected",0).style("fill","steelblue");
			}else{
			o.classed("selected",1).style("fill","red");
			}
		})
	      .on("mouseover", function(){d3.select(this).style("fill","yellow"); })
	      .on("mouseout",function(){
		var o = d3.select(this); 
		if (o.classed("selected")) 
		{
			o.style("fill","red");
		}else{
			o.style("fill","steelblue");
		}
	      });

	  node.append("title")
	     .text(function(d) { return d.name; });
	}


	var addInteraction = function()
	{
	  var link = svg.selectAll("line.link")
	      .style("stroke-width", function(d) { return Math.sqrt(d.value); })
	      .on("mouseover", function(){d3.select(this).style("fill","red");});

	  var node = svg.selectAll("circle.node")
	      .attr("r", 5)
	      .attr("id", function(d, i) {return i;})
	      .style("fill", function(d) { return color(d.group); })
	      .on("click", function(){
			var o = d3.select(this); 
			if (o.classed("selected"))
			{
			  o.classed("selected",0).style("fill","steelblue");
			}else{
			  o.classed("selected",1).style("fill","red");
			}
	       })
	      .on("mouseover", function(){d3.select(this).style("fill","yellow"); })
	      .on("mouseout",function(){
			var o = d3.select(this); 
			if (o.classed("selected")) 
			{
				o.style("fill","red");
			}else{
				o.style("fill","steelblue");
			}
	      });
	}

	var createTulipGraph = function(json)
	{
		$.post(tulip_address, { type:"creation", graph:json }, function(data){
			var old = d3.selectAll("circle.node.selected").data();
			/*for (i=0; i<old.length; i++)
			{
				old[i].x = data.nodes[i].x
				old[i].y = data.nodes[i].y
			}*/
			console.log(data);

	/*
		  var n = data.nodes.length;
		  var ox = 0, oy = 0;
		  data.nodes.forEach(function(d) { ox += d.x, oy += d.y; });
		  ox = ox / n - width / 2, oy = oy / n - height / 2;
		  data.nodes.forEach(function(d) { d.x -= ox, d.y -= oy; });
	*/


			force
			      .nodes(data.nodes)
			      .links(data.links)
			      .start()
			      .stop();

			var link = svg.selectAll("line.link")
			      .data(data.links)//.enter()
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; })
				.exit().remove()

		
			var node = svg.selectAll("circle.node")
			      .data(data.nodes)//.enter()
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
				.exit().remove()
			      .call(force.drag)
			

			//d3.selectAll("circle.node.selected").data(old).exit().remove()
			/*enter().append("circle")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.style("fill","purple")
			.classed("selected", 0);*/
		});
	}

	var rescaleGraph = function(data)
	{
		var buttonWidth = 130.0
		var frame = 10.0
		var w = width-(buttonWidth+2*frame)
		var h = height-(2*frame)

		var minX = data.nodes[0].x
		var maxX = data.nodes[0].x
		var minY = data.nodes[0].y
		var maxY = data.nodes[0].y

	
		data.nodes.forEach(function(d){if (d.x < minX){minX = d.x}; if (d.x > maxX){maxX = d.x}; if (d.y < minY){minY = d.y}; if (d.y > maxY){maxY = d.y};})
	
		data.nodes.forEach(function(d){console.log("Point: ",d.x,' ', d.y)})

		var delta = 0.00000000000000000001 //to avoid division by 0
		scale = Math.min.apply(null, [w/(maxX-minX+delta), h/(maxY-minY+delta)])
	
		data.nodes.forEach(function(d){d.x = (d.x-minX)*scale+buttonWidth+frame; d.y = (d.y-minY)*scale+frame;})
	}



	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var bt1 = svg.selectAll("rect button1").data(["induced subgraph"]).enter()

	bt1.append("rect")
		.attr("class", "button1")
		.attr("width", 120)
		.attr("height", 20)
		.attr("x", 10)
		.attr("y", 10)
		.style("fill", 'lightgray')
		.on("click", function(){d3.select(this).style("fill","yellow"); sendSelection(getSelection());})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","lightgray");})

	bt1.append("text")
		.attr("x", 10)
		.attr("y", 10)
		.attr("dx", 5)
		.attr("dy", 15)//".35em")
		.text("induced subgraph")
		.style("fill", 'green')
		.on("click", function(){d3.select(this).style("fill","yellow"); sendSelection(getSelection());})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","green");})



	var bt2 = svg.selectAll("rect button2").data(["force layout"]).enter()

	bt2.append("rect")
		.attr("class", "button2")
		.attr("width", 120)
		.attr("height", 20)
		.attr("x", 10)
		.attr("y", 35)
		.style("fill", 'lightgray')	
		.on("click", function(){d3.select(this).style("fill","yellow"); callLayout("FM^3 (OGDF)")})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","lightgray");})

	bt2.append("text")
		.attr("x", 10)
		.attr("y", 35)
		.attr("dx", 5)
		.attr("dy", 15)//".35em")
		.text("force layout")
		.style("fill", 'green')
		.on("click", function(){d3.select(this).style("fill","yellow"); callLayout("FM^3 (OGDF)")})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","green");})



	var bt3 = svg.selectAll("rect button3").data(["force layout"]).enter()

	bt3.append("rect")
		.attr("class", "button3")
		.attr("width", 120)
		.attr("height", 20)
		.attr("x", 10)
		.attr("y", 60)
		.style("fill", 'lightgray')	
		.on("click", function(){d3.select(this).style("fill","yellow"); callLayout("Circular")})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","lightgray");})

	bt3.append("text")
		.attr("x", 10)
		.attr("y", 60)
		.attr("dx", 5)
		.attr("dy", 15)//".35em")
		.text("circular layout")
		.style("fill", 'green')
		.on("click", function(){d3.select(this).style("fill","yellow"); callLayout("Circular")})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","green");})


	var bt4 = svg.selectAll("rect button4").data(["random layout"]).enter()

	bt4.append("rect")
		.attr("class", "button4")
		.attr("width", 120)
		.attr("height", 20)
		.attr("x", 10)
		.attr("y", 85)
		.style("fill", 'lightgray')	
		.on("click", function(){d3.select(this).style("fill","yellow"); callLayout("Random")})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","lightgray");})

	bt4.append("text")
		.attr("x", 10)
		.attr("y", 85)
		.attr("dx", 5)
		.attr("dy", 15)//".35em")
		.text("random layout")
		.style("fill", 'green')
		.on("click", function(){d3.select(this).style("fill","yellow"); callLayout("Random")})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","green");})



	var bt5 = svg.selectAll("rect button5").data(["degree metric"]).enter()

	bt5.append("rect")
		.attr("class", "button5")
		.attr("width", 120)
		.attr("height", 20)
		.attr("x", 10)
		.attr("y", 110)
		.style("fill", 'lightgray')	
		.on("click", function(){d3.select(this).style("fill","yellow"); callFloatAlgorithm("Degree")})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","lightgray");})

	bt5.append("text")
		.attr("x", 10)
		.attr("y", 110)
		.attr("dx", 5)
		.attr("dy", 15)//".35em")
		.text("degree metric")
		.style("fill", 'green')
		.on("click", function(){d3.select(this).style("fill","yellow"); callFloatAlgorithm("Degree")})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","green");})


	//var bt6 = svg.selectAll("rect button6").data(["rescale"]).enter()

	/*
	bt6.append("rect")
		.attr("class", "button6")
		.attr("width", 120)
		.attr("height", 20)
		.attr("x", 10)
		.attr("y", 135)
		.style("fill", 'lightgray')	
		.on("click", function(){d3.select(this).style("fill","yellow"); rescaleGraph()})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","lightgray");})

	bt6.append("text")
		.attr("x", 10)
		.attr("y", 135)
		.attr("dx", 5)
		.attr("dy", 15)//".35em")
		.text("rescale")
		.style("fill", 'green')
		.on("click", function(){d3.select(this).style("fill","yellow"); rescaleGraph()})
		.on("mouseover", function(){d3.select(this).style("fill","red");})
		.on("mouseout", function(){d3.select(this).style("fill","green");})
	*/


	//d3.json(tulip_address+"?n=50", function(json) {
	//d3.json(json_address, function(data) {

	//for local use
	var jqxhr = $.getJSON(json_address, function(){ 
	  console.log("success");
	})

	.error(function() { alert("error"); })
	.complete(function() { console.log("complete"); })
	.success(function(data,b) { 
		console.log('json loaded')
		convertLinks(data)
		jsonData = JSON.stringify(data)
		loadJSON(data)
		addInteraction()
		console.log('sending to tulip... :')
		console.log(jsonData)
		createTulipGraph(jsonData)
	});
};
