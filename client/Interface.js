/************************************************************************
 * This module is deprecated, it draws an interface onto the svg
 * window but for the clients needs, this interface was removed and
 * recreated with html elements.
 * @requires d3.js
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

var TP = TP || {};
(function () {


    var Interface = function () {
        //assert(false, 'Interface')
        var __g__ = this;
        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();

        // this.includeFormParam = function (target) {
        //     assert(false, 'Interface -> includeFormParam')

        //     myinput = svg.append("foreignObject")
        //         .attr("width", 100)
        //         .attr("height", 100)
        //         .append("xhtml:body")
        //         .html("<form><input type=checkbox id=check /></form>")
        //         .on("click", function (d, i) {
        //         });
        //     myinput = svg.append("foreignObject")
        //         .attr("width", 300)
        //         .attr("height", 100)
        //         .attr("x", 200)
        //         .attr("y", 200)
        //         .append("xhtml:body")
        //         .html("<form><input type=input id=input /></form>")
        // }


        // this.eraseAllInterface = function (target) {
        //     assert(false, 'Interface -> eraseAllInterface')

        //     var cGraph = null
        //     var svg = null

        //     svg = TP.Context().view[target].getSvg();
        //     cGraph = TP.Context().view[target].getGraph();

        //     var coh = svg.selectAll(".interfaceButton")
        //         .data([]).exit().remove()
        // }


        this.addInfoButton = function (target) {
            // assert(false, 'Interface -> addInfoButton')

            var cGraph = null;
            if (target.getType() in {'substrate':'', 'catalyst':''})
                cGraph = target.getGraph();
            else
                cGraph = TP.Context().view[target.idSourceAssociatedView].getGraph();

            var path = $('#files').val().split('\\');
            var file = path[path.length - 1];
            var view = target.getName().split('-');
            var type = view[view.length - 1];
            var nbElements = Object.keys(TP.Context().substrateProperties).length
            var formString = ""
            formString += "<p> GLOBAL INFORMATIONS: </p>" +
                "<ul>" +
                "<li> File : " + file + "</li>" +
                "<li> View : " + type + "</li>" +
                "<li> - " + cGraph.nodes().length + " nodes </li>" +
                "<li> - " + cGraph.links().length + " links </li>" +
                "</ul>"+
                "<form><select id=weightPropSel>" +
                " <option value=\"\"><i>--</i></option>";

            Object.keys(TP.Context().substrateProperties)
                .forEach(function (k, i) {
                    if (TP.Context().substrateProperties[k] == "number") {
                        if (k == TP.Context().substrateWeightProperty)
                            formString += " <option selected=\"selected\" value=\"" + k + "\">" + k + "</option>";
                        else
                            formString += " <option value=\"" + k + "\">" + k + "</option>";
                    }
                });
            formString += "</select></form>";

            formString += "<div id='scaleDiv' style='width:250px; height:20px'><svg width='100%' height='100%' class='scaleFrame'>"+
                "</svg></div>";






            $('#infoView').html(formString);

            var svgF = d3.selectAll("svg.scaleFrame")
            for (var i = 0; i <= 100 ; i++){
                svgF.append('rect')
                    .attr('x', function(){if (i==0){return 0}
                                            return 2*i + 10} )
                    .attr('y', 0)
                    .attr('height', 10)
                    .attr('fill-opacity', .5)
                    .attr('width', function()
                    {
                        if (i == 0 || i ==100){return 10}
                        else return 2;
                    }
                )
                    .attr('fill',function(){
                        var currentColor = "black"
                        var zeroColor = d3.rgb("white")
                        var oneColor = d3.rgb("purple")
                        //var inter = ['#FFFF00','#00FF00','#0000FF']
                        var inter = ['yellow','green','steelblue']
                        var index = i/100;
                        if (index < 1/3){ currentColor = inter[0];}
                        else if (index < 2/3){ currentColor = inter[1];}
                        else { currentColor = inter[2];}

                        currentColor = d3.hcl(currentColor)
                        currentColor.l = 99 *(1- index)
                        //currentIntensityColor.r = Math.round(currentIntensityColor.r * (1-TP.Context().entanglement_intensity))
                        //currentIntensityColor.g = Math.round(currentIntensityColor.g * (1-TP.Context().entanglement_intensity))
                        //currentIntensityColor.b = Math.round(currentIntensityColor.b * (1-TP.Context().entanglement_intensity))


                        if (index == 0){ currentColor = zeroColor; }
                        if (index == 1){ currentColor = oneColor;}
                        return currentColor;
                    }
                    )

            }

            d3.select('#weightPropSel').on("change", function () {
                TP.Context().substrateWeightProperty=d3.select("#weightPropSel")
                    .node()
                    .value;
                var cView = TP.Context().view[TP.Context().activeView];
                cView.setPreviousSourceSelection([]);
                cView.getController().sendMessage("nodeSelected", {selList: cView.getSourceSelection()});
                console.log("updating weight property: ", TP.Context().substrateWeightProperty);
            })
        }


        // this.selectWeightProperty = function (group) {
        //     assert(true, 'Interface -> selectWeightProperty')

        //     group.append("foreignObject")
        //         .attr("x", 10)
        //         .attr("y", 20)
        //         .attr("width", 200)
        //         .attr("height", 200)
        //         .append("xhtml:body")
        //         .html(function (d) {
        //             selectHTMLString = "<form><select id=weightPropSel>"
        //             selectHTMLString += " <option value=\"\"><i>--</i></option>"
        //             nbElements = Object.keys(TP.Context().substrateProperties).length
        //             Object.keys(TP.Context().substrateProperties)
        //                 .forEach(function (k, i) {
        //                     if (TP.Context().substrateProperties[k] == "number") {
        //                         selectHTMLString += " <option value=\"" + k + "\">" + k + "</option>"
        //                     }
        //                 });
        //             selectHTMLString += "</select></form>"
        //             return selectHTMLString
        //         })
        // }


        // this.holdSVGInteraction = function (target) {
        //     assert(true, 'Interface -> holdSVGInteraction')

        //     objectReferences.InteractionObject.removeZoom(target);
        //     objectReferences.InteractionObject.removeLasso(target);
        // }


        // This function toggles the 'select' and 'move' modes for the 
        // interactors
        // target, the string value of the target svg view
        this.toggleSelectMove = function (_event) {
//            if (!target) return
            
            var target = _event.associatedData.source;
            
            if(target==null)
                return;
            
            var view = null;
            view = TP.Context().view[target];

            var svg = null
            svg = view.getSvg();

            TP.Context().view[target].setSelectMode(!TP.Context().view[target].getSelectMode());
            TP.Context().view[target].setMoveMode(!TP.Context().view[target].getMoveMode());

            if (TP.Context().view[target].getSelectMode()) {
            //     svg.select('rect.moveButton').style('fill', TP.Context().defaultFillColor);
            //     svg.select('rect.selectButton').style('fill', TP.Context().highlightFillColor);
            //     objectReferences.InteractionObject.addLasso(target);
            //     view.getController().sendMessage("select"); //send Message "select" to the StateController
            //     objectReferences.InteractionObject.removeZoom(target);
            }
            if (TP.Context().view[target].getMoveMode()) {
            //     svg.select('rect.moveButton').style('fill', TP.Context().highlightFillColor);
            //     svg.select('rect.selectButton').style('fill', TP.Context().defaultFillColor);
            //     objectReferences.InteractionObject.removeLasso(target);
            //     objectReferences.InteractionObject.addZoom(target);
            //     view.getController().sendMessage("move");
            }
        }

        
        /* this.addSettingsButton = function (target) {
            objectReferences.InterfaceObject.holdSVGInteraction(target) //before, there was only substrate
            svg = TP.Context().view[target].getSvg();
            posSettings_x = TP.Context().width - 30
            posSettings_y = 30

            var btSettings = svg.selectAll("g.settings")
                .data(["@"])
                .enter()
                .append('g')
                .attr("class", "settings")
                .classed("interfaceButton", 1)
                .attr("transform", function () {
                    return "translate(" + posSettings_x + "," + posSettings_y+")";
                })

                btSettings.append("text")
                    .text(function (d) {
                        return "@"
                    })
                    .style("fill", "lightgray")
                    .style("font-family", "EntypoRegular")
                    .style("font-size", 50)
                    .on("mouseover", function () {
                        d3.select(this).style("fill", "black")
                    })
                    .on("mouseout", function () {
                        d3.select(this).style("fill", "lightgray")
                    })

                    btSettings.on("click", function () {
                        sGroup = svg.selectAll("settingsWindow")
                            .data(['WX'])
                            .enter()
                            .append("g")
                            .attr("class", "settingsWindow")
                            .attr("transform", function () {
                                return "translate(" + (posSettings_x - 120) + "," + posSettings_y + ")";
                            })

                        sRect = sGroup.append("rect")
                            .attr("class", "settingsWindow")
                            .attr("width", 120)
                            .attr("height", 120)
                            .style("fill", TP.Context().defaultFillColor)
                            .style("stroke-width", TP.Context().defaultBorderWidth)
                            .style("stroke", TP.Context().defaultBorderColor)

                        sGroup.append("text")
                            .attr("class", "settingsWindow")
                            .attr("dx", 5)
                            .attr("dy", 15)
                            .textvar TP = TP || {};
                            (function () {
                                return "Weight property"
                            })
                            .style("font-family", TP.Context().defaultTextFont)
                            .style("fill", TP.Context().defaultTextColor)
                            .style("font-size", TP.Context().defaultTextSize)

                        objectReferences.InterfaceObject.selectWeightProperty(sGroup);

                        sGroup.append("text")
                            .attr("class", "settingsWindow")
                            .attr("dx", 50)
                            .attr("dy", 115)
                            .textvar TP = TP || {};
                            (function () {
                                return "WX"
                            })
                            .style("font-family", "EntypoRegular")
                            .style("fill", "lightgray")
                            .style("font-size", 30)
                            .on("click", function () {
                                TP.Context().substrateWeightProperty=svg.select("#weightPropSel")
                                    .node()
                                    .value;
                                svg.selectAll(".settingsWindow")
                                    .data([])
                                    .exit()
                                    .remove();
                            })
                            .on("mouseover", function () {
                                d3.select(this).style("fill", "black")
                            })
                            .on("mouseout", function () {
                                d3.select(this).style("fill", "lightgray")
                            })
                    })
        }
        */


        this.attachInfoBox = function (target) {
            console.log("calling attach")
            // assert(true, 'Interface -> attachInfoBox')

            var infoNodes = $('#infoNodes');
            var nodesBID = $('<select/>',{class:"hidden"});

            var svg = TP.Context().view[target].getSvg();
            var nodes = svg.selectAll('g.node').data();
            
            nodesBID.append("<option>-Nodes-</option>");
            for(var n in nodes){
                nodesBID.append("<option>"+nodes[n].baseID+"</option>");
            }
            $("#searchNode").click(function(){
                $(this).siblings('select').toggleClass('hidden');
            })

            nodesBID.change(function(){
                var selectedNode = nodesBID[0].options[nodesBID[0].selectedIndex].value;
                for (var n in nodes){
                    if(nodes[n].baseID==selectedNode){
                        TP.Controller().sendMessage("mouseoverInfoBox", {node:nodes[n]}, "principal", "undefined");
                        break;
                    }
                }
                
            })

            d3.selectAll(".glyph")
                .on("mouseover", function (d) {
                    TP.Controller().sendMessage("mouseoverInfoBox", {node: d}, "principal", "undefined");
                });
        }


        this.addInfoBox = function (_event) {
            // assert(true, 'Interface -> addInfoBox')
            var node = _event.associatedData.node;
            $("#infoNodes ul").empty();
            for (var k in node) {
                $('#infoNodes ul').append("<li><label style='font-weight:bold'>" + k + ":</label> " + node[k] + "</li>");
            }
        }


        this.addCatalystList = function (_event) {
            // assert(true, 'Interface -> addInfoBox')
            var node = _event.associatedData.catalystList;
            console.log("calling addCataList")
            $("#infoSync ul").empty();
            for (var k in node) {
                $('#infoSync ul').append("<li><label style='font-weight:bold'>" + k + ":</label> " + node[k] + "</li>");
            }
        }


        // this.setCombinedForeground = function (target) {
        //     assert(true, 'Interface -> setCombinedForeground')
        //     TP.Context().combined_foreground = target;
        //     var toggleBtnText = ""
        //     if (target == "substrate") {
        //         toggleBtnText = "catalyst";
        //     } else if (target == "catalyst") {
        //         toggleBtnText = "substrate";
        //     }

        //     TP.Context().view["combined"].getSvg().selectAll("g.toggleCombinedForeground")
        //         .select("text")
        //         .text("g " + toggleBtnText)

        //     TP.Context().view["combined"].getSvg().selectAll("g.node")
        //         .data(TP.Context().tabGraph["graph_combined"].nodes(), function (d) {
        //             return d.baseID
        //         })
        //         .style("opacity", function (d) {
        //             if (d._type == TP.Context().combined_foreground) {
        //                 return 1;
        //             } else {
        //                 return 0.5;
        //             }
        //         })
        // }


        // this.toggleCombinedForeground = function (target) {
        //     assert(true, 'Interface -> toggleCombinedForeground')
        //     if (TP.Context().combined_foreground == "substrate") {
        //         __g__.setCombinedForeground("catalyst");
        //     } else if (TP.Context().combined_foreground == "catalyst") {
        //         __g__.setCombinedForeground("substrate");
        //     }
        // }


        this.throwAnnouncement = function(title, text){   
            assert(true, 'Interface -> throwAnnouncement')       
            $('body').append('<div id=announce></div>');
            $('#announce').dialog({
                title: title,
                modal: true,
                zIndex: 3999    
            });
            $('.ui-front').css('z-index', 3000);
            $('#announce').append(text);

        }

        this.setHeaderMenu = function(){
            $(".submenu:not('.open_at_load')").hide();

            $("li.hmenu > a").click(function (e) {

              if ($(this).next("ul.submenu:visible").length != 0) {
                $(this).next("ul.submenu").slideUp("normal", function () {
                  $(this).parent().removeClass("open")
                });
              }
              else {
                $("ul.submenu").slideUp("normal", function () {
                  $(this).parent().removeClass("open")
                });
                //console.log()
                $(this).next("ul.submenu").slideDown("normal", function () {
                  $(this).parent().addClass("open")
                });
              }
              e.preventDefault();
            });
            $('ul.submenu').mouseleave(function () {
              //console.log('mouseout');
              $('ul.submenu').slideUp("normal", function () {
                $(this).parent().removeClass("open")
              });

            });

            $('#opfile').click(function (e) {
              $('#files').click();
              e.preventDefault();
            });

        }


        this.setPositionDialogs = function(tabView, x, y, h, w, sens){
            // assert(true, 'Interface -> setPositionDialogs') 
            var length = tabView.length;
            if(length === 1){
                drawDialog(x,y,h,w,tabView[0]);
                return x;
            }else{
                var tmp = changesens(h,w,sens);
                var hbis = tmp.h;
                var wbis = tmp.w;
                this.setPositionDialogs(tabView.slice(0,length/2), x,y,hbis,wbis,!sens);
                this.setPositionDialogs(tabView.slice(length/2, length), x+(w-wbis), y+(h-hbis),hbis,wbis,!sens);
            }
            function changesens(h,w,sens){
                if(sens){
                    return {h:h/2, w:w};
                }else{ 
                    return {h:h, w:w/2};
                }
            }
            function drawDialog(x,y,h,w,view){
                view.dialog.dialog({
                    width:w-4,
                    height:h,
                    position: [x,y+30]
                });
            }
        }

        // gestion du menu à gauche

        this.toggleAccordion = function(menu){
            // assert(true, 'Interface -> toggleAccordion') 
            $( "#" + menu + " ul.family:not('.open_at_load')" ).hide();
            $( "#" + menu + " li.tglFamily > a" ).click(function () {
                if ( $(this).next("#" + menu + " ul.family:visible" ).length != 0) {
                    $(this).next( "#" + menu + " ul.family" ).slideUp("normal", function () {
                        $(this).parent().removeClass("open");
                    });
                } else {
                    $( "#" + menu + " ul.family" ).slideUp("normal", function () {
                        $(this).parent().removeClass("open");
                    });
                    $(this).next( "#" + menu + " ul.family" ).slideDown("normal", function () {
                        $(this).parent().addClass("open");
                    });
                }
                return false;
            });

            $("#"+menu+" div.formParam:not('open_at_load')").hide();
            $("#"+menu+" li.form > a").click(function () {
                if ($(this).parent().hasClass('tglForm')) {
                    if ($(this).next("#"+menu+" div.formParam:visible").length != 0) {
                        $(this).next("#"+menu+" div.formParam").slideUp("normal", function () {
                            $(this).parent().removeClass("open")
                        });
                    } else {
                        $("#"+menu+" div.formParam").slideUp("normal", function () {

                            $(this).parent().removeClass("open")
                        });
                        $(this).next("#"+menu+" div.formParam").slideDown("normal", function () {
                            $(this).parent().addClass("open")
                        });
                    }
                }
                return false;
            });
        }

        this.togglePanelMenu = function(){
            // assert(true, 'Interface -> togglePanelMenu') 
            $('div.toggleButton').click(function (e) {
                var src = event.srcElement.parentNode.parentNode;
                var menuNum = src.id.split('-')[1];
                var menu = $('#menu-' + menuNum);
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
                    menu.css('z-index', 202)
                }
                else if (parent.className === 'sidebar') {

                    if (menu.css('z-index') == 202) {
                        /*button.text('>');*/
                        button.eq(0).toggleClass('open')

                        //console.log($(parent))
                        $(parent).eq(0).toggleClass('nosidebar sidebar')
                        //              parent.className = 'nosidebar';
                        $('.cont').each(function () {
                            $(this).css('z-index', 200)
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
                            $(this).css('z-index', 201)
                        })
                        menu.css('z-index', 202);
                        /*button.text('<')*/
                        button.eq(0).toggleClass('open')
                        //button.css('background', "url(css/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png) 50% 50% repeat-x")

                    }
                }
                else console.log('FAIL: toggle panel');
            });
        }

        this.addPanelMenu = function (header) {
            // assert(true, 'Interface -> addPanelMenu') 
            var menuNum = contxt.menuNum++;
            $('#bg').css('border-width','12px')
            $('#bg').css({'height':'51px', 'width':'276px'})
            if($('#entValues').length < 1)
                $("<div/>", {class: 'cont', id: 'entValues', style:'height:'+75+'px; z-index:210; width:300; position:absolute'}).appendTo("#wrap");
            $("<div/>", {class: 'cont', id: 'menu-' + menuNum, style:'top:'+78+'px;'}).appendTo("#wrap");
            $("<div/>", {class: 'toggleButton', id: 'toggleBtn' + menuNum, /*text:'>',*/style: 'top:' + [40 + 104 * (menuNum - 1)]  + 'px;'}).appendTo('#menu-' + menuNum);
            var head = $('<div/>', {class: 'header-menu', text: header}).appendTo('#menu-' + menuNum);
            var cbtn = $('<div/>', {class:'close-button'}).appendTo(head)
            $('<div/>', {class: 'menu-content', id: 'menu' + menuNum + '-content'}).appendTo('#menu-' + menuNum)
            
            cbtn.click(function(){
                $("#wrap").toggleClass('nosidebar sidebar');
                $('.toggleButton').removeClass("open")
                $('.cont').each(function(){
                    $(this).css('z-index',200)
                    $(this).css('left',-301)
                })
            })
            return 'menu-' + menuNum;
        }


        this.interactionPane = function (buttons, mode) {
            // assert(true, 'Interface -> interactionPane') 
            var menu, tgbutton, content, fam, i = 0;

            if (mode === 'update') {
                for (i = 0; i < contxt.menuNum; i++) {
                    if ($('.header-menu').eq(i).text() === 'Interactions') {
                        content = $('.header-menu').eq(i).siblings('.menu-content')
                        document.getElementById(content.attr('id')).innerHTML = ''
                    }
                }
            } else if (mode === 'create') {
                menu = this.addPanelMenu('Interactions');
                $('#' + menu).css('z-index', 202)
                tgbutton = $('#' + menu).find('.toggleButton')
                tgbutton.addClass('open')
                $('<h3/>', {text: 'Interactions'}).appendTo(tgbutton);
                content = $("#" + menu + " .menu-content");
            }            
            $('<ul/>', {id: 'nav',class:'nav'}).appendTo(content);

            if (buttons.hasOwnProperty('undefined')){
                this.createArrayButtons(buttons.undefined,'nav')
            }
            i = 0;
            for (var key in buttons) {
                if(key!="View" && key!='undefined'){

                    fam = $('<li/>', { class: 'tglFamily'}).appendTo('#nav');
                    $('<a/>', {text: key}).appendTo(fam)
                    $('<ul/>', {id: 'family-' + i, class: 'family'}).appendTo(fam);
                    this.createArrayButtons(buttons[key], 'family-' + i);
                    i++;
                }
            }
            this.toggleAccordion('nav');
        }

        this.infoPane = function () {
            // assert(true, 'Interface -> infoPane')
            //console.log("calling infoPane")
            var menu = this.addPanelMenu('Informations');
            var content = $("#" + menu + " .menu-content");
            var tgbutton = $('#' + menu).find('.toggleButton')
            $('<h3/>', {text: 'Informations'}).appendTo(tgbutton);

            content.css("margin",10)

            $('<div/>', {id: 'entanglement-cont'}).appendTo('#' + 'entValues')//content.attr('id'))
            $('<div/>', {id: 'infoView'}).appendTo('#' + content.attr('id'));


            document.getElementById('entanglement-cont').innerHTML +=
                "<div id='bg'></div>" +
                    "<div id='entanglement'>" +
                    "<p>ENTANGLEMENT:</br>" +
                    "<ul type='none' style:'margin-top:2px'>" +
                    "<li>Intensity: <text id='intensity'></text></br></li>" +
                    "<li>Homogeneity: <text id='homogeneity'></text></li>" +
                    "</ul>" +
                    "</p>" +
                    "</div>";
            
            $('<div/>', {id: 'infoSync'}).appendTo('#' + content.attr('id'));
            var infoSync = $('#infoSync');
            infoSync.html("<p> SYNC INFORMATIONS: </p>");
            infoSync.addClass(".enable-text-selection");
            infoSync.append("<ul></ul>");

            $('<div/>', {id: 'infoNodes'}).appendTo('#' + content.attr('id'));
            var infoNodes = $('#infoNodes');
            var nodesBID = $('<select/>',{class:"hidden"});

            infoNodes.html("<p> NODE INFORMATIONS: </p>");
            infoNodes.append("<button id='searchNode'>Search</button>");
            infoNodes.append(nodesBID);
            infoNodes.append("<ul></ul>");

        }

        this.visuPane = function (buttons, mode) {
            // assert(true, 'Interface -> visuPane') 
            var menu, content, tgbutton;
            if (mode === 'update') {
                for (i = 0; i < contxt.menuNum; i++) {
                    if ($('.header-menu').eq(i).text() === 'View settings') {
                        content = $('.header-menu').eq(i).siblings('.menu-content')
                        document.getElementById(content.attr('id')).innerHTML = ''
                    }
                }
            } else if (mode === 'create') {
                menu = this.addPanelMenu('View settings');
                tgbutton = $('#' + menu).find('.toggleButton')
                $('<h3/>', {text: 'View settings'}).appendTo(tgbutton);
                content = $("#" + menu + " .menu-content");
            }
            content.css('margin', 0)

            //var visu = content[0];
            var view = TP.Context().activeView;
            var nav = $('<div/>',{id:'navView', class:'nav'}).appendTo(content)
            this.createArrayButtons(buttons.View,'navView')

            this.toggleAccordion('navView');
        }


        this.createElements = function(tab, parentId, evnt){
            // assert(true, 'Interface -> createElements') 
            var par = $(parentId)
            for(var k in tab){
                /*if (typeof (tab[k]) == "function")
                    tab[k] = tab[k].call()

                for(var l in tab) {
                    if (typeof (tab[k][l]) == "function")
                        tab[k][l] = tab[k][l].call()
                }*/

                var element = tab[k];
                var type = tab[k][0];
                var attrElem = tab[k][1];
                var attrChild = tab[k][2];

                var labelPrec = (tab[k][3]!= null && tab[k][3]!=undefined) ? tab[k][3] : "";
                var labelSuiv = (tab[k][4]!= null && tab[k][4]!=undefined) ? tab[k][4] : "";

                if($("#"+attrElem.id).length!=0){
                    // assert(false, "Warning: The id " + tab[k][1].id + " already exists.")
                }
                par.append(labelPrec)
                switch(type){
                    case 0: // select
                        var div = $('<select>', attrElem).appendTo(parentId);
                        for(var opt in attrChild){
                            $('<option/>',{value:attrChild[opt].value, text:attrChild[opt].text}).appendTo(div)
                        }

                        $("#"+attrElem.id).change((function (e) {
                            return function (){
                                var res = {};
                                var key = this.id;
                                var selectedOpt = $('#'+key)[0].options[$('#'+key)[0].selectedIndex];
                                res[key] = {text:selectedOpt.text, val:selectedOpt.value}
                                //console.log(res)
                                var c = e ? e.call(res) : null;
                            }
                        })(evnt));
                        break;

                    case 1: // radio
                        var form = $('<form>', attrElem).appendTo(parentId);
                        form.addClass('radio')
                        for(var opt in attrChild){
                            var input = $('<input/>',attrChild[opt]).appendTo(form)
                            input.attr("type","radio")
                            $('<label/>',{text:attrChild[opt].text}).appendTo(form)
                            $(form).append("<br/>")
                        }

                        $('#'+attrElem.id+' input[type=radio]').click((function (e) {
                            return function () {
                                if ($(this).is(":checked")){
                                    var res = {};
                                     key = $(this).attr('name');
                                    res[key] = {text:$(this).text(), val:$(this).val()}
                                    //console.log(res)
                                    var c = e ? e.call(res) : null; 
                                }
                            };
                        })(evnt))
                        break;

                    case 2: // checkbox
                        var form = $('<form>', tab[k][1]).appendTo(parentId);
                        form.addClass('checkbox')
                        for(opt in attrChild){
                            $('<input/>',{type:"checkbox",name:attrChild[opt].name, value:attrChild[opt].value, text:attrChild[opt].text}).appendTo(form)
                            $('<label/>',{text:attrChild[opt].text}).appendTo(form)
                            $(form).append("<br/>")
                        }

                        $('#'+attrElem.id+' input').click((function (e) {
                            return function () {
                                if ($(this).is(":checked")){
                                    var res = {};
                                     key = $(this).attr('name');
                                    res[key] = {text:$(this).text(), val:$(this).val()}
                                    //console.log(res)
                                    var c = e ? e.call(res) : null; 
                                }
                            };
                        })(evnt))
                        break;

                    case 3: // textfield
                        var div =$('<input/>',tab[k][1]).appendTo(parentId)
                        div.attr("type","text")

                        var id = div[0].id
                        div.change((function (e) {
                            return function () {
                                var res = {};
                                var key = this.id;
                                res[key] = this.value;
                                //console.log(res)
                                var c = e ? e.call(res) : null;
                            };
                        })(evnt))                        
                        break;

                    case 4: //slider
                        var div = $('<div/>',attrElem).appendTo(parentId)

                        attrChild.change= ((function (e) { 
                            return function () {
                                var res = {};
                                var val1 = $(this).slider("values",0);
                                var val2 = $(this).slider("values",1);

                                $(this).find(".ui-slider-handle").eq(0).text(val1);
                                $(this).find(".ui-slider-handle").eq(1).text(val2);

                                key = this.id;
                                res[key] = {val1:val1, val2:val2}
                                //console.log(res)
                                var c = e ? e.call(res) : null;
                            };
                        })(evnt))
                        attrChild.slide= ((function (e) { 
                            return function () {
                                var res = {}
                                var val1 = $(this).slider("values",0);
                                var val2 = $(this).slider("values",1);

                                $(this).find(".ui-slider-handle").eq(0).text(val1);
                                $(this).find(".ui-slider-handle").eq(1).text(val2);
                               
                                key = this.id;
                                res[key] = {val1:val1, val2:val2}
                                //console.log(res)
                                var c = e ? e.call(res) : null;
                            };
                        })(evnt))

                        div.slider(attrChild);
                        break;

                    case 5: //spinner
                        var div = $('<input/>', attrElem).appendTo(parentId)

                        div.spinner(attrChild);
                        div.siblings('.ui-spinner-button').click(function(){
                            div.change();
                        });
                        div.change((function (e){
                            return function () {
                                var res = {}
                                key = this.id
                                res[key] = $(this).spinner('value')
                                //console.log(res)
                                var c = e ? e.call(res) : null;
                            };
                        })(evnt))
                        break;

                    case 6: //color picker
                        var div = $('<div/>', attrElem).appendTo(parentId)
                        //par.append(tab[k][4])
                        var f = $.farbtastic('#'+attrElem.id);
                        f.linkTo(tab[k][5].func);
                        break;

                    case 7: //autocomplete
                        var div = $('<input/>',attrElem).appendTo(parentId)
                        div.autocomplete(attrChild)
                            .bind('focus', function(){
                                if(attrChild.focusCallback)
                                    attrChild.source = attrChild.focusCallback()
                                $(this).autocomplete('search');
                            });
                        var res = {}, key;
                        div.autocomplete({
                            select: function (e, ui) {
                                    key = this.id;
                                    //console.log(key)
                                    res[key] = ui.item.value;
                                    //console.log(res, event);
                                    var c = evnt ? evnt.call(res) : null;
                            }
                        })
                        break;

                }
                par.append(labelSuiv + "<br/>")
            }
        }


        this.createArrayButtons = function (buttonsData, pane) {
            // assert(true, 'Interface -> createArrayButtons') 
            var menu = pane;
            var label, param, evnt;

            for (var i = 0; i < buttonsData.length; i++) {
                label = buttonsData[i].interactorLabel;
                param = buttonsData[i].interactorParameters;
                evnt = buttonsData[i].callbackBehavior;

                var fam = null;
                if (param == '') {
                    fam = $('<li/>', {class: 'form'}).appendTo('#' + menu);
                    var button = $('<a/>', {text: label}).appendTo(fam)
                    $(button).click(evnt.click);
                } else {
                    fam = $('<li/>', {class: 'form tglForm'}).appendTo('#' + menu);
                    var button = $('<a/>', {text: label}).appendTo(fam)
                    if (evnt && evnt.click) $(button).click(evnt.click);
                    var form = $('<div/>', {class: 'formParam'}).appendTo(fam)
                    this.createElements(param,form, evnt)
                    /*if(evnt){
                        var submit = $('<button/>', {class: 'submit', text: "Apply"}).appendTo(form);
                        var submit = this.createElement('button', {class: 'submit', text: "Apply"}, form)
                        submit.click((function (s, e) {
                            return function () {
                                objectReferences.InterfaceObject.callbackMenu(s, e)
                            };
                        })(submit, evnt))
                    }*/
                }
            }
        }


        /*this.callbackMenu = function (param, evnt) {
            //assert(true, 'Interface -> call')
            var res = {}
            var key, val, data;


            // select
            data = param.siblings("select")
            data.each(function(){
                key = this.id;
                var text = document.getElementById(this.id).options[document.getElementById(this.id).selectedIndex].text;
                var val = document.getElementById(this.id).options[document.getElementById(this.id).selectedIndex].value;
                res[key] = {text:text, val:val}
            })

            // radio
            data = param.siblings('form.radio')
            data = data.find("input[type='radio']:checked")
            data.each(function(){
                key = $(this).attr('name');
                res[key] = {text:$(this).text(), val:$(this).val()}
            })

            // checkbox
            data = param.siblings('form.checkbox')
            data = data.find("input[type='checkbox']:checked")
            data.each(function(){
                key = $(this).attr('name')
                res[key] = {text:$(this).text(), val:$(this).val()};
            })

            // textfield
            data = param.siblings("input[type='text']")
            data.each(function(){
                key = this.id;
                res[key] = this.value;
            })  

            //slider
            data = param.siblings('.ui-slider');
            data.each(function(){
                key = this.id;
                res[key] = {val1:$(this).slider("values",0), val2:$(this).slider("values",1)}
            })

            //spinner
            data = param.siblings('.ui-spinner')
            data = data.find('.ui-spinner-input')
            data.each(function(){
                key = this.id
                res[key] = $(this).spinner('value')
            })

            console.log(res)
            evnt.call(res)
        }*/

        return __g__;

    }
    TP.Interface = Interface;
})(TP);
