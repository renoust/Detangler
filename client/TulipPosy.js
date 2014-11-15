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

    var path = $('#files').val().split('\\');
    var name = path[path.length - 1].split('.')[0];

    if (!originalJSON){
        TP.Context().InterfaceObject.setHeaderMenu();
    }


    // parameter: [type, {attrs}, {attrs_child}, labelprec, labelsuiv]
    // types:   0:select    3:textfield     6:text
    //          1:radio     4:slider
    //          2:checkbox  5:spinner
    
    if(name){
        name = name + ' - ';
    }
    var viewGraphSubstrate = new TP.ViewGraphSubstrate({
        //id:viewIndex, 
        //interactorList:array1, 
        name:name + "substrate", 
        nodeColor:TP.Context().defaulNodeColor,
        linkColor:TP.Context().defaultLinkColor,
        backgroundColor:TP.Context().defaultBackgroundColor,
        labelColor:TP.Context().defaultLabelColor,
        nodeShape:"rect", 
        type:"substrate"
    });

    viewGraphSubstrate.addView();
    viewGraphSubstrate.buildLinks();


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
            TP.ObjectReferences().ClientObject.loadData(recievedGraph, viewGraphSubstrate.getID());
        } else if ('file' in originalJSON) {
            TP.ObjectReferences().ClientObject.loadData(originalJSON.file, viewGraphSubstrate.getID());
        } else TP.ObjectReferences().ClientObject.loadData(null, viewGraphSubstrate.getID());
    }
    else {
        TP.ObjectReferences().ClientObject.loadData(null, viewGraphSubstrate.getID())
    }

	TP.Context().getController().sendMessage('getPlugins', {pluginType:"layout",endHandler:TP.Context().updateTulipLayoutAlgorithms})
	TP.Context().getController().sendMessage('getPlugins', {pluginType:"double",endHandler:TP.Context().updateTulipDoubleAlgorithms})

    /*if ($('#analyse').is(':checked')) {
        ['Bipartite analysis', '', {click: function () {
            __g__.getController().sendMessage("analyseGraph", (function(){
                var params = __g__.viewGraphCatalystParameters()
                params.idSourceAssociatedView = __g__.getID();
                return {
                    viewIndex: __g__.getID(), 
                    viewGraphCatalystParameters: params
                }
            })())
        }}, "Open View"],

        viewGraphSubstrate.getController().sendMessage("analyseGraph", (function(){
            var params = viewGraphSubstrate.viewGraphCatalystParameters()
            params.idSourceAssociatedView = viewGraphSubstrate.getID();
            return {
                viewIndex: viewGraphSubstrate.getID(), 
                viewGraphCatalystParameters: params
            }
        })());
        //{viewIndex: viewGraphSubstrate.getID(), viewGraphCatalystParameters: viewGraphSubstrate.viewGraphCatalystParameters()});
    }
    if ($('#sync').is(':checked')) {
        TP.ObjectReferences().ClientObject.syncLayouts(viewGraphSubstrate.getID())
    }*/

    $('#tile').click(function(){
        if(TP.Context().currentOrientation == "horizontal")
        {
            TP.Context().currentOrientation = "vertical";
        }else{
            TP.Context().currentOrientation = "horizontal";            
        }   
        TP.Context().InterfaceObject.tileViews();
    })
    
    $("#saveSVG").click(function(){
        TP.Context().InterfaceObject.throwAnnouncement("Warning","Coming soon...")
    })
    
    $("#saveJSON").click(function(){
        TP.Context().InterfaceObject.throwAnnouncement("Warning","Coming soon...")
    })

    $("#saveGEXF").click(function(){
        TP.Context().InterfaceObject.throwAnnouncement("Warning","Coming soon...")
    })
    //TP.Context().InterfaceObject.tileViews();

    //check if Google Chrome browser is used, if not, warn the user
     if(!window.chrome){
        TP.Context().InterfaceObject.throwAnnouncement("Warning","This application is optimized for Google Chrome browser. If you see this message, please "+
            "use Google Chrome or... run you fools.")
    }


};
