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

import_class('context.js', 'TP');
import_class('objectReferences.js', 'TP');
import_class('View.js', 'TP');

var TulipPosy = function (originalJSON) {

    var objectReferences = TP.ObjectReferences();
    var contxt = TP.Context();

    //assert(new testView(5, 3), "test réusssie"); //test nombre view

	var target = 'substrate';	
	var target1 = 'catalyst';
	var target2 = 'combined';


    var paramSizeMap = [
        //['input',{type:'text', name:'valMin', value:''},'min: '],
        //['input',{type:'text', name:'valMax', value:''},'max: '],
        ['div',{id:'sizemap',class:'slider'}, 'scale: ']
    ]

    var subarray = [
        ['menu1-content','b1','induced subgraph','',{click:function(){objectReferences.ClientObject.sendSelection(objectReferences.ClientObject.getSelection(target), target)}}],
        ['menu1-content','b2','force layout', '',{click:function(){objectReferences.ClientObject.callLayout('FM^3 (OGDF)', target)}}],
        // ['menu1-content','b3','circular layout','',{click:function(){objectReferences.ClientObject.callLayout('Circular', target)}}],
        ['menu1-content','b4','delete selection','',{click:function(){objectReferences.InteractionObject.delSelection()}}],
        // ['menu1-content','b5','random layout','',{click:function(){objectReferences.ClientObject.callLayout('Random', target)}}],
        ['menu1-content','b6','reset view','',{click:function(){objectReferences.VisualizationObject.resetView(target)}}],
        // ['menu1-content','b7','degree metric','',{click:function(){objectReferences.ClientObject.callLayout('LinLog Layout (Noack)',target)}}],
        ['menu1-content','b8','btw. centrality','',{click:function(){objectReferences.ClientObject.callFloatAlgorithm('Betweenness Centrality',target)}}],
        ['menu1-content','b9','analyse','',{click:function(){objectReferences.ClientObject.analyseGraph()}}],
        ['menu1-content','b10','reset size','',{click:function(){objectReferences.VisualizationObject.resetSize(target)}}],
        ['menu1-content','b11','hide labels','',{click:function(){objectReferences.VisualizationObject.showhideLabels(target)}}],
        ['menu1-content','b12','hide links','',{click:function(){objectReferences.VisualizationObject.showhideLinks(target)}}],
        ['menu1-content','b13','node information','',{click:function(){objectReferences.InterfaceObject.attachInfoBox(target)}}],
        ['menu1-content','b14','sync layouts','',{click:function(){objectReferences.ClientObject.syncLayouts()}}],
        ['menu1-content','b15','arrange labels','',{click:function(){objectReferences.VisualizationObject.arrangeLabels(target)}}],
        // ['menu1-content','b16','labels forward','',{click:function(){objectReferences.VisualizationObject.bringLabelsForward(target)}}],
        ['menu1-content','b17','rotation','',{click:function(){objectReferences.VisualizationObject.rotateGraph(target)}}],
        ['menu1-content','b18','BarChart','',{click:function(){objectReferences.VisualizationObject.drawBarChart(target,'base')}}],
        ['menu1-content','b19','BarChart_rotate','',{click:function(){objectReferences.VisualizationObject.drawBarChart(target,'rotate')}}],
        ['menu1-content','b20','ScatterPlot','',{click:function(){objectReferences.VisualizationObject.drawScatterPlot(target)}}],
        ['menu1-content','b21','Size Map',paramSizeMap, {call:function(scales){objectReferences.VisualizationObject.sizeMapping('viewMetric', contxt.activeView, scales) }}]
    ]

    var catalystarray = [
        ['menu1-content','b1','force layout','',{click:function(){objectReferences.ClientObject.callLayout('FM^3 (OGDF)',target1)}}],
        ['menu1-content','b2','update layout','',{click:function(){objectReferences.ClientObject.updateLayout(target1)}}],
        // ['menu1-content','b3','random layout','',{click:function(){objectReferences.ClientObject.callLayout('Random',target1)}}],
        // ['menu1-content','b4','reset view','',{click:function(){objectReferences.VisualizationObject.resetView(target1)}}],
        // ['menu1-content','b5','degree metric','',{click:function(){objectReferences.ClientObject.callLayout('FM^3 (OGDF)', target1)}}],
        // ['menu1-content','b6','btw. centrality','',{click:function(){objectReferences.ClientObject.callFloatAlgorithm('Betweenness Centrality', target1)}}],
        ['menu1-content','b7','reset size','',{click:function(){objectReferences.VisualizationObject.resetSize(target1)}}],
        ['menu1-content','b8','hide labels','',{click:function(){objectReferences.VisualizationObject.showhideLabels(target1)}}],
        ['menu1-content','b9','hide links','',{click:function(){objectReferences.VisualizationObject.showhideLinks(target1)}}],
        ['menu1-content','b10','node information','',{click:function(){objectReferences.InterfaceObject.attachInfoBox(target1)}}],
        ['menu1-content','b12','operator ' + contxt.catalyst_sync_operator,'',{click:function(){objectReferences.InteractionObject.toggleCatalystSyncOperator()}}],
        ['menu1-content','b13','weight mapping','',{click:function(){objectReferences.VisualizationObject.sizeMapping('weight', target1)}}],
        ['menu1-content','b14','ent. mapping','',{click:function(){objectReferences.VisualizationObject.sizeMapping('entanglementIndice', target1)}}],
        ['menu1-content','b15','ent. color','',{click:function(){objectReferences.VisualizationObject.colorMapping('entanglementIndice', target1)}}],
        ['menu1-content','b16','computeMatrix','',{click:function(){objectReferences.VisualizationObject.buildEdgeMatrices()}}],
        ['menu1-content','b17','arrange labels','',{click:function(){objectReferences.VisualizationObject.arrangeLabels(target1)}}],
    ]

    var combinedarray = [
        ['menu1-content','b1','fg ' + contxt.combined_foreground,'',{click:function(){objectReferences.InterfaceObject.toggleCombinedForeground()}}],
        ['menu1-content','b12','arrange labels' + contxt.combined_foreground,'',{click:function(){objectReferences.VisualizationObject.arrangeLabels(target2)}}],
    ]


    objectReferences.InterfaceObject.interactionPane(subarray,'create');
    objectReferences.InterfaceObject.infoPane();
    objectReferences.InterfaceObject.apiVisu();

    contxt.view[target] = TP.View(subarray, new Array("svg", 960, 500, "svg_substrate"), target, contxt.application);
    contxt.view[target1] = TP.View(catalystarray, new Array("svg", 960, 500, "svg_catalyst"), target1, contxt.application);
    contxt.view[target2] = TP.View(combinedarray, new Array("svg", 960, 500, "svg_combined"), target2, contxt.application);


    $('#undo').click(function(){contxt.changeStack.undo();});
    $('#redo').click(function(){contxt.changeStack.redo();});     

    // Event toggle sidebars
    $('span.toggleButton').click(function(e){
        var src = event.srcElement.parentNode;
        var menuNum = src.id.split('-')[1];
        var menu = $('#menu-'+menuNum);
        var parent = src.parentNode;
        var button = $(this);
        
        if(parent.className==='nosidebar'){
            button.text('<');
            parent.className='sidebar';
            $('.cont').each(function(){
                $(this).css('z-index',101)
                $(this).css('left',0)
            })
            menu.css('z-index',102)
        }
        else if(parent.className==='sidebar'){
            if(menu.css('z-index')==102){
                button.text('>');
                parent.className = 'nosidebar';
                $('.cont').each(function(){
                    $(this).css('z-index',0)
                    $(this).css('left',-252)
                })
            }
            else{
                $('.toggleButton').each(function(){ $(this).text('>') })
                $('.cont').each(function(){ $(this).css('z-index',101) })
                menu.css('z-index',102);
                button.text('<')
            }
        }
        else console.log('FAIL: toggle panel'); 
    });



    $('.submit').click(function(){
        res = {}
        var key = null;
        var val = null;

        var data = $(this).siblings("input[type='radio']:checked")
        data.each(function(){
            key = $(this).attr('name');
            res[key] = $(this).val();
        })

        data = $(this).siblings('.ui-spinner')
        data.each(function(){
            key = $(this).children('input').attr('name');       
            val = $(this).children('input')[0].value
            res[key] = val;
        })

        data = $(this).siblings("input[type='checkbox']:checked")
        data.each(function(){
            key = $(this).attr('name');
            if (res[key]==null)         
                res[key] = $(this).val();
            else
                res[key] += ", "+$(this).val();
        })

        data = $(this).siblings("input[type='text']")
        data.each(function(){
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
            objectReferences.ClientObject.loadData(recievedGraph);
        } else if ('file' in originalJSON) {
            objectReferences.ClientObject.loadData(originalJSON.file);
        } else objectReferences.ClientObject.loadData();
    }

};