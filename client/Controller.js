var TP = TP || {};
(function () {


    var Controller = function () {


        var __g__ = this;
        
        var idView = null;
        var nameC = null;
        var typeC = null;

        __g__.stateGraph = null;
        __g__.eventHandlerObject = null;

        var currentState = null;
        var beforeCurrentState = null;


        __g__.getElem = function()
        {
            console.log("curent view's listener : ", __g__.eventHandlerObject.getElem(nameC));
        }
        
        __g__.getStateGraph = function()
        {
            return __g__.stateGraph;
        }
        
        __g__.getNameController = function()
        {
            return nameC;
        }
        
        __g__.addEvent = function (type, fn) {
            return __g__.eventHandlerObject.addEvent(nameC, type, fn);
        }

        __g__.deleteEvent = function (type) {
            __g__.eventHandlerObject.deleteEvent(nameC, type);
        }
                            
        __g__.addStates = function () {

            if (typeC === "view") {
                TP.Context().view[idView].initStates();
            }
            else if (typeC == "principal")
                TP.Context().initStates();
            else
                assert(false, "type of controller isn't supported (function addStates)");
        }
        

        __g__.addEventState = function (name, func, parametersState) {            

            var hasState = false;
            var bindings = ["all"];
            var fromAll = true;
            var useless = false;
            var activate = true;
            
            if(parametersState != null)
            {
                hasState = true;
                
                if(('bindings' in parametersState))
                    bindings = parametersState.bindings;
                if(('fromAll' in parametersState))
                    fromAll = parametersState.fromAll; 
                if(('useless' in parametersState))
                    useless = parametersState.useless;
                if(('activate' in parametersState))
                    activate = parametersState.activate;
            }
            
            var sGraph = null;
            var listenerName = null;

            sGraph = __g__.stateGraph;
            listenerName = nameC;
                
            if(sGraph != null && listenerName != null){
                
                var success = false;
                
                success = __g__.addEvent(name, func);

                if(success === false){
                    assert(false, "warning : event isn't added because event already exist in eventHandler since an other insertion or event can't be created (function addEventState)")
                }
                
                if(hasState === true){
                    sGraph.addState({name:name, bindings:bindings}, fromAll, useless, activate);
                }
                else
                    assert(true, "you asked to don't have state creating (function addEventState)");

            }
            else{
                assert(false, "sGraph or/and controller isn't defined or correctly initialised !! (function addEventState)")
                return;
            }
            
        }


        __g__.addState = function(nameState, parametersState)
        {
            
            var bindings = ["all"];
            var fromAll = true;
            var useless = false;
            var activate = true;
            
            if(parametersState != null)
            {
                
                if(('bindings' in parametersState))
                    bindings = parametersState.bindings;
                if(('fromAll' in parametersState))
                    fromAll = parametersState.fromAll; 
                if(('useless' in parametersState))
                    useless = parametersState.useless;
                if(('activate' in parametersState))
                    activate = parametersState.activate;
            }
            
            var sGraph = __g__.getStateGraph();
            var listenerName = __g__.getNameController();
            
            sGraph.addState({name:nameState, bindings:bindings}, fromAll, useless, activate);            
            
        }
                
        
        __g__.deleteEventState = function(nameState){                
            __g__.deleteState(nameState);
            __g__.deleteEvent(nameState);
        }
        
        __g__.deleteState = function(nameState){
            if(currentState  == nameState)
                currentState = beforeCurrentState;
                
            __g__.stateGraph.deleteState(nameState);            
        }
                
        
        __g__.getInfoState = function (nameState) {
            return __g__.stateGraph.getInfoState(nameState);
        }

        __g__.isActivate = function (nameState) {
            return __g__.getInfoState(nameState).activate === true;
        }

        __g__.enableState = function (nameState) {
            __g__.stateGraph.enableState(nameState);
        }

        __g__.disableState = function (nameState) {
            __g__.stateGraph.disableState(nameState);
        }

        __g__.setUseless = function(nameState, value){
            __g__.stateGraph.setUseless(nameState, value);
        }
        
        __g__.setFromAll = function(nameState, value)
        {
            __g__.stateGraph.setFromAll(nameState, value);
        }

        __g__.setCurrentState = function (nameState) {
            currentState = nameState;
        }

        __g__.initController = function (ID, typeController) {
            
            if (ID == null || typeController == null) {
                assert(false, "error !!! ID or typeCotroller is not defined")
                return;
            }

            __g__.stateGraph = new TP.StateGraph();
            __g__.eventHandlerObject = new TP.eventHandler();
            
            idView = ID;
            nameC = "handlerState" + idView;
            typeC = typeController;

            $("#Controller").append('<div id=' + nameC + '></div>');

            //StateGraph.initStateTree(typeC);
            //console.log(nameC);
            __g__.eventHandlerObject.addElement(nameC, $("[id=" + nameC + "]")[0]);
            
            __g__.addStates();
        }

        __g__.getStateAccess = function (nameState) {

            //console.log("currentState : "+currentState)

            var State = __g__.stateGraph.getInfoState(nameState);

            if (State == null)
                return false;

            if (currentState == null) {
                return true;
            }

            if (State.activate == false) {
                return false;
            }
            else {
                //if (State.specialRoot === true) {
                if (State.root["all"] !== undefined){
                    return true;
                }
                else if (State.root[currentState] !== undefined) {
                    return true;
                }
                else
                    return __g__.isBindingToAll(currentState);	//if state's bindings has "all" occurence, the state doesn't modifie currentState.
            }
        }

        __g__.isBindingToAll = function (nameState) {
            var State = __g__.stateGraph.getInfoState(nameState);
            
            if(State != null)
                return State.bindings["all"] !== undefined;
            else{
                assert(false, "there is no State named : "+nameState+" (function isBindingToAll)");
                return;
            }
        }

        __g__.transitionState = function (nameState) {
            var State = __g__.stateGraph.getInfoState(nameState);
            
            //console.log(__g__.stateGraph)
            
            if (State.useless !== true){
                if(nameState != currentState){
                    beforeCurrentState = currentState
                    currentState = nameState;
                }            
            }
        }
 
        
        //targetController : for example, even if div's id of principal controller is handlerStateprincipal, type "principal"
        //same thing for view, type just the view ID("0", "1", "2")        
        __g__.sendMessage = function (messageName, data, idViewDestination, idViewSource){

            if (idViewSource != null && idViewDestination == null) {
                assert(false, "error !!!! idViewSource is specified, but not idViewDestination (function sendMessage)");
                return;
            }
            
            var access = false;
            var tmpController = null;

            if (idViewDestination != null) {
                if (idViewDestination === "principal") {
                    tmpController = TP.Context().getController();
                }
                else {
                    tmpController = TP.Context().view[""+idViewDestination].getController();
                }
            }
            else {
                tmpController = __g__;                
            }

            //if no message are available, we don't send message            
            if(tmpController.eventIsAvailable(messageName) === false)
            {
                assert(false, "no event are available for this message. Even if state is present (or not), message will be not sent !!! (function sendMessage)");
                return -1;
            }         
            
            var canContinue = tmpController.getStateGraph().isBindWithState(messageName);
                        
            if(canContinue === true){
                
                access = tmpController.getStateAccess(messageName);
                
                if (access === false) {
                    console.log("currentState : "+currentState)
                    assert(false, "access denied : " + messageName + " (function sendMessage)");
                    return;
                }
                
                tmpController.transitionState(messageName);
                
            }
            else if(canContinue === -1){
                assert(false, "warning : state is associated with an other state but function 'addState' hasn't been called for it (function sendMessage)");
            }
            //else
            //{
                //assert(true, "message can pass => state cheking is disabled for it");
            //}

            var _event = new CustomEvent(messageName);
            if (data != null) {
               _event.associatedData = data;
            }
            else
               _event.associatedData = {};


            if (idViewSource != null)
               _event.associatedData.source = idViewSource;
            else
               _event.associatedData.source = idView;

            if (idViewDestination != null)
               _event.associatedData.target = idViewDestination;
            else
               _event.associatedData.target = idView;               
            
            if (idViewDestination == null)
                document.getElementById(nameC).dispatchEvent(_event);
            else
                document.getElementById("handlerState" + idViewDestination).dispatchEvent(_event);

        }
         
        __g__.eventIsAvailable = function(eventName){
            return __g__.eventHandlerObject.eventIsAvailable(nameC, eventName);
        }
        
        __g__.remove = function () {
            
            d3.select("#" + nameC + "").remove();
            
            idView = null;
            nameC = null;
            typeC = null;

            __g__.stateGraph = null;
            __g__.eventHandlerObject = null;

            currentState = null;

        }
        
        __g__.addBinding = function(stateSource, stateDest)
        {
            __g__.stateGraph.addBinding(stateSource, stateDest);
        }

        return __g__;
    }

    TP.Controller = Controller;
})(TP);
