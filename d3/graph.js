// A basic graph container built on ideas borrowed from d3.layout.force

graph = function() {
	//var g = {};
	var g = this;
        this.nodes_array = [];
        this.links_array = [];

	this.nodes = function(x) {
		if (!arguments.length) return g.nodes_array;
		g.nodes_array = []
                x.forEach(function(d){g.nodes_array.push(jQuery.extend(true, {}, d))});
		return g.nodes_array;
	};

	this.links = function(x) {
		if (!arguments.length) return g.links_array;
		g.links_array = []
                x.forEach(function(d){g.links_array.push(jQuery.extend(true, {}, d))});
		//links = jQuery.extend(true, {}, x);
		return g.links_array;
	};


	// previous binding based on indexing (d3.force) inspired
   	this.edgeBindingIncrementalIndex = function() {
   		var n = g.nodes_array.length,
   			m = g.links_array.length,
   			o;

   		for (var i = 0; i < n; ++i) {
   			(o = g.nodes_array[i]).index = i;
   			o.weight = 0;
   		}

   		for (i = 0; i < m; ++i) {
   			o = g.links_array[i];
   			if (typeof o.source == "number") o.source = g.nodes_array[o.source];
   			if (typeof o.target == "number") o.target = g.nodes_array[o.target];
   		}

   	}

   	this.edgeBinding = function() {
   		var n = g.nodes_array.length,
   			m = g.links_array.length,
   			o = {};

   		for (var i = 0; i < n; ++i) {
   			o[g.nodes_array[i].baseID] = g.nodes_array[i];
   		}

		//console.log("nodeToBaseId : ",o)

   		for (i = 0; i < m; ++i) {
   			var l = g.links_array[i];
   			if (typeof l.source == "number")
			{
				//console.log("associating: ",l.source," with ",o[l.source])
				 l.source = o[l.source];
			}
   			if (typeof l.target == "number") l.target = o[l.target];
   		}

   	}


   	return g;
}
