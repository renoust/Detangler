var Tools = function(contexte, objectcontext)
{

	//object's variables

		var __g__ = this;
		
		var contxt = contexte;
		var objectContext = objectcontext;
		

if (typeof Object.keys !== "function") {
    (function() {
        Object.keys = Object_keys;
        function Object_keys(obj) {
            var keys = [], name;
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    keys.push(name);
                }
            }
            return keys;
        }
    })();
}

// This is a handy function to round numbers
this.round = function(number, digits)
{
        var factor = Math.pow(10, digits);
        return Math.round(number*factor)/factor;
}

// This function allows to map a callback to a keyboard touch event
// It is not currently used.
// callback, the callback function
this.registerKeyboardHandler = function(callback) 
{
        var callback = callback;
        d3.select(window).on("keydown", callback);  
};

this.grabDataProperties = function(data)
{
    
    function getProps(n)
    {               
        Object.keys(n).forEach(function(p)
        {
            if (!(p in contxt.substrateProperties))
            {
                contxt.substrateProperties[p] = typeof(n[p])
            }
        })
    }

    data.nodes.forEach(getProps)
    data.links.forEach(getProps)

    console.log("The properties: ",contxt.substrateProperties);
}

// This function adds the baseID property for data which is the basic identifier for all nodes and links
// data, the data to update
// idName, if given, the property value of 'idName' will be assigned to 'baseID'
this.addBaseID = function(data, idName)
{
        console.log(data)
        data.nodes.forEach(function(d){//d.currentX = d.x; d.currentY = d.y;})
                                       if ("x" in d){d.currentX = d.x;}else{d.x = 0; d.currentX = 0;};
                                       if ("y" in d){d.currentY = d.y;}else{d.y = 0; d.currentY = 0;};})
        if (idName == "")
        {
                data.nodes.forEach(function(d, i){d.baseID = i});
                data.links.forEach(function(d, i){d.baseID = i});
        }
        else
        {
                data.nodes.forEach(function(d, i){d.baseID = d[idName]});
                data.links.forEach(function(d, i){d.baseID = d[idName]});
        }
}


// This function loads a substrate graph from a given json
// data, the data to load
//
// we might want to rename this function...        
this.loadJSON = function(data)
{
        objectContext.TulipPosyVisualizationObject.rescaleGraph(data);
        console.log("the data to store:", data);
        this.grabDataProperties(data);
        contxt.graph_substrate.nodes(data.nodes);
        contxt.graph_substrate.links(data.links);
        contxt.graph_substrate.edgeBinding();
        console.log("loading JSON", contxt.graph_substrate.nodes(), contxt.graph_catalyst.nodes());

        var graph_drawing = graphDrawing(contxt.graph_substrate, contxt.svg_substrate);
        graph_drawing.draw();
        
        return
}

return __g__;

}



