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
		
		var arrayDF  = {}
		var arrayFile = []
		var currentDF = null

        // Loads the data from a json file, if no JSON is passed, then we load
        // the default JSON stored in 'contxt.json_address', otherwise it loads
        // the given json file.
        // It is first formatted correctly, locally, then sent to tulip to be 
        //initialized (so it is modified again), and analyzed.
        this.loadData = function (json, target,okCSV) {
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
            	console.log('rrrriiekkfm')
            	if (okCSV) {
            		console.log('ok tas capte cest un csv')
            		var data2 = JSON.stringify(json)
            		var data3 = JSON.parse(data2)
            		var data4 = $.parseJSON(data3)
            		console.log('data4', typeof(data4), data4)
            		currentDF = data4
					dataDF = data4['df']
					dataColumns = data4['columns']
					console.log('data Columns    '+ data4['columns'])
					dataName = data4['name']
					dataSize = data4['size']
					this.createGraphFromCSV(data4,target, 'start', {});
        			objectReferences.ViewImportObject.redirectFromLoad(data4)
            		
            	}
            	else {
            		
                	data = $.parseJSON(json)
                	objectReferences.ToolObject.addBaseID(data, "id")
                	json = JSON.stringify(data)

                	objectReferences.ToolObject.loadJSON(data, target)
                	//console.log("I am creating the graph in Tulip")
                	//console.log(data);
                	this.createTulipGraph(json, target)
               	}
                //console.log("I should now analyse the graph",contxt.sessionSid)
                //this.analyseGraph(target)

                //console.log("graph analysed", contxt.sessionSid)
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
        }
        
        
        this.createGraphFromCSV = function(data,target, option, parameters) {
        	
        	var opl = document.getElementById('nodesVroo').checked
        	
        	if (opl) {
        		opl = 'linked'
        	}
        	else {
        		opl = 'no linked'
        	}
        	
        	nameCSV = data['name']
        	console.log('violet gorge')
        	if (option == 'start') {
        		console.log('rouge gorge')
        		var params = {
        			type: 'adjustDraw',
        			//coefficient: coef,
        			name: nameCSV,
        			option: 'start', 
        			node: 'default',
        			optPart: opl,
        			label: 'default'
        			
        		}
        	}
        	else if (option == 'coefficient') {
        		console.log('les jolies colonies de travail')
        		var lab = document.getElementById('nodes').options[document.getElementById('nodes').selectedIndex].value
        		var coef = document.getElementById('borneCoef').value
        		var params = {
        			type: 'adjustDraw',
        			coefficient: coef,
        			name: nameCSV,
        			option: 'coefficient', 
        			node: 'default',
        			optPart: opl,
        			label: lab
        			
        		}
        	}
        	else if (option  == 'equat') {
        		var equa = document.getElementById('equaTXT').value
        		var lab = document.getElementById('nodes').options[document.getElementById('nodes').selectedIndex].value
        		console.log('equat'+equa)
        		var params = {
        			type: 'adjustDraw', 
        			name: nameCSV, 
        			option: 'equat',
        			equation: equa,
        			node: 'default',
        			optPart: opl,
        			label: lab
        		}
        		
        	}
        	else if(option == 'jacquard') {
        		var coefLeft = document.getElementById('borneLeft').value
        		var coefRight = document.getElementById('borneRight').value
        		var lab = document.getElementById('nodes').options[document.getElementById('nodes').selectedIndex].value
        		
        		var params = {
        			type: 'adjustDraw', 
        			name: nameCSV, 
        			option: 'jacquard',
        			borneLeft: coefLeft,
        			borneRight: coefRight,
        			node: 'default',
        			optPart: opl,
        			label: lab
        		}
        		
        	}
        		__g__.sendQuery({
        			parameters: params,
        			async: false,
        			success: function(data) {
        				console.log(data)
        				var target =0;
                		objectReferences.ToolObject.addBaseID(data, "id")
                		json = JSON.stringify(data)
						console.log('rrtrrrr')
                		objectReferences.ToolObject.loadJSON(data, target)
                		//console.log("I am creating the graph in Tulip")
                		console.log('dara')
                		console.log(data);
                	
                		TP.Client().createTulipGraph(json, target);
        			}
        		})
        	
        	
        }
		
		this.handleVersionBases = function(name, kWord) {
			if (kWord == 'prec') {
				var params = {
					type: 'adjust',
					operation: 'prec',
					name: dataName
				}
			}
			else if (kWord == 'suiv') {
				var params = {
					type: 'adjust',
					operation: 'suiv',
					name: dataName
				}
			}
			
			__g__.sendQuery({
                parameters: params,
                async: false,
                success: function (data) {
                	console.log('bla bla bla bla')
                	var target = 0
                    console.log(data)
            		objectReferences.ViewImportObject.updateSelectedBase(data) 
            		TP.Client().createGraphFromCSV(data,target, 'start', {})   
                }
            });
			
		}
		

		this.updateNewBase = function(dataName, kWord) {
			console.log('dataName:  ' , dataName)
			console.log('kWord:   ', kWord)
			
			if (kWord == 'edit') {
				expr = document.getElementById('txt').value
				var params = {
					type: 'adjust',
					operation: 'edit',
					expression: expr,
					name: dataName
				}
			}
			else if (kWord == 'subsetLines') {
				firstVal = document.getElementById('firstLine').value
				secondVal = document.getElementById('secondLine').value
				var params = {
					type: 'adjust',
					operation: 'subLines',
					firstLine: firstVal,
					secondLine: secondVal,
					name: dataName
				}
			}
			else if (kWord == 'choiceDrop') {
				name2 = document.getElementById('choiceDrop').options[document.getElementById('choiceDrop').selectedIndex].value
				var params = {
					type: 'adjust',
					operation: 'choiceDrop',
					name: dataName,
					nameColumn: name2
				}
			}
			else if (kWord == 'choiceColumn') {
				txt = document.getElementById('choiceCol').value
				var params = {
					type: 'adjust', 
					operation: 'choiceColumn',
					text: txt,
					name: dataName
				}
			}
			else if (kWord == 'keepSpeValues') {
				operator = document.getElementById('choiceOp').options[document.getElementById('choiceOp').selectedIndex].value
				column = document.getElementById('choiceC').options[document.getElementById('choiceC').selectedIndex].value
				mode =  document.getElementById('choiceMode').options[document.getElementById('choiceMode').selectedIndex].value
				txt = document.getElementById('valEnr').value
				
				var params = {
					type: 'adjust', 
					operation: 'keepSpeValues',
					text: txt,
					mode: mode,
					column: column,
					operator: operator,
					name: name
				}
			}
			
            __g__.sendQuery({
                parameters: params,
                async: false,
                success: function (data) {
                	console.log('bla bla bla bla')
                    console.log(data)
                    var target = 0
            		objectReferences.ViewImportObject.updateSelectedBase(data)
            		TP.Client().createGraphFromCSV(data,target, 'start', {})  
                }
            });
			
		}
		
		
		this.exportCSV = function(dataName, pat) {
			var params = {
				type: 'exportCSV',
				name: dataName,
				path: pat
			}
			
			__g__.sendQuery({
                parameters: params,
                async: false,
                success: function (data) {
                	console.log('bla bla bla bla')
                    console.log(data)
            		//objectReferences.ViewImportObject.updateSelectedBase(data)  
                }
            });
			
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
        	console.log('on est ds createTulipGraph')
            var params = {
                type: "creation",
                graph: json
            }
            __g__.sendQuery({
                parameters: params,
                async: false,
                //success: objectReferences.UpdateViewsObject.buildGraphFromData
                success: function (data) {
                	console.log('ona passe createTulipGraph')
                    objectReferences.UpdateViewsObject.buildGraphFromData(data, target)
                }
            });
        }


        // This function calls through tulip the analysis of a substrate graph, 
        // stores and displays it in the catalyst view, updating the new 
        // entanglement indices computed.
        this.analyseGraph = function (_event) {

            var idViewSource = _event.associatedData.source;
            var viewGraphCatalystParameters = _event.associatedData.viewGraphCatalystParameters

            if (TP.Context().view[idViewSource].getType() !== "substrate") {
                assert(false, "not substrate type");
                return;
            }


            if (TP.Context().view[idViewSource].getAssociatedView("catalyst") == null && Object.keys(viewGraphCatalystParameters).length != null) {

                //assert(false, tabCatalyst[0])
                //assert(false, tabCatalyst[8])
                //assert(false, tabCatalyst[9])

                //console.log(tabCatalyst);

                /*
                var myView = new TP.ViewGraphCatalyst({id:tabCatalyst[0], 
                                                       name:tabCatalyst[2], 
                                                       nodeColor:tabCatalyst[3], 
                                                       linkColor:tabCatalyst[4], 
                                                       backgroundColor:tabCatalyst[5], 
                                                       labelColor:tabCatalyst[6], 
                                                       nodeShape:tabCatalyst[7], 
                                                       type:tabCatalyst[8], 
                                                       idSourceAssociatedView:idView});
                 */                              

                var myView = new TP.ViewGraphCatalyst(viewGraphCatalystParameters);


                myView.buildLinks();
                myView.addView();

            }

            //assert(true, "analyseGraph");
            var params = {
                sid: contxt.sessionSid,
                type: 'analyse',
                target: TP.Context().view[idViewSource].getType(),//idViewSource,//'substrate',
                weight: contxt.substrateWeightProperty
            }


            //assert(false, "idView : " + idView);
            //console.log(TP.Context().view[idView]);
            //console.log(TP.Context().view[idView].getController());

            TP.Context().view[idViewSource].getController().sendMessage("analyseGraphSendQuery", {params: params}, "principal");

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
                target: TP.Context().view[idView].getType()
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
                   //assert(true, "Grabbed algorithms:")
                   // console.log(data)
                    endHandler.call(TP.Context(), data)
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
                target: TP.Context().view[graphName].getType(),
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
                target: TP.Context().view[idView].getType()
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'algorithm',
                parameters: JSON.stringify(floatParams)
            }
            floatAlgorithmName, idView
            TP.Context().view[idView].getController().sendMessage("FloatAlgorithmSendQuery", {params: params, floatAlgorithmName:floatAlgorithmName}, "principal");

        }


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

        }


        this.AnswerFloatAlgorithm = function (_event) {
            var idView = _event.associatedData.target;
            var data = _event.associatedData.data;
            var floatAlgorithmName = _event.associatedData.floatAlgorithmName;

            objectReferences.UpdateViewsObject.applyFloatAlgorithmFromData(data, idView, floatAlgorithmName);
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
                operator: TP.Context().tabOperator[graphName],//contxt.catalyst_sync_operator,
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
