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

    $.fn.jPicker.defaults.images.clientPath = 'css/jPicker/';


    var nav = (navigator.userAgent).toLowerCase().indexOf("chrome");

    if (nav == -1) {
        //notification
    }


    TP.Context().clearInterface();

    var viewIndex = "" + TP.Context().getIndiceView();
    var viewIndex1 = "" + TP.Context().getIndiceView();
    var viewIndex2 = "" + TP.Context().getIndiceView();

    var viewIndexMap = [];
    var viewIndex1Map = [];
    var viewIndex2Map = [];

    var path = $('#files').val().split('\\');
    var name = path[path.length - 1].split('.')[0];

    var type1 = "Layout";
    var type2 = "Measures";
    var type3 = "Vizualisation";
    var type4 = "Others";

    // parameter: [labelprec, type, labelsuiv]
    // types:   0:text
    //          1:slider
    var paramSizeMap = [
        ['div', {id: 'sizemap', class: 'slider'}, 'scale: ']
    ]
    var tl = [
        ['input', {type: 'text'}]
    ];
    //var paramSizeMap = [['scale: ', 0]]

    var array1 = [

        ['Force layout', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage('callLayout', {layoutName: 'FM^3 (OGDF)', idView: viewIndex})
        }}, "Layout"],
        ['Sync layouts', '', {click: function () {
            objectReferences.ClientObject.syncLayouts(viewIndex)
        }}, "Layout"],
        ['MDS layout', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage('callLayout', {layoutName: 'MDS', idView: viewIndex})
        }}, "Layout"],
        ['Tulip layout algorithm', tl, {call: function (layout) {
            TP.Context().view[viewIndex].getController().sendMessage('callLayout', {layoutName: layout.text0, idView: viewIndex})
        }}, "Layout"],

        ['Induced subgraph', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("sendSelection", {json: objectReferences.ClientObject.getSelection(viewIndex), idView: viewIndex})
        }}, "Selection"],
        ['Delete selection', '', {click: function () {
            objectReferences.InteractionObject.delSelection(viewIndex)
        }}, "Selection"],
        ['Toggle selection', '', {click: function () {
            objectReferences.InteractionObject.toggleSelection(viewIndex)
        }}, 'Selection'],

        ['Center view', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage('resetView');
        }}, "View"],
        ['Reset size', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("resetSize")
        }}, "View"],
        ['Hide labels', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("Hide labels")
        }}, "View"],
        ['Hide links', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("Hide links")
        }}, "View"],
        ['Arrange labels', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("arrangeLabels")
        }}, "View"],
        ['Rotation', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("rotateGraph")
        }}, "View"],
        ['Size mapping', paramSizeMap, {call: function (scales) {
            TP.Context().view[viewIndex].getController().sendMessage("sizeMapping", {parameter: 'viewMetric', idView: TP.Context().activeView, scales: scales})
        }}, "View"],
        ['zoom in', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],
        ['zoom out', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],

        ['Degree', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Degree', idView: viewIndex})
        }}, "Measure"],
        ['Betweenness centrality', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Betweenness Centrality', idView: viewIndex})
        }}, "Measure"],
        ['Tulip measure', tl, {call: function (algo) {
            TP.Context().view[viewIndex].getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: algo.text0, idView: viewIndex})
        }}, "Measure"],

        ['Bipartite analysis', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("analyseGraph", {viewIndex: viewIndex, tabCatalyst: tabCatalyst})
        }}, "Open View"],
        ['Horizontal barchart', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("drawBarChart", {smell: 'base'})
        }}, "Open View"],
        ['Barchart', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("drawBarChart", {smell: 'rotate'})
        }}, "Open View"],
        ['Scatter plot', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("drawScatterPlot")
        }}, "Open View"],
        ['Scatter plot nvd3', '', {click: function () {
            TP.Context().view[viewIndex].getController().sendMessage("drawScatterPlotNVD3")
        }}, "Open View"],
        ['Data', '', {click: function () {
            objectReferences.VisualizationObject.drawDataBase(viewIndex)
        }}, "Open View"]
        // ['b3','circular layout','',{click:function(){objectReferences.ClientObject.callLayout('Circular', viewIndex)}}],
        // ['b5','random layout','',{click:function(){objectReferences.ClientObject.callLayout('Random', viewIndex)}}],        
        // ['b13','node information','',{click:function(){objectReferences.InterfaceObject.attachInfoBox()}}],
        // ['b16','labels forward','',{click:function(){objectReferences.VisualizationObject.bringLabelsForward(viewIndex)}}],
    ]

    var array2 = [

        ['Force layout', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage('callLayout', {layoutName: 'FM^3 (OGDF)', idView: viewIndex1})
        }}, "Layout"],
        ['Server update layout', '', {click: function () {
            objectReferences.ClientObject.updateLayout(viewIndex1)
        }}, "Layout"],

        ['Operator ' + TP.Context().tabOperator["catalyst"], '', {click: function () {
            objectReferences.InteractionObject.toggleCatalystSyncOperator(viewIndex1)
        }}, "Selection"],
        ['Toggle selection', '', {click: function () {
            objectReferences.InteractionObject.toggleSelection(viewIndex1)
        }}, 'Selection'],


        ['Reset size', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("resetSize")
        }}, "View"],
        ['Hide labels', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("Hide labels")
        }}, "View"],
        ['Hide links', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("Hide links")
        }}, "View"],
        ['Arrange labels', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("arrangeLabels")
        }}, "View"],
        ['Rotation', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("rotateGraph")
        }}, "View"],
        ['Zoom in', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],
        ['Zoom out', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
        }}, "View"],
        ['Size mapping', paramSizeMap, {call: function (scales) {
            TP.Context().view[viewIndex1].getController().sendMessage("sizeMapping", {parameter: 'viewMetric', idView: contxt.activeView, scales: scales})
        }}, "View"],

        ['Degree', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Degree', idView: viewIndex1})
        }}, "Measure"],
        ['Betweenness. centrality', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Betweenness Centrality', idView: viewIndex1})
        }}, "Measure"],
        ['Weight mapping', '', {click: function (scales) {
            TP.Context().view[viewIndex1].getController().sendMessage("sizeMapping", {parameter: 'weight', idView: contxt.activeView, scales: scales})
        }}, "Measure"],
        ['Entanglement mapping', '', {click: function (scales) {
            TP.Context().view[viewIndex1].getController().sendMessage("sizeMapping", {parameter: 'entanglementIndice', idView: contxt.activeView, scales: scales})
        }}, "Measure"],

        ['Horizontal barchart', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("drawBarChart", {smell: 'base'})
        }}, "Open View"],
        ['Barchart', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("drawBarChart", {smell: 'rotate'})
        }}, "Open View"],
        ['ScatterPlot', '', {click: function () {
            TP.Context().view[viewIndex1].getController().sendMessage("drawScatterPlot")
        }}, "Open View"],
        ['Data', '', {click: function () {
            objectReferences.VisualizationObject.drawDataBase(viewIndex1)
        }}, "Open View"]
        // ['b3','random layout','',{click:function(){objectReferences.ClientObject.callLayout('Random',viewIndex1)}}],
        // ['b4','reset view','',{click:function(){objectReferences.VisualizationObject.resetView(viewIndex1)}}],
        // ['b10','Node information','',{click:function(){objectReferences.InterfaceObject.attachInfoBox(viewIndex1)}}],
        //['b14','ent. color','',{click:function(){objectReferences.VisualizationObject.colorMapping('entanglementIndice', viewIndex1)}}],
        //['b15','computeMatrix','',{click:function(){objectReferences.VisualizationObject.buildEdgeMatrices()}}],
    ]




    TP.Context().view[viewIndex] = new TP.ViewGraph(viewIndex, array1, ["svg", "graph", 960, 500, "svg_" + viewIndex], name + " - substrate", "#a0522d", "#808080", "#FFFFFF", "#000000", "rect", "substrate", null);
    TP.Context().view[viewIndex].addView();
    TP.Context().view[viewIndex].buildLinks();


    var tabCatalyst = [viewIndex1, 
                       array2, 
                       ["svg", "graph", 960, 500, "svg_" + viewIndex1], 
                       name + " - catalyst", 
                       "#4682b4", 
                       "#808080", 
                       "#FFFFFF", 
                       "#000000", 
                       "circle", 
                       "catalyst"];

    $('#undo').click(function () {
        TP.Context().changeStack.undo();
    });
    $('#redo').click(function () {
        TP.Context().changeStack.redo();
    });


// Event toggle sidebars

    $('div.toggleButton').click(function (e) {
        var src = event.srcElement.parentNode.parentNode;
        //console.log(src)
        var menuNum = src.id.split('-')[1];
        var menu = $('#menu-' + menuNum);
        //console.log(menu)
        //console.log($(src))
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

                    //console.log($(this).eq(0).className)
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
        //console.log('originalJSON not null', originalJSON)
        if ('query' in originalJSON) {
            //console.log('query is in json', originalJSON)
            var recievedGraph = objectReferences.ClientObject.callSearchQuery(originalJSON)
            objectReferences.ClientObject.loadData(recievedGraph, viewIndex);
        } else if ('file' in originalJSON) {
            objectReferences.ClientObject.loadData(originalJSON.file, viewIndex);
        } else objectReferences.ClientObject.loadData(null, viewIndex);
    }
    else {
        objectReferences.ClientObject.loadData(null, viewIndex)
    }


    if ($('#analyse').is(':checked')) {
        TP.Context().view[viewIndex].getController().sendMessage("analyseGraph", {target: viewIndex, tabCatalyst: tabCatalyst});
    }
    if ($('#sync').is(':checked')) {
        objectReferences.ClientObject.syncLayouts(viewIndex)
    }


};
