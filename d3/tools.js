/************************************************************************
 * This module contains various tools for the application. They were put
 * here because they didn't really belong to any other modules.
 *
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

var TP = TP || {};
(function () {


    var Tools = function () {

        var __g__ = this;

        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();

        if (typeof Object.keys !== "function") {
            (function () {
                Object.keys = Object_keys;

                function Object_keys(obj) {
                    var keys = [],
                        name;
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
        this.round = function (number, digits) {
            var factor = Math.pow(10, digits);
            return Math.round(number * factor) / factor;
        }


        // This function allows to map a callback to a keyboard touch event
        // It is not currently used.
        // callback, the callback function
        this.registerKeyboardHandler = function (callback) {
            var callback = callback;
            d3.select(window)
                .on("keydown", callback);
        };


        this.grabDataProperties = function (data) {

            function getProps(n) {
                //console.log(Object.keys(n));
                Object.keys(n).forEach(function (p) {
                    if (!(p in TP.Context().substrateProperties)) {
                        TP.Context().substrateProperties[p] = typeof (n[p])
                    }
                })
            }

            data.nodes.forEach(getProps)
            data.links.forEach(getProps)

            //console.log("The properties: ", TP.Context().substrateProperties);
            //console.log("The properties: ", data.nodes);
            //console.log(TP.Context().substrateProperties);
        }


        // This function adds the baseID property for data which is the basic 
        // identifier for all nodes and links
        // data, the data to update
        // idName, if given, the property value of 'idName' will be assigned 
        // to 'baseID'
        this.addBaseID = function (data, idName) {
            //console.log(data)
            data.nodes.forEach(function (d) {
                if ("x" in d) {
                    d.currentX = d.x;
                } else {
                    d.x = 0;
                    d.currentX = 0;
                }
                ;
                if ("y" in d) {
                    d.currentY = d.y;
                } else {
                    d.y = 0;
                    d.currentY = 0;
                }
                ;
            })
            if (idName == "") {
                data.nodes.forEach(function (d, i) {
                    d.baseID = i
                });
                data.links.forEach(function (d, i) {
                    d.baseID = i
                });
            } else {
                data.nodes.forEach(function (d, i) {
                    d.baseID = d[idName]
                });
                data.links.forEach(function (d, i) {
                    d.baseID = d[idName]
                });
            }
        }


        // This function loads a substrate graph from a given json
        // data, the data to load
        //
        // we might want to rename this function...        
        this.loadJSON = function (data, target) {
            //console.log("loadJSONrescaleBEGIN");

            //TP.GraphDrawing(TP.Context().getViewGraph('substrate'),TP.Context().getViewSVG('substrate')).rescaleGraph(contxt,data);
            //console.log("loadJSONrescaleENDING");
            //console.log("the data to store:", data);
            this.grabDataProperties(data);
            typeGraph = TP.Context().view[target].getType();
            TP.Context().view[target].getGraph().nodes(data.nodes, typeGraph);
            TP.Context().view[target].getGraph().links(data.links, typeGraph);
            TP.Context().view[target].getGraph().edgeBinding();
            //console.log("loading JSON", TP.Context().graph_substrate.nodes(), TP.Context().graph_catalyst.nodes());

            TP.Context().view[target].getGraphDrawing().draw();
            //objectReferences.VisualizationObject.rescaleGraph(data);

            return
        }


        return __g__;
    }

    TP.Tools = Tools;
})(TP);
