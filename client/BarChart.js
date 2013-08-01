var TP = TP || {};
(function () {


    var BarChart = function () {


        var __g__ = this;

        __g__.mouseoverBarChartRect = function (_event) {
            var targetView =_event.associatedData.targetView
            var obj =_event.associatedData.obj
            var svg =_event.associatedData.svg

            obj.style('fill', 'red');
            //if(click == 0){

            //console.log(d3.select(this).data()[0]);
            var value = obj.data()[0];

            //console.log(value[1]);

            var node = svg.selectAll("g.node")
                .select("g." + TP.Context().view[targetView].getType())
                .select(/*"rect"*/TP.Context().view[targetView].getViewNodes())
                .data(value[1], function (ddd) { /*console.log(ddd);*/
                    return ddd.baseID;
                })

            node.style("fill", function (d) {
                if (!d.nbselect) d.nbselect = 0;
                d.nbselect++;
                return "red";
            });
            //.enter()

            //console.log(node);
            //}
            TP.Context().view[_event.associatedData.source].getController().sendMessage("updateOtherView", {data:obj.data()[0], type:"simpleSelect"});
        }

        __g__.mouseoutBarChartRect = function (_event) {

            var targetView =_event.associatedData.targetView;
            var obj =_event.associatedData.obj;
            var svg =_event.associatedData.svg;
            var tabClick =_event.associatedData.tabClick;

            var value = obj.data()[0];

            // console.log(value[2]);
            // console.log("tableau : "+tabClick[""+value[2]]);

            if (tabClick["" + value[2]] == 0) {
                obj.style('fill', "#4682b4");
            }

            var node = svg.selectAll("g.node")
                .select("g." + TP.Context().view[targetView].getType())
                .select(TP.Context().view[targetView].getViewNodes())
                .data(value[1], function (ddd) { /*console.log(ddd);*/
                    return ddd.baseID;
                })

            node.style("fill", function (d) {
                d.nbselect--;
                if (d.nbselect == 0) {
                    return TP.Context().view[targetView].getNodesColor()
                }
                return "red";
            });
        }


        __g__.mouseclickBarChartRect = function (_event) {

            var obj =_event.associatedData.obj;
            var tabClick =_event.associatedData.tabClick;
            var svg =_event.associatedData.svg;
            var targetView =_event.associatedData.targetView;

            //click = 1;
            var value = obj.data()[0];

            //console.log(value[2]);
            //console.log("tableau1 : "+tabClick[""+value[2]]);

            if (tabClick["" + value[2]] == 1) {
                obj.style('fill', "#4682b4");
                tabClick["" + value[2]] = 0;

                var node = svg.selectAll("g.node")
                    .select("g." + TP.Context().view[targetView].getType())
                    .select(TP.Context().view[targetView].getViewNodes())
                    .data(value[1], function (ddd) { /*console.log(ddd);*/
                        return ddd.baseID;
                    })

                node.style("fill", function (d) {
                    d.nbselect--;
                    if (d.nbselect == 1) {
                        return TP.Context().view[targetView].getNodesColor()
                    }
                    return "red";
                });

            }
            else {
                if (tabClick["" + value[2]] == 0) {
                    obj.style('fill', 'red');
                    tabClick["" + value[2]] = 1;

                    var node = svg.selectAll("g.node")
                        .select("g." + TP.Context().view[targetView].getType())
                        .select(TP.Context().view[targetView].getViewNodes())
                        .data(value[1], function (ddd) { /*console.log(ddd);*/
                            return ddd.baseID;
                        })

                    node.style("fill", function (d) {
                        d.nbselect++;
                        return "red";
                    });
                }
            }

            //console.log("tableau2 : "+tabClick[""+value[2]]);
            //obj.style('fill','red');

        }


        __g__.drawBarChart = function (_event) {


            var target =_event.associatedData.source;
            var smell =_event.associatedData.smell;


            var svg = null
            svg = TP.Context().view[target].getSvg();

            var tabMetric = TP.Context().view[target].getMetric_BC();

            var numberMetric = tabMetric[0];
            var metric = tabMetric[1];
            var tabSommet = tabMetric[2];

            var tabClick = [];

            var end = metric.length;

            for (i = 0; i < end; i++) {
                tabClick["" + metric[i] + ""] = 0;
            }


            //assert(true, "erreur1");

            //var id = "" + TP.Context().getIndiceView();

            //console.log("iddddddddddddddddddddddd : " + id)

            var myView = new TP.ViewBarchart({//id:id,
                                              name:"BarChart_" + smell + "_" + TP.view[target].getName(), 
                                              type:"barchart", 
                                              idSourceAssociatedView:target, 
                                              typeBarchart:smell});

            var id = myView.getID();

            //console.log(TP.Context().view[id]);

            TP.Context().view[id].addView();
            TP.Context().view[id].buildLinks();

            //assert(true, "erreur2");

            var chart = null;
            chart = TP.Context().view[id].getSvg();

            if (smell == "base") {


                //var chart;
                var width = 400;
                var bar_width = 20;
                var height = bar_width * numberMetric.length;

                var left_width = 200;

                var x, y;
                x = d3.scale.linear()
                    .domain([0, d3.max(numberMetric)])
                    .range([0, width]);


                y = d3.scale.ordinal()
                    .domain(numberMetric)
                    .rangeBands([0, height]);


                chart.selectAll("rect")
                    .data(tabSommet)
                    .enter().append("rect")
                    .attr("x", left_width)
                    .attr("y", function (d, i) {
                        return i * bar_width;
                    })
                    .attr("width", function (d) {
                        return x(d[0]);
                    })
                    .attr("height", 20)
                    .style("stroke", "white")
                    .style("fill", "steelblue")


                chart.selectAll("text.score")
                    .data(numberMetric)
                    .enter().append("text")
                    .attr("x", function (d) {
                        return x(d) + left_width;
                    })
                    .attr("y", function (d, i) {
                        return (i * bar_width) + 10;
                    })
                    .attr("dx", -5)
                    .attr("dy", ".36em")
                    .attr("text-anchor", "end")
                    .style("fill", "white")
                    .text(String);


                chart.selectAll("text.name")
                    .data(metric)
                    .enter().append("text")
                    .attr("x", left_width / 2)
                    .attr("y", function (d, i) {
                        return (i * bar_width) + 10;
                    })
                    .attr("dy", ".36em")
                    .attr("text-anchor", "middle")
                    .attr('class', 'name')
                    .text(String);
            }

            if (smell == "rotate") {

                var margin = {top: 30, right: 10, bottom: 200, left: 130};

                var height = 400;
                var bar_width = 40;
                var width = bar_width * numberMetric.length;

                chart.append("g")
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

                chart = chart.select("g");


                chart.append("g")
                    .attr("class", "x_axis_BarChart" + smell + "_" + id)
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .style("fill", "none")
                    .style("stroke", "#000")
                    .style("shape-rendering", "crispEdges");

                chart.append("g")
                    .attr("class", "y_axis_BarChart" + smell + "_" + id)
                    .call(yAxis)
                    .style("fill", "none")
                    .style("stroke", "#000")
                    .style("shape-rendering", "crispEdges");

                chart.selectAll("rect")
                    .data(tabSommet)
                    .enter().append("rect")
                    .attr("x", function (d, i) {
                        return x(d[2]);
                    })
                    .attr("y", function (d) {
                        return y(d[0]);
                    })
                    .attr("width", bar_width)
                    .attr("height", function (d) {
                        return height - y(d[0]);
                    })
                    .style("stroke", "white")
                    .style("fill", "steelblue");


                chart.selectAll("text.score")
                    .data(tabSommet)
                    .enter().append("text")
                    .attr("x", function (d, i) {
                        return (x(d[2]) + (bar_width + 1) / 2)
                    })
                    .attr("y", function (d) {
                        return y(d[0]) + 11;
                    })
                    //.attr("dy", ".36em")
                    .attr("text-anchor", "end")
                    .style("fill", "white")
                    .text(function (d) {
                        return "" + d[0];
                    });

                var texte = d3.selectAll(".x_axis_BarChart" + smell + "_" + id).selectAll("g.tick")
                    .attr("text-anchor", "middle")
                    .selectAll("text")
                    .style("text-anchor", "end");

                //texte.attr("dd", function(d) {console.log(this.getBBox());});

                texte.attr("transform", function (d) {
                    return "translate(" + this.getBBox().height * -1 + "," + 0 + ")rotate(-30)";
                });

                function zoom() {
                    chart.select("g").select(".x_axis_BarChartrotate_" + id).call(xAxis);
                    chart.select("g").select(".x_axis_BarChartrotate_" + id).call(yAxis);
                    //d3.select('.chart_rotate_'+id).selectAll("rect").attr("transform", "translate(" + d3.event.translate[0] + ",0)scale(" + d3.event.scale + ", 1)");
                };

                //d3.select('.chart_rotate_'+id).call(d3.behavior.zoom().x(x).scaleExtent([1, 8]).on("zoom", zoom));
                chart.call(d3.behavior.zoom().x(x).scaleExtent([1, 8]).on("zoom", zoom));

            }

            chart.selectAll("rect")
                .on('mouseover', function (d, i) {
                    TP.Context().view[id].getController().sendMessage("mouseoverBarChartRect", {obj: d3.select(this), targetView: target, svg: svg})
                })
                .on('mouseout', function (d, i) {
                    TP.Context().view[id].getController().sendMessage("mouseoutBarChartRect", {obj: d3.select(this), targetView: target, svg: svg, tabClick: tabClick})
                })
                .on('click', function (d, i) {
                    TP.Context().view[id].getController().sendMessage("mouseclickBarChartRect", {obj: d3.select(this), tabClick: tabClick, targetView: target, svg: svg})
                });
        }

        return __g__;

    }

    TP.BarChart = BarChart;

})(TP);
