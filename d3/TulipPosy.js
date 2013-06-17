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

    $.fn.jPicker.defaults.images.clientPath='css/jPicker/';



	var nav = (navigator.userAgent).toLowerCase().indexOf("chrome");
	
	if(nav == -1){
		//notification
	}
	
	
	TP.Context().clearInterface();

	var target = ""+TP.Context().getIndiceView();
	var target1 = ""+TP.Context().getIndiceView();
	var target2 = ""+TP.Context().getIndiceView();

	var targetMap = [];
	var target1Map = [];
	var target2Map = [];
	
	var path = $('#files').val().split('\\');
    var name = path[path.length-1].split('.')[0];

	var type1 = "Layout";
	var type2 = "Measures";
	var type3 = "Vizualisation";
	var type4 = "Others";
	

    var paramSizeMap = [
        ['div',{id:'sizemap',class:'slider'}, 'scale: ']
    ]
	
	var array1 = [
        ['b1','Force layout', '',{click:function(){objectReferences.ClientObject.callLayout('FM^3 (OGDF)', target)}}, "Layout"],
        ['b2','Sync layouts','',{click:function(){objectReferences.ClientObject.syncLayouts(target)}}, "Layout"],

	    ['b3','Induced subgraph','',{click:function(){objectReferences.ClientObject.sendSelection(objectReferences.ClientObject.getSelection(target), target)}}, "Selection"],
        ['b4','Delete selection','',{click:function(){objectReferences.InteractionObject.delSelection()}}, "Selection"],

        ['b5','Center view','',{click:function(){objectReferences.VisualizationObject.resetView(target)}}, "View"],
        ['b6','Reset size','',{click:function(){objectReferences.VisualizationObject.resetSize(target)}}, "View"],
        ['b7','Hide labels','',{click:function(){objectReferences.VisualizationObject.showhideLabels(target)}}, "View"],
        ['b8','Hide links','',{click:function(){objectReferences.VisualizationObject.showhideLinks(target)}}, "View"],
        ['b9','Arrange labels','',{click:function(){objectReferences.VisualizationObject.arrangeLabels(target)}}, "View"],
        ['b10','Rotation','',{click:function(){objectReferences.VisualizationObject.rotateGraph(target)}}, "View"],
        ['b11','Size mapping',paramSizeMap, {call:function(scales){objectReferences.VisualizationObject.sizeMapping('viewMetric', contxt.activeView, scales) }}, "View"],
        ['b12','Zoom in','', {click:function(){objectReferences.InteractionObject.runZoom(target, 120, [TP.Context().width/2,TP.Context().height/2])}}, "View"],
        ['b13','Zoom out','', {click:function(){objectReferences.InteractionObject.runZoom(target, -120, [TP.Context().width/2,TP.Context().height/2])}}, "View"],

        ['b14','Degree','',{click:function(){objectReferences.ClientObject.callFloatAlgorithm('Degree', target)}}, "Measure"],	
        ['b15','Betweenness centrality','',{click:function(){objectReferences.ClientObject.callFloatAlgorithm('Betweenness Centrality',target)}}, "Measure"],

        ['b16','Bipartite analysis','',{click:function(){objectReferences.ClientObject.analyseGraph(target, tabCatalyst)}}, "Open View"],
        ['b17','Horizontal barchart','',{click:function(){objectReferences.VisualizationObject.drawBarChart(target,'base')}}, "Open View"],
        ['b18','Barchart','',{click:function(){objectReferences.VisualizationObject.drawBarChart(target,'rotate')}}, "Open View"],
        ['b19','Scatter plot','',{click:function(){objectReferences.VisualizationObject.drawScatterPlot(target)}}, "Open View"]
	]
	
	
	var array2 = [
        ['b1','Force layout','',{click:function(){objectReferences.ClientObject.callLayout('FM^3 (OGDF)',target1)}}, "Layout"],
        ['b2','Server update layout','',{click:function(){objectReferences.ClientObject.updateLayout(target1)}}, "Layout"],

        ['b3','Operator ' + TP.Context().tabOperator["catalyst"],'',{click:function(){objectReferences.InteractionObject.toggleCatalystSyncOperator(target1)}}, "Selection"],

        ['b4','Reset size','',{click:function(){objectReferences.VisualizationObject.resetSize(target1)}}, "View"],
        ['b5','Hide labels','',{click:function(){objectReferences.VisualizationObject.showhideLabels(target1)}}, "View"],
        ['b6','Hide links','',{click:function(){objectReferences.VisualizationObject.showhideLinks(target1)}}, "View"],
        ['b7','Arrange labels','',{click:function(){objectReferences.VisualizationObject.arrangeLabels(target1)}}, "View"],
        ['b8','Rotation','',{click:function(){objectReferences.VisualizationObject.rotateGraph(target1)}}, "View"],
        ['b9','Zoom in','', {click:function(){objectReferences.InteractionObject.runZoom(target1, 120, [TP.Context().width/2,TP.Context().height/2])}}, "View"],
        ['b10','Zoom out','', {click:function(){objectReferences.InteractionObject.runZoom(target1, -120, [TP.Context().width/2,TP.Context().height/2])}}, "View"],
        ['b21','Size mapping',paramSizeMap, {call:function(scales){objectReferences.VisualizationObject.sizeMapping('viewMetric', contxt.activeView, scales) }}, "View"],
        
        ['b11','Degree','',{click:function(){objectReferences.ClientObject.callFloatAlgorithm('Degree', target1)}}, "Measure"],
        ['b12','Betweenness centrality','',{click:function(){objectReferences.ClientObject.callFloatAlgorithm('Betweenness Centrality', target1)}}, "Measure"],
        ['b13','Weight mapping','',{click:function(){objectReferences.VisualizationObject.sizeMapping('weight', target1)}}, "Measure"],
        ['b14','Entanglement mapping','',{click:function(){objectReferences.VisualizationObject.sizeMapping('entanglementIndice', target1)}}, "Measure"],
	]
	
	
	var array3 = [
        ['b1','fg ' + contxt.combined_foreground,'',{click:function(){objectReferences.InterfaceObject.toggleCombinedForeground()}}, type3],
        ['b12','arrange labels' + contxt.combined_foreground,'',{click:function(){objectReferences.VisualizationObject.arrangeLabels(target2)}}, type3]
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
	

    TP.Context().view[target] = new TP.View(target, 1, array1, new Array("svg", "graph", 960, 500, "svg_"+target), name+" - substrate", "#a0522d", "#808080", "#FFFFFF", "rect", "substrate", null);
    TP.Context().view[target].addView();
    TP.Context().view[target].buildLinks();

	tabCatalyst = new Array(target1, array2, new Array("svg", "graph", 960, 500, "svg_"+target1), name+" - catalyst", "#4682b4", "#808080", "#FFFFFF", "circle", "catalyst");



    $('#undo').click(function(){TP.Context().changeStack.undo();});
    $('#redo').click(function(){TP.Context().changeStack.redo();});    


// Event toggle sidebars

    $('div.toggleButton').click(function(e){

        var src = event.srcElement.parentNode;
        var menuNum = src.id.split('-')[1];
        var menu = $('#menu-'+menuNum);
        var parent = src.parentNode;
        var button = $(this);
        if(parent.className==='nosidebar'){
            console.log('TOTO')
            button.eq(0).toggleClass('open')
            button.text('<');
            parent.className='sidebar';
            $('.cont').each(function(){
                $(this).css('left',0)
            })
            menu.css('z-index',102)
        }
        else if(parent.className==='sidebar'){
            
            if(menu.css('z-index')==102){
                console.log('TATA')
                button.text('>');
                button.eq(0).toggleClass('open')
                parent.className = 'nosidebar';
                $('.cont').each(function(){
                    $(this).css('z-index',0)
                    $(this).css('left',-252)
                })
            }
            else{
                console.log('TUTU')
                $('.toggleButton').each(function(){ 
                    $(this).text('>') 

                    console.log($(this).eq(0).className)
                    $(this).eq(0).removeClass('open')
                })
                $('.cont').each(function(){ $(this).css('z-index',101) })
                menu.css('z-index',102);
                button.text('<')
                button.eq(0).toggleClass('open')
                //button.css('background', "url(css/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png) 50% 50% repeat-x")

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
            objectReferences.ClientObject.loadData(recievedGraph, target);
        } else if ('file' in originalJSON) {
            objectReferences.ClientObject.loadData(originalJSON.file, target);
        } else objectReferences.ClientObject.loadData(null, target);
    }
    else
    {
    	objectReferences.ClientObject.loadData(null, target)
    }

    if($('#analyse').is(':checked')){
        objectReferences.ClientObject.analyseGraph(target, tabCatalyst)
    }
    if($('#sync').is(':checked')){
        objectReferences.ClientObject.syncLayouts(target)
    }

/*
    if(originalJSON==null){
        console.log('TOTO')
        objectReferences.ClientObject.analyseGraph(target, tabCatalyst)
        objectReferences.ClientObject.syncLayouts(target)
    }
*/
    
};