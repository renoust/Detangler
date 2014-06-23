/************************************************************************
 * This class implements a selector that shapes like a rectangle or a
 * lasso similarly to the one described by Michael McGuffin [Interaction
 * Techniques for Selecting and Manipulating Subgraphs in Network
 * Visualizations, Infovis 2009, MJ. McGuffin and I. Jurisica]
 *
 * It draws the brush/lasso selection under a given svg (create it
 * with new, and give the svg as a parameter. You want to associate the
 * class methods 'mouseUp', 'mouseDown', 'mouseMove' as callbacks to the
 * object you want to draw in. You want also to reimplement the method
 * 'checkIntersect()' in your code because it defines how/what is an
 * intersection and the action to accomplish consequently.
 * svg, the svg to draw the interactor
 *
 * Maybe we'd like to standardize some naming in this class, and cut the
 * methods that look like too heavy...

 * @requires d3.js
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

var TP = TP || {};
(function () {

    var Lasso = function (viewID) {

        // __g, the container to return and manipulate through the callbacks
        // cSvg, the current svg
        // started, the trigger to know when the brush drawing is started
        // canMove, the trigger to know when the brush is being moved
        // isResizing, the trigger to know when the brush is being resized
        // group, the svg:g that contains the brush
        // prevMovePoint, the previous position of the cursor
        // pointList, the list of points used to draw the lasso or rect brush
        // resizeDirection, the direction to which we are resizing the rect 
        // brush
        // totalDistanceAlongDrag, the total distance along which the mouse 
        // is dragged
        // distanceFromStartToEnd, the straight distance btw the starting 
        // and ending points
        // fillColor, the color to fill the brush

        //console.log('creating a lasso object with', svg);
        var __g = this;

        __g.cSvg = null;

        if (viewID != null)
            __g.cSvg = TP.Context().view[viewID].getSvg();

        __g.started = false;
        __g.canMove = false;
        __g.moveLasso = false;
        __g.isResizing = false;

        __g.group = null;
        __g.prevMovePoint = [];
        __g.pointList = [];
        __g.resizeDirection = "none";

        __g.totalDistanceAlongDrag = 0.0;
        __g.distanceFromStartToEnd = 0.0;

        __g.fillColor = 'white';
        __g.basicDefaultColor = 'purple';
        // This method is called internally to update both the total distance 
        // along drag and
        // the distance from start to end given a new point, the point is 
        // then copied to the global
        // container 'pointList'
        // cPoint, the point to add
        //
        // do we really need to measure the sq. root?
        __g.updateDistance = function (cPoint) {
            if (__g.pointList.length > 0) {
                fPoint = __g.pointList[0]
                lPoint = __g.pointList[__g.pointList.length - 1]
                __g.totalDistanceAlongDrag += Math.sqrt(((cPoint[0]
                    - lPoint[0]) * (cPoint[0]
                    - lPoint[0])) + ((cPoint[1]
                    - lPoint[1]) * (cPoint[1]
                    - lPoint[1])))
                __g.distanceFromStartToEnd = Math.sqrt(((cPoint[0]
                    - fPoint[0]) * (cPoint[0]
                    - fPoint[0])) + ((cPoint[1]
                    - fPoint[1]) * (cPoint[1]
                    - fPoint[1])))
            }
            __g.pointList.push([cPoint[0], cPoint[1]]);
        }


        // This method checks if the brush has a shape of a lasso or not, 
        // depending on the ratio of the distance along drag and the distance 
        // from start to end
        __g.isLasso = function () {
            return (__g.totalDistanceAlongDrag / __g.distanceFromStartToEnd) > 1.5;
        }


        // This function defines the behavior of the brush when the mouse 
        // button is pushed down
        // e, the mouse event (2D array containing the mouse coordinates)
        // This method returns immediately if we already started the 
        // selection, we are currently moving the brush or we are resizing it
        // We first initiate the useful variables to draw the lasso, then 
        // create the group element and its behaviors (mouseover, mouseout, 
        //mousedown, mousemove, mouseup)

        __g.mouseoverMouseDown = function (_event) {

            var source = _event.associatedData.source;

            var obj = TP.Context().view[source].getLasso();

            if (obj.started || obj.canMove) return;
            obj.canMove = true;
        }

        __g.mouseoutMouseDown = function (_event) {

            var source = _event.associatedData.source;

            var obj = TP.Context().view[source].getLasso();

            obj.canMove = false;
        }

        __g.mousedownMouseDown = function (_event) {

            var source = _event.associatedData.source;
            var obj = TP.Context().view[source].getLasso();
            var mouse = _event.associatedData.mouse;

            obj.prevMovePoint = [mouse[0], mouse[1]];
            obj.moveLasso = true;
        }

        __g.mousemoveMouseDown = function (_event) {
            var source = _event.associatedData.source;
            var obj = TP.Context().view[source].getLasso();
            var mouse = _event.associatedData.mouse;
            var d = _event.associatedData.d;

            if (obj.moveLasso) {

                var coord = mouse;
                var dx = coord[0] - obj.prevMovePoint[0];
                var dy = coord[1] - obj.prevMovePoint[1];

                var end = d.length;

                for (var i = 0; i < end; i++) {
                    d[i][0] = d[i][0] + dx;
                    d[i][1] = d[i][0] + dy;
                }

                var strPointList = "";

                end = obj.pointList.length;

                for (var i = 0; i < end; i++) {
                    obj.pointList[i][0] = obj.pointList[i][0] + dx;
                    obj.pointList[i][1] = obj.pointList[i][1] + dy;
                    var p = obj.pointList[i]
                    strPointList += p[0] + ',' + p[1] + ' '
                }

                if (obj.isLasso()) {
                    obj.cSvg.select("polygon.brush")
                        .data(obj.pointList)
                        .attr("points", strPointList)
                        .attr("style", function () {
                            return "fill:" + obj.fillColor + ";stroke:"+__g.basicDefaultColor+";stroke-width:2;fill-rule:evenodd;fill-opacity:.5";
                        })
                } else {
                    var p0 = obj.pointList[0]
                    var p1 = obj.pointList[obj.pointList.length - 1]
                    obj.cSvg.select("rect.view")
                        .data([1])
                        .attr("x", Math.min(p0[0], p1[0]))
                        .attr("y", Math.min(p0[1], p1[1]))
                        .attr("width", Math.abs(p0[0] - p1[0]))
                        .attr("height", Math.abs(p0[1] - p1[1]))
                        .style("fill", function () {
                            return obj.fillColor;
                        })
                        .style("fill-opacity", .5)
                        .style("stroke", __g.basicDefaultColor)
                        .style("stroke-width", 2)
                    obj.cSvg.selectAll("g.resize")
                        .data([])
                        .exit()
                        .remove()
                    obj.drawResizeRectangles(p0, p1);
                }

                var p = mouse;
                obj.prevMovePoint = [p[0], p[1]];

                //obj.checkIntersect();
                TP.Context().view[source].getController().sendMessage("zoneApparu");
            }
            ;
        }


        __g.mouseupMouseDown = function (_event) {
            var source = _event.associatedData.source;
            var obj = TP.Context().view[source].getLasso();
            var mouse = _event.associatedData.mouse;

            if (obj.moveLasso) {
                var coord = mouse;
            }
            obj.moveLasso = false;
        }


        __g.mouseDown = function (e) {
            //assert(false, "lasso_mouseDown")

            if (__g.started || __g.canMove /*|| __g.isResizing*/)
                return;

            // initalizations and clean the svg of any other brush    
            __g.pointList = [];
            __g.totalDistanceAlongDrag = 0;
            __g.distanceFromStartToEnd = 0;
            __g.cSvg.selectAll(".brush")
                .data(this.pointList)
                .exit()
                .remove();
            __g.cSvg.selectAll(".resize")
                .data(this.pointList)
                .exit()
                .remove();
            __g.pointList.push([e[0], e[1]]);

            // appends the group, attach it to the pointList
            __g.group = __g.cSvg.append("g")
                .data(__g.pointList)
                .attr("class", "brush")
                // allow to move the brush when the mouse pass over
                .on("mouseover", function (d) {/*
                 if (__g.started || __g.canMove) return;
                 __g.canMove = true;*/
                    TP.Context().view[viewID].getController().sendMessage("mouseoverMouseDown");
                })
                // disables the brush ability to be moved
                .on("mouseout", function (d) {
                    TP.Context().view[viewID].getController().sendMessage("mouseoutMouseDown");
                })
                // enter the 'moving' mode, and stores the first point
                .on("mousedown", function (d) {
                    /*
                     var p = d3.mouse(this);
                     __g.prevMovePoint = [p[0], p[1]];
                     __g.moveLasso = true;*/
                    TP.Context().view[viewID].getController().sendMessage("mousedownMouseDown", {mouse: d3.mouse(this)});
                })
                // defines the moving behavior:
                // first compute the translation vector and applies it to each
                // point of the data and to the actual 'pointList', a string is
                // also build to feed the svg:polygon if the brush seems to be
                // a polygon. Otherwise only the first and last points
                // are used to draw a svg:rect brush, to which are removed and
                // re-attached the resize rectangles interactors (see below
                // drawResizeRectangles()). Once the brush has been moved we check
                // if it intersects with any point in the view, and store the
                // mouse pointer.
                .on("mousemove", function (d) {
                    TP.Context().view[viewID].getController().sendMessage("mousemoveMouseDown", {mouse: d3.mouse(this), d: d})
                })
                // ends the moving phase, disable the 'moveLasso' trigger
                .on("mouseup", function (d) {
                    TP.Context().view[viewID].getController().sendMessage("mouseupMouseDown", {mouse: d3.mouse(this)})
                })


            // this disables the text selection in the frame
            __g.cSvg.selectAll("text")
                .attr('unselectable', 'on')
                .style('-moz-user-select', 'none')
                .style('-webkit-user-select', 'none')
                .style('user-select', 'none')
                .style('-ms-user-select', 'none');

            // triggers the construction flag
            __g.started = true;
        }


        // This method defines the behavior of the brush while we're moving 
        // the mouse cursor
        // e, the mouse event (2D array containing the mouse coordinates)
        // If the rise mode is triggered, it applies the risize function 
        // with the current mouse coordinates (see resizeRectangleEvent()). 
        // If the construction flag is not triggered or the move flag is 
        // triggered then the function returns.
        // Otherwise, a new svg:path is added to the brush group corresponding 
        // to the last section, distances are updated, all brush rectangles are
        // removed from the scene, and if the brush still matches to a 
        //rectangle shape, then a new one is constructed
        __g.mouseMove = function (e) {

            //assert(false,"lasso_mouseMove")

            if (__g.isResizing) {

                var p0 = __g.pointList[0];
                var p1 = __g.pointList[__g.pointList.length - 1];

                var current = [e[0], e[1]];
                __g.resizeRectangleEvent(current, p0, p1);
                return;
            }

            if (!__g.started || __g.canMove) return;
            var prevPoint = __g.pointList[__g.pointList.length - 1];
            var newPoint = [e[0], e[1]];

            __g.group.data(__g.pointList)
                .append("path")
                .attr("class", "brush")
                .attr("d", function () {
                    return "M" + prevPoint[0] + " " + prevPoint[1] + " L" + newPoint[0] + " " + newPoint[1];
                })
                .style("stroke", "gray")
                .style("stroke-width", function (d) {
                    return 1;
                })

            __g.updateDistance(newPoint)


            __g.group.selectAll("rect.brush")
                .data([])
                .exit()
                .remove()


            if (!__g.isLasso()) {

                //assert(false, "should be drawing the rectangle")
                var p0 = __g.pointList[0]
                var p1 = __g.pointList[__g.pointList.length - 1]

                __g.group.selectAll("rect.brush")
                    .data([1])
                    .enter()
                    .append("rect")
                    .attr("class", "brush")
                    .attr("x", Math.min(p0[0], p1[0]))
                    .attr("y", Math.min(p0[1], p1[1]))
                    .attr("width", Math.abs(p0[0] - p1[0]))
                    .attr("height", Math.abs(p0[1] - p1[1]))
                    .style("fill", __g.fillColor)
                    .style("fill-opacity", .5)
            }
        }


        // This method defines the behavior of the brush while mouse button 
        // comes back up
        // e, the mouse event (2D array containing the mouse coordinates)
        // While resizing, it just turns off the corresponding flag, and 
        // returns directly if the construction
        // flag is off or the move flag is on. The svg:path is added the same 
        // way as previously, the distances are also updated similarly.
        // In the case of the shape of the brush corresponds to a lasso, 
        // the lasso is closed with the first point
        // and an even/odd closed polygon is drawn over the area. Otherwise 
        // it's a rectangle as previously describbed.
        // Any intersection is finally checked and the starting flag is turned 
        // off, useless path and rect are cleaned.
        __g.mouseUp = function (e) {

            //assert(false, "lasso_mouseUp")

            if (__g.isResizing) __g.isResizing = false;
            if (!__g.started || __g.canMove) return;
            var prevPoint = __g.pointList[__g.pointList.length - 1];
            var newPoint = [e[0], e[1]];
            this.group.data(__g.pointList)
                .append("path")
                .attr("class", "brush")
                .attr("d", function () {
                    return "M" + prevPoint[0] + " " + prevPoint[1] + " L" + newPoint[0] + " " + newPoint[1];
                })
                .style("stroke", "gray")
                .style("stroke-width", function (d) {
                    return 1;
                })

            __g.updateDistance(newPoint)


            if (__g.isLasso()) {
                prevPoint = __g.pointList[0];
                __g.group.data(__g.pointList)
                    .append("path")
                    .attr("class", "brush")
                    .attr("d", function () {
                        return "M" + newPoint[0] + " " + newPoint[1] + " L" + prevPoint[0] + " " + prevPoint[1];
                    })
                    .style("stroke", "gray")
                    .style("stroke-width", function (d) {
                        return 1;
                    })

                __g.pointList.push([prevPoint[0], prevPoint[1]]);

                var strPointList = ""

                var end = this.pointList.length;

                for (i = 0; i < end; i++) {
                    var p = __g.pointList[i]
                    strPointList += p[0] + ',' + p[1] + ' '
                }

                __g.group.append("polygon")
                    .data(__g.pointList)
                    .attr("class", "brush")
                    .attr("points", strPointList)
                    .attr("style", function (d) {
                        return "fill:" + __g.fillColor + ";stroke:purple;stroke-width:2;fill-rule:evenodd;fill-opacity:.5";
                    })
                    .style("cursor", "move")

            } else {
                var p0 = __g.pointList[0]
                var p1 = __g.pointList[__g.pointList.length - 1]

                __g.group.append("rect")
                    .data([1])
                    .attr("class", "view")
                    .attr("x", Math.min(p0[0], p1[0]))
                    .attr("y", Math.min(p0[1], p1[1]))
                    .attr("width", Math.abs(p0[0] - p1[0]))
                    .attr("height", Math.abs(p0[1] - p1[1]))
                    .style("fill", function () {
                        return __g.fillColor;
                    })
                    .style("fill-opacity", .5)
                    .style("stroke", "purple")
                    .style("stroke-width", 2)
                    .style("cursor", "move")

                __g.cSvg.selectAll("g.resize")
                    .data([])
                    .exit()
                    .remove()

                __g.drawResizeRectangles(p0, p1);
            }

            var surfaceApproximation = (__g.distanceFromStartToEnd * __g.distanceFromStartToEnd + __g.totalDistanceAlongDrag * __g.totalDistanceAlongDrag) / 2;

            //console.log("the surface approximation", surfaceApproximation);
            if (surfaceApproximation < 100) {
                //console.log("The surface is too small!")
                __g.pointList = [];
                __g.totalDistanceAlongDrag = 0;
                __g.distanceFromStartToEnd = 0;
                __g.cSvg.selectAll(".brush")
                    .data(this.pointList)
                    .exit()
                    .remove();
                __g.cSvg.selectAll(".resize")
                    .data(this.pointList)
                    .exit()
                    .remove();
            }

            //__g.checkIntersect()
            TP.Context().view[viewID].getController().sendMessage("zoneApparu");

            // reactivation of the text selection
            __g.cSvg.selectAll("text")
                .attr('unselectable', 'off')
                .style('-moz-user-select', 'undefined')
                .style('-webkit-user-select', 'undefined')
                .style('user-select', 'undefined')
                .style('-ms-user-select', 'undefined')

            __g.started = false;

            __g.group.selectAll("rect.brush")
                .data([])
                .exit()
                .remove()
            __g.cSvg.selectAll("path.brush")
                .data(this.pointList)
                .remove()
                .exit()
        }


        __g.mousedownResizeGroup = function (_event) {
            var source = _event.associatedData.source;
            var direction = _event.associatedData.direction;

            var obj = TP.Context().view[source].getLasso();

            obj.isResizing = true;
            obj.resizeDirection = direction;
        }

        __g.mouseupResizeGroup = function (_event) {
            var source = _event.associatedData.source

            var obj = TP.Context().view[source].getLasso();

            obj.isResizing = false;
        }


        // This method draws invisible rectangles 10px wide around a given 
        // rectangle defined by its north-west and south-east corners p0 and p1.
        // p0, [x,y] coordinates of the north west corner of a rectangle
        // p1, [x,y] coordinates of the south east corner of a rectangle
        // 8 rectangles are drawn, one for each direction (n,s,e,w) + corners 
        // (ne,nw,se,sw)
        // without overlap. On mousedown, each rectangle triggers a flag for 
        // the resize direction.

        __g.drawResizeRectangles = function (p0, p1) {

            var resizeGroup = __g.cSvg.append("g").attr("class", "resize")
            resizeGroup.data([1]).enter()

            resizeGroup.append("rect")
                .data([1])
                .classed("resize", true)
                .classed("west", true)
                .attr("x", Math.min(p0[0], p1[0]) - 5)
                .attr("y", Math.min(p0[1], p1[1]) + 5)
                .attr("width", 10)
                .attr("height", Math.abs(Math.abs(p0[1] - p1[1]) - 10))
                .style("fill", __g.fillColor)
                .style("fill-opacity", 0)
                .style("cursor", "w-resize")
                .on("mousedown", function () {/*
                 console.log("mouseDown1")
                 __g.isResizing = true;
                 __g.resizeDirection = "west";*/
                    TP.Context().view[viewID].getController().sendMessage("mousedownResizeGroup", {direction: "west"})
                })
                .on("mouseup", function () {
                    //__g.isResizing = false;
                    TP.Context().view[viewID].getController().sendMessage("mouseupResizeGroup")
                })

            resizeGroup.append("rect")
                .data([1])
                .classed("resize", true)
                .classed("east", true)
                .attr("x", Math.max(p0[0], p1[0]) - 5)
                .attr("y", Math.min(p0[1], p1[1]) + 5)
                .attr("width", 10)
                .attr("height", Math.abs(Math.abs(p0[1] - p1[1]) - 10))
                .style("fill", __g.fillColor)
                .style("fill-opacity", 0)
                .style("cursor", "e-resize")
                .on("mousedown", function () {/*
                 console.log("mouseDown2")
                 __g.isResizing = true;
                 __g.resizeDirection = "east";*/
                    TP.Context().view[viewID].getController().sendMessage("mousedownResizeGroup", {direction: "east"})
                })
                .on("mouseup", function () {
                    //__g.isResizing = false;
                    TP.Context().view[viewID].getController().sendMessage("mouseupResizeGroup")
                })

            resizeGroup.append("rect")
                .data([1])
                .classed("resize", true)
                .classed("north", true)
                .attr("x", Math.min(p0[0], p1[0]) + 5)
                .attr("y", Math.min(p0[1], p1[1]) - 5)
                .attr("width", Math.abs(Math.abs(p0[0] - p1[0]) - 10))
                .attr("height", 10)
                .style("fill", __g.fillColor)
                .style("fill-opacity", 0)
                .style("cursor", "n-resize")
                .on("mousedown", function () {/*
                 console.log("mouseDown3")
                 __g.isResizing = true;
                 __g.resizeDirection = "north";*/
                    TP.Context().view[viewID].getController().sendMessage("mousedownResizeGroup", {direction: "north"})
                })
                .on("mousemove", function () {
                })
                .on("mouseup", function () {
                    //__g.isResizing = false;
                    TP.Context().view[viewID].getController().sendMessage("mouseupResizeGroup")
                })

            resizeGroup.append("rect")
                .data([1])
                .classed("resize", true)
                .classed("south", true)
                .attr("x", Math.min(p0[0], p1[0]) + 5)
                .attr("y", Math.max(p0[1], p1[1]) - 5)
                .attr("width", Math.abs(Math.abs(p0[0] - p1[0]) - 10))
                .attr("height", 10)
                .style("fill", __g.fillColor)
                .style("fill-opacity", 0)
                .style("cursor", "s-resize")
                .on("mousedown", function () {
                    /*
                     console.log("mouseDown3")
                     __g.isResizing = true;
                     __g.resizeDirection = "south";*/
                    TP.Context().view[viewID].getController().sendMessage("mousedownResizeGroup", {direction: "south"})
                })
                .on("mouseup", function () {
                    //__g.isResizing = false;
                    TP.Context().view[viewID].getController().sendMessage("mouseupResizeGroup")
                })

            resizeGroup.append("rect")
                .data([1])
                .classed("resize", true)
                .classed("north_west", true)
                .attr("x", Math.min(p0[0], p1[0]) - 5)
                .attr("y", Math.min(p0[1], p1[1]) - 5)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", "red")
                .style("fill-opacity", 0)
                .style("cursor", "nw-resize")
                .on("mousedown", function () {/*
                 console.log("mouseDown4")
                 __g.isResizing = true;
                 __g.resizeDirection = "north_west";*/
                    TP.Context().view[viewID].getController().sendMessage("mousedownResizeGroup", {direction: "north_west"})
                })
                .on("mouseup", function () {
                    //__g.isResizing = false;
                    TP.Context().view[viewID].getController().sendMessage("mouseupResizeGroup")
                })

            resizeGroup.append("rect")
                .data([1])
                .classed("resize", true)
                .classed("south_west", true)
                .attr("x", Math.min(p0[0], p1[0]) - 5)
                .attr("y", Math.max(p0[1], p1[1]) - 5)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", "red")
                .style("fill-opacity", 0)
                .style("cursor", "sw-resize")
                .on("mousedown", function () {/*
                 console.log("mouseDown5")
                 __g.isResizing = true;
                 __g.resizeDirection = "south_west";*/
                    TP.Context().view[viewID].getController().sendMessage("mousedownResizeGroup", {direction: "south_west"})
                })
                .on("mouseup", function () {
                    //__g.isResizing = false;
                    TP.Context().view[viewID].getController().sendMessage("mouseupResizeGroup")
                })

            resizeGroup.append("rect")
                .data([1])
                .classed("resize", true)
                .classed("south_east", true)
                .attr("x", Math.max(p0[0], p1[0]) - 5)
                .attr("y", Math.max(p0[1], p1[1]) - 5)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", "red")
                .style("fill-opacity", 0)
                .style("cursor", "se-resize")
                .on("mousedown", function () {/*
                 console.log("mouseDown6")
                 __g.isResizing = true;
                 __g.resizeDirection = "south_east";*/
                    TP.Context().view[viewID].getController().sendMessage("mousedownResizeGroup", {direction: "south_east"})
                })
                .on("mouseup", function () {
                    //__g.isResizing = false;
                    TP.Context().view[viewID].getController().sendMessage("mouseupResizeGroup")
                })

            resizeGroup.append("rect")
                .data([1])
                .classed("resize", true)
                .classed("north_east", true)
                .attr("x", Math.max(p0[0], p1[0]) - 5)
                .attr("y", Math.min(p0[1], p1[1]) - 5)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", "red")
                .style("fill-opacity", 0)
                .style("cursor", "ne-resize")
                .on("mousedown", function () {/*
                 console.log("mouseDown7")
                 __g.isResizing = true;
                 __g.resizeDirection = "north_east";*/
                    TP.Context().view[viewID].getController().sendMessage("mousedownResizeGroup", {direction: "north_east"})
                })
                .on("mouseup", function () {
                    //__g.isResizing = false;
                    TP.Context().view[viewID].getController().sendMessage("mouseupResizeGroup")
                })
        }


        // This method defines a rect brush resize event.
        // current, the current mouse position
        // p0, [x,y] coordinates of the north west corner of a rectangle
        // p1, [x,y] coordinates of the south east corner of a rectangle
        // Depending on the resize direction, new coordinates are defined 
        // to draw new resize rectangles and a new brush rectangle too. 
        // Corners apply each adjacent directions recursively. A negative
        // direction applies the opposite resize direction recursively.

        __g.resizeRectangleEvent = function (current, p0, p1) {

            /*if (__g.isResizing) {
             console.log('we are resizing the rectangle: ', this.resizeDirection)
             console.log("mouse: ", current)
             }*/

            if (__g.resizeDirection == "north") {
                maxP = p0[1] > p1[1] ? p0 : p1
                minP = p0[1] > p1[1] ? p1 : p0

                if (current[1] >= maxP[1]) {
                    __g.resizeDirection = "south"
                    __g.resizeRectangleEvent(current, minP, maxP)
                } else {
                    minP[1] = current[1]
                    __g.cSvg.selectAll("g.resize")
                        .data([])
                        .exit()
                        .remove()
                    __g.drawResizeRectangles(minP, maxP)
                }
            }

            if (__g.resizeDirection == "south") {
                maxP = p0[1] > p1[1] ? p0 : p1
                minP = p0[1] > p1[1] ? p1 : p0

                if (current[1] <= minP[1]) {
                    __g.resizeDirection = "north"
                    __g.resizeRectangleEvent(current, minP, maxP)
                } else {
                    maxP[1] = current[1]
                    __g.cSvg.selectAll("g.resize")
                        .data([])
                        .exit()
                        .remove()
                    __g.drawResizeRectangles(minP, maxP)
                }
            }


            if (__g.resizeDirection == "east") {
                maxP = p0[0] > p1[0] ? p0 : p1
                minP = p0[0] > p1[0] ? p1 : p0

                if (current[0] <= minP[0]) {
                    __g.resizeDirection = "west"
                    __g.resizeRectangleEvent(current, minP, maxP)
                } else {
                    maxP[0] = current[0]
                    __g.cSvg.selectAll("g.resize")
                        .data([])
                        .exit()
                        .remove()
                    __g.drawResizeRectangles(minP, maxP)
                }
            }

            if (__g.resizeDirection == "west") {
                maxP = p0[0] > p1[0] ? p0 : p1
                minP = p0[0] > p1[0] ? p1 : p0

                if (current[0] >= maxP[0]) {
                    __g.resizeDirection = "east"
                    __g.resizeRectangleEvent(current, minP, maxP)
                } else {
                    minP[0] = current[0]
                    __g.cSvg.selectAll("g.resize")
                        .data([])
                        .exit()
                        .remove()
                    __g.drawResizeRectangles(minP, maxP)
                }
            }


            if (__g.resizeDirection == "south_west") {
                __g.resizeDirection = "south"
                __g.resizeRectangleEvent(current, p0, p1)
                __g.resizeDirection = "west"
                __g.resizeRectangleEvent(current, p0, p1)
                __g.resizeDirection = "south_west"
            }

            if (__g.resizeDirection == "north_west") {
                __g.resizeDirection = "north"
                __g.resizeRectangleEvent(current, p0, p1)
                __g.resizeDirection = "west"
                __g.resizeRectangleEvent(current, p0, p1)
                __g.resizeDirection = "north_west"
            }

            if (__g.resizeDirection == "north_east") {
                __g.resizeDirection = "north"
                __g.resizeRectangleEvent(current, p0, p1)
                __g.resizeDirection = "east"
                __g.resizeRectangleEvent(current, p0, p1)
                __g.resizeDirection = "north_east"
            }

            if (__g.resizeDirection == "south_east") {
                __g.resizeDirection = "south"
                __g.resizeRectangleEvent(current, p0, p1)
                __g.resizeDirection = "east"
                __g.resizeRectangleEvent(current, p0, p1)
                __g.resizeDirection = "south_east"
            }

            __g.cSvg.select("rect.view")
                .data([1])
                .attr("x", Math.min(p0[0], p1[0]))
                .attr("y", Math.min(p0[1], p1[1]))
                .attr("width", Math.abs(p0[0] - p1[0]))
                .attr("height", Math.abs(p0[1] - p1[1]))
                .style("fill", function () {
                    return __g.fillColor;
                })
                .style("fill-opacity", .5)
                .style("stroke", "purple")
                .style("stroke-width", 2)
            //__g.checkIntersect();
            TP.Context().view[viewID].getController().sendMessage("zoneApparu");
            return
        }


        // This method checks if any point (x,y) intersects with a given polygon.
        // polygon, a list of point composing the polygon
        // x,y, the given point coordinates
        // Everytime the point is at the left and in between height of a 
        // segment of the polygon, we flip a flag, and return it. If the flag
        // returns true, an odd number of flip has been applied, thus the point
        // is inside the polygon shape (which can have holes), if an odd
        // number of flip is applied, the point is either outside the polygon 
        // or in a hole.
        __g.intersect = function (polygon, x, y) {
            var i = 0
            var j = 0
            var c = 0;

            var end1 = polygon.length;
            var end2 = end1 - 1;


            for (i = 0, j = end2; i < end1; j = i++) {
                if ((((polygon[i][1] <= y) && (y < polygon[j][1])) || ((polygon[j][1] <= y) && (y < polygon[i][1]))) &&
                    (x < (polygon[j][0] - polygon[i][0]) * (y - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]))
                    c = !c;
            }
            return c;
        }
        return __g;

        //feature1


        //feature2


        // This function needs to be reimplemented to perform the desired 
        // selection.
        // In this implementation, it checks if any svg:circle on the scene 
        // intersects with the brush.
        __g.checkIntersect = function () {
            __g.cSvg.selectAll("circle").style('fill', function () {
                var x = d3.select(this).attr('cx');
                var y = d3.select(this).attr('cy');
                var pointArray = []
                if (__g.isLasso()) {
                    pointArray = __g.pointList
                } else {
                    var p0 = __g.pointList[0]
                    var p1 = __g.pointList[__g.pointList.length - 1]
                    pointArray = [
                        [p0[0], p0[1]],
                        [p0[0], p1[1]],
                        [p1[0], p1[1]],
                        [p1[0], p0[1]]
                    ]
                }

                if (__g.intersect(pointArray, x, y))
                    return 'red';
                else {
                    var e = window.event
                    if (!e.ctrlKey)
                        return 'blue';
                }
            });
        }
    }

    TP.Lasso = Lasso;
})(TP);