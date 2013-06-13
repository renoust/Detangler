/************************************************************************
 * This module manipulates the svg representation of the graphs 
 * (e.g it can rearrange layouts, hide labels ...)
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

(function () {

    import_class("graphDrawing.js", "TP");
    import_class('context.js', 'TP');
    import_class("objectReferences.js", "TP");
    import_class('View.js', 'TP');

    var Visualization = function () {
        var __g__ = this;
        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();


        this.showhideLinks = function (target) {

            if (!target)return

            var svg = null
            svg = TP.Context().view[target].getSvg();

            TP.Context().view[target].setShowLinks(!TP.Context().view[target].getShowLinks());

            if (TP.Context().view[target].getShowLinks()) {
                svg.selectAll('g.link').attr("visibility", "visible");
                $('.ui-accordion-header').each(function(){if($(this).text()==='show links'){$(this).text('hide links')} })
            } else {
                $('.ui-accordion-header').each(function(){if($(this).text()==='hide links'){$(this).text('show links')} })
                svg.selectAll('g.link').attr("visibility", "hidden");
            }
        }

        // This function updates the entanglement values displayed in the 
        //entanglement frame of the substrate view
        // The entanglement intensity drives the color of the frame 
        //following a Brewer's scale (www.colorbrewer2.org).
        this.entanglementCaught = function (CurrentViewID) {
            var brewerSeq = ['#FEEDDE', '#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603']
			var target_source = CurrentViewID;
			
            $('#homogeneity')[0].innerHTML = objectReferences.ToolObject.round(TP.Context().entanglement_homogeneity, 5);
            $('#intensity')[0].innerHTML = objectReferences.ToolObject.round(TP.Context().entanglement_intensity, 5);
 
            
            var index = Math.round(TP.Context().entanglement_intensity * 5) % 6
            $('#bg')[0].style.cssText="background-color:"+ brewerSeq[index]; 
            /*TP.Context().svg_substrate.selectAll("rect.entanglementframe")

                .transition()
                .style('fill-opacity', .5)
                .style("fill", brewerSeq[index])*/
            d3.selectAll("rect.view").style("fill", brewerSeq[index])
            d3.selectAll("rect.brush").style("fill", brewerSeq[index])
            d3.selectAll("polygon.brush").style("fill", brewerSeq[index])
            
            if (TP.Context().view[target_source].getLasso()) 
                TP.Context().view[target_source].getLasso().fillColor = brewerSeq[index]
        }

        this.buildEdgeMatrices = function (target) { //catalyst at bingin of project, whithout generic code
            var matrixData = [];
            nbNodes = TP.Context().view[target].getGraph().nodes().length;
            for (i = 0; i < nbNodes; i++) {
                matrixData[i] = [];
                for (j = 0; j < nbNodes; j++)
                    matrixData[i][j] = [-1, 0.0];
            }

            var catalystToInd = {};
            TP.Context().view[target].getGraph().nodes().forEach(function (d, i) {
                catalystToInd[d.label] = i;         
                matrixData[i][i] = [d.baseID, d.frequency];         
            });
            TP.Context().view[target].getGraph().links().forEach(function (d) {
                var freq = JSON.parse(d.conditionalFrequency);
                i = catalystToInd[freq['order'][0]]
                j = catalystToInd[freq['order'][1]]
                matrixData[i][j] = [d.baseID, freq['values'][0]]
                matrixData[j][i] = [d.baseID, freq['values'][1]]
            });



            var overallSize = 200.0;
            var indSize = overallSize / nbNodes;
            overallSize = indSize * nbNodes + 1;



            function move() {

                assert(true, "toto = titi")

                objectReferences.VisualizationObject.parentNode.appendChild(this);
                var dragTarget = d3.select(this);
                var currentPanel = dragTarget
                panelPos = currentPanel.attr("transform")
                    .replace("translate(", "")
                    .replace(")", "")
                    .split(',');
                var posX = d3.event.dx
                var posY = d3.event.dy
                var newX = parseInt(panelPos[0]) + posX
                var newY = parseInt(panelPos[1]) + posY

                console.log(panelPos);

                dragTarget.attr("transform", function (d) {
                    d.panelPosX = newX;
                    d.panelPosY = newY;
                    return "translate(" + newX + "," + newY + ")"
                });
            };



            var mat = TP.Context().view[target].getSvg().selectAll("g.matrixInfo")
                .data(["matrix"])
                .enter()
                .append("g")
                .classed("matrixInfo", true)
                .attr("transform", function (d) {
                    return "translate(" + 500 + "," + 10 + ")";
                })
                .call(d3.behavior.drag()
                .on("drag", move))

            mat.append("rect")
                .classed("matrixInfo", true)
                .attr("width", overallSize + 20)
                .attr("height", overallSize + 30)
                .style("fill", TP.Context().defaultFillColor)
                .style("stroke-width", TP.Context().defaultBorderWidth)
                .style("stroke", TP.Context().defaultBorderColor)



            mat.append("text")
                .classed("matrixInfo", true)
                .text("X")
                .attr("dx", 208)
                .attr("dy", 18)
                .style("fill", "lightgray")
                .style("font-family", "EntypoRegular")
                .style("font-size", 30)
                .on("click", function (d) {
                    TP.Context().view[target].getSvg().selectAll("g.matrixInfo")
                        .data([])
                        .exit()
                        .remove();
                    gD = TP.GraphDrawing(TP.Context().view[target].getGraph(), TP.Context().view[target].getSvg(), target).draw()
                })
                .on("mouseover", function () {
                    d3.select(this).style("fill", "black")
                })
                .on("mouseout", function () {
                    d3.select(this).style("fill", "lightgray")
                })



            var brewerSeq = ['#FEEDDE', '#FDD0A2', '#FDAE6B', '#FD8D3C','#E6550D', '#A63603'];
            var index = function (x) {
                return Math.round(x * 5) % 6;
            };
            matrixData.forEach(function (d1, i) {
                d1.forEach(function (d2, j) {
                    piece = mat.append("rect")
                    piece.data(d2).enter()

                    piece.attr("class", "matrixUnit")
                        .classed("matrixInfo", true)
                        .attr("x", i * indSize + 10)
                        .attr("y", j * indSize + 18)
                        .attr("width", indSize)
                        .attr("height", indSize)
                        .style("fill", function () {
                            if (d2[0] == -1) {
                                return "lightgray";
                            } else {
                                return brewerSeq[index(d2[1])];
                            }
                        })
                        .style("fill-opacity", 1)
                        .style("stroke", "black")
                        .style("stroke-width", 0)
                        .on("mouseover", function () {
                            if (d2[0] != -1) {
                                d3.select(this).style("stroke-width", 1);
                            };
                            objectReferences.InteractionObject.highlight(d2[0], i, j, target);
                        })
                        .on("mouseout", function () {
                            d3.select(this).style("stroke-width", 0);
                        })

                })
            })
        }



        this.resetView = function (target) {
            var cGraph = null
            var svg = null
			
			
            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();
			/*
            nodeDatum = svg.selectAll("g.node").data()
            // strangely the matrix that should be applied by transform is 
            //squared?! so we adapt the nodes values
            nodeDatum.forEach(function (d) {
                d.currentX = d.x;
                d.currentY = d.y;
            });

            svg.selectAll(".node,.link")
                .attr("transform", "translate(" + 0 + "," + 0 + ") scale(" + 1 + ")")
            svg.selectAll("text.node").style("font-size", function () {
                return 12;
            });*/
            
    		//if(TP.Context().view[target].getAssociatedView("catalyst") != null)      
	            //objectReferences.VisualizationObject.entanglementCaught(target, TP.Context().view[target].getAssociatedView("catalyst")[0].getID());
	         
	       	var graph_drawing = TP.GraphDrawing(cGraph, svg, target);
	        graph_drawing.rescaleGraph(cGraph);
	        	        
	        graph_drawing.changeLayout(cGraph,0);
	        
	            
	       	objectReferences.VisualizationObject.entanglementCaught(target);
        }

        this.resetSize = function (target) {
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            cGraph.nodes().forEach(function (d) {
                d.viewMetric = 3;
            })
            graph_drawing = TP.GraphDrawing(cGraph, svg, target)
            graph_drawing.resize(cGraph, 0)
        }

		this.rotateGraph = function (target) {
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            graph_drawing = TP.GraphDrawing(cGraph, svg, target)
    
            graph_drawing.rotate(target,5)
        }
        
        this.arrangeLabels = function (target) {
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();
            graph_drawing = TP.GraphDrawing(cGraph, svg, target);
            //assert(true, "ArrangeLabels appelé depuis arrangeLabels (wtf)")
            //console.log(target, svg, cGraph);
            graph_drawing.arrangeLabels();
        }

        this.bringLabelsForward = function (target) {
            if (!target)
                return

            var svg = null
            var cGraph = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            var gD = TP.GraphDrawing(cGraph, svg, target);
            gD.bringLabelsForward();
        }



        this.showhideLabels = function (target) {

            if (!target)
                return

            var svg = null
            svg = TP.Context().view[target].getSvg();

            //eval("TP.Context().show_labels_" + target + " = ! TP.Context().show_labels_" + target);
            //TP.Context().tabShowLabels[target] = !TP.Context().tabShowLabels[target]
            TP.Context().view[target].setShowLabels(!TP.Context().view[target].getShowLabels());

            if (TP.Context().view[target].getShowLabels()) {
                svg.selectAll('text.node').attr("visibility", function (d) {
                    return "visible";
                });
                $('.ui-accordion-header').each(function(){if($(this).text()==='show labels'){$(this).text('hide labels')} })                
            } else {
                svg.selectAll('text.node').attr("visibility", function (d) {

                        d.labelVisibility = false;
                        return "hidden";

                });
                $('.ui-accordion-header').each(function(){if($(this).text()==='hide labels'){$(this).text('show labels')} })
            }
        }



        // This function rescales the graph data in order to fit the svg window
        // data, the graph data (modified during the function)
        this.rescaleGraph = function(data)
        {

                //console.log("should be rescaling graphe, here is the data: ", data);

                // these should be set as globale variables
                var buttonWidth = 0//130.0
                var frame = 10.0
                var w = TP.Context().width-(buttonWidth+2*frame)
                var h = TP.Context().height-(2*frame)
                if (data.nodes.length<=0) return
                
                var minX = data.nodes[0].x
                var maxX = data.nodes[0].x
                var minY = data.nodes[0].y
                var maxY = data.nodes[0].y

        
                data.nodes.forEach(function(d){if (d.x < minX){minX = d.x}; if (d.x > maxX){maxX = d.x}; if (d.y < minY){minY = d.y}; if (d.y > maxY){maxY = d.y};})
        
                //data.nodes.forEach(function(d){console.log("Point: ",d.x,' ', d.y)})

                var delta = 0.00000000000000000001 //to avoid division by 0
                scale = Math.min.apply(null, [w/(maxX-minX+delta), h/(maxY-minY+delta)])
        
                data.nodes.forEach(function(d){d.x = (d.x-minX)*scale+buttonWidth+frame; d.y = (d.y-minY)*scale+frame; d.currentX = d.x; d.currentY = d.y;})
        }




        this.sizeMapping = function (parameter, graphName, scales) {
            var cGraph = null;
            var svg = null;
            var scaleMin = null;
            var scaleMax = null
            if (scales!=null){scaleMin=scales.valMin0; scaleMax=scales.valMax0}


            svg = TP.Context().view[graphName].getSvg();
            cGraph = TP.Context().view[graphName].getGraph();

            var graph_drawing = TP.GraphDrawing(cGraph, svg, graphName);
            graph_drawing.nodeSizeMap(cGraph, 0, {metric:parameter, scaleMin:scaleMin ,scaleMax:scaleMax });
            objectReferences.VisualizationObject.entanglementCaught(graphName);

        };


        this.colorMapping = function (parameter, graphName) {

            var cGraph = null;
            var svg = null;

            svg = TP.Context().view[graphName].getSvg();
            cGraph = TP.Context().view[graphName].getGraph();

            var graph_drawing = TP.GraphDrawing(cGraph, svg, graphName);
            graph_drawing.nodeColorMap(cGraph, 0, parameter);

    		//if(TP.Context().view[graphName].getAssociatedView("catalyst") != null)      
	            //objectReferences.VisualizationObject.entanglementCaught(target, TP.Context().view[graphName].getAssociatedView("catalyst")[0].getID());
	            objectReferences.VisualizationObject.entanglementCaught(graphName);
        };


        this.drawBarChart = function(target, smell){
 
            var svg = null
            svg = TP.Context().view[target].getSvg();

            var tabMetric = TP.Context().view[target].getMetric_BC();

            var numberMetric = tabMetric[0];       
            var metric = tabMetric[1];
            var tabSommet = tabMetric[2];
                        
            var tabClick = [];            
            
            
            for (i = 0; i < metric.length; i++)
            {
               tabClick[""+metric[i]+""] = 0;
            }

            //console.log("mettttrrrrrrrriiiiiiicccccc : ");
            //console.log(tabClick);
            
            //console.log("metric[0] : " + tabClick[""+metric[0]+""])
            
            assert(true, "erreur1");
            
            var id = ""+TP.Context().getIndiceView();
            
            console.log("iddddddddddddddddddddddd : "+id)
            
            TP.Context().view[id] = new TP.View(id, TP.view[target].getGroup(), null,
            new Array("svg_BarChart", null, width, height, "svg_BarChart_"+smell+"_"+id), "BarChart_"+smell+"_"+TP.view[target].getName(), null, null, null, null,  "barchart", target);
            
            console.log(TP.Context().view[id]);
            
            TP.Context().view[id].addView();			
			TP.Context().view[id].buildLinks();
			
			assert(true, "erreur2");
			
            var chart;
            
            if(smell == "base"){
                    
                    
                //var chart;
                var width = 400;
                var bar_width = 20;
                var height = bar_width * numberMetric.length;           
    
                var left_width = 200;                   
    
                var chartt = d3.select("#zone"+id).append("svg")
                  .attr('class', 'chart_'+smell+"_"+id)
                  //.attr('width', width+left_width)
                  //.attr('height', height);
                  .attr('width', "100%")
                  .attr('height', "100%")   
                
                chart = d3.select('.chart_'+smell+"_"+id);    
                
                var x, y;
                x = d3.scale.linear()
                   .domain([0, d3.max(numberMetric)])
                   .range([0, width]);      
      
      
                y = d3.scale.ordinal()
                   .domain(numberMetric)
                   .rangeBands([0, height]);
                //return;
                
                //console.log(y.rangeBand());
    
                //console.log(tabSommet);
                
                chart.selectAll("rect")
                   .data(tabSommet)
                   .enter().append("rect")
                   .attr("x", left_width)
                   .attr("y", function(d, i) { return i * bar_width; })
                   .attr("width", function(d){ return x(d[0]); })
                   .attr("height", 20)
                   .style("stroke", "white")
                   .style("fill", "steelblue")
                
                
                chart.selectAll("text.score")
                  .data(numberMetric)
                  .enter().append("text")
                  .attr("x", function(d) { return x(d) + left_width;})
                  .attr("y", function(d, i){ return (i * bar_width)+10;})
                  .attr("dx", -5)
                  .attr("dy", ".36em")
                  .attr("text-anchor", "end")
                  .style("fill", "white")
                  .text(String);
    
    
                chart.selectAll("text.name")
                  .data(metric)
                  .enter().append("text")
                  .attr("x", left_width / 2)
                  .attr("y", function(d,i){ return (i * bar_width)+10; } )
                  .attr("dy", ".36em")
                  .attr("text-anchor", "middle")
                  .attr('class', 'name')
                  .text(String);
              }
              
              if(smell == "rotate" )
              {
                
                var margin = {top: 30, right: 10, bottom: 200, left: 130};
                
                var height = 400;
                var bar_width = 40;
                var width = bar_width * numberMetric.length;        
    
                //var left_width = 200;
                var chartt = d3.select("#zone"+id).append("svg")
                  .attr('class', 'chart_'+smell+"_"+id)
                  //.attr('width', width+margin.left+margin.right)
                  //.attr('height', height+margin.top+margin.bottom)
                  .attr('width', "100%")
                  .attr('height', "100%")                 
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
                
                var x, y;
                x = d3.scale.ordinal()
                   .domain(metric)
                   .rangeBands([0, width]);     
      
                y = d3.scale.linear()
                   .domain([0, d3.max(numberMetric)])
                   .range([height, 0]);
                
                var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
                
                var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");    
                
                chart = d3.select('.chart_'+smell+"_"+id).select("g");
                

                
                chart.append("g")
                    .attr("class", "x_axis_BarChart"+smell+"_"+id)
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .style("fill", "none")
                    .style("stroke", "#000")
                    .style("shape-rendering", "crispEdges");
                
                chart.append("g")
                    .attr("class", "y_axis_BarChart"+smell+"_"+id)                    
                    .call(yAxis)
                    .style("fill", "none")
                    .style("stroke", "#000")
                    .style("shape-rendering", "crispEdges");
                    
                chart.selectAll("rect")
                   .data(tabSommet)
                   .enter().append("rect")
                    .attr("x", function(d,i) {return x(d[2]);})
                    .attr("y", function(d) {return y(d[0]);})
                    .attr("width",bar_width)
                    .attr("height", function(d) {return height - y(d[0]);})
                    .style("stroke", "white")
                    .style("fill", "steelblue");
                    
                    
                chart.selectAll("text.score")
                  .data(tabSommet)
                  .enter().append("text")
                  .attr("x", function(d,i) {return (x(d[2]) + (bar_width+1)/2)})
                  .attr("y", function(d){ return y(d[0])+11;})
                  //.attr("dy", ".36em")
                  .attr("text-anchor", "end")
                  .style("fill", "white")
                  .text(function(d){return ""+d[0];});
                  
                var texte = d3.selectAll(".x_axis_BarChart"+smell+"_"+id).selectAll("g.tick")
                              .attr("text-anchor", "middle")
                              .selectAll("text")
                              .style("text-anchor", "end");
                  
                    //texte.attr("dd", function(d) {console.log(this.getBBox());});
                    
                texte.attr("transform", function(d) {return "translate(" + this.getBBox().height * -1 + "," + 0  + ")rotate(-30)";});
                
              }
                        
                chart.selectAll("rect")                     
                    .on('mouseover', function(d,i) {
                            d3.select(this).style('fill','red');
                            //if(click == 0){
                            
                            //console.log(d3.select(this).data()[0]);
                            var value = d3.select(this).data()[0];
                            
                            //console.log(value[1]);
                            
                            var node = svg.selectAll("g.node")
                                .select("g."+TP.Context().view[target].getType())
                                .select("rect")                
                                .data(value[1], function(ddd){ /*console.log(ddd);*/ return ddd.baseID; })
                                .style("fill", "red");
                                //.enter()
                            
                            //console.log(node);            
                        //}
                    })
                   .on('mouseout', function(d,i) {
                    
                            var value = d3.select(this).data()[0];
                            
                            // console.log(value[2]);
                            // console.log("tableau : "+tabClick[""+value[2]]);
                            
                            if(tabClick[""+value[2]] == 0){
                                
                                d3.select(this).style('fill',"#4682b4");
                                
                                
                                var node = svg.selectAll("g.node")
                                    .select("g."+TP.Context().view[target].getType())
                                    .select("rect")                
                                    .data(value[1], function(ddd){ /*console.log(ddd);*/ return ddd.baseID; })
                                    .style("fill", TP.Context().view[target].getNodesColor());   
                                
                            }               
    
                    })
                    .on('click', function(d,i) {
                        //click = 1;
                        var value = d3.select(this).data()[0];
                        
                        //console.log(value[2]);
                        //console.log("tableau1 : "+tabClick[""+value[2]]);
                        
                        if(tabClick[""+value[2]] == 1){
                            tabClick[""+value[2]] = 0;
                        }
                        else {
                            if(tabClick[""+value[2]] == 0){
                                tabClick[""+value[2]] = 1;
                            }       
                        }           
                        //console.log("tableau2 : "+tabClick[""+value[2]]);
                        d3.select(this).style('fill','red');                    
                    });
              
        }
        
        
        this.drawScatterPlot = function(target){
        	
            var svg = null
            svg = TP.Context().view[target].getSvg();

            var margin = {top: 20, right: 15, bottom: 60, left: 60}


			var tabMetric = TP.Context().view[target].getMetric_SP();

            var numberMetric = tabMetric[0];
            var metrics = tabMetric[1];        
            var metric = tabMetric[2];
            var axesNames = tabMetric[3];
            
            
            var width = 960 - margin.left - margin.right;
            var height =500 - margin.top - margin.bottom;
            
            var id = ""+TP.Context().getIndiceView();
            
            TP.Context().view[id] = new TP.View(id, TP.view[target].getGroup(), null,
            new Array("svg_Scatter_Plot", null, width, height, "svg_Scatter_Plott_"+id), "Scatter_Plot_"+TP.view[target].getName(), null, null, null, null, "scatter_plot", target);  
        	TP.Context().view[id].addView();
        	TP.Context().view[id].buildLinks();
        	
        
            var tabClick = [];
            
            for (i = 0; i < metric.length; i++)
            {
               var result = metric[i][3];
               //console.log("metric : " + result);
               tabClick[""+result+""] = 0;
            }
            
            /*
            metric.forEach(function (d, i) {
                console.log("forEach : "+d[1]);
                d[1] = height-d[1];
            });*/
            
            var maxX = d3.max(metrics);
            var maxY = d3.max(numberMetric);
            var minX = 0;// d3.min(metrics);
            var minY = 0;//d3.min(numberMetric);
            
            var x = d3.scale.linear()
                  .domain([minX, maxX])  // the range of the values to plot
                  .range([ minX, width ]);

            var y = d3.scale.linear()
                  .domain([minY, maxY])
                  .range([ height, minY ]);
            
            
            var scatterP = d3.select("#zone"+id)
            
            var scatter = scatterP.append("svg")
               .attr('class', 'scatterPlot'+id)
               //.attr('width', width + margin.right + margin.left)
               //.attr('height', height + margin.top + margin.bottom)
               .attr('width', "100%")
               .attr('height', "100%")             
               .append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            scatterP.call(d3.behavior.zoom().x(x).y(y).scaleExtent([0, Infinity]).on("zoom", zoomm));
            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');
                
            scatter.append('g')
                  .attr("class", "x_axis_scatterPlot"+id)
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis)
                  .style("fill", "none")
                  .style("stroke", "#000")
                  .style("shape-rendering", "crispEdges")
                .append("text")
                  .attr("class", "label_x_axis_scatterPlot"+id)
                  .attr("x", width)
                  .attr("y", -6)
                  .style("text-anchor", "end")
                  .text(axesNames[0]);
            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');        
            
            
            scatter.append('g')
                  .attr("class", "y_axis_scatterPlot"+id)
                  .call(yAxis)
                  .style("fill", "none")
                  .style("stroke", "#000")
                  .style("shape-rendering", "crispEdges")                 
                .append("text")
                  .attr("class", "label_y_axis_scatterPlot"+id)
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text(axesNames[1])
                
                            
            scatter.selectAll(".dot")
               .data(metric)
               .enter()
               .append("circle")              
               .attr("cx", function(d) { return x(d[0]); })
               .attr("cy", function(d) { return y(d[1]); })
               .attr("r", 3.5)
               .style("stroke", "#000")
               .style("fill", "steelblue")
               .on('mouseover', function(d) {
                    var selection = d3.select(this);
                    selection.style('fill','red');

                      var valeurx = this.cx.animVal.value;

                      
                      var tab = selection.data()[0];

                     // var svgbis = d3.select("scatterPlotsubstrate");
                      
                      var dataTab = [[tab[0], tab[1]]];
                      
                      //console.log(scatterP);
                      
                      
                      scatter.selectAll("text.scatterPlot"+id)
                        .data(dataTab)
                        .enter()
                        .append("text")
                        .classed("scatterPlot"+id, true)
                        .style("fill", "red")                       
                       .text(function(d) {
                             //console.log("titi : "+d[0]);
                             return "x : "+d[0]+", y : "+d[1];
                       })
                       .attr("x", function(d) {
                            //console.log(d[0]);
                            return x(d[0]);
                       })
                       .attr("y", function(d) {
                            //console.log(d[1]);
                            return y(d[1])-5;
                       })
                                    
                        //console.log("mouseover : " + tab[0] );
                        //console.log(valeurx-50);
                        
                        var node = svg.selectAll("g.node")
                            .select("g."+TP.Context().view[target].getType())
                            .select("rect")                
                            .data(tab[2], function(ddd){ /*console.log(ddd);*/ return ddd.baseID; })
                            .style("fill", "red");
                       
                })
               .on('mouseout', function(d) {
                
                    var selection = d3.select(this);
                    var tab = selection.data()[0];
                    
                    //console.log("mouseout : " + tab[0] );
                    
                    var result = tab[3];
                    
                                
                    scatter.selectAll("text.scatterPlot"+id)
                         .data([])
                         .exit()
                         .remove();
                                                
                    if(tabClick[""+result] == 0){   
                                    
                        selection.style('fill',"#4682b4");
                            
                        var node = svg.selectAll("g.node")
                            .select("g."+TP.Context().view[target].getType())
                            .select("rect")                
                            .data(tab[2], function(ddd){ /*console.log(ddd);*/ return ddd.baseID; })
                            .style("fill", TP.Context().view[target].getNodesColor());   
                    
                    }                   
                })
                .on('click', function(d,i) {
                    //click = 1;
                    var tab = d3.select(this).data()[0];

                    var result = tab[3];
                    
                    if(tabClick[""+result] == 1){
                        tabClick[""+result] = 0;                        
                    }
                    else {
                        if(tabClick[""+result] == 0){
                            tabClick[""+result] = 1;
                        }       
                    }   
                                        
                });
                
                function zoomm(){
                    
                    scatter.selectAll(".x_axis_scatterPlot"+id)
                        .call(xAxis);
                        
                    scatter.selectAll(".y_axis_scatterPlot"+id)
                        .call(yAxis);       
                        
                    scatter.selectAll("circle")           
                       .attr("cx", function(d) { return x(d[0]); })
                       .attr("cy", function(d) { return y(d[1]); })
                       .attr("r", 3.5)
                       
                };                              
        
        } 
   
/********************************** ON GOING ***********************************/
        this.changeColor = function(graphName, elem, newcolor){
            var cGraph = null;
            var svg = null;
            svg = TP.Context().view[graphName].getSvg();
            cGraph = TP.Context().view[graphName].getGraph();

            var graph_drawing = TP.GraphDrawing(cGraph, svg, graphName);
            graph_drawing.changeColor(graphName, cGraph, elem, newcolor);

        }
/********************************** ON GOING ***********************************/

        return __g__;
    }
    return {Visualization: Visualization};
})()
