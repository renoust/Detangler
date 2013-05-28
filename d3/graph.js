/**************************************************************************
 * A basic graph container built on ideas borrowed from d3.layout.force
 * This container stores basically a list of nodes and links and binds
 * them together
 * @requires jQuery
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 **************************************************************************/ 

(function () {

    // This class can be called with 'new' to create independant instances
    // with deep copies of the links and nodes
    var Graph = function () {
        // g, the return variable
        // nodes_array, the array containing the list of nodes
        // links_array, the array containing the list of links
        var g = this;

        this.nodes_array = [];
        this.links_array = [];

        // setter/getter (with/without argument) of the node array 
        // x: an array of nodes
        // a deep copy is made using jQuery
        this.nodes = function (x, type) {
            if (!arguments.length) 
                return g.nodes_array;
            g.nodes_array = [];
            x.forEach(function (d) {
                d._type = type;
                g.nodes_array.push(jQuery.extend(true, {}, d));
            });
            return g.nodes_array;
        };


        this.addNodes = function (x, type) {
            x.forEach(function (d) {
                if (type != null) 
                    d._type = type;
                g.nodes_array.push(jQuery.extend(true, {}, d));
            });
            return g.nodes_array;
        };


        // setter/getter (with/without argument) of the link array
        // x: an array of links
        // a deep copy is made using jQuery
        this.links = function (x, type) {
            if (!arguments.length) 
                return g.links_array;
            //console.log("Reassigning edges");

            g.links_array = []
            x.forEach(function (d) {
                g.links_array.push(jQuery.extend(true, {}, d));
                var o = g.links_array[g.links_array.length - 1];
                if (type) o._type = type;       
                if (typeof o.source != "number" && typeof o.source != "string")
                    //object already bounded
                    o.source = o.source.baseID;
                if (typeof o.target != "number" && typeof o.target != "string")
                    //object already bounded
                    o.target = o.target.baseID;
            });
            return g.links_array;
        };


        this.addLinks = function (x, type) {
            x.forEach(function (d) {
                if (type != null) 
                    d._type = type;
                d.source = d.source.baseID;
                d.target = d.target.baseID;
                g.links_array.push(jQuery.extend(true, {}, d));
            });
            return g.links_array;
        };


        // this function needs to be called to bind the connected nodes to each
        // link. Each links is associated to a pair of nodes by there id, we 
        // use the property baseID
        // we first create an associated map for each node to its baseID
        // we then replace if exists each link 'source' and 'target' property 
        // by the node object associated to the given baseID number 
        this.edgeBinding = function () {
            var n = g.nodes_array.length,
                m = g.links_array.length,
                o = {};

            for (var i = 0; i < n; ++i) {
                var node = g.nodes_array[i];
                if (!(node._type in o))
                    o[node._type] = {};
                o[node._type][node.baseID] = node;
            };

            for (i = 0; i < m; ++i) {
                var l = g.links_array[i];
                if (typeof l.source == "number") {
                    l.source = o[l._type][l.source];
                }
                if (typeof l.target == "number") l.target = o[l._type]
                    [l.target];
            }
            //console.log("The binding: ", g.links_array);
        }


        this.specialEdgeBinding = function (sourceType, targetType) {
            var n = g.nodes_array.length,
                m = g.links_array.length,
                o = {};

            for (var i = 0; i < n; ++i) {
                var node = g.nodes_array[i];
                if (!(node._type in o))
                    o[node._type] = {};
                o[node._type][node.baseID] = node;
            };

            for (i = 0; i < m; ++i) {
                var l = g.links_array[i];
                if (typeof l.source == "number") {
                    l.source = o[sourceType][l.source];
                }
                if (typeof l.target == "number") l.target = o[targetType]
                    [l.target];
            }
            //console.log("The binding: ", g.links_array);
        }


        // previous binding based on indexing (d3.force) inspired
        // the principle is the same, but the index are given by the node 
        // position 
        // its the array
        this.edgeBindingIncrementalIndex = function () {
            var n = g.nodes_array.length,
                m = g.links_array.length,
                o;

            for (var i = 0; i < n; ++i) {
                (o = g.nodes_array[i])
                    .index = i;
                o.weight = 0;
            }

            for (i = 0; i < m; ++i) {
                o = g.links_array[i];
                if (typeof o.source == "number") 
                    o.source = g.nodes_array[o.source];
                if (typeof o.target == "number") 
                    o.target = g.nodes_array[o.target];
            }
        }


        return g;
    }
    return {Graph: Graph};
})()
