(function (){

import_class('context.js', 'TP');
import_class("objectContext.js", "TP");


var TulipPosyInterface = function()
{
    var __g__ = this;

	var contxt = TP.Context();
	
	var objectContext = TP.ObjectContext();	
		
        this.includeFormParam = function (target)
        {
                myinput =  svg.append("foreignObject")
                        .attr("width", 100)
                        .attr("height", 100)
                        .append("xhtml:body")
                        .html("<form><input type=checkbox id=check /></form>")
                        .on("click", function(d, i){
                            console.log(svg.select("#check").node().checked);
                        });
                myinput =  svg.append("foreignObject")
                        .attr("width", 300)
                        .attr("height", 100)
                        .attr("x", 200)
                        .attr("y", 200)
                        .append("xhtml:body")
                        .html("<form><input type=input id=input /></form>")
                        //.on("click", function(d, i){
                        //    console.log(svg.select("#input").node().value);
                        //});
                
                console.log("input created", myinput);    
        }


        // This function add all the interface elements for the catalyst view
        this.addInterfaceCatalyst = function()
        {
                var target = "catalyst";
                
                objectContext.TulipPosyInterfaceObject.eraseAllInterface(target);

                objectContext.TulipPosyInterfaceObject.addButton(target, 0, "force layout", "button2", function(){objectContext.TulipPosyClientObject.callLayout(/*"LinLog Layout (Noack)"*/"FM^3 (OGDF)", target)});
                //objectContext.TulipPosyInterfaceObject.addButton(target, 1, "circular layout", "button3", function(){objectContext.TulipPosyClientObject.callLayout("Circular", target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 1, "update layout", "button3", function(){objectContext.TulipPosyClientObject.updateLayout(target)});
                
                //objectContext.TulipPosyInterfaceObject.addButton(target, 2, "random layout", "button4", function(){objectContext.TulipPosyClientObject.callLayout("Random", target)});
                //objectContext.TulipPosyInterfaceObject.addButton(target, 3, "reset view", "button5", function(){objectContext.TulipPosyVisualizationObject.resetView(target)});
                //objectContext.TulipPosyInterfaceObject.addButton(target, 4, "degree metric", "button6", function(){ objectContext.TulipPosyClientObject.callLayout("FM^3 (OGDF)", target)/*objectContext.TulipPosyClientObject.callFloatAlgorithm("Degree", target)*/});
                //objectContext.TulipPosyInterfaceObject.addButton(target, 5, "btw. centrality", "button7", function(){objectContext.TulipPosyClientObject.callFloatAlgorithm("Betweenness Centrality", target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 2, "reset size", "button8", function(){objectContext.TulipPosyVisualizationObject.resetSize(target)});  
                objectContext.TulipPosyInterfaceObject.addButton(target, 3, "hide labels", "showHideLabels", function(){objectContext.TulipPosyVisualizationObject.showhideLabels(target)});              
                objectContext.TulipPosyInterfaceObject.addButton(target, 4, "hide links", "showHideLinks", function(){objectContext.TulipPosyVisualizationObject.showhideLinks(target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 5, "node information", "infoBox", function(){objectContext.TulipPosyInterfaceObject.attachInfoBox(target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 6, "operator "+contxt.catalyst_sync_operator, "toggleCatalystOp", function(){objectContext.TulipPosyInteractionObject.toggleCatalystSyncOperator()});
                objectContext.TulipPosyInterfaceObject.addButton(target, 7, "weight mapping", "button9", function(){objectContext.TulipPosyVisualizationObject.sizeMapping("weight", target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 8, "ent. mapping", "button10", function(){objectContext.TulipPosyVisualizationObject.sizeMapping("entanglementIndice", target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 9, "ent. color", "button11", function(){objectContext.TulipPosyVisualizationObject.colorMapping("entanglementIndice", target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 10, "computeMatrix", "button12", function(){objectContext.TulipPosyVisualizationObject.buildEdgeMatrices()});
                //objectContext.TulipPosyInterfaceObject.addButton(target, 15, "arrange labels", "arrLabels", function(){objectContext.TulipPosyVisualizationObject.arrangeLabels(target)});

                objectContext.TulipPosyInterfaceObject.addGraphInteractorButtons(target, 11);
        
                objectContext.TulipPosyInterfaceObject.addInfoButton(target);

        }

        // This function add all the interface elements for the substrate view
        this.addInterfaceSubstrate = function()
        {
                var target = 'substrate'

                objectContext.TulipPosyInterfaceObject.eraseAllInterface(target);

                objectContext.TulipPosyInterfaceObject.addButton(target, 0, "induced subgraph", "button1", function(){objectContext.TulipPosyClientObject.sendSelection(objectContext.TulipPosyClientObject.getSelection(target), target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 1, "force layout", "button2", function(){objectContext.TulipPosyClientObject.callLayout("FM^3 (OGDF)", target)});
                //objectContext.TulipPosyInterfaceObject.addButton(target, 2, "circular layout", "button3", function(){objectContext.TulipPosyClientObject.callLayout("Circular", target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 2, "delete selection"/*"random layout"*/, "button4", function(){objectContext.TulipPosyInteractionObject.delSelection() /*TulipPosyClientObject.callLayout("Random", target)*/});
                objectContext.TulipPosyInterfaceObject.addButton(target, 3, "reset view", "button5", function(){objectContext.TulipPosyVisualizationObject.resetView(target)});
                //objectContext.TulipPosyInterfaceObject.addButton(target, 5, "degree metric", "button6", function(){objectContext.TulipPosyClientObject.callLayout("LinLog Layout (Noack)", target);/*objectContext.TulipPosyClientObject.callFloatAlgorithm("Degree", target)*/});
                //objectContext.TulipPosyInterfaceObject.addButton(target, 6, "btw. centrality", "button7", function(){objectContext.TulipPosyClientObject.callFloatAlgorithm("Betweenness Centrality", target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 4, "analyse", "button8", function(){objectContext.TulipPosyClientObject.analyseGraph()});
                objectContext.TulipPosyInterfaceObject.addButton(target, 5, "reset size", "button9", function(){objectContext.TulipPosyVisualizationObject.resetSize(target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 6, "hide labels", "showHideLabels", function(){objectContext.TulipPosyVisualizationObject.showhideLabels(target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 7, "hide links", "showHideLinks", function(){objectContext.TulipPosyVisualizationObject.showhideLinks(target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 8, "node information", "infoBox", function(){objectContext.TulipPosyInterfaceObject.attachInfoBox(target)});
                objectContext.TulipPosyInterfaceObject.addButton(target, 9, "sync layouts", "button10", function(){objectContext.TulipPosyClientObject.syncLayouts()});
                //objectContext.TulipPosyInterfaceObject.addButton(target, 13, "arrange labels", "arrLabels", function(){objectContext.TulipPosyVisualizationObject.arrangeLabels(target)});
                //objectContext.TulipPosyInterfaceObject.addButton(target, 14, "labels foward", "buttonLblFwd", function(){objectContext.TulipPosyVisualizationObject.bringLabelsForward(target);});
                
                objectContext.TulipPosyInterfaceObject.addGraphInteractorButtons(target, 10);
                objectContext.TulipPosyInterfaceObject.addEntanglementFeedback(target);
                objectContext.TulipPosyInterfaceObject.addInfoButton(target);
                //objectContext.TulipPosyInterfaceObject.addSettingsButton();
        }

        this.addInterfaceCombined = function()
        {
                var target = "combined";
                objectContext.TulipPosyInterfaceObject.eraseAllInterface(target);

                objectContext.TulipPosyInterfaceObject.addGraphInteractorButtons(target, 0);
                objectContext.TulipPosyInterfaceObject.addButton(target, 2, "fg "+contxt.combined_foreground, "toggleCombinedForeground", function(){objectContext.TulipPosyInterfaceObject.toggleCombinedForeground()});
                objectContext.TulipPosyInterfaceObject.addButton(target, 3, "arrange labels", "button11", function(){objectContext.TulipPosyVisualizationObject.arrangeLabels(target)});

        }

        this.eraseAllInterface = function(target)
        {
                var cGraph = null
                var svg = null

                svg = contxt.getViewSVG(target);
                cGraph = contxt.getViewGraph(target);

                var coh = svg.selectAll(".interfaceButton").data([]).exit().remove()
                

        }

        // This function adds a small frame that displays the entanglement informations while they are updated
        // target, the string of the svg interface to draw the frame in
        this.addEntanglementFeedback = function(target)
        {
                var cGraph = null
                var svg = null

                svg = contxt.getViewSVG(target);
                cGraph = contxt.getViewGraph(target);

                var coh = svg.selectAll("rect entanglement").data(["entanglement"]).enter().append('g')
                        .attr("transform", function(d) { return "translate(" + 10 + "," + 395 + ")"; })
                
                coh.append("rect")
                        .attr("class", "entanglementframe")
                        .classed("interfaceButton", 1)
                        .attr("width", 120)
                        .attr("height", 90)
                        .style("fill-opacity", 0)
                        .style("stroke-width", 1)
                        .style("stroke", 'black')        

                coh.append("text")
                        .attr('class', 'entanglementlabel')
                        .classed("interfaceButton", 1)
                        .attr("dx", 5)
                        .attr("dy", 15)
                        .text("Entanglement")
                        .style("fill", 'black')
                        .style("font-family", contxt.defaultTextFont)
                        .style("font-size", contxt.defaultTextSize)

                coh.append("text")
                        .attr('class', 'intensitylabel')
                        .classed("interfaceButton", 1)
                        .attr("dx", 10)
                        .attr("dy", 35)
                        .text("intensity:")
                        .style("fill", 'black')
                        .style("font-size", contxt.defaultTextSize)
                        .style("font-family", contxt.defaultTextFont)

                coh.append("text")
                        .attr('class', 'intensity')
                        .classed("interfaceButton", 1)
                        .attr("dx", 110)
                        .attr("dy", 50)
                        .text(function(d){return ""+contxt.entanglement_intensity})
                        .style("fill", 'blue')
                        .style("font-family", contxt.defaultTextFont)
                        .style("font-size", contxt.defaultTextSize)
                        .style('text-anchor', 'end')

                coh.append("text")
                        .attr('class', 'homogeneitylabel')
                        .classed("interfaceButton", 1)
                        .attr("dx", 10)
                        .attr("dy", 70)
                        .attr("width", 120)
                        .style("font-family", contxt.defaultTextFont)
                        .text('homogeneity:')
                        .style("font-size", contxt.defaultTextSize)
                        .style("fill", 'black')

                coh.append("text")
                        .attr('class', 'homogeneity')
                        .classed("interfaceButton", 1)
                        .attr("dx", 110)
                        .attr("dy", 85)
                        .text(function(d){return ""+contxt.entanglement_homogeneity})
                        .style('text-anchor', 'end')
                        .style("font-family", contxt.defaultTextFont)
                        .style("fill", 'blue')
                        .style("font-size", contxt.defaultTextSize)

        }



       // This function adds the graph interactor buttons (move and select) to a target interface.
        // target, the string of the svg interface to draw the buttons in
        // positionNumber, the position at which we want to place the buttons
        // One button triggers the other one on or off, and refers to the global mode variable 'move_mode' or 'select_mode'
        this.addGraphInteractorButtons = function(target, positionNumber)
        {
                var cGraph = null
                var svg = null

                svg = contxt.getViewSVG(target);
                cGraph = contxt.getViewGraph(target);

                var btMove = svg.selectAll("rect.moveButton").data([{text:"move", colorOver:contxt.defaultFillColor, colorOut:contxt.highlightFillColor}]).enter().append('g')
                        .attr("class", "moveButton")
                        .classed("interfaceButton", 1)
                        .attr("transform", function(d) { return "translate(" + 10 + "," + (10+25*positionNumber) + ")"; })
                        .on("click", function(d){
                                d3.select(this).select("rect").style("fill","yellow"); 
                                objectContext.TulipPosyInterfaceObject.toggleSelectMove(target);
                        })
                        .on("mouseover", function(d){
                                contxt.mouse_over_button = true;
                                if(!eval("TP.Context().move_mode_"+target)){
                                        d.colorOver = contxt.highlightFillColor; 
                                        d.colorOut = contxt.defaultFillColor;
                                }else{
                                        d.colorOver = contxt.defaultFillColor; 
                                        d.colorOut = contxt.highlightFillColor;
                                }
                                d3.select(this).select("rect").style("fill", d.colorOver);})
                        .on("mouseout", function(d){
                                contxt.mouse_over_button = false;
                                if(!eval("TP.Context().move_mode_"+target)){
                                        d.colorOver = contxt.highlightFillColor; 
                                        d.colorOut = contxt.defaultFillColor;
                                }else{
                                        d.colorOver = contxt.defaultFillColor; 
                                        d.colorOut = contxt.highlightFillColor;
                                }
                                d3.select(this).select("rect").style("fill", d.colorOut);})
                
                btMove.append("rect")
                        .attr("class", "moveButton")
                        .classed("interfaceButton", 1)
                        .attr("width", 120)
                        .attr("height", 20)
                        .style("fill", contxt.defaultFillColor)        
                        .style("stroke-width", contxt.defaultBorderWidth)
                        .style("stroke", contxt.defaultBorderColor)
                        //.on("mouseover", function(){d3.select(this).style("fill",contxt.highlightFillColor);})
                        //.on("mouseout", function(){d3.select(this).style("fill",contxt.defaultFillColor);})

                btMove.append("text")
                        .attr("class", "moveButton")
                        .classed("interfaceButton", 1)
                        .attr("dx", 5)
                        .attr("dy", 15)
                        .text(function(d){return d.text})
                        .style("font-family", contxt.defaultTextFont)
                        .style("fill", contxt.defaultTextColor)
                        .style("font-size", contxt.defaultTextSize)


                var btSelect = svg.selectAll("rect.selectButton").data([{text:"select", colorOver:contxt.highlightFillColor, colorOut:contxt.defaultFillColor}]).enter().append('g')
                        .attr("class", "selectButton")
                        .classed("interfaceButton", 1)
                        .attr("transform", function(d) { return "translate(" + 10 + "," + (10+25*(positionNumber+1)) + ")"; })
                        .on("click", function(d){
                                d3.select(this).select("rect").style("fill","yellow"); 
                                objectContext.TulipPosyInterfaceObject.toggleSelectMove(target);   
                        })
                        .on("mouseover", function(d){
                                contxt.mouse_over_button = true;
                                if(!eval("TP.Context().select_mode_"+target)){
                                        d.colorOver = contxt.highlightFillColor; 
                                        d.colorOut = contxt.defaultFillColor;
                                }else{
                                        d.colorOver = contxt.defaultFillColor; 
                                        d.colorOut = contxt.highlightFillColor;
                                }
                                d3.select(this).select("rect").style("fill",d.colorOver);})
                        .on("mouseout", function(d){
                                contxt.mouse_over_button = false;
                                if(!eval("TP.Context().select_mode_"+target)){
                                        d.colorOver = contxt.highlightFillColor; 
                                        d.colorOut = contxt.defaultFillColor;
                                }else{
                                        d.colorOver = contxt.defaultFillColor; 
                                        d.colorOut = contxt.highlightFillColor;
                                }
                                d3.select(this).select("rect").style("fill",d.colorOut);})
                
                btSelect.append("rect")
                        .attr("class", "selectButton")
                        .classed("interfaceButton", 1)
                        .attr("width", 120)
                        .attr("height", 20)
                        .style("fill", contxt.highlightFillColor)        
                        .style("stroke-width", contxt.defaultBorderWidth)
                        .style("stroke", contxt.defaultBorderColor)
                        //.on("mouseover", function(d){d3.select(this).style("fill",d.colorOver);})
                        //.on("mouseout", function(d){d3.select(this).style("fill",d.colorOut);})

                btSelect.append("text")
                        .attr("class", "selectButton")
                        .classed("interfaceButton", 1)
                        .attr("dx", 5)
                        .attr("dy", 15)
                        .text(function(d){return d.text})
                        .style("fill", contxt.defaultTextColor)
                        .style("font-family", contxt.defaultTextFont)
                        .style("font-size", contxt.defaultTextSize)
        }



        this.addInfoButton = function(target)
        {
            var cGraph = null
            var svg = null

            svg = contxt.getViewSVG(target);
            cGraph = contxt.getViewGraph(target);
           
            posInfo_x = contxt.width-30
            posInfo_y = contxt.height-5

            //var width
            var btInfo = svg.selectAll("g.info").data(["`"]).enter().append('g')
                .attr("class", "info")
                .classed("interfaceButton", 1)
                .attr("transform", function(){return "translate("+posInfo_x+","+posInfo_y+")";})
                

            btInfo.append("text")
                .text(function(d){return "`"})
            	.style("fill", "lightgray")
                .style("font-family", "EntypoRegular")
                .style("font-size", 50)
                .on("mouseover", function(){d3.select(this).style("fill", "black")})
                .on("mouseout", function(){d3.select(this).style("fill", "lightgray"); svg.selectAll(".infoWindow").data([]).exit().remove();})
                
        
            btInfo.on("click", function(){
                sGroup = svg.selectAll("infoWindow").data(['WX']).enter().append("g")
                    .attr("class","infoWindow")
                    .attr("transform", function(){return "translate("+ (posInfo_x-120)+","+(posInfo_y-40)+")";})

                sRect = sGroup.append("rect")
                    .attr("class","infoWindow")
                    .attr("width", 120)
                    .attr("height", 35)
                    .style("fill", contxt.defaultFillColor)        
                    .style("stroke-width", contxt.defaultBorderWidth)
                    .style("stroke", contxt.defaultBorderColor)
                
                sGroup.append("text")
                    .attr("class","infoWindow")
                    .attr("dx", 5)
                    .attr("dy", 15)
                    .text(function(){return ""+cGraph.nodes().length+" nodes"})
                    .style("font-family", contxt.defaultTextFont)
                    .style("fill", contxt.defaultTextColor)
                    .style("font-size", contxt.defaultTextSize)

                sGroup.append("text")
                    .attr("class","infoWindow")
                    .attr("dx", 5)
                    .attr("dy", 28)
                    .text(function(){return ""+cGraph.links().length+" links"})
                    .style("font-family", contxt.defaultTextFont)
                    .style("fill", contxt.defaultTextColor)
                    .style("font-size", contxt.defaultTextSize)

            })     
        }


        this.selectWeightProperty = function(group)
        {
            /*
            <select>
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select> 
            */
             group.append("foreignObject")
                .attr("x", 10)
                .attr("y", 20)
                .attr("width", 200)
                .attr("height", 200)
                .append("xhtml:body")
                .html(function(d)
                {
                    selectHTMLString = "<form><select id=weightPropSel>"
                    selectHTMLString += " <option value=\"\"><i>--</i></option>"

                    nbElements = Object.keys(contxt.substrateProperties).length
                    Object.keys(contxt.substrateProperties).forEach(function(k, i)
                    {
                        console.log("props: ",k)
                        if(contxt.substrateProperties[k] == "number")
                        {
                            selectHTMLString += " <option value=\""+k+"\">"+k+"</option>"
                        }
                    });

                    
                    selectHTMLString += "</select></form>"

                    return selectHTMLString
                })
                /*.on("change", function(d, i)
                    {
                        console.log("value has changed: ", d3.select(this));
                    })*/
                /*group.append("foreignObject")
                                .attr("x", 10)
                                .attr("y", 10*nbElements+1)
                                .attr("width", 200)
                                .attr("height", 200)
                                .append("xhtml:body")
                                .html("<form><input type=radio name=weight value=null /></form>")
                                .on("click", function(d){
                                    contxt.substrateWeightProperty=null
                                });*/

        }

        this.holdSVGInteraction = function(target)
        {
        	console.log("holding SVG interaction");
            objectContext.TulipPosyInteractionObject.removeZoom(target);
            objectContext.TulipPosyInteractionObject.removeLasso(target);
        }


       // This function toggles the 'select' and 'move' modes for the interactors
        // target, the string value of the target svg view
        this.toggleSelectMove = function(target)
        {
				console.log("calling toggle!")
                if (!target)
                        return

                var svg = null
                svg = contxt.getViewSVG(target);

                eval("TP.Context().select_mode_"+target+" = ! TP.Context().select_mode_"+target);
                eval("TP.Context().move_mode_"+target+" = ! TP.Context().move_mode_"+target);

                if(eval("TP.Context().select_mode_"+target))
                {
                        svg.select('rect.moveButton').style('fill', TP.Context().defaultFillColor);
                        svg.select('rect.selectButton').style('fill', TP.Context().highlightFillColor);
                        objectContext.TulipPosyInteractionObject.addLasso(target);
                        objectContext.TulipPosyInteractionObject.removeZoom(target);
                }

                if(eval("TP.Context().move_mode_"+target))
                {
                        //svg.style("cursor", "all-scroll");
                        svg.select('rect.moveButton').style('fill', TP.Context().highlightFillColor);
                        svg.select('rect.selectButton').style('fill', TP.Context().defaultFillColor);                        
                        objectContext.TulipPosyInteractionObject.removeLasso(target);
                        objectContext.TulipPosyInteractionObject.addZoom(target);
                }
        }


       this.addSettingsButton = function()
        {
        	console.log("adding settings button")
            objectContext.TulipPosyInterfaceObject.holdSVGInteraction("substrate")

            svg = contxt.svg_substrate
            posSettings_x = contxt.width-30
            posSettings_y = 30

            //var width
            var btSettings = svg.selectAll("g.settings").data(["@"]).enter().append('g')
                .attr("class", "settings")
                .classed("interfaceButton", 1)
                .attr("transform", function(){return "translate("+posSettings_x+","+posSettings_y+")";})
                

            btSettings.append("text")
                .text(function(d){return "@"})
            	.style("fill", "lightgray")
                .style("font-family", "EntypoRegular")
                .style("font-size", 50)
                .on("mouseover", function(){d3.select(this).style("fill", "black")})
                .on("mouseout", function(){d3.select(this).style("fill", "lightgray")})
        
            btSettings.on("click", function(){
                sGroup = svg.selectAll("settingsWindow").data(['WX']).enter().append("g")
                    .attr("class","settingsWindow")
                    .attr("transform", function(){return "translate("+ (posSettings_x-120)+","+posSettings_y+")";})

                sRect = sGroup.append("rect")
                    .attr("class","settingsWindow")
                    .attr("width", 120)
                    .attr("height", 120)
                    .style("fill", contxt.defaultFillColor)        
                    .style("stroke-width", contxt.defaultBorderWidth)
                    .style("stroke", contxt.defaultBorderColor)
                
                sGroup.append("text")
                    .attr("class","settingsWindow")
                    .attr("dx", 5)
                    .attr("dy", 15)
                    .text(function(){return "Weight property"})
                    .style("font-family", contxt.defaultTextFont)
                    .style("fill", contxt.defaultTextColor)
                    .style("font-size", contxt.defaultTextSize)

                objectContext.TulipPosyInterfaceObject.selectWeightProperty(sGroup);

                sGroup.append("text")
                    .attr("class","settingsWindow")
                    .attr("dx", 50)
                    .attr("dy", 115)
                    .text(function(){return "WX"})
                    .style("font-family", "EntypoRegular")
                    .style("fill", "lightgray")
                    .style("font-size", 30)
                    .on("click", function(){contxt.substrateWeightProperty = svg.select("#weightPropSel").node().value;svg.selectAll(".settingsWindow").data([]).exit().remove();})
                    .on("mouseover", function(){d3.select(this).style("fill", "black")})
                    .on("mouseout", function(){d3.select(this).style("fill", "lightgray")})


            })     
        }


        // Adds a button to a specific interface with its callback
        // target, the string of the svg interface to draw the button in
        // positionNumber, the position at which we want to place the button
        // buttonLabel, the label of the button
        // className, the name of the class assigned to the button
        // callback, the callback function associated to the button click        
        this.addButton = function(target, positionNumber, buttonLabel, className, callback)
        {
                var cGraph = null
                var svg = null

                svg = contxt.getViewSVG(target);
                cGraph = contxt.getViewGraph(target);

                var bt = svg.selectAll("rect."+className).data([buttonLabel]).enter().append('g')
                        .attr("class", className)
                        .classed("interfaceButton", 1)
                        .attr("transform", function(d) { return "translate(" + 10 + "," + (10+25*positionNumber) + ")"; })
                        .on("click", function(){d3.select(this).select("rect").style("fill","yellow"); callback();})
                        .on("mouseover", function(){d3.select(this).select("rect").style("fill",contxt.highlightFillColor); contxt.mouse_over_button = true;})
                        .on("mouseout", function(){d3.select(this).select("rect").style("fill",contxt.defaultFillColor); contxt.mouse_over_button = false;})

                bt.append("rect")
                        .attr("class", className)
                         .classed("interfaceButton", 1)
                        .attr("width", 120)
                        .attr("height", 20)
                        .style("fill", contxt.defaultFillColor)
                        .style("stroke-width", contxt.defaultBorderWidth)
                        .style("stroke", contxt.defaultBorderColor)
                        

                bt.append("text")
                        .attr("class", className)
                         .classed("interfaceButton", 1)
                        .attr("dx", 5)
                        .attr("dy", 15)
                        .text(function(d){return d})
                        .style("fill", contxt.defaultTextColor)
                        .style("font-family", contxt.defaultTextFont)
                        .style("font-size", contxt.defaultTextSize)
        }




        this.attachInfoBox = function(target)
        {
                var cGraph = null
                var svg = null

                svg = contxt.getViewSVG(target);
                cGraph = contxt.getViewGraph(target);
                
                eval("contxt.node_information_"+target+" = !contxt.node_information_"+target);

                if (!eval("contxt.node_information_"+target))
                {
                    svg.selectAll("g.infoBox").on("mouseout", function(){d3.select(this).select("rect.infoBox").style("fill",contxt.defaultFillColor); contxt.mouse_over_button = false;});
                    svg.selectAll("g.node").on("mouseover", null);
                    return
                }

                svg.selectAll("g.infoBox").on("mouseout", function(){d3.select(this).select("rect.infoBox").style("fill",contxt.highlightFillColor); contxt.mouse_over_button = false;});
                svg.selectAll("g.node").on("mouseover", function(d){objectContext.TulipPosyInterfaceObject.addInfoBox(target, d)});
        
        }


        this.addInfoBox = function(target, node)
        {
                var cGraph = null
                var svg = null

                svg = contxt.getViewSVG(target);
                cGraph = contxt.getViewGraph(target);

                             
                function move(){
                    //var e = window.event;
                    //if (e.ctrlKey || e.metaKey) return;
                    objectContext.TulipPosyInterfaceObject.parentNode.appendChild(this);
                    var dragTarget = d3.select(this);
                    var currentPanel = dragTarget.data()[0]
                    var posX = d3.event.dx
                    var posY = d3.event.dy

                    var newX = 0
                    var newY = 0

                    if (currentPanel.panelPosX || currentPanel.panelPosY)
                    {
                        newX = currentPanel.panelPosX + posX
                        newY = currentPanel.panelPosY + posY
                    }else{
                        newX = currentPanel.x + posX
                        newY = currentPanel.y + posY                        
                    }

                    dragTarget.attr("transform", function(d){d.panelPosX = newX; d.panelPosY = newY; return "translate(" + newX + "," + newY + ")"});            
                };


                
                nbInfoBox = svg.selectAll("g.nodeInfo")[0].length
                console.log("the current node", node);//, selection, selection.length)
                
                ib = svg.selectAll("g.nodeInfo"+node.baseID).data([node]).enter().append("g")
                        .attr("class", function(d){return "nodeInfo"+d.baseID})
                        .attr("transform", function(d){ return "translate(" + d.currentX + "," + d.currentY + ")";})
                        .call(d3.behavior.drag().on("drag", objectContext.TulipPosyInterfaceObject.move))
                        
            
                ib.append("rect")
                    .classed("nodeInfo", true)
                    .attr("width", 200)
                    .attr("height", 200)
                    //.attr("x", function (d){return d.x;})
                    //.attr("y", function (d){return d.y;})
                    .style("fill", contxt.defaultFillColor)
                    .style("stroke-width", contxt.defaultBorderWidth)
                    .style("stroke", contxt.defaultBorderColor)

                ib.append("text")
                    .classed("nodeInfo", true)
                    .text("node information")
                    .attr("dx", 5)
                    .attr("dy", 15)
                    .style("fill", contxt.defaultTextColor)
                    .style("font-family", contxt.defaultTextFont)
                    .style("font-size", contxt.defaultTextSize)

                ib.append("text")
                    .classed("nodeInfo", true)
                    .text(function(d){return ("ID "+d.baseID)})
                    .attr("dx", 5)
                    .attr("dy", 30)
                    .style("fill", contxt.defaultTextColor)
                    .style("font-family", contxt.defaultTextFont)
                    .style("font-size", contxt.defaultTextSize)

                ib.append("text")
                    .classed("nodeInfo", true)
                    .text(function(d){return d.label})
                    .attr("dx", 5)
                    .attr("dy", 42)
                    .style("fill", contxt.defaultTextColor)
                    .style("font-family", contxt.defaultTextFont)
                    .style("font-size", contxt.defaultTextSize)

                ib.append("text")
                    .classed("nodeInfo", true)
                    .text("X")
                    .attr("dx", 186)
                    .attr("dy", 18)
                    .style("fill", "lightgray")
                    .style("font-family", "EntypoRegular")
                    .style("font-size", 30)
                    .on("click", function(d) {svg.selectAll("g.nodeInfo"+node.baseID).data([]).exit().remove();})
                    .on("mouseover", function(){d3.select(this).style("fill", "black")})
                    .on("mouseout", function(){d3.select(this).style("fill", "lightgray")})


                //request catalysts
                //editable label
                console.log("node info appended", ib)
        }


        this.setCombinedForeground = function(target)
        {
            contxt.combined_foreground = target;
            var toggleBtnText = ""
            if(target == "substrate")
            {
                toggleBtnText = "catalyst";
            }else if(target == "catalyst")
            {
                toggleBtnText = "substrate";
            }


            console.log ("toggling: ",contxt.combined_foreground);

            contxt.svg_combined.selectAll("g.toggleCombinedForeground")
                .select("text")
                .text("g "+toggleBtnText)

            contxt.svg_combined.selectAll("g.node").data(contxt.graph_combined.nodes(), function(d){return d.baseID})
                .style("opacity", function(d){if(d._type == contxt.combined_foreground){return 1;}else{return 0.5;}})

        }

        this.toggleCombinedForeground = function()
        {
            if(contxt.combined_foreground == "substrate")
            {
                __g__.setCombinedForeground("catalyst");
            }else if(contxt.combined_foreground == "catalyst")
            {
                __g__.setCombinedForeground("substrate");
            }
        
        }



    return __g__;

}
return {TulipPosyInterface:TulipPosyInterface};
})()
