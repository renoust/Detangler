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
	
    // parameter: [labelprec, type, labelsuiv]
    // types:   0:text
    //          1:slider
    var paramSizeMap = [['div',{id:'sizemap',class:'slider'}, 'scale: ']]
    var tl = [['input',{type:'text'}]];
    //var paramSizeMap = [['scale: ', 0]]
	
	var array1 = [
        ['Data', '',{click:function(){objectReferences.VisualizationObject.drawDataBase(target)}}, "Open View"],
        ['Force layout', '',{click:function(){objectReferences.ClientObject.callLayout('FM^3 (OGDF)', target)}}, "Layout"],
        ['Sync layouts','',{click:function(){objectReferences.ClientObject.syncLayouts(target)}}, "Layout"],
        ['Tulip layout algorithm',tl,{call:function(layout){objectReferences.ClientObject.callLayout(layout.text0,target)}}, "Layout"],
        // ['b20','MDS layout', '',{click:function(){objectReferences.ClientObject.callLayout('MDS', target)}}, "Layout"],

        ['Induced subgraph','',{click:function(){objectReferences.ClientObject.sendSelection(objectReferences.ClientObject.getSelection(target), target)}}, "Selection"],
        ['Delete selection','',{click:function(){objectReferences.InteractionObject.delSelection()}}, "Selection"],

        ['Center view','',{click:function(){objectReferences.VisualizationObject.resetView(target)}}, "View"],
        ['Reset size','',{click:function(){objectReferences.VisualizationObject.resetSize(target)}}, "View"],
        ['Hide labels','',{click:function(){objectReferences.VisualizationObject.showhideLabels(target)}}, "View"],
        ['Hide links','',{click:function(){objectReferences.VisualizationObject.showhideLinks(target)}}, "View"],
        ['Arrange labels','',{click:function(){objectReferences.VisualizationObject.arrangeLabels(target)}}, "View"],
        ['Rotation','',{click:function(){objectReferences.VisualizationObject.rotateGraph(target)}}, "View"],
        ['Size mapping',paramSizeMap, {call:function(scales){objectReferences.VisualizationObject.sizeMapping('viewMetric', contxt.activeView, scales) }}, "View"],
        ['Zoom in','', {click:function(){objectReferences.InteractionObject.runZoom(target, 120, [TP.Context().width/2,TP.Context().height/2])}}, "View"],
        ['Zoom out','', {click:function(){objectReferences.InteractionObject.runZoom(target, -120, [TP.Context().width/2,TP.Context().height/2])}}, "View"],

        ['Degree','',{click:function(){objectReferences.ClientObject.callFloatAlgorithm('Degree', target)}}, "Measure"],	
        ['Betweenness centrality','',{click:function(){objectReferences.ClientObject.callFloatAlgorithm('Betweenness Centrality',target)}}, "Measure"],
        ['Tulip measure',tl,{call:function(algo){objectReferences.ClientObject.callFloatAlgorithm(algo.text0,target)}}, "Measure"],

        ['Bipartite analysis','',{click:function(){objectReferences.ClientObject.analyseGraph(target, tabCatalyst)}}, "Open View"],
        ['Horizontal barchart','',{click:function(){objectReferences.VisualizationObject.drawBarChart(target,'base')}}, "Open View"],
        ['Barchart','',{click:function(){objectReferences.VisualizationObject.drawBarChart(target,'rotate')}}, "Open View"],
        ['Scatter plot','',{click:function(){objectReferences.VisualizationObject.drawScatterPlot(target)}}, "Open View"]

	]
	
    
	

	var array2 = [
        ['Data', '',{click:function(){objectReferences.VisualizationObject.drawDataBase(target1)}}, "Open View"],
        ['Force layout','',{click:function(){objectReferences.ClientObject.callLayout('FM^3 (OGDF)',target1)}}, "Layout"],
        ['Server update layout','',{click:function(){objectReferences.ClientObject.updateLayout(target1)}}, "Layout"],

        ['Operator ' + TP.Context().tabOperator["catalyst"],'',{click:function(){objectReferences.InteractionObject.toggleCatalystSyncOperator(target1)}}, "Selection"],

        ['Reset size','',{click:function(){objectReferences.VisualizationObject.resetSize(target1)}}, "View"],
        ['Hide labels','',{click:function(){objectReferences.VisualizationObject.showhideLabels(target1)}}, "View"],
        ['Hide links','',{click:function(){objectReferences.VisualizationObject.showhideLinks(target1)}}, "View"],
        ['Arrange labels','',{click:function(){objectReferences.VisualizationObject.arrangeLabels(target1)}}, "View"],
        ['Rotation','',{click:function(){objectReferences.VisualizationObject.rotateGraph(target1)}}, "View"],
        ['Zoom in','', {click:function(){objectReferences.InteractionObject.runZoom(target1, 120, [TP.Context().width/2,TP.Context().height/2])}}, "View"],
        ['Zoom out','', {click:function(){objectReferences.InteractionObject.runZoom(target1, -120, [TP.Context().width/2,TP.Context().height/2])}}, "View"],
        ['Size mapping',paramSizeMap, {call:function(scales){objectReferences.VisualizationObject.sizeMapping('viewMetric', contxt.activeView, scales) }}, "View"],
        
        ['Degree','',{click:function(){objectReferences.ClientObject.callFloatAlgorithm('Degree', target1)}}, "Measure"],
        ['Betweenness centrality','',{click:function(){objectReferences.ClientObject.callFloatAlgorithm('Betweenness Centrality', target1)}}, "Measure"],
        ['Weight mapping','',{click:function(){objectReferences.VisualizationObject.sizeMapping('weight', target1)}}, "Measure"],
        ['Entanglement mapping','',{click:function(){objectReferences.VisualizationObject.sizeMapping('entanglementIndice', target1)}}, "Measure"],
	]

	
	
	var array3 = [
        ['fg ' + contxt.combined_foreground,'',{click:function(){objectReferences.InterfaceObject.toggleCombinedForeground()}}, type3],
        ['arrange labels' + contxt.combined_foreground,'',{click:function(){objectReferences.VisualizationObject.arrangeLabels(target2)}}, type3]
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
	

    TP.Context().view[target] = new TP.View(target, 1, array1, new Array("svg", "graph", 960, 500, "svg_"+target), name+" - substrate", "#a0522d", "#808080", "#FFFFFF", "#000000","rect", "substrate", null);
    TP.Context().view[target].addView();
    TP.Context().view[target].buildLinks();


	tabCatalyst = new Array(target1, array2, new Array("svg", "graph", 960, 500, "svg_"+target1), name+" - catalyst", "#4682b4", "#808080", "#FFFFFF", "#000000","circle", "catalyst");




    $('#undo').click(function(){TP.Context().changeStack.undo();});
    $('#redo').click(function(){TP.Context().changeStack.redo();});    

    
    
// Event toggle sidebars
   
    $('div.toggleButton').click(function(e){
        var src = event.srcElement.parentNode.parentNode;
        console.log(src)
        var menuNum = src.id.split('-')[1];
        var menu = $('#menu-'+menuNum);
        console.log(menu)
        console.log($(src))
        var parent = src.parentNode;
        var button = $(this);
        if(parent.className==='nosidebar'){
            button.eq(0).toggleClass('open')
            /*button.text('<');*/
            $(parent).eq(0).toggleClass('nosidebar sidebar')
            //parent.className='sidebar';
            $('.cont').each(function(){
                $(this).css('left',0)
            })
            menu.css('z-index',102)
        }
        else if(parent.className==='sidebar'){
            
            if(menu.css('z-index')==102){
                /*button.text('>');*/
                button.eq(0).toggleClass('open')
                
                //console.log($(parent))
                $(parent).eq(0).toggleClass('nosidebar sidebar')
  //              parent.className = 'nosidebar';
                $('.cont').each(function(){
                    $(this).css('z-index',0)
                    $(this).css('left',-252)
                })
            }
            else{
                $('.toggleButton').each(function(){ 
                    /*$(this).text('>') */

                    console.log($(this).eq(0).className)
                    $(this).eq(0).removeClass('open')
                })
                $('.cont').each(function(){ $(this).css('z-index',101) })
                menu.css('z-index',102);
                /*button.text('<')*/
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
