//pile de gestion d'Etat

var TP = TP || {};
(function () {

    // {id:id, name:name, type:type, idSourceAssociatedView:idSourceAssociatedView, interactorList:interactorList}
    var ViewGraph = function (parameters) {
        
        //id, bouton, name, nodeColor, linkColor, backgroundColor, labelColor, nodeShape, type, idAssociation

        var __g__ = new TP.ViewTemplate(parameters);
        
        if(!('nodeColor' in parameters) || parameters.nodeColor == undefined)
            parameters.nodeColor = "steelblue"
            
        if(!('linkColor' in parameters) || parameters.linkColor == undefined)
            parameters.linkColor = "lightgrey"
            
        if (!('backgroundColor' in parameters) || parameters.backgroundColor == undefined)
            parameters.backgroundColor = "white"

        if (!('labelColor' in parameters) || parameters.labelColor == undefined)
            parameters.labelColor = "black"
            
        //todo rename viewNodes to nodeShape
        if (!('nodeShape' in parameters) || parameters.nodeShape == undefined)
            parameters.nodeShape = null
         

        __g__.nodesColor = parameters.nodeColor;
        __g__.linksColor = parameters.linkColor;
        __g__.bgColor = parameters.backgroundColor;
        __g__.labelsColor = parameters.labelColor;
        
        __g__.viewNodes = parameters.nodeShape;
        __g__.lasso = null;
        __g__.dataTranslation = null;

        __g__.selectMode = null;
        __g__.moveMode = null;
        __g__.showLabels = null;
        __g__.showLinks = null;
        __g__.nodeInformation = null;

        __g__.metric_BC = null;
        __g__.metric_SP = null;
        __g__.combined_foreground = null;
        __g__.acceptedGraph = [];
        __g__.graph = null;
		
		__g__.updateEventHandler = new TP.UpdateEventHandler("graph", __g__.ID);
		
        __g__.getGraph = function () {
            return __g__.graph;
        }

        __g__.getDataTranslation = function () {
            return __g__.dataTranslation;
        }

        __g__.setDataTranslation = function (value) {
            __g__.dataTranslation = value;
        }


        __g__.setMetric_BC = function (value) {
            __g__.metric_BC = value;
        }

        __g__.getMetric_BC = function () {
            return __g__.metric_BC;
        }

        __g__.setMetric_SP = function (value) {
            __g__.metric_SP = value;
        }

        __g__.getMetric_SP = function () {
            return __g__.metric_SP;
        }

        __g__.setLasso = function (value) {
            __g__.lasso = value;
        }

        __g__.getLasso = function (value) {
            return __g__.lasso;
        }

        __g__.getNodesColor = function () {
            return __g__.nodesColor;
        }

        __g__.setNodesColor = function (value) {
            __g__.nodesColor = value;
        }

        __g__.getLinksColor = function () {
            return __g__.linksColor;
        }

        __g__.setLinksColor = function (value) {
            __g__.linksColor = value;
        }

        __g__.getBgColor = function () {
            return __g__.bgColor;
        }

        __g__.setBgColor = function (value) {
            __g__.bgColor = value;
        }

        __g__.getLabelsColor = function () {
            return __g__.labelsColor;
        }

        __g__.setLabelsColor = function (value) {
            __g__.labelsColor = value;
        }

        __g__.getViewNodes = function () {
            return __g__.viewNodes;
        }

        __g__.getSelectMode = function () {
            return __g__.selectMode;
        }

        __g__.setSelectMode = function (value) {
            __g__.selectMode = value;
        }

        __g__.getMoveMode = function () {
            return __g__.moveMode;
        }

        __g__.setMoveMode = function (value) {
            __g__.moveMode = value;
        }

        __g__.getShowLabels = function () {
            return __g__.showLabels;
        }

        __g__.setShowLabels = function (value) {
            __g__.showLabels = value;
        }


        __g__.getShowLinks = function () {
            return __g__.showLinks;
        }

        __g__.setShowLinks = function (value) {
            __g__.showLinks = value;
        }

        __g__.getNodeInformation = function () {
            return __g__.nodeInformation;
        }

        __g__.setNodeInformation = function (value) {
            __g__.nodeInformation = value;
        }

        __g__.addView = function () {

            //controller = new TP.Controller();
            if (__g__.controller != null)
                __g__.controller.initListener(__g__.ID, "view");

            //TP.Context().setStypeEventByDefault(ID);
            __g__.interactorListTreatment();

            var elem = document.getElementById("bouton" + __g__.ID);
            if (elem) elem.parentNode.removeChild(elem);
            elem = $("div[aria-describedby='zone" + __g__.ID + "']");
            //console.log(elem)
            if (elem != [])elem.remove();


            /**************************
             * Views
             **************************/

            /****  création du dialog ****/

            __g__.createDialog();

            /****   en-tête du dialog   ****/


            /*$("<button/>", {text:"-"}).appendTo(titlebar).button().click(function() {dialog.toggle();});        */
            $("<button/>", {id: "toggle" + __g__.ID, text: "Move", style: 'right:15px'}).appendTo(__g__.titlebar);

            var minWidth = __g__.dialog.parents('.ui-dialog').find('.ui-dialog-title').width()
            __g__.dialog.parents('.ui-dialog').find('.ui-button').each(function () {
                minWidth += $(this).width()
            })
            __g__.dialog.dialog({minWidth: minWidth + 25})

            $('#toggle' + __g__.ID).button().click(function (_event) {
                var interact = $(this).button("option", "label");
                if (interact == "Move") {
                    $(this).button("option", "label", "Select");
                }
                else {
                    $(this).button("option", "label", "Move");
                }
                //TP.Context().stateStack[ID].executeCurrentState();
                TP.ObjectReferences().InterfaceObject.toggleSelectMove(__g__.ID);
            });


            $('#toggle' + __g__.ID).attr("idView", __g__.ID);

            //$("#toggle"+ID).click(function(_event){_event.type = tabTypeEvent["toggle"+ID]; $("#principalController").trigger(tabTypeEvent["toggle"+ID], [{type:_event.type, viewBase:_event.data}, _event]);})

            function add() {
                if (__g__.ID != null) {

                    if (__g__.viewNodes == null)
                        __g__.viewNodes = "rect";

                    __g__.dataTranslation = [0, 0];
                    //TP.Context().tabNodeColor[target] = nodesC;
                    //TP.Context().tabLinkColor[target] = linksC;
                    //TP.Context().tabBgColor[target] = bgC;

                    __g__.selectMode = false;
                    __g__.moveMode = true;
                    __g__.showLabels = true;
                    __g__.showLinks = true;
                    __g__.nodeInformation = true;

                    TP.Interaction().createLasso(__g__.ID);
                    //TP.Interaction().addZoom(ID);
                    TP.Interface().toggleSelectMove(__g__.ID);
                }
            }

                //TP.Context().tabSvg["svg_"+target] = d3.select("#zone" + target)
                __g__.svg = d3.select("#zone" + __g__.ID)
                    .append("svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("id", "svg"+__g__.ID)
                    .attr("idView", __g__.ID);


                //.attr("viewBox", "0 0 500 600");

                TP.Context().tabGraph["graph_" + __g__.ID] = new TP.Graph();
                __g__.graph = TP.Context().tabGraph["graph_" + __g__.ID];

                add();

                //TP.Context().tabType[target] = typeView;

                if (__g__.typeView == "combined") {
                    __g__.combined_foreground = "substrate";
                }

            

            __g__.viewInitialized = 1;

            __g__.graphDrawing = new TP.GraphDrawing(__g__.graph, __g__.svg, __g__.ID);

        }

        __g__.remove = function () {

            __g__.removeViewTemplate();

            __g__.nodesColor = null;
            __g__.linksColor = null;
            __g__.bgColor = null;
            __g__.labelsColor = null;
            __g__.viewNodes = null;
            __g__.lasso = null;
            __g__.dataTranslation = null;

            __g__.selectMode = null;
            __g__.moveMode = null;
            __g__.showLabels = null;
            __g__.showLinks = null;
            __g__.nodeInformation = null;

            __g__.metric_BC = null;
            __g__.metric_SP = null;
            __g__.combined_foreground = null;
            __g__.acceptedGraph = null;
            __g__.graph = null;
        }


	__g__.modifUpdate = function()
	{
		assert(true, "je suis la vue Graph : "+__g__.ID)
	}


        __g__.initStates = function () {

            __g__.controller.addState({name: "zoneApparu", bindings: ["nodeSelected", "selectionVide", "arrangeLabels"], func: function (_event) {/*assert(true, "zoneApparu");*/
                TP.Interaction().checkIntersect(_event);
            }});
            __g__.controller.addState({name: "nodeSelected", bindings: ["mousemoveLasso", "mousemoveMouseDown", "mouseupMouseDown", "mouseoverMouseDown"], func: function (_event) {/*assert(true, "nodeSelected");*/
                TP.Interaction().nodeSelected(_event);
            }});
            __g__.controller.addState({name: "selectionVide", bindings: ["mousemoveLasso", "mousemoveMouseDown", "mouseupMouseDown", "sizeMapping"], func: function (_event) {/*assert(true, "selectionVide");*/
                TP.Interaction().emptyListAction(_event);
            }});

            __g__.controller.addState({name: "mouseupLasso", bindings: ["zoneApparu", "mousedownLasso", "mousemoveLasso"], func: function (_event) {/*assert(true, "mouseupLasso");*/
                __g__.controller.disableState("mouseupLasso");
                _event.associatedData.myL.canMouseUp(_event.associatedData.mouse);
            }});
            __g__.controller.addState({name: "mousedownLasso", bindings: ["mousemoveLasso", "mouseupLasso"], func: function (_event) {/*assert(true, "mousedownLasso");*/
                __g__.controller.enableState("mouseupLasso");
                _event.associatedData.myL.canMouseDown(_event.associatedData.mouse);
            }});
            __g__.controller.addState({name: "mousemoveLasso", bindings: ["mousemoveMouseDown", "mouseupMouseDown", "mousemoveLasso", "mousedownLasso", "mouseoverMouseDown"], func: function (_event) {/*assert(true, "mousemoveLasso");*/
                _event.associatedData.myL.canMouseMove(_event.associatedData.mouse);
            }});

            __g__.controller.addState({name: "mouseoverMouseDown", bindings: ["mousedownMouseDown", "mousemoveLasso", "mousemoveMouseDown"], func: function (_event) {
                if (!__g__.controller.isActivate("mouseupLasso")) {
                    /*assert(true, "mouseoverMouseDown");*/
                    __g__.controller.disableState("mousemoveLasso");
                    TP.Lasso().mouseoverMouseDown(_event);
                }
            }});

            __g__.controller.addState({name: "mouseoutMouseDown", bindings: ["mousemoveLasso"], func: function (_event) {/*assert(true, "mouseoutMouseDown");*/
                __g__.controller.enableState("mousemoveLasso");
                TP.Lasso().mouseoutMouseDown(_event);
            }});
            __g__.controller.addState({name: "mousedownMouseDown", bindings: ["mousemoveMouseDown"], func: function (_event) {/*assert(true, "mousedownMouseDown");*/
                TP.Lasso().mousedownMouseDown(_event);
            }});
            __g__.controller.addState({name: "mousemoveMouseDown", bindings: ["mousemoveMouseDown", "mouseoutMouseDown", "mousedownMouseDown", "mouseupMouseDown", "zoneApparu", "mousemoveLasso"], func: function (_event) {/*assert(true, "mousemoveMouseDown");*/
                TP.Lasso().mousemoveMouseDown(_event);
            }});

            __g__.controller.addState({name: "arrangeLabels", bindings: ["mouseoverMouseDown", "mousemoveLasso", "mousemoveMouseDown", "mousedownMouseDown", "mouseupMouseDown", "sizeMapping"], func: function (_event) {/*assert(true, "arrangeLabels"); */
                TP.Visualization().arrangeLabels(_event);
            }}, "all");

            __g__.controller.addState({name: "mouseupMouseDown", bindings: ["mouseupLasso", "mousedownMouseDown", "mousemoveMouseDown", "mouseoutMouseDown"], func: function (_event) {/*assert(true, "mouseupMouseDown");*/
                TP.Lasso().mouseupMouseDown(_event);
            }});


            __g__.controller.addState({name: "move", bindings: ["movingZoomDrag"], func: function (_event) {/*assert(true, "move");*/
                TP.Interaction().removeLasso(_event);
                TP.Interaction().addZoom(_event)
            }}, "all");
            __g__.controller.addState({name: "select", bindings: ["mousemoveLasso"], func: function (_event) {/*assert(true, "select");*/
                TP.Interaction().addLasso(_event);
                TP.Interaction().removeZoom(_event)
            }}, "all");

            __g__.controller.addState({name: "movingZoomDrag", bindings: ["movingZoomDragEnd", "movingZoomDrag"], func: function (_event) {/*assert(true, "movingZoomDrag");*/
                TP.Interaction().movingZoomDrag(_event);
            }});
            __g__.controller.addState({name: "movingZoomDragEnd", bindings: ["movingZoomDrag"], func: function (_event) {/*assert(true, "movingZoomDragEnd"); */
                TP.Interaction().movingZoomDragEnd(_event);
            }});


            __g__.controller.addState({name: "callLayout", bindings: null, func: function (_event) {/*assert(true, "callLayout");*/
                TP.Client().callLayout(_event);
            }}, "all", true);
            __g__.controller.addState({name: "AnswerCallLayout", bindings: null, func: function (_event) {/*assert(true, "AnswerCallLayout"); */
                TP.Client().AnswerCallLayout(_event);
            }}, "all", true);

            __g__.controller.addState({name: "sendSelection", bindings: null, func: function (_event) {/*assert(true, "sendSelection");*/
                TP.Client().sendSelection(_event);
            }}, "all", true);
            __g__.controller.addState({name: "answerSendSelection", bindings: null, func: function (_event) {/*assert(true, "answerSendSelection");*/
                TP.Client().answerSendSelection(_event);
            }}, "all", true);

            __g__.controller.addState({name: "resetView", bindings: null, func: function (_event) {/*assert(true, "resetView");*/
                TP.Visualization().resetView(_event);
            }}, "all", true);

            __g__.controller.addState({name: "callFloatAlgorithm", bindings: null, func: function (_event) {/*assert(true, "callFloatAlgorithm");*/
                TP.Client().callFloatAlgorithm(_event);
            }}, "all", true);
            __g__.controller.addState({name: "AnswerFloatAlgorithm", bindings: null, func: function (_event) {/*assert(true, "AnswerFloatAlgorithm");*/
                TP.Client().AnswerFloatAlgorithm(_event);
            }}, "all", true);

            __g__.controller.addState({name: "analyseGraph", bindings: ["all"], func: function (_event) {/*assert(true, "analyseGraph");*/
                TP.Client().analyseGraph(_event);
            }}, "all");
            __g__.controller.addState({name: "answerAnalyseGraph", bindings: ["all"], func: function (_event) {/*assert(true, "answerAnalyseGraph");*/
                TP.Client().answerAnalyseGraph(_event);
            }}, "all");

            __g__.controller.addState({name: "resetSize", bindings: null, func: function (_event) {/*assert(true, "resetSize");*/
                TP.Visualization().resetSize(_event);
            }}, "all", true);

            __g__.controller.addState({name: "Hide labels", bindings: null, func: function (_event) {/*assert(true, "Hide labels");*/
                TP.Visualization().showhideLabels(_event);
            }}, "all", true);
            __g__.controller.addState({name: "Hide links", bindings: null, func: function (_event) {/*assert(true, "Hide links");*/
                TP.Visualization().showhideLinks(_event);
            }}, "all", true);

            __g__.controller.addState({name: "rotateGraph", bindings: null, func: function (_event) {/*assert(true, "rotateGraph");*/
                TP.Visualization().rotateGraph(_event);
            }}, "all", true);

            __g__.controller.addState({name: "drawBarChart", bindings: null, func: function (_event) {/*assert(true, "drawBarChart");*/
                TP.BarChart().drawBarChart(_event);
            }}, "all", true);
            __g__.controller.addState({name: "drawScatterPlot", bindings: null, func: function (_event) {/*assert(true, "drawScatterPlot");*/
                TP.ScatterPlot().drawScatterPlot(_event);
            }}, "all", true);

            __g__.controller.addState({name: "drawScatterPlotNVD3", bindings: null, func: function (_event) {/*assert(true, "drawScatterPlot");*/
                //this.nvd3 = new TP.ViewNVD3(_event);
                //this.nvd3.setGraph(__g__.graph)
                TP.ViewNVD3().drawScatterPlot(_event);
            }}, "all", true);

            __g__.controller.addState({name: "runZoom", bindings: null, func: function (_event) {/*assert(true, "runZoom");*/
                TP.Interaction().runZoom(_event);
            }}, "all", true);
            __g__.controller.addState({name: "sizeMapping", bindings: null, func: function (_event) {/*assert(true, "sizeMapping");*/
                TP.Visualization().sizeMapping(_event);
            }}, "all", true);

            __g__.controller.addState({name: "dragNode", bindings: null, func: function (_event) {/*assert(true, "dragNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().dragNode(_event);
            }}, "all", true);

            __g__.controller.addState({name: "showHideLabelNode", bindings: null, func: function (_event) {/*assert(true, "showHideLabelNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().showHideLabelNode(_event);
            }}, "all", true);

            __g__.controller.addState({name: "mouseoverShowLabelNode", bindings: null, func: function (_event) {/*assert(true, "mouseoverShowLabelNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().showLabelNode(_event);
            }}, "all", true);

            __g__.controller.addState({name: "mouseOutNode", bindings: null, func: function (_event) {/*assert(true, "mouseOutNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().mouseOutNode();
            }}, "all", true);

            __g__.controller.addState({name: "brushstart", bindings: null, func: function (_event) {/*assert(true, "brushstart");*/
                TP.Interaction().brushstart(_event);
            }}, "all", true);

			__g__.controller.addState({name : "updateOtherView", bindings : null, func:function(_event){
				console.log("avant otherViews : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type); __g__.updateOtherViews(_event);
			}}, "all", true)		
			
			__g__.controller.addState({name : "updateView", bindings : null, func:function(_event){
				console.log("avant updateViewGraph : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type); __g__.updateEventHandler.treatUpdateEvent(_event); __g__.updateOtherViews(_event);
			}}, "all", true)

            //__g__.controller.addState({name:"mousedownResizeGroup", bindings:null, func:function(event){assert(true, "mousedownResizeGroup"); TP.Lasso().mousedownResizeGroup(event);}}, "all", true);
            //__g__.controller.addState({name:"mouseupResizeGroup", bindings:null, func:function(event){assert(true, "mouseupResizeGroup"); TP.Lasso().mouseupResizeGroup(event);}}, "all", true);
            __g__.controller.setCurrentState("select");

        }

        return __g__;
    }

    TP.ViewGraph = ViewGraph;
})(TP);