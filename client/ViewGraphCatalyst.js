//pile de gestion d'Etat

var TP = TP || {};
(function () {

    // {id:id, name:name, type:type, idSourceAssociatedView:idSourceAssociatedView, interactorList:interactorList}
    var ViewGraphCatalyst = function (parameters) {
        
        //id, bouton, name, nodeColor, linkColor, backgroundColor, labelColor, nodeShape, type, idAssociation
        var __g__ = this;
        
        
        var paramSizeMap = [
            [4, {id:"sizemap"},{
                    range: true,
                    min: 0,
                    max: 99,
                    values: [ 3, 12 ],
                    change: function() {
                        var value = $("#sizemap").slider("values",0);
                        var value2 = $("#sizemap").slider("values",1);
                        $("#sizemap").find(".ui-slider-handle").eq(0).text(value);
                        $("#sizemap").find(".ui-slider-handle").eq(1).text(value2);
                    },
                    slide: function() {
                        var value = $("#sizemap").slider("values",0);
                        var value2 = $("#sizemap").slider("values",1);
                        $("#sizemap").find(".ui-slider-handle").eq(0).text(value);
                        $("#sizemap").find(".ui-slider-handle").eq(1).text(value2);
                    }
                },
                "scale: "
            ]
        ];
    
        var tl = [
            [3,{id:"selectedAlgo"}]
        ];
    
        var colorSettings = [
            [1,{id:"color"},[
                {id:"cnodes", name:"color", class:"colorwell", text:"Nodes Color"},
                {id:"clinks", name:"color", class:"colorwell", text:"Links Color"},
                {id:"cbg", name:"color", class:"colorwell", text:"Background Color"},
                {id:"clabels", name:"color", class:"colorwell", text:"Labels Color"}]
            ],
            [7,{id:"picker"},{class:"colorwell"},null,null,{func:TP.Context().VisualizationObject.changeColor}]]
        
        var interactors = [

            ['Force layout', '', {click: function () {
                __g__.getController().sendMessage('callLayout', {layoutName: 'FM^3 (OGDF)', idView: __g__.getID()})
            }}, "Layout"],
            ['Server update layout', '', {click: function () {
                TP.ObjectReferences().ClientObject.updateLayout(__g__.getID())
            }}, "Layout"],
            ['Tulip layout algorithm', tl, {call: function (layout) {
                __g__.getController().sendMessage('callLayout', {layoutName: layout.selectedAlgo, idView: __g__.getID()})
            }}, "Layout"],
            ['Tulip layout list','',{click:function(){
                TP.Context().getController().sendMessage('getPlugins', {pluginType:"layout", endHandler:TP.Context().updateTulipLayoutAlgorithms})
            }}, "Layout"],
    
            ['Operator ' + TP.Context().tabOperator["catalyst"], '', {click: function () {
                TP.ObjectReferences().InteractionObject.toggleCatalystSyncOperator(__g__.getID())
            }}, "Selection"],
            ['Toggle selection', '', {click: function () {
                TP.ObjectReferences().InteractionObject.toggleSelection(__g__.getID())
            }}, 'Selection'],
    
            ['Center view', '', {click: function () {
                __g__.getController().sendMessage('resetView');
            }}, "View"],
            ['Reset size', '', {click: function () {
                __g__.getController().sendMessage("resetSize")
            }}, "View"],
            ['Hide labels', '', {click: function () {
                __g__.getController().sendMessage("Hide labels")
            }}, "View"],
            ['Hide links', '', {click: function () {
                __g__.getController().sendMessage("Hide links")
            }}, "View"],
            ['Arrange labels', '', {click: function () {
                __g__.getController().sendMessage("arrangeLabels")
            }}, "View"],
            ['Rotation', '', {click: function () {
                __g__.getController().sendMessage("rotateGraph")
            }}, "View"],
            ['Zoom in', '', {click: function () {
                __g__.getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
            }}, "View"],
            ['Zoom out', '', {click: function () {
                __g__.getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
            }}, "View"],
    
            ['Size mapping', paramSizeMap, {call: function (scales) {
               __g__.getController().sendMessage("sizeMapping", {parameter: 'viewMetric', idView: TP.Context().activeView, scales: scales})
            }}, "View"],
    
            ['Color settings', colorSettings, null, "View"],
            
    
            ['Degree', '', {click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Degree', idView: __g__.getID()})
            }}, "Measure"],
            ['Betweenness. centrality', '', {click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Betweenness Centrality', idView: __g__.getID()})
            }}, "Measure"],
            ['Weight mapping', '', {click: function (scales) {
                __g__.getController().sendMessage("sizeMapping", {parameter: 'weight', idView: TP.Context().activeView, scales: scales})
            }}, "Measure"],
            ['Entanglement mapping', '', {click: function (scales) {
                __g__.getController().sendMessage("sizeMapping", {parameter: 'entanglementIndice', idView: TP.Context().activeView, scales: scales})
            }}, "Measure"],
            ['Tulip measure', tl, {call: function (algo) {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: algo.selectedAlgo, idView: __g__.getID()})
            }}, "Measure"],
    
            ['Horizontal barchart', '', {click: function () {
                __g__.getController().sendMessage("drawBarChart", {smell: 'base'})
            }}, "Open View"],
            ['Barchart', '', {click: function () {
                __g__.getController().sendMessage("drawBarChart", {smell: 'rotate'})
            }}, "Open View"],
            ['ScatterPlot', '', {click: function () {
                __g__.getController().sendMessage("drawScatterPlot")
            }}, "Open View"],
            ['Data', '', {click: function () {
                __g__.getController().sendMessage("drawDataBase")
            }}, "Open View"]
            // ['b3','random layout','',{click:function(){TP.ObjectReferences().ClientObject.callLayout('Random',viewIndex1)}}],
            // ['b4','reset view','',{click:function(){TP.ObjectReferences().VisualizationObject.resetView(viewIndex1)}}],
            // ['b10','Node information','',{click:function(){TP.ObjectReferences().InterfaceObject.attachInfoBox(viewIndex1)}}],
            //['b14','ent. color','',{click:function(){TP.ObjectReferences().VisualizationObject.colorMapping('entanglementIndice', viewIndex1)}}],
            //['b15','computeMatrix','',{click:function(){TP.ObjectReferences().VisualizationObject.buildEdgeMatrices()}}],
        ]
        
        parameters.interactorList = interactors;
        
        __g__ = new TP.ViewGraph(parameters);    

        __g__.initStates = function () {

            __g__.controller.addEventState("zoneApparu", ["nodeSelected", "selectionVide", "arrangeLabels"], function (_event) {/*assert(true, "zoneApparu");*/
                TP.Interaction().checkIntersect(_event);
            }, null, null, true);
            __g__.controller.addEventState("nodeSelected", ["mousemoveLasso", "mousemoveMouseDown", "mouseupMouseDown", "mouseoverMouseDown"], function (_event) {/*assert(true, "nodeSelected");*/
                TP.Interaction().nodeSelected(_event);
            }, null, null, true);
            __g__.controller.addEventState("selectionVide", ["mousemoveLasso", "mousemoveMouseDown", "mouseupMouseDown", "sizeMapping"], function (_event) {/*assert(true, "selectionVide");*/
                TP.Interaction().emptyListAction(_event);
            }, null, null, true);

            __g__.controller.addEventState("mouseupLasso", ["zoneApparu", "mousedownLasso", "mousemoveLasso"], function (_event) {/*assert(true, "mouseupLasso");*/
                __g__.controller.disableState("mouseupLasso");
                _event.associatedData.myL.canMouseUp(_event.associatedData.mouse);
            }, null, null, true);

            __g__.controller.addEventState("mousedownLasso", ["mousemoveLasso", "mouseupLasso"], function (_event) {/*assert(true, "mousedownLasso");*/
                __g__.controller.enableState("mouseupLasso");
                _event.associatedData.myL.canMouseDown(_event.associatedData.mouse);
            }, null, null, true);

            __g__.controller.addEventState("mousemoveLasso", ["mousemoveMouseDown", "mouseupMouseDown", "mousemoveLasso", "mousedownLasso", "mouseoverMouseDown"], function (_event) {/*assert(true, "mousemoveLasso");*/
                _event.associatedData.myL.canMouseMove(_event.associatedData.mouse);
            }, null, null, true);

            __g__.controller.addEventState("mouseoverMouseDown", ["mousedownMouseDown", "mousemoveLasso", "mousemoveMouseDown"], function (_event) {
                if (!__g__.controller.isActivate("mouseupLasso")) {
                    /*assert(true, "mouseoverMouseDown");*/
                    __g__.controller.disableState("mousemoveLasso");
                    TP.Lasso().mouseoverMouseDown(_event);
                }
            }, null, null, true);

            __g__.controller.addEventState("mouseoutMouseDown", ["mousemoveLasso"], function (_event) {/*assert(true, "mouseoutMouseDown");*/
                __g__.controller.enableState("mousemoveLasso");
                TP.Lasso().mouseoutMouseDown(_event);
            }, null, null, true);
            __g__.controller.addEventState("mousedownMouseDown", ["mousemoveMouseDown"], function (_event) {/*assert(true, "mousedownMouseDown");*/
                TP.Lasso().mousedownMouseDown(_event);
            }, null, null, true);
            __g__.controller.addEventState("mousemoveMouseDown", ["mousemoveMouseDown", "mouseoutMouseDown", "mousedownMouseDown", "mouseupMouseDown", "zoneApparu", "mousemoveLasso"], function (_event) {/*assert(true, "mousemoveMouseDown");*/
                TP.Lasso().mousemoveMouseDown(_event);
            }, null, null, true);

            __g__.controller.addEventState("arrangeLabels", ["mouseoverMouseDown", "mousemoveLasso", "mousemoveMouseDown", "mousedownMouseDown", "mouseupMouseDown", "sizeMapping"], function (_event) {/*assert(true, "arrangeLabels"); */
                TP.Visualization().arrangeLabels(_event);
            }, true, null, true);

            __g__.controller.addEventState("mouseupMouseDown", ["mouseupLasso", "mousedownMouseDown", "mousemoveMouseDown", "mouseoutMouseDown"], function (_event) {/*assert(true, "mouseupMouseDown");*/
                TP.Lasso().mouseupMouseDown(_event);
            }, null, null, true);


            __g__.controller.addEventState("move", ["movingZoomDrag"], function (_event) {/*assert(true, "move");*/
                TP.Interaction().removeLasso(_event);
                TP.Interaction().addZoom(_event)
            }, true, null, true);
            __g__.controller.addEventState("select", ["mousemoveLasso"], function (_event) {/*assert(true, "select");*/
                TP.Interaction().addLasso(_event);
                TP.Interaction().removeZoom(_event)
            }, true, null, true);

            __g__.controller.addEventState("movingZoomDrag", ["movingZoomDragEnd", "movingZoomDrag"], function (_event) {/*assert(true, "movingZoomDrag");*/
                TP.Interaction().movingZoomDrag(_event);
            }, null, null, true);
            __g__.controller.addEventState("movingZoomDragEnd", ["movingZoomDrag"], function (_event) {/*assert(true, "movingZoomDragEnd"); */
                TP.Interaction().movingZoomDragEnd(_event);
            }, null, null, true);


            __g__.controller.addEventState("callLayout", null, function (_event) {/*assert(true, "callLayout");*/
                TP.Client().callLayout(_event);
            }, true, true, true);
            __g__.controller.addEventState("AnswerCallLayout", null, function (_event) {/*assert(true, "AnswerCallLayout"); */
                TP.Client().AnswerCallLayout(_event);
            }, true, true, true);

            __g__.controller.addEventState("sendSelection", null, function (_event) {/*assert(true, "sendSelection");*/
                TP.Client().sendSelection(_event);
            }, true, true, true);
            __g__.controller.addEventState("answerSendSelection", null, function (_event) {/*assert(true, "answerSendSelection");*/
                TP.Client().answerSendSelection(_event);
            }, true, true, true);

            __g__.controller.addEventState("resetView", null, function (_event) {/*assert(true, "resetView");*/
                TP.Visualization().resetView(_event);
            }, true, true, true);

            __g__.controller.addEventState("callFloatAlgorithm", null, function (_event) {/*assert(true, "callFloatAlgorithm");*/
                TP.Client().callFloatAlgorithm(_event);
            }, true, true, true);
            __g__.controller.addEventState("AnswerFloatAlgorithm", null, function (_event) {/*assert(true, "AnswerFloatAlgorithm");*/
                TP.Client().AnswerFloatAlgorithm(_event);
            }, true, true, true);

            __g__.controller.addEventState("resetSize", null, function (_event) {/*assert(true, "resetSize");*/
                TP.Visualization().resetSize(_event);
            }, true, true, true);

            __g__.controller.addEventState("Hide labels", null, function (_event) {/*assert(true, "Hide labels");*/
                TP.Visualization().showhideLabels(_event);
            }, true, true, true);
            __g__.controller.addEventState("Hide links", null, function (_event) {/*assert(true, "Hide links");*/
                TP.Visualization().showhideLinks(_event);
            }, true, true, true);

            __g__.controller.addEventState("rotateGraph", null, function (_event) {/*assert(true, "rotateGraph");*/
                TP.Visualization().rotateGraph(_event);
            }, true, true, true);

            __g__.controller.addEventState("drawBarChart", null, function (_event) {/*assert(true, "drawBarChart");*/
                TP.BarChart().drawBarChart(_event);
            }, true, true, true);
            __g__.controller.addEventState("drawScatterPlot", null, function (_event) {/*assert(true, "drawScatterPlot");*/
                TP.ScatterPlot().drawScatterPlot(_event);
            }, true, true, true);

            __g__.controller.addEventState("drawScatterPlotNVD3", null, function (_event) {/*assert(true, "drawScatterPlot");*/
                //this.nvd3 = new TP.ViewNVD3(_event);
                //this.nvd3.setGraph(__g__.graph)
                TP.ViewNVD3().drawScatterPlot(_event);
            }, true, true, true);

            __g__.controller.addEventState("runZoom", null, function (_event) {/*assert(true, "runZoom");*/
                TP.Interaction().runZoom(_event);
            }, true, true, true);
            __g__.controller.addEventState("sizeMapping", null, function (_event) {/*assert(true, "sizeMapping");*/
                TP.Visualization().sizeMapping(_event);
            }, true, true, true);

            __g__.controller.addEventState("dragNode", null, function (_event) {/*assert(true, "dragNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().dragNode(_event);
            }, true, true, true);

            __g__.controller.addEventState("showHideLabelNode", null, function (_event) {/*assert(true, "showHideLabelNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().showHideLabelNode(_event);
            }, true, true, true);

            __g__.controller.addEventState("mouseoverShowLabelNode", null, function (_event) {/*assert(true, "mouseoverShowLabelNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().showLabelNode(_event);
            }, true, true, true);

            __g__.controller.addEventState("mouseOutNode", null, function (_event) {/*assert(true, "mouseOutNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().mouseOutNode();
            }, true, true, true);

            __g__.controller.addEventState("brushstart", null, function (_event) {/*assert(true, "brushstart");*/
                TP.Interaction().brushstart(_event);
            }, true, true, true);

            __g__.controller.addEventState("updateOtherView", null, function(_event){
                console.log("avant otherViews : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type); __g__.updateOtherViews(_event);
            }, true, true, true)        
            
            __g__.controller.addEventState("updateView", null, function(_event){
                console.log("avant updateViewGraph : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type); __g__.updateEventHandler.treatUpdateEvent(_event); __g__.updateOtherViews(_event);
            }, true, true, true)

            __g__.controller.addEventState("drawDataBase", null, function(_event){
                TP.Visualization().drawDataBase(_event);
            }, true, true, true)
            //__g__.controller.addState({name:"mousedownResizeGroup", bindings:null, func:function(event){assert(true, "mousedownResizeGroup"); TP.Lasso().mousedownResizeGroup(event);}}, "all", true);
            //__g__.controller.addState({name:"mouseupResizeGroup", bindings:null, func:function(event){assert(true, "mouseupResizeGroup"); TP.Lasso().mouseupResizeGroup(event);}}, "all", true);
            __g__.controller.setCurrentState("select");

        }

        return __g__;
    }

    TP.ViewGraphCatalyst = ViewGraphCatalyst;
})(TP);