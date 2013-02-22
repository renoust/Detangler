/************************************************************************
 * This class is the core of our visualization system. It manages both
 * the visualization through svg objects and communication with the
 * tulip python server. It displays 2 graphs, one corresponding to the
 * substrate graph and the other to the catalyst graph, and manages the
 * interactions between them. 
 * @requires d3.js, jQuery, graph.js, lasso.js
 * @authors Benjamin Renoust, Guy Melancon
 * @created May 2012
 ***********************************************************************/

// This class must be called like any function passing the well formated JSON object.
// originalJSON: a json object with an acceptable format
//
// We need to document the acceptable JSON format, and the communication protocol with
// tulip. This class also might be divided into classes, at least one should deal only
// with the communication, the other with the interaction, another for the overall
// interface...

var TulipPosy = function(originalJSON)
{ 


        var conteext = new context();
		var objectContext = new ObjectContext(conteext);
		

        // We create the interfaces for each svg
        objectContext.TulipPosyInterfaceObject.addInterfaceSubstrate();
        objectContext.TulipPosyInterfaceObject.addInterfaceCatalyst();
        
        //console.log("beginning of the generation", contxt.graph_substrate.nodes(), contxt.graph_catalyst.nodes());

        // This is the tricky part, because the json given to the function can be of many shapes.
        // If it is a query, we call tulip to perform the search
        // if it is a given file we load it normally
        // other wise we load the default function
        if (originalJSON != null && originalJSON != "" )
        {
                console.log('originalJSON not null', originalJSON)
                if ('query' in originalJSON)
                {
                        console.log('query is in json', originalJSON)
                        var recievedGraph  = objectContext.TulipPosyClientObject.callSearchQuery(originalJSON)
                        objectContext.TulipPosyClientObject.loadData(recievedGraph);
                        //console.log('new query: ',xyz)
                }
                else if ('file' in originalJSON)
                {
                        objectContext.TulipPosyClientObject.loadData(originalJSON.file);
                }
                else objectContext.TulipPosyClientObject.loadData();
        }

        // we create then the basic interactors
        objectContext.TulipPosyInteractionObject.createLasso("substrate");
        objectContext.TulipPosyInteractionObject.createLasso("catalyst");
        objectContext.TulipPosyInteractionObject.addZoom("substrate");
        objectContext.TulipPosyInteractionObject.addZoom("catalyst");
};

