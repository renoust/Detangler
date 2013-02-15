var TulipPosyInterface = function(_context)
{
    var __g__ = this;
    var __context = _context;

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
                
                eraseAllInterface(target);

                addButton(target, 0, "force layout", "button2", function(){callLayout("FM^3 (OGDF)", target)});
                addButton(target, 1, "circular layout", "button3", function(){callLayout("Circular", target)});
                addButton(target, 2, "random layout", "button4", function(){callLayout("Random", target)});
                addButton(target, 3, "reset view", "button5", function(){resetView(target)});
                addButton(target, 4, "degree metric", "button6", function(){callFloatAlgorithm("Degree", target)});
                addButton(target, 5, "btw. centrality", "button7", function(){callFloatAlgorithm("Betweenness Centrality", target)});
                addButton(target, 6, "reset size", "button8", function(){resetSize(target)});  
                addButton(target, 7, "hide labels", "showHideLabels", function(){showhideLabels(target)});              
                addButton(target, 8, "hide links", "showHideLinks", function(){showhideLinks(target)});
                addButton(target, 9, "node information", "infoBox", function(){attachInfoBox(target)});
                addButton(target, 10, "operator "+catalyst_sync_operator, "toggleCatalystOp", function(){toggleCatalystSyncOperator()});
                addButton(target, 11, "weight mapping", "button9", function(){sizeMapping("weight", target)});
                addButton(target, 12, "ent. mapping", "button10", function(){sizeMapping("entanglementIndice", target)});
                addButton(target, 13, "ent. color", "button11", function(){colorMapping("entanglementIndice", target)});
                addButton(target, 14, "computeMatrix", "button12", function(){buildEdgeMatrices()});

                addGraphInteractorButtons(target, 15);
        
                addInfoButton(target);

        }

        // This function add all the interface elements for the substrate view
        this.addInterfaceSubstrate = function()
        {
                var target = 'substrate'

                eraseAllInterface(target);

                addButton(target, 0, "induced subgraph", "button1", function(){sendSelection(getSelection(target), target)});
                addButton(target, 1, "force layout", "button2", function(){callLayout("FM^3 (OGDF)", target)});
                addButton(target, 2, "circular layout", "button3", function(){callLayout("Circular", target)});
                addButton(target, 3, "random layout", "button4", function(){callLayout("Random", target)});
                addButton(target, 4, "reset view", "button5", function(){resetView(target)});
                addButton(target, 5, "degree metric", "button6", function(){callFloatAlgorithm("Degree", target)});
                addButton(target, 6, "btw. centrality", "button7", function(){callFloatAlgorithm("Betweenness Centrality", target)});
                addButton(target, 7, "analyse", "button8", function(){analyseGraph()});
                addButton(target, 8, "reset size", "button9", function(){resetSize(target)});
                addButton(target, 9, "hide labels", "showHideLabels", function(){showhideLabels(target)});
                addButton(target, 10, "hide links", "showHideLinks", function(){showhideLinks(target)});
                addButton(target, 11, "node information", "infoBox", function(){attachInfoBox(target)});
                addButton(target, 12, "sync layouts", "button10", function(){syncLayouts()});

                
                addGraphInteractorButtons(target, 13);
                addEntanglementFeedback(target);
                addInfoButton(target);
                addSettingsButton();
        }

        this.eraseAllInterface = function(target)
        {
                var cGraph = null
                var svg = null

                if (target == 'substrate')
                {        
                        cGraph = _context.graph_substrate
                        svg = _context.svg_substrate
                }

                if (target == 'catalyst')
                {        
                        cGraph = _context.graph_catalyst
                        svg = _context.svg_catalyst
                }

                var coh = svg.selectAll(".interfaceButton").data([]).exit().remove()
                

        }

        // This function adds a small frame that displays the entanglement informations while they are updated
        // target, the string of the svg interface to draw the frame in
        this.addEntanglementFeedback = function(target)
        {
                var cGraph = null
                var svg = null

                if (target == 'substrate')
                {        
                        cGraph = _context.graph_substrate
                        svg = _context.svg_substrate
                }

                if (target == 'catalyst')
                {        
                        cGraph = _context.graph_catalyst
                        svg = _context.svg_catalyst
                }

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
                        .style("font-family", defaultTextFont)
                        .style("font-size", defaultTextSize)

                coh.append("text")
                        .attr('class', 'intensitylabel')
                        .classed("interfaceButton", 1)
                        .attr("dx", 10)
                        .attr("dy", 35)
                        .text("intensity:")
                        .style("fill", 'black')
                        .style("font-size", defaultTextSize)
                        .style("font-family", defaultTextFont)

                coh.append("text")
                        .attr('class', 'intensity')
                        .classed("interfaceButton", 1)
                        .attr("dx", 110)
                        .attr("dy", 50)
                        .text(function(d){return ""+entanglement_intensity})
                        .style("fill", 'blue')
                        .style("font-family", defaultTextFont)
                        .style("font-size", defaultTextSize)
                        .style('text-anchor', 'end')

                coh.append("text")
                        .attr('class', 'homogeneitylabel')
                        .classed("interfaceButton", 1)
                        .attr("dx", 10)
                        .attr("dy", 70)
                        .attr("width", 120)
                        .style("font-family", defaultTextFont)
                        .text('homogeneity:')
                        .style("font-size", defaultTextSize)
                        .style("fill", 'black')

                coh.append("text")
                        .attr('class', 'homogeneity')
                        .classed("interfaceButton", 1)
                        .attr("dx", 110)
                        .attr("dy", 85)
                        .text(function(d){return ""+entanglement_homogeneity})
                        .style('text-anchor', 'end')
                        .style("font-family", defaultTextFont)
                        .style("fill", 'blue')
                        .style("font-size", defaultTextSize)

        }



       // This function adds the graph interactor buttons (move and select) to a target interface.
        // target, the string of the svg interface to draw the buttons in
        // positionNumber, the position at which we want to place the buttons
        // One button triggers the other one on or off, and refers to the global mode variable 'move_mode' or 'select_mode'
        this.addGraphInteractorButtons = function(target, positionNumber)
        {
                var cGraph = null
                var svg = null

                if (target == 'substrate')
                {        
                        cGraph = _context.graph_substrate
                        svg = _context.svg_substrate
                }

                if (target == 'catalyst')
                {        
                        cGraph = _context.graph_catalyst
                        svg = _context.svg_catalyst
                }

                var btMove = svg.selectAll("rect.moveButton").data([{text:"move", colorOver:defaultFillColor, colorOut:highlightFillColor}]).enter().append('g')
                        .attr("class", "moveButton")
                        .classed("interfaceButton", 1)
                        .attr("transform", function(d) { return "translate(" + 10 + "," + (10+25*positionNumber) + ")"; })
                        .on("click", function(d){
                                d3.select(this).select("rect").style("fill","yellow"); 
                                toggleSelectMove(target);
                        })
                        .on("mouseover", function(d){
                                mouse_over_button = true;
                                if(!eval("move_mode_"+target)){
                                        d.colorOver = highlightFillColor; 
                                        d.colorOut = defaultFillColor;
                                }else{
                                        d.colorOver = defaultFillColor; 
                                        d.colorOut = highlightFillColor;
                                }
                                d3.select(this).select("rect").style("fill", d.colorOver);})
                        .on("mouseout", function(d){
                                mouse_over_button = false;
                                if(!eval("move_mode_"+target)){
                                        d.colorOver = highlightFillColor; 
                                        d.colorOut = defaultFillColor;
                                }else{
                                        d.colorOver = defaultFillColor; 
                                        d.colorOut = highlightFillColor;
                                }
                                d3.select(this).select("rect").style("fill", d.colorOut);})
                
                btMove.append("rect")
                        .attr("class", "moveButton")
                        .classed("interfaceButton", 1)
                        .attr("width", 120)
                        .attr("height", 20)
                        .style("fill", highlightFillColor)        
                        .style("stroke-width", defaultBorderWidth)
                        .style("stroke", defaultBorderColor)
                        //.on("mouseover", function(){d3.select(this).style("fill",highlightFillColor);})
                        //.on("mouseout", function(){d3.select(this).style("fill",defaultFillColor);})

                btMove.append("text")
                        .attr("class", "moveButton")
                        .classed("interfaceButton", 1)
                        .attr("dx", 5)
                        .attr("dy", 15)
                        .text(function(d){return d.text})
                        .style("font-family", defaultTextFont)
                        .style("fill", defaultTextColor)
                        .style("font-size", defaultTextSize)


                var btSelect = svg.selectAll("rect.selectButton").data([{text:"select", colorOver:highlightFillColor, colorOut:defaultFillColor}]).enter().append('g')
                        .attr("class", "selectButton")
                        .classed("interfaceButton", 1)
                        .attr("transform", function(d) { return "translate(" + 10 + "," + (10+25*(positionNumber+1)) + ")"; })
                        .on("click", function(d){
                                d3.select(this).select("rect").style("fill","yellow"); 
                                toggleSelectMove(target);   
                        })
                        .on("mouseover", function(d){
                                mouse_over_button = true;
                                if(!eval("select_mode_"+target)){
                                        d.colorOver = highlightFillColor; 
                                        d.colorOut = defaultFillColor;
                                }else{
                                        d.colorOver = defaultFillColor; 
                                        d.colorOut = highlightFillColor;
                                }
                                d3.select(this).select("rect").style("fill",d.colorOver);})
                        .on("mouseout", function(d){
                                mouse_over_button = false;
                                if(!eval("select_mode_"+target)){
                                        d.colorOver = highlightFillColor; 
                                        d.colorOut = defaultFillColor;
                                }else{
                                        d.colorOver = defaultFillColor; 
                                        d.colorOut = highlightFillColor;
                                }
                                d3.select(this).select("rect").style("fill",d.colorOut);})
                
                btSelect.append("rect")
                        .attr("class", "selectButton")
                        .classed("interfaceButton", 1)
                        .attr("width", 120)
                        .attr("height", 20)
                        .style("fill", defaultFillColor)        
                        .style("stroke-width", defaultBorderWidth)
                        .style("stroke", defaultBorderColor)
                        //.on("mouseover", function(d){d3.select(this).style("fill",d.colorOver);})
                        //.on("mouseout", function(d){d3.select(this).style("fill",d.colorOut);})

                btSelect.append("text")
                        .attr("class", "selectButton")
                        .classed("interfaceButton", 1)
                        .attr("dx", 5)
                        .attr("dy", 15)
                        .text(function(d){return d.text})
                        .style("fill", defaultTextColor)
                        .style("font-family", defaultTextFont)
                        .style("font-size", defaultTextSize)
        }



        this.addInfoButton = function(target)
        {
            var cGraph = null
            var svg = null

            if (target == 'substrate')
            {        
                    cGraph = _context.graph_substrate
                    svg = _context.svg_substrate
            }

            if (target == 'catalyst')
            {        
                    cGraph = _context.graph_catalyst
                    svg = _context.svg_catalyst
            }

            posInfo_x = width-30
            posInfo_y = height-5

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
                    .style("fill", defaultFillColor)        
                    .style("stroke-width", defaultBorderWidth)
                    .style("stroke", defaultBorderColor)
                
                sGroup.append("text")
                    .attr("class","infoWindow")
                    .attr("dx", 5)
                    .attr("dy", 15)
                    .text(function(){return ""+cGraph.nodes().length+" nodes"})
                    .style("font-family", defaultTextFont)
                    .style("fill", defaultTextColor)
                    .style("font-size", defaultTextSize)

                sGroup.append("text")
                    .attr("class","infoWindow")
                    .attr("dx", 5)
                    .attr("dy", 28)
                    .text(function(){return ""+cGraph.links().length+" links"})
                    .style("font-family", defaultTextFont)
                    .style("fill", defaultTextColor)
                    .style("font-size", defaultTextSize)

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

                    nbElements = Object.keys(substrateProperties).length
                    Object.keys(substrateProperties).forEach(function(k, i)
                    {
                        console.log("props: ",k)
                        if(substrateProperties[k] == "number")
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
                                    substrateWeightProperty=null
                                });*/

        }

        this.holdSVGInteraction = function(target)
        {
            removeZoom(target);
            removeLasso(target);
        }


       // This function toggles the 'select' and 'move' modes for the interactors
        // target, the string value of the target svg view
        this.toggleSelectMove = function(target)
        {

                if (!target)
                        return

                var svg = null

                if (target == "catalyst")
                {
                        svg = _context.svg_catalyst
                        //select_mode = select_mode_catalyst
                        //move_mode = move_mode_catalyst
                }
        
                if (target == "substrate")
                {
                        svg = _context.svg_substrate
                        //select_mode = select_mode_substrate
                        //move_mode = move_mode_substrate
                }

                eval("select_mode_"+target+" = ! select_mode_"+target);
                eval("move_mode_"+target+" = ! move_mode_"+target);

                if(eval("select_mode_"+target))
                {
                        svg.select('rect.moveButton').style('fill', defaultFillColor);
                        svg.select('rect.selectButton').style('fill', highlightFillColor);
                        addLasso(target);
                        removeZoom(target);
                }

                if(eval("move_mode_"+target))
                {
                        svg.style("cursor", "all-scroll");
                        svg.select('rect.moveButton').style('fill', highlightFillColor);
                        svg.select('rect.selectButton').style('fill', defaultFillColor);                        
                        removeLasso(target);
                        addZoom(target);
                }
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

                    nbElements = Object.keys(substrateProperties).length
                    Object.keys(substrateProperties).forEach(function(k, i)
                    {
                        console.log("props: ",k)
                        if(substrateProperties[k] == "number")
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
                                    substrateWeightProperty=null
                                });*/
        }


       this.addSettingsButton = function()
        {
            holdSVGInteraction("substrate")

            svg = _context.svg_substrate
            posSettings_x = width-30
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
                    .style("fill", defaultFillColor)        
                    .style("stroke-width", defaultBorderWidth)
                    .style("stroke", defaultBorderColor)
                
                sGroup.append("text")
                    .attr("class","settingsWindow")
                    .attr("dx", 5)
                    .attr("dy", 15)
                    .text(function(){return "Weight property"})
                    .style("font-family", defaultTextFont)
                    .style("fill", defaultTextColor)
                    .style("font-size", defaultTextSize)

                selectWeightProperty(sGroup);

                sGroup.append("text")
                    .attr("class","settingsWindow")
                    .attr("dx", 50)
                    .attr("dy", 115)
                    .text(function(){return "WX"})
                    .style("font-family", "EntypoRegular")
                    .style("fill", "lightgray")
                    .style("font-size", 30)
                    .on("click", function(){substrateWeightProperty = svg.select("#weightPropSel").node().value;svg.selectAll(".settingsWindow").data([]).exit().remove();})
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

                if (target == 'substrate')
                {        
                        cGraph = _context.graph_substrate
                        svg = _context.svg_substrate
                }

                if (target == 'catalyst')
                {        
                        cGraph = _context.graph_catalyst
                        svg = _context.svg_catalyst
                }

                var bt = svg.selectAll("rect."+className).data([buttonLabel]).enter().append('g')
                        .attr("class", className)
                        .classed("interfaceButton", 1)
                        .attr("transform", function(d) { return "translate(" + 10 + "," + (10+25*positionNumber) + ")"; })
                        .on("click", function(){d3.select(this).select("rect").style("fill","yellow"); callback();})
                        .on("mouseover", function(){d3.select(this).select("rect").style("fill",highlightFillColor); mouse_over_button = true;})
                        .on("mouseout", function(){d3.select(this).select("rect").style("fill",defaultFillColor); mouse_over_button = false;})

                bt.append("rect")
                        .attr("class", className)
                         .classed("interfaceButton", 1)
                        .attr("width", 120)
                        .attr("height", 20)
                        .style("fill", defaultFillColor)
                        .style("stroke-width", defaultBorderWidth)
                        .style("stroke", defaultBorderColor)
                        

                bt.append("text")
                        .attr("class", className)
                         .classed("interfaceButton", 1)
                        .attr("dx", 5)
                        .attr("dy", 15)
                        .text(function(d){return d})
                        .style("fill", defaultTextColor)
                        .style("font-family", defaultTextFont)
                        .style("font-size", defaultTextSize)
        }




        this.attachInfoBox = function(target)
        {
                var cGraph = null
                var svg = null

                if (target == 'substrate')
                {        
                        cGraph = _context.graph_substrate
                        svg = _context.svg_substrate
                }

                if (target == 'catalyst')
                {        
                        cGraph = _context.graph_catalyst
                        svg = _context.svg_catalyst
                }
                
                eval("node_information_"+target+" = !node_information_"+target);

                if (!eval("node_information_"+target))
                {
                    svg.selectAll("g.infoBox").on("mouseout", function(){d3.select(this).select("rect.infoBox").style("fill",defaultFillColor); mouse_over_button = false;});
                    svg.selectAll("g.node").on("mouseover", null);
                    return
                }

                svg.selectAll("g.infoBox").on("mouseout", function(){d3.select(this).select("rect.infoBox").style("fill",highlightFillColor); mouse_over_button = false;});
                svg.selectAll("g.node").on("mouseover", function(d){addInfoBox(target, d)});
        
        }


        this.addInfoBox = function(target, node)
        {
                var cGraph = null
                var svg = null

                if (target == 'substrate')
                {        
                        cGraph = _context.graph_substrate
                        svg = _context.svg_substrate
                }

                if (target == 'catalyst')
                {        
                        cGraph = _context.graph_catalyst
                        svg = _context.svg_catalyst
                }
                             
          function move(){
                    //var e = window.event;
                    //if (e.ctrlKey || e.metaKey) return;
                    this.parentNode.appendChild(this);
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
                        .call(d3.behavior.drag().on("drag", move))
                        
            
                ib.append("rect")
                    .classed("nodeInfo", true)
                    .attr("width", 200)
                    .attr("height", 200)
                    //.attr("x", function (d){return d.x;})
                    //.attr("y", function (d){return d.y;})
                    .style("fill", defaultFillColor)
                    .style("stroke-width", defaultBorderWidth)
                    .style("stroke", defaultBorderColor)

                ib.append("text")
                    .classed("nodeInfo", true)
                    .text("node information")
                    .attr("dx", 5)
                    .attr("dy", 15)
                    .style("fill", defaultTextColor)
                    .style("font-family", defaultTextFont)
                    .style("font-size", defaultTextSize)

                ib.append("text")
                    .classed("nodeInfo", true)
                    .text(function(d){return ("ID "+d.baseID)})
                    .attr("dx", 5)
                    .attr("dy", 30)
                    .style("fill", defaultTextColor)
                    .style("font-family", defaultTextFont)
                    .style("font-size", defaultTextSize)

                ib.append("text")
                    .classed("nodeInfo", true)
                    .text(function(d){return d.label})
                    .attr("dx", 5)
                    .attr("dy", 42)
                    .style("fill", defaultTextColor)
                    .style("font-family", defaultTextFont)
                    .style("font-size", defaultTextSize)

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




    return __g__;

}
