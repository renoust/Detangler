(function () {

	import_class('eventHandler.js', 'TP')
	import_class('StateTree.js', 'TP')

    var Controller = function () {
    	
    	
        var __g__ = this;
        
        var nameC = null;
        var listenerState = null;
        var typeC = null;
        
		var StateTree = null;
		var eventHandlerObject = null; 
		var currentState = null;
				
        __g__.addEvent = function(name, type, fn)
        {
        	eventHandlerObject.addEvent(name, type, fn);
        }
        
        __g__.removeEvent = function(name, type, id)
        {
        	eventHandlerObject.removeEvent(name, type, id);
        }
        
        __g__.initListener = function(ID, typeController)
        {   
    		if(ID == null || typeController == null){
        		assert(false, "error !!! ID or typeCotroller is not defined")
        		return;
       		}	
        	
	        nameC = ID;
	        listenerState = "handlerState"+nameC;
	        typeC = typeController;               
	        
			StateTree = new TP.StateTree();
			eventHandlerObject = new TP.eventHandler();
			currentState = null;
		
		        	
        	$("#Controller").append('<div id='+listenerState+'></div>');
        	        	
        	StateTree.initStateTree(typeC);
        	console.log(listenerState);
        	eventHandlerObject.addElement(listenerState,$("[id="+listenerState+"]")[0]);
        	
        	var tabInit = StateTree.getStateTree();
        	
        	console.log("tabInit : ");
        	console.log(tabInit);
        	
        	for(var key in tabInit){
        		console.log(key);
        		console.log(tabInit[key]);
        		__g__.addEvent(listenerState, tabInit[key].name, tabInit[key].func);
        	}
        	
        	var tmp = StateTree.getRoot();
        	
        	if((tmp != null) && (Object.getPrototypeOf(tmp) == Object.getPrototypeOf({})))
        		if(tmp.hasOwnProperty("name"))
        	  		currentState = StateTree.getRoot().name;
        }
        
        __g__.getTree = function()     
        {
        	return StateTree.getStateTree(typeC);
        }
        
        __g__.sendMessage = function(messageName, object, targetController, source) //targetController : for example, even if div's id of principal controller is handlerStateprincipal, type "principale"
        																			//same thing for view, type just the view ID("0", "1", "2")
        {
        	var event = new CustomEvent(messageName);
        	if(object != null){
        		event.associatedData = object;        		
        	}
        	else
        		event.associatedData = {};
        		
        	
        	if(source != null)
        		event.associatedData.source = source;
        	else
        		event.associatedData.source = nameC;
        		
        	if(targetController != null)	
        		event.associatedData.target = targetController;
        	else
        		event.associatedData.target = nameC;
        	
        	
        	if(targetController == null)    	 
        		document.getElementById(listenerState).dispatchEvent(event);
        	else
        		document.getElementById("handlerState"+targetController).dispatchEvent(event);        		
        }
        
        __g__.remove = function()
        {
        	d3.select("#"+listenerState+"").remove();
        }
                
        
        return __g__;
    }

    return {Controller: Controller};
})()
