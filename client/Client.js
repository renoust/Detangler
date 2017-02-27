/************************************************************************
 * This module contains all the requests to the server that the client
 * has to do in order to get the graph, or to modify some of its nodes.
 * @requires jquery.js
 * @authors Benjamin Renoust, Guy Melancon
 * @created May 2012
 ***********************************************************************/

var TP = TP || {};
(function () {
    

    var Client = function () {
        var __g__ = this;

        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();


        // Loads the data from a json file, if no JSON is passed, then we load
        // the default JSON stored in 'contxt.json_address', otherwise it loads
        // the given json file.
        // It is first formatted correctly, locally, then sent to tulip to be 
        //initialized (so it is modified again), and analyzed.
        this.loadData = function (json, target) {
            //for local use
            if (json == "" || json == null) {
                var jqxhr = $.getJSON(contxt.json_address, function () {
                    console.log("data loading success");
                })

                    .error(function (e) {
                        alert("data loading error!!", e);
                    })
                    .complete(function () {
                        console.log("data loading complete");
                    })
                    .success(function (data, b) {
                        if ("response" in data)
                            data = data.response;
                        objectReferences.ToolObject.addBaseID(data, "id");
                        var jsonData = JSON.stringify(data);
                        objectReferences.ToolObject.loadJSON(data, target);
                        TP.Client().createTulipGraph(jsonData, target);


                        //this.analyseGraph(target)
                    });
            } else {
                data = $.parseJSON(json);
                objectReferences.ToolObject.addBaseID(data, "id");
                json = JSON.stringify(data);

                objectReferences.ToolObject.loadJSON(data, target);
                this.createTulipGraph(json, target);
            }
            //TP.ObjectReferences().ClientObject.syncLayouts();
            //TP.ObjectContext().TulipPosyVisualizationObject.sizeMapping("entanglementIndex", "catalyst");
            /*var cGraph = null;
             var svg = null;

             svg = TP.Context().view('catalyst').getSvg();
             cGraph = contxt.getViewGraph('catalyst');
             var graph_drawing = TP.GraphDrawing(cGraph, svg);
             graph_drawing.nodeSizeMap(cGraph, 0, 'entanglementIndex');

             objectContext.TulipPosyInterfaceObject.addInterfaceSubstrate();
             objectContext.TulipPosyInterfaceObject.addInterfaceCatalyst();
             objectContext.TulipPosyVisualizationObject.entanglementCaught();*/
        };


        // This function calls a special case of creation of a graph, instead 
        // of passing a json graph object, it passes a query that goes through
        // a search engine to build then a substrate graph.
        // query, the query to pass to the search engine
        this.callSearchQuery = function (query) {
            var recieved_data = {};
            $.ajax({
                url: contxt.tulip_address,
                async: false,
                data: {type: "creation", 'search': query['query']},
                type: 'POST',
                success: function (data) {
                    data = JSON.parse(data);
                    recieved_data = data;
                }
            });
            return JSON.stringify(recieved_data);
        };


        this.sendQuery = function (params) {
            //success parameters might be useless...closure just does it well enough

            var defaultParams = {
                parameters: {},
                async: true,
                success: function () {
                },
                successParameters: []
            };

            for (var p in defaultParams) {
                if (!(p in params))
                    params[p] = defaultParams[p];
            }
            //we've got to manage here jsonp for cross domain request (so it 
            //should be always async) and error callback, at least default 
            //error and waiting behaviours
            //we also may want to manage JSON interpretation directly

            $.ajax({
                url: contxt.tulip_address,
                data: params['parameters'],
                type: 'POST',
                dataType: 'json',
                async: params['async'],
                success: function (data) {
                    var args = [data];
                    var end = params['successParameters'].length;
                    for (var i = 0; i < end; i++)
                        args.push(params['successParameters'][i]);
                    params['success'].apply(this, args);
                }
            });
        };


        // This function creates a new substrate graph in tulip, initializes, 
        // returns and displays it.
        // json, the initial json string corresponding to the graph.
        this.createTulipGraph = function (json, target) {
            var params = {
                type: "creation",
                graph: json
            };
            __g__.sendQuery({
                parameters: params,
                async: false,
                //success: objectReferences.UpdateViewsObject.buildGraphFromData
                success: function (data) {
                    objectReferences.UpdateViewsObject.buildGraphFromData(data, target);
                    if ($('#analyse').is(':checked')) {
                        var viewGraphSubstrate = TP.Context().view[target];
                        //this chunk should be dropped shouldn't it?
                        ['Bipartite analysis', '', {click: function () {
                            __g__.getController().sendMessage("analyseGraph", (function(){
                                var params = __g__.viewGraphCatalystParameters();
                                params.idSourceAssociatedView = __g__.getID();
                                return {
                                    viewIndex: __g__.getID(),
                                    viewGraphCatalystParameters: params
                                };
                            })());
                        }}, "Open View"],


                            viewGraphSubstrate.getController().sendMessage("analyseGraph", (function(){
                                var params = viewGraphSubstrate.viewGraphCatalystParameters();
                                params.idSourceAssociatedView = viewGraphSubstrate.getID();
                                return {
                                    viewIndex: viewGraphSubstrate.getID(),
                                    viewGraphCatalystParameters: params
                                };
                            })());
                        //{viewIndex: viewGraphSubstrate.getID(), viewGraphCatalystParameters: viewGraphSubstrate.viewGraphCatalystParameters()});
                    }
                    if ($('#sync').is(':checked')) {                        
                       TP.ObjectReferences().ClientObject.syncLayouts(viewGraphSubstrate.getID(), true, true, "descriptors");
                    }
                    TP.Context().InterfaceObject.tileViews();
                }
            });
        };


        // This function calls through tulip the analysis of a substrate graph, 
        // stores and displays it in the catalyst view, updating the new 
        // entanglement indices computed.
        this.analyseGraph = function (_event) {

            var idViewSource = _event.associatedData.source;
            var viewGraphCatalystParameters = _event.associatedData.viewGraphCatalystParameters;
            var multiplex_property = "descriptors";
            if ('multiplex_property' in viewGraphCatalystParameters)
                multiplex_property = viewGraphCatalystParameters.multiplex_property;


            if (TP.Context().view[idViewSource].getType() !== "substrate") {
                assert(false, "not substrate type");
                return;
            }


            var already_created = false;
            for (var v in TP.Context().view[idViewSource].getAssociatedView("catalyst"))
            {
                var cview = TP.Context().view[idViewSource].getAssociatedView("catalyst")[v]
                if (cview.descriptors_property == multiplex_property)
                    already_created = true;

            }
            //if (TP.Context().view[idViewSource].getAssociatedView("catalyst") == null 
            if (! already_created 
                && Object.keys(viewGraphCatalystParameters).length != null) {
                
                var mxprop = TP.Context().view[idViewSource].descriptors_property;
                var newParameters = jQuery.extend({}, viewGraphCatalystParameters);
                newParameters.name += " - "+mxprop;

                var myView = new TP.ViewGraphCatalyst(newParameters);
                TP.Context().view[idViewSource].leapfrog_target = mxprop;
                if (TP.Context().view[idViewSource].synchronized_views.indexOf(mxprop) < 0)
                    TP.Context().view[idViewSource].synchronized_views.push(mxprop);


                myView.buildLinks();
                myView.addView();
                myView.descriptors_property = mxprop;
                TP.Context().InterfaceObject.tileViews();


            }

            var params = {
                sid: contxt.sessionSid,
                type: 'analyse',
                target: TP.Context().view[idViewSource].getType(),//idViewSource,//'substrate',
                weight: TP.Context().substrateWeightProperty,
                multiplex_property: multiplex_property
            };

            TP.Context().view[idViewSource].getController().sendMessage("analyseGraphSendQuery", {params: params}, "principal");

        };


        this.analyseGraphSendQuery = function (_event) {

            var source = _event.associatedData.source;
            var params = _event.associatedData.params;

            __g__.sendQuery({
                parameters: params,
                success: function (data) {

                    TP.Context().getController().sendMessage("answerAnalyseGraph", {data: data, multiplex_property:params.multiplex_property}, source);
                }
            });

        };


        this.answerAnalyseGraph = function (_event) {

            var idView = _event.associatedData.target;
            var data = _event.associatedData.data;
            var multiplex_property = _event.associatedData.multiplex_property;

            data.nodes.forEach(function(d){
                if (d.label in TP.Context().layerData)
                {
                    var layer_info = TP.Context().layerData[d.label];
                    for (var attrname in layer_info) { d[attrname] = layer_info[attrname]; }
                }
            })

            var mxViewIndex = -1;
            for (var v in TP.Context().view[idView].getAssociatedView("catalyst"))
            {
                var cview = TP.Context().view[idView].getAssociatedView("catalyst")[v]
                if (cview.descriptors_property == multiplex_property)
                {
                    mxViewIndex = v;
                    break;
                }
            }

            objectReferences.UpdateViewsObject.applySubstrateAnalysisFromData(data, TP.Context().view[idView].getAssociatedView("catalyst")[mxViewIndex].getID(), multiplex_property);
        };


        // This function send to the tulip server a selection of nodes and 
        // removes the unselected nodes
        // json, the json string of the graph
        // graphName, the string value corresponding to the graph
        this.sendSelection = function (_event) {


            var idView = _event.associatedData.idView;
            var json = _event.associatedData.json;

            var updateParams = {
                type: "induced"
            };
            var params = {
                sid: contxt.sessionSid,
                type: "update",
                parameters: JSON.stringify(updateParams),
                graph: json,
                target: TP.Context().view[idView].getType()
            };

            TP.Context().view[idView].getController().sendMessage("selectionSendQuery", {params: params}, "principal");

        };


        this.selectionSendQuery = function (_event) {

            var source = _event.associatedData.source;
            var params = _event.associatedData.params;

            __g__.sendQuery({
                parameters: params,
                success: function (data) {
                }
            });

        };


        this.answerSendSelection = function (_event) {

            var idView = _event.associatedData.target;
            var data = _event.associatedData.data;



            objectReferences.UpdateViewsObject.applyInducedSubGraphFromData(data, idView);



        };


        this.getPlugins = function (_event) {
            
            var pluginType = _event.associatedData.pluginType;
            var endHandler = _event.associatedData.endHandler;
            //save for undo
            //var data_save = {nodes : TP.Context().getViewGraph(graphName).nodes(), links : TP.Context().getViewGraph(graphName).links()};
           // var undo = function(){objectReferences.UpdateViewsObject.applyLayoutFromData(data_save, graphName);}
            
            var pluginParams = {
                type: pluginType
            };
            
            var params = {
                sid: contxt.sessionSid,
                type: 'plugin',
                parameters: JSON.stringify(pluginParams)
            };

            //TP.Context().getController().sendMessage("getPluginsSendQuery",{params:params, endHandler:endHandler}, "principal")
            __g__.sendQuery({
               parameters: params,
               success: function (data) {
                   //TP.Context().getController().sendMessage("answerGetPlugins",{data:data, endHandler:endHandler}, "principal");
                    endHandler.call(TP.Context(), data);
                }
            });
                        
        };
        
        

        // This function calls a layout algorithm of a graph through tulip, 
        // and moves the given graph accordingly
        // layoutName, the name of the tulip layout we want to call
        // graphName, the string value corresponding to the graph
        this.callLayout = function (_event) {

            var idView = _event.associatedData.idView;
            var layoutName = _event.associatedData.layoutName;


            //save for undo
            //var data_save = {nodes : TP.Context().getViewGraph(graphName).nodes(), links : TP.Context().getViewGraph(graphName).links()};
            // var undo = function(){objectReferences.UpdateViewsObject.applyLayoutFromData(data_save, graphName);}

            var layoutParams = {
                type: "layout",
                name: layoutName,
                target: TP.Context().view[idView].getType()
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'algorithm',
                multiplex_property: TP.Context().view[idView].descriptors_property,
                parameters: JSON.stringify(layoutParams)
            };

            TP.Context().view[idView].getController().sendMessage("callLayoutSendQuery", {params: params}, "principal");

        };
        


        this.callLayoutSendQuery = function (_event) {

            var source = _event.associatedData.source;
            var params = _event.associatedData.params;

            __g__.sendQuery({
                parameters: params,
                success: function (data) {

                    TP.Context().getController().sendMessage("AnswerCallLayout", {data: data}, source);

                }
            });

        };


        this.AnswerCallLayout = function (_event) {

            var idView = _event.associatedData.target;
            var data = _event.associatedData.data;

            objectReferences.UpdateViewsObject.applyLayoutFromData(data, idView);
        };


        this.updateLayout = function (graphName, json) {
            json = JSON.stringify({
                nodes: TP.Context().view[graphName].getGraph().nodes()
            });
            var updateParams = {
                type: "layout",
                target: TP.Context().view[graphName].getType(),
                graph: json
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'update',
                multiplex_property: TP.Context().view[graphName].descriptors_property,
                parameters: JSON.stringify(updateParams)
            };

            __g__.sendQuery({
                parameters: params,
                success: function (data) {
                }
            });
        };


        // This function calls a float algorithm of a graph through tulip, 
        // and moves the given graph accordingly
        // floatAlgorithmName, the name of the tulip algorithm we want to call
        // graphName, the string value corresponding to the graph
        this.callFloatAlgorithm = function (_event) {

            var floatAlgorithmName = _event.associatedData.floatAlgorithmName;
            var idView = _event.associatedData.idView;

            var floatParams = {
                type: "float",
                name: floatAlgorithmName,
                target: TP.Context().view[idView].getType()
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'algorithm',
                parameters: JSON.stringify(floatParams),
                multiplex_property: TP.Context().view[idView].descriptors_property,
            };
            //floatAlgorithmName, idView;
            TP.Context().view[idView].getController().sendMessage("FloatAlgorithmSendQuery", {params: params, floatAlgorithmName:floatAlgorithmName}, "principal");

        };


        this.FloatAlgorithmSendQuery = function (_event) {

            var source = _event.associatedData.source;
            var params = _event.associatedData.params;
            var floatAlgorithmName = _event.associatedData.floatAlgorithmName;

            __g__.sendQuery({
                parameters: params,
                success: function (data) {

                    TP.Context().getController().sendMessage("AnswerFloatAlgorithm", {data: data, floatAlgorithmName: floatAlgorithmName}, source);

                }
            });

        };


        this.AnswerFloatAlgorithm = function (_event) {
            var idView = _event.associatedData.target;
            var data = _event.associatedData.data;
            var floatAlgorithmName = _event.associatedData.floatAlgorithmName;

            objectReferences.UpdateViewsObject.applyFloatAlgorithmFromData(data, idView, floatAlgorithmName);
        };


        // This function calls the synchronization from a given graph through 
        // tulip, returns and applies the result on the other graph. The 
        // computed entanglement indices are also updated.
        // selection, the JSON string of the selected subgraph
        // graphName, the graph origin of the selection
        this.syncGraph = function (selection, graphName) {


            var syncTarget = TP.Context().view[graphName].getType();

            if (syncTarget == 'combined')
                syncTarget = TP.Context().view[contxt.combined_foreground].getType();

            var multiplex_properties = []
            if (syncTarget == "substrate")
            {
                for (var v in TP.Context().view[graphName].getAssociatedView("catalyst"))
                {
                    var cview = TP.Context().view[graphName].getAssociatedView("catalyst")[v];
                    if (TP.Context().view[graphName].synchronized_views.indexOf(cview.descriptors_property) > -1)
                        multiplex_properties.push(cview.descriptors_property);
                }
            }
            else
                multiplex_properties.push(TP.Context().view[graphName].descriptors_property);


            for (var i in multiplex_properties)
            {
                multiplex_property = multiplex_properties[i];

                var params = {
                    sid: contxt.sessionSid,
                    type: 'analyse',
                    graph: selection,
                    target: syncTarget,
                    operator: TP.Context().tabOperator[graphName],//contxt.catalyst_sync_operator,
                    weight: TP.Context().substrateWeightProperty,
                    multiplex_property: multiplex_property
                };


                __g__.sendQuery({
                    parameters: params,
                    async: false,
                    success: (function(syncTarget){
                        return function (data) {
                            objectReferences.UpdateViewsObject.syncGraphRequestFromData(data, selection, graphName, multiplex_property);
                            if (syncTarget == "catalyst" && TP.Context().leapfrogOnTheFly)
                                TP.ObjectReferences().InteractionObject.toggleSelection(graphName);
                        }})(syncTarget)
                });

            }

        };


        this.syncLayouts = function (currentGraph, async, rescale, multiplex_property) {

            //assert(true, "syncLayouts");

            if (async !== false)
                async = true;

            var syncLayoutParams = {
                type: "synchronize layouts",
                name: "synchronize layouts"
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'algorithm',
                parameters: JSON.stringify(syncLayoutParams),
                multiplex_property: multiplex_property,
            };


            __g__.sendQuery({
                parameters: params,
                async: async,
                //success: objectReferences.UpdateViewsObject.syncLayoutsFromData()
                success: function (data) {
                    objectReferences.UpdateViewsObject.syncLayoutsFromData(data, currentGraph);
                    if(rescale){
                        if($(window).height() / $(window).width() < 1)
                        {
                            TP.Context().currentOrientation = "vertical";
                        }else{
                            TP.Context().currentOrientation = "horizontal";                            
                        } 
                        TP.Context().InterfaceObject.tileViews();
                    }
                }
            });
        };


        // This method returns the nodes that are selected in a given graph.
        // graphName, the string value corresponding to the graph we want to 
        // select nodes in ('substrate' or 'catalyst')
        // After selected all 'g.node' of class 'selected', the function 
        // constructs and array of nodes with only its 'baseID'
        // and returns a string JSON version of the corresponding selection
        this.getSelection = function (idView) {

            var svg = null;
            svg = TP.Context().view[idView].getSvg();

            //assert(false, ""+graphName);

            var nodeS = svg.selectAll("g.node.selected").data();

            var toStringify = {};
            toStringify.nodes = new Array();

            var end = nodeS.length;

            for (var i = 0; i < end; i++) {
                var node = {};
                node.baseID = nodeS[i].baseID;
                toStringify.nodes.push(node);
            }
            return JSON.stringify(toStringify);
        };

        return __g__;
    };
    TP.Client = Client;
})(TP);
