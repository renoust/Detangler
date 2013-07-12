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
        assert(false, 'Interface')
        var __g__ = this;
        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();

        this.includeFormParam = function (target) {
            assert(false, 'Interface -> includeFormParam')
            myinput = svg.append("foreignObject")
                .attr("width", 100)
                .attr("height", 100)
                .append("xhtml:body")
                .html("<form><input type=checkbox id=check /></form>")
                .on("click", function (d, i) {
                });
            myinput = svg.append("foreignObject")
                .attr("width", 300)
                .attr("height", 100)
                .attr("x", 200)
                .attr("y", 200)
                .append("xhtml:body")
                .html("<form><input type=input id=input /></form>")
        }


        this.eraseAllInterface = function (target) {
            assert(false, 'Interface -> eraseAllInterface')
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            var coh = svg.selectAll(".interfaceButton")
                .data([]).exit().remove()
        }


        this.addInfoButton = function (target) {
            //assert(true,'Interface -> addInfoButton')
            var cGraph = target.getGraph();

            var path = $('#files').val().split('\\');
            var file = path[path.length - 1];
            var view = target.getName().split('-');
            var type = view[view.length - 1];

            $('#infoView').html("<p> GLOBAL INFORMATIONS: </p>" +
                "<ul>" +
                "<li> File : " + file + "</li>" +
                "<li> View : " + type + "</li>" +
                "<li> - " + cGraph.nodes().length + " nodes </li>" +
                "<li> - " + cGraph.links().length + " links </li>" +
                "</ul>");
        }


        this.selectWeightProperty = function (group) {
            assert(true, 'Interface -> selectWeightProperty')
            group.append("foreignObject")
                .attr("x", 10)
                .attr("y", 20)
                .attr("width", 200)
                .attr("height", 200)
                .append("xhtml:body")
                .html(function (d) {
                    selectHTMLString = "<form><select id=weightPropSel>"
                    selectHTMLString += " <option value=\"\"><i>--</i></option>"
                    nbElements = Object.keys(TP.Context().substrateProperties).length
                    Object.keys(TP.Context().substrateProperties)
                        .forEach(function (k, i) {
                            //console.log("props: ", k)
                            if (TP.Context().substrateProperties[k] == "number") {
                                selectHTMLString += " <option value=\"" + k + "\">" + k + "</option>"
                            }
                        });
                    selectHTMLString += "</select></form>"
                    return selectHTMLString
                })
        }


        this.holdSVGInteraction = function (target) {
            assert(true, 'Interface -> holdSVGInteraction')
            objectReferences.InteractionObject.removeZoom(target);
            objectReferences.InteractionObject.removeLasso(target);
        }


        // This function toggles the 'select' and 'move' modes for the 
        // interactors
        // target, the string value of the target svg view
        this.toggleSelectMove = function (target) {
            //assert(true,'Interface -> toggleSelectMove')
            if (!target) return


            var view = null;
            view = TP.Context().view[target];

            var svg = null
            svg = view.getSvg();

            //eval("TP.Context().select_mode_"+target+" = ! TP.Context().select_mode_"+target);
            //eval("TP.Context().move_mode_"+target+" = ! TP.Context().move_mode_"+target);
            //TP.Context().tabSelectMode[target] = !TP.Context().tabSelectMode[target];

            TP.Context().view[target].setSelectMode(!TP.Context().view[target].getSelectMode());
            TP.Context().view[target].setMoveMode(!TP.Context().view[target].getMoveMode());

            if (TP.Context().view[target].getSelectMode()) {
                svg.select('rect.moveButton').style('fill', TP.Context().defaultFillColor);
                svg.select('rect.selectButton').style('fill', TP.Context().highlightFillColor);
                //objectReferences.InteractionObject.addLasso(target);

                view.getController().sendMessage("select"); //send Message "select" to the StateController

                //objectReferences.InteractionObject.removeZoom(target);
            }

            if (TP.Context().view[target].getMoveMode()) {
                svg.select('rect.moveButton').style('fill', TP.Context().highlightFillColor);
                svg.select('rect.selectButton').style('fill', TP.Context().defaultFillColor);
                //objectReferences.InteractionObject.removeLasso(target);
                //objectReferences.InteractionObject.addZoom(target);

                view.getController().sendMessage("move");
            }
        }

        /*
         this.addSettingsButton = function (target) {
         assert(true,'Interface -> addSettingsButton')
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
            //assert(true, 'Interface -> attachInfoBox');
            $('#infoNodes').html("<p> NODE INFORMATIONS: </p>");
            $('#infoNodes').append("<button id='searchNode' class='hidden'>Search</button>")
            var nodesBID = $('<select/>',{style:"visibility:hidden"}).appendTo("#infoNodes")
            $('#infoNodes').append("<ul></ul>");

            var svg = TP.Context().view[target].getSvg();
            var nodes = svg.selectAll('g.node').data()
            
            nodesBID.append("<option>-Nodes-</option>")
            for(n in nodes){
                nodesBID.append("<option>"+nodes[n].baseID+"</option>")
            }
            $("#searchNode").click(function(){
                if($(this).hasClass('hidden')){
                    $(this).siblings('select').css('visibility','visible')
                    $(this).removeClass('hidden')
                }else{
                    $(this).siblings('select').css('visibility','hidden')
                    $(this).addClass('hidden')
                }
            })
            nodesBID.change(function(){
                var selectedNode = nodesBID[0].options[nodesBID[0].selectedIndex].value;
                var node = null;
                for (n in nodes){
                    if(nodes[n].baseID==selectedNode){
                        node = nodes[n];
                        break;
                    }
                }
                TP.Controller().sendMessage("mouseoverInfoBox", {node:node}, "principal", "undifined")
            })

            d3.selectAll(".glyph")
                .on("mouseover", function (d) {

                    //objectReferences.InterfaceObject.addInfoBox(d)
                    TP.Controller().sendMessage("mouseoverInfoBox", {node: d}, "principal", "undifined")
                });
        }


        this.addInfoBox = function (event) {

            var node = event.associatedData.node;
            $("#infoNodes ul").empty();
            
            for (var k in node) {
                //console.log(k, d[k])
                $('#infoNodes ul').append("<li><label style='font-weight:bold'>" + k + ":</label> " + node[k] + "</li>");
            }
        }


        this.setCombinedForeground = function (target) {
            assert(true, 'Interface -> setCombinedForeground')
            TP.Context().combined_foreground = target;
            var toggleBtnText = ""
            if (target == "substrate") {
                toggleBtnText = "catalyst";
            } else if (target == "catalyst") {
                toggleBtnText = "substrate";
            }

            //console.log("toggling: ", TP.Context().combined_foreground);

            TP.Context().view["combined"].getSvg().selectAll("g.toggleCombinedForeground")
                .select("text")
                .text("g " + toggleBtnText)

            TP.Context().view["combined"].getSvg().selectAll("g.node")
                .data(TP.Context().tabGraph["graph_combined"].nodes(), function (d) {
                    return d.baseID
                })
                .style("opacity", function (d) {
                    if (d._type == TP.Context().combined_foreground) {
                        return 1;
                    } else {
                        return 0.5;
                    }
                })
        }


        this.toggleCombinedForeground = function (target) {
            assert(true, 'Interface -> toggleCombinedForeground')
            if (TP.Context().combined_foreground == "substrate") {
                __g__.setCombinedForeground("catalyst");
            } else if (TP.Context().combined_foreground == "catalyst") {
                __g__.setCombinedForeground("substrate");
            }
        }


        this.throwAnnouncement = function(title, text){          
            $('body').append('<div id=announce></div>');
            $('#announce').dialog({
                title: title,
                modal: true,
                zIndex: 3999    
            });
            $('.ui-front').css('z-index', 3000);
            $('#announce').append(text)

        }


        this.tileDialog = function(tabView, x, y, h, w, sens){
            var length = tabView.length;
            if(length==1){
                drawDialog(x,y,h,w,tabView[0])
                //return x;
            }else{
                tmp = changesens(h,w,sens)
                hbis = tmp.h;
                wbis = tmp.w;
                console.log("A------ x:",x,"x+(w-wbis): ",x+(w-wbis), "wbis:",wbis,"hbis",hbis)
                s1 = this.tileDialog(tabView.slice(0,length/2), x,y,hbis,wbis,!sens)
                //console.log("S1: ",s1)
                console.log("B------ x:",x,"x+(w-wbis): ",x+(w-wbis), "wbis:",wbis,"hbis",hbis)
                //var x = s1;
                //console.log(tp)
                s2 = this.tileDialog(tabView.slice(length/2, length), x+(w-wbis), y+(h-hbis),hbis,wbis,!sens);
                console.log("C------ x:",x,"w: ",w, "x+(w-wbis): ",x+(w-wbis), "wbis:",wbis,"hbis",hbis)
                //return x;
            }
            function changesens(h,w,sens){
                if(sens)
                    return {h:h/2, w:w};
                else 
                    return {h:h, w:w/2};
            }
            function drawDialog(x,y,h,w,view){
                view.dialog.dialog({
                    width:w,
                    height:h,
                    position: [x+20,y+30]
                })
                assert(true, [x,y,h,w,view, sens])
            }
        }

        // gestion du menu à gauche
        this.addPanelMenu = function (header) {
            //assert(true,'Interface -> addPanelMenu')

            menuNum = contxt.menuNum++;
            $("<div/>", {class: 'cont', id: 'menu-' + menuNum}).appendTo("#wrap");
            $("<div/>", {class: 'toggleButton', id: 'toggleBtn' + menuNum, /*text:'>',*/style: 'top:' + [40 + 104 * (menuNum - 1)] + 'px;'}).appendTo('#menu-' + menuNum);
            var head = $('<div/>', {class: 'header-menu', text: header}).appendTo('#menu-' + menuNum);
            var cbtn = $('<div/>', {class:'close-button'}).appendTo(head)
            $('<div/>', {class: 'menu-content', id: 'menu' + menuNum + '-content', }).appendTo('#menu-' + menuNum)
            
            cbtn.click(function(){
                $("#wrap").toggleClass('nosidebar sidebar');
                $('.toggleButton').removeClass("open")
                $('.cont').each(function(){
                    $(this).css('z-index',0)
                    $(this).css('left',-301)
                })
            })
            return 'menu-' + menuNum;
        }


        this.interactionPane = function (buttons, mode) {
            //assert(true,'Interface -> interactionPane')
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
                $('#' + menu).css('z-index', 102)
                tgbutton = $('#' + menu).find('.toggleButton')
                tgbutton.addClass('open')
                $('<h3/>', {text: 'Interactions'}).appendTo(tgbutton);
                content = $("#" + menu + " .menu-content");
            }
            content.css('margin', 0)

            i = 0;
            $('<ul/>', {id: 'nav'}).appendTo(content);
            for (var key in buttons) {
                console.log("Buttons: ", buttons)
                fam = $('<li/>', { class: 'tglFamily'}).appendTo('#nav');
                $('<a/>', {text: key}).appendTo(fam)
                $('<ul/>', {id: 'family-' + i, class: 'family'}).appendTo(fam);
                this.createArrayButtons(buttons[key], 'family-' + i);
                i++;
            }

            $("ul.family:not('.open_at_load')").hide();
            $("li.tglFamily > a").click(function () {
                if ($(this).next("ul.family:visible").length != 0) {
                    $(this).next("ul.family").slideUp("normal", function () {
                        $(this).parent().removeClass("open")
                    });
                } else {
                    $("ul.family").slideUp("normal", function () {
                        $(this).parent().removeClass("open")
                    });
                    $(this).next("ul.family").slideDown("normal", function () {
                        $(this).parent().addClass("open")
                    });
                }
                return false;
            });

            $("div.formParam:not('open_at_load')").hide();

            $("li.form > a").click(function () {
                if ($(this).parent().hasClass('tglForm')) {
                    if ($(this).next("div.formParam:visible").length != 0) {
                        $(this).next("div.formParam").slideUp("normal", function () {
                            $(this).parent().removeClass("open")
                        });
                    } else {
                        $("div.formParam").slideUp("normal", function () {
                            $(this).parent().removeClass("open")
                        });
                        $(this).next("div.formParam").slideDown("normal", function () {
                            $(this).parent().addClass("open")
                        });
                    }
                }
                return false;
            });

        }

        this.infoPane = function () {
            //assert(true,'Interface -> infoPane')
            var menu = this.addPanelMenu('Informations');
            var content = $("#" + menu + " .menu-content");
            var tgbutton = $('#' + menu).find('.toggleButton')
            $('<h3/>', {text: 'Informations'}).appendTo(tgbutton);

            $('<div/>', {id: 'entanglement-cont'}).appendTo('#' + content.attr('id'))
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

            $('<div/>', {id: 'infoNodes'}).appendTo('#' + content.attr('id'));
        }

        this.visuPane = function (pane) {
            //assert(true,'Interface -> visuPane')
            var menu = this.addPanelMenu('View settings');
            var content = $("#" + menu + " .menu-content");
            var tgbutton = $('#' + menu).find('.toggleButton')
            $('<h3/>', {}).appendTo(tgbutton);

            var visu = content[0];
            var view = TP.Context().activeView;

            visu.innerHTML +=
                '<form>' +
                    '<div id="color">' +
                    '<input type="radio" id="cnodes" name="color" class="colorwell"/><label for="radio1">Nodes Color</label><br/>' +
                    '<input type="radio" id="clinks" name="color" class="colorwell"/><label for="clinks">Links Color</label><br/>' +
                    '<input type="radio" id="cbg" name="color" class="colorwell"/><label for="cbg">Background Color</label><br/>' +
                    '<input type="radio" id="clabels" name="color" class="colorwell"/><label for="clabels">Labels Color</label>' +
                    '</div>' +
                    "<div id='picker' ></div>" +
                    '</form>';


            var f = $.farbtastic('#picker');
            $('.colorwell').change(function () {
                if ($(this).hasClass('.colorwell-selected')) {
                    $(this).removeClass('colorwell-selected');
                }
                else {
                    $(this).addClass('colorwell-selected');
                    $(this).siblings().each(function () {
                        $(this).removeClass('colorwell-selected');
                    })
                }
            })
            f.linkTo(colorChange);

            function colorChange() {
                if ($('#cnodes').hasClass('colorwell-selected')) {
                    TP.Context().view[TP.Context().activeView].setNodesColor(f.color);
                    objectReferences.VisualizationObject.changeColor(TP.Context().activeView, "node", TP.Context().view[TP.Context().activeView].getNodesColor());
                } else if ($('#clinks').hasClass('colorwell-selected')) {
                    TP.Context().view[TP.Context().activeView].setLinksColor(f.color);
                    objectReferences.VisualizationObject.changeColor(TP.Context().activeView, "link", TP.Context().view[TP.Context().activeView].getLinksColor());
                } else if ($('#cbg').hasClass('colorwell-selected')) {
                    TP.Context().view[TP.Context().activeView].setBgColor(f.color);
                    objectReferences.VisualizationObject.changeColor(TP.Context().activeView, "bg", TP.Context().view[TP.Context().activeView].getBgColor());
                } else if ($('#clabels').hasClass('colorwell-selected')) {
                    TP.Context().view[TP.Context().activeView].setLabelsColor(f.color);
                    objectReferences.VisualizationObject.changeColor(TP.Context().activeView, "label", TP.Context().view[TP.Context().activeView].getLabelsColor());
                }
            }
        }


        /*this.createElement = function (balise, attributes, parentId, labelPrec, labelSuiv) {
            //assert(true,'Interface -> createElement')
            if (labelPrec) jQuery('<label/>', {text: labelPrec + ' '}).appendTo(parentId);
            var elem = jQuery('<' + balise + '/>', attributes).appendTo(parentId);
            if (labelSuiv) jQuery('<label/>', {text: ' ' + labelSuiv}).appendTo(parentId);
            return elem;
        }*/

        this.createElements = function(tab, parentId){
            var par = $(parentId)
            for(k in tab){
                switch(tab[k][0]){
                    case 0:
                        par.append(tab[k][3])
                        var div = $('<select>', tab[k][1]).appendTo(parentId);
                        for(opt in tab[k][2]){
                            $('<option/>',{value:tab[k][2][opt].value, text:tab[k][2][opt].text}).appendTo(div)
                        }
                        par.append(tab[k][4])
                        par.append("<br/>")
                        break;
                    case 1:
                        par.append(tab[k][3])
                        var form = $('<form>', tab[k][1]).appendTo(parentId);
                        form.addClass('radio')
                        for(opt in tab[k][2]){
                            $('<input/>',{type:"radio",name:tab[k][2][opt].name, value:tab[k][2][opt].value, text:tab[k][2][opt].text}).appendTo(form)
                            $('<label/>',{text:tab[k][2][opt].text}).appendTo(form)
                            $(form).append("<br/>")
                        }
                        par.append(tab[k][4])
                        par.append("<br/>")
                        break;
                    case 2:
                        par.append(tab[k][3])
                        $('<button/>',{text:tab[k][1].text}).appendTo(parentId)
                        par.append(tab[k][4])
                        par.append("<br/>")
                        break;
                    case 3:
                        par.append(tab[k][3])
                        var div =$('<input/>',tab[k][1]).appendTo(parentId)
                        div.attr("type","text")
                        par.append(tab[k][4])
                        par.append("<br/>")
                        break;
                    case 4:
                        par.append(tab[k][3])
                        var form = $('<form>', tab[k][1]).appendTo(parentId);
                        form.addClass('checkbox')
                        for(opt in tab[k][2]){
                            $('<input/>',{type:"checkbox",name:tab[k][2][opt].name, value:tab[k][2][opt].value, text:tab[k][2][opt].text}).appendTo(form)
                            $('<label/>',{text:tab[k][2][opt].text}).appendTo(form)
                            $(form).append("<br/>")
                        }
                        par.append(tab[k][4])
                        par.append("<br/>")
                        break;
                    case 5:
                        par.append(tab[k][3])
                        var div = $('<div/>',tab[k][1]).appendTo(parentId)
                        par.append(tab[k][4])
                        par.append("<br/>")
                        div.slider(tab[k][2]);
                        break;
                    case 6:
                        par.append(tab[k][3])
                        var div = $('<input/>', tab[k][1]).appendTo(parentId)
                        par.append(tab[k][4])
                        par.append("<br/>")
                        div.spinner(tab[k][2]);
                        break;
                }
            }
        }


        this.createArrayButtons = function (tab, pane) {
            var menu = pane;
            var label, param, evnt;

            for (var i = 0; i < tab.length; i++) {
                label = tab[i][0];
                param = tab[i][1];
                evnt = tab[i][2];

                if (param == '') {
                    fam = $('<li/>', {class: 'form'}).appendTo('#' + menu);
                    button = $('<a/>', {text: label}).appendTo(fam)
                    $(button).click(evnt.click);
                } else {
                    fam = $('<li/>', {class: 'form tglForm'}).appendTo('#' + menu);
                    $('<a/>', {text: label}).appendTo(fam)
                    var form = $('<div/>', {class: 'formParam'}).appendTo(fam)
                    this.createElements(param,form)
                    /*for (var j = 0; j < param.length; j++) {
                        this.createElement(param[j][0], param[j][1], form, param[j][2], param[j][3])
                        //this.createElement('br', null, '#'+id)
                    }*/
                    var submit = $('<button/>', {class: 'submit', text: "Apply"}).appendTo(form);
                    //var submit = this.createElement('button', {class: 'submit', text: "Apply"}, form)
                    submit.click((function (s, e) {
                        return function () {
                            objectReferences.InterfaceObject.callbackMenu(s, e)
                        };
                    })(submit, evnt))
                }
            }

            /*$("#sizemap").slider({
                range: true,
                min: 0,
                max: 99,
                values: [ 3, 12 ],
                change: function () {
                    var value = $("#sizemap").slider("values", 0);
                    var value2 = $("#sizemap").slider("values", 1);
                    $("#sizemap").find(".ui-slider-handle").eq(0).text(value);
                    $("#sizemap").find(".ui-slider-handle").eq(1).text(value2);
                },
                slide: function () {
                    var value = $("#sizemap").slider("values", 0);
                    var value2 = $("#sizemap").slider("values", 1);
                    $("#sizemap").find(".ui-slider-handle").eq(0).text(value);
                    $("#sizemap").find(".ui-slider-handle").eq(1).text(value2);
                }
            });*/
        }


        this.callbackMenu = function(param, evnt){
            assert(true,'Interface -> call')
            var res = {}
            var key, val, data;


            // select
            data = param.siblings("select")
            data.each(function(){
                key = this.id+"_text";
                res[key] = document.getElementById(this.id).options[document.getElementById(this.id).selectedIndex].text
                key = this.id+"_val";
                res[key] = document.getElementById(this.id).options[document.getElementById(this.id).selectedIndex].value
            })

            // radio
            data = param.siblings('form.radio')
            data = data.find("input[type='radio']:checked")
            data.each(function(){
                key = $(this).attr('name')+"_val";
                res[key] = $(this).val();
                key = $(this).attr('name')+"_text";
                res[key] = $(this).text();
            })

            // textfield
            data = param.siblings("input[type='text']")
            data.each(function(){
                key = this.id;
                res[key] = this.value;
            })  

            // checkbox
            data = param.siblings('form.checkbox')
            data = data.find("input[type='checkbox']:checked")
            data.each(function(){
                key = $(this).attr('name')
                res[key] = {text:$(this).text(), val:$(this).val()};
            })

            //slider
            data = param.siblings('.ui-slider');
            data.each(function(){
                key = this.id;
                console.log(this)
                res[key] = {val1:$(this).slider("values",0), val2:$(this).slider("values",1)}
            })

            //spinner
            data = param.siblings('.ui-spinner')
            data = data.find('.ui-spinner-input')
            data.each(function(){
                console.log($(this).spinner("value"))
                key = this.id
                res[key] = $(this).spinner('value')
            })

            /*data = param.siblings("input[type='checkbox']:checked")
            data.each(function(){

                key = param.attr('name');
                if (res[key]==null)         
                    res[key] = param.val();
                else
                    res[key] += ", "+param.val();
            })*/


            /*data = param.siblings('.ui-slider');
            var data2 = param.siblings('.slider');
            end = data.length;
            for(var i=0; i<end; i++){
                key = 'valMin'+i
                val = data.eq(i).slider("values",0);
                res[key] = val;
                key = 'valMax'+i
                val = data.eq(i).slider("values",1);
                res[key] = val;
            }*/
            console.log(res)
            evnt.call(res)
        }

        return __g__;

    }
    TP.Interface = Interface;
})(TP);
