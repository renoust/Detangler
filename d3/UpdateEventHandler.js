//the eventHandler must be init before using this object, because it depend of information used by the current view's controler's eventHandler
var TP = TP || {};

(function () {
	
    
    var UpdateEventHandler = function (type, idView) {

        var __g__ = this;
        
		__g__.idView = idView;
		__g__.tabAssociation = null;
		__g__.dataTreatment = null;
				
		var BarChart = [["simpleSelect", function(event){TP.DataTreatment().mouseoverBarChartRectUpdate(event);}]]		
		var graph = [["simpleSelect", function(event){TP.DataTreatment().simpleSelectGraph(event)}]]


		var graphDataTreatment = [{typeView:"barchart", typeEvent:"simpleSelect", func:function(){console.log("barchart_graphDataTreatment")}}, 
									{typeView:"catalyst", typeEvent:"simpleSelect", func:function(){console.log("catalyst_graphDataTreatment");}},
									{typeView:"substrate", typeEvent:"simpleSelect", func:function(){console.log("substrate_graphDataTreatment");}}];
									
		var barChartDataTreatment = [{typeView:"barchart", typeEvent:"simpleSelect", func:function(){console.log("barchart_barChartDataTreatment")}}, 
									{typeView:"catalyst", typeEvent:"simpleSelect", func:function(){console.log("catalyst_barChartDataTreatment");}},
									{typeView:"substrate", typeEvent:"simpleSelect", func:function(){console.log("substrate_barChartDataTreatment");}}];
									
		
		__g__.init = function()
		{
			var tab = null;
			var tabTmp = null;
			
			if(type === "barchart")
			{
				tab = BarChart;
				__g__.dataTreatment  = __g__.initHashDataTreatment(barChartDataTreatment);
			}
			
			if(type === "graph")
			{
				tab = graph;
				__g__.dataTreatment  = __g__.initHashDataTreatment(graphDataTreatment);
			}
						
			if(tab != null)
			{
				if(tab.length != 0){
					
					tabTmp = new Object();
					
					for(var i = 0; i < tab.length; i++)
					{
						if(tab[i][0] != null && tab[i][1] != null){
							//lastFunc is put to null because we recup the current event's function in the eventHandler in switching function.
							//tabTmp[tab[i][0]] = {lastFunc:null, newFunc:tab[i][1]}
							tabTmp[tab[i][0]] = tab[i][1];
						}
						else
							return null;						
					}
				}		
			}
			
			//console.log("tabTmptabTmptabTmptabTmptabTmptabTmptabTmptabTmptabTmptabTmptabTmp : ", tabTmp)
								
			return tabTmp;

		}        
        
        __g__.initHashDataTreatment = function(tab)
        {
        	var tabTmp = new Object();
        	
        	for(var i = 0; i < tab.length; i++){
        		if(tab[i].typeView != null && tab[i].typeEvent != null && tab[i].func != null){
        			tabTmp[tab[i].typeView] = new Object();
        			tabTmp[tab[i].typeView][tab[i].typeEvent] = tab[i].func;
        			console.log(tabTmp);
        		}
        			//console.log("tab[i].typeView : ", tab[i].typeView, "tab[i].typeEvent : ", tab[i].typeEvent, "tab[i].func : ", tab[i].func)
        	}
        	
        	return tabTmp;
        		
        }
        
		__g__.tabAssociation = __g__.init();

				
		__g__.getInfo = function()
		{
			return __g__.tabAssociation;
		}	
		/*
		__g__.switchFunction = function(name)
		{
			if(__g__.tabAssociation != null){
				if(__g__.tabAssociation[name] != null){
					
					if(__g__.tabAssociation[name].lastFunc === null)
					__g__.tabAssociation[name].lastFunc = TP.Context().view[idView].getController().getFuncEvent(name);
					
					if(__g__.tabAssociation[name].lastFunc != null && __g__.tabAssociation[name].newFunc != null)
					{
						var tmp = __g__.tabAssociation[name].lastFunc;
						__g__.tabAssociation[name].lastFunc = __g__.tabAssociation[name].newFunc;
						__g__.tabAssociation[name].newFunc = tmp;
						
						var getFunc = TP.Context().view[idView].getController().modifyFunc(name, __g__.tabAssociation[name].lastFunc);
						
						return 1;					
					}
				}
			}
			
			return 0;
		}
		*/
		__g__.treatUpdateEvent = function(event)
		{
			//console.log(event);
			/*
			var possible = __g__.switchFunction(event.associatedData.type);
			if(possible === 1){
				TP.Controller().sendMessage(event.associatedData.type, {data:event.associatedData.data}, event.associatedData.target, event.associatedData.target);
				__g__.switchFunction(event.associatedData.type);
			}
			else
				assert(false, "warning : process problem");
			*/
						
			__g__.dataTreat(TP.Context().view[event.associatedData.source].getType(), event);		
			//console.log("dataTreatment : ", __g__.dataTreatment)
			
			if(__g__.tabAssociation != null){
				if(__g__.tabAssociation[event.associatedData.type] != null){
						__g__.tabAssociation[event.associatedData.type].call(null, event)
				}
			}
			else
				assert(false, "warning : process problem");
									
		}
		
		
				
		__g__.dataTreat = function(typeView, event)
		{
			if(__g__.dataTreatment[typeView][event.associatedData.type] != null){
				__g__.dataTreatment[typeView][event.associatedData.type].call(null, event);
			}
		}
		
		
        return __g__;

    }

    TP.UpdateEventHandler = UpdateEventHandler;
})(TP)