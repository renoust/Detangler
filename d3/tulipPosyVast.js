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

        // initialization of the communication address and port        
        // an additional default json file
        var tulip_address = "http://localhost:8085";
        var json_address = "./cluster1.json";

        // initialization of the default svg parameters
        var width = 960;
        var height = 500;
         
        // initialization of the svg frames
        var svg_substrate = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "svg_substrate");
        var svg_catalyst = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "svg_catalyst");
        
        // initialization of the graphs, and lasso interactors
        var graph_substrate = new graph();
        var graph_catalyst = new graph();
        var lasso_catalyst = null;
        var lasso_substrate = null;

        // initialization of the selection and move modes
        var select_mode_substrate = false;
        var move_mode_substrate = true;
        var show_labels_substrate = true;
        var show_links_substrate = true;
        var node_information_substrate = false;
        var select_mode_catalyst = false;
        var move_mode_catalyst = true;
        var show_labels_catalyst = true;
        var show_links_catalyst = true;
        var node_information_catalyst = false;
        var mouse_over_button = false;
        
        // initialization of the global entanglement parameters
        var catalyst_sync_operator = "AND";
        var entanglement_intensity = 0.0;
        var entanglement_homogeneity = 0.0;

        // initialization of default interface visual parameters
        var defaultFillColor = "white";
        var highlightFillColor = "lavender";
        var defaultTextColor = "black";
        var defaultBorderColor = "gray";
        var defaultBorderWidth = .5;
        var defaultTextFont = "Arial";        
        var defaultTextSize = 14;
        //var color = d3.scale.category20();

        var sessionSid = 0;
        
        var substrateProperties = {};
        var substrateWeightProperty = null;

        
        

        tulipPosyClient = new TulipPosyClient();
        tulipPosyInteraction = new TulipPosyInteraction();
        tulipPosyInterface = new TulipPosyInterface();
        tulipPosyVisualization = new TulipPosyVisualization();

        // We create the interfaces for each svg
        addInterfaceSubstrate();
        addInterfaceCatalyst();
        
        //console.log("beginning of the generation", graph_substrate.nodes(), graph_catalyst.nodes());

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

        // we create then the basic interactors
        createLasso("substrate");
        createLasso("catalyst");
        addZoom("substrate");
        addZoom("catalyst");
};

