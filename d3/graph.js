/**************************************************************************
 * A basic graph container built on ideas borrowed from d3.layout.force
 * This container stores basically a list of nodes and links and binds
 * them together
 * @requires jQuery
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 **************************************************************************/

// This class can be called with 'new' to create independant instances
// with deep copies of the links and nodes
graph = function() 
{
    // g, the return variable
    // nodes_array, the array containing the list of nodes
    // links_array, the array containing the list of links

    //var g = {};
    var g = this;

    this.nodes_array = [];
    this.links_array = [];


    // setter/getter (with/without argument) of the node array 
    // x: an array of nodes
    // a deep copy is made using jQuery
    this.nodes = function(x) 
    {
        if (!arguments.length) return g.nodes_array;
        g.nodes_array = []
        x.forEach(function(d){g.nodes_array.push(jQuery.extend(true, {}, d))});
        return g.nodes_array;
    };

    // setter/getter (with/without argument) of the link array
    // x: an array of links
    // a deep copy is made using jQuery
    this.links = function(x) {
        if (!arguments.length) return g.links_array;
        g.links_array = []
        x.forEach(function(d){g.links_array.push(jQuery.extend(true, {}, d))});
        //links = jQuery.extend(true, {}, x);
        return g.links_array;
    };



    // this function needs to be called to bind the connected nodes to each link
    // each links is associated to a pair of nodes by there id, we use the
    // property baseID
    // we first create an associated map for each node to its baseID
    // we then replace if exists each link 'source' and 'target' property by the
    // node object associated to the given baseID number 
    this.edgeBinding = function() 
    {
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


    // previous binding based on indexing (d3.force) inspired
    // the principle is the same, but the index are given by the node position 
    // its the array
    this.edgeBindingIncrementalIndex = function() 
    {
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


   return g;
}
