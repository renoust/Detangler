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
import_class("Controller.js", 'TP')

var TulipPosy = function (originalJSON) {

    var objectReferences = TP.ObjectReferences();
    var contxt = TP.Context();

    $.fn.jPicker.defaults.images.clientPath='css/jPicker/';

    //assert(new testView(5, 3), "test réusssie"); //test nombre view
/*
	var target = 'toto';
	var target1 = 'tutu';
	var target2 = 'titi';
*/

	var nav = (navigator.userAgent).toLowerCase().indexOf("chrome");
	
	if(nav == -1){
		//notification
	}
	
	
	TP.Context().clearInterface();

	var target = ""+TP.Context().getIndiceView();
	var target1 = ""+TP.Context().getIndiceView();
	var target2 = ""+TP.Context().getIndiceView();
/*	
	var targetMap = new Object();
	var target1Map = new Object();
	var target2Map = new Object();
*/

	var targetMap = [];
	var target1Map = [];
	var target2Map = [];
	
	var path = $('#files').val().split('\\');
    var name = path[path.length-1].split('.')[0];

	
	// assert(false, "target :")
	// console.log(target);
	// console.log(typeof(target));
	
	// assert(false, "target1 :")
	// console.log(target1);
	// console.log(typeof(target1))
	
	var type1 = "toto";
	var type2 = "titi";
	var type3 = "tata";
	var type4 = "tutu";
	var type5 = "tete";
	var type6 = "tyty";
	var type7 = "tt";
	


	/*objectReferences.InterfaceObject.createMenu(3);
    objectReferences.InterfaceObject.apiVisu("menu-3");*/
    var paramSizeMap = [
        //['input',{type:'text', name:'valMin', value:''},'min: '],
        //['input',{type:'text', name:'valMax', value:''},'max: '],
        ['div',{id:'sizemap',class:'slider'}, 'scale: ']
    ]
	
	var array1 = [
	
	    ['b1','Induced subgraph','',{click:function(){TP.Context().view[target].getController().sendMessage("sendSelection", {json:objectReferences.ClientObject.getSelection(target), idView:target})}}, type1],
        ['b2','Force layout', '',{click:function(){TP.Context().view[target].getController().sendMessage('callLayout', {layoutName:'FM^3 (OGDF)', idView:target})}}], 
        // ['b3','circular layout','',{click:function(){objectReferences.ClientObject.callLayout('Circular', target)}}],
        ['b4','Delete selection','',{click:function(){objectReferences.InteractionObject.delSelection(target)}}, type1],
        // ['b5','random layout','',{click:function(){objectReferences.ClientObject.callLayout('Random', target)}}],
        ['b6','Reset view','',{click:function(){TP.Context().view[target].getController().sendMessage('resetView');}}, type1],
        ['b7','Degree','',{click:function(){TP.Context().view[target].getController().sendMessage("callFloatAlgorithm",{floatAlgorithmName:'Degree', idView:target})}}, type1],	
        ['b8','Btw. centrality','',{click:function(){TP.Context().view[target].getController().sendMessage("callFloatAlgorithm",{floatAlgorithmName:'Betweenness Centrality',idView:target})}}, type2],
        ['b9','Analyse','',{click:function(){TP.Context().view[target].getController().sendMessage("analyseGraph",{target:target, tabCatalyst:tabCatalyst})}}, type2],
        ['b10','Reset size','',{click:function(){TP.Context().view[target].getController().sendMessage("resetSize")}}, type2],
        ['b11','Hide labels','',{click:function(){TP.Context().view[target].getController().sendMessage("Hide labels")}}, type2],
        ['b12','Hide links','',{click:function(){TP.Context().view[target].getController().sendMessage("Hide links")}}, type2],
        // ['b13','node information','',{click:function(){objectReferences.InterfaceObject.attachInfoBox()}}],
        ['b14','Sync layouts','',{click:function(){objectReferences.ClientObject.syncLayouts(target)}}, type2],
        ['b15','Arrange labels','',{click:function(){TP.Context().view[target].getController().sendMessage("arrangeLabels")}}, type2],
        // ['b16','labels forward','',{click:function(){objectReferences.VisualizationObject.bringLabelsForward(target)}}],
        ['b17','Rotation','',{click:function(){TP.Context().view[target].getController().sendMessage("rotateGraph")}}, type3],
        ['b18','BarChart','',{click:function(){TP.Context().view[target].getController().sendMessage("drawBarChart",{smell:'base'})}}, type3],
        ['b19','BarChart_rotate','',{click:function(){TP.Context().view[target].getController().sendMessage("drawBarChart",{smell:'rotate'})}}, type3],
        ['b20','ScatterPlot','',{click:function(){TP.Context().view[target].getController().sendMessage("drawScatterPlot")}}, type3],
        ['b21','Size Map',paramSizeMap, {call:function(scales){TP.Context().view[target].getController().sendMessage("sizeMapping", {parameter:'viewMetric', idView:contxt.activeView, scales:scales})}}, type3],
        ['b22','zoomIn','', {click:function(){TP.Context().view[target].getController().sendMessage("runZoom", {wheelDelta:120, mousePos:[TP.Context().width/2,TP.Context().height/2]})}}, type3],
        ['b23','zoomOut','', {click:function(){TP.Context().view[target].getController().sendMessage("runZoom", {wheelDelta:-120, mousePos:[TP.Context().width/2,TP.Context().height/2]})}}, type3]	
	
	]
	
	
	var array2 = [
	
        ['b1','force layout','',{click:function(){TP.Context().view[target1].getController().sendMessage('callLayout', {layoutName:'FM^3 (OGDF)', idView:target1})}}, type4],
        ['b2','Update layout','',{click:function(){objectReferences.ClientObject.updateLayout(target1)}}, type4],
        // ['b3','random layout','',{click:function(){objectReferences.ClientObject.callLayout('Random',target1)}}],
        // ['b4','reset view','',{click:function(){objectReferences.VisualizationObject.resetView(target1)}}],

        ['b5','Degree','',{click:function(){TP.Context().view[target1].getController().sendMessage("callFloatAlgorithm",{floatAlgorithmName:'Degree', idView:target1})}}, type4],
        ['b6','Btw. centrality','',{click:function(){TP.Context().view[target1].getController().sendMessage("callFloatAlgorithm",{floatAlgorithmName:'Betweenness Centrality',idView:target1})}}, type4],
        ['b7','Reset size','',{click:function(){TP.Context().view[target1].getController().sendMessage("resetSize")}}, type4],
        ['b8','Hide labels','',{click:function(){TP.Context().view[target1].getController().sendMessage("Hide labels")}}, type4],
        ['b9','Hide links','',{click:function(){TP.Context().view[target1].getController().sendMessage("Hide links")}}, type5],
        // ['b10','Node information','',{click:function(){objectReferences.InterfaceObject.attachInfoBox(target1)}}],
        ['b11','Operator ' + TP.Context().tabOperator["catalyst"],'',{click:function(){objectReferences.InteractionObject.toggleCatalystSyncOperator(target1)}}, type5],
        ['b12','Weight mapping','',{click:function(){objectReferences.VisualizationObject.sizeMapping('weight', target1)}}, type5],
        ['b13','Ent. mapping','',{click:function(){objectReferences.VisualizationObject.sizeMapping('entanglementIndice', target1)}}, type5],
        //['b14','ent. color','',{click:function(){objectReferences.VisualizationObject.colorMapping('entanglementIndice', target1)}}],
        //['b15','computeMatrix','',{click:function(){objectReferences.VisualizationObject.buildEdgeMatrices()}}],
        ['b16','Arrange labels','',{click:function(){TP.Context().view[target1].getController().sendMessage("arrangeLabels")}}, type6],
        ['b17','Rotation','',{click:function(){TP.Context().view[target1].getController().sendMessage("rotateGraph")}}, type6],
        ['b18','zoomIn','', {click:function(){TP.Context().view[target1].getController().sendMessage("runZoom", {deltaZoom:120, mousePos:[TP.Context().width/2,TP.Context().height/2]})}}, type6],
        ['b19','zoomOut','', {click:function(){TP.Context().view[target1].getController().sendMessage("runZoom", {deltaZoom:-120, mousePos:[TP.Context().width/2,TP.Context().height/2]})}}, type6],
        ['b20','BarChart','',{click:function(){TP.Context().view[target1].getController().sendMessage("drawBarChart",{smell:'base'})}}, type6],
        ['b21','BarChart_rotate','',{click:function(){TP.Context().view[target1].getController().sendMessage("drawBarChart",{smell:'rotate'})}}, type6],
        ['b22','ScatterPlot','',{click:function(){TP.Context().view[target1].getController().sendMessage("drawScatterPlot")}}, type6],        
	
	]
	
	
	var array3 = [

        ['b1','fg ' + contxt.combined_foreground,'',{click:function(){objectReferences.InterfaceObject.toggleCombinedForeground()}}, type7],
        ['b12','arrange labels' + contxt.combined_foreground,'',{click:function(){objectReferences.VisualizationObject.arrangeLabels(target2)}}, type7]
	
	]
	


	var tabCatalyst = new Array();


    TP.Context().view[target] = new TP.View(target, 1, array1, new Array("svg", "graph", 960, 500, "svg_"+target), name+" - substrate", "#a0522d", "#808080", "#FFFFFF", "rect", "substrate", null);
    TP.Context().view[target].addView();
    TP.Context().view[target].buildLinks();


	tabCatalyst = new Array(target1, array2, new Array("svg", "graph", 960, 500, "svg_"+target1), name+" - catalyst", "#4682b4", "#808080", "#FFFFFF", "circle", "catalyst");


    $('#undo').click(function(){TP.Context().changeStack.undo();});
    $('#redo').click(function(){TP.Context().changeStack.redo();});    


// Event toggle sidebars

    $('span.toggleButton').click(function(e){

        var src = event.srcElement.parentNode;
        var menuNum = src.id.split('-')[1];
        var menu = $('#menu-'+menuNum);
        var parent = src.parentNode;
        var button = $(this);
        
        if(parent.className==='nosidebar'){
            button.css('background', "url(css/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png) 50% 50% repeat-x")
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
                button.css('background', "url(css/smoothness/images/ui-bg_highlight-soft_75_cccccc_1x100.png) 50% 50% repeat-x")
                parent.className = 'nosidebar';
                $('.cont').each(function(){
                    $(this).css('z-index',0)
                    $(this).css('left',-252)
                })
            }
            else{
                $('.toggleButton').each(function(){ 
                    $(this).text('>') 
                    $(this).css('background', "url(css/smoothness/images/ui-bg_highlight-soft_75_cccccc_1x100.png) 50% 50% repeat-x")
                })
                $('.cont').each(function(){ $(this).css('z-index',101) })
                menu.css('z-index',102);
                button.text('<')
                button.css('background', "url(css/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png) 50% 50% repeat-x")
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
        TP.Context().view[target].getController().sendMessage("analyseGraph",{target:target, tabCatalyst:tabCatalyst});
    }
    if($('#sync').is(':checked')){
        objectReferences.ClientObject.syncLayouts(target)
    }


    
};