//pile de gestion d'Etat

var TP = TP || {};
(function () {

    // {id:id, name:name, type:type, idSourceAssociatedView:idSourceAssociatedView, interactorList:interactorList}
    var ViewGraphSubstrate = function (parameters) {
        
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
            [7,{id:"picker"},{class:"colorwell"},null,null,{func:TP.Context().VisualizationObject.changeColor}]
        ];
        
        /*
        var tabCatalyst = [1,//__g__.getID(), 
                        null,
                       name + " - catalyst", 
                       "#4682b4", 
                       "#808080", 
                       "#FFFFFF", 
                       "#000000", 
                       "circle", 
                       "catalyst"];
        */
                      
        var _viewGraphCatalystParameters = {
            name:name + " - catalyst", 
            nodeColor:"#4682b4", 
            linkColor:"#808080", 
            backgroundColor:"#FFFFFF", 
            labelColor:"#000000", 
            nodeShape:"circle", 
            type:"catalyst"
        }
        
        
        var interactors = [
            /*['TEST', '', {call: function (res) {
                console.log(res)
            }}, "Layout"],*/
            ['Force layout', '', {click: function () {
                __g__.getController().sendMessage('callLayout', {layoutName: 'FM^3 (OGDF)', idView: __g__.getID()})
            }}, "Layout"],
            ['Sync layouts', '', {click: function () {
                TP.ObjectReferences().ClientObject.syncLayouts(__g__.getID())
            }}, "Layout"],
            ['MDS layout', '', {click: function () {
                __g__.getController().sendMessage('callLayout', {layoutName: 'MDS', idView: __g__.getID()})
            }}, "Layout"],
            ['Tulip layout algorithm', tl, {call: function (layout) {
                __g__.getController().sendMessage('callLayout', {layoutName: layout.selectedAlgo, idView: __g__.getID()})
            }}, "Layout"],
            ['Tulip layout list','',{click:function(){
                TP.Context().getController().sendMessage('getPlugins', {pluginType:"layout", endHandler:TP.Context().updateTulipLayoutAlgorithms})
            }}, "Layout"],
    
            ['Induced subgraph', '', {click: function () {
                __g__.getController().sendMessage("sendSelection", {json: TP.ObjectReferences().ClientObject.getSelection(__g__.getID()), idView: __g__.getID()})
            }}, "Selection"],
            ['Delete selection', '', {click: function () {
                TP.ObjectReferences().InteractionObject.delSelection(__g__.getID())
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
            ['Size mapping', paramSizeMap, {call: function (scales) {
                __g__.getController().sendMessage("sizeMapping", {parameter: 'viewMetric', idView: TP.Context().activeView, scales: scales})
            }}, "View"],
            ['zoom in', '', {click: function () {
                __g__.getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
            }}, "View"],
            ['zoom out', '', {click: function () {
                __g__.getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
            }}, "View"],
            ['Color settings', colorSettings,null, "View"],
    
            ['Degree', '', {click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Degree', idView: __g__.getID()})
            }}, "Measure"],
            ['Betweenness centrality', '', {click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Betweenness Centrality', idView: __g__.getID()})
            }}, "Measure"],
            ['Tulip measure', tl, {call: function (algo) {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: algo.selectedAlgo, idView: __g__.getID()})
            }}, "Measure"],
    
            ['Bipartite analysis', '', {click: function () {
                __g__.getController().sendMessage("analyseGraph", (function(){
                    var params = __g__.viewGraphCatalystParameters()
                    params.idSourceAssociatedView = __g__.getID();
                    return {viewIndex: __g__.getID(), 
                            viewGraphCatalystParameters: params}
                     })())
            }}, "Open View"],
            ['Horizontal barchart', '', {click: function () {
                __g__.getController().sendMessage("drawBarChart", {smell: 'base'})
            }}, "Open View"],
            ['Barchart', '', {click: function () {
                __g__.getController().sendMessage("drawBarChart", {smell: 'rotate'})
            }}, "Open View"],
            ['Scatter plot', '', {click: function () {
                __g__.getController().sendMessage("drawScatterPlot")
            }}, "Open View"],
            ['Scatter plot nvd3', '', {click: function () {
                __g__.getController().sendMessage("drawScatterPlotNVD3")
            }}, "Open View"],
            ['Data', '', {click: function () {
                TP.ObjectReferences().VisualizationObject.drawDataBase(__g__.getID())
            }}, "Open View"]
            // ['b3','circular layout','',{click:function(){TP.ObjectReferences().ClientObject.callLayout('Circular', __g__.getID())}}],
            // ['b5','random layout','',{click:function(){TP.ObjectReferences().ClientObject.callLayout('Random', __g__.getID())}}],        
            // ['b13','node information','',{click:function(){TP.ObjectReferences().InterfaceObject.attachInfoBox()}}],
            // ['b16','labels forward','',{click:function(){TP.ObjectReferences().VisualizationObject.bringLabelsForward(__g__.getID())}}],
        ]
        
        parameters.interactorList = interactors;
            
        var __g__ = new TP.ViewGraph(parameters);
       
       
        __g__.viewGraphCatalystParameters = function()
        {
            return _viewGraphCatalystParameters;
        }

        
        __g__.initStates = function () {

            __g__.controller.addState({name: "zoneApparu", bindings: ["nodeSelected", "selectionVide", "arrangeLabels"], func: function (_event) {/*assert(true, "zoneApparu");*/
                TP.Interaction().checkIntersect(_event);
            }});
            __g__.controller.addState({name: "nodeSelected", bindings: [/*"mousemoveLasso", "mousemoveMouseDown", "mouseupMouseDown", "mouseoverMouseDown"*/], func: function (_event) {/*assert(true, "nodeSelected");*/
                TP.Interaction().nodeSelected(_event);
            }});
            __g__.controller.addState({name: "selectionVide", bindings: [/*"mousemoveLasso", "mousemoveMouseDown", "mouseupMouseDown",*/ "sizeMapping"], func: function (_event) {/*assert(true, "selectionVide");*/
                TP.Interaction().emptyListAction(_event);
            }});

            /*
            __g__.controller.addState({name: "mouseupLasso", bindings: ["zoneApparu", "mousedownLasso", "mousemoveLasso"], func: function (_event) {
                __g__.controller.disableState("mouseupLasso");
                _event.associatedData.myL.canMouseUp(_event.associatedData.mouse);
            }});
            __g__.controller.addState({name: "mousedownLasso", bindings: ["mousemoveLasso", "mouseupLasso"], func: function (_event) {
                __g__.controller.enableState("mouseupLasso");
                _event.associatedData.myL.canMouseDown(_event.associatedData.mouse);
            }});
            __g__.controller.addState({name: "mousemoveLasso", bindings: ["mousemoveMouseDown", "mouseupMouseDown", "mousemoveLasso", "mousedownLasso", "mouseoverMouseDown"], func: function (_event) {
                _event.associatedData.myL.canMouseMove(_event.associatedData.mouse);
            }});

            __g__.controller.addState({name: "mouseoverMouseDown", bindings: ["mousedownMouseDown", "mousemoveLasso", "mousemoveMouseDown"], func: function (_event) {
                if (!__g__.controller.isActivate("mouseupLasso")) {
                    __g__.controller.disableState("mousemoveLasso");
                    TP.Lasso().mouseoverMouseDown(_event);
                }
            }});

            __g__.controller.addState({name: "mouseoutMouseDown", bindings: ["mousemoveLasso"], func: function (_event) {
                __g__.controller.enableState("mousemoveLasso");
                TP.Lasso().mouseoutMouseDown(_event);
            }});
            __g__.controller.addState({name: "mousedownMouseDown", bindings: ["mousemoveMouseDown"], func: function (_event) {
                TP.Lasso().mousedownMouseDown(_event);
            }});
            __g__.controller.addState({name: "mousemoveMouseDown", bindings: ["mousemoveMouseDown", "mouseoutMouseDown", "mousedownMouseDown", "mouseupMouseDown", "zoneApparu", "mousemoveLasso"], func: function (_event) {
                TP.Lasso().mousemoveMouseDown(_event);
            }});
            */

            __g__.controller.addState({name: "arrangeLabels", bindings: [/*"mouseoverMouseDown", "mousemoveLasso", "mousemoveMouseDown", "mousedownMouseDown", "mouseupMouseDown", */"sizeMapping"], func: function (_event) {/*assert(true, "arrangeLabels"); */
                TP.Visualization().arrangeLabels(_event);
            }}, "all");

            __g__.controller.addState({name: "mouseupMouseDown", bindings: [/*"mouseupLasso", "mousedownMouseDown", "mousemoveMouseDown", "mouseoutMouseDown"*/], func: function (_event) {/*assert(true, "mouseupMouseDown");*/
                TP.Lasso().mouseupMouseDown(_event);
            }});


            __g__.controller.addState({name: "move", bindings: ["movingZoomDrag"], func: function (_event) {/*assert(true, "move");*/
                //TP.Interaction().removeLasso(_event);
                TP.Interaction().addZoom(_event)
            }}, "all");
            __g__.controller.addState({name: "select", bindings: [/*"mousemoveLasso"*/], func: function (_event) {/*assert(true, "select");*/
                //TP.Interaction().addLasso(_event);
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

    TP.ViewGraphSubstrate = ViewGraphSubstrate;
})(TP);