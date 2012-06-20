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

   	g.edgeBinding = function() {
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
   	return g;
}
