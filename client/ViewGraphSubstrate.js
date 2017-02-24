//pile de gestion d'Etat

var TP = TP || {};
(function () {

    // {id:id, name:name, type:type, idSourceAssociatedView:idSourceAssociatedView, interactorList:interactorList}
    var ViewGraphSubstrate = function (parameters) {
        
        //id, bouton, name, nodeColor, linkColor, backgroundColor, labelColor, nodeShape, type, idAssociation
        var __g__ = this;
        

        var zoomCombined = 
        [
            ["free", {id:"zoomAll"}, 
                                     {html:"<button id='zout'>-</button>\
                                            <div id='zslider'></div>\
                                            <button id='zin'>+</button>", 
                                      code:function(){
                                           $(function() {
                                                $( "#zslider").slider({min:-100, max:100, value:0});
                                            });
                                            $("#zslider").css({width:"70%", display: "inline-block"});
                                            $("#zout").on("click", function()
                                            {
                                                 __g__.getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]});
                                            });
                                            $("#zin").on("click", function()
                                            {
                                                 __g__.getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]});
                                            });
                                           $("#zslider").on("slide", function(v,u){
                                               if (u.value == 0){
                                                   __g__.viewZoomLevel = 0;
                                                }
                                                var delta = u.value - __g__.viewZoomLevel;
                                                __g__.viewZoomLevel = u.value;
                                                __g__.getController().sendMessage("runZoom", {wheelDelta: delta, mousePos: [TP.Context().width / 2, TP.Context().height / 2]});
                                                 
                                           }); 
                                        }
                                      }
         ] 
        ];
        
        var linkCurvatureSlide = 
        [
            [8, {id:"linkCurvatureSlide"},{
                    range: false,
                    min: -100,//(function(){console.log(__g__.labelDisplayWidth * -1); return __g__.labelDisplayWidth * -1})(),
                    max: +100,
                    value: 20,
                    change: function() {
                        var value = $("#linkCurvatureSlide").slider("values",0);
                        $("#linkCurvatureSlide").find(".ui-slider-handle").eq(0).text(value);
                    },
                    slide: function() {
                        var value = $("#linkCurvatureSlide").slider("values",0);
                        $("#linkCurvatureSlide").find(".ui-slider-handle").eq(0).text(value);
                    }
                },
                "slide: "
            ]//TP.Context().VisualizationObject.rotateView
        ];
        
        
        var viewRotationSlide = 
        [
            ["checkbox", {id: "bothViews"}, [{id:"bothViews_cb",text:"both views",value:"checked",checked:"false"}]
            ],
            [8, {id:"viewRotationSlide"},{
                    range: false,
                    min: -360,
                    max: +360,
                    value: 0,
                    change: function() {
                        var value = $("#viewRotationSlide").slider("values",0);
                        $("#viewRotationSlide").find(".ui-slider-handle").eq(0).text(value);
                    },
                    slide: function() {
                        var value = $("#viewRotationSlide").slider("values",0);
                        $("#viewRotationSlide").find(".ui-slider-handle").eq(0).text(value);
                    }
                },
                "slide: "
            ]
        ];
        
        
        var labelFontSizeSlide = 
        [
            [8, {id:"labelFontSizeSlide"},{
                    range: false,
                    min: 0,//(function(){console.log(__g__.labelDisplayWidth * -1); return __g__.labelDisplayWidth * -1})(),
                    max: 100,
                    value: TP.Context().defaultLabelFontSize,
                    change: function() {
                        var value = $("#labelFontSizeSlide").slider("values",0);
                        $("#labelFontSizeSlide").find(".ui-slider-handle").eq(0).text(value);
                    },
                    slide: function() {
                        var value = $("#labelFontSizeSlide").slider("values",0);
                        $("#labelFontSizeSlide").find(".ui-slider-handle").eq(0).text(value);
                    }
                },
                "slide: "
            ]
        ];

        
        var labelPaddingSlide = 
        [
            [8, {id:"labelPaddingSlide"},{
                    range: false,
                    min: -100,//(function(){console.log(__g__.labelDisplayWidth * -1); return __g__.labelDisplayWidth * -1})(),
                    max: 100,
                    value: TP.Context().defaultLabelPadding,
                    change: function() {
                        var value = $("#labelPaddingSlide").slider("values",0);
                        $("#labelPaddingSlide").find(".ui-slider-handle").eq(0).text(value);
                    },
                    slide: function() {
                        var value = $("#labelPaddingSlide").slider("values",0);
                        $("#labelPaddingSlide").find(".ui-slider-handle").eq(0).text(value);
                    }
                },
                "slide: "
            ]
        ];
        
        
        var labelDisplayWidth = 
        [
            [8, {id:"labelDisplayWidth"},{
                    range: false,
                    min: 0,
                    max: (function(){return window.width;})(),
                    value: TP.Context().defaultdefaultLabelMaxLength,
                    change: function() {
                        var value = $("#labelDisplayWidth").slider("values",0);
                        $("#labelDisplayWidth").find(".ui-slider-handle").eq(0).text(value);
                    },
                    slide: function() {
                        var value = $("#labelDisplayWidth").slider("values",0);
                        $("#labelDisplayWidth").find(".ui-slider-handle").eq(0).text(value);
                    }
                },
                "slide: "
            ]
        ];        
        var paramSizeMap = [
            [4, 
                {id:"sizemap"},
                {
                    range: true,
                    min: 0,
                    max: 99,
                    values: [ 3, 12 ]
                },
                "scale: "
            ]
        ];
    
        var tl = [
            [3,{id:"selectedAlgo"}]
        ];

        //var tulipLayout = ["3-Connected (Tutte)", "Balloon (OGDF)", "Bubble Tree", "Circular", "Circular (OGDF)", "Cone Tree", "Connected Component Packing", "Connected Component Packing (Polyomino)", "Davidson Harel (OGDF)", "Dendrogram", "Dominance (OGDF)", "FM^3 (OGDF)", "Fast Multipole Embedder (OGDF)", "Fast Multipole Multilevel Embedder (OGDF)", "Fast Overlap Removal", "Frutcherman Reingold (OGDF)", "GEM (Frick)", "GEM Frick (OGDF)", "GRIP", "Hierarchical Graph", "Hierarchical Tree (R-T Extended)", "Improved Walker", "Improved Walker (OGDF)", "Kamada Kawai (OGDF)", "LinLog", "MMM Example Fast Layout (OGDF)", "MMM Example Nice Layout (OGDF)", "MMM Example No Twist Layout (OGDF)", "Mixed Model", "Perfect aspect ratio", "Planarization Grid (OGDF)", "Random layout", "Squarified Tree Map", "Stress Majorization (OGDF)", "Sugiyama (OGDF)", "Tree Leaf", "Tree Radial", "Upward Planarization (OGDF)", "Visibility (OGDF)"]
        var tulipLayouts = [
            [7,{id:"algoTulip"},
                {
                    source: function(searchStr, sourceCallback){
                        var algorithmList = [];
                        for (var algo in TP.Context().tulipLayoutAlgorithms)
                        {
                           var patt = new RegExp(searchStr.term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
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
                        var algorithmList = [];
                        for (var algo in TP.Context().tulipDoubleAlgorithms)
                        {
                            var patt = new RegExp(searchStr.term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
                            var isAlgo = patt.test(algo);
                            if (isAlgo) algorithmList.push(algo);
                        }
                        sourceCallback(algorithmList);
                    },
                    minLength: 0
                }]];
    
        var colorSettings = [
            [1,{id:"color"},[
                {id:"cnodes", name:"color", class:"colorwell", text:"Nodes Color"},
                {id:"clinks", name:"color", class:"colorwell", text:"Links Color"},
                {id:"cbg", name:"color", class:"colorwell", text:"Background Color"},
                {id:"clabels", name:"color", class:"colorwell", text:"Labels Color"}]
            ],
            [6,{id:"picker"},{class:"colorwell"},null,null,{func:TP.Context().VisualizationObject.changeColor}]
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
            [6,{id:"npicker"},{class:"colorwell"},null,null,{func:TP.Context().VisualizationObject.changeColor}]];

        var tl2 = [
            [7,{id:"nodeProperty"},
                {
                    source: function(searchStr, sourceCallback){
                        var propertyList = ["--"];
                        var oneNode = __g__.getGraph().nodes()[0];
                        for (var algo in oneNode)
                        {
                            var patt = new RegExp(searchStr.term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
                            var isAlgo = patt.test(algo);
                            if (isAlgo && typeof(oneNode[algo]) == "number") propertyList.push(algo);
                        }
                        sourceCallback(propertyList);
                    },
                    minLength: 0
                }]];

        var allproperty = [
            [7,{id:"nodeProperty"},
                {
                    source: function(searchStr, sourceCallback){
                        var propertyList = ["--"];
                        var oneNode = __g__.getGraph().nodes()[0];
                        for (var prop in oneNode)
                            propertyList.push(prop);
                        sourceCallback(propertyList);
                    },
                    minLength: 0
                }]];

                
          var searchBox = [
            ["autocomplete", {id:"searchBox"},
                {
                    source: function(searchStr, sourceCallback){
                        var propertyList = ["--"];
                        var oneNode = __g__.getGraph().nodes()[0];
                        for (var prop in oneNode)
                        {
                            //var patt = new RegExp(searchStr.term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
                            //var isAlgo = patt.test(prop);
                            //if (isAlgo && typeof(oneNode[prop]) == "number") 
                            propertyList.push(prop);
                        }
                        sourceCallback(propertyList);
                    },
                    minLength: 0
                }, "In"],
              //
              ["textfield", {id:"textsearch"}, 
                {call:function(d){console.log("this looks like an ugly hack");}}, "search", ""]  
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
        var path = $('#files').val().split('\\');
        var name = path[path.length - 1].split('.')[0];
        if(name){
            name = name + ' - ';
        }
        var _viewGraphCatalystParameters = {
            name:name + " catalyst",
            nodeColor:TP.Context().defaulNodeColor,
            linkColor:TP.Context().defaultLinkColor,
            backgroundColor:TP.Context().defaultBackgroundColor,
            labelColor:TP.Context().defaultLabelColor,
            nodeShape:"circle", 
            type:"catalyst"
        };
        
        
        var interactors = [
            //{interactorLabel:'TEST', interactorParameters: bigtest, callbackBehavior:null},
            {interactorLabel:'Force layout', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage('callLayout', {layoutName: 'FM^3 (OGDF)', idView: __g__.getID()});
            }}, interactorGroup:"Layout"},
            /*{interactorLabel:'Tulip layout algorithm', interactorParameters:tl, callbackBehavior:{call: function (layout) {
                __g__.getController().sendMessage('callLayout', {layoutName: layout.selectedAlgo, idView: __g__.getID()})
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Tulip layout list',interactorParameters:'',callbackBehavior:{click:function(){
                __g__.getController().sendMessage('getPlugins', {pluginType:"layout", endHandler:TP.Context().updateTulipLayoutAlgorithms}, 'principal')
            }}, interactorGroup:"Layout"},*/
            {interactorLabel:'Tulip layout algorithm',interactorParameters:tulipLayouts,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(layout){
                    __g__.getController().sendMessage('changeLayout', {layoutName:layout.algoTulip, idView: TP.Context().activeView});
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Harmonize layout from catalysts', interactorParameters: '', callbackBehavior: {click: function () {
                TP.ObjectReferences().ClientObject.syncLayouts(__g__.getID());
            }}, interactorGroup:"Layout"},


            {interactorLabel:'Leapfrog to catalysts', interactorParameters: '', callbackBehavior: {click: function () {
                TP.ObjectReferences().InteractionObject.toggleSelection(__g__.getID());
            }}, interactorGroup:"Selection"},
            {interactorLabel:'Induced subgraph', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("sendSelection", {json: TP.ObjectReferences().ClientObject.getSelection(__g__.getID()), idView: __g__.getID()});
            }}, interactorGroup:"Selection"},
            {interactorLabel:'Delete selection', interactorParameters: '', callbackBehavior: {click: function () {
                TP.ObjectReferences().InteractionObject.delSelection(__g__.getID());
            }}, interactorGroup:"Selection"},

            {interactorLabel:'Center view', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage('resetView');
            }}, interactorGroup:"View"},
            {interactorLabel:'Reset size', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("resetSize");
            }}, interactorGroup:"View"},
            {interactorLabel:'Hide labels', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("Hide labels");
            }}, interactorGroup:"View"},
            {interactorLabel:'Hide links', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("Hide links");
            }}, interactorGroup:"View"},
            //{interactorLabel:'Arrange labels', interactorParameters: '', callbackBehavior: {click: function () {
            //    __g__.getController().sendMessage("arrangeLabels");
            //}}, interactorGroup:"View"},
            {interactorLabel:'Scale node size', interactorParameters: paramSizeMap, callbackBehavior: {call: function (scales) {
                __g__.getController().sendMessage("sizeMapping", {parameter: 'viewMetric', idView: TP.Context().activeView, scales: scales});
            }}, interactorGroup:"View"},
            {interactorLabel:'Zoom', interactorParameters: zoomCombined, callbackBehavior:null, interactorGroup:"View"},
            /*{interactorLabel:'Zoom out', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]});
            }}, interactorGroup:"View"},*/
            {interactorLabel:'Color settings', interactorParameters: colorSettings,callbackBehavior:null, interactorGroup:"View"},
            /*{interactorLabel:'Nodes settings', interactorParameters: setting, callbackBehavior:{call: function (value) {
                 __g__.getController().sendMessage("changeNodesSettings", {value: value, idView: __g__.getID()})
            }}, interactorGroup:"View"},*/

            {interactorLabel:'Degree', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Degree', idView: __g__.getID()});
            }}, interactorGroup:"Measure"},
            {interactorLabel:'Betweenness centrality', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Betweenness Centrality', idView: __g__.getID()});
            }}, interactorGroup:"Measure"},

            {interactorLabel:'Tulip measure',interactorParameters:tulipMetrics,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(algo){
                    __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: algo.algoTulip, idView: __g__.getID()});
                }}, interactorGroup:"Measure"},
                
            {interactorLabel:'Search in nodes', interactorParameters: searchBox, callbackBehavior: 
                {call:function (x) {
                    if(x.searchBox)
                    {
                        if(x.searchBox == "--"){
                            __g__.searchProperty = null;
                            __g__.graphDrawing.resetSelection();
                        }else{
                            __g__.searchProperty = x.searchBox;
                        }
                        $("#textsearch").value = "";
                        __g__.getController().sendMessage("emptySelection", {selList:[]});
                    }
                    if (x.textsearch !== undefined)
                        if (x.textsearch != __g__.searchQuery){
                            __g__.searchQuery = x.textsearch;
                            var nodeList = TP.Interaction().searchInNodes(__g__.searchProperty, __g__.searchQuery, __g__.getID());
                            //__g__.getController().sendMessage("simpleSelectionMadeView",{selection:nodeList, idView:__g__.getID()});
                            if(nodeList && nodeList.length > 0)
                                __g__.getController().sendMessage("nodeSelected", {selList: nodeList, prevSelList: []});
                            else
                                __g__.getController().sendMessage("emptySelection", {selList:[]});
                        }
                }                        
            }, interactorGroup:"Selection"},


            {interactorLabel:'Multiplex analysis', interactorParameters: allproperty, callbackBehavior: {call: function (paramList) {
                __g__.getController().sendMessage("analyseGraph", (function(){
                    var params = __g__.viewGraphCatalystParameters();
                    params.idSourceAssociatedView = __g__.getID();
                    __g__.descriptors_property = paramList.nodeProperty;
                    params.multiplex_property = paramList.nodeProperty;
                    return {viewIndex: __g__.getID(), 
                            viewGraphCatalystParameters: params};
                     })());
            }}, interactorGroup:"Open View"},


            {interactorLabel:'Node size mapping',interactorParameters:tl2,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(paramList){
                    //__g__.getController().sendMessage('node size mapping', {nodeProperty:paramList.nodeProperty, idView: TP.Context().activeView})
                    TP.ObjectReferences().VisualizationObject.nodeSizeMapping(paramList.nodeProperty, __g__.getID());
                }}, interactorGroup:"Mapping"},
            {interactorLabel:'Color mapping',interactorParameters:tl2,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(paramList){
                    //__g__.getController().sendMessage('color mapping', {nodeProperty:paramList.nodeProperty, idView: TP.Context().activeView})
                    TP.ObjectReferences().VisualizationObject.colorMapping(paramList.nodeProperty, __g__.getID());
                }}, interactorGroup:"Mapping"},

            {interactorLabel:'To labels',interactorParameters:allproperty,callbackBehavior:{
                call:function(paramList){
                    __g__.label_property = paramList.nodeProperty;
                    __g__.getController().sendMessage("arrangeLabels");
                }}, interactorGroup:"Mapping"},

                
            {interactorLabel:'Label metric ordering',interactorParameters:tl2,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(paramList){
                    //__g__.getController().sendMessage('node size mapping', {nodeProperty:paramList.nodeProperty, idView: TP.Context().activeView})
                    __g__.labelMetric = (paramList.nodeProperty == "--")? null: paramList.nodeProperty; 
                    __g__.getController().sendMessage("arrangeLabels");//TP.ObjectReferences().VisualizationObject.nodeSizeMapping(paramList.nodeProperty, __g__.getID());
                }}, interactorGroup:"Mapping"},

            {interactorLabel:'Label padding', interactorParameters: labelPaddingSlide, callbackBehavior: {call: function (scales) {
                    __g__.labelPadding = scales.value;
                    __g__.getController().sendMessage("arrangeLabels");
            }}, interactorGroup:"View"},

            {interactorLabel:'Label text length', interactorParameters: labelDisplayWidth, callbackBehavior: {call: function (scales) {
                    __g__.labelDisplayWidth = scales.value;
                    __g__.getController().sendMessage("arrangeLabels");
            }}, interactorGroup:"View"},

            {interactorLabel:'Label font size', interactorParameters: labelFontSizeSlide, callbackBehavior: {call: function (scales) {
                    __g__.labelFontSize = scales.value;
                    __g__.getController().sendMessage("arrangeLabels");
            }}, interactorGroup:"View"},

            {interactorLabel:'Rotate view', interactorParameters: viewRotationSlide, callbackBehavior: {call: function (scales) {
                    if(scales.value == undefined || scales.value == NaN) return;
                    var rotation = scales.value;
                    if (rotation == 0){
                        __g__.viewRotation = 0;
                    }
                    TP.Context().VisualizationObject.rotateView(rotation);
            }}, interactorGroup:"View"},

            {interactorLabel:'Link curvature', interactorParameters: linkCurvatureSlide, callbackBehavior: {call: function (scales) {
                    __g__.linkCurvature = scales.value/100;
                    __g__.graphDrawing.changeLayout(__g__.graph, 0);
            }}, interactorGroup:"View"},

 
            
            // ['b3','circular layout','',{click:function(){TP.ObjectReferences().ClientObject.callLayout('Circular', __g__.getID())}}],
            // ['b5','random layout','',{click:function(){TP.ObjectReferences().ClientObject.callLayout('Random', __g__.getID())}}],        
            // ['b13','node information','',{click:function(){TP.ObjectReferences().InterfaceObject.attachInfoBox()}}],
            // ['b16','labels forward','',{click:function(){TP.ObjectReferences().VisualizationObject.bringLabelsForward(__g__.getID())}}],
        ];
        
        parameters.interactorList = interactors;
            
        var __g__ = new TP.ViewGraph(parameters);
       
       
        __g__.viewGraphCatalystParameters = function()
        {
            return _viewGraphCatalystParameters;
        };

        
        __g__.initStates = function () {

            __g__.controller.addEventState("movingZoomDrag",  function (_event) {
                TP.Interaction().movingZoomDrag(_event);
            }, {bindings:["movingZoomDragEnd", "movingZoomDrag"], fromAll:true, useless:null, activate:true});
            __g__.controller.addEventState("movingZoomDragEnd",  function (_event) {
                TP.Interaction().movingZoomDragEnd(_event);
            }, {bindings:["movingZoomDrag"], fromAll:true, useless:null, activate:true});
            __g__.controller.addEventState("doubleClickOnLasso", function (_event) {
                TP.ObjectReferences().InteractionObject.toggleSelection(__g__.getID());
            }, {bindings:null, fromAll:true, useless:true, activate:true});


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

            __g__.controller.addEventState("analyseGraph",  function (_event) {
                TP.Client().analyseGraph(_event);
            }, {bindings:["all"], fromAll:true, useless:null, activate:true});
            __g__.controller.addEventState("answerAnalyseGraph",  function (_event) {
                TP.Client().answerAnalyseGraph(_event);
            }, {bindings:["all"], fromAll:true, useless:null, activate:true});

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

            __g__.controller.addEventState("runZoom",  function (_event) {
                TP.Interaction().runZoom(_event);
            });
            __g__.controller.addEventState("sizeMapping",  function (_event) {
                TP.Visualization().sizeMapping(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("dragNode",  function (_event) {
                TP.Context().view[_event.associatedData.source].getGraphDrawing().dragNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("showHideLabelNode",  function (_event) {
                TP.Context().view[_event.associatedData.source].getGraphDrawing().showHideLabelNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("mouseoverShowLabelNode",  function (_event) {
                if (__g__.getController().drawingState != true)
                     TP.Context().view[_event.associatedData.source].getGraphDrawing().showLabelNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("mouseOutNode",  function (_event) {
                TP.Context().view[_event.associatedData.source].getGraphDrawing().mouseOutNode();
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("brushstart",  function (_event) {
                TP.Interaction().brushstart(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("updateOtherView",  function(_event){
                console.log("avant otherViews : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type);
                __g__.updateOtherViews(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            
            __g__.controller.addEventState("updateView",  function(_event){
                console.log("avant updateViewGraph : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type);
                __g__.updateEventHandler.treatUpdateEvent(_event); __g__.updateOtherViews(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            
            __g__.controller.addEventState("drawDataBase",  function(_event){
                TP.Visualization().drawDataBase(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("changeNodesSettings", function(_event){
                TP.Visualization().changeNodesSettings(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("changeLayout", function(_event){
                TP.Visualization().tulipLayout(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.setCurrentState("select");


        };




        return __g__;
    };

    TP.ViewGraphSubstrate = ViewGraphSubstrate;
})(TP);