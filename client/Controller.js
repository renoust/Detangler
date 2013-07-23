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
            __g__.eventHandlerObject.removeEvent(nameC, type);
        }
        
        __g__.goBackEvent = function(nameEvent)
        {
            __g__.eventHandlerObject.goBackEvent(nameC, nameEvent)
        }
        
                              
        __g__.addStates = function () {

            if (typeC === "view") {
                TP.Context().view[idView].initStates();
            }
            else if (typeC == "principal")
                TP.Context().initStates();
            else
                assert(false, "type of controller isn't supported");
        }
        

        __g__.addEventState = function (name, func, parametersState, targetView) {            
            
            //bindings, fromAll, useless, activate
            var hasState = false;
            var bindings = null;
            var fromAll = null;
            var useless = null;
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
            
            if(targetView != null){
                var view = TP.Context().view[targetView];
                if(view != null){
                    sGraph = view.getController().getStateGraph();
                    listenerName = view.getController().getNameController();
                }
                else{
                    assert(false, "targetView does'nt exist !!");
                    return;
                }
            }
            else{
                sGraph = __g__.stateGraph;
                listenerName = nameC;
            }
            
            if(sGraph != null && listenerName != null){
            
                //console.log("node : ", node, "nodeRoot : ", nodeRoot, "useless : ", useless, "activate : ", activate)
                
                var success = false;
                
                if(targetView != null)
                    success = TP.Context().view[targetView].getController().addEvent(name, func);
                else
                   success = __g__.addEvent(name, func);
                   
                //console.log("success : "+success)      
                
                if(hasState === true){
                    if(success === true){
                        sGraph.addState({name:name, func:func, bindings:bindings}, fromAll, useless, activate);
                    }
                    else{
                        assert(false, "state isn't added because event already exit in eventHandler since an other insertion or event can't be created")
                        return;
                    }
                }
                else
                    assert(true, "you asked to don't have state creating");

            }
            else{
                assert(false, "sGraph or/and controller isn't defined or correctly initialised !!")
                return;
            }
            //we can call addEvent after addState to simplifie Event insersion
        }
        
        //__g__.addEventState(name, )

        __g__.addState = function(name, func, parametersState)
        {
            
            var bindings = null;
            var fromAll = null;
            var useless = null;
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
            
            sGraph.addState({name:name, func:func, bindings:bindings}, fromAll, useless, activate);            
            
        }
                
        
        __g__.deleteEventState = function(nameState){                
            __g__.deleteState(nameState);
            __g__.deleteEvent(nameState);
        }
        
        __g__.goBackEventState = function(nameState){
            __g__.goBackState(nameState);
            __g__.goBackEvent(nameState);
        }
        
        
        __g__.goBackState = function(nameState){
            __g__.stateGraph.goBackState(nameState);
        }
        
        
        __g__.deleteState = function(nameState){
            if(currentState  == nameState)
                currentState = beforeCurrentState;
                
            __g__.stateGraph.deleteState(nameState);            
        }
                
        
        __g__.getInfoState = function (name) {
            return __g__.stateGraph.getInfoState(name);
        }

        __g__.isActivate = function (name) {
            return __g__.getInfoState(name).activate === true;
        }

        __g__.enableState = function (state) {
            __g__.stateGraph.enableState(state);
        }

        __g__.disableState = function (state) {
            __g__.stateGraph.disableState(state);
        }

        __g__.setCurrentState = function (name) {
            currentState = name;
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
            
            if (typeC = "view")
                currentState = "select"
        }

        __g__.getStateAccess = function (cState) {

            //console.log("currentState : "+currentState)

            var State = __g__.stateGraph.getInfoState(cState);

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

        __g__.isBindingToAll = function (cState) {
            var State = __g__.stateGraph.getInfoState(cState);
            return State.bindings["all"] !== undefined;
        }

        __g__.transitionState = function (cState) {
            var State = __g__.stateGraph.getInfoState(cState);
            
            //console.log(__g__.stateGraph)
            
            if (State.useless !== true){
                if(cState != currentState){
                    beforeCurrentState = currentState
                    currentState = cState;
                }            
            }
        }
        
        
        __g__.isUseless = function(cState, value){
            __g__.stateGraph.isUseless(cState, value);
        }
        
        //targetController : for example, even if div's id of principal controller is handlerStateprincipal, type "principal"
        //same thing for view, type just the view ID("0", "1", "2")        
        __g__.sendMessage = function (messageName, object, idViewDestination, idViewSource){

            if (idViewSource != null && idViewDestination == null) {
                assert(false, "error !!!! idViewSource is specified, but not idViewDestination");
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
                assert(false, "no event are available for this message. Even if state is present (or not), message will be not sent !!!");
                return -1;
            }         
            
            var canContinue = tmpController.getStateGraph().isBindWithState(messageName);
                        
            if(canContinue === true){
                
                access = tmpController.getStateAccess(messageName);
                
                if (access === false) {
                    console.log("currentState : "+currentState)
                    assert(false, "access denied : " + messageName);
                    return;
                }
                
                tmpController.transitionState(messageName);
                
            }
            else if(canContinue === -1){
                assert(false, "message can't pass => state is associated with an other state but function 'addState' has'nt been called for it");
                return;
            }
            //else
            //{
                //assert(true, "message can pass => state cheking is disabled for it");
            //}
            
            var _event = new CustomEvent(messageName);
            if (object != null) {
               _event.associatedData = object;
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

        return __g__;
    }

    TP.Controller = Controller;
})(TP);
