
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
		
		__g__.initStateTree = function(typeController)
		{
			hashTabNode = new Object();
			//hashTabNode["select"] = {name:"select", root:{}, bindings:{}, func:TP.Interaction().addLasso}
			//rootP = hashTabNode["select"];
			if(typeController == "view")
			{
				assert(true, "type of controller : view");
					
				__g__.addState({name:"select", bindings:["zoneApparu"], func:function(event){TP.Interaction().addLasso(event);}});
				__g__.addState({name:"zoneApparu", bindings:["nodeSelected", "selectionVide"], func:function(event){TP.Interaction().checkIntersect(event);}});
				__g__.addState({name:"nodeSelected", bindings:["select"], func:function(event){TP.Interaction().nodeSelected(event);}});
				__g__.addState({name:"selectionVide", bindings:["select"], func:function(event){TP.Interaction().emptyListAction(event);}});
				
				__g__.addState({name:"callLayout", bindings:null, func:function(event){assert(true, "callLayout"); TP.Client().callLayout(event);}});	
				__g__.addState({name:"AnswerCallLayout", bindings:null, func:function(event){assert(true, "AnswerCallLayout"); TP.Client().AnswerCallLayout(event);}});
				
				__g__.addState({name:"sendSelection", bindings:null, func:function(event){assert(true, "sendSelection"); TP.Client().sendSelection(event);}});
				__g__.addState({name:"answerSendSelection", bindings:null, func:function(event){assert(true, "answerSendSelection"); TP.Client().answerSendSelection(event);}});
				
				__g__.addState({name:"resetView", bindings:null, func:function(event){assert(true, "resetView"); TP.Visualization().resetView(event);}});
				
				__g__.addState({name:"callFloatAlgorithm", bindings:null, func:function(event){assert(true, "callFloatAlgorithm"); TP.Client().callFloatAlgorithm(event);}});
				__g__.addState({name:"AnswerFloatAlgorithm", bindings:null, func:function(event){assert(true, "AnswerFloatAlgorithm"); TP.Client().AnswerFloatAlgorithm(event);}});
				
				__g__.addState({name:"analyseGraph", bindings:null, func:function(event){assert(true, "analyseGraph"); TP.Client().analyseGraph(event);}});
				__g__.addState({name:"answerAnalyseGraph", bindings:null, func:function(event){assert(true, "answerAnalyseGraph"); TP.Client().answerAnalyseGraph(event);}});
				
				__g__.addState({name:"resetSize", bindings:null, func:function(event){assert(true, "resetSize"); TP.Visualization().resetSize(event);}});
				
				__g__.addState({name:"Hide labels", bindings:null, func:function(event){assert(true, "Hide labels"); TP.Visualization().showhideLabels(event);}});
				__g__.addState({name:"Hide links", bindings:null, func:function(event){assert(true, "Hide links"); TP.Visualization().showhideLinks(event);}});
				__g__.addState({name:"arrangeLabels", bindings:null, func:function(event){assert(true, "arrangeLabels"); TP.Visualization().arrangeLabels(event);}});
				__g__.addState({name:"rotateGraph", bindings:null, func:function(event){assert(true, "rotateGraph"); TP.Visualization().rotateGraph(event);}});
				
				__g__.addState({name:"drawBarChart", bindings:null, func:function(event){assert(true, "drawBarChart"); TP.Visualization().drawBarChart(event);}});
				__g__.addState({name:"drawScatterPlot", bindings:null, func:function(event){assert(true, "drawScatterPlot"); TP.Visualization().drawScatterPlot(event);}});
				
				__g__.addState({name:"runZoom", bindings:null, func:function(event){assert(true, "runZoom"); TP.Interaction().runZoom(event);}});
				__g__.addState({name:"sizeMapping", bindings:null, func:function(event){assert(true, "sizeMapping"); TP.Visualization().sizeMapping(event);}});				
				
				__g__.addState({name:"dragNode", bindings:null, func:function(event){assert(true, "dragNode"); TP.Context().view[event.associatedData.source].getGraphDrawing().dragNode(event);}});
				
				__g__.addState({name:"showHideLabelNode", bindings:null, func:function(event){assert(true, "showHideLabelNode"); TP.Context().view[event.associatedData.source].getGraphDrawing().showHideLabelNode(event);}});
				
				__g__.addState({name:"mouseoverShowLabelNode", bindings:null, func:function(event){assert(true, "mouseoverShowLabelNode"); TP.Context().view[event.associatedData.source].getGraphDrawing().showLabelNode(event);}});
				
				__g__.addState({name:"mouseOutNode", bindings:null, func:function(event){assert(true, "mouseOutNode"); TP.Context().view[event.associatedData.source].getGraphDrawing().mouseOutNode();}});
				
				__g__.addState({name:"brushstart", bindings:null, func:function(event){assert(true, "brushstart"); TP.Interaction().brushstart(event);}});
						
				__g__.addState({name:"mouseupLasso", bindings:null, func:function(event){assert(true, "mouseupLasso"); event.associatedData.myL.canMouseUp(event.associatedData.mouse);}});
				__g__.addState({name:"mousedownLasso", bindings:null, func:function(event){assert(true, "mousedownLasso"); event.associatedData.myL.canMouseDown(event.associatedData.mouse);}});
				__g__.addState({name:"mousemoveLasso", bindings:null, func:function(event){/*assert(true, "mousemoveLasso");*/ event.associatedData.myL.canMouseMove(event.associatedData.mouse);}});
				
				__g__.addState({name:"movingZoomDrag", bindings:null, func:function(event){assert(true, "movingZoomDrag"); TP.Interaction().movingZoomDrag(event);}});
				__g__.addState({name:"movingZoomDragEnd", bindings:null, func:function(event){assert(true, "movingZoomDragEnd"); TP.Interaction().movingZoomDragEnd(event);}});
				
				__g__.addState({name:"mousedownResizeGroup", bindings:null, func:function(event){assert(true, "mousedownResizeGroup"); TP.Lasso().mousedownResizeGroup(event);}});
				__g__.addState({name:"mouseupResizeGroup", bindings:null, func:function(event){assert(true, "mouseupResizeGroup"); TP.Lasso().mouseupResizeGroup(event);}});
				
				__g__.addState({name:"mouseoverMouseDown", bindings:null, func:function(event){assert(true, "mouseoverMouseDown"); TP.Lasso().mouseoverMouseDown(event);}});
				__g__.addState({name:"mouseoutMouseDown", bindings:null, func:function(event){assert(true, "mouseoutMouseDown"); TP.Lasso().mouseoutMouseDown(event);}});
				__g__.addState({name:"mousedownMouseDown", bindings:null, func:function(event){assert(true, "mousedownMouseDown"); TP.Lasso().mousedownMouseDown(event);}});
				__g__.addState({name:"mousemoveMouseDown", bindings:null, func:function(event){/*assert(true, "mousemoveMouseDown");*/ TP.Lasso().mousemoveMouseDown(event);}});
				
				__g__.addState({name:"mouseupMouseDown", bindings:null, func:function(event){assert(true, "mouseupMouseDown"); TP.Lasso().mouseupMouseDown(event);}});

				__g__.addState({name:"mouseoverBarChartRect", bindings:null, func:function(event){assert(true, "mouseoverBarChartRect"); TP.Visualization().mouseoverBarChartRect(event);}});			
				__g__.addState({name:"mouseoutBarChartRect", bindings:null, func:function(event){assert(true, "mouseoutBarChartRect"); TP.Visualization().mouseoutBarChartRect(event);}});
				__g__.addState({name:"mouseclickBarChartRect", bindings:null, func:function(event){assert(true, "mouseclickBarChartRect"); TP.Visualization().mouseclickBarChartRect(event);}});
				
				__g__.addState({name:"mouseoverScatterPlot", bindings:null, func:function(event){assert(true, "mouseoverScatterPlot"); TP.Visualization().mouseoverScatterPlot(event);}});				
				__g__.addState({name:"mouseoutScatterPlot", bindings:null, func:function(event){assert(true, "mouseoutScatterPlot"); TP.Visualization().mouseoutScatterPlot(event);}});
				__g__.addState({name:"mouseclickScatterPlot", bindings:null, func:function(event){assert(true, "mouseclickScatterPlot"); TP.Visualization().mouseclickScatterPlot(event);}});
				
				__g__.addState({name:"zoomScatterPlot", bindings:null, func:function(event){assert(true, "zoomScatterPlot"); TP.Visualization().zoomScatterPlot(event);}});
				
				
				rootP = hashTabNode["select"];
				
			}else if(typeController == "principal")
			{	
				assert(true, "type of controller principal");
				
				__g__.addState({name:"toto", bindings:null, func:function(event){assert(true, "toto"); console.log(event);}});
				
				__g__.addState({name:"callLayoutSendQuery", bindings:null, func:function(event){assert(true, "callLayoutSendQuery"); TP.Client().callLayoutSendQuery(event);}});				
				__g__.addState({name:"selectionSendQuery", bindings:null, func:function(event){assert(true, "selectionSendQuery"); TP.Client().selectionSendQuery(event);}});
				__g__.addState({name:"FloatAlgorithmSendQuery", bindings:null, func:function(event){assert(true, "FloatAlgorithmSendQuery"); TP.Client().FloatAlgorithmSendQuery(event);}});
				__g__.addState({name:"analyseGraphSendQuery", bindings:null, func:function(event){assert(true, "analyseGraphSendQuery"); TP.Client().analyseGraphSendQuery(event);}});
				__g__.addState({name:"mouseoverInfoBox", bindings:null, func:function(event){assert(true, "mouseoverInfoBox"); TP.Interface().addInfoBox(event);}});
			}
			else
				assert(false, "type of controller isn't supported");
			
			
		}
		
		__g__.addState = function(node)
		{
			if(node == null || node.name == null){
				assert(false, "State are no name or there is node object default")
				return;
			}

				
			if(hashTabNode[node.name] == null)
				hashTabNode[node.name] = {name:node.name, root:{}, bindings:{}, func:null};				
			
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
							if(hashTabNode[tmp[key]] == null){
								hashTabNode[tmp[key]] = {name:tmp[key], root:{}, bindings:{}, func:null};
							}
								
							if(hashTabNode[node.name].bindings[tmp[key]] === undefined){
								hashTabNode[node.name].bindings[tmp[key]] = hashTabNode[tmp[key]];
								assert(true, "binding with : '"+tmp[key]+"' added")
								
								if(hashTabNode[tmp[key]].root[node.name] == undefined){
									hashTabNode[tmp[key]].root[node.name] = hashTabNode[node.name];
									assert(true, "root : '"+node.name+"' added to : '"+tmp[key]+"'")
								}
								else
										assert(false, "root : '"+node.name+"' already added to : '"+tmp[key]+"'")
							}
							else
								assert(false, "warning ! binding with : '"+tmp[key]+"' already exist")
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