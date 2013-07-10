(function () {

import_class('context.js', 'TP');
import_class("objectReferences.js", "TP");
import_class('stateSelect.js','TP');
import_class('Controller.js','TP');
import_class('StateTree.js', 'TP')

	var ViewBarchart = function(id, groupe, bouton, svgs, name, type, idAssociation, typeBarchart){		
		
		var __g__ = new TP.ViewTemplate(id, groupe, svgs, name, type, idAssociation, bouton);
		
		__g__.typeBarChart = typeBarchart;		

		__g__.getTypeBarChart = function() {
			return __g__.typeBarChart;
		}
		
		__g__.addView = function() {
	
	     	if(__g__.controller != null)
	     	   __g__.controller.initListener(__g__.ID, "view");
	     	   
			__g__.buttonTreatment();
			__g__.createDialog();
			
		    __g__.svg = d3.select("#zone" + __g__.ID)
	           .append("svg")
	           .attr('class', 'chart_'+__g__.typeBarChart+"_"+__g__.ID)
	           .attr("width", "100%")
	           .attr("height", "100%")
	           .attr("id", __g__.tabDataSvg[4])
	           .attr("idView", __g__.ID);	
		}
					
		__g__.remove = function()
		{
			__g__.removeViewTemplate();
			
			__g__.typeBarChart = null;
		}
	
		
		__g__.initStates = function()
		{
			__g__.controller.addState({name:"mouseoverBarChartRect", bindings:null, func:function(event){/*assert(true, "mouseoverBarChartRect");*/ TP.BarChart().mouseoverBarChartRect(event);}}, "all", true);			
			__g__.controller.addState({name:"mouseoutBarChartRect", bindings:null, func:function(event){/*assert(true, "mouseoutBarChartRect");*/ TP.BarChart().mouseoutBarChartRect(event);}}, "all", true);
			__g__.controller.addState({name:"mouseclickBarChartRect", bindings:null, func:function(event){/*assert(true, "mouseclickBarChartRect");*/ TP.BarChart().mouseclickBarChartRect(event);}}, "all", true);
			
			__g__.controller.setCurrentState(null);
								
		}
				
		
		return __g__;
	}

    return {ViewBarchart  : ViewBarchart};
        
})()