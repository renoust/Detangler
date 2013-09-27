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

            $('#infoView').html("<p> GLOBAL INFORMATIONS: </p>" +
                "<ul>" +
                "<li> File : " + file + "</li>" +
                "<li> View : " + type + "</li>" +
                "<li> - " + cGraph.nodes().length + " nodes </li>" +
                "<li> - " + cGraph.links().length + " links </li>" +
                "</ul>");
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
            // assert(true, 'Interface -> attachInfoBox')
            var infoNodes = $('#infoNodes');
            var nodesBID = $('<select/>',{class:"hidden"});

            infoNodes.html("<p> NODE INFORMATIONS: </p>");
            infoNodes.append("<button id='searchNode'>Search</button>");
            infoNodes.append(nodesBID);
            infoNodes.append("<ul></ul>");

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
                        TP.Controller().sendMessage("mouseoverInfoBox", {node:nodes[n]}, "principal", "undifined");
                        break;
                    }
                }
                
            })

            d3.selectAll(".glyph")
                .on("mouseover", function (d) {
                    TP.Controller().sendMessage("mouseoverInfoBox", {node: d}, "principal", "undifined");
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
            
           	$('#csvFile').click(function(e){
        		$('#fileCSV').click();
        		e.preventDefault();
        	})

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
            $("<div/>", {class: 'cont', id: 'menu-' + menuNum}).appendTo("#wrap");
            $("<div/>", {class: 'toggleButton', id: 'toggleBtn' + menuNum, /*text:'>',*/style: 'top:' + [40 + 104 * (menuNum - 1)] + 'px;'}).appendTo('#menu-' + menuNum);
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
            var menu = this.addPanelMenu('Informations');
            var content = $("#" + menu + " .menu-content");
            var tgbutton = $('#' + menu).find('.toggleButton')
            $('<h3/>', {text: 'Informations'}).appendTo(tgbutton);

            content.css("margin",10)

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
        
        this.importPane = function() {
        	
        	
        	$('<div/>',{id:'parameters'}).appendTo('#container');
        	var dialog = $("#parameters");
			dialog.dialog({
				title: "Build the graph",
				modal: false,
			    height: 600,
			    width: 600,    
			})
			
			
        	$('<div/>',{id:'tabs'}).appendTo('#parameters');
			st =  "<ul>"+
"<li><a href='#tabs-1'>Bases parameters</a></li>"+
"<li><a href='#tabs-2'>Fields parameters</a></li>"+
"<li><a href='#tabs-3'>Draws parameters</a></li>"+
"</ul>"+
"<div id='tabs-1'>"+
"</div>"+
"<div id='tabs-2'>"+
"<p></p>"+
"</div>"+
"<div id='tabs-3'>"+
"<p></p>"+
"<p></p>"+
"</div>"

			document.getElementById('tabs').innerHTML += st
			$("#tabs").tabs();
			
			
			// definition des div du 1er ecran, celui des parametres sur la base
			$('#tabs-1').append('<p>Here are basics changes directly on the base</p>') 
			$('<div/>', {id: 'visuBase'}).appendTo('#tabs-1')
			$('#tabs-1').append('<HR/>')
			$('<div/>',{id: 'radioOption'}).appendTo('#tabs-1')
			$('#tabs-1').append('<HR/>')
			$('<div/>',{id: 'parcOption'}).appendTo('#tabs-1')
			$('#tabs-1').append('<HR/>')
			$('<div/>',{id:'exportOption'}).appendTo('#tabs-1')
			
			//definition de la vue de chaucune des div du premier ecran
			
			//definition de la visubase premeire div
			$('#visuBase').append("<input type = 'text' name = 'labelName' id = 'labelName' readonly='true'/>")
			$('#visuBase').append("see the dataBase  <input type = 'button' name = 'btnSee' text = 'ejjejeje' id = 'btnSee' />")
			$('<div/>', {id: 'visuDiv'}).appendTo('#visuBase')
			
			
			
			//definition de la radioOption div des radiobox
			$('#radioOption').append("<input type='radio' id = 'dropNanValue' name='dropNanValue' value='0'>drop nan value<br>");
			$('#radioOption').append("<div id= 'dropNanDiv'>")
			$('#radioOption').append("<input type='radio' id = 'subsetLines' name='subsetLines' value='0'>subset of lines<br>");
			$('#radioOption').append("<div id = 'subDiv'>")
			$('#radioOption').append("<input type='radio' id = 'subsetColumns' name='subsetColumns' value='0'>subset of columns<br>");
			$('#radioOption').append("<div id = 'subDivCol'>")
			$('#radioOption').append("<input type='radio' id = 'keepSpeValue' name='keepSpeValue' value='0'>keep specific values<br>");
			$('#radioOption').append("<div id = 'keepSpeValueDiv'>")
			$('#radioOption').append("<input type='radio' id = 'edit' name='edit' value='0'>edit<br>");
			$('#radioOption').append("<div id = 'filterInter'>")
        	
        	
        	//definition de la parcOption div des precdeente, suivante
        	$('#parcOption').append("<input type = 'button' name = 'btnPrec' title = 'PREC' id = 'btnPrec' float= 'left'/>")
        	$('#parcOption').append("<input type = 'button' name = 'btnSuiv' title = 'SUIV' id = 'btnSuiv' float= 'right'/>")
        	
        	//definition de la exportOption div de l'export du csv changé
        	$('#exportOption').append("<input type = 'button' name = 'btnExport' title = 'btnExport' id = 'btnExport'/>")
        	
        	
        	//defintion des differentes div des radio de la radioOption
        	$('#dropNanDiv').append("select your column")
			$('<select/>', {id: 'choiceDrop', float: 'left'}).appendTo('#dropNanDiv')
			
        	$('#subDiv').append("keep lines from  "+ "<input type= 'text' name= 'firstLine' id = 'firstLine' value = '0' style='width:30px;' float='left'/> ")
			$('#subDiv').append("to  "+ "<input type= 'text' name= 'secondLine' id = 'secondLine' style='width:30px;' float='left'/>")
			$('#subDiv').append('<button id="ok2">OK</button>')
        	
        	$('#subDivCol').append("select your columns")
			$('<select/>', {id: 'choiceColumn', float:'left'}).appendTo('#subDivCol')
			$('<input/>', {type: 'text', id:'choiceCol', value:'', float: 'right'}).appendTo('#subDivCol')
			$('#subDivCol').append('<button id="okCol">OK</button>')
			
			$('#keepSpeValueDiv').append("select your filter")
			$('<select/>', {id: 'choiceMode'}).appendTo('#keepSpeValueDiv')
			$("<option/>",{value:'drop', text:'drop'}).appendTo("#choiceMode");
			$("<option/>",{value:'keep', text:'keep'}).appendTo("#choiceMode");
			$('#keepSpeValueDiv').append("</br>")
			$('#keepSpeValueDiv').append("select you column")
			$('<select/>', {id: 'choiceC'}).appendTo('#keepSpeValueDiv')
			$('<select/>', {id: 'choiceOp'}).appendTo('#keepSpeValueDiv')
			$("<option/>",{value:'=', text:'='}).appendTo("#choiceOp");
			$("<option/>",{value:'>', text:'>'}).appendTo("#choiceOp");
			$("<option/>",{value:'<', text:'<'}).appendTo("#choiceOp");
			$("<option/>",{value:'==', text:'=='}).appendTo("#choiceOp");
			$('#keepSpeValueDiv').append("<input type='text' name ='valEnr' id='valEnr' value=''/>")
			$('#keepSpeValueDiv').append("</br>")
			$('#keepSpeValueDiv').append('<button id="okKeep">OK</button>')
			
			$('#filterInter').append("Variable to use: df </br>")
			$('#filterInter').append("<input type='text' name='txt' id='txt' value = 'mark your function'/></br>")
			$('#filterInter').append('<button id="ok">OK</button>')
			
			
			$('#dropNanDiv').css('display', 'none');
			$('#dropNandiv').css("visibility","hidden");
			
			$('#subDiv').css('display', 'none');
			$('#subDiv').css("visibility","hidden");
			
			$('#subDivCol').css('display', 'none');
			$('#subDivCol').css("visibility","hidden");
			
			$('#keepSpeValueDiv').css('display', 'none');
			$('#keepSpeValueDiv').css("visibility","hidden");
			
			
			$('#filterInter').css('display', 'none');
			$('#filterInter').css("visibility","hidden");
        	
        	
        	$('#dropNanValue').click(function() {
        		var val = document.getElementById('dropNanValue').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#dropNanDiv').slideToggle( "slow" );
        			$('#dropNanDiv').css("display","block");
					$('#dropNanDiv').css("visibility","visible");
        			var st  = document.getElementById('radioOption')
					var tab = st.getElementsByTagName('div')
					for (var i=0; i<tab.length; i++) {
						console.log(tab[i].id)
						if (tab[i].id != 'dropNanDiv') {
							$(tab[i]).css("display","none");
							$(tab[i]).css("visibility","hidden");
							console.log(document.getElementById(tab[i].id))
						}
					}			
				
					var inputs =  st.getElementsByTagName('input');
					console.log(inputs)
					for(var i = 0; i < inputs.length; i++) {
    					if(inputs[i].type.toLowerCase() == 'radio' && inputs[i].id !='dropNanValue') {
        					$(inputs[i]).attr('checked', false)
    					}
					}
        			
        		}
        		else {
        			$('#dropNanValue').attr('checked', false)
        		}
        	})
        	
        	
        	$('#subsetLines').click(function() {
        		var val = document.getElementById('subsetLines').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#subDiv').slideToggle( "slow" );
        			$('#subDiv').css("display","block");
					$('#subDiv').css("visibility","visible");
        			var st  = document.getElementById('radioOption')
					var tab = st.getElementsByTagName('div')
					for (var i=0; i<tab.length; i++) {
						console.log(tab[i].id)
						if (tab[i].id != 'subDiv') {
							$(tab[i]).css("display","none");
							$(tab[i]).css("visibility","hidden");
							console.log(document.getElementById(tab[i].id))
						}
					}			
				
					var inputs =  st.getElementsByTagName('input');
					console.log(inputs)
					for(var i = 0; i < inputs.length; i++) {
    					if(inputs[i].type.toLowerCase() == 'radio' && inputs[i].id !='subsetLines') {
        					$(inputs[i]).attr('checked', false)
    					}
					}
        			
        		}
        		else {
        			$('#subsetLines').attr('checked', false)
        		}
        	})
        	
        	
        	$('#subsetColumns').click(function() {
        		var val = document.getElementById('subsetColumns').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#subDivCol').slideToggle( "slow" );
        			$('#subDivCol').css("display","block");
					$('#subDivCol').css("visibility","visible");
        			var st  = document.getElementById('radioOption')
					var tab = st.getElementsByTagName('div')
					for (var i=0; i<tab.length; i++) {
						console.log(tab[i].id)
						if (tab[i].id != 'subDivCol') {
							$(tab[i]).css("display","none");
							$(tab[i]).css("visibility","hidden");
							console.log(document.getElementById(tab[i].id))
						}
					}			
				
					var inputs =  st.getElementsByTagName('input');
					console.log(inputs)
					for(var i = 0; i < inputs.length; i++) {
    					if(inputs[i].type.toLowerCase() == 'radio' && inputs[i].id !='subsetColumns') {
        					$(inputs[i]).attr('checked', false)
    					}
					}
        			
        		}
        		else {
        			$('#subsetColumns').attr('checked', false)
        		}
        	})
        	
        	$('#keepSpeValue').click(function() {
        		var val = document.getElementById('keepSpeValue').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#keepSpeValueDiv').slideToggle( "slow" );
        			$('#keepSpeValueDiv').css("display","block");
					$('#keepSpeValueDiv').css("visibility","visible");
        			var st  = document.getElementById('radioOption')
					var tab = st.getElementsByTagName('div')
					for (var i=0; i<tab.length; i++) {
						console.log(tab[i].id)
						if (tab[i].id != 'keepSpeValueDiv') {
							$(tab[i]).css("display","none");
							$(tab[i]).css("visibility","hidden");
							console.log(document.getElementById(tab[i].id))
						}
					}			
				
					var inputs =  st.getElementsByTagName('input');
					console.log(inputs)
					for(var i = 0; i < inputs.length; i++) {
    					if(inputs[i].type.toLowerCase() == 'radio' && inputs[i].id !='keepSpeValue') {
        					$(inputs[i]).attr('checked', false)
    					}
					}
        			
        		}
        		else {
        			$('#keepSpeValue').attr('checked', false)
        		}
        	})
        	
        	
        	$('#edit').click(function() {
        		var val = document.getElementById('edit').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#filterInter').slideToggle( "slow" );
        			$('#filterInter').css("display","block");
					$('#filterInter').css("visibility","visible");
        			var st  = document.getElementById('radioOption')
					var tab = st.getElementsByTagName('div')
					for (var i=0; i<tab.length; i++) {
						console.log(tab[i].id)
						if (tab[i].id != 'filterInter') {
							$(tab[i]).css("display","none");
							$(tab[i]).css("visibility","hidden");
							console.log(document.getElementById(tab[i].id))
						}
					}			
				
					var inputs =  st.getElementsByTagName('input');
					console.log(inputs)
					for(var i = 0; i < inputs.length; i++) {
    					if(inputs[i].type.toLowerCase() == 'radio' && inputs[i].id !='edit') {
        					$(inputs[i]).attr('checked', false)
    					}
					}
        			
        		}
        		else {
        			$('#edit').attr('checked', false)
        		}
        	})
        	
        	
        	$('#parameters').parent().css("display","none");
			$('#parameters').parent().css("visibility","hidden");
        	
        	
        	$( "#btnSee" ).click(function() {
        		console.log('jjrjrjrjrjrjrj fiucking this shit motah fucka')
  				$('#visuDiv').slideToggle( "slow" );
  				$('#dropNanDiv').css("display","block");
				$('#dropNanDiv').css("visibility","visible");
			});
        	
        	
        	$('#choiceDrop').click(function() {
        		name = document.getElementById('labelName').value
        		name2 = document.getElementById('choiceDrop').options[document.getElementById('choiceDrop').selectedIndex].value
        		objectReferences.ClientObject.updateNewBase(name, 'choiceDrop')
        	})
        	
        	
        	$('#ok2').click(function() {
				name = document.getElementById('labelName').value
				firstVal = document.getElementById('firstLine').value
				secondVal = document.getElementById('secondLine').value
				objectReferences.ClientObject.updateNewBase(name, 'subsetLines')
			})	
        	
        	
        	$('#choiceColumn').click(function() {
        		name = document.getElementById('choiceColumn').options[document.getElementById('choiceColumn').selectedIndex].value
        		console.log('name   '+ name)
        		console.log(document.getElementById('choiceCol').value)
        		if (document.getElementById('choiceCol').value == '') {
        			document.getElementById('choiceCol').value = name
        		}
        		else {
        			document.getElementById('choiceCol').value = document.getElementById('choiceCol').value + '  and  '+ name
        		}
        	})
        	
        	
        	$('#okCol').click(function() {
        		console.log('let the night begin')
        		name = document.getElementById('labelName').value
        		txt = document.getElementById('choiceCol').value
        		objectReferences.ClientObject.updateNewBase(name, 'choiceColumn')
        	})
        	
        	
        	$('#okKeep').click(function() {
        		name = document.getElementById('labelName').value
        		objectReferences.ClientObject.updateNewBase(name, 'keepSpeValues')
        	})
        	
        	$('#ok').click(function() {
				name = document.getElementById('labelName').value
				expr = document.getElementById('txt').value
				console.log('expr:',  expr)
				objectReferences.ClientObject.updateNewBase(name,'edit')
			})
			
			$('#btnExport').click(function () {
        		var favorite = window.prompt('mark your path', '');
        		if (favorite) {
        			console.log(favorite)
        			name = document.getElementById('labelName').value
        			objectReferences.ClientObject.exportCSV(name, favorite)
        		}
            });
            
            $('#btnPrec').click(function() {
        		name = document.getElementById('labelName').value
        		objectReferences.ClientObject.handleVersionBases(name, 'prec')
        	})
			
			$('#btnSuiv').click(function() {
        		name = document.getElementById('labelName').value
        		objectReferences.ClientObject.handleVersionBases(name, 'suiv')
        	})	
            
            
        	
        	
        	
        	
        	//definition des div de la fenetre de trace de graphe
        	$('#tabs-3').append('<p>Here are options to nodes and links parameters</p>') 
			$('<div/>', {id: 'labelOption'}).appendTo('#tabs-3')
			$('#tabs-3').append('<HR/>')
			$('<div/>',{id: 'linkOption'}).appendTo('#tabs-3')
			$('#tabs-3').append('<HR/>')
			$('<div/>',{id: 'JSONExportOption'}).appendTo('#tabs-3')
			$('#tabs-3').append('<HR/>')
			$('<div/>',{id:'AlgoOption'}).appendTo('#tabs-3')
			$('#tabs-3').append('<HR/>')
			$('<div/>',{id:'PandasOption'}).appendTo('#tabs-3')
			
			
			$('#labelOption').append('Choose your label field');
			$('<select/>', {id: 'nodes', float:'left'}).appendTo('#labelOption');
			
			
        	$('#linkOption').append("<input type='radio' id = 'checkTaux' name='checkTaux' value='0' checked='checked'/>Coefficient Filter<br>")
			$('<div/>',{id:'linkCoef', float: 'left'}).appendTo('#linkOption');
			
			$('#linkOption').append("<input type='radio' id = 'equa' name='equa' value='0'/>boolean expression<br>")
			$('<div/>',{id:'linkEqua', float: 'left'}).appendTo('#linkOption');
			
			$('#linkOption').append("<input type='radio' id = 'jacques' name='jacques' value='0'/>jacquard distance<br>")
			$('<div/>', {id:'linkJacques', float: 'right'}).appendTo('#linkOption')
			
			
			$('#linkOption').append("<input type='radio' id = 'randAlg' name='randAlg' value='0'/>write your own condition<br>")
        	$('<div/>', {id:'txtAlg', float: 'right'}).appendTo('#linkOption')
        	
        	
        	$('#linkOption').append("<input type='checkbox' id = 'nodesVroo' name='nodesVroo' value='0' checked='checked'/>show non linked nodes<br>")
        	
        	
        	
        	
        	
        	$('#linkCoef').append('coefficient')
			$('#linkCoef').append("<input type = 'text' name = 'borneCoef' id = 'borneCoef' value ='0' flaot= 'left'/>")
			
			$('#linkEqua').append("<input type = 'text' name='equaTXT' id = 'equaTXT' placeholder = 'mark your boolean function by using fields'/><br> ")
			$('#linkEqua').append("<label id='okEqua'>wrong equation</label>")
			
			$('#linkJacques').append('from')
			$('#linkJacques').append("<input type = 'text' name = 'borneLeft' id = 'borneLeft' value ='0'/>")
			$('#linkJacques').append('to')
			$('#linkJacques').append("<input type = 'text' name = 'borneRight' id = 'borneRight' value ='1'/>")
			
			$('#txtAlg').append("<TEXTAREA id = 'algorithm' name='algorithm' rows=4 cols=40>write your favorite algorithm</TEXTAREA>")
			$('#algorithm').append("<button id='ifBtn'>IF</button>")
			
        	
        	$('#linkEqua').css("display","none");
			$('#linkEqua').css("visibility","hidden");
			
			$('#linkCoef').css("display","none");
			$('#linkEqua').css("visibility","hidden");
			
			$('#linkCoef').css("display","none");
			$('#linkCoef').css("visibility","hidden");
			
			$('#linkJacques').css("display","none");
			$('#linkJacques').css("visibility","hidden");
			
			
			$('#txtAlg').css("display","none");
			$('#txtAlg').css("visibility","hidden");
        	
        	
        	$('#checkTaux').click(function() {
        		var val = document.getElementById('checkTaux').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#linkCoef').slideToggle( "slow" );
        			$('#linkCoef').css("display","block");
					$('#linkCoef').css("visibility","visible");
        			var st  = document.getElementById('linkOption')
					var tab = st.getElementsByTagName('div')
					for (var i=0; i<tab.length; i++) {
						console.log(tab[i].id)
						if (tab[i].id != 'linkCoef') {
							$(tab[i]).css("display","none");
							$(tab[i]).css("visibility","hidden");
							console.log(document.getElementById(tab[i].id))
						}
					}			
				
					var inputs =  st.getElementsByTagName('input');
					console.log(inputs)
					for(var i = 0; i < inputs.length; i++) {
    					if(inputs[i].type.toLowerCase() == 'radio' && inputs[i].id !='checkTaux') {
        					$(inputs[i]).attr('checked', false)
    					}
					}
        			
        		}
        		else {
        			$('#checkTaux').attr('checked', false)
        		}
        	})
        	
        	$('#equa').click(function() {
        		var val = document.getElementById('equa').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#linkEqua').slideToggle( "slow" );
        			$('#linkEqua').css("display","block");
					$('#linkEqua').css("visibility","visible");
        			var st  = document.getElementById('linkOption')
					var tab = st.getElementsByTagName('div')
					for (var i=0; i<tab.length; i++) {
						console.log(tab[i].id)
						if (tab[i].id != 'linkEqua') {
							$(tab[i]).css("display","none");
							$(tab[i]).css("visibility","hidden");
							console.log(document.getElementById(tab[i].id))
						}
					}			
				
					var inputs =  st.getElementsByTagName('input');
					console.log(inputs)
					for(var i = 0; i < inputs.length; i++) {
    					if(inputs[i].type.toLowerCase() == 'radio' && inputs[i].id !='equa') {
        					$(inputs[i]).attr('checked', false)
    					}
					}
        			
        		}
        		else {
        			$('#equa').attr('checked', false)
        		}
        	})
        	
        	$('#jacques').click(function() {
        		var val = document.getElementById('jacques').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#linkJacques').slideToggle( "slow" );
        			$('#linkJacques').css("display","block");
					$('#linkJacques').css("visibility","visible");
        			var st  = document.getElementById('linkOption')
					var tab = st.getElementsByTagName('div')
					for (var i=0; i<tab.length; i++) {
						console.log(tab[i].id)
						if (tab[i].id != 'linkJacques') {
							$(tab[i]).css("display","none");
							$(tab[i]).css("visibility","hidden");
							console.log(document.getElementById(tab[i].id))
						}
					}			
				
					var inputs =  st.getElementsByTagName('input');
					console.log(inputs)
					for(var i = 0; i < inputs.length; i++) {
    					if(inputs[i].type.toLowerCase() == 'radio' && inputs[i].id !='jacques') {
        					$(inputs[i]).attr('checked', false)
    					}
					}
        			
        		}
        		else {
        			$('#jacques').attr('checked', false)
        		}
        	})
        	
        	
        	$('#randAlg').click(function() {
        		var val = document.getElementById('randAlg').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#txtAlg').slideToggle( "slow" );
        			$('#txtAlg').css("display","block");
					$('#txtAlg').css("visibility","visible");
        			var st  = document.getElementById('linkOption')
					var tab = st.getElementsByTagName('div')
					for (var i=0; i<tab.length; i++) {
						console.log(tab[i].id)
						if (tab[i].id != 'txtAlg') {
							$(tab[i]).css("display","none");
							$(tab[i]).css("visibility","hidden");
							console.log(document.getElementById(tab[i].id))
						}
					}			
				
					var inputs =  st.getElementsByTagName('input');
					console.log(inputs)
					for(var i = 0; i < inputs.length; i++) {
    					if(inputs[i].type.toLowerCase() == 'radio' && inputs[i].id !='randAlg') {
        					$(inputs[i]).attr('checked', false)
    					}
					}
        			
        		}
        		else {
        			$('#randalg').attr('checked', false)
        		}
        	})
        	
        	
        	$('#borneCoef').keyup(function() {
				name = document.getElementById('labelName').value
				valCoef = document.getElementById('borneCoef').value
				res = objectReferences.ViewImportObject.handleCoeffEquation(name,valCoef)
				
			})
			
			$('#equaTXT').keyup(function() {
				name = document.getElementById('labelName').value
				val = document.getElementById('equaTXT').value
				res = objectReferences.ViewImportObject.handleBooleanEquation(name, val)
				if (res) {
					document.getElementById('okEqua').innerHTML = 'Correct equation'
				}
				else {
					document.getElementById('okEqua').innerHTML = 'Wrong equation'
					console.log('wrong')
				}
			})
        	
        	
        	$('#borneLeft').keyup(function() {
				name = document.getElementById('labelName').value				
				valLeft = document.getElementById('borneLeft').value
				valRight = document.getElementById('borneRight').value
				res = objectReferences.ViewImportObject.handleJacquardEquation(name,valLeft, valRight)
			})
			
			$('#borneRight').keyup(function() {
				name = document.getElementById('labelName').value
				valLeft = document.getElementById('borneLeft').value
				valRight = document.getElementById('borneRight').value
				res = objectReferences.ViewImportObject.handleJacquardEquation(name,valLeft, valRight)
			})

        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	
        	/*
        	
        	
        	
        	
        	
        	
        	
			//var head = $('#param').parents('.ui-dialog').find('.ui-dialog-titlebar');
			
			$('<div/>',{id:'buil'}).appendTo('#container');
        	var dialog = $("#buil");
			dialog.dialog({
				title: "Build the graph",
				modal: false,
			    height: 600,
			    width: 600,    
			})
			
			//$('onglet_0 onglet', {id:'onglet_nom_de_longlet'}).appendTo('#buil') 
			//$('#buil').append("<span class='onglet_0 onglet' id='onglet_nom_de_longlet'>Nom de l'onglet</span>")
			
			$('<div/>',{id:'tabs'}).appendTo('#buil');
			st =  "<ul>"+
"<li><a href='#tabs-1'>Bases parameters</a></li>"+
"<li><a href='#tabs-2'>Fields parameters</a></li>"+
"<li><a href='#tabs-3'>Draws parameters</a></li>"+
"</ul>"+
"<div id='tabs-1'>"+
"</div>"+
"<div id='tabs-2'>"+
"<p>da, meelis. Mauris consectetur tortor et purus.</p>"+
"</div>"+
"<div id='tabs-3'>"+
"<p>Mat nec, luctus a, lacus.</p>"+
"<p>Dtesque nec elit. Fusce in lacus. Vivamus a libero vitae lectus hendrerit hendrerit.</p>"+
"</div>"


			
		
			document.getElementById('tabs').innerHTML += st
			$('#tabs-1').append("<input type='checkbox' id = 'ziz' name='randAlg' value='0'/>write your own condition<br>")
			
			$( "#tabs" ).tabs();
			
			
			
			
			
    
			
						
			
			$('#buil').append("<button id = 'back'>Back</button>")
			
			$('<div/>',{id:'nodeInt', float: 'left'}).appendTo('#buil');
			$('#nodeInt').append('Choose your node parameter')
			$('<select/>', {id: 'nodes', float:'left'}).appendTo('#nodeInt');
			
			$('<div/>',{id:'linkInt', float: 'left'}).appendTo('#buil');
			$('#linkInt').append('Choose your link option<br>')
			
			$('#linkInt').append("<input type='checkbox' id = 'checkTaux' name='checkTaux' value='0' checked='checked'/>Coefficient Filter<br>")
			$('<div/>',{id:'linkCoef', float: 'left'}).appendTo('#linkInt');
			
			$('#linkInt').append("<input type='checkbox' id = 'equa' name='equa' value='0'/>boolean expression<br>")
			$('<div/>',{id:'linkEqua', float: 'left'}).appendTo('#linkInt');
			
			$('#linkInt').append("<input type='checkbox' id = 'jacques' name='jacques' value='0'/>jacquard distance<br>")
			$('<div/>', {id:'linkJacques', float: 'right'}).appendTo('#linkInt')
			
			
			$('#linkInt').append("<input type='checkbox' id = 'randAlg' name='randAlg' value='0'/>write your own condition<br>")
			$('<div/>', {id:'txtAlg', float: 'right'}).appendTo('#linkInt')
			
			
			$('#txtAlg').append("<TEXTAREA id = 'algorithm' name='algorithm' rows=4 cols=40>write your favorite algorithm</TEXTAREA>")
			
			
			
			
			$('#linkEqua').css("display","none");
			$('#linkEqua').css("visibility","hidden");
			
			$('#linkJacques').css("display","none");
			$('#linkJacques').css("visibility","hidden");
			
			
			$('#txtAlg').css("display","none");
			$('#txtAlg').css("visibility","hidden");
			
			$('#linkCoef').append('coefficient')
			$('#linkCoef').append("<input type = 'text' name = 'borneCoef' id = 'borneCoef' value ='0'/>")
			
			
			$('#linkJacques').append('from')
			$('#linkJacques').append("<input type = 'text' name = 'borneLeft' id = 'borneLeft' value ='0'/>")
			$('#linkJacques').append('to')
			$('#linkJacques').append("<input type = 'text' name = 'borneRight' id = 'borneRight' value ='1'/>")

			$('#linkEqua').append("<input type = 'text' name='equaTXT' id = 'equaTXT' placeholder = 'mark your boolean function by using button'/><br> ")
			$('#linkEqua').append("<label id='okEqua'>wrong equation</label>")
			
			
			$('<div/>', {id: 'paramLiaison', float:'right'}).appendTo('#buil')
		
			
			$('#equa').click(function() {
				var val = document.getElementById('equa').checked
				if (val) {
        			console.log('chechked okkkkkkkkkkkkkkkkkkkkkkkk')
        			$('#linkEqua').css("display","block");
					$('#linkEqua').css("visibility","visible");
        		}
        		else {
        			$('#linkEqua').css("display","none");
					$('#linkEqua').css("visibility","hidden");	
        		}
        	});	
        		
        		
        	$('#randAlg').click(function() {
				var val = document.getElementById('randAlg').checked
				if (val) {
        			console.log('chechked ok')
        			$('#txtAlg').css("display","block");
					$('#txtAlg').css("visibility","visible");
        		}
        		else {
        			$('#txtAlg').css("display","none");
					$('#txtAlg').css("visibility","hidden");	
        		}
			})
			
			$('#jacques').click(function() {
				var val = document.getElementById('jacques').checked
				if (val) {
        			console.log('chechked ok')
        			$('#linkJacques').css("display","block");
					$('#linkJacques').css("visibility","visible");
        		}
        		else {
        			$('#linkJacques').css("display","none");
					$('#linkJacques').css("visibility","hidden");	
        		}
			});
			
			$('#checkTaux').click(function() {
				var val = document.getElementById('checkTaux').checked
				console.log('valllllllllllllllllllllll'+ val)
				if (val) {
        			console.log('chechked ok')
        			$('#linkCoef').css("display","block");
					$('#linkCoef').css("visibility","visible");
        		}
        		else {
        			$('#linkCoef').css("display","none");
					$('#linkCoef').css("visibility","hidden");	
        		}
			});
				/*var divName = 'linkInt'
				var checkBoxName = 'equa'
				var divAsso = 'linkEqua'
				objectReferences.ViewImportObject.closeOtherDiv(divName, checkBoxName, divAsso)
				*/
/*
			
			$('#equaTXT').keyup(function() {
				name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
				val = document.getElementById('equaTXT').value
				res = objectReferences.ViewImportObject.handleBooleanEquation(name, val)
				if (res) {
					document.getElementById('okEqua').innerHTML = 'Correct equation'
				}
				else {
					document.getElementById('okEqua').innerHTML = 'Wrong equation'
					console.log('wrong')
				}
			})
			
			$('#borneCoef').keyup(function() {
				name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
				valCoef = document.getElementById('borneCoef').value
				res = objectReferences.ViewImportObject.handleCoeffEquation(name,valCoef)
				
			})
			
			
			$('#borneLeft').keyup(function() {
				name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
				valLeft = document.getElementById('borneLeft').value
				valRight = document.getElementById('borneRight').value
				res = objectReferences.ViewImportObject.handleJacquardEquation(name,valLeft, valRight)
			})
			
			$('#borneRight').keyup(function() {
				name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
				valLeft = document.getElementById('borneLeft').value
				valRight = document.getElementById('borneRight').value
				res = objectReferences.ViewImportObject.handleJacquardEquation(name,valLeft, valRight)
			})
			
			$('#back').click(function() {
				$('#param').parent().css("display","block");
				$('#param').parent().css("visibility","visible");
				
				$('#buil').parent().css("display","none");
				$('#buil').parent().css("visibility","hidden");
				
				/*$('#dropNanDiv').css('display', 'none');
				$('#dropNandiv').css("visibility","hidden");
				$('#dropNanValue').attr('checked', false)*/
				
		/*		
				var st  = document.getElementById('choiceDF')
				tab = st.getElementsByTagName('div')
				for (var i=0; i<tab.length; i++) {
					console.log(tab[i].id)
					$(tab[i]).css("display","none");
					$(tab[i]).css("visibility","hidden");
					console.log(document.getElementById(tab[i].id))
				}	
				
				var inputs =  st.getElementsByTagName('input');
				console.log(inputs)
				for(var i = 0; i < inputs.length; i++) {
    				if(inputs[i].type.toLowerCase() == 'checkbox') {
        				$(inputs[i]).attr('checked', false)
    				}
				}
				
			})
			
			
			
			console.log('importPane ok!!')
			
        	$('<div/>',{id:'param', class: 'popup_block'}).appendTo('#container');
        	var dialog = $("#param");
			dialog.dialog({
				title: "Bases",
			    height: 600,
			    width: 600,    
			})
			
			
			$('<div/>',{id:'tabs'}).appendTo('#param');
			st =  "<ul>"+
"<li><a href='#tabs-1'>Bases parameters</a></li>"+
"<li><a href='#tabs-2'>Fields parameters</a></li>"+
"<li><a href='#tabs-3'>Draws parameters</a></li>"+
"</ul>"+
"<div id='tabs-1'>"+
"</div>"+
"<div id='tabs-2'>"+
"<p>da, meelis. Mauris consectetur tortor et purus.</p>"+
"</div>"+
"<div id='tabs-3'>"+
"<p>Mat nec, luctus a, lacus.</p>"+
"<p>Dtesque nec elit. Fusce in lacus. Vivamus a libero vitae lectus hendrerit hendrerit.</p>"+
"</div>"


			
		
			document.getElementById('tabs').innerHTML += st
			
			$('#tabs-1').append("<input type='checkbox' id = 'ziz' name='randAlg' value='0'/>write your own condition<br>")
			
			$( "#tabs" ).tabs();
			
			
			$('<div/>',{id:'chBase', style:'background-color:#FFA500'}).appendTo('#param');
			$('<div/>',{id:'btnGest'}).appendTo('#param');
			$('<div/>',{id:'descDF',float:'left'}).appendTo('#param');
			$('<div/>',{id:'choiceDF', float:'left'}).appendTo('#param');
			$('<div/>',{id:'btnDF'}).appendTo('#param');
			
			//$('<div/>',{id: 'filterField'}).appendTo('#param');
			$('#chBase').append("choose the base")
			$('<select/>', {id: 'bases'}).appendTo('#chBase');
			
			
			$('#btnGest').append("<button id='prec'>PREC</button>");
			$('#btnGest').append("<button id='suiv'>SUIV</button>");
			
			
			//$('#btnDF').append("<button id='export'>Export CSV</button>")
			$('#btnDF').append("<input id = 'export' type='button' value= 'export the base to csv'>")
			
			$('#btnDF').append("<button id='draw'>Draw the Graph</button>")
			
			
			
			$('#choiceDF').append("<input type='checkbox' id = 'dropNanValue' name='dropNanValue' value='0'>drop nan value<br>");
			$('#choiceDF').append("<div id= 'dropNanDiv'>")
			$('#choiceDF').append("<input type='checkbox' id = 'subsetLines' name='subsetLines' value='0'>subset of lines<br>");
			$('#choiceDF').append("<div id = 'subDiv'>")
			$('#choiceDF').append("<input type='checkbox' id = 'subsetColumns' name='subsetColumns' value='0'>subset of columns<br>");
			$('#choiceDF').append("<div id = 'subDivCol'>")
			$('#choiceDF').append("<input type='checkbox' id = 'keepSpeValue' name='keepSpeValue' value='0'>keep specific values<br>");
			$('#choiceDF').append("<div id = 'keepSpeValueDiv'>")
			$('#choiceDF').append("<input type='checkbox' id = 'edit' name='edit' value='0'>edit<br>");
			$('#choiceDF').append("<div id = 'filterInter'>")
			
			
			$('#filterInter').css("display","none");
			$('#filterInter').css("visibility","hidden");
			
			$('#dropNanDiv').css("display","none");
			$('#dropNanDiv').css("visibility","hidden");
			
			$('#keepSpeValueDiv').css("display","none");
			$('#keepSpeValueDiv').css("visibility","hidden");
			
			
			
			$('#keepSpeValueDiv').append("select your filter")
			$('<select/>', {id: 'choiceMode'}).appendTo('#keepSpeValueDiv')
			$("<option/>",{value:'drop', text:'drop'}).appendTo("#choiceMode");
			$("<option/>",{value:'keep', text:'keep'}).appendTo("#choiceMode");
			
			
			$('#keepSpeValueDiv').append("</br>")
			$('#keepSpeValueDiv').append("select you column")
			$('<select/>', {id: 'choiceC'}).appendTo('#keepSpeValueDiv')
			$('<select/>', {id: 'choiceOp'}).appendTo('#keepSpeValueDiv')
			$("<option/>",{value:'=', text:'='}).appendTo("#choiceOp");
			$("<option/>",{value:'>', text:'>'}).appendTo("#choiceOp");
			$("<option/>",{value:'<', text:'<'}).appendTo("#choiceOp");
			$("<option/>",{value:'==', text:'=='}).appendTo("#choiceOp");
			$('#keepSpeValueDiv').append("<input type='text' name ='valEnr' id='valEnr' value=''/>")
			$('#keepSpeValueDiv').append("</br>")
			$('#keepSpeValueDiv').append('<button id="okKeep">OK</button>')
			
			
			$('#subDiv').css("display","none");
			$('#subDiv').css("visibility","hidden");
			
			
			$('#subDivCol').css("display","none");
			$('#subDivCol').css("visibility","hidden");
			
			
			$('#subDivCol').append("select your columns")
			$('<select/>', {id: 'choiceColumn'}).appendTo('#subDivCol')
			$('#subDivCol').append("<input type='text' name ='subCol' id='choiceCol' value=''/>")
			$('#subDivCol').append('<button id="okCol">OK</button>')
			
			$('#dropNanDiv').append("select your column")
			$('<select/>', {id: 'choiceDrop'}).appendTo('#dropNanDiv')
			//$('#dropNanDiv').append("<input type= 'text' name= 'dropNan' id = 'choiceDrop' value = '0' style='width:30px;'/>")
			
			
			$('#subDiv').append("keep lines from  "+ "<input type= 'text' name= 'firstLine' id = 'firstLine' value = '0' style='width:30px;'/> ")
			$('#subDiv').append("to  "+ "<input type= 'text' name= 'secondLine' id = 'secondLine' value = '12' style='width:30px;'/>")
			$('#subDiv').append('<button id="ok2">OK</button>')
			
			
			
			$('#filterInter').append("Variable to use: df </br>")
			//$('#filterInter').append("<input type= 'text' name='var' id='var' value = 'df' style='width:30px;'/></br>")
			$('#filterInter').append("<input type='text' name='txt' id='txt' value = 'mark your function'/></br>")
			$('#filterInter').append('<button id="ok">OK</button>')
			
			
			
			//$('#filterInter').parent().css("display","none");
			//$('#filterInter').parent().css("visibility","hidden");
			
			$('#param').parent().css("display","none");
			$('#param').parent().css("visibility","hidden");
			
			$('#buil').parent().css("display","none");
			$('#buil').parent().css("visibility","hidden");
			$('#buil').append("<button id= 'paramWin'>parameteres</button>")
			$('#buil').append("<button id = 'goToDraw'>Draw</button>")
			
			
			$('#paramWin').click(function() {
				
				$('<div/>',{id:'pare'}).appendTo('#container');
        		var dialog = $("#pare");
				dialog.dialog({
					title: "parameters of the field",
					modal: false,
			    	height: 600,
			    	width: 600,    
				})	
			})
			
			$('#goToDraw').click(function() {
				console.log('if you gotta go go now')
				var dico = {}
				var  l1 = document.getElementById("paramLiaison").getElementsByTagName('div');
				for (var i=0; i<l1.length; i++) {
					tog = l1[i]
					console.log(tog.id)
					var tab2 = document.getElementById(tog.id).getElementsByTagName('input')
					if (tab2.length >1) {
						dico[tog.id] = {'different': document.getElementById(tab2[0].id).value, 'equal': document.getElementById(tab2[1].id).options[document.getElementById(tab2[1].id).selectedIndex].value, 'numb':document.getElementById(tab2[2].id).value}
					}
					else {
						dico[tog.id] = {'different': document.getElementById(tab2[0].id).value, 'equal': 'None', 'numb': 'None'}
					}
					
				}
				console.log(dico)	
			});

			$('#bases').change(function(){ 
        		console.log(',fndfnfnnfnfnfnfnffn')
        		name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
        		console.log(name)
        		objectReferences.ViewImportObject.switchDataBase(name); 
        	});
        	
        	$('#dropNanValue').click(function() {
        		var val = document.getElementById('dropNanValue').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#dropNanDiv').css("display","block");
					$('#dropNanDiv').css("visibility","visible");
        		}
        		else {
        			$('#dropNanDiv').css("display","none");
					$('#dropNanDiv').css("visibility","hidden");
        		}
        	})
        	
        	$('#keepSpeValue').click(function() {
        		var val = document.getElementById('keepSpeValue').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#keepSpeValueDiv').css("display","block");
					$('#keepSpeValueDiv').css("visibility","visible");
        		}
        		else {
        			$('#keepSpeValueDiv').css("display","none");
					$('#keepSpeValueDiv').css("visibility","hidden");
        		}
        	})
        	
        	
        	$('#subsetColumns').click(function() {
        		var val = document.getElementById('subsetColumns').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#subDivCol').css("display","block");
					$('#subDivCol').css("visibility","visible");
        		}
        		else {
        			$('#subDivCol').css("display","none");
					$('#ubDivCol').css("visibility","hidden");
        		}
        	})
        	
        	
        	$('#subsetLines').click(function() {
        		var val = document.getElementById('subsetLines').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#subDiv').css("display","block");
					$('#subDiv').css("visibility","visible");
        		}
        		else {
        			
        			$('#subDiv').css("display","none");
					$('#subDiv').css("visibility","hidden");
        			
        		}
        		
        	})
        	
        	$('#edit').click(function() {
        		var val = document.getElementById('edit').checked
        		if (val) {
        			console.log('chechked ok')
        			$('#filterInter').css("display","block");
					$('#filterInter').css("visibility","visible");
        		}
        		else {
        			
        			$('#filterInter').css("display","none");
					$('#filterInter').css("visibility","hidden");
        			
        		}
        		/*console.log('oooooo')
        		console.log($('#filter'))
        		$('#filter').parent().css("display","block");
				$('#filter').parent().css("visibility","visible");*/
        /*	})
        	
        	$('#ok').click(function() {
				name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
				expr = document.getElementById('txt').value
				console.log('expr:',  expr)
				objectReferences.ClientObject.updateNewBase(name,'edit')
			})
				
			$('#ok2').click(function() {
				name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
				firstVal = document.getElementById('firstLine').value
				secondVal = document.getElementById('secondLine').value
				objectReferences.ClientObject.updateNewBase(name, 'subsetLines')
			})	
        	
        	$('#choiceDrop').click(function() {
        		name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
        		name2 = document.getElementById('choiceDrop').options[document.getElementById('choiceDrop').selectedIndex].value
        		objectReferences.ClientObject.updateNewBase(name, 'choiceDrop')
        	})
        	
        	$('#choiceColumn').click(function() {
        		name = document.getElementById('choiceColumn').options[document.getElementById('choiceColumn').selectedIndex].value
        		console.log('name   '+ name)
        		console.log(document.getElementById('choiceCol').value)
        		if (document.getElementById('choiceCol').value == '') {
        			document.getElementById('choiceCol').value = name
        		}
        		else {
        			document.getElementById('choiceCol').value = document.getElementById('choiceCol').value + '  and  '+ name
        		}
        	})
        	
        	$('#okCol').click(function() {
        		console.log('let the night begin')
        		name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
        		txt = document.getElementById('choiceCol').value
        		objectReferences.ClientObject.updateNewBase(name, 'choiceColumn')
        	})
        	
        	$('#okKeep').click(function() {
        		name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
        		objectReferences.ClientObject.updateNewBase(name, 'keepSpeValues')

        	})
        	
        	$('#prec').click(function() {
        		name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
        		objectReferences.ClientObject.handleVersionBases(name, 'prec')
        	})
			
			$('#suiv').click(function() {
        		name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
        		objectReferences.ClientObject.handleVersionBases(name, 'suiv')
        	})	
        	
        	$('#export').click(function () {
        		var favorite = window.prompt('mark your path', '');
        		if (favorite) {
        			console.log(favorite)
        			name = document.getElementById('bases').options[document.getElementById('bases').selectedIndex].value
        			objectReferences.ClientObject.exportCSV(name, favorite)
        		}
            });
            
            $('#draw').click(function() {
            	$('#param').parent().css("display","none");
				$('#param').parent().css("visibility","hidden");
				
				$('#buil').parent().css("display","block");
				$('#buil').parent().css("visibility","visible");
				
				tabSelect = []
            	
            });
            
            
            */
            
            
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
