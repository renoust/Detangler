//the eventHandler must be init before using this object, because it depend of information used by the current view's controler's eventHandler
var TP = TP || {};

(function () {

    
    var UpdateEventHandler = function (type, idView){

        var __g__ = this;
        
        __g__.idView = idView;
        
        __g__.tabAssociation = null;
        __g__.dataTreatment = null;
        __g__.tabAssociationSave = null;
        __g__.dataTreatmentSave = null;
        
        var BarChart = [["simpleSelect", function(event){TP.DataTreatment().mouseoverBarChartRectUpdate(event);}]]
        var graph = [["simpleSelect", function(event){TP.DataTreatment().simpleSelectGraph(event)}]]

//in this implementation, the data from the last view is treated in function "treatUpdateEvent" of current view. then when we look bindings for datatreatment, for example
//the first line of graphDataTreatment Means : my current view is graph and if last view is "barchart" and typeEvent is "simpleSelect", then the called function to obtain my data is... 

        var graphDataTreatment = [{typeView:"barchart", typeEvent:"simpleSelect", func:function(){console.log("barchart_graphDataTreatment")}}, 
                                    {typeView:"catalyst", typeEvent:"simpleSelect", func:function(){console.log("catalyst_graphDataTreatment");}},
                                    {typeView:"substrate", typeEvent:"simpleSelect", func:function(){console.log("substrate_graphDataTreatment");}}];

        var barChartDataTreatment = [{typeView:"barchart", typeEvent:"simpleSelect", func:function(){console.log("barchart_barChartDataTreatment")}}, 
                                    {typeView:"catalyst", typeEvent:"simpleSelect", func:function(){console.log("catalyst_barChartDataTreatment");}},
                                    {typeView:"substrate", typeEvent:"simpleSelect", func:function(){console.log("substrate_barChartDataTreatment");}}];


        __g__.addTreatmentFunc = function(typeView, typeEvent, func){
            
            if(__g__.dataTreatment[typeView] == null)
                __g__.dataTreatment[typeView] = new Object();
                
            if(__g__.dataTreatment[typeView][typeEvent] == null)
            {
                if(__g__.dataTreatmentSave[typeView] != null)
                    if(__g__.dataTreatmentSave[typeView][typeEvent] != null)
                        delete __g__.dataTreatmentSave[typeView][typeEvent]
                
                __g__.dataTreatment[typeView][typeEvent] = func;
            }
            else
                assert(false, "An association between typeView and typeEvent already exist !! (function addTreatmentFunc)")
        }
        
        
        __g__.addUpdateFunc = function(typeEvent, func){
            
            
            if(__g__.tabAssociation[typeEvent] == null)
            {
                if(__g__.tabAssociationSave[typeEvent] != null)
                    delete __g__.tabAssociationSave[typeEvent];
                
                __g__.tabAssociation[typeEvent] = func;
            }
            else
                assert(false, "typeEvent already exist !! (function addUpdateFunc)")
        }
        
        
        __g__.deleteTreatmentFunc = function(typeView, typeEvent){
            
            if(__g__.dataTreatment[typeView] != null){
                if(__g__.dataTreatment[typeView][typeEvent] != null)
                {
                    __g__.dataTreatmentSave[typeView] = new Object();
                    __g__.dataTreatmentSave[typeView][typeEvent] = __g__.dataTreatment[typeView][typeEvent];
                    delete __g__.dataTreatment[typeView][typeEvent];
                }
            }
            else
                assert(false, "the association does'nt exist !! (function deleteTreatmentFunc)")
        }
        
        
        __g__.deleteUpdateFunc = function(typeEvent, func){
            
            if(__g__.tabAssociation[typeEvent] != null)
            {
                __g__.tabAssociationSave[typeEvent] = __g__.tabAssociation[typeEvent];
                delete __g__.tabAssociation[typeEvent];
            }
            else
                assert(false, "the association does'nt exist !! (function deleteUpdateFunc)")
        }
        
        
        __g__.goBackTreatmentFunc = function(typeView, typeEvent){
            
            if(__g__.dataTreatmentSave[typeView] != null)
            {
                if(__g__.dataTreatmentSave[typeView][typeEvent] != null)
                {
                    if(__g__.dataTreatment[typeView] == null)
                        __g__.dataTreatment[typeView] = new Object();
                    
                    __g__.dataTreatment[typeView][typeEvent] = __g__.dataTreatmentSave[typeView][typeEvent];
                    delete __g__.dataTreatmentSave[typeView][typeEvent];
                }
            }
            else
                assert(false, "the association does'nt exist !! (function goBackTreatmentFunc)")
        }
        
        
        __g__.goBackUpdateFunc= function(typeView, typeEvent){
            
            if(__g__.tabAssociationSave[typeView] != null)
            {
                __g__.tabAssociation[typeView] = __g__.tabAssociationSave[typeView];
                delete __g__.tabAssociationSave[typeView];
            }
            else
                assert(false, "the association does'nt exist !! (function goBackUpdateFunc)")
        }
        
        
        __g__.init = function(){
            var tab = null;
            
            __g__.tabAssociation = new Object();
            __g__.dataTreatment = new Object();
            __g__.tabAssociationSave = new Object();
            __g__.dataTreatmentSave = new Object();
            
            if(type === "barchart"){
                tab = BarChart;
                __g__.initHashDataTreatment(barChartDataTreatment);
            }
            
            if(type === "graph"){
                tab = graph;
                __g__.initHashDataTreatment(graphDataTreatment);
            }

            if(tab != null){
                if(tab.length != 0){

                    for(var i = 0; i < tab.length; i++)
                    {
                        if(tab[i][0] != null && tab[i][1] != null){
                            //lastFunc is put to null because we recup the current event's function in the eventHandler in switching function.
                            //tabTmp[tab[i][0]] = {lastFunc:null, newFunc:tab[i][1]}
                            __g__.tabAssociation[tab[i][0]] = tab[i][1];
                        }
                        else
                            return;
                    }
                }
            }
            
            //console.log("tabTmptabTmptabTmptabTmptabTmptabTmptabTmptabTmptabTmptabTmptabTmp : ", tabTmp)

        }
        
        __g__.initHashDataTreatment = function(tab){
            
            for(var i = 0; i < tab.length; i++){
                if(tab[i].typeView != null && tab[i].typeEvent != null && tab[i].func != null){
                    __g__.dataTreatment[tab[i].typeView] = new Object();
                    __g__.dataTreatment[tab[i].typeView][tab[i].typeEvent] = tab[i].func;
                    
                }
                    //console.log("tab[i].typeView : ", tab[i].typeView, "tab[i].typeEvent : ", tab[i].typeEvent, "tab[i].func : ", tab[i].func)
            }
            
            //return tabTmp;
                
        }
        
        //__g__.tabAssociation = __g__.init();
        __g__.init();

        __g__.getInfo = function(){
            return __g__.tabAssociation;
        }

        __g__.treatUpdateEvent = function(event){

            __g__.dataTreat(TP.Context().view[event.associatedData.source].getType(), event);
            
            if(__g__.tabAssociation != null){
                if(__g__.tabAssociation[event.associatedData.type] != null){
                    __g__.tabAssociation[event.associatedData.type].call(null, event)
                }
                else
                    assert(false, "warning : update function for "+event.associatedData.type+" does not exist !! (function treatUpdateEvent)" );
            }
            else
                assert(false, "warning : process treatUpdateEvent problem  (function treatUpdateEvent)");

        }
        
        
                
        __g__.dataTreat = function(typeView, event){
            
            if(__g__.dataTreatment[typeView] != null){                
                
                if(__g__.dataTreatment[typeView][event.associatedData.type] != null){
                    __g__.dataTreatment[typeView][event.associatedData.type].call(null, event);
                }
                else
                    assert(false, "warning : treatment data function from typeView : "+typeView+" to this view : "+idView+" and typeEvent : "+event.associatedData.type+" does not exist !! (function dataTreat)" );
            }
            else
                assert(false, "warning : treatment data function from typeView : "+typeView+" to this view : "+idView+" and typeEvent : "+event.associatedData.type+" does not exist !! (function dataTreat)" );
        }


        return __g__;

    }

    TP.UpdateEventHandler = UpdateEventHandler;
})(TP)