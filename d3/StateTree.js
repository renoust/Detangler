
//pile de gestion d'Etat

(function () {
	
	import_class('Interaction.js', 'TP')
	import_class('assert.js', 'TP')
	import_class("Client.js", "TP")
	import_class("lasso.js", 'TP')
	
	var StateTree = function(){

		var __g__ = this;
		
		var hashTabNode = null; 
		var rootP = {};
		
		__g__.getStateTree = function()
		{
			return hashTabNode;
		}
		
		__g__.getRoot = function()
		{
			return rootP;
		}
		
		__g__.getInfoState = function(name)
		{
			return hashTabNode[name];
		}
		
		__g__.enableState = function(state)
		{
			hashTabNode[state].activate = true;
		}

		__g__.disableState = function(state)
		{
			hashTabNode[state].activate = false;
		}
		
		__g__.initStateTree = function(typeController)
		{
			hashTabNode = new Object();
			//hashTabNode["select"] = {name:"select", root:{}, bindings:{}, func:TP.Interaction().addLasso}
			//rootP = hashTabNode["select"];
			if(typeController == "view")
			{
				assert(true, "type of controller : view");
					
				__g__.addState({name:"select", bindings: ["mousemoveLasso"], func:function(event){/*assert(true, "select");*/ TP.Interaction().addLasso(event); TP.Interaction().removeZoom(event) }}, "all");
				__g__.addState({name:"zoneApparu", bindings: ["nodeSelected","selectionVide","arrangeLabels"], func:function(event){/*assert(true, "zoneApparu");*/ TP.Interaction().checkIntersect(event);}});
				__g__.addState({name:"nodeSelected", bindings: ["mousemoveLasso", "mousemoveMouseDown", "mouseupMouseDown", "mouseoverMouseDown"], func:function(event){/*assert(true, "nodeSelected");*/ TP.Interaction().nodeSelected(event);}});
				__g__.addState({name:"selectionVide", bindings : ["mousemoveLasso", "mousemoveMouseDown", "mouseupMouseDown", "sizeMapping"], func:function(event){/*assert(true, "selectionVide");*/ TP.Interaction().emptyListAction(event);}});
						
				__g__.addState({name:"mouseupLasso", bindings:["zoneApparu", "mousedownLasso", "mousemoveLasso"], func:function(event){/*assert(true, "mouseupLasso");*/ __g__.disableState("mouseupLasso"); event.associatedData.myL.canMouseUp(event.associatedData.mouse);}});
				__g__.addState({name:"mousedownLasso", bindings:["mousemoveLasso", "mouseupLasso"], func:function(event){/*assert(true, "mousedownLasso");*/  __g__.enableState("mouseupLasso"); event.associatedData.myL.canMouseDown(event.associatedData.mouse);}});
				__g__.addState({name:"mousemoveLasso", bindings: ["mouseupMouseDown", "mousemoveLasso", "mousedownLasso", "mouseoverMouseDown"], func:function(event){/*assert(true, "mousemoveLasso");*/ event.associatedData.myL.canMouseMove(event.associatedData.mouse);}});
				
				__g__.addState({name:"mouseoverMouseDown", bindings:["mousedownMouseDown", "mousemoveLasso", "mousemoveMouseDown"], func:function(event){
						if(hashTabNode["mouseupLasso"].activate == false){
							/*assert(true, "mouseoverMouseDown");*/
							__g__.disableState("mousemoveLasso");
							TP.Lasso().mouseoverMouseDown(event);
						}
				}});
						
				__g__.addState({name:"mouseoutMouseDown", bindings:["mousemoveLasso"], func:function(event){/*assert(true, "mouseoutMouseDown");*/ __g__.enableState("mousemoveLasso"); TP.Lasso().mouseoutMouseDown(event);}});
				__g__.addState({name:"mousedownMouseDown", bindings:["mousemoveMouseDown"], func:function(event){/*assert(true, "mousedownMouseDown");*/ TP.Lasso().mousedownMouseDown(event);}});
				__g__.addState({name:"mousemoveMouseDown", bindings:["mousemoveMouseDown","mouseoutMouseDown","mousedownMouseDown","mouseupMouseDown", "zoneApparu", "mousemoveLasso"], func:function(event){/*assert(true, "mousemoveMouseDown");*/ TP.Lasso().mousemoveMouseDown(event);}});
				
				__g__.addState({name:"arrangeLabels", bindings:["mousemoveLasso", "mousemoveMouseDown", "mousedownMouseDown", "mouseupMouseDown", "sizeMapping"], func:function(event){/*assert(true, "arrangeLabels"); */TP.Visualization().arrangeLabels(event);}}, "all");
				
				__g__.addState({name:"mouseupMouseDown", bindings:["mouseupLasso", "mousedownMouseDown", "mousemoveMouseDown", "mouseoutMouseDown"], func:function(event){/*assert(true, "mouseupMouseDown");*/ TP.Lasso().mouseupMouseDown(event);}});
						
				
				__g__.addState({name:"move", bindings: ["movingZoomDrag"], func:function(event){assert(true, "move"); TP.Interaction().removeLasso(event); TP.Interaction().addZoom(event) }}, "all");				
				
				__g__.addState({name:"movingZoomDrag", bindings:["movingZoomDragEnd", "movingZoomDrag"], func:function(event){assert(true, "movingZoomDrag"); TP.Interaction().movingZoomDrag(event);}});
				__g__.addState({name:"movingZoomDragEnd", bindings:["movingZoomDrag"], func:function(event){assert(true, "movingZoomDragEnd"); TP.Interaction().movingZoomDragEnd(event);}});				
				
						
				__g__.addState({name:"callLayout", bindings:null, func:function(event){assert(true, "callLayout"); TP.Client().callLayout(event);}}, "all", true);	
				__g__.addState({name:"AnswerCallLayout", bindings:null, func:function(event){assert(true, "AnswerCallLayout"); TP.Client().AnswerCallLayout(event);}}, "all", true);
				
				__g__.addState({name:"sendSelection", bindings:null, func:function(event){assert(true, "sendSelection"); TP.Client().sendSelection(event);}}, "all", true);
				__g__.addState({name:"answerSendSelection", bindings:null, func:function(event){assert(true, "answerSendSelection"); TP.Client().answerSendSelection(event);}}, "all", true);
				
				__g__.addState({name:"resetView", bindings:null, func:function(event){assert(true, "resetView"); TP.Visualization().resetView(event);}}, "all", true);
				
				__g__.addState({name:"callFloatAlgorithm", bindings:null, func:function(event){assert(true, "callFloatAlgorithm"); TP.Client().callFloatAlgorithm(event);}}, "all", true);
				__g__.addState({name:"AnswerFloatAlgorithm", bindings:null, func:function(event){assert(true, "AnswerFloatAlgorithm"); TP.Client().AnswerFloatAlgorithm(event);}}, "all", true);
				
				__g__.addState({name:"analyseGraph", bindings:["all"], func:function(event){assert(true, "analyseGraph"); TP.Client().analyseGraph(event);}}, "all");
				__g__.addState({name:"answerAnalyseGraph", bindings:["all"], func:function(event){assert(true, "answerAnalyseGraph"); TP.Client().answerAnalyseGraph(event);}}, "all");
				
				__g__.addState({name:"resetSize", bindings:null, func:function(event){assert(true, "resetSize"); TP.Visualization().resetSize(event);}}, "all", true);
				
				__g__.addState({name:"Hide labels", bindings:null, func:function(event){assert(true, "Hide labels"); TP.Visualization().showhideLabels(event);}}, "all");
				__g__.addState({name:"Hide links", bindings:null, func:function(event){assert(true, "Hide links"); TP.Visualization().showhideLinks(event);}}, "all");

				__g__.addState({name:"rotateGraph", bindings:null, func:function(event){assert(true, "rotateGraph"); TP.Visualization().rotateGraph(event);}}, "all");
				
				__g__.addState({name:"drawBarChart", bindings:null, func:function(event){assert(true, "drawBarChart"); TP.Visualization().drawBarChart(event);}}, "all", true);
				__g__.addState({name:"drawScatterPlot", bindings:null, func:function(event){assert(true, "drawScatterPlot"); TP.Visualization().drawScatterPlot(event);}}, "all", true);
				
				__g__.addState({name:"runZoom", bindings:null, func:function(event){assert(true, "runZoom"); TP.Interaction().runZoom(event);}}, "all", true);
				__g__.addState({name:"sizeMapping", bindings:null, func:function(event){assert(true, "sizeMapping"); TP.Visualization().sizeMapping(event);}}, "all", true);				
				
				__g__.addState({name:"dragNode", bindings:null, func:function(event){assert(true, "dragNode"); TP.Context().view[event.associatedData.source].getGraphDrawing().dragNode(event);}}, "all", true);
				
				__g__.addState({name:"showHideLabelNode", bindings:null, func:function(event){assert(true, "showHideLabelNode"); TP.Context().view[event.associatedData.source].getGraphDrawing().showHideLabelNode(event);}}, "all", true);
				
				__g__.addState({name:"mouseoverShowLabelNode", bindings:null, func:function(event){assert(true, "mouseoverShowLabelNode"); TP.Context().view[event.associatedData.source].getGraphDrawing().showLabelNode(event);}}, "all", true);
				
				__g__.addState({name:"mouseOutNode", bindings:null, func:function(event){assert(true, "mouseOutNode"); TP.Context().view[event.associatedData.source].getGraphDrawing().mouseOutNode();}}, "all", true);
				
				__g__.addState({name:"brushstart", bindings:null, func:function(event){assert(true, "brushstart"); TP.Interaction().brushstart(event);}}, "all", true);
				
				//__g__.addState({name:"mousedownResizeGroup", bindings:null, func:function(event){assert(true, "mousedownResizeGroup"); TP.Lasso().mousedownResizeGroup(event);}}, "all", true);
				//__g__.addState({name:"mouseupResizeGroup", bindings:null, func:function(event){assert(true, "mouseupResizeGroup"); TP.Lasso().mouseupResizeGroup(event);}}, "all", true);

				__g__.addState({name:"mouseoverBarChartRect", bindings:null, func:function(event){assert(true, "mouseoverBarChartRect"); TP.Visualization().mouseoverBarChartRect(event);}}, "all", true);			
				__g__.addState({name:"mouseoutBarChartRect", bindings:null, func:function(event){assert(true, "mouseoutBarChartRect"); TP.Visualization().mouseoutBarChartRect(event);}}, "all", true);
				__g__.addState({name:"mouseclickBarChartRect", bindings:null, func:function(event){assert(true, "mouseclickBarChartRect"); TP.Visualization().mouseclickBarChartRect(event);}}, "all", true);
				
				__g__.addState({name:"mouseoverScatterPlot", bindings:null, func:function(event){assert(true, "mouseoverScatterPlot"); TP.Visualization().mouseoverScatterPlot(event);}}, "all", true);				
				__g__.addState({name:"mouseoutScatterPlot", bindings:null, func:function(event){assert(true, "mouseoutScatterPlot"); TP.Visualization().mouseoutScatterPlot(event);}}, "all", true);
				__g__.addState({name:"mouseclickScatterPlot", bindings:null, func:function(event){assert(true, "mouseclickScatterPlot"); TP.Visualization().mouseclickScatterPlot(event);}}, "all", true);
				
				__g__.addState({name:"zoomScatterPlot", bindings:null, func:function(event){assert(true, "zoomScatterPlot"); TP.Visualization().zoomScatterPlot(event);}}, "all", true);
				
				
				rootP = hashTabNode["select"];
				
			}else if(typeController == "principal")
			{	
				assert(true, "type of controller principal");
				
				__g__.addState({name:"toto", bindings:null, func:function(event){assert(true, "toto"); console.log(event);}});
				
				__g__.addState({name:"callLayoutSendQuery", bindings:null, func:function(event){assert(true, "callLayoutSendQuery"); TP.Client().callLayoutSendQuery(event);}}, "all");				
				__g__.addState({name:"selectionSendQuery", bindings:null, func:function(event){assert(true, "selectionSendQuery"); TP.Client().selectionSendQuery(event);}}, "all");
				__g__.addState({name:"FloatAlgorithmSendQuery", bindings:null, func:function(event){assert(true, "FloatAlgorithmSendQuery"); TP.Client().FloatAlgorithmSendQuery(event);}}, "all");
				__g__.addState({name:"analyseGraphSendQuery", bindings:null, func:function(event){assert(true, "analyseGraphSendQuery"); TP.Client().analyseGraphSendQuery(event);}}, "all");
				__g__.addState({name:"mouseoverInfoBox", bindings:null, func:function(event){assert(true, "mouseoverInfoBox"); TP.Interface().addInfoBox(event);}},"all");
			}
			else
				assert(false, "type of controller isn't supported");
			
			
		}
		
		__g__.addState = function(node, nodeRoot, useless, activate) // nodeRoot is present for special root like "all", "principal" (message from principal controller) or "otherController" (message from
												  // other controller). useless specifies if the node must be register as currentState in State's chain or not. For example, if a state
												  //doesn't involve any changements about the current state, we don't put it in the state's chain as current State.
		{
			if(node == null || node.name == null){
				assert(false, "State are no name or there is node object default")
				return;
			}

				
			if(hashTabNode[node.name] == null){
				hashTabNode[node.name] = {name:node.name, root:{}, bindings:{}, func:null, specialRoot:false, activate:true, useless:false};
			}
				
			if(nodeRoot != null)
			{
				hashTabNode[node.name].specialRoot = true;
				hashTabNode[node.name].root = new Object(); //reinitialise hashtab if it was not empty
				hashTabNode[node.name].root[nodeRoot] = true;
			}
					
			if(useless != null)
			{
				hashTabNode[node.name].useless = useless;
			}
			
			if(activate != null)
				hashTabNode[node.name].activate = activate;
			
			var tmp = null;
			tmp = node.bindings;
			if(tmp != null){			
								
				if(Object.getPrototypeOf(node.bindings) == Object.getPrototypeOf([]))
				{			
					//tmp = node.bindings;
					
					//if(tmp != null){
						
						var end = tmp.length;
						
						for(var key = 0; key < end; key++)
						{
							if(tmp[key] != "all")
							{
								if(hashTabNode[tmp[key]] == null){
									hashTabNode[tmp[key]] = {name:tmp[key], root:{}, bindings:{}, func:null, specialRoot:false, activate:true, useless:false};
								}
								
								if(hashTabNode[node.name].bindings[tmp[key]] === undefined){
									hashTabNode[node.name].bindings[tmp[key]] = hashTabNode[tmp[key]];
									assert(true, "binding with : '"+tmp[key]+"' added")
								
								
								
									if(hashTabNode[tmp[key]].root[node.name] == undefined && hashTabNode[tmp[key]].specialRoot === false){
										hashTabNode[tmp[key]].root[node.name] = hashTabNode[node.name];
										assert(true, "root : '"+node.name+"' added to : '"+tmp[key]+"'")
									}
									else
											assert(false, "root : '"+node.name+"' already added to : '"+tmp[key]+"' or node is special node")
								}
								else
									assert(false, "warning ! binding with : '"+tmp[key]+"' already exist")
							}
							else{
								hashTabNode[node.name].bindings = new Object();
								hashTabNode[node.name].bindings[tmp[key]] = null;
								hashTabNode[node.name].specialRoot = true;
								break;
							}	
							//hashTabNode[tmp[key]].bindings[node.name] = hashTabNode[node.name];
						}
					//}
				 }
				 else
					assert(false, "'node.bindings' must be an array");
			}
				
			if(node.func != null){
				if(hashTabNode[node.name].func == null){
					hashTabNode[node.name].func = node.func;
					assert(true, "the function just been associated to the State")
				}
				else
					assert(false, "one function already associated to the State")
			}
			//}
		}
		
		
		
			
		return __g__;
    }
    return {StateTree: StateTree};
})()