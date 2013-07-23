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

            {interactorLabel:'Force layout', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage('callLayout', {layoutName: 'FM^3 (OGDF)', idView: __g__.getID()})
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Server update layout', interactorParameters:'', callbackBehavior:{click: function () {
                TP.ObjectReferences().ClientObject.updateLayout(__g__.getID())
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Tulip layout algorithm', interactorParameters:tl, callbackBehavior:{call: function (layout) {
                __g__.getController().sendMessage('callLayout', {layoutName: layout.selectedAlgo, idView: __g__.getID()})
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Tulip layout list',interactorParameters:'',callbackBehavior:{click:function(){
                TP.Context().getController().sendMessage('getPlugins', {pluginType:"layout", endHandler:TP.Context().updateTulipLayoutAlgorithms})
            }}, interactorGroup:"Layout"},
    
            {interactorLabel:'Operator ' + TP.Context().tabOperator["catalyst"], interactorParameters:'', callbackBehavior:{click: function () {
                TP.ObjectReferences().InteractionObject.toggleCatalystSyncOperator(__g__.getID())
            }}, interactorGroup:"Selection"},
            {interactorLabel:'Toggle selection', interactorParameters: '', callbackBehavior: {click: function () {
                TP.ObjectReferences().InteractionObject.toggleSelection(__g__.getID())
            }}, interactorGroup:"Selection"},
    
            {interactorLabel:'Center view', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage('resetView');
            }}, interactorGroup:"View"},
            {interactorLabel:'Reset size', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("resetSize")
            }}, interactorGroup:"View"},
            {interactorLabel:'Hide labels', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("Hide labels")
            }}, interactorGroup:"View"},
            {interactorLabel:'Hide links', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("Hide links")
            }}, interactorGroup:"View"},
            {interactorLabel:'Arrange labels', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("arrangeLabels")
            }}, interactorGroup:"View"},
            {interactorLabel:'Rotation', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("rotateGraph")
            }}, interactorGroup:"View"},
            {interactorLabel:'Zoom in', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
            }}, interactorGroup:"View"},
            {interactorLabel:'Zoom out', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
            }}, interactorGroup:"View"},
    
            {interactorLabel:'Size mapping', interactorParameters: paramSizeMap, callbackBehavior: {call: function (scales) {
               __g__.getController().sendMessage("sizeMapping", {parameter: 'viewMetric', idView: TP.Context().activeView, scales: scales})
            }}, interactorGroup:"View"},
    
            {interactorLabel:'Color settings', interactorParameters: colorSettings, callbackBehavior:null, interactorGroup:"View"},
            
    
            {interactorLabel:'Degree', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Degree', idView: __g__.getID()})
            }}, interactorGroup:"Measure"},
            {interactorLabel:'Betweenness. centrality', interactorParameters:'', callbackBehavior:{click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Betweenness Centrality', idView: __g__.getID()})
            }}, interactorGroup:"Measure"},
            {interactorLabel:'Weight mapping', interactorParameters: '', callbackBehavior: {click: function (scales) {
                __g__.getController().sendMessage("sizeMapping", {parameter: 'weight', idView: TP.Context().activeView, scales: scales})
            }}, interactorGroup:"Measure"},
            {interactorLabel:'Entanglement mapping', interactorParameters: '', callbackBehavior: {click: function (scales) {
                __g__.getController().sendMessage("sizeMapping", {parameter: 'entanglementIndice', idView: TP.Context().activeView, scales: scales})
            }}, interactorGroup:"Measure"},
            {interactorLabel:'Tulip measure', interactorParameters: tl, callbackBehavior: {call: function (algo) {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: algo.selectedAlgo, idView: __g__.getID()})
            }}, interactorGroup:"Measure"},
    
            {interactorLabel:'Horizontal barchart', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawBarChart", {smell: 'base'})
            }}, interactorGroup:"Open View"},
            {interactorLabel:'Barchart', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawBarChart", {smell: 'rotate'})
            }}, interactorGroup:"Open View"},
            {interactorLabel:'ScatterPlot', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawScatterPlot")
            }}, interactorGroup:"Open View"},
            {interactorLabel:'Data', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawDataBase")
            }}, interactorGroup:"Open View"}
            // ['b3','random layout','',{click:function(){TP.ObjectReferences().ClientObject.callLayout('Random',viewIndex1)}}],
            // ['b4','reset view','',{click:function(){TP.ObjectReferences().VisualizationObject.resetView(viewIndex1)}}],
            // ['b10','Node information','',{click:function(){TP.ObjectReferences().InterfaceObject.attachInfoBox(viewIndex1)}}],
            //['b14','ent. color','',{click:function(){TP.ObjectReferences().VisualizationObject.colorMapping('entanglementIndice', viewIndex1)}}],
            //['b15','computeMatrix','',{click:function(){TP.ObjectReferences().VisualizationObject.buildEdgeMatrices()}}],
        ]
        
        parameters.interactorList = interactors;
        
        __g__ = new TP.ViewGraph(parameters);    

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

            __g__.controller.addState({name: "arrangeLabels", bindings: ["mouseoverMouseDown", "mousemoveLasso", "mousemoveMouseDown", "mousedownMouseDown", "mouseupMouseDown", "sizeMapping"], func: function (_event) {/*assert(true, "arrangeLabels"); */
                TP.Visualization().arrangeLabels(_event);
            }}, "all");

            __g__.controller.addState({name: "mouseupMouseDown", bindings: ["mouseupLasso", "mousedownMouseDown", "mousemoveMouseDown", "mouseoutMouseDown"], func: function (_event) {/*assert(true, "mouseupMouseDown");*/
                TP.Lasso().mouseupMouseDown(_event);
            }});


            __g__.controller.addState({name: "move", bindings: ["movingZoomDrag"], func: function (_event) {/*assert(true, "move");*/
                //TP.Interaction().removeLasso(_event);
                TP.Interaction().addZoom(_event)
            }}, "all");
            __g__.controller.addState({name: "select", bindings: ["mousemoveLasso"], func: function (_event) {/*assert(true, "select");*/
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

            __g__.controller.addState({name : "drawDataBase", bindings : null, func:function(_event){
                TP.Visualization().drawDataBase(_event);
            }}, "all", true)
            //__g__.controller.addState({name:"mousedownResizeGroup", bindings:null, func:function(event){assert(true, "mousedownResizeGroup"); TP.Lasso().mousedownResizeGroup(event);}}, "all", true);
            //__g__.controller.addState({name:"mouseupResizeGroup", bindings:null, func:function(event){assert(true, "mouseupResizeGroup"); TP.Lasso().mouseupResizeGroup(event);}}, "all", true);
            __g__.controller.setCurrentState("select");

        }

        return __g__;
    }

    TP.ViewGraphCatalyst = ViewGraphCatalyst;
})(TP);