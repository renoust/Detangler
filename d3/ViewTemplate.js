//pile de gestion d'Etat

var TP = TP || {};


(function () {

    //parameters {id:id, name:name, type:type, idSourceAssociatedView:idSourceAssociatedView, interactorList:interactorList}

    var ViewTemplate = function (parameters) {
    var __g__ = this;
    
        //checking parameters
             
        if (!('id' in parameters))
            parameters.id = String(TP.Context().getIndiceView());
        
        if (!('name' in parameters)) 
            parameters.name = "View"+id;
        
        if (!('type' in parameters))
            parameters.type = null;
        
        if (!('idSourceAssociatedView' in parameters))
            parameters.idSourceAssociatedView = null;
        
        if(!('interactorList' in parameters))
            parameters.interactorList = null;
        
        
        
        
        var __g__ = this;
        
        __g__.controller = new TP.Controller();
        __g__.tabLinks = new Object();
        __g__.graphDrawing = null;
        __g__.ID = parameters.id;
        __g__.viewInitialized = null;
        __g__.name = parameters.name;
        __g__.typeView = parameters.type;
        __g__.svg = null;
        __g__.hashInteractorList = new Object();
        __g__.dialog = null;
        __g__.titlebar = null;
        __g__.idSourceAssociatedView = parameters.idSourceAssociatedView;


        //loads hash of interactors
        if (parameters.interactorList != null) {

            var end = parameters.interactorList.length;

            for (var p = 0; p < end; p++) {
                if (__g__.hashInteractorList[parameters.interactorList[p][3]] != null) {
                    __g__.hashInteractorList[parameters.interactorList[p][3]].push(parameters.interactorList[p]);
                }
                else {
                    __g__.hashInteractorList[parameters.interactorList[p][3]] = [];
                    __g__.hashInteractorList[parameters.interactorList[p][3]].push(parameters.interactorList[p]);
                }
            }
        }


        var sourceSelection = null;
        var targetSelection = null;

        __g__.getSourceSelection = function () {
            return sourceSelection;
        }

        __g__.setSourceSelection = function (_selection) {
            sourceSelection = _selection;
        }

        __g__.getTargetSelection = function () {
            return targetSelection;
        }

        __g__.setTargetSelection = function (_selection) {
            targetSelection = _selection;
        }

        __g__.interactorListTreatment = function () {

            if (__g__.typeView === "substrate") {
                TP.ObjectReferences().InterfaceObject.interactionPane(__g__.hashInteractorList, 'create');
                TP.ObjectReferences().InterfaceObject.infoPane();
                TP.ObjectReferences().InterfaceObject.visuPane(__g__.hashInteractorList,'create');
                TP.ObjectReferences().InterfaceObject.togglePanelMenu();
            }
        }

        __g__.getSvg = function () {
            return __g__.svg;
        }

        __g__.getGraphDrawing = function () {
            return __g__.graphDrawing;
        }

        __g__.getTabLinks = function () {
            return __g__.tabLinks;
        }

        __g__.viewInitialized = function () {
            return __g__.viewInitialized;
        }

        __g__.getName = function () {
            return __g__.name;
        }

        __g__.getID = function () {
            return __g__.ID;
        }

        __g__.addAssociatedView = function (linkType, view) {
            if (__g__.tabLinks[linkType] != null) {
                __g__.tabLinks[linkType].push(view);
            }
            else {
                __g__.tabLinks[linkType] = new Array();
                __g__.tabLinks[linkType].push(view);
            }
        }


        __g__.getAssociatedView = function (linkType) {
            if (__g__.tabLinks[linkType] != null) {
                if (__g__.tabLinks[linkType].length != 0)
                    return __g__.tabLinks[linkType];
                else
                    return null;
            }
            else
                return null;
        }

        __g__.getType = function () {
            return __g__.typeView;
        }

        __g__.getController = function () {
            return __g__.controller;
        }


        __g__.updateLinks = function (idSourceAssociatedView)
        {
            if (__g__.idSourceAssociatedView != null) {
                var tmp = TP.Context().view[idSourceAssociatedView];
                tmp.addAssociatedView(__g__.typeView, __g__);
                __g__.addAssociatedView(tmp.getType(), tmp);
            }
        }

        __g__.buildLinks = function () {
            if (__g__.idSourceAssociatedView != null) {

                if (__g__.typeView !== "combined") {
                    var tmp = TP.Context().view[__g__.idSourceAssociatedView];
                    tmp.addAssociatedView(__g__.typeView, __g__);
                    __g__.addAssociatedView(tmp.getType(), tmp);
                }
                else {
                    var tmp1 = TP.Context().view[__g__.idSourceAssociatedView[0]];
                    var tmp2 = TP.Context().view[__g__.idSourceAssociatedView[1]];

                    tmp1.addAssociatedView(__g__.typeView, __g__);
                    tmp2.addAssociatedView(__g__.typeView, __g__);
                    __g__.addAssociatedView(tmp1.getType(), tmp1);
                    __g__.addAssociatedView(tmp2.getType(), tmp2);

                }
            }
        }


        __g__.createDialog = function () {

            var dialogTop = 235;
            var dialogRight = 260;
            if (__g__.typeView === "substrate") {
                TP.Context().activeView = __g__.ID;
                dialogTop = 16;
                dialogRight = 400;
            }
            else if (__g__.typeView === "catalyst") {
                dialogTop = 16;
                dialogRight = 100;
            }


            $("<div/>", {id: "zone" + __g__.ID, title: __g__.name}).appendTo("html");

            __g__.dialog = $("[id=zone" + __g__.ID + "]");
            __g__.dialog.dialog({
                id: "btn-cancel",
                height: TP.Context().dialogHeight,
                width: TP.Context().dialogWidth,
                position: "right-" + dialogRight + " top+" + dialogTop, 
            }).parent().resizable({
                    containment: "#container"
                }).draggable({
                    containment: "#container",
                    opacity: 0.70
                });

            __g__.titlebar = __g__.dialog.parents('.ui-dialog').find('.ui-dialog-titlebar');
            __g__.titlebar.dblclick(function () {
                if (__g__.typeView === "substrate") {
                    dialogTop = 26;
                    dialogRight = 600;
                }
                else if (__g__.typeView === "catalyst") {
                    dialogTop = 26;
                    dialogRight = 100;
                }
                else {
                    dialogTop = 240;
                    dialogRight = 260;
                }

                var fullheight = $('#container').height() - 2;
                var fullwidth = $('#container').width() - 3;
                if (__g__.dialog.parent().width() != fullwidth) {

                    __g__.dialog.dialog({
                        width: fullwidth,
                        height: fullheight,
                        position: ["left+" + 8, "top+" + 16],
                    });
                }
                else {

                    __g__.dialog.dialog({
                        width: TP.Context().dialogWidth,
                        height: TP.Context().dialogHeight,
                        position: "right-" + dialogRight + " top+" + dialogTop,
                    });
                }
            });


            if (__g__.typeView === "substrate") {
                __g__.titlebar.css('background', "url(css/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png) 50% 50% repeat-x")
            }


            __g__.dialog.parent().click(function () {
                var oldID = TP.Context().activeView
                TP.Context().activeView = __g__.ID;
                //console.log("hashbuttons: ", __g__.hashButton)
                if (oldID != TP.Context().activeView) {
                    TP.Context().InterfaceObject.interactionPane(__g__.hashInteractorList, 'update')
                    TP.Context().InterfaceObject.visuPane(__g__.hashInteractorList, 'update')
                }
                TP.Context().InterfaceObject.addInfoButton(__g__);
                TP.Context().InterfaceObject.attachInfoBox(__g__.ID)
                $('.ui-dialog-titlebar').each(function () {
                    $(this).css('background', "url(css/smoothness/images/ui-bg_highlight-soft_75_cccccc_1x100.png) 50% 50% repeat-x")
                })
                __g__.titlebar.css('background', "url(css/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png) 50% 50% repeat-x")
            });

            $("#zone" + __g__.ID).parent().appendTo("#container")

        }
    
            __g__.updateOtherViews = function(obj, message){ //propagation of updateEvent
                
                var tabLinks = __g__.getTabLinks();    
                
                var data = (obj.associatedData.data != null) ? obj.associatedData.data:null;
                var source = obj.associatedData.source;
                    
                for(var key in tabLinks)
                {
                    for(var i = 0; i < tabLinks[key].length; i++)
                    {
                        if(tabLinks[key][i].getID() != source){ //we check if the view we are going to send message isn't the source view'
                                                        
                            //check sended Data
                            
                            __g__.controller.sendMessage("updateView", {type:obj.associatedData.type, data:data}, tabLinks[key][i].getID());        
                        }
                    }
                }
            }
       
        
            __g__.modifUpdate = null;
            
       
       
           __g__.updateView = function(event){
                   __g__.modifUpdate();
                   __g__.updateOtherViews(event, true);
           }      
        
        __g__.removeViewTemplate = function () {

            d3.select("#zone" + __g__.ID).remove();

            __g__.controller.remove();
            __g__.controller = null;
            __g__.tabLinks = null;
            __g__.graphDrawing = null;
            __g__.ID = null;
            __g__.viewInitialized = null;
            __g__.name = null;
            __g__.typeView = null;
            __g__.svg = null;
            __g__.hashInteractorList = null;
            __g__.dialog = null;
            __g__.titlebar = null;
            __g__.idSourceAssociatedView = null;

        }
        
        __g__.addView = function () {
        }

        return __g__;
    }

    TP.ViewTemplate = ViewTemplate;
    
})(TP);
