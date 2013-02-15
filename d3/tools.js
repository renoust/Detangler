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
var round = function(number, digits)
{
        var factor = Math.pow(10, digits);
        return Math.round(number*factor)/factor;
}

// This function allows to map a callback to a keyboard touch event
// It is not currently used.
// callback, the callback function
var registerKeyboardHandler = function(callback) 
{
        var callback = callback;
        d3.select(window).on("keydown", callback);  
};

var grabDataProperties = function(data)
{
    
    function getProps(n)
    {               
        Object.keys(n).forEach(function(p)
        {
            if (!(p in substrateProperties))
            {
                substrateProperties[p] = typeof(n[p])
            }
        })
    }

    data.nodes.forEach(getProps)
    data.links.forEach(getProps)

    console.log("The properties: ",substrateProperties);
}

// This function adds the baseID property for data which is the basic identifier for all nodes and links
// data, the data to update
// idName, if given, the property value of 'idName' will be assigned to 'baseID'
var addBaseID = function(data, idName)
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






