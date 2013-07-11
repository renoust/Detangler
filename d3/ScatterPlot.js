var TP = TP || {};
(function () {








    var ScatterPlot = function () {


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

            var margin = {top: 20, right: 15, bottom: 60, left: 60}


            var tabMetric = TP.Context().view[target].getMetric_SP();

            var numberMetric = tabMetric[0];
            var metrics = tabMetric[1];
            var metric = tabMetric[2];
            var axesNames = tabMetric[3];


            var width = 960 - margin.left - margin.right;
            var height = 500 - margin.top - margin.bottom;

            var id = "" + TP.Context().getIndiceView();

            TP.Context().view[id] = new TP.ViewScatterPlot(id, TP.view[target].getGroup(), null,
                new Array("svg_Scatter_Plot", null, width, height, "svg_Scatter_Plott_" + id), "Scatter_Plot_" + TP.view[target].getName(), "scatter_plot", target);
            TP.Context().view[id].addView();
            TP.Context().view[id].buildLinks();


            var tabClick = [];

            var end = metric.length;

            for (i = 0; i < end; i++) {
                var result = metric[i][3];
                //console.log("metric : " + result);
                tabClick["" + result + ""] = 0;
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


            var scatterP = d3.select("#zone" + id)
            /*
             var scatter = scatterP.append("svg")
             .attr('class', 'scatterPlot'+id)
             //.attr('width', width + margin.right + margin.left)
             //.attr('height', height + margin.top + margin.bottom)
             .attr('width', "100%")
             .attr('height', "100%")   */
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
                });

        }

        return __g__;

    }

    TP.ScatterPlot = ScatterPlot;

})(TP);