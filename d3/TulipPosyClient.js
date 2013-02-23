(function(){
var TulipPosyClient = function(contexte, objectcontext)
{
    var __g__ = this;
	
	var contxt = contexte;
	var objectContext = objectcontext;
		
		
        // Loads the data from a json file, if no JSON is passed, then we load the default JSON stored in
        // 'contxt.json_address', otherwise it loads the given json file.
        // It is first formatted correctly, locally, then sent to tulip to be initialized (so it is modified
        // again), and analyzed.
        __g__.loadData = function(json)
        {
                //d3.json(contxt.tulip_address+"?n=50", function(json) {
                //d3.json(contxt.json_address, function(data) {

                //for local use
                if (json=="" || json==null)
                {
                        var jqxhr = $.getJSON(contxt.json_address, function(){ 
                          console.log("success");
                        })

                        .error(function(e) { alert("error!!", e); })
                        .complete(function() { console.log("complete"); })
                        .success(function(data,b) { 
                                //console.log('json loaded')
                                //console.log(data)
                                objectContext.ToolObject.addBaseID(data, "id")
                                jsonData = JSON.stringify(data)
                                objectContext.ToolObject.loadJSON(data)
                                //console.log('sending to tulip... :')
                                //console.log(jsonData)
                                this.createTulipGraph(jsonData)
                                this.analyseGraph()
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
                        objectContext.ToolObject.addBaseID(data, "id")
                        json = JSON.stringify(data)
                        objectContext.ToolObject.loadJSON(data)
                        console.log("I am creating the graph in Tulip")
                        this.createTulipGraph(json)
                        console.log("I should now analyse the graph", contxt.sessionSid)
                        this.analyseGraph()
                        console.log("graph analysed",contxt.sessionSid)
                        
                }
        }

        // This function calls a special case of creation of a graph, instead of passing a json graph
        // object, it passes a query that goes through a search engine to build then a substrate graph.
        // query, the query to pass to the search engine
        this.callSearchQuery = function(query)
        {
                var recieved_data;
                console.log('calling search query ', query)
                $.ajax({url:contxt.tulip_address, async:false, data:{ type:"creation", 'search':query['query'] }, type:'POST', 
                        success:function(data){
                                console.log('sending search request in tulip, and recieved data: ',data)
                                data = JSON.parse(data)
                                recieved_data = data
                        }
                });
                return JSON.stringify(recieved_data)
                /*
                $.post(contxt.tulip_address, { type:"creation", 'search':query['query'] }, function(data){
                        console.log('sending search request in tulip, and recieved data: ',data)
                        return JSON.stringify(data)
                });*/
        }

        // This function creates a new substrate graph in tulip, initializes, returns and displays it.
        // json, the initial json string corresponding to the graph.
        this.createTulipGraph = function(json)
        {
                $.ajax({url:contxt.tulip_address, data:{type:"creation", graph:json}, type:'POST', async:false, success:function(data){
                        console.log('creating in tulip, and recieved data: ',data)
                        data = JSON.parse(data)
                        console.log("here should be sid: ", data.data.sid)
                        contxt.sessionSid = data.data.sid
                        console.log("the session sid has just been affected: ",contxt.sessionSid);
                        objectContext.TulipPosyVisualizationObject.rescaleGraph(data)
                        contxt.graph_substrate.nodes(data.nodes)
                        contxt.graph_substrate.links(data.links)
                        contxt.graph_substrate.edgeBinding()
                        graph_drawing = graphDrawing(contxt.graph_substrate, contxt.svg_substrate)
                        graph_drawing.move(contxt.graph_substrate, 0)
                }});
        }



        // This function calls through tulip the analysis of a substrate graph, stores and displays it
        // in the catalyst view, updating the new entanglement indices computed.
        this.analyseGraph = function()
        {
                  var params = {type:"analyse"}
                //console.log("starting analysis:",contxt.graph_catalyst.nodes(), contxt.graph_substrate.nodes())

                var truc = 15;
                truc = contxt.sessionSid;

                $.post(contxt.tulip_address, {sid:truc, type:'analyse', target:'substrate', weight:contxt.substrateWeightProperty}, function(data){
                        data = JSON.parse(data)
                        console.log("received data after analysis:")
                        console.log(data);
                        //convertLinks(data);
                        objectContext.TulipPosyVisualizationObject.rescaleGraph(data)
                        //console.log("right before:",contxt.graph_catalyst.nodes(), contxt.graph_substrate.nodes())
                        contxt.graph_catalyst.nodes(data.nodes)

                        //console.log("loaded graph:",contxt.graph_catalyst.nodes(), contxt.graph_substrate.nodes())

                        contxt.graph_catalyst.links(data.links)
                        contxt.graph_catalyst.edgeBinding()
                        graph_drawing = graphDrawing(contxt.graph_catalyst, contxt.svg_catalyst)
                        graph_drawing.clear()
                        graph_drawing.draw()
                        contxt.entanglement_homogeneity = data['data']['entanglement homogeneity']
                        contxt.entanglement_intensity = data['data']['entanglement intensity']
                        //console.log("after analysis:",contxt.graph_catalyst.nodes(), contxt.graph_substrate.nodes())
                        objectContext.TulipPosyVisualizationObject.entanglementCaught();
                });

        }
        
        // This function calls a float algorithm of a graph through tulip, and moves the given graph accordingly
        // floatAlgorithmName, the name of the tulip algorithm we want to call
        // graphName, the string value corresponding to the graph
        this.callFloatAlgorithm = function(floatAlgorithmName, graphName)
        {

                var params = {type:"float", name:floatAlgorithmName, target:graphName};

                var cGraph = null;
                var svg = null;

                if (graphName == 'substrate')
                {        
                        cGraph = contxt.graph_substrate;
                        svg = contxt.svg_substrate;
                }

                if (graphName == 'catalyst')
                {        
                        cGraph = contxt.graph_catalyst;
                        svg = contxt.svg_catalyst;
                }
        

                $.post(contxt.tulip_address, {sid:contxt.sessionSid, type:'algorithm', parameters:JSON.stringify(params)}, function(data){
                        data = JSON.parse(data)
                        objectContext.TulipPosyVisualizationObject.rescaleGraph(data);
                        cGraph.nodes(data.nodes);
                        cGraph.links(data.links);
                        cGraph.edgeBinding();
                        var graph_drawing = graphDrawing(cGraph, svg);
                        graph_drawing.resize(cGraph, 0);

                        objectContext.TulipPosyInterfaceObject.addInterfaceSubstrate();
                        objectContext.TulipPosyInterfaceObject.addInterfaceCatalyst();
                        objectContext.TulipPosyVisualizationObject.entanglementCaught();


                });
        }

// This function calls the synchronization from a given graph through tulip, returns and applies
        // the result on the other graph. The computed entanglement indices are also updated.
        // selection, the JSON string of the selected subgraph
        // graphName, the graph origin of the selection
        this.syncGraph = function(selection, graphName)
        {
                console.log('sending a synchronization request: ', selection)

                var cGraph = null
                var svg = null

                if (graphName == 'substrate')
                {        
                        cGraph = contxt.graph_catalyst
                        svg = contxt.svg_catalyst
                }

                if (graphName == 'catalyst')
                {        
                        console.log('target is catalyst');
                        cGraph = contxt.graph_substrate
                        console.log(selection)
                        svg = contxt.svg_substrate
                }

        

                $.post(contxt.tulip_address, {sid:contxt.sessionSid, 
                                       type:'analyse', 
                                       graph:selection, 
                                       target:graphName, 
                                       operator:contxt.catalyst_sync_operator, 
                                       weight:contxt.substrateWeightProperty}, 
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
                        //objectContext.TulipPosyVisualizationObject.rescaleGraph(data)
                        
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
                                contxt.entanglement_homogeneity = data['data']['entanglement homogeneity'];
                                contxt.entanglement_intensity = data['data']['entanglement intensity'];
                                objectContext.TulipPosyVisualizationObject.entanglementCaught();
                        }
                });

        }


        this.syncLayouts = function()
        {

                var params = {type:"synchronize layouts", name:"synchronize layouts"};
                //console.log('going to send params as: ', params)
                
                var cGraph = null;
                var svg = null;

                cGraph = contxt.graph_substrate;
                svg = contxt.svg_substrate;

                $.post(contxt.tulip_address, {sid:contxt.sessionSid, type:'algorithm', parameters:JSON.stringify(params)}, function(data){
                        // we need to rescale the graph so it will fit the current svg frame and not overlap the buttons
                        data = JSON.parse(data)
                        objectContext.TulipPosyVisualizationObject.rescaleGraph(data);
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
        this.callLayout = function(layoutName, graphName)
        {

                var params = {type:"layout", name:layoutName, target:graphName};
                //console.log('going to send params as: ', params)
                
                var cGraph = null;
                var svg = null;

                if (graphName == 'substrate')
                {        
                        cGraph = contxt.graph_substrate;
                        svg = contxt.svg_substrate;
                }

                if (graphName == 'catalyst')
                {        
                        cGraph = contxt.graph_catalyst;
                        svg = contxt.svg_catalyst;
                }

                $.post(contxt.tulip_address, {sid:contxt.sessionSid, type:'algorithm', parameters:JSON.stringify(params)}, function(data){
                        // we need to rescale the graph so it will fit the current svg frame and not overlap the buttons
                        data = JSON.parse(data)
                        objectContext.TulipPosyVisualizationObject.rescaleGraph(data);
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
        this.sendSelection = function(json, graphName)
        {
                console.log("calling sendselection: ",graphName," ",json);
                var cGraph = null;
                var svg = null;

                if (graphName == 'substrate')
                {        
                        cGraph = contxt.graph_substrate;
                        svg = contxt.svg_substrate;
                }

                if (graphName == 'catalyst')
                {        
                        cGraph = contxt.graph_catalyst;
                        svg = contxt.svg_catalyst;
                }

                $.post(contxt.tulip_address, { sid:contxt.sessionSid, type:"update", graph:json, target:graphName }, function(data){
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
        this.getSelection = function(graphName)
        {
                var cGraph = null;
                var svg = null;

                if (graphName == 'substrate')
                {        
                        cGraph = contxt.graph_substrate;
                        svg = contxt.svg_substrate;
                }

                if (graphName == 'catalyst')
                {        
                        cGraph = contxt.graph_catalyst;
                        svg = contxt.svg_catalyst;
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
return {TulipPosyClient:TulipPosyClient};
})()
