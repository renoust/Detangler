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
    // types:   0:text      3:textfield     6:spinner
    //          1:slider    4:checkbox
    //          2:button    5:sider
    /*var paramSizeMap = [
        ['div', {id: 'sizemap', class: 'slider'}, 'scale: ']
    ];*/
    var paramSizeMap = [
        [5, {id:"sizemap"},{
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
    //var paramSizeMap = [['scale: ', 0]]

    var array1 = [

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
        ['zoom in', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],
        ['zoom out', '', {click: function () {
            TP.Context().view[target].getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],

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
        ['Data', '', {click: function () {
            objectReferences.VisualizationObject.drawDataBase(target)
        }}, "Open View"],
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
        ['Zoom in', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],
        ['Zoom out', '', {click: function () {
            TP.Context().view[target1].getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],
        ['Size mapping', paramSizeMap, {call: function (scales) {
            TP.Context().view[target1].getController().sendMessage("sizeMapping", {parameter: 'viewMetric', idView: contxt.activeView, scales: scales})
        }}, "View"],

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
        }}, "Open View"],
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


    /*for(var i=0; i<array1.length)
     if($('family1').length==0){
     $('<div/>', {id:'family1'}).appendTo('menu1-content');
     $('menu1').accordion({
     collapsible:true,
     active:false,
     heightStyle:'content'
     });
     }*/


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


// Event toggle sidebars

    $('div.toggleButton').click(function (e) {
        var src = event.srcElement.parentNode.parentNode;
        console.log(src)
        var menuNum = src.id.split('-')[1];
        var menu = $('#menu-' + menuNum);
        console.log(menu)
        console.log($(src))
        var parent = src.parentNode;
        var button = $(this);
        if (parent.className === 'nosidebar') {
            button.eq(0).toggleClass('open')
            /*button.text('<');*/
            $(parent).eq(0).toggleClass('nosidebar sidebar')
            //parent.className='sidebar';
            $('.cont').each(function () {
                $(this).css('left', 0)
            })
            menu.css('z-index', 102)
        }
        else if (parent.className === 'sidebar') {

            if (menu.css('z-index') == 102) {
                /*button.text('>');*/
                button.eq(0).toggleClass('open')

                //console.log($(parent))
                $(parent).eq(0).toggleClass('nosidebar sidebar')
                //              parent.className = 'nosidebar';
                $('.cont').each(function () {
                    $(this).css('z-index', 0)
                    $(this).css('left', -301)
                })
            }
            else {
                $('.toggleButton').each(function () {
                    /*$(this).text('>') */

                    console.log($(this).eq(0).className)
                    $(this).eq(0).removeClass('open')
                })
                $('.cont').each(function () {
                    $(this).css('z-index', 101)
                })
                menu.css('z-index', 102);
                /*button.text('<')*/
                button.eq(0).toggleClass('open')
                //button.css('background', "url(css/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png) 50% 50% repeat-x")

            }
        }
        else console.log('FAIL: toggle panel');
    });


    $('.submit').click(function () {
        res = {}
        var key = null;
        var val = null;

        var data = $(this).siblings("input[type='radio']:checked")
        data.each(function () {
            key = $(this).attr('name');
            res[key] = $(this).val();
        })

        data = $(this).siblings('.ui-spinner')
        data.each(function () {
            key = $(this).children('input').attr('name');
            val = $(this).children('input')[0].value
            res[key] = val;
        })

        data = $(this).siblings("input[type='checkbox']:checked")
        data.each(function () {
            key = $(this).attr('name');
            if (res[key] == null)
                res[key] = $(this).val();
            else
                res[key] += ", " + $(this).val();
        })

        data = $(this).siblings("input[type='text']")
        data.each(function () {
            key = $(this).attr('name');
            val = $(this).val()
            res[key] = val;
        })
    })


    // This is the tricky part, because the json given to the function can be of many shapes.
    // If it is a query, we call tulip to perform the search
    // if it is a given file we load it normally
    // other wise we load the default function
    if (originalJSON != null && originalJSON != "") {
        console.log('originalJSON not null', originalJSON)
        if ('query' in originalJSON) {
            console.log('query is in json', originalJSON)
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
