/************************************************************************
 * This class is the core of our visualization system. It manages both
 * the visualization through svg objects and communication with the
 * tulip python server. It displays 2 graphs, one corresponding to the
 * substrate graph and the other to the catalyst graph, and manages the
 * interactions between them.
 * @requires d3.js, jQuery, graph.js, lasso.js
 * @authors Benjamin Renoust, Guy Melancon
 * @created May 2012
 ***********************************************************************/

// This class must be called like any function passing the well formated JSON object.
// originalJSON: a json object with an acceptable format
//
// We need to document the acceptable JSON format, and the communication protocol with
// tulip. This class also might be divided into classes, at least one should deal only
// with the communication, the other with the interaction, another for the overall
// interface...


var TulipPosy = function (originalJSON) {

    var objectReferences = TP.ObjectReferences();
    var contxt = TP.Context();

    TP.Context().clearInterface();

    var target = "" + TP.Context().getIndiceView();
    var target1 = "" + TP.Context().getIndiceView();
    var target2 = "" + TP.Context().getIndiceView();

    var targetMap = [];
    var target1Map = [];
    var target2Map = [];

    var path = $('#files').val().split('\\');
    var name = path[path.length - 1].split('.')[0];

    var type1 = "Layout";
    var type2 = "Measures";
    var type3 = "Vizualisation";
    var type4 = "Others";

    // parameter: [type, {attrs}, {attrs_child}, labelprec, labelsuiv]
    // types:   0:select    3:textfield     6:text
    //          1:radio     4:slider        7:color picker
    //          2:checkbox  5:spinner

    /*var bigtest = [[0, {id:"select"}, [{value:"opt1", text:"option1"},{value:"opt2",text:"option2"}]],
    [1, {id:"radio"},[{name:"alpha",value:"2", text:"bravo"},{name:"alpha",value:"3",text:"charlie"}]],
    [2, {id:"checkbox"},[{name:"letter",value:"4", text:"delta"},{name:"alpha",value:"5",text:"epsilon"}]],
    [3, {id:"text"}],
    [5, {id:"spinner"}],
    [4,{id:'slider',class:'slider'},
        {   range: true,
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
        }]
    ];*/

    var paramSizeMap = [
        /*[0,{id:"paramSize"},[
            {value:"viewMetric", text:"viewMetric"},
            {value:"weight", text:"weight"},
            {value:"entanglementIndice", text:"entanglementIndice"}
        ]],*/
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



    var array1 = [
        /*['TEST', '', {call: function (res) {
            console.log(res)
        }}, "Layout"],*/
        ['Force layout', '', {click: function () {
            TP.Context().view[target].getController().sendMessage('callLayout', {layoutName: 'FM^3 (OGDF)', idView: target})
        }}, "Layout"],
        ['Sync layouts', '', {click: function () {
            objectReferences.ClientObject.syncLayouts(target)
        }}, "Layout"],
        ['MDS layout', '', {click: function () {
            TP.Context().view[target].getController().sendMessage('callLayout', {layoutName: 'MDS', idView: target})
        }}, "Layout"],
        ['Tulip layout algorithm', tl, {call: function (layout) {
            TP.Context().view[target].getController().sendMessage('callLayout', {layoutName: layout.selectedAlgo, idView: target})
        }}, "Layout"],

        ['Induced subgraph', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("sendSelection", {json: objectReferences.ClientObject.getSelection(target), idView: target})
        }}, "Selection"],
        ['Delete selection', '', {click: function () {
            objectReferences.InteractionObject.delSelection(target)
        }}, "Selection"],
        ['Toggle selection', '', {click: function () {
            objectReferences.InteractionObject.toggleSelection(target)
        }}, 'Selection'],

        ['Center view', '', {click: function () {
            TP.Context().view[target].getController().sendMessage('resetView');
        }}, "View"],
        ['Reset size', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("resetSize")
        }}, "View"],
        ['Hide labels', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("Hide labels")
        }}, "View"],
        ['Hide links', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("Hide links")
        }}, "View"],
        ['Arrange labels', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("arrangeLabels")
        }}, "View"],
        ['Rotation', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("rotateGraph")
        }}, "View"],
        ['Size mapping', paramSizeMap, {call: function (scales) {
            TP.Context().view[target].getController().sendMessage("sizeMapping", {parameter: 'viewMetric', idView: contxt.activeView, scales: scales})
        }}, "View"],
        ['Zoom in', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],
        ['Zoom out', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],
        ['Color settings', colorSettings,null, "View"],

        ['Degree', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Degree', idView: target})
        }}, "Measure"],
        ['Betweenness centrality', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Betweenness Centrality', idView: target})
        }}, "Measure"],
        ['Tulip measure', tl, {call: function (algo) {
            TP.Context().view[target].getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: algo.selectedAlgo, idView: target})
        }}, "Measure"],

        ['Bipartite analysis', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("analyseGraph", {target: target, tabCatalyst: tabCatalyst})
        }}, "Open View"],
        ['Horizontal barchart', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("drawBarChart", {smell: 'base'})
        }}, "Open View"],
        ['Barchart', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("drawBarChart", {smell: 'rotate'})
        }}, "Open View"],
        ['Scatter plot', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("drawScatterPlot")
        }}, "Open View"],
        ['Scatter plot nvd3', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("drawScatterPlotNVD3")
        }}, "Open View"],
        ['Data', '', {click: function () {
            objectReferences.VisualizationObject.drawDataBase(target)
        }}, "Open View"]
        // ['b3','circular layout','',{click:function(){objectReferences.ClientObject.callLayout('Circular', target)}}],
        // ['b5','random layout','',{click:function(){objectReferences.ClientObject.callLayout('Random', target)}}],        
        // ['b13','node information','',{click:function(){objectReferences.InterfaceObject.attachInfoBox()}}],
        // ['b16','labels forward','',{click:function(){objectReferences.VisualizationObject.bringLabelsForward(target)}}],
    ]

    var array2 = [

        ['Force layout', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage('callLayout', {layoutName: 'FM^3 (OGDF)', idView: target1})
        }}, "Layout"],
        ['Server update layout', '', {click: function () {
            objectReferences.ClientObject.updateLayout(target1)
        }}, "Layout"],
        ['Tulip layout algorithm', tl, {call: function (layout) {
            TP.Context().view[target].getController().sendMessage('callLayout', {layoutName: layout.selectedAlgo, idView: target1})
        }}, "Layout"],

        ['Operator ' + TP.Context().tabOperator["catalyst"], '', {click: function () {
            objectReferences.InteractionObject.toggleCatalystSyncOperator(target1)
        }}, "Selection"],
        ['Toggle selection', '', {click: function () {
            objectReferences.InteractionObject.toggleSelection(target1)
        }}, 'Selection'],

        ['Center view', '', {click: function () {
            TP.Context().view[target].getController().sendMessage('resetView');
        }}, "View"],
        ['Reset size', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("resetSize")
        }}, "View"],
        ['Hide labels', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("Hide labels")
        }}, "View"],
        ['Hide links', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("Hide links")
        }}, "View"],
        ['Arrange labels', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("arrangeLabels")
        }}, "View"],
        ['Rotation', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("rotateGraph")
        }}, "View"],
        ['Size mapping', paramSizeMap, {call: function (scales) {
            TP.Context().view[target1].getController().sendMessage("sizeMapping", {parameter: 'viewMetric', idView: contxt.activeView, scales: scales})
        }}, "View"],
        ['Zoom in', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],
        ['Zoom out', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],
        ['Color settings', colorSettings,null, "View"],
        

        ['Degree', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Degree', idView: target1})
        }}, "Measure"],
        ['Betweenness. centrality', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Betweenness Centrality', idView: target1})
        }}, "Measure"],
        ['Weight mapping', '', {click: function (scales) {
            TP.Context().view[target1].getController().sendMessage("sizeMapping", {parameter: 'weight', idView: contxt.activeView, scales: scales})
        }}, "Measure"],
        ['Entanglement mapping', '', {click: function (scales) {
            TP.Context().view[target1].getController().sendMessage("sizeMapping", {parameter: 'entanglementIndice', idView: contxt.activeView, scales: scales})
        }}, "Measure"],
        ['Tulip measure', tl, {call: function (algo) {
            TP.Context().view[target].getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: algo.selectedAlgo, idView: target1})
        }}, "Measure"],

        ['Horizontal barchart', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("drawBarChart", {smell: 'base'})
        }}, "Open View"],
        ['Barchart', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("drawBarChart", {smell: 'rotate'})
        }}, "Open View"],
        ['ScatterPlot', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("drawScatterPlot")
        }}, "Open View"],
        ['Data', '', {click: function () {
            objectReferences.VisualizationObject.drawDataBase(target1)
        }}, "Open View"]
        // ['b3','random layout','',{click:function(){objectReferences.ClientObject.callLayout('Random',target1)}}],
        // ['b4','reset view','',{click:function(){objectReferences.VisualizationObject.resetView(target1)}}],
        // ['b10','Node information','',{click:function(){objectReferences.InterfaceObject.attachInfoBox(target1)}}],
        //['b14','ent. color','',{click:function(){objectReferences.VisualizationObject.colorMapping('entanglementIndice', target1)}}],
        //['b15','computeMatrix','',{click:function(){objectReferences.VisualizationObject.buildEdgeMatrices()}}],
    ]


    var array3 = [
        ['fg ' + contxt.combined_foreground, '', {click: function () {
            objectReferences.InterfaceObject.toggleCombinedForeground()
        }}, type3],
        ['arrange labels' + contxt.combined_foreground, '', {click: function () {
            objectReferences.VisualizationObject.arrangeLabels(target2)
        }}, type3]
    ]

    var tabCatalyst = new Array();


    TP.Context().view[target] = new TP.ViewGraph(target, 1, array1, new Array("svg", "graph", 960, 500, "svg_" + target), name + " - substrate", "#a0522d", "#808080", "#FFFFFF", "#000000", "rect", "substrate", null);
    TP.Context().view[target].addView();
    TP.Context().view[target].buildLinks();

    tabCatalyst = new Array(target1, array2, new Array("svg", "graph", 960, 500, "svg_" + target1), name + " - catalyst", "#4682b4", "#808080", "#FFFFFF", "#000000", "circle", "catalyst");

    $('#undo').click(function () {
        TP.Context().changeStack.undo();
    });
    $('#redo').click(function () {
        TP.Context().changeStack.redo();
    });

    // This is the tricky part, because the json given to the function can be of many shapes.
    // If it is a query, we call tulip to perform the search
    // if it is a given file we load it normally
    // other wise we load the default function
    if (originalJSON != null && originalJSON != "") {
        //console.log('originalJSON not null', originalJSON)
        if ('query' in originalJSON) {
            //console.log('query is in json', originalJSON)
            var recievedGraph = objectReferences.ClientObject.callSearchQuery(originalJSON)
            objectReferences.ClientObject.loadData(recievedGraph, target);
        } else if ('file' in originalJSON) {
            objectReferences.ClientObject.loadData(originalJSON.file, target);
        } else objectReferences.ClientObject.loadData(null, target);
    }
    else {
        objectReferences.ClientObject.loadData(null, target)
    }


    if ($('#analyse').is(':checked')) {
        TP.Context().view[target].getController().sendMessage("analyseGraph", {target: target, tabCatalyst: tabCatalyst});
    }
    if ($('#sync').is(':checked')) {
        objectReferences.ClientObject.syncLayouts(target)
    }

    //check if Google Chrome browser is used, if not, warn the user
     if(!window.chrome){
        TP.Context().InterfaceObject.throwAnnouncement("Warning","This application is optimized for Google Chrome browser. If you see this message, please "+
            "use Google Chrome or... run you fools.")
    }


};
