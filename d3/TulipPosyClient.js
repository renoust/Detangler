var TulipPosyClient = function()
{
    var __g__ = this;

        // Loads the data from a json file, if no JSON is passed, then we load the default JSON stored in
        // 'json_address', otherwise it loads the given json file.
        // It is first formatted correctly, locally, then sent to tulip to be initialized (so it is modified
        // again), and analyzed.
        __g__.loadData = function(json)
        {
                //d3.json(tulip_address+"?n=50", function(json) {
                //d3.json(json_address, function(data) {

                //for local use
                if (json=="" || json==null)
                {
                        var jqxhr = $.getJSON(json_address, function(){ 
                          console.log("success");
                        })

                        .error(function(e) { alert("error!!", e); })
                        .complete(function() { console.log("complete"); })
                        .success(function(data,b) { 
                                //console.log('json loaded')
                                //console.log(data)
                                addBaseID(data, "id")
                                jsonData = JSON.stringify(data)
                                loadJSON(data)
                                //console.log('sending to tulip... :')
                                //console.log(jsonData)
                                createTulipGraph(jsonData)
                                analyseGraph()
                        });
                }
                else
                {
                        //console.log('we should now send it as we have it:')
                        //console.log(json)
                        data = $.parseJSON(json)
                        //data = eval(json)
                        //console.log('data loaded:')
                        //console.log(data);
                        addBaseID(data, "id")
                        json = JSON.stringify(data)
                        loadJSON(data)
                        console.log("I am creating the graph in Tulip")
                        createTulipGraph(json)
                        console.log("I should now analyse the graph", sessionSid)
                        analyseGraph()
                        console.log("graph analysed",sessionSid)
                        
                }
        }

        // This function calls a special case of creation of a graph, instead of passing a json graph
        // object, it passes a query that goes through a search engine to build then a substrate graph.
        // query, the query to pass to the search engine
        var callSearchQuery = function(query)
        {
                var recieved_data;
                console.log('calling search query ', query)
                $.ajax({url:tulip_address, async:false, data:{ type:"creation", 'search':query['query'] }, type:'POST', 
                        success:function(data){
                                console.log('sending search request in tulip, and recieved data: ',data)
                                data = JSON.parse(data)
                                recieved_data = data
                        }
                });
                return JSON.stringify(recieved_data)
                /*
                $.post(tulip_address, { type:"creation", 'search':query['query'] }, function(data){
                        console.log('sending search request in tulip, and recieved data: ',data)
                        return JSON.stringify(data)
                });*/
        }

        // This function creates a new substrate graph in tulip, initializes, returns and displays it.
        // json, the initial json string corresponding to the graph.
        var createTulipGraph = function(json)
        {
                $.ajax({url:tulip_address, data:{type:"creation", graph:json}, type:'POST', async:false, success:function(data){
                        console.log('creating in tulip, and recieved data: ',data)
                        data = JSON.parse(data)
                        console.log("here should be sid: ", data.data.sid)
                        sessionSid = data.data.sid
                        console.log("the session sid has just been affected: ",sessionSid);
                        rescaleGraph(data)
                        graph_substrate.nodes(data.nodes)
                        graph_substrate.links(data.links)
                        graph_substrate.edgeBinding()
                        graph_drawing = graphDrawing(graph_substrate, svg_substrate)
                        graph_drawing.move(graph_substrate, 0)
                }});
        }



        // This function calls through tulip the analysis of a substrate graph, stores and displays it
        // in the catalyst view, updating the new entanglement indices computed.
        var analyseGraph = function()
        {
                  var params = {type:"analyse"}
                //console.log("starting analysis:",graph_catalyst.nodes(), graph_substrate.nodes())

                var truc = 15;
                truc = sessionSid;

                $.post(tulip_address, {sid:truc, type:'analyse', target:'substrate', weight:substrateWeightProperty}, function(data){
                        data = JSON.parse(data)
                        console.log("received data after analysis:")
                        console.log(data);
                        //convertLinks(data);
                        rescaleGraph(data)
                        //console.log("right before:",graph_catalyst.nodes(), graph_substrate.nodes())
                        graph_catalyst.nodes(data.nodes)

                        //console.log("loaded graph:",graph_catalyst.nodes(), graph_substrate.nodes())

                        graph_catalyst.links(data.links)
                        graph_catalyst.edgeBinding()
                        graph_drawing = graphDrawing(graph_catalyst, svg_catalyst)
                        graph_drawing.clear()
                        graph_drawing.draw()
                        entanglement_homogeneity = data['data']['entanglement homogeneity']
                        entanglement_intensity = data['data']['entanglement intensity']
                        //console.log("after analysis:",graph_catalyst.nodes(), graph_substrate.nodes())
                        entanglementCaught();
                });

        }
        
        // This function calls a float algorithm of a graph through tulip, and moves the given graph accordingly
        // floatAlgorithmName, the name of the tulip algorithm we want to call
        // graphName, the string value corresponding to the graph
        var callFloatAlgorithm = function(floatAlgorithmName, graphName)
        {

                var params = {type:"float", name:floatAlgorithmName, target:graphName};

                var cGraph = null;
                var svg = null;

                if (graphName == 'substrate')
                {        
                        cGraph = graph_substrate;
                        svg = svg_substrate;
                }

                if (graphName == 'catalyst')
                {        
                        cGraph = graph_catalyst;
                        svg = svg_catalyst;
                }
        

                $.post(tulip_address, {sid:sessionSid, type:'algorithm', parameters:JSON.stringify(params)}, function(data){
                        data = JSON.parse(data)
                        rescaleGraph(data);
                        cGraph.nodes(data.nodes);
                        cGraph.links(data.links);
                        cGraph.edgeBinding();
                        var graph_drawing = graphDrawing(cGraph, svg);
                        graph_drawing.resize(cGraph, 0);

                        addInterfaceSubstrate();
                        addInterfaceCatalyst();
                        entanglementCaught();


                });
        }

// This function calls the synchronization from a given graph through tulip, returns and applies
        // the result on the other graph. The computed entanglement indices are also updated.
        // selection, the JSON string of the selected subgraph
        // graphName, the graph origin of the selection
        var syncGraph = function(selection, graphName)
        {
                console.log('sending a synchronization request: ', selection)

                var cGraph = null
                var svg = null

                if (graphName == 'substrate')
                {        
                        cGraph = graph_catalyst
                        svg = svg_catalyst
                }

                if (graphName == 'catalyst')
                {        
                        console.log('target is catalyst');
                        cGraph = graph_substrate
                        console.log(selection)
                        svg = svg_substrate
                }

        

                $.post(tulip_address, {sid:sessionSid, 
                                       type:'analyse', 
                                       graph:selection, 
                                       target:graphName, 
                                       operator:catalyst_sync_operator, 
                                       weight:substrateWeightProperty}, 
                        function(data){
                        
                        data = JSON.parse(data)
                        //var oldData = cGraph.nodes();
                        //var selectedID = [];
                        //var selectedNodes = [];
                        //data.nodes.forEach(function(d){selectedID.push(d.baseID);});
                        //console.log("selectedIDs",selectedID);
                        //console.log('cGraph',graphName, cGraph.nodes())
                        //cGraph.nodes().forEach(function(d){if(selectedID.indexOf(d.baseID) > -1) selectedNodes.push(d);});
                        //console.log("Selected Nodes:", selectedNodes);

                        console.log("received data after synchronization: ")
                        console.log(data);
                        //convertLinks(data);
                        //rescaleGraph(data)
                        
                        var tempGraph = new graph()
                        tempGraph.nodes(data.nodes)
                        tempGraph.links(data.links)

                        tempGraph.edgeBinding()

                        //cGraph.nodes(data.nodes)
                        //cGraph.links(data.links)

                        //cGraph.edgeBinding()
                        
                        var graph_drawing = graphDrawing(cGraph, svg)
                        
                        //g.clear()
                        //g.draw()
                        graph_drawing.show(tempGraph)
                        if ('data' in data)
                        {
                                entanglement_homogeneity = data['data']['entanglement homogeneity'];
                                entanglement_intensity = data['data']['entanglement intensity'];
                                entanglementCaught();
                        }
                });

        }


        var syncLayouts = function()
        {

                var params = {type:"synchronize layouts", name:"synchronize layouts"};
                //console.log('going to send params as: ', params)
                
                var cGraph = null;
                var svg = null;

                cGraph = graph_substrate;
                svg = svg_substrate;

                $.post(tulip_address, {sid:sessionSid, type:'algorithm', parameters:JSON.stringify(params)}, function(data){
                        // we need to rescale the graph so it will fit the current svg frame and not overlap the buttons
                        data = JSON.parse(data)
                        rescaleGraph(data);
                        cGraph.nodes(data.nodes);
                        cGraph.links(data.links);
                        cGraph.edgeBinding();
                        var graph_drawing = graphDrawing(cGraph, svg);
                        graph_drawing.move(cGraph, 0);
                });
        };

       
        // This function calls a layout algorithm of a graph through tulip, and moves the given graph accordingly
        // layoutName, the name of the tulip layout we want to call
        // graphName, the string value corresponding to the graph
        var callLayout = function(layoutName, graphName)
        {

                var params = {type:"layout", name:layoutName, target:graphName};
                //console.log('going to send params as: ', params)
                
                var cGraph = null;
                var svg = null;

                if (graphName == 'substrate')
                {        
                        cGraph = graph_substrate;
                        svg = svg_substrate;
                }

                if (graphName == 'catalyst')
                {        
                        cGraph = graph_catalyst;
                        svg = svg_catalyst;
                }

                $.post(tulip_address, {sid:sessionSid, type:'algorithm', parameters:JSON.stringify(params)}, function(data){
                        // we need to rescale the graph so it will fit the current svg frame and not overlap the buttons
                        data = JSON.parse(data)
                        rescaleGraph(data);
                        cGraph.nodes(data.nodes);
                        cGraph.links(data.links);
                        cGraph.edgeBinding();
                        var graph_drawing = graphDrawing(cGraph, svg);
                        graph_drawing.move(cGraph, 0);
                });
        };

        // This function send to the tulip server a selection of nodes and removes the unselected nodes
        // json, the json string of the graph
        // graphName, the string value corresponding to the graph
        var sendSelection = function(json, graphName)
        {
                console.log("calling sendselection: ",graphName," ",json);
                var cGraph = null;
                var svg = null;

                if (graphName == 'substrate')
                {        
                        cGraph = graph_substrate;
                        svg = svg_substrate;
                }

                if (graphName == 'catalyst')
                {        
                        cGraph = graph_catalyst;
                        svg = svg_catalyst;
                }

                $.post(tulip_address, { sid:sessionSid, type:"update", graph:json, target:graphName }, function(data){
                        data = JSON.parse(data)
                        console.log("querying an induced subgraph:",graphName," ",json);
                        cGraph.nodes(data.nodes);
                        cGraph.links(data.links);
                        cGraph.edgeBinding();
                        var graph_drawing = graphDrawing(cGraph, svg);
                        graph_drawing.exit(cGraph, 0);
                });

        };

        // This method returns the nodes that are selected in a given graph.
        // graphName, the string value corresponding to the graph we want to select nodes in ('substrate' or 'catalyst')
        // After selected all 'g.node' of class 'selected', the function constructs and array of nodes with only its 'baseID'
        // and returns a string JSON version of the corresponding selection
        var getSelection = function(graphName)
        {
                var cGraph = null;
                var svg = null;

                if (graphName == 'substrate')
                {        
                        cGraph = graph_substrate;
                        svg = svg_substrate;
                }

                if (graphName == 'catalyst')
                {        
                        cGraph = graph_catalyst;
                        svg = svg_catalyst;
                }


                //console.log("GETSELECTION: The node selection= ", svg.selectAll("g.node.selected"));
                var u = svg.selectAll("g.node.selected").data();

                var toStringify = {};
                toStringify.nodes = new Array();

                for (i=0; i<u.length; i++)
                {
                        var node = {};
                        node.baseID = u[i].baseID;
                        //console.log(u[i]);
                        toStringify.nodes.push(node);
                }
                //console.log(JSON.stringify(toStringify));
                return JSON.stringify(toStringify);
        };



    return __g__;
}
