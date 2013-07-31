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
            [6,{id:"picker"},{class:"colorwell"},null,null,{func:TP.Context().VisualizationObject.changeColor}]];


        var tulipLayouts = [
            [7,{id:"algoTulip"},
                {
                    source: function(searchStr, sourceCallback){
                        var algorithmList = []
                        for (var algo in TP.Context().tulipLayoutAlgorithms)
                        {
                            var patt = new RegExp(searchStr.term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i')
                            var isAlgo = patt.test(algo);
                            if (isAlgo) algorithmList.push(algo);
                        }
                        sourceCallback(algorithmList);
                    },
                    minLength: 0
                }]];

        var tulipMetrics = [
            [7,{id:"algoTulip"},
                {
                    source: function(searchStr, sourceCallback){
                        var algorithmList = []
                        for (var algo in TP.Context().tulipDoubleAlgorithms)
                        {
                            var patt = new RegExp(searchStr.term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i')
                            var isAlgo = patt.test(algo);
                            if (isAlgo) algorithmList.push(algo);
                        }
                        sourceCallback(algorithmList);
                    },
                    minLength: 0
                }]];

        
        var interactors = [

            {interactorLabel:'Force layout', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage('callLayout', {layoutName: 'FM^3 (OGDF)', idView: __g__.getID()})
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Server update layout', interactorParameters:'', callbackBehavior:{click: function () {
                TP.ObjectReferences().ClientObject.updateLayout(__g__.getID())
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Tulip layout algorithm',interactorParameters:tulipLayouts,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(layout){
                    __g__.getController().sendMessage('callLayout', {layoutName:layout.algoTulip, idView: __g__.getID()})
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
            {interactorLabel:'Weight mapping', interactorParameters: '', callbackBehavior: {click: function (){//(scales) {
                __g__.getController().sendMessage("sizeMapping", {parameter: 'weight', idView: TP.Context().activeView})//, scales: scales})
            }}, interactorGroup:"Measure"},
            {interactorLabel:'Entanglement mapping', interactorParameters: '', callbackBehavior: {click: function (){//(scales) {
                __g__.getController().sendMessage("sizeMapping", {parameter: 'entanglementIndex', idView: TP.Context().activeView})//, scales: scales})
            }}, interactorGroup:"Measure"},

            {interactorLabel:'Tulip measure',interactorParameters:tulipMetrics,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(algo){
                    __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: algo.algoTulip, idView: __g__.getID()})
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
            }}, interactorGroup:"Open View"},
            {interactorLabel:'Scatter plot nvd3', interactorParameters:'', callbackBehavior:{click: function () {
                __g__.getController().sendMessage("drawScatterPlotNVD3")
            }}, interactorGroup:"Open View"}
            // ['b3','random layout','',{click:function(){TP.ObjectReferences().ClientObject.callLayout('Random',viewIndex1)}}],
            // ['b4','reset view','',{click:function(){TP.ObjectReferences().VisualizationObject.resetView(viewIndex1)}}],
            // ['b10','Node information','',{click:function(){TP.ObjectReferences().InterfaceObject.attachInfoBox(viewIndex1)}}],
            //['b14','ent. color','',{click:function(){TP.ObjectReferences().VisualizationObject.colorMapping('entanglementIndex', viewIndex1)}}],
            //['b15','computeMatrix','',{click:function(){TP.ObjectReferences().VisualizationObject.buildEdgeMatrices()}}],
        ]
        
        parameters.interactorList = interactors;
        
        __g__ = new TP.ViewGraph(parameters);    

        __g__.initStates = function () {


            __g__.controller.addEventState("arrangeLabels",  function (_event) {
                TP.Visualization().arrangeLabels(_event);
            }, {bindings:["sizeMapping", null, "emptySelection", "nodeSelected"], fromAll:true, useless:null, activate:false});


            __g__.controller.addEventState("movingZoomDrag",  function (_event) {
                TP.Interaction().movingZoomDrag(_event);
            }, {bindings:["movingZoomDragEnd", "movingZoomDrag"], fromAll:null, useless:null, activate:true});

            __g__.controller.addEventState("movingZoomDragEnd", function (_event) {
                TP.Interaction().movingZoomDragEnd(_event);
            }, {bindings:["movingZoomDrag"], fromAll:null, useless:null, activate:true});


            __g__.controller.addEventState("callLayout",  function (_event) {
                TP.Client().callLayout(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("AnswerCallLayout",  function (_event) {
                TP.Client().AnswerCallLayout(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("sendSelection",  function (_event) {
                TP.Client().sendSelection(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("answerSendSelection",  function (_event) {
                TP.Client().answerSendSelection(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("resetView",  function (_event) {
                TP.Visualization().resetView(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("callFloatAlgorithm",  function (_event) {
                TP.Client().callFloatAlgorithm(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("AnswerFloatAlgorithm",  function (_event) {
                TP.Client().AnswerFloatAlgorithm(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("resetSize",  function (_event) {
                TP.Visualization().resetSize(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("Hide labels",  function (_event) {
                TP.Visualization().showhideLabels(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("Hide links",  function (_event) {
                TP.Visualization().showhideLinks(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("rotateGraph",  function (_event) {
                TP.Visualization().rotateGraph(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("drawBarChart",  function (_event) {
                TP.BarChart().drawBarChart(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("drawScatterPlot",  function (_event) {
                TP.ScatterPlot().drawScatterPlot(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});


            __g__.controller.addEventState("runZoom",  function (_event) {
                TP.Interaction().runZoom(_event);
            });
            __g__.controller.addEventState("sizeMapping",  function (_event) {
                TP.Visualization().sizeMapping(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("dragNode",  function (_event) {
                TP.Context().view[_event.associatedData.source].getGraphDrawing().dragNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("dragNodeEnd",  function (_event) {
                TP.ObjectReferences().ClientObject.updateLayout(__g__.getID());
            }, {bindings:null, fromAll:true, useless:true, activate:true});


            __g__.controller.addEventState("showHideLabelNode",  function (_event) {
                TP.Context().view[_event.associatedData.source].getGraphDrawing().showHideLabelNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("mouseoverShowLabelNode",  function (_event) {
                TP.Context().view[_event.associatedData.source].getGraphDrawing().showLabelNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("mouseOutNode",  function (_event) {
                TP.Context().view[_event.associatedData.source].getGraphDrawing().mouseOutNode();
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("brushstart",  function (_event) {
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

            __g__.controller.addEventState("drawScatterPlotNVD3",  function (_event) {
                TP.ViewNVD3().drawScatterPlot(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.setCurrentState("select");

        }

        return __g__;
    }

    TP.ViewGraphCatalyst = ViewGraphCatalyst;
})(TP);