// A basic graph container built on ideas borrowed from d3.layout.force

graph = function() {
	var g = {};
	
	g.nodes = function(x) {
		if (!arguments.length) return nodes;
		nodes = x;
		return nodes;
	};

	g.links = function(x) {
		if (!arguments.length) return links;
		links = x;
		return links;
	};


	// previous binding based on indexing (d3.force) inspired
   	g.edgeBindingIncrementalIndex = function() {
   		var n = nodes.length,
   			m = links.length,
   			o;

   		for (var i = 0; i < n; ++i) {
   			(o = nodes[i]).index = i;
   			o.weight = 0;
   		}

   		for (i = 0; i < m; ++i) {
   			o = links[i];
   			if (typeof o.source == "number") o.source = nodes[o.source];
   			if (typeof o.target == "number") o.target = nodes[o.target];
   		}

   	}

   	g.edgeBinding = function() {
   		var n = nodes.length,
   			m = links.length,
   			o = {};

   		for (var i = 0; i < n; ++i) {
   			o[nodes[i].baseID] = nodes[i];
   		}

		console.log("nodeToBaseId : ",o)

   		for (i = 0; i < m; ++i) {
   			var l = links[i];
   			if (typeof l.source == "number")
			{
				console.log("associating: ",l.source," with ",o[l.source])
				 l.source = o[l.source];
			}
   			if (typeof l.target == "number") l.target = o[l.target];
   		}

   	}


   	return g;
}
