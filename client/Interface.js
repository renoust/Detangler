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

        this.includeFormParam = function (target) {
            //assert(false, 'Interface -> includeFormParam')

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
            //assert(false, 'Interface -> eraseAllInterface')

            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            var coh = svg.selectAll(".interfaceButton")
                .data([]).exit().remove()
        }


        this.addInfoButton = function (target) {
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
            //assert(true, 'Interface -> selectWeightProperty')

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
                            if (TP.Context().substrateProperties[k] == "number") {
                                selectHTMLString += " <option value=\"" + k + "\">" + k + "</option>"
                            }
                        });
                    selectHTMLString += "</select></form>"
                    return selectHTMLString
                })
        }


        this.holdSVGInteraction = function (target) {
            //assert(true, 'Interface -> holdSVGInteraction')

            objectReferences.InteractionObject.removeZoom(target);
            objectReferences.InteractionObject.removeLasso(target);
        }


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
                svg.select('rect.moveButton').style('fill', TP.Context().defaultFillColor);
                svg.select('rect.selectButton').style('fill', TP.Context().highlightFillColor);
                //objectReferences.InteractionObject.addLasso(target);

                //view.getController().sendMessage("select"); //send Message "select" to the StateController

                //objectReferences.InteractionObject.removeZoom(target);
            }

            if (TP.Context().view[target].getMoveMode()) {
                svg.select('rect.moveButton').style('fill', TP.Context().highlightFillColor);
                svg.select('rect.selectButton').style('fill', TP.Context().defaultFillColor);
                //objectReferences.InteractionObject.removeLasso(target);
                //objectReferences.InteractionObject.addZoom(target);

                //view.getController().sendMessage("move");
            }
        }

        /*
         this.addSettingsButton = function (target) {
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


        this.addInfoBox = function (_event) {
            var node = event.associatedData.node;
            $("#infoNodes ul").empty();
            for (var k in node) {
                $('#infoNodes ul').append("<li><label style='font-weight:bold'>" + k + ":</label> " + node[k] + "</li>");
            }
        }


        this.setCombinedForeground = function (target) {
            //assert(true, 'Interface -> setCombinedForeground')
            TP.Context().combined_foreground = target;
            var toggleBtnText = ""
            if (target == "substrate") {
                toggleBtnText = "catalyst";
            } else if (target == "catalyst") {
                toggleBtnText = "substrate";
            }

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
            //assert(true, 'Interface -> toggleCombinedForeground')
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
                s1 = this.tileDialog(tabView.slice(0,length/2), x,y,hbis,wbis,!sens)
                s2 = this.tileDialog(tabView.slice(length/2, length), x+(w-wbis), y+(h-hbis),hbis,wbis,!sens);
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
            }
        }

        // gestion du menu à gauche

        this.toggleAccordion = function(menu){
            $("#"+menu+" ul.family:not('.open_at_load')").hide();
            $("#"+menu+" li.tglFamily > a").click(function () {
                if ($(this).next("#"+menu+" ul.family:visible").length != 0) {
                    $(this).next("#"+menu+" ul.family").slideUp("normal", function () {
                        $(this).parent().removeClass("open")
                    });
                } else {
                    $("#"+menu+" ul.family").slideUp("normal", function () {
                        $(this).parent().removeClass("open")
                    });
                    $(this).next("#"+menu+" ul.family").slideDown("normal", function () {
                        $(this).parent().addClass("open")
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
                    menu.css('z-index', 102)
                }
                else if (parent.className === 'sidebar') {

                    if (menu.css('z-index') == 102) {
                        /*button.text('>');*/
                        button.eq(0).toggleClass('open')

                        //console.log($(parent))
                        $(parent).eq(0).toggleClass('nosidebar sidebar')
                        //              parent.className = 'nosidebar';
                        $('.cont').each(function () {
                            $(this).css('z-index', 0)
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
                            $(this).css('z-index', 101)
                        })
                        menu.css('z-index', 102);
                        /*button.text('<')*/
                        button.eq(0).toggleClass('open')
                        //button.css('background', "url(css/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png) 50% 50% repeat-x")

                    }
                }
                else console.log('FAIL: toggle panel');
            });
        }

        this.addPanelMenu = function (header) {

            var menuNum = contxt.menuNum++;
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
            $('<ul/>', {id: 'nav',class:'nav'}).appendTo(content);
            for (var key in buttons) {
                if(key!="View"){
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

        this.visuPane = function (buttons, mode) {
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


        this.createElements = function(tab, parentId){
            var par = $(parentId)
            for(k in tab){
                if($("#"+tab[k][1].id).length!=0){
                    // assert(false, "Warning: The id " + tab[k][1].id + " already exists.")
                }
                switch(tab[k][0]){
                    case 0: // select
                        par.append(tab[k][3])
                        var div = $('<select>', tab[k][1]).appendTo(parentId);
                        for(opt in tab[k][2]){
                            $('<option/>',{value:tab[k][2][opt].value, text:tab[k][2][opt].text}).appendTo(div)
                        }
                        par.append(tab[k][4])
                        par.append("<br/>")
                        break;
                    case 1: // radio
                        par.append(tab[k][3])
                        var form = $('<form>', tab[k][1]).appendTo(parentId);
                        form.addClass('radio')
                        for(opt in tab[k][2]){
                            var input = $('<input/>',tab[k][2][opt]).appendTo(form)
                            input.attr("type","radio")
                            $('<label/>',{text:tab[k][2][opt].text}).appendTo(form)
                            $(form).append("<br/>")
                        }
                        par.append(tab[k][4])
                        par.append("<br/>")
                        $('.'+tab[k][2][0].class).change(function () {
                            if ($(this).hasClass('selected')) {
                                $(this).removeClass('selected');
                            }
                            else {
                                $(this).addClass('selected');
                                $(this).siblings().each(function () {
                                    $(this).removeClass('selected');
                                })
                            }
                        })
                        break;
                    case 2: // checkbox
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
                    case 3: // textfield
                        par.append(tab[k][3])
                        var div =$('<input/>',tab[k][1]).appendTo(parentId)
                        div.attr("type","text")
                        par.append(tab[k][4])
                        par.append("<br/>")
                        break;
                    case 4: //slider
                        par.append(tab[k][3])
                        var div = $('<div/>',tab[k][1]).appendTo(parentId)
                        par.append(tab[k][4])
                        par.append("<br/>")
                        div.slider(tab[k][2]);
                        break;
                    case 5: //spinner
                        par.append(tab[k][3])
                        var div = $('<input/>', tab[k][1]).appendTo(parentId)
                        par.append(tab[k][4])
                        par.append("<br/>")
                        div.spinner(tab[k][2]);
                        break;
                    case 7: //color picker
                        par.append(tab[k][3])
                        var div = $('<div/>', tab[k][1]).appendTo(parentId)
                        par.append(tab[k][4])
                        par.append("<br/>")
                        var f = $.farbtastic('#'+tab[k][1].id);
                        f.linkTo(tab[k][5].func);
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

                var fam = null;
                if (param == '') {
                    fam = $('<li/>', {class: 'form'}).appendTo('#' + menu);
                    var button = $('<a/>', {text: label}).appendTo(fam)
                    $(button).click(evnt.click);
                } else {
                    fam = $('<li/>', {class: 'form tglForm'}).appendTo('#' + menu);
                    $('<a/>', {text: label}).appendTo(fam)
                    var form = $('<div/>', {class: 'formParam'}).appendTo(fam)
                    this.createElements(param,form)
                    if(evnt){
                        var submit = $('<button/>', {class: 'submit', text: "Apply"}).appendTo(form);
                        //var submit = this.createElement('button', {class: 'submit', text: "Apply"}, form)
                        submit.click((function (s, e) {
                            return function () {
                                objectReferences.InterfaceObject.callbackMenu(s, e)
                            };
                        })(submit, evnt))
                    }
                }
            }
        }


        this.callbackMenu = function (param, evnt) {
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

            //console.log(res)
            evnt.call(res)
        }

        return __g__;

    }
    TP.Interface = Interface;
})(TP);
