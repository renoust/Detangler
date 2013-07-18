/*
-exposing filtered set of shapes
-drag offset
-resize brush
 */

d3.custom = d3.custom || {};
d3.custom.Lasso = function module(){

    var isPressedOnLasso = false;
    var isPressedOnBg = false;
    var movedOnBg = false;
    var skip = 0;
    var skipNum = 1;
    var lassoPoints = [];
    var rectPoints = [];
    var lassoAlreadyDisplayed = false;
    var mouseOffsetX = 0;
    var mouseOffsetY = 0;
    var rectIsAlive = true;
    var shapes = null;
    var lassoGroup = null;
    var g = null;
    var dispatch = d3.dispatch("brushDrawStart", "brushDrawMove", "brushDrawEnd", "brushDragStart", "brushDragMove", "brushDragEnd");

    function exports(svg){

        g = svg.append('g').classed('lasso-group', true);

        lassoGroup = g.attr({
            transform: 'translate(0, 0)'
        });
        var lasso = lassoGroup.append('path')
            .attr({
                'class': 'freeform-brush',
                stroke: 'black',
                fill: 'red',
                'fill-opacity': 0.2,
                display: 'none'
            })
            .on('mousedown', function(d, i){
                isPressedOnLasso = true;
                var mousePos = d3.mouse(lasso.node());
                var bbox = this.getBBox();
                mouseOffsetX = bbox.x - mousePos[0];
                mouseOffsetY = bbox.y - mousePos[1];
            });

        var rectBrush = lassoGroup.append('path')
            .attr({
                'class': 'rect-brush',
                stroke: 'black',
                fill: 'red',
                'fill-opacity': 0.2,
                display: 'none'
            })
            .on('mousedown', function(d, i){
                isPressedOnLasso = true;
                var mousePos = d3.mouse(rectBrush.node());
                var bbox = this.getBBox();
                mouseOffsetX = bbox.x - mousePos[0];
                mouseOffsetY = bbox.y - mousePos[1];
                dispatch.brushDragStart();
            });

//        d3.select('body')
        svg
            .on('mousedown.drawLasso', function(d, i){
                if(isPressedOnLasso) return;
                isPressedOnBg = true;
                if(!!d3.select('.lasso')[0][0]){
                    lassoAlreadyDisplayed = true;
                    rectBrush.attr({width: 0, height: 0});
                    lasso.attr({display: 'none'});
                }
//                var mousePos = d3.mouse(d3.select('body').node());
                var mousePos = d3.mouse(svg.node());
                rectPoints = [mousePos, mousePos, mousePos, mousePos]
                rectBrush.attr({
                    display: 'block',
                    d: 'M' + rectPoints.join('L') + 'Z'
                });
                dispatch.brushDrawStart();
            })
            .on('mousemove.drawLasso', function(d, i){
                if(isPressedOnLasso || !isPressedOnBg) return;
                if(lassoAlreadyDisplayed){
                    lassoPoints = [];
                    lassoAlreadyDisplayed = false;
                    lassoGroup.attr({transform: 'translate(0, 0)'});
                    rectBrush.attr({display: 'none'});
                }
                movedOnBg = true;
//                var mousePos = d3.mouse(d3.select('body').node());
                var mousePos = d3.mouse(svg.node());
                if((skip++ % skipNum) >= skipNum - 1){
                    lassoPoints.push([mousePos[0], mousePos[1]]);
                    lasso.attr({
                        d: 'M' + lassoPoints.join('L') + 'Z',
                        display: 'block'
                    });
                }
                if(isRect(lassoPoints)){
                    rectPoints[1] = [mousePos[0], rectPoints[0][1]];
                    rectPoints[2] = mousePos;
                    rectPoints[3] = [rectPoints[0][0], mousePos[1]];
                    rectBrush.attr({
                        display: 'block',
                        d: 'M' + rectPoints.join('L') + 'Z',
                        width: mousePos[0] - parseInt(rectBrush.attr('x')),
                        height: mousePos[1] - parseInt(rectBrush.attr('y'))
                    });
                    rectIsAlive = true;
                }
                else{
                    rectBrush.attr({display: 'none'});
                    rectIsAlive = false;
                }
                //            findIntersect(shapes, d3.select('.lasso'));
                findAllIntersect(shapes, rectIsAlive ? rectPoints : lassoPoints, lassoGroup);
                dispatch.brushDrawMove();
            })
            .on('mousemove.dragLasso', function(d, i){
                if(!isPressedOnLasso) return;
//                var mousePos = d3.mouse(d3.select('body').node());
                var mousePos = d3.mouse(svg.node());
                var bbox = d3.select('.lasso').node().getBBox();
                var newPosX = mousePos[0] - bbox.x + mouseOffsetX;
                var newPosY = mousePos[1] - bbox.y + mouseOffsetY;
                lassoGroup.attr({
                    transform: 'translate(' + newPosX + ' ' + newPosY + ')'
                });
                //            findIntersect(shapes, d3.select('.lasso'));
                findAllIntersect(shapes, rectIsAlive ? rectPoints : lassoPoints, lassoGroup);
                dispatch.brushDragMove();
            })
            .on('mouseup', function(d, i){
                //            findIntersect(shapes, d3.select('.lasso'));
                findAllIntersect(shapes, rectIsAlive ? rectPoints : lassoPoints, lassoGroup);
                if(!isPressedOnLasso && isPressedOnBg && !movedOnBg){
                    lassoPoints = [];
                    lasso.attr({display: 'none'});
                    rectBrush.attr({display: 'none'});
                    rectBrush.classed('lasso', false);
                    lasso.classed('lasso', false);
                }
                if(!isPressedOnLasso){
                    var isRectangle = isRect(lassoPoints);
                    if(isRectangle){
                        lassoPoints = [];
                        lasso.attr({display: 'none'});
                    }
                    else{
                        rectBrush.attr({display: 'none'});
                    }
                    rectBrush.classed('lasso', isRectangle);
                    lasso.classed('lasso', !isRectangle);
                }
                if(isPressedOnLasso) dispatch.brushDragEnd();
                else dispatch.brushDrawEnd();
                isPressedOnLasso = false;
                isPressedOnBg = false;
                movedOnBg = false;
            });
    }

    function findAllIntersect(shapes, polygon, lasso){
        shapes.each(function(d, i){
            findIntersect(d3.select(this), polygon, lasso);
        });
    }

    function findIntersect(shape, polygon, lasso){
        var i, j;
        var c = 0;
        var lassoTranslate = d3.transform(lasso.attr('transform')).translate;
        var shapeBBox = shape.node().getBBox();
        var x = shapeBBox.x + shapeBBox.width / 2 - lassoTranslate[0];
        var y = shapeBBox.y + shapeBBox.height / 2 - lassoTranslate[1];
        var end1 = polygon.length;
        var end2 = end1 - 1;
        var polyX, polyY, polyPrevX, polyPrevY;
        for(i = 0, j = end2; i < end1; j = i++){
            polyY = polygon[i][1];
            polyX = polygon[i][0];
            polyPrevY = polygon[j][1];
            polyPrevX = polygon[j][0];
            if((((polyY <= y) && (y < polyPrevY)) || ((polyPrevY <= y) && (y < polyY))) &&
                (x < (polyPrevX - polyX) * (y - polyY) / (polyPrevY - polyY) + polyX)){
                c = !c;
            }
        }
        shape.style({fill: function(d, i){
            return c ? 'limegreen' : 'skyblue';
        }});
    }

    function findIntersectBBox(shapes, lasso){
        var bbox = lasso.node().getBBox();
        var lassoTranslate = d3.transform(lassoGroup.attr('transform')).translate;
        var lassoX = bbox.x + lassoTranslate[0];
        var lassoY = bbox.y + lassoTranslate[1];
        var intersected = shapes.filter(function(d, i){
            var selectionBBox = this.getBBox();
            var rectX = selectionBBox.x;
            var rectY = selectionBBox.y;
            var rectW = selectionBBox.width;
            var rectH = selectionBBox.height;
            return rectX + rectW > lassoX && rectX < lassoX + bbox.width
                && rectY + rectH > lassoY && rectY < lassoY + bbox.height;
        });
        shapes.style({fill: 'skyblue'});
        intersected.style({fill: 'red'});
        return intersected;
    }

    function isRect(d, i){
        if(lassoPoints.length < 1) return;
        var firstPointPos = lassoPoints[0];
        var lastPointPos = lassoPoints[lassoPoints.length - 1];
        var dist = hypot(firstPointPos, lastPointPos);
        var pathLength = 0;
        lassoPoints.forEach(function(d, i, a){
            if(i >= lassoPoints.length - 1) return;
            pathLength += hypot(d, a[i + 1]);
        });
        return (pathLength / dist) <= 1.5;
    }

    function hypot(pointA, pointB){
        return  Math.sqrt(Math.pow(pointB[0] - pointA[0], 2) + Math.pow(pointB[1] - pointA[1], 2));
    }

    exports.shapes = function(_x){
        shapes = _x;
        return this;
    };

    d3.rebind(exports, dispatch, "on");

    return exports;
};

/*
var w = 600,
    h = 400;

var svg = d3.select('#chart').append('svg')
    .attr({
        width: w,
        height: h
    })
    .style({border: '1px solid silver'});

var rects = svg.selectAll('rect.shape')
    .data(d3.range(10))
    .enter().append('rect')
    .classed('shape', true)
    .attr({
        x: function(d, i){
            return ~~(Math.random() * w);
        },
        y: function(d, i){
            return ~~(Math.random() * h);
        },
        width: 20,
        height: 20
    })
    .style({fill: 'skyblue'});

var lasso = d3.custom.Lasso();
lasso.shapes(rects);
svg.append('g')
    .classed('lasso', true)
    .call(lasso);
    */