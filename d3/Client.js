/************************************************************************
 * This module contains all the requests to the server that the client
 * has to do in order to get the graph, or to modify some of its nodes.
 * @requires jquery.js
 * @authors Guy Melancon, Benjamin Renoust
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
                    console.log("success");
                })

                    .error(function (e) {
                        alert("error!!", e);
                    })
                    .complete(function () {
                        console.log("complete");
                    })
                    .success(function (data, b) {
                        objectReferences.ToolObject.addBaseID(data, "id")
                        var jsonData = JSON.stringify(data)
                        objectReferences.ToolObject.loadJSON(data, target)
                        TP.Client().createTulipGraph(jsonData, target);


                        //this.analyseGraph(target)
                    });
            } else {
                data = $.parseJSON(json)
                objectReferences.ToolObject.addBaseID(data, "id")
                json = JSON.stringify(data)

                objectReferences.ToolObject.loadJSON(data, target)
                //console.log("I am creating the graph in Tulip")
                //console.log(data);
                this.createTulipGraph(json, target)
                //console.log("I should now analyse the graph",contxt.sessionSid)
                //this.analyseGraph(target)

                //console.log("graph analysed", contxt.sessionSid)
            }
            //TP.ObjectReferences().ClientObject.syncLayouts();
            //TP.ObjectContext().TulipPosyVisualizationObject.sizeMapping("entanglementIndice", "catalyst");
            /*var cGraph = null;
             var svg = null;

             svg = TP.Context().view('catalyst').getSvg();
             cGraph = contxt.getViewGraph('catalyst');
             var graph_drawing = TP.GraphDrawing(cGraph, svg);
             graph_drawing.nodeSizeMap(cGraph, 0, 'entanglementIndice');

             objectContext.TulipPosyInterfaceObject.addInterfaceSubstrate();
             objectContext.TulipPosyInterfaceObject.addInterfaceCatalyst();
             objectContext.TulipPosyVisualizationObject.entanglementCaught();*/
        }


        // This function calls a special case of creation of a graph, instead 
        // of passing a json graph object, it passes a query that goes through
        // a search engine to build then a substrate graph.
        // query, the query to pass to the search engine
        this.callSearchQuery = function (query) {
            var recieved_data = {};
            //console.log('calling search query ', query)
            $.ajax({
                url: contxt.tulip_address,
                async: false,
                data: {type: "creation", 'search': query['query']},
                type: 'POST',
                success: function (data) {
                    //console.log('sending search request in tulip, and recieved data: ', data)
                    data = JSON.parse(data)
                    recieved_data = data
                }
            });
            return JSON.stringify(recieved_data)
        }


        this.sendQuery = function (params) {
            //success parameters might be useless...closure just does it well enough

            var defaultParams = {
                parameters: {},
                async: true,
                success: function () {
                },
                successParameters: []
            }

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
        }


        // This function creates a new substrate graph in tulip, initializes, 
        // returns and displays it.
        // json, the initial json string corresponding to the graph.
        this.createTulipGraph = function (json, target) {
            var params = {
                type: "creation",
                graph: json
            }
            __g__.sendQuery({
                parameters: params,
                async: false,
                //success: objectReferences.UpdateViewsObject.buildGraphFromData
                success: function (data) {
                    objectReferences.UpdateViewsObject.buildGraphFromData(data, target)
                }
            });
        }


        // This function calls through tulip the analysis of a substrate graph, 
        // stores and displays it in the catalyst view, updating the new 
        // entanglement indices computed.
        this.analyseGraph = function (_event) {

            var idView = _event.associatedData.source;
            var tabCatalyst = _event.associatedData.tabCatalyst;

            if (TP.Context().view[idView].getType() !== "substrate") {
                assert(false, "not substrate type");
                return;
            }


            if (TP.Context().view[idView].getAssociatedView("catalyst") == null && tabCatalyst.length != null) {

                //assert(false, tabCatalyst[0])
                //assert(false, tabCatalyst[8])
                //assert(false, tabCatalyst[9])

                //console.log(tabCatalyst);

                TP.Context().view[tabCatalyst[0]] = new TP.ViewGraph(tabCatalyst[0], TP.view[idView].getGroup(), tabCatalyst[1], tabCatalyst[2], tabCatalyst[3], tabCatalyst[4], tabCatalyst[5], tabCatalyst[6], tabCatalyst[7], tabCatalyst[8], tabCatalyst[9], idView);
                TP.Context().view[tabCatalyst[0]].buildLinks();
                TP.Context().view[tabCatalyst[0]].addView();

            }

            //assert(true, "analyseGraph");
            var params = {
                sid: contxt.sessionSid,
                type: 'analyse',
                target: idView,//'substrate',
                weight: contxt.substrateWeightProperty
            }


            //assert(false, "idView : " + idView);
            //console.log(TP.Context().view[idView]);
            //console.log(TP.Context().view[idView].getController());

            TP.Context().view[idView].getController().sendMessage("analyseGraphSendQuery", {params: params}, "principal");

        }


        this.analyseGraphSendQuery = function (_event) {

            var source = _event.associatedData.source;
            var params = _event.associatedData.params;

            //console.log("succes")

            __g__.sendQuery({
                parameters: params,
                success: function (data) {

                    TP.Context().getController().sendMessage("answerAnalyseGraph", {data: data}, source);

                }
            });

        }


        this.answerAnalyseGraph = function (_event) {
            //console.log("toutou")

            var idView = _event.associatedData.target;
            //console.log("toutou1 : ", idView)
            var data = _event.associatedData.data;
            //console.log("toutou2 : ", data)


            objectReferences.UpdateViewsObject.applySubstrateAnalysisFromData(data, TP.Context().view[idView].getAssociatedView("catalyst")[0].getID());
        }


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
                target: idView
            }

            TP.Context().view[idView].getController().sendMessage("selectionSendQuery", {params: params}, "principal");

        };


        this.selectionSendQuery = function (_event) {

            var source = _event.associatedData.source;
            var params = _event.associatedData.params;

            __g__.sendQuery({
                parameters: params,
                success: function (data) {

                    TP.Context().getController().sendMessage("answerSendSelection", {data: data}, source);

                }
            });

        }


        this.answerSendSelection = function (_event) {

            var idView = _event.associatedData.target;
            var data = _event.associatedData.data;

            objectReferences.UpdateViewsObject.applyInducedSubGraphFromData(data, idView);
        }


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
                target: idView
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'algorithm',
                parameters: JSON.stringify(layoutParams)
            };

            TP.Context().view[idView].getController().sendMessage("callLayoutSendQuery", {params: params}, "principal")

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

        }


        this.AnswerCallLayout = function (_event) {

            var idView = _event.associatedData.target;
            var data = _event.associatedData.data;

            objectReferences.UpdateViewsObject.applyLayoutFromData(data, idView);
        }


        this.updateLayout = function (graphName, json) {
            json = JSON.stringify({
                nodes: TP.Context().view[graphName].getGraph().nodes()
            })
            var updateParams = {
                type: "layout",
                target: graphName,
                graph: json
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'update',
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
                target: idView
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'algorithm',
                parameters: JSON.stringify(floatParams)
            }
            floatAlgorithmName, idView
            TP.Context().view[idView].getController().sendMessage("FloatAlgorithmSendQuery", {params: params}, "principal");

        }


        this.FloatAlgorithmSendQuery = function (_event) {

            var source = _event.associatedData.source;
            var params = _event.associatedData.params;

            __g__.sendQuery({
                parameters: params,
                success: function (data) {

                    TP.Context().getController().sendMessage("AnswerFloatAlgorithm", {data: data}, source);

                }
            });

        }


        this.AnswerFloatAlgorithm = function (_event) {
            var idView = _event.associatedData.target;
            var data = _event.associatedData.data;

            objectReferences.UpdateViewsObject.applyFloatAlgorithmFromData(data, idView);
        }


        // This function calls the synchronization from a given graph through 
        // tulip, returns and applies the result on the other graph. The 
        // computed entanglement indices are also updated.
        // selection, the JSON string of the selected subgraph
        // graphName, the graph origin of the selection
        this.syncGraph = function (selection, graphName) {

            //assert(true, "syncGraph : "+graphName);

            var syncTarget = TP.Context().view[graphName].getType();

            if (syncTarget == 'combined')
                syncTarget = TP.Context().view[contxt.combined_foreground].getType();

            var params = {
                sid: contxt.sessionSid,
                type: 'analyse',
                graph: selection,
                target: syncTarget,
                operator: TP.Context().tabOperator["catalyst"],//contxt.catalyst_sync_operator,
                weight: contxt.substrateWeightProperty
            }

            __g__.sendQuery({
                parameters: params,
                async: false,
                success: function (data) {
                    objectReferences.UpdateViewsObject.syncGraphRequestFromData(data, selection, graphName);
                }
            });
        }


        this.syncLayouts = function (currentGraph, async) {

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
                parameters: JSON.stringify(syncLayoutParams)
            };

            __g__.sendQuery({
                parameters: params,
                async: async,
                //success: objectReferences.UpdateViewsObject.syncLayoutsFromData()
                success: function (data) {
                    objectReferences.UpdateViewsObject.syncLayoutsFromData(data, currentGraph)
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

            //console.log(u);

            var toStringify = {};
            toStringify.nodes = new Array();

            var end = nodeS.length;

            for (i = 0; i < end; i++) {
                var node = {};
                node.baseID = nodeS[i].baseID;
                toStringify.nodes.push(node);
            }
            return JSON.stringify(toStringify);
        };

        return __g__;
    }
    TP.Client = Client;
})(TP);
