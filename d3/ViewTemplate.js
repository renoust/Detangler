//pile de gestion d'Etat

var TP = TP || {};
(function () {







    var ViewTemplate = function (id, groupe, svgs, name, type, idAssociation, bouton) {

        var __g__ = this;

        __g__.tabDataSvg = svgs;
        __g__.controller = new TP.Controller();
        __g__.tabLinks = new Object();
        __g__.graphDrawing = null;
        __g__.ID = id;
        __g__.viewInitialized = null;
        __g__.name = name;
        __g__.typeView = type;
        __g__.svg = null;
        __g__.hashButton = new Object();
        __g__.dialog = null;
        __g__.titlebar = null;
        __g__.idAssociation = idAssociation;
        __g__.viewGroup = groupe;

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

        __g__.buttonTreatment = function () {
            if (bouton != null) {

                var end = bouton.length;

                for (var p = 0; p < end; p++) {
                    //console.log(bouton[p][3]);

                    if (__g__.hashButton[bouton[p][3]] != null) {
                        __g__.hashButton[bouton[p][3]].push(bouton[p]);
                    }
                    else {
                        __g__.hashButton[bouton[p][3]] = [];
                        __g__.hashButton[bouton[p][3]].push(bouton[p]);
                    }

                }
            }

            if (__g__.typeView === "substrate") {
                //console.log("boutons:", bouton)
                TP.ObjectReferences().InterfaceObject.interactionPane(__g__.hashButton, 'create');
                TP.ObjectReferences().InterfaceObject.infoPane();
                TP.ObjectReferences().InterfaceObject.visuPane();
            }


        }

        __g__.getGroup = function () {
            return __g__.viewGroup;
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

        __g__.setAssociatedView = function (linkType, view) {
            if (__g__.tabLinks[linkType] != null) {
                __g__.tabLinks[linkType].push(view);
            }
            else {
                __g__.tabLinks[linkType] = new Array();
                __g__.tabLinks[linkType].push(view);
            }

            //assert(false, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFUUUUUUUUUUUUULLLLLLLLLLLMMMMMMAAAAAAAAAAAJJJJJJJJJJJJ")
            //console.log("tabLinks : ", __g__.tabLinks)

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


        __g__.buildLinks = function () {
            if (__g__.idAssociation != null) {

                if (__g__.typeView !== "combined") {
                    var tmp = TP.Context().view[__g__.idAssociation];
                    tmp.setAssociatedView(__g__.typeView, __g__);
                    __g__.setAssociatedView(tmp.getType(), tmp);
                }
                else {
                    var tmp1 = TP.Context().view[__g__.idAssociation[0]];
                    var tmp2 = TP.Context().view[__g__.idAssociation[1]];

                    tmp1.setAssociatedView(__g__.typeView, __g__);
                    tmp2.setAssociatedView(__g__.typeView, __g__);
                    __g__.setAssociatedView(tmp1.getType(), tmp1);
                    __g__.setAssociatedView(tmp2.getType(), tmp2);

                }

                //console.log(TP.Context().view[__g__.idAssociation]);
            }

            if (__g__.typeView == "substrate") {
                TP.Context().GroupOfView[__g__.viewGroup] = [];
                TP.Context().GroupOfView[__g__.viewGroup]["substrate"] = __g__;
            }
            else {
                TP.Context().GroupOfView[__g__.viewGroup][__g__.typeView] = __g__;
            }

        }


        __g__.createDialog = function () {

            //assert(false, "tttttttttttttttttttttttttttttttttttype : " + __g__.typeView)

            if (__g__.typeView === "substrate") {
                TP.Context().activeView = __g__.ID;
                dialogTop = 16;
                dialogRight = 400;
            }
            else if (__g__.typeView === "catalyst") {
                dialogTop = 16;
                dialogRight = 100;
            }
            else {
                dialogTop = 235;
                dialogRight = 260;
            }

            //console.log("tppppppppppppppppp", dialogTop);

            $("<div/>", {id: "zone" + __g__.ID, title: name}).appendTo("html");

            __g__.dialog = $("[id=zone" + __g__.ID + "]");
            //console.log(dialog);
            //console.log('TOTO', __g__.dialog.parent())
            __g__.dialog.dialog({
                id: "btn-cancel",
                height: TP.Context().dialogHeight,
                width: TP.Context().dialogWidth,
                position: "right-" + dialogRight + " top+" + dialogTop, /*{my: "center", at: "center", of: "#container"}*/
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
                //console.log(dialog.parent().width() + " - " + fullwidth);
                //console.log(dialog.parent());
                if (__g__.dialog.parent().width() != fullwidth) {
                    //console.log(1);
                    __g__.dialog.dialog({
                        width: fullwidth,
                        height: fullheight,
                        position: ["left+" + 8, "top+" + 16],
                    });
                }
                else {
                    //console.log(2);
                    __g__.dialog.dialog({
                        width: TP.Context().dialogWidth,
                        height: TP.Context().dialogHeight,
                        position: "right-" + dialogRight + " top+" + dialogTop,
                    });
                }
                //console.log(TP.Context().dialogTop);

                //$(this).height()=fullheight;
            });


            if (__g__.typeView === "substrate") {
                __g__.titlebar.css('background', "url(css/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png) 50% 50% repeat-x")
            }


            __g__.dialog.parent().click(function () {
                var oldID = TP.Context().activeView
                TP.Context().activeView = __g__.ID;
                //console.log("hashbuttons: ", __g__.hashButton)
                if (oldID != TP.Context().activeView) {
                    TP.Context().InterfaceObject.interactionPane(__g__.hashButton, 'update')
                }
                TP.Context().InterfaceObject.addInfoButton(__g__);
                TP.Context().InterfaceObject.attachInfoBox()
                $('.ui-dialog-titlebar').each(function () {
                    $(this).css('background', "url(css/smoothness/images/ui-bg_highlight-soft_75_cccccc_1x100.png) 50% 50% repeat-x")
                })
                __g__.titlebar.css('background', "url(css/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png) 50% 50% repeat-x")


                /*console.log($.jPicker.List[0].color.active.val('hex'), __g__.nodesColor)
                 $.jPicker.List[0].color.active.val('hex', __g__.nodesColor);
                 $.jPicker.List[1].color.active.val('hex', __g__.linksColor);
                 $.jPicker.List[2].color.active.val('hex', __g__.bgColor);*/

                //TP.ObjectReferences().Interface().addInfoButton(ID);
            });

            $("#zone" + __g__.ID).parent().appendTo("#container")

        }


        __g__.removeViewTemplate = function () {

            d3.select("#zone" + __g__.ID).remove();

            __g__.controller.remove();
            __g__.tabDataSvg = null;
            __g__.controller = null;
            __g__.tabLinks = null;
            __g__.graphDrawing = null;
            __g__.ID = null;
            __g__.viewInitialized = null;
            __g__.name = null;
            __g__.typeView = null;
            __g__.svg = null;
            __g__.hashButton = null;
            __g__.dialog = null;
            __g__.titlebar = null;
            __g__.idAssociation = null;
            __g__.viewGroup = null;

        }

        __g__.addView = function () {
        }

        return __g__;
    }

    TP.ViewTemplate = ViewTemplate;
})(TP);