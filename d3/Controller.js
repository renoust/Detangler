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
        
        __g__.addStates = function()
        {
        	
        	if(typeC === "view")
        	{
        		TP.Context().view[nameC].initStates();
        	}
        	else if(typeC == "principal")
        		TP.Context().initStates();
        	else
				assert(false, "type of controller isn't supported");
        }
        
        __g__.addState = function(node, nodeRoot, useless, activate)
        {
        	console.log("node : ", node, "nodeRoot : ", nodeRoot, "useless : ", useless, "activate : ", activate)        	
        	StateTree.addState(node, nodeRoot, useless, activate);
        	//we can call addEvent after addState to simplifie Event insersion
        }
        
		__g__.getInfoState = function(name)
		{
			return StateTree.getInfoState(name);
		}
		
		__g__.isActivate = function(name)
		{
			return __g__.getInfoState(name).activate === true;
		}		
		
		__g__.enableState = function(state)
		{
			StateTree.enableState(state);
		}

		__g__.disableState = function(state)
		{
			StateTree.disableState(state);
		}
		
		__g__.setCurrentState = function(name)
		{
			currentState = name;
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
        	        	
        	//StateTree.initStateTree(typeC);
        	__g__.addStates();
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
        	/*
        	var tmp = StateTree.getRoot();
        	
        	if((tmp != null) && (Object.getPrototypeOf(tmp) == Object.getPrototypeOf({})))
        		if(tmp.hasOwnProperty("name"))
        	  		currentState = StateTree.getRoot().name;*/
        	  		
        	if(typeC = "view")
        		currentState = "select"
        }
        
        __g__.getStateAccess = function(cState)
        {   
        	
        	//console.log("currentState : "+currentState)
        	
        	var State = StateTree.getInfoState(cState);
        	
        	if(State == null)
        		return false;
        	
        	if(currentState === null)
        	{
        		return true;
        	}
        	
        	if(State.activate == false){
        		return false;
        	}
        	else{
	        	if(State.specialRoot === true)
	        	{
	        		if(State.root["all"] !== undefined)
	        			return true;
	        	}
	        	else if(State.root[currentState] !== undefined)
	        	{
	        		return true;
	        	}
	        	else
	        		return __g__.isBindingToAll(currentState);	//if state's bindings has "all" occurence, the state doesn't modifie currentState.
	      }   
        }
        
        __g__.isBindingToAll = function(cState)
        {
        	var State = StateTree.getInfoState(cState);
        	return State.bindings["all"] !== undefined;
        }
        
        __g__.transitionState = function(cState)
        {
        	var State = StateTree.getInfoState(cState);
        	
        	if(State.useless !== true) 
        		currentState = cState;
        }
        
        __g__.getTree = function()     
        {
        	return StateTree.getStateTree();
        }
        
        __g__.sendMessage = function(messageName, object, targetController, source) //targetController : for example, even if div's id of principal controller is handlerStateprincipal, type "principale"
        																			//same thing for view, type just the view ID("0", "1", "2")
        {
        	
        	if(source != null && targetController == null)
        	{
        		assert(false, "error !!!! source is specified, but not targetController");
        		return;
        	}	
        	
        	var access = null;
        	var tmpController = null;
        	
        	if(targetController != null)
        	{
        		if(targetController === "principal")
        		{
        			tmpController = TP.Context().getController();
        			access = tmpController.getStateAccess(messageName);
        		}
        		else
        		{
        			tmpController = TP.Context().view[targetController].getController();
        			access = tmpController.getStateAccess(messageName);
        		}
        	}
        	else
        	{
        		tmpController = __g__;
				access = tmpController.getStateAccess(messageName);    		
        	}
        	
        	if(access === false)
        	{
        		//console.log("currentState : "+currentState)
        		assert(false, "access denied : "+messageName);
        		return;
        	}         	
        	
        	
        	tmpController.transitionState(messageName);
        	
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
	        nameC = null;
	        listenerState = null;
	        typeC = null;
	        
	        StateTree = null;
			eventHandlerObject = null;
							
			currentState = null;        	
        }
        
        
        
        
                
        
        return __g__;
    }

    return {Controller: Controller};
})()
