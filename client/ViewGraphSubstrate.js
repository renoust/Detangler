//pile de gestion d'Etat

var TP = TP || {};
(function () {

    // {id:id, name:name, type:type, idSourceAssociatedView:idSourceAssociatedView, interactorList:interactorList}
    var ViewGraphSubstrate = function (parameters) {
        
        //id, bouton, name, nodeColor, linkColor, backgroundColor, labelColor, nodeShape, type, idAssociation
        var __g__ = this;
        
        
        var paramSizeMap = [
            [4, 
                {id:"sizemap"},
                {
                    range: true,
                    min: 0,
                    max: 99,
                    values: [ 3, 12 ],
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
        
        var setting = [
            [4, {id:"fontsize"},
                {
                    min: 0,
                    max: 99,
                    values: 12
                },
                "Labels size:"
            ],
            [7,{id:"npicker"},{class:"colorwell"},null,null,{func:TP.Context().VisualizationObject.changeColor}]]
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

        /*var bigtest = [[0, {id:"select"}, [{value:"opt1", text:"option1"},{value:"opt2",text:"option2"}],"b","a"],
            [1, {id:"radio"},[{name:"alpha",value:"2", text:"bravo"},{name:"alpha",value:"3",text:"charlie"}],"b","a"],
            [2, {id:"checkbox"},[{name:"letter",value:"4", text:"delta"},{name:"alpha",value:"5",text:"epsilon"}],"b","a"],
            [3, {id:"text"},null,"b","a"],
            [5, {id:"spinner"},null,"b","a"],
            [4,{id:'slider',class:'slider'},
                {   range: true,
                    min: 0,
                    max: 99,
                    values: [ 3, 12 ],
                },"b","a"]
            ];*/

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
            //{interactorLabel:'TEST', interactorParameters: bigtest, callbackBehavior:null},
            {interactorLabel:'Force layout', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage('callLayout', {layoutName: 'FM^3 (OGDF)', idView: __g__.getID()})
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Sync layouts', interactorParameters: '', callbackBehavior: {click: function () {
                TP.ObjectReferences().ClientObject.syncLayouts(__g__.getID())
            }}, interactorGroup:"Layout"},
            {interactorLabel:'MDS layout', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage('callLayout', {layoutName: 'MDS', idView: __g__.getID()})
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Tulip layout algorithm', interactorParameters:tl, callbackBehavior:{call: function (layout) {
                __g__.getController().sendMessage('callLayout', {layoutName: layout.selectedAlgo, idView: __g__.getID()})
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Tulip layout list',interactorParameters:'',callbackBehavior:{click:function(){
                __g__.getController().sendMessage('getPlugins', {pluginType:"layout", endHandler:TP.Context().updateTulipLayoutAlgorithms}, 'principal')
            }}, interactorGroup:"Layout"},

            {interactorLabel:'Induced subgraph', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("sendSelection", {json: TP.ObjectReferences().ClientObject.getSelection(__g__.getID()), idView: __g__.getID()})
            }}, interactorGroup:"Selection"},
            {interactorLabel:'Delete selection', interactorParameters: '', callbackBehavior: {click: function () {
                TP.ObjectReferences().InteractionObject.delSelection(__g__.getID())
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
            {interactorLabel:'Size mapping', interactorParameters: paramSizeMap, callbackBehavior: {call: function (scales) {
                __g__.getController().sendMessage("sizeMapping", {parameter: 'viewMetric', idView: TP.Context().activeView, scales: scales})
            }}, interactorGroup:"View"},
            {interactorLabel:'zoom in', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
            }}, interactorGroup:"View"},
            {interactorLabel:'zoom out', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
            }}, interactorGroup:"View"},
            {interactorLabel:'Color settings', interactorParameters: colorSettings,callbackBehavior:null, interactorGroup:"View"},
            /*{interactorLabel:'Nodes settings', interactorParameters: setting, callbackBehavior:{call: function (value) {
                 __g__.getController().sendMessage("changeNodesSettings", {value: value, idView: __g__.getID()})
            }}, interactorGroup:"View"},*/

            {interactorLabel:'Degree', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Degree', idView: __g__.getID()})
            }}, interactorGroup:"Measure"},
            {interactorLabel:'Betweenness centrality', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Betweenness Centrality', idView: __g__.getID()})
            }}, interactorGroup:"Measure"},
            {interactorLabel:'Tulip measure', interactorParameters: tl, callbackBehavior: {call: function (algo) {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: algo.selectedAlgo, idView: __g__.getID()})
            }}, interactorGroup:"Measure"},

            {interactorLabel:'Bipartite analysis', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("analyseGraph", (function(){
                    var params = __g__.viewGraphCatalystParameters()
                    params.idSourceAssociatedView = __g__.getID();
                    return {viewIndex: __g__.getID(), 
                            viewGraphCatalystParameters: params}
                     })())
            }}, interactorGroup:"Open View"},
            {interactorLabel:'Horizontal barchart', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawBarChart", {smell: 'base'})
            }}, interactorGroup:"Open View"},
            {interactorLabel:'Barchart', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawBarChart", {smell: 'rotate'})
            }}, interactorGroup:"Open View"},
            {interactorLabel:'Scatter plot', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawScatterPlot")
            }}, interactorGroup:"Open View"},
            {interactorLabel:'Scatter plot nvd3', interactorParameters:'', callbackBehavior:{click: function () {
                __g__.getController().sendMessage("drawScatterPlotNVD3")
            }}, interactorGroup:"Open View"},
            {interactorLabel:'Data', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawDataBase")
            }}, interactorGroup:"Open View"}
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

            __g__.controller.addEventState("zoneApparu", function (_event) {
                TP.Interaction().checkIntersect(_event);
            }, {bindings:["toto","nodeSelected", "selectionVide", "arrangeLabels"], fromAll:null, useless:null, activate:true});
            __g__.controller.addEventState("nodeSelected", function (_event) {/*assert(true, "nodeSelected");*/
                TP.Interaction().nodeSelected_deprecated(_event);
            }, {bindings:["mousemoveLasso", "mousemoveMouseDown", "mouseupMouseDown", "mouseoverMouseDown"], fromAll:null, useless:null, activate:true});
            __g__.controller.addEventState("selectionVide", function (_event) {/*assert(true, "selectionVide");*/
                TP.Interaction().emptyListAction(_event);
            }, {bindings:["mousemoveLasso", "mousemoveMouseDown", "mouseupMouseDown", "sizeMapping"], fromAll:null, useless:null, activate:true});

            __g__.controller.addEventState("mouseupLasso",  function (_event) {/*assert(true, "mouseupLasso");*/
                __g__.controller.disableState("mouseupLasso");
                _event.associatedData.myL.canMouseUp(_event.associatedData.mouse);
            }, {bindings:["zoneApparu", "mousedownLasso", "mousemoveLasso"], fromAll:null, useless:null, activate:true});
            __g__.controller.addEventState("mousedownLasso",  function (_event) {/*assert(true, "mousedownLasso");*/
                __g__.controller.enableState("mouseupLasso");
                _event.associatedData.myL.canMouseDown(_event.associatedData.mouse);
            }, {bindings:["mousemoveLasso", "mouseupLasso"], fromAll:null, useless:null, activate:true});
            __g__.controller.addEventState("mousemoveLasso",  function (_event) {/*assert(true, "mousemoveLasso");*/
                _event.associatedData.myL.canMouseMove(_event.associatedData.mouse);
            }, {bindings:["mousemoveMouseDown", "mouseupMouseDown", "mousemoveLasso", "mousedownLasso", "mouseoverMouseDown"], fromAll:null, useless:null, activate:true});

            __g__.controller.addEventState("mouseoverMouseDown",  function (_event) {
                if (!__g__.controller.isActivate("mouseupLasso")) {
                    __g__.controller.disableState("mousemoveLasso");
                    TP.Lasso().mouseoverMouseDown(_event);
                }
            },{bindings:["mousedownMouseDown", "mousemoveLasso", "mousemoveMouseDown"], fromAll:null, useless:null, activate:true});

            __g__.controller.addEventState("mouseoutMouseDown",  function (_event) {/*assert(true, "mouseoutMouseDown");*/
                __g__.controller.enableState("mousemoveLasso");
                TP.Lasso().mouseoutMouseDown(_event);
            }, {bindings:["mousemoveLasso"], fromAll:null, useless:null, activate:true});
            __g__.controller.addEventState("mousedownMouseDown",  function (_event) {/*assert(true, "mousedownMouseDown");*/
                TP.Lasso().mousedownMouseDown(_event);
            }, {bindings:["mousemoveMouseDown"], fromAll:null, useless:null, activate:true});
            __g__.controller.addEventState("mousemoveMouseDown",  function (_event) {/*assert(true, "mousemoveMouseDown");*/
                TP.Lasso().mousemoveMouseDown(_event);
            }, {bindings:["mousemoveMouseDown", "mouseoutMouseDown", "mousedownMouseDown", "mouseupMouseDown", "zoneApparu", "mousemoveLasso"], fromAll:null, useless:null, activate:true});


            
            __g__.controller.addEventState("arrangeLabels",  function (_event) {/*assert(true, "arrangeLabels"); */
                TP.Visualization().arrangeLabels(_event);
            }, {bindings:["mouseoverMouseDown", "mousemoveLasso", "mousemoveMouseDown", "mousedownMouseDown", "mouseupMouseDown", "sizeMapping"], fromAll:true, useless:null, activate:true});

            __g__.controller.addEventState("mouseupMouseDown",  function (_event) {/*assert(true, "mouseupMouseDown");*/
                TP.Lasso().mouseupMouseDown(_event);
            }, {bindings:["mouseupLasso", "mousedownMouseDown", "mousemoveMouseDown", "mouseoutMouseDown"], fromAll:null, useless:null, activate:true});


            __g__.controller.addEventState("Move",  function (_event) {/*assert(true, "move");*/
                
                TP.Interaction().removeLasso(_event);
                TP.Interaction().addMove(_event);                
                
            }, {bindings:["movingZoomDrag"], fromAll:true, useless:null, activate:true});
            __g__.controller.addEventState("Select",  function (_event) {/*assert(true, "select");*/
   
                TP.Interaction().addLasso(_event);
                TP.Interaction().removeMove(_event);
                TP.Interaction().addZoom(_event);
                //TP.Interaction().removeZoom(_event)
                
            }, {bindings:["mousemoveLasso"], fromAll:true, useless:null, activate:true});

            __g__.controller.addEventState("movingZoomDrag",  function (_event) {/*assert(true, "movingZoomDrag");*/
                TP.Interaction().movingZoomDrag(_event);
            }, {bindings:["movingZoomDragEnd", "movingZoomDrag"], fromAll:null, useless:null, activate:true});
            __g__.controller.addEventState("movingZoomDragEnd",  function (_event) {/*assert(true, "movingZoomDragEnd"); */
                TP.Interaction().movingZoomDragEnd(_event);
            }, {bindings:["movingZoomDrag"], fromAll:null, useless:null, activate:true});


            __g__.controller.addEventState("callLayout",  function (_event) {/*assert(true, "callLayout");*/
                TP.Client().callLayout(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("AnswerCallLayout",  function (_event) {/*assert(true, "AnswerCallLayout"); */
                TP.Client().AnswerCallLayout(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("sendSelection",  function (_event) {/*assert(true, "sendSelection");*/
                TP.Client().sendSelection(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("answerSendSelection",  function (_event) {/*assert(true, "answerSendSelection");*/
                TP.Client().answerSendSelection(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("resetView",  function (_event) {/*assert(true, "resetView");*/
                TP.Visualization().resetView(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("callFloatAlgorithm",  function (_event) {/*assert(true, "callFloatAlgorithm");*/
                TP.Client().callFloatAlgorithm(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("AnswerFloatAlgorithm",  function (_event) {/*assert(true, "AnswerFloatAlgorithm");*/
                TP.Client().AnswerFloatAlgorithm(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("analyseGraph",  function (_event) {/*assert(true, "analyseGraph");*/
                TP.Client().analyseGraph(_event);
            }, {bindings:["all"], fromAll:true, useless:null, activate:true});
            __g__.controller.addEventState("answerAnalyseGraph",  function (_event) {/*assert(true, "answerAnalyseGraph");*/
                TP.Client().answerAnalyseGraph(_event);
            }, {bindings:["all"], fromAll:true, useless:null, activate:true});

            __g__.controller.addEventState("resetSize",  function (_event) {/*assert(true, "resetSize");*/
                TP.Visualization().resetSize(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("Hide labels",  function (_event) {/*assert(true, "Hide labels");*/
                TP.Visualization().showhideLabels(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("Hide links",  function (_event) {/*assert(true, "Hide links");*/
                TP.Visualization().showhideLinks(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("rotateGraph",  function (_event) {/*assert(true, "rotateGraph");*/
                TP.Visualization().rotateGraph(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("drawBarChart",  function (_event) {/*assert(true, "drawBarChart");*/
                TP.BarChart().drawBarChart(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("drawScatterPlot",  function (_event) {/*assert(true, "drawScatterPlot");*/
                TP.ScatterPlot().drawScatterPlot(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("drawScatterPlotNVD3",  function (_event) {/*assert(true, "drawScatterPlot");*/
                //this.nvd3 = new TP.ViewNVD3(_event);
                //this.nvd3.setGraph(__g__.graph)
                TP.ViewNVD3().drawScatterPlot(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("runZoom",  function (_event) {/*assert(true, "runZoom");*/
                TP.Interaction().runZoom(_event);
            });
            __g__.controller.addEventState("sizeMapping",  function (_event) {/*assert(true, "sizeMapping");*/
                TP.Visualization().sizeMapping(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("dragNode",  function (_event) {/*assert(true, "dragNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().dragNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("showHideLabelNode",  function (_event) {/*assert(true, "showHideLabelNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().showHideLabelNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("mouseoverShowLabelNode",  function (_event) {/*assert(true, "mouseoverShowLabelNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().showLabelNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("mouseOutNode",  function (_event) {/*assert(true, "mouseOutNode");*/
                TP.Context().view[_event.associatedData.source].getGraphDrawing().mouseOutNode();
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("brushstart",  function (_event) {/*assert(true, "brushstart");*/
                TP.Interaction().brushstart(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("updateOtherView",  function(_event){
                console.log("avant otherViews : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type); __g__.updateOtherViews(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})        
            
            __g__.controller.addEventState("updateView",  function(_event){
                console.log("avant updateViewGraph : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type); __g__.updateEventHandler.treatUpdateEvent(_event); __g__.updateOtherViews(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})
            
            __g__.controller.addEventState("drawDataBase",  function(_event){
                TP.Visualization().drawDataBase(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})
            //__g__.controller.addState({name:"mousedownResizeGroup", bindings:null, func:function(event){assert(true, "mousedownResizeGroup"); TP.Lasso().mousedownResizeGroup(event);}}, "all", true);
            //__g__.controller.addState({name:"mouseupResizeGroup", bindings:null, func:function(event){assert(true, "mouseupResizeGroup"); TP.Lasso().mouseupResizeGroup(event);}}, "all", true);
            __g__.controller.setCurrentState("select");

            __g__.controller.addEventState("changeNodesSettings", function(_event){
                TP.Visualization().changeNodesSettings(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})
        }

        return __g__;
    }

    TP.ViewGraphSubstrate = ViewGraphSubstrate;
})(TP);