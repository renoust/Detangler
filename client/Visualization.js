/************************************************************************
 * This module manipulates the svg representation of the graphs
 * (e.g it can rearrange layouts, hide labels ...)
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

var TP = TP || {};
(function () {


    var Visualization = function () {
        var __g__ = this;
        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();


        this.showhideLinks = function (_event) {

            var target = _event.associatedData.source;

            if (!target)return

            var svg = null
            svg = TP.Context().view[target].getSvg();

            TP.Context().view[target].setShowLinks(!TP.Context().view[target].getShowLinks());

            if (TP.Context().view[target].getShowLinks()) {
                svg.selectAll('g.link').attr("visibility", "visible");
                $('li.form > a').each(function () {
                    if ($(this).text() === 'Show links') {
                        $(this).text('Hide links')
                    }
                })
            } else {
                $('li.form > a').each(function () {
                    if ($(this).text() === 'Hide links') {
                        $(this).text('Show links')
                    }
                })
                svg.selectAll('g.link').attr("visibility", "hidden");
            }
        }

        // This function updates the entanglement values displayed in the 
        //entanglement frame of the substrate view
        // The entanglement intensity drives the color of the frame 
        //following a Brewer's scale (www.colorbrewer2.org).
        this.entanglementCaught = function (CurrentViewID, nothing) {
            var brewerSeq = ['#FEEDDE', '#FDD0A2', '#FDAE6B', '#FD8D3C', '#E6550D', '#A63603']
            var target_source = CurrentViewID;

            if (nothing == null) {

                $('#homogeneity')[0].innerHTML = objectReferences.ToolObject.round(TP.Context().entanglement_homogeneity, 5);
                $('#intensity')[0].innerHTML = objectReferences.ToolObject.round(TP.Context().entanglement_intensity, 5);

                var index = Math.round(TP.Context().entanglement_intensity * 5) % 6
                $('#bg')[0].style.cssText = "background-color:" + brewerSeq[index];
            }
            else {

                $('#homogeneity')[0].innerHTML = objectReferences.ToolObject.round("0", 5);
                $('#intensity')[0].innerHTML = objectReferences.ToolObject.round("0", 5);

                $('#bg')[0].style.cssText = "background-color:white";

            }
            /*TP.Context().svg_substrate.selectAll("rect.entanglementframe")

             .transition()
             .style('fill-opacity', .5)
             .style("fill", brewerSeq[index])*/
            d3.selectAll("rect.view").style("fill", brewerSeq[index])
            d3.selectAll("rect.brush").style("fill", brewerSeq[index])
            //d3.selectAll("polygon.brush").style("fill", brewerSeq[index])

            if (TP.Context().view[target_source].getLasso())
                TP.Context().view[target_source].getLasso().fillColor = brewerSeq[index]
        }
        /*
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

         //assert(true, "toto = titi")

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
         gD = TP.Context().view[target].getGraphDrawing().draw()
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
         */


        this.resetView = function (_event) {

            var target = _event.associatedData.source;

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

            TP.Context().view[target].getGraphDrawing().rescaleGraph(cGraph);

            TP.Context().view[target].getGraphDrawing().changeLayout(cGraph, 0);


            objectReferences.VisualizationObject.entanglementCaught(target);
        }


        this.resetSize = function (_event) {

            var target = _event.associatedData.source;

            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            cGraph.nodes().forEach(function (d) {
                d.viewMetric = 3;
            })

            TP.Context().view[target].getGraphDrawing().resize(cGraph, 0)
        }


        this.rotateGraph = function (_event) {

            var target = _event.associatedData.source;

            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            TP.Context().view[target].getGraphDrawing().rotate(target, 5)
        }

        this.arrangeLabels = function (_event) {

            var target = _event.associatedData.source;

            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();
            TP.Context().view[target].getGraphDrawing().arrangeLabels();
        }

        this.bringLabelsForward = function (target) {
            if (!target)
                return

            var svg = null
            var cGraph = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            TP.Context().view[target].getGraphDrawing().bringLabelsForward();
        }


        this.showhideLabels = function (_event) {

            var target = _event.associatedData.source;

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
                $('li.form > a').each(function () {
                    if ($(this).text() === 'Show labels') {
                        $(this).text('Hide labels')
                    }
                })
            } else {
                svg.selectAll('text.node').attr("visibility", function (d) {

                    d.labelVisibility = false;
                    return "hidden";

                });
                $('li.form > a').each(function () {
                    if ($(this).text() === 'Hide labels') {
                        $(this).text('Show labels')
                    }
                })
            }
        }


        // This function rescales the graph data in order to fit the svg window
        // data, the graph data (modified during the function)
        this.rescaleGraph = function (data) {

            // these should be set as globale variables
            var buttonWidth = 0//130.0
            var frame = 10.0
            var w = TP.Context().width - (buttonWidth + 2 * frame)
            var h = TP.Context().height - (2 * frame)
            if (data.nodes.length <= 0) return

            var minX = data.nodes[0].x
            var maxX = data.nodes[0].x
            var minY = data.nodes[0].y
            var maxY = data.nodes[0].y


            data.nodes.forEach(function (d) {
                if (d.x < minX) {
                    minX = d.x
                }
                ;
                if (d.x > maxX) {
                    maxX = d.x
                }
                ;
                if (d.y < minY) {
                    minY = d.y
                }
                ;
                if (d.y > maxY) {
                    maxY = d.y
                }
                ;
            })


            var delta = 0.00000000000000000001 //to avoid division by 0
            scale = Math.min.apply(null, [w / (maxX - minX + delta), h / (maxY - minY + delta)])

            data.nodes.forEach(function (d) {
                d.x = (d.x - minX) * scale + buttonWidth + frame;
                d.y = (d.y - minY) * scale + frame;
                d.currentX = d.x;
                d.currentY = d.y;
            })
        }


        this.sizeMapping = function (_event) {

            var parameter = _event.associatedData.parameter;
            var idView = _event.associatedData.idView;
            var scales = _event.associatedData.scales;

            var cGraph = null;
            var svg = null;
            var scaleMin = null;
            var scaleMax = null
            if (scales != null) {
                scaleMin = scales.sizemap.val1;
                scaleMax = scales.sizemap.val2;
            }


            svg = TP.Context().view[idView].getSvg();
            cGraph = TP.Context().view[idView].getGraph();

            TP.Context().view[idView].getGraphDrawing().nodeSizeMap(cGraph, 0, {metric: parameter, scaleMin: scaleMin, scaleMax: scaleMax });
            objectReferences.VisualizationObject.entanglementCaught(idView);

        };


        this.colorMapping = function (parameter, graphName) {

            var cGraph = null;
            var svg = null;

            svg = TP.Context().view[graphName].getSvg();
            cGraph = TP.Context().view[graphName].getGraph();

            TP.Context().view[graphName].getGraphDrawing().nodeColorMap(cGraph, 0, parameter);

            //if(TP.Context().view[graphName].getAssociatedView("catalyst") != null)
            //objectReferences.VisualizationObject.entanglementCaught(target, TP.Context().view[graphName].getAssociatedView("catalyst")[0].getID());
            objectReferences.VisualizationObject.entanglementCaught(graphName);
        };


        this.drawDataBase = function (_event) {
            var target = _event.associatedData.source;
            
            var svg = TP.Context().view[target].getSvg();
            var nodes = svg.selectAll('g.node').data();

            var id = "" + TP.Context().getIndiceView();
            
            //TP.Context().view[id] = new TP.View(id, null,
                 //"DataBase" + TP.view[target].getName(), null, null, null, null, null, "DataBase", target);
            TP.Context().view[id] = new TP.ViewData({id:id, name:"DataBase" + TP.view[target].getName(), type:"data", idSourceAssociatedView:target});
            TP.Context().view[id].addView();

            var sort_asc = true;
            drawTable('#zone'+id, nodes);
            var table;

            function drawTable(zone, nodes){
                table = $('<table/>', {id: 'table' + id, class:'dataTable'}).appendTo('#zone' + id);
                var thead = $('<thead/>').appendTo(table);
                var tbody = $('<tbody/>').appendTo(table);
                var head = $('<tr/>').appendTo(thead);
                var fields = getFields(nodes);

                for (var f in fields){
                    var th = $('<th/>').appendTo(head);
                    
                    th.html(fields[f]);
                    th.click(function(){
                        nodes.sort(sortByColumn(this.innerHTML,sort_asc));
                        sort_asc = !sort_asc;
                        table.remove();
                        drawTable(zone, nodes);
                    });
                }

                for (var n in nodes){
                    var tr = $('<tr/>',{id: "TR"+n}).appendTo(tbody);
                    for (var f in fields){
                        var td = $("<td/>").appendTo(tr);
                        td.html(nodes[n][fields[f]]);
                        td.click(function(a,b){
                            return function () {
                                if (table[0].rows[0].cells[b].innerHTML!=='baseID'){
                                    toggleInput($(this));
                                }
                            }
                        }(n,f));
                    }
                }
            }

            function getFields(nodes){
                var fields = [];
                for(var n in nodes){
                    for (var f in nodes[n]) {

                        if (fields.indexOf(f) === -1) {  //a key is unique
                            fields.push(f);
                        }
                    }
                }
                return fields;
            }

            function toggleInput(cell){
                if(cell.hasClass('editData')) {
                    return;
                }else{
                    var width = cell.innerWidth();
                    var height = cell.innerHeight();
                    var text = cell.text();
                  
                    cell.css('height',height);
                    cell.width(width);
                    cell.text("");

                    var input = $("<input/>").appendTo(cell);
                    $(input).height(height-5);
                    $(input).width($(cell).width()-4);
                    input.attr("value",text);

                    input.focus();
                    input.blur(function(){
                        updateData($(this));
                    });
                    input.keyup(function (e) {
                        if (e.keyCode === 13) { //enter key
                            updateData($(this));
                        }
                    });
                    cell.addClass('editData');
                }
            }

            function updateData(input){
                var cell = input.parent();
                var col = cell.index();
                var hcol = table[0].rows[0].cells[col].innerHTML;
                var row = cell.parent().index('tr');

                cell.text(input.val());
                cell.removeClass('editData');
                input.remove();

                var bID = eval(table[0].rows[row].cells[0].innerHTML);
                for (var n in nodes){
                    if (nodes[n].baseID===bID){
                        nodes[n][hcol] = cell.text();
                    }
                }
            }

            function sortByColumn(field, reverse){
                var key = function (x) {return x[field]};
                return function (a,b) {
                    var A = key(a), B = key(b);
                    return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];                  
                };
            }
        }




        this.changeColor = function () {
            var IDView = TP.Context().activeView;
            var view = TP.Context().view[IDView];
            var cGraph = view.getGraph();
            var f = $.farbtastic('#picker');

            if ($('#cnodes').hasClass('colorwell') && $('#cnodes').hasClass('selected')) {
                view.setNodesColor(f.color);
                view.getGraphDrawing().changeColor(IDView, cGraph, "node", view.getNodesColor());
            } else if ($('#clinks').hasClass('colorwell') && $('#clinks').hasClass('selected')) {
                view.setLinksColor(f.color);
                view.getGraphDrawing().changeColor(IDView, cGraph, "link", view.getLinksColor());
            } else if ($('#cbg').hasClass('colorwell') && $('#cbg').hasClass('selected')) {
                view.setBgColor(f.color);
                view.getGraphDrawing().changeColor(IDView, cGraph, "bg", view.getBgColor());
            } else if ($('#clabels').hasClass('colorwell') && $('#clabels').hasClass('selected')) {
                view.setLabelsColor(f.color);
                view.getGraphDrawing().changeColor(IDView, cGraph, "label", view.getLabelsColor());
            }
        }

        return __g__;
    }
    TP.Visualization = Visualization;
})(TP);
