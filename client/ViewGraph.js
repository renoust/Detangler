//pile de gestion d'Etat

var TP = TP || {};
(function () {

    // {id:id, name:name, type:type, idSourceAssociatedView:idSourceAssociatedView, interactorList:interactorList}
    var ViewGraph = function (parameters) {
        
        //id, bouton, name, nodeColor, linkColor, backgroundColor, labelColor, nodeShape, type, idAssociation

        var __g__ = new TP.ViewTemplate(parameters);
        
        if(!('nodeColor' in parameters) || parameters.nodeColor === undefined)
            parameters.nodeColor = "steelblue"
            
        if(!('linkColor' in parameters) || parameters.linkColor === undefined)
            parameters.linkColor = "lightgrey"
            
        if (!('backgroundColor' in parameters) || parameters.backgroundColor === undefined)
            parameters.backgroundColor = "white"

        if (!('labelColor' in parameters) || parameters.labelColor === undefined)
            parameters.labelColor = "black"
            
        //todo rename viewNodes to nodeShape
        if (!('nodeShape' in parameters) || parameters.nodeShape === undefined)
            parameters.nodeShape = null
         

        __g__.nodesColor = parameters.nodeColor;
        __g__.linksColor = parameters.linkColor;
        __g__.bgColor = parameters.backgroundColor;
        __g__.labelsColor = parameters.labelColor;
        
        __g__.viewNodes = parameters.nodeShape;
        __g__.lasso = null;
        __g__.dataTranslation = null;

        __g__.selectMode = null;
        __g__.moveMode = null;
        __g__.showLabels = null;
        __g__.showLinks = null;
        __g__.nodeInformation = null;

        __g__.metric_BC = null;
        __g__.metric_SP = null;
        __g__.combined_foreground = null;
        __g__.acceptedGraph = [];
        __g__.graph = null;
        
        __g__.updateEventHandler = new TP.UpdateEventHandler("graph", __g__.ID);
        
        __g__.getGraph = function () {
            return __g__.graph;
        }

        __g__.getDataTranslation = function () {
            return __g__.dataTranslation;
        }

        __g__.setDataTranslation = function (value) {
            __g__.dataTranslation = value;
        }


        __g__.setMetric_BC = function (value) {
            __g__.metric_BC = value;
        }

        __g__.getMetric_BC = function () {
            return __g__.metric_BC;
        }

        __g__.setMetric_SP = function (value) {
            __g__.metric_SP = value;
        }

        __g__.getMetric_SP = function () {
            return __g__.metric_SP;
        }

        __g__.setLasso = function (value) {
            __g__.lasso = value;
        }

        __g__.getLasso = function (value) {
            return __g__.lasso;
        }

        __g__.getNodesColor = function () {
            return __g__.nodesColor;
        }

        __g__.setNodesColor = function (value) {
            __g__.nodesColor = value;
        }

        __g__.getLinksColor = function () {
            return __g__.linksColor;
        }

        __g__.setLinksColor = function (value) {
            __g__.linksColor = value;
        }

        __g__.getBgColor = function () {
            return __g__.bgColor;
        }

        __g__.setBgColor = function (value) {
            __g__.bgColor = value;
        }

        __g__.getLabelsColor = function () {
            return __g__.labelsColor;
        }

        __g__.setLabelsColor = function (value) {
            __g__.labelsColor = value;
        }

        __g__.getViewNodes = function () {
            return __g__.viewNodes;
        }

        __g__.getSelectMode = function () {
            return __g__.selectMode;
        }

        __g__.setSelectMode = function (value) {
            __g__.selectMode = value;
        }

        __g__.getMoveMode = function () {
            return __g__.moveMode;
        }

        __g__.setMoveMode = function (value) {
            __g__.moveMode = value;
        }

        __g__.getShowLabels = function () {
            return __g__.showLabels;
        }

        __g__.setShowLabels = function (value) {
            __g__.showLabels = value;
        }


        __g__.getShowLinks = function () {
            return __g__.showLinks;
        }

        __g__.setShowLinks = function (value) {
            __g__.showLinks = value;
        }

        __g__.getNodeInformation = function () {
            return __g__.nodeInformation;
        }

        __g__.setNodeInformation = function (value) {
            __g__.nodeInformation = value;
        }

        __g__.addView = function () {

            //controller = new TP.Controller();
            if (__g__.controller != null)
                __g__.controller.initController(__g__.ID, "view");

            //TP.Context().setStypeEventByDefault(ID);
            __g__.interactorListTreatment();

            var elem = document.getElementById("bouton" + __g__.ID);
            if (elem) elem.parentNode.removeChild(elem);
            elem = $("div[aria-describedby='zone" + __g__.ID + "']");
            //console.log(elem)
            if (elem != [])elem.remove();


            /**************************
             * Views
             **************************/

            /****  création du dialog ****/

            __g__.createDialog();

            /****   en-tête du dialog   ****/


            /*$("<button/>", {text:"-"}).appendTo(titlebar).button().click(function() {dialog.toggle();});        */
            $("<button/>", {id: "toggle" + __g__.ID, text: "Move", style: 'right:15px'}).appendTo(__g__.titlebar);

            var minWidth = __g__.dialog.parents('.ui-dialog').find('.ui-dialog-title').width()
            __g__.dialog.parents('.ui-dialog').find('.ui-button').each(function () {
                minWidth += $(this).width()
            })
            __g__.dialog.dialog({minWidth: minWidth + 25})

            $('#toggle' + __g__.ID).button().click(function (_event) {
                var interact = $(this).button("option", "label");
                if (interact == "Move") {
                    $(this).button("option", "label", "Select");
                    __g__.controller.sendMessage(interact)             
                }
                else {
                    $(this).button("option", "label", "Move");
                    __g__.controller.sendMessage(interact)
                }
                //TP.Context().stateStack[ID].executeCurrentState();
                //TP.ObjectReferences().InterfaceObject.toggleSelectMove(__g__.ID);
            });


            $('#toggle' + __g__.ID).attr("idView", __g__.ID);

            //$("#toggle"+ID).click(function(_event){_event.type = tabTypeEvent["toggle"+ID]; $("#principalController").trigger(tabTypeEvent["toggle"+ID], [{type:_event.type, viewBase:_event.data}, _event]);})

            if(__g__.viewNodes == null) __g__.viewNodes = "rect";

            __g__.dataTranslation = [0, 0];
            //TP.Context().tabNodeColor[target] = nodesC;
            //TP.Context().tabLinkColor[target] = linksC;
            //TP.Context().tabBgColor[target] = bgC;

            __g__.selectMode = false;
            __g__.moveMode = true;
            __g__.showLabels = true;
            __g__.showLinks = true;
            __g__.nodeInformation = true;

            //TP.Context().tabSvg["svg_"+target] = d3.select("#zone" + target)
            __g__.svg = d3.select("#zone" + __g__.ID)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("id", "svg" + __g__.ID)
                .attr("idView", __g__.ID);


                    //TP.Interaction().createLasso(__g__.ID);
                    //TP.Interaction().addZoom(ID);
                    //TP.Interface().toggleSelectMove(__g__.ID);


            //.attr("viewBox", "0 0 500 600");

            TP.Context().tabGraph["graph_" + __g__.ID] = new TP.Graph();
            __g__.graph = TP.Context().tabGraph["graph_" + __g__.ID];


//            TP.Interaction().createLasso(__g__.ID);
            //TP.Interaction().addZoom(ID);
            //TP.Interface().toggleSelectMove(__g__.ID);

            //TP.Context().tabType[target] = typeView;

            if(__g__.typeView == "combined"){
                __g__.combined_foreground = "substrate";
            }

            __g__.viewInitialized = 1;

            __g__.graphDrawing = new TP.GraphDrawing(__g__.graph, __g__.svg, __g__.ID);


            __g__.lasso = d3.custom.Lasso()




            __g__.controller.addEventState("simpleSelectionMadeView", function(_event){
                TP.Interaction().updateViewFromSimpleSelection(__g__.getID(), _event.associatedData.selection);
            });


            __g__.controller.addEventState("Move",  function (_event) {/*assert(true, "move");*/
                //deactivate the lasso
                __g__.svg.on('mouseover', null);
                __g__.lasso.reset();

                //TP.Interaction().removeLasso(_event);
                TP.Interaction().addMove(_event);

            }, {bindings:["movingZoomDrag"], fromAll:true, useless:null, activate:true});

            __g__.controller.addEventState("Select",  function (_event) {
                //activates the lasso
                __g__.lasso.on("brushDrawStart", function(d, i){ console.log("brushDrawStart"); })
                    .on("brushDrawMove", function(d, i){ console.log("brushDrawMove"); })
                    .on("brushDrawEnd", function(d, i){ __g__.getController().sendMessage("simpleSelectionMadeView", {selection: d.data(), idView:__g__.getID()}); })
                    .on("brushDragStart", function(d, i){ console.log("brushDragStart"); })
                    .on("brushDragMove", function(d, i){ __g__.getController().sendMessage("simpleSelectionMadeView", {selection: d.data(), idView:__g__.getID()}); })
                    .on("brushDragEnd", function(d, i){ __g__.getController().sendMessage("simpleSelectionMadeView", {selection: d.data(), idView:__g__.getID()}); });

                __g__.svg.on('mouseover', function(d, i){
                    var nodeSelection = __g__.svg.selectAll('.glyph .node');
                    __g__.lasso.shapes(nodeSelection);
                })

                __g__.svg.call(__g__.lasso);

                //TP.Interaction().addLasso(_event);
                TP.Interaction().removeMove(_event);
                TP.Interaction().addZoom(_event);
                //TP.Interaction().removeZoom(_event)

            }, {bindings:["mousemoveLasso"], fromAll:true, useless:null, activate:true});


            __g__.controller.addEventState("nodeSelected", function (_event) {/*assert(true, "nodeSelected");*/
                TP.Interaction().nodeSelected_deprecated(_event);
            }, {bindings:["emptySelection"], fromAll:true, useless:null, activate:true});

            __g__.controller.addEventState("emptySelection", function (_event) {/*assert(true, "selectionVide");*/
                TP.Interaction().emptyListAction(_event);
            }, {bindings:["nodeSelected", "sizeMapping"], fromAll:null, useless:null, activate:true});

            /*
            __g__.svg.on('mouseover', function(d, i){
                    var nodeSelection = d3.select(this).selectAll('.glyph .node');
                    __g__.lasso.shapes(nodeSelection);
                })*/

            //__g__.svg.call(__g__.lasso)

            __g__.controller.sendMessage("Select");

        }

        __g__.remove = function () {
            
            __g__.removeViewTemplate();
            __g__.updateEventHandler = null;

            __g__.nodesColor = null;
            __g__.linksColor = null;
            __g__.bgColor = null;
            __g__.labelsColor = null;
            __g__.viewNodes = null;
            __g__.lasso = null;
            __g__.dataTranslation = null;

            __g__.selectMode = null;
            __g__.moveMode = null;
            __g__.showLabels = null;
            __g__.showLinks = null;
            __g__.nodeInformation = null;

            __g__.metric_BC = null;
            __g__.metric_SP = null;
            __g__.combined_foreground = null;
            __g__.acceptedGraph = null;
            __g__.graph = null;
        }


         __g__.initStates = function () {

        }

        return __g__;
    }

    TP.ViewGraph = ViewGraph;
})(TP);
