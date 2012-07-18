
var TulipPosy = function(originalJSON)
{ 

        /*
        document.onkeydown = function(){

                if(window.event && window.event.ctrlKey == 1)
                        { // Capture and remap F5
                    window.event.keyCode = 505;
                      }

                if(window.event && window.event.altKey == 1)
                        { // Capture and remap F5
                    window.event.keyCode = 505;
                      }

                if(window.event && window.event.shiftKey == 1)
                        { // Capture and remap F5
                    window.event.keyCode = 505;
                      }


                if(window.event && window.event.keyCode == 505)
                        { // New action for F5
                    return false;
                        // Must return false or the browser will refresh anyway
                    }
        }*/

	var width = 960,
	    height = 500;
	 
	var color = d3.scale.category20();
	 
	 
	var force_substrate = d3.layout.force()
	    .charge(-240)
	    .linkDistance(40)
	    .size([width, height]);

	
	var force_catalyst = d3.layout.force()
	    .charge(-240)
	    .linkDistance(40)
	    .size([width, height]);
	
	var tulip_address = "http://localhost:8085"
	var json_address = "./cluster1.json"


	var svg_substrate = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("id", "svg_substrate")

	
	var svg_catalyst = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("id", "svg_catalyst")
	
	var graph_substrate = graph();
	var graph_catalyst = graph();
	var cohesion_intensity = 0.0;
	var cohesion_homogeneity = 0.0;
	var lasso_catalyst = null;
	var lasso_substrate = null;
	//var drawing_substrate = graphDrawing();
	//var drawing_catalyst = graphDrawing();
        var select_mode = false;
        var move_mode = true;


	var getSelection = function(graphName)
	{
		cGraph = graph_substrate
		svg = svg_substrate
		if (graphName == 'catalyst')
		{	
			cGraph = graph_catalyst
			svg = svg_catalyst
		}


		console.log("The node selection= ");
		var u = svg.selectAll("g.node.selected").data();

		var toStringify = {};
		toStringify.nodes = new Array();

		for (i=0; i<u.length; i++)
		{
			var node = {};
			node.baseID = u[i].baseID;
			console.log(u[i]);
			toStringify.nodes.push(node);
		}
		console.log(JSON.stringify(toStringify));
		return JSON.stringify(toStringify)
	};




	var sendSelection = function(json, graphName)
	{
		cGraph = graph_substrate
		svg = svg_substrate
		if (graphName == 'catalyst')
		{	
			cGraph = graph_catalyst
			svg = svg_catalyst
		}

		$.post(tulip_address, { type:"update", graph:json, target:graphName }, function(data){
			cGraph.nodes(data.nodes)
			cGraph.links(data.links)
			cGraph.edgeBinding()
			g = graphDrawing(cGraph, svg)
			g.exit(cGraph, 0)

			
		});

	};








	var callLayout = function(layoutName, graphName)
	{

		var params = {type:"layout", name:layoutName, target:graphName}
		console.log('going to send params as: ', params)
		
		cGraph = graph_substrate
		svg = svg_substrate
		if (graphName == 'catalyst')
		{	
			cGraph = graph_catalyst
			svg = svg_catalyst
		}

		$.post(tulip_address, {type:'algorithm', parameters:JSON.stringify(params)}, function(data){
			rescaleGraph(data)
			cGraph.nodes(data.nodes)
			cGraph.links(data.links)
			cGraph.edgeBinding()
			g = graphDrawing(cGraph, svg)
			g.move(cGraph, 0)

		});
	};




	var callFloatAlgorithm = function(floatAlgorithmName, graphName)
	{

		var params = {type:"float", name:floatAlgorithmName, target:graphName}

		cGraph = graph_substrate
		svg = svg_substrate
		if (graphName == 'catalyst')
		{	
			cGraph = graph_catalyst
			svg = svg_catalyst
		}
	

		$.post(tulip_address, {type:'algorithm', parameters:JSON.stringify(params)}, function(data){
		
			rescaleGraph(data)
			cGraph.nodes(data.nodes)
			cGraph.links(data.links)
			cGraph.edgeBinding()
			g = graphDrawing(cGraph, svg)
			g.resize(cGraph, 0)

		});
	};




	var addBaseID = function(data, idName)
	{
		if (idName == "")
		{
			data.nodes.forEach(function(d, i){d.baseID = i})
			data.links.forEach(function(d, i){d.baseID = i})
		}
		else
		{
			data.nodes.forEach(function(d, i){d.baseID = d[idName]})
			data.links.forEach(function(d, i){d.baseID = d[idName]})
		}
	}


	var loadJSON = function(data)
	{
		rescaleGraph(data)
		console.log("the data to store:", data);
		graph_substrate.nodes(data.nodes)
		graph_substrate.links(data.links)
		graph_substrate.edgeBinding()
		//console.log("graph_substrate", graph_substrate)

		var g = graphDrawing(graph_substrate, svg_substrate)
		g.draw()
		
		/*
		jsonGraph.nodes().forEach(function(d){d.x -= 10})
		g.move(jsonGraph, 0)

		jsonGraph.nodes().forEach(function(d){d.y = 50})
		g.move(jsonGraph, 0)
		*/
		return
	}
	

	var syncGraph = function(selection, graphName)
	{
		console.log('sending a synchronization request: ', graphName)

		cGraph = graph_catalyst
		svg = svg_catalyst
		if (graphName == 'catalyst')
		{	
			cGraph = graph_substrate
			svg = svg_substrate
		}

	

		$.post(tulip_address, {type:'analyse', graph:selection, target:graphName}, function(data){
			console.log("received data after synchronization: ")
			console.log(data);
			//convertLinks(data);
			rescaleGraph(data)
			cGraph.nodes(data.nodes)
			cGraph.links(data.links)
			cGraph.edgeBinding()
			g = graphDrawing(cGraph, svg)
			//g.clear()
			//g.draw()
			g.show(cGraph)
			if ('data' in data)
			{
				cohesion_homogeneity = data['data']['cohesion homogeneity'];
				cohesion_intensity = data['data']['cohesion intensity'];
				cohesionCaught();
			}
		});

	}



	var analyseGraph = function()
	{
	  	var params = {type:"analyse"}
	

		$.post(tulip_address, {type:'analyse', target:'substrate'}, function(data){
			console.log("received data after analysis:")
			console.log(data);
			//convertLinks(data);
			rescaleGraph(data)
			graph_catalyst.nodes(data.nodes)
			graph_catalyst.links(data.links)
			graph_catalyst.edgeBinding()
			g = graphDrawing(graph_catalyst, svg_catalyst)
			g.clear()
			g.draw()
			cohesion_homogeneity = data['data']['cohesion homogeneity']
			cohesion_intensity = data['data']['cohesion intensity']
			cohesionCaught();
		});

	}




	var createTulipGraph = function(json)
	{
		$.post(tulip_address, { type:"creation", graph:json }, function(data){
			console.log('creating in tulip, and recieved data: ',data)
			rescaleGraph(data)
			graph_substrate.nodes(data.nodes)
			graph_substrate.links(data.links)
			graph_substrate.edgeBinding()
			g = graphDrawing(graph_substrate, svg_substrate)
			g.move(graph_substrate, 0)
		});
	}


	var callSearchQuery = function(query)
	{
		var recieved_data;
		console.log('calling search query ', query)
		$.ajax({url:tulip_address, async:false, data:{ type:"creation", 'search':query['query'] }, type:'POST', 
			success:function(data){
				console.log('sending search request in tulip, and recieved data: ',data)
				recieved_data = data
			}
		});
		return JSON.stringify(recieved_data)
		/*
		$.post(tulip_address, { type:"creation", 'search':query['query'] }, function(data){
			console.log('sending search request in tulip, and recieved data: ',data)
			return JSON.stringify(data)
		});*/
	}

	var rescaleGraph = function(data)
	{
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
	
		data.nodes.forEach(function(d){d.x = (d.x-minX)*scale+buttonWidth+frame; d.y = (d.y-minY)*scale+frame;})
	}



	var addInterfaceCatalyst = function()
	{
		var target = "catalyst"

		var bt1 = svg_catalyst.selectAll("rect button1").data(["induced subgraph"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 10 + ")"; })
			.on("click", function(){console.log("This,",this);d3.select(this).select("rect").style("fill","yellow"); sendSelection(getSelection(target), target);})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})

		bt1.append("rect")
			.attr("class", "button1")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')
			

		bt1.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')



		var bt2 = svg_catalyst.selectAll("rect button2").data(["force layout"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 35 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); callLayout("FM^3 (OGDF)", target)})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})

		bt2.append("rect")
			.attr("class", "button2")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	

		bt2.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')



		var bt3 = svg_catalyst.selectAll("rect button3").data(["circular layout"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 60 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); callLayout("Circular", target)})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})

		bt3.append("rect")
			.attr("class", "button3")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	

		bt3.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')


		var bt4 = svg_catalyst.selectAll("rect button4").data(["random layout"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 85 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); callLayout("Random", target)})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})

		bt4.append("rect")
			.attr("class", "button4")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	

		bt4.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')
	



		var bt5 = svg_catalyst.selectAll("rect button5").data(["degree metric"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 110 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); callFloatAlgorithm("Degree", target)})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})

		bt5.append("rect")
			.attr("class", "button5")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	

		bt5.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')

		/*
		var bt6 = svg_catalyst.selectAll("rect button6").data(["analyse"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 135 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); analyseGraph()})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})
		
		bt6.append("rect")
			.attr("class", "button6")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	
			.on("mouseover", function(){d3.select(this).style("fill","red");})
			.on("mouseout", function(){d3.select(this).style("fill","lightgray");})

		bt6.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')
		*/

		var bt7 = svg_catalyst.selectAll("rect button7").data(["analyse selection"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 160 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); syncGraph(getSelection(target), target)})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})
		
		bt7.append("rect")
			.attr("class", "button6")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	
			.on("mouseover", function(){d3.select(this).style("fill","red");})
			.on("mouseout", function(){d3.select(this).style("fill","lightgray");})

		bt7.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')

	}

	var addInterfaceSubstrate = function()
	{
		var target = 'substrate'

		var bt1 = svg_substrate.selectAll("rect button1").data(["induced subgraph"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 10 + ")"; })
			.on("click", function(){console.log("This,",this);d3.select(this).select("rect").style("fill","yellow"); sendSelection(getSelection(target), target);})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})

		bt1.append("rect")
			.attr("class", "button1")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')
			

		bt1.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')



		var bt2 = svg_substrate.selectAll("rect button2").data(["force layout"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 35 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); callLayout("FM^3 (OGDF)", target)})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})

		bt2.append("rect")
			.attr("class", "button2")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	

		bt2.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')



		var bt3 = svg_substrate.selectAll("rect button3").data(["circular layout"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 60 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); callLayout("Circular", target)})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})

		bt3.append("rect")
			.attr("class", "button3")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	

		bt3.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')


		var bt4 = svg_substrate.selectAll("rect button4").data(["random layout"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 85 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); callLayout("Random", target)})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})

		bt4.append("rect")
			.attr("class", "button4")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	

		bt4.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')
	



		var bt5 = svg_substrate.selectAll("rect button5").data(["degree metric"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 110 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); callFloatAlgorithm("Degree", target)})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})

		bt5.append("rect")
			.attr("class", "button5")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	

		bt5.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')


		var bt6 = svg_substrate.selectAll("rect button6").data(["analyse"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 135 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); analyseGraph()})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})
		
		bt6.append("rect")
			.attr("class", "button6")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	
			.on("mouseover", function(){d3.select(this).style("fill","red");})
			.on("mouseout", function(){d3.select(this).style("fill","lightgray");})

		bt6.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')


		var bt7 = svg_substrate.selectAll("rect button7").data(["analyse selection"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 160 + ")"; })
			.on("click", function(){d3.select(this).select("rect").style("fill","yellow"); syncGraph(getSelection(target), target)})
			.on("mouseover", function(){d3.select(this).select("rect").style("fill","red");})
			.on("mouseout", function(){d3.select(this).select("rect").style("fill","lightgray");})
		
		bt7.append("rect")
			.attr("class", "button7")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	
			.on("mouseover", function(){d3.select(this).style("fill","red");})
			.on("mouseout", function(){d3.select(this).style("fill","lightgray");})

		bt7.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d})
			.style("fill", 'green')

                var bt8 = svg_substrate.selectAll("rect button8").data([{text:"move", colorOver:'lightgray', colorOut:'red'}]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 185 + ")"; })
			.on("click", function(d){
                                d3.select(this).select("rect").style("fill","yellow"); 
                                toggleSelectMove();
                        })
			.on("mouseover", function(d){
                                if(!move_mode){
                                        d.colorOver = "red"; 
                                        d.colorOut = "lightgray";
                                }else{
                                        d.colorOver = "lightgray"; 
                                        d.colorOut = "red";
                                }
                                d3.select(this).select("rect").style("fill", d.colorOver);})
			.on("mouseout", function(d){
                                if(!move_mode){
                                        d.colorOver = "red"; 
                                        d.colorOut = "lightgray";
                                }else{
                                        d.colorOver = "lightgray"; 
                                        d.colorOut = "red";
                                }
                                d3.select(this).select("rect").style("fill", d.colorOut);})
		
		bt8.append("rect")
			.attr("class", "button8")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'red')	
			//.on("mouseover", function(){d3.select(this).style("fill","red");})
			//.on("mouseout", function(){d3.select(this).style("fill","lightgray");})

		bt8.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d.text})
			.style("fill", 'green')


                var bt9 = svg_substrate.selectAll("rect button9").data([{text:"select", colorOver:'red', colorOut:'lightgray'}]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 210 + ")"; })
			.on("click", function(d){
                                d3.select(this).select("rect").style("fill","yellow"); 
                                toggleSelectMove();   
                        })
			.on("mouseover", function(d){
                                if(!select_mode){
                                        d.colorOver = "red"; 
                                        d.colorOut = "lightgray";
                                }else{
                                        d.colorOver = "lightgray"; 
                                        d.colorOut = "red";
                                }
                                d3.select(this).select("rect").style("fill",d.colorOver);})
			.on("mouseout", function(d){
                                if(!select_mode){
                                        d.colorOver = "red"; 
                                        d.colorOut = "lightgray";
                                }else{
                                        d.colorOver = "lightgray"; 
                                        d.colorOut = "red";
                                }
                                d3.select(this).select("rect").style("fill",d.colorOut);})
		
		bt9.append("rect")
			.attr("class", "button9")
			.attr("width", 120)
			.attr("height", 20)
			.style("fill", 'lightgray')	
			//.on("mouseover", function(d){d3.select(this).style("fill",d.colorOver);})
			//.on("mouseout", function(d){d3.select(this).style("fill",d.colorOut);})

		bt9.append("text")
			.attr("dx", 5)
			.attr("dy", 15)
			.text(function(d){return d.text})
			.style("fill", 'green')

		var coh = svg_substrate.selectAll("rect cohesion").data(["cohesion"]).enter().append('g')
			.attr("transform", function(d) { return "translate(" + 10 + "," + 395 + ")"; })
			
		
		coh.append("rect")
			.attr("class", "cohesionframe")
			.attr("width", 120)
			.attr("height", 90)
			.style("fill-opacity", 0)
			.style("stroke-width", 1)
			.style("stroke", 'black')	

		coh.append("text")
			.attr('class', 'cohesionlabel')
			.attr("dx", 5)
			.attr("dy", 15)
			.text("Cohesion")
			.style("fill", 'black')

		coh.append("text")
			.attr('class', 'intensitylabel')
			.attr("dx", 10)
			.attr("dy", 35)
			.text("intensity:")
			.style("fill", 'black')

		coh.append("text")
			.attr('class', 'intensity')
			.attr("dx", 110)
			.attr("dy", 50)
			.text(function(d){return ""+cohesion_intensity})
			.style("fill", 'blue')
			.style('text-anchor', 'end')

		coh.append("text")
			.attr('class', 'homogeneitylabel')
			.attr("dx", 10)
			.attr("dy", 70)
			.attr("width", 120)
			.text('homogeneity:')
			.style("fill", 'black')

		coh.append("text")
			.attr('class', 'homogeneity')
			.attr("dx", 110)
			.attr("dy", 85)
			.text(function(d){return ""+cohesion_homogeneity})
			.style('text-anchor', 'end')
			.style("fill", 'blue')

	}

	var cohesionCaught = function()
	{
		var brewerSeq = ['#FEEDDE', '#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603']
		svg_substrate.selectAll("text.homogeneity").text(function(d){return ""+round(cohesion_homogeneity,5)});
		svg_substrate.selectAll("text.intensity").text(function(d){return ""+round(cohesion_intensity,5)});
		var index = Math.round(cohesion_intensity*5)%6
		svg_substrate.selectAll("rect.cohesionframe").transition().style('fill-opacity', 1)
			.style("fill", brewerSeq[index])
		if(lasso_catalyst) lasso_catalyst.fillColor = brewerSeq[index]
		if(lasso_substrate) lasso_substrate.fillColor = brewerSeq[index]

	}

	var round = function(number, digits)
	{
		var factor = Math.pow(10, digits);
		return Math.round(number*factor)/factor;
	}

	var addBrush = function(target)
	{
		var svg = null
		var graph = null

		if (target == "catalyst")
		{
			svg = svg_catalyst
			graph = graph_catalyst			
		}
	
		if (target == "substrate")
		{
			svg = svg_substrate
			graph = graph_substrate
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
					        syncGraph(getSelection(target), target)
				        }
			        }else{
					
					        prevSelList.length = 0
					        prevSelList = selList.slice(0);
					        syncGraph(getSelection(target), target)
			        }
		        }
				
			
		
		
		  //syncGraph(getSelection(target), target)
		//console.log(nbSelected, 'elements selected')
		}

		function brushend() {
		  svg.classed("selecting", !d3.event.target.empty());
		}



	}

	var addLasso = function(target)
	{
		if (!target)
			return

		var svg = null
		var graph = null
		var myL = null

		if (target == "catalyst")
		{
			svg = svg_catalyst
			graph = graph_catalyst	
			lasso_catalyst = lasso(svg);
			myL = lasso_catalyst		
		}
	
		if (target == "substrate")
		{
			svg = svg_substrate
			graph = graph_substrate
			lasso_substrate = lasso(svg);
			myL = lasso_substrate
		}
		
		//myL = lasso(svg);
		var prevSelList = [];

		myL.checkIntersect = function()
		{
			var g = this
			var selList = []
                        var e=window.event
                        //console.log('control pushed ', e.ctrlKey)
                        
			svg.selectAll("g.node").classed("selected", function(d){
					var x = d.currentX;
					var y = d.currentY;
					var pointArray = []
					if (g.isLasso())
					{
						pointArray = g.pointList
					}else{
						var p0 = g.pointList[0]
						var p1 = g.pointList[g.pointList.length-1]			
						pointArray = [[p0[0], p0[1]],[p0[0], p1[1]], [p1[0], p1[1]], [p1[0], p0[1]]]
					}
                                        console.log("before")
                                        

                                        if (e.ctrlKey && d.selected == true)
                                                return true;

                                        var intersects = g.intersect(pointArray, x, y)

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
                                                console.log ("d.selected = ",intersects);
        					d.selected = intersects;
                                        }

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
                        //console.log("secltion list: ",selList)
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
						syncGraph(getSelection(target), target)
					}
				}else{
					
						prevSelList.length = 0
						prevSelList = selList.slice(0);
						syncGraph(getSelection(target), target)
				}
			}

		}	


		svg.on("mouseup", function(d){myL.mouseUp(d3.mouse(this))});
		svg.on("mousedown", function(d){myL.mouseDown(d3.mouse(this))});
		svg.on("mousemove", function(d){myL.mouseMove(d3.mouse(this))});

		
	}
        //permet d'appeler une fonction lors d'un appel d'une touche
        var registerKeyboardHandler = function(callback) 
        {
                var callback = callback;
                d3.select(window).on("keydown", callback);  
        };

        var addZoom = function()
        {
                /*svg_catalyst.call (d3.behavior.zoom()
                    .translate ([0, 0])
                    .scale (1.0)
                    .scaleExtent([0.5, 2.0])
                    .on("zoom", function() {
//                        svg_catalyst.selectAll(".node,.link").attr("transform","translate(" + d3.event.translate[0] + "," +  d3.event.translate[1] + ") scale(" +  d3.event.scale + ")");
                        svg_catalyst.selectAll(".node,.link").attr("transform","translate(" + d3.event.translate[0] + "," +  d3.event.translate[1] + ") scale(" +  d3.event.scale + ")");
                    })
                );*/
                svg_substrate.call (d3.behavior.zoom()
                            .translate ([0, 0])
                            .scale (1.0)
                            .scaleExtent([0.5, 2.0])
                            .on("zoom", function() {
                                
                                //registerKeyboardHandler(this.keyDown());
                               
                                //console.log("the scale", d3.event);
                                //console.log(d3.event.sourceEvent.shiftKey)
                                
                                if (!move_mode)
                                {
                                         return;
                                }

                                nodeDatum = svg_substrate.selectAll("g.node").data()
                                console.log("the data", nodeDatum)
                                nodeDatum.forEach(function(d){d.currentX = (d.x*Math.pow(d3.event.scale,2)+d3.event.translate[0]*(1+d3.event.scale));
                                                              d.currentY = (d.y*Math.pow(d3.event.scale,2)+d3.event.translate[1]*(1+d3.event.scale));
                                                                });
                                //svg_substrate.selectAll("g.node").data(nodeDatum)

                                /*
                                svg_substrate.selectAll("circle.test").data([]).exit().remove();

                                svg_substrate.selectAll("circle.test").data(nodeDatum).enter().append("svg:circle")
                                        .attr("class","test")
                                        .attr("cx", function(d){console.log('currentX ',d.currentX); return d.currentX})
                                        .attr("cy", function(d){ return d.currentY})
                                        .attr("r", 4)
                                        .style('fill', 'red')
                                        .style('fill-opacity', 1)

                                console.log( svg_substrate.selectAll("circle.test"))
                                */

                                svg_substrate.selectAll(".node,.link").attr("transform","translate(" + d3.event.translate[0] + "," +  d3.event.translate[1] + ") scale(" +  d3.event.scale + ")")
 //                               svg_substrate.selectAll("text.node").style("font-size", function(){ console.log(12.0/d3.event.scale); return Math.round(12.0/d3.event.scale);});
                                //svg_substrate.selectAll(".node,.link").attr("transform","scale(" +  d3.event.scale + ")");
                                svg_substrate.selectAll("text.node").style("font-size", function(){ return Math.ceil(12/(d3.event.scale*d3.event.scale));});
                            })
                        );
        }



	var loadData = function(json)
	{
		//d3.json(tulip_address+"?n=50", function(json) {
		//d3.json(json_address, function(data) {

		//for local use
		if (json=="" || json==null)
		{
			var jqxhr = $.getJSON(json_address, function(){ 
			  console.log("success");
			})

			.error(function(e) { alert("error!!", e); })
			.complete(function() { console.log("complete"); })
			.success(function(data,b) { 
				//console.log('json loaded')
				//console.log(data)
				addBaseID(data, "id")
				//convertLinks(data)
				jsonData = JSON.stringify(data)
				loadJSON(data)
				//console.log('sending to tulip... :')
				//console.log(jsonData)
				createTulipGraph(jsonData)
				analyseGraph()
			});
		}
		else
		{
			//console.log('we should now send it as we have it:')
			//console.log(json)
			data = $.parseJSON(json)
			//data = eval(json)
			//console.log('data loaded:')
			//console.log(data);
			addBaseID(data, "id")
			json = JSON.stringify(data)
			loadJSON(data)
			createTulipGraph(json)
			analyseGraph()
		}
	}


        var toggleSelectMove = function()
        {
                select_mode = ! select_mode;
                move_mode = ! move_mode;

                if(select_mode)
                {
                        svg_substrate.select('rect.button8').style('fill', 'lightgray');
                        svg_substrate.select('rect.button9').style('fill', 'red');
                        addLasso("substrate");
                        addLasso("catalyst");                        
                }

                if(move_mode)
                {
                        svg_substrate.style("cursor", "all-scroll");
                        svg_substrate.select('rect.button8').style('fill', 'red');
                        svg_substrate.select('rect.button9').style('fill', 'lightgray');                        
                        svg_substrate.on("mouseup", null);
		        svg_substrate.on("mousedown", null);
		        svg_substrate.on("mousemove", null);
                }
        }


        /*
        var move = function()
        {
                move_mode = ! move_mode;
                select_mode = ! select_mode;

                if(move_mode)
                {
                        svg_substrate.select('rect.button8').style('fill', 'lightgray');
                }
                if(select_mode)
                {
                        svg_substrate.select('rect.button9').style('fill', 'lightgray');                        
                }
        }*/

	addInterfaceSubstrate();
	addInterfaceCatalyst();
	
	if (originalJSON != null && originalJSON != "" )
	{
		console.log('orginialJSON not null', originalJSON)
		if ('query' in originalJSON)
		{
			console.log('query is in json', originalJSON)
			var recievedGraph  = callSearchQuery(originalJSON)
			loadData(recievedGraph);
			//console.log('new query: ',xyz)
		}
		else if ('file' in originalJSON)
		{
			loadData(originalJSON.file);
		}
		else loadData();
	}

	
        addZoom();
};

