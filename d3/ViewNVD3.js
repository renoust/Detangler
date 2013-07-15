//pile de gestion d'Etat

var TP = TP || {};
(function () {


    var ViewNVD3Template = function (id, groupe, bouton, svgs, name, type, idAssociation) {

        var __g__ = new TP.ViewTemplate(id, groupe, svgs, name, type, idAssociation, bouton);

        __g__.addView = function () {

            if (__g__.controller != null)
                __g__.controller.initListener(__g__.ID, "view");

            __g__.buttonTreatment();
            __g__.createDialog();

            
            __g__.svg = d3.select("#zone" + __g__.ID)
                .append("svg")
                .attr('class', 'scatterPlot' + __g__.ID)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("id", __g__.tabDataSvg[4])
                .attr("idView", __g__.ID);
                
        }

        __g__.remove = function () {
            __g__.removeViewTemplate();
        }


        __g__.initStates = function () {

            __g__.controller.setCurrentState(null);

        }


        return __g__;
    }

    TP.ViewNVD3Template = ViewNVD3Template;

    var ViewNVD3 = function () {


        var __g__ = this;


        __g__.mouseoverScatterPlot = function (event) {

            var selection = event.associatedData.obj;
            var targetView = event.associatedData.targetView;
            var scatter = event.associatedData.scatter;
            var svg = event.associatedData.svg;
            var id = event.associatedData.id;
            var x = event.associatedData.x;
            var y = event.associatedData.y;

            selection.style('fill', 'red');

            var valeurx = selection[0][0].cx.animVal.value;

            var tab = selection.data()[0];

            // var svgbis = d3.select("scatterPlotsubstrate");
            var dataTab = [
                [tab[0], tab[1]]
            ];

            //console.log(scatterP);

            scatter.selectAll("text.scatterPlot" + id)
                .data(dataTab)
                .enter()
                .append("text")
                .classed("scatterPlot" + id, true)
                .style("fill", "red")
                .text(function (d) {
                    //console.log("titi : "+d[0]);
                    return "x : " + d[0] + ", y : " + d[1];
                })
                .attr("x", function (d) {
                    //console.log(d[0]);
                    return x(d[0]);
                })
                .attr("y", function (d) {
                    //console.log(d[1]);
                    return y(d[1]) - 5;
                })

            //console.log("mouseover : " + tab[0] );
            //console.log(valeurx-50);

            var node = svg.selectAll("g.node")
                .select("g." + TP.Context().view[targetView].getType())
                .select(TP.Context().view[targetView].getViewNodes())
                .data(tab[2], function (ddd) { /*console.log(ddd);*/
                    return ddd.baseID;
                })
                .style("fill", "red");

        }


        __g__.mouseoutScatterPlot = function (event) {

            var selection = event.associatedData.obj;
            var targetView = event.associatedData.targetView;
            var scatter = event.associatedData.scatter;
            var svg = event.associatedData.svg;
            var id = event.associatedData.id;
            var tabClick = event.associatedData.tabClick;

            var tab = selection.data()[0];

            //console.log("mouseout : " + tab[0] );

            var result = tab[3];


            scatter.selectAll("text.scatterPlot" + id)
                .data([])
                .exit()
                .remove();

            if (tabClick["" + result] == 0) {

                selection.style('fill', "#4682b4");

                var node = svg.selectAll("g.node")
                    .select("g." + TP.Context().view[targetView].getType())
                    .select(TP.Context().view[targetView].getViewNodes())
                    .data(tab[2], function (ddd) { /*console.log(ddd);*/
                        return ddd.baseID;
                    })
                    .style("fill", TP.Context().view[targetView].getNodesColor());

            }
        }


        __g__.mouseclickScatterPlot = function (event) {

            var selection = event.associatedData.obj;
            var tabClick = event.associatedData.tabClick;

            var tab = selection.data()[0];

            var result = tab[3];

            if (tabClick["" + result] == 1) {
                tabClick["" + result] = 0;
            }
            else {
                if (tabClick["" + result] == 0) {
                    tabClick["" + result] = 1;
                }
            }
        }

        __g__.zoomScatterPlot = function (event) {

            var scatter = event.associatedData.scatter;
            var xAxis = event.associatedData.xAxis;
            var yAxis = event.associatedData.yAxis;
            var x = event.associatedData.x;
            var y = event.associatedData.y;
            var id = event.associatedData.id;

            scatter.selectAll(".x_axis_scatterPlot" + id)
                .call(xAxis);

            scatter.selectAll(".y_axis_scatterPlot" + id)
                .call(yAxis);

            scatter.selectAll("circle")
                .attr("cx", function (d) {
                    return x(d[0]);
                })
                .attr("cy", function (d) {
                    return y(d[1]);
                })
                .attr("r", 3.5)
        };

        __g__.drawScatterPlot = function (event) {

            var target = event.associatedData.source;

            var svg = null
            svg = TP.Context().view[target].getSvg();

            __g__.graph = TP.Context().view[target].getGraph()

            var margin = {top: 20, right: 15, bottom: 60, left: 60}

            var width = 960 - margin.left - margin.right;
            var height = 500 - margin.top - margin.bottom;

            var id = "" + TP.Context().getIndiceView();

            TP.Context().view[id] = new TP.ViewNVD3Template(id, TP.view[target].getGroup(), null,
                new Array("svg_NVD3", null, width, height, "svg_NVD3_" + id), "NVD3_" + TP.view[target].getName(), "nvd3", target);
            TP.Context().view[id].addView();
            //TP.Context().view[id].buildLinks();


            
            nv.addGraph(function() {
                  var chart = nv.models.scatterChart()
                                .showDistX(true)
                                .showDistY(true)
                                .color(d3.scale.category10().range());
                
                  chart.xAxis.tickFormat(d3.format('.02f'))
                  chart.yAxis.tickFormat(d3.format('.02f'))
                                  
                  d3.select("#zone" + id + " svg")
                      .datum((function(graph){
                          var values = []
                          graph.nodes().forEach(
                              function(d){
                                  values.push(
                                      {
                                          x:d.x,
                                          y:d.y,
                                          size:d.size
                                      })
                              })
                          return [{key:'nodes', values:values}]
                      })(__g__.graph))
                     .transition().duration(500)
                      .call(chart);
                
                  nv.utils.windowResize(chart.update);
                
                  return chart;
                });
            
            /*
            var scatter = TP.Context().view[id].getSvg()
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

            scatterP.call(d3.behavior.zoom().x(x).y(y).scaleExtent([0, Infinity]).on("zoom", function () {
                TP.Context().view[id].getController().sendMessage("zoomScatterPlot", {id: id, x: x, y: y, scatter: scatterP, xAxis: xAxis, yAxis: yAxis})
            }));
            */
            /*
            scatter.append('g')
                .attr("class", "x_axis_scatterPlot" + id)
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .style("fill", "none")
                .style("stroke", "#000")
                .style("shape-rendering", "crispEdges")
                .append("text")
                .attr("class", "label_x_axis_scatterPlot" + id)
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text(axesNames[0]);


            scatter.append('g')
                .attr("class", "y_axis_scatterPlot" + id)
                .call(yAxis)
                .style("fill", "none")
                .style("stroke", "#000")
                .style("shape-rendering", "crispEdges")
                .append("text")
                .attr("class", "label_y_axis_scatterPlot" + id)
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(axesNames[1])


            scatter.selectAll(".dot")
                .data(metric)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return x(d[0]);
                })
                .attr("cy", function (d) {
                    return y(d[1]);
                })
                .attr("r", 3.5)
                .style("stroke", "#000")
                .style("fill", "steelblue")
                .on('mouseover', function (d) {
                    TP.Context().view[id].getController().sendMessage("mouseoverScatterPlot", {id: id, obj: d3.select(this), targetView: target, scatter: scatter, svg: svg, x: x, y: y})
                })
                .on('mouseout', function (d) {
                    TP.Context().view[id].getController().sendMessage("mouseoutScatterPlot", {id: id, obj: d3.select(this), targetView: target, scatter: scatter, svg: svg, tabClick: tabClick})
                })
                .on('click', function (d, i) {
                    //click = 1;
                    TP.Context().view[id].getController().sendMessage("mouseclickScatterPlot", {obj: d3.select(this), tabClick: tabClick})
                });*/

        }

        return __g__;

    }
    /*
    var ViewNVD3 = function (id, groupe, bouton, svgs, name, nodesC, linksC, bgC, labelC, view_nodes, type, idAssociation) {

        var __g__ = new TP.ViewTemplate(id, groupe, svgs, name, type, idAssociation, bouton);

        __g__.nodesColor = nodesC;
        __g__.linksColor = linksC;
        __g__.bgColor = bgC;
        __g__.labelsColor = labelC;
        __g__.viewNodes = null;
        __g__.lasso = null;


        __g__.metric_BC = null;
        __g__.metric_SP = null;
        __g__.combined_foreground = null;
        __g__.acceptedGraph = [];
        __g__.graph = null;

        __g__.getGraph = function () {
            return __g__.graph;
        }
        
        __g__.setGraph = function (_graph) {
            __g__.graph = _graph;
        }

        __g__.setMetric_BC = function (value) {
            __g__.metric_BC = value;
        }

        __g__.getMetric_BC = function () {
            return __g__.metric_BC;
        }

        __g__.setMetric_SP = function (value) {
            __g__.metric_SP = value;
        }

        __g__.getMetric_SP = function () {
            return __g__.metric_SP;
        }

        __g__.getNodesColor = function () {
            return __g__.nodesColor;
        }

        __g__.setNodesColor = function (value) {
            __g__.nodesColor = value;
        }

        __g__.getLinksColor = function () {
            return __g__.linksColor;
        }

        __g__.setLinksColor = function (value) {
            __g__.linksColor = value;
        }

        __g__.getBgColor = function () {
            return __g__.bgColor;
        }

        __g__.setBgColor = function (value) {
            __g__.bgColor = value;
        }

        __g__.getLabelsColor = function () {
            return __g__.labelsColor;
        }

        __g__.setLabelsColor = function (value) {
            __g__.labelsColor = value;
        }

        __g__.getViewNodes = function () {
            return __g__.viewNodes;
        }



        __g__.addView = function () {

            //controller = new TP.Controller();
            if (__g__.controller != null)
                __g__.controller.initListener(__g__.ID, "view");

            //TP.Context().setStypeEventByDefault(ID);
            __g__.buttonTreatment();

            elem = document.getElementById("bouton" + __g__.ID);
            if (elem) elem.parentNode.removeChild(elem);
            elem = $("div[aria-describedby='zone" + __g__.ID + "']");
            //console.log(elem)
            if (elem != [])elem.remove();



            __g__.createDialog();



            $("<button/>", {id: "toggle" + __g__.ID, text: "Move", style: 'right:15px'}).appendTo(__g__.titlebar);

            var minWidth = __g__.dialog.parents('.ui-dialog').find('.ui-dialog-title').width()
            __g__.dialog.parents('.ui-dialog').find('.ui-button').each(function () {
                minWidth += $(this).width()
            })
            __g__.dialog.dialog({minWidth: minWidth + 25})

            $('#toggle' + __g__.ID).button().click(function (event) {
                var interact = $(this).button("option", "label");
                if (interact == "Move") {
                    $(this).button("option", "label", "Select");
                }
                else {
                    $(this).button("option", "label", "Move");
                }
                //TP.Context().stateStack[ID].executeCurrentState();
                TP.ObjectReferences().InterfaceObject.toggleSelectMove(__g__.ID);
            });


            $('#toggle' + __g__.ID).attr("idView", __g__.ID);

            //$("#toggle"+ID).click(function(event){event.type = tabTypeEvent["toggle"+ID]; $("#principalController").trigger(tabTypeEvent["toggle"+ID], [{type:event.type, viewBase:event.data}, event]);})

            function add() {
                if (__g__.ID != null) {

                    if (view_nodes != null)
                        __g__.viewNodes = view_nodes;
                    else
                        __g__.viewNodes = "rect";

                    __g__.DataTranslation = [0, 0];

                    __g__.selectMode = false;
                    __g__.moveMode = true;
                    __g__.showLabels = true;
                    __g__.showLinks = true;
                    __g__.nodeInformation = true;

                    TP.Interaction().createLasso(__g__.ID);
                    //TP.Interaction().addZoom(ID);
                    TP.Interface().toggleSelectMove(__g__.ID);
                }
            }

            if (__g__.tabDataSvg[0] == "svg") {


                nv.addGraph(function() {
                  var chart = nv.models.scatterChart()
                                .showDistX(true)
                                .showDistY(true)
                                .color(d3.scale.category10().range());
                
                  chart.xAxis.tickFormat(d3.format('.02f'))
                  chart.yAxis.tickFormat(d3.format('.02f'))
                
                  d3.select('#chart svg')
                      .datum(__g__.graph)
                     .transition().duration(500)
                      .call(chart);
                
                  nv.utils.windowResize(chart.update);
                
                  return chart;
                });

            }

            __g__.viewInitialized = 1;

            __g__.graphDrawing = new TP.GraphDrawing(__g__.graph, __g__.svg, __g__.ID);

        }

        __g__.remove = function () {

            __g__.removeViewTemplate();

            __g__.nodesColor = null;
            __g__.linksColor = null;
            __g__.bgColor = null;
            __g__.labelsColor = null;
            __g__.viewNodes = null;
            __g__.lasso = null;
            __g__.DataTranslation = null;

            __g__.selectMode = null;
            __g__.moveMode = null;
            __g__.showLabels = null;
            __g__.showLinks = null;
            __g__.nodeInformation = null;

            __g__.metric_BC = null;
            __g__.metric_SP = null;
            __g__.combined_foreground = null;
            __g__.acceptedGraph = null;
            __g__.graph = null;
        }


        __g__.initStates = function () {

        }

        return __g__;
    }*/

    TP.ViewNVD3 = ViewNVD3;
})(TP);