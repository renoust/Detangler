var TP = TP || {};

(function () {

    var DataTreatment = function () {

        var __g__ = this;

        
        __g__.dataToTabNode  =function(_event){

            var data = _event.associatedData.data
            var tabNode = new Array();

            for(var i = 0; i<data.length; i++)
                tabNode.push(data[i].baseID);

            tabNode.sort(function(a, b) {
                return a - b;
            });
            
            return tabNode;
        } 

        __g__.mouseoverBarChartRectUpdate = function(_event)
        {
           var targetView = _event.associatedData.target
           assert(true, "target : "+targetView)
           var data = _event.associatedData.data;
           
           console.log("data : ", data);
           var obj = data[2];
           assert(true, "obj : "+obj)
           
           d3.select(".barchart_"+targetView).selectAll("rect")
                .style('fill', function(d){if(d[2] === obj){return 'red';}else{return "#4682b4";}})
        }

        __g__.simpleSelectGraph = function(_event)
        {
            var svg = TP.Context().view[_event.associatedData.target].getSvg();
            console.log("svg : ", svg);

            var data = _event.associatedData.data;
            console.log("data : ", data);

            var value = data[1];
            var node = svg.selectAll("g.node")
                      .select("g."+TP.Context().view[_event.associatedData.target].getType())
                      .select(/*"rect"*/TP.Context().view[_event.associatedData.target].getViewNodes())
                      .data(value, function(ddd){ /*console.log(ddd);*/ return ddd.baseID; })
           
            node.style("fill","black");
        }

        __g__.synchronizedSelectionData = function(_event)
        {

        }
         
        return __g__;
    }

    TP.DataTreatment = DataTreatment;
})(TP)