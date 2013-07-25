//pile de gestion d'Etat

var TP = TP || {};
(function () {

    var StateGraph = function () {

        var __g__ = this;

        var hashMapStates = new Object();
        var hashMapSavedStates = new Object();    
        //var saveState = new Object();
        

        __g__.getStateGraph = function () {
            return hashMapStates;
        }

        __g__.getTmpGraph = function () {
            return hashMapSavedStates;
        }

        __g__.getInfoState = function (name) {
            if (hashMapStates[name] !== undefined || hashMapStates[name] !== null) {
                return hashMapStates[name];
            }
            else
                return null;
        }

        __g__.enableState = function (state) {
            hashMapStates[state].activate = true;
        }

        __g__.disableState = function (state) {
            hashMapStates[state].activate = false;
        }

        //useless specifies if the node must be register as currentState in State's chain or not. For example, if a state
        //doesn't involve any changements about the current state, we don't put it in the state's chain as current State.
        __g__.addState = function (node, fromAll, useless, activate)
        {
            
            if((fromAll != null) && (fromAll != true) &&  (fromAll != false))
            {
                assert(false, "problem with 'fromAll' parameter : bad value !!!")
                return;
            }
            if((useless != null) && (useless != true) &&  (useless != false))
            {
                assert(false, "problem with 'fromAll' parameter : bad value !!!")
                return;
            }
            if((activate != null) && (activate != true) &&  (activate != false))
            {
                assert(false, "problem with 'fromAll' parameter : bad value !!!")
                return;
            }
            
            
            if (node == null || node.name == null) {
                assert(false, "State are no name or there is node object default")
                return;
            }
            
            if (hashMapStates[node.name] != null)
            {
                assert(false, "state isn't added because it already exist !!!")
                return;
            }

                //hashMapStates[node.name].specialRoot = true;


            var tmp = null;
            tmp = node.bindings;            
            
            if(tmp != null){
                if(typeof(tmp) === "object"){
                    if (Object.getPrototypeOf(tmp) != Object.getPrototypeOf([])) {
                        assert(false, "'node.bindings' must be an array");
                        return false;
                    }                    
                }
                else{
                    assert(false, "'node.bindings' must be an array");
                    return false;
                }
            }
                
            if (hashMapStates[node.name] == null) {
                if(hashMapSavedStates[node.name] != null){
                    hashMapStates[node.name] = hashMapSavedStates[node.name];
                    delete hashMapSavedStates[node.name];
                }
                else
                    hashMapStates[node.name] = {name: node.name, root: {}, bindings: {}, func: null, activate: true, useless: false};
            }
            
            if(useless != null)
                hashMapStates[node.name].useless = useless;
                
            if(activate != null)
                hashMapStates[node.name].activate = activate;           
            
            if (tmp != null) {
  
                var end = tmp.length;
    
                for (var key = 0; key < end; key++) {
                    if (tmp[key] != "all") {
                                
                        var stateTmp = null;
                        var inGraph = null;
                            
                        if (hashMapStates[tmp[key]] == null) {
                                    
                            if(hashMapSavedStates[tmp[key]] == null)
                                hashMapSavedStates[tmp[key]] = {name: tmp[key], root: {}, bindings: {}, func: null, activate: true, useless: false};
                                        
                            stateTmp = hashMapSavedStates[tmp[key]];
                            inGraph = false;
                        }
                        else{
                            stateTmp = hashMapStates[tmp[key]];
                            inGraph = true;
                        }
    
                        hashMapStates[node.name].bindings[tmp[key]] = true;
                                    //assert(true, "binding with : '" + tmp[key] + "' added")
    
                        if (stateTmp.root[node.name] == undefined && stateTmp.root["all"] == null)
                            stateTmp.root[node.name] = true;
                                    
                    }
                    else {
                        hashMapStates[node.name].bindings = new Object();
                        hashMapStates[node.name].bindings[tmp[key]] = true;
                                //hashMapStates[node.name].specialRoot = true;
                        break;
                    }
                            //hashMapStates[tmp[key]].bindings[node.name] = hashMapStates[node.name];
                 }
            }
            
            if(fromAll === true)
            {
                var tmp =  hashMapStates[node.name].root;
                
                //console.log("tmp : ", tmp)
                
                for(var key in tmp){
                    if(hashMapStates[key] != null){
                        if(hashMapStates[key].bindings != null)
                            if(hashMapStates[key].bindings[node.name] != null)
                               delete hashMapStates[key].bindings[node.name];
                    }
                }
                
                hashMapStates[node.name].root = new Object(); //reinitialise hashtab if it was not empty
                hashMapStates[node.name].root["all"] = true;
            }
            
            
            //}
        }        

        __g__.isBindWithState = function(nameState){
            
            if(hashMapStates[nameState] != null)
            {
                return true; //(state is created, we apply state management
            }
            else if(hashMapSavedStates[nameState] != null){
                return -1; // state created in tmp hashmap but not in principal hashmap. The state is not create by addState calling but because it is in other state bindings
            }
            else
                return false; //the state does'nt exist nowhere
        }


        __g__.deleteState = function(name){ 
            
            if(hashMapStates[name] != null){

                var tmp = hashMapStates[name];
                
                if(tmp.bindings["all"] == null){

                    for(var key in tmp.bindings){
                        if(hashMapStates[key] != null){
                            if(hashMapStates[key].root[name] != null)
                                delete hashMapStates[key].root[name];
                        }
                        else if(hashMapSavedStates[key] != null){
                            if(hashMapSavedStates[key].root[name] != null)
                                delete hashMapSavedStates[key].root[name];
                        }
                    }        
                                      
                }
                if(tmp.root["all"] == null){
                    for(var key in tmp.root){
                        if(hashMapStates[key] != null){
                            if(hashMapStates[key].bindings[name] != null)
                                delete hashMapStates[key].bindings[name];
                        }
                    }
                }
                
                delete hashMapStates[name];
                delete tmp;
            }
            else{
                assert(false, "warning : state : "+name+" does'nt exist !!!")
                return;
            }
        }
        
        __g__.setUseless = function(nameState, value)
        {
            if((value != true) && (value != false))
            {
                assert(false, "bad value !!!");
                return -1;
            }
             
            if(hashMapStates[nameState] != null)
            {
                hashMapStates[nameState].useless = value
            }
            else
            {
                assert(false, "state doesn't exist !!!")
                return -1;
            }
        }
        
        __g__.setFromAll = function(nameState, value)
        {
            
            var stateTmp = hashMapStates[nameState];
            
            if(stateTmp != null){        
                if(value === true)
                {
                    if(stateTmp.root["all"] == null)
                    {
                        var tmp =  stateTmp.root;
                        
                        //console.log("tmp : ", tmp)
                        
                        for(var key in tmp){
                            if(hashMapStates[key] != null){
                                if(hashMapStates[key].bindings != null)
                                    if(hashMapStates[key].bindings[nameState] != null)
                                       delete hashMapStates[key].bindings[nameState];
                            }
                        }
                        
                        stateTmp.root = new Object(); //reinitialise hashtab if it was not empty
                        stateTmp.root["all"] = true;
                    }
                }
                else if(value === false){
                    if(stateTmp.root["all"] != null)
                    {
                        delete stateTmp.root["all"]
                    }           
                }
            }
            else{
                assert(false, "state : "+nameState+" doesn't exist !!!")
                return;
            }
        }
        
        __g__.addBinding = function(stateSource, stateDest)
        { 
            
            var stateSourceTmp = null;
            var stateDestTmp = null;
            
            
            if(hashMapStates[stateSource] != null)
            {                
                stateSourceTmp = hashMapStates[stateSource];
                 
            }/*else if(hashMapSavedStates[stateSource] != null)
            {
                assert(false, "Warning : your stateSource : "+stateSource+" have an instance created in binding "
                +"hashmap but isn't created in the main hashmap. Don't forgive use 'addEventState' or 'addState' to add it.");
                stateSourceTmp = hashMapSavedStates[stateSource];
            }*/
            
            if(hashMapStates[stateDest] != null)
            {                
                stateDestTmp = hashMapStates[stateDest];
                 
            }/*else if(hashMapSavedStates[stateDest] != null)
            {
                assert(false, "Warning : your stateDest : "+stateDest+" have an instance created in binding "
                +"hashmap but isn't created in the main hashmap. Don't forgive use 'addEventState' or 'addState' to add it.");
                stateDestTmp = hashMapSavedStates[stateDest];
            }*/
            
            if((stateSourceTmp != null) && (stateDestTmp != null))
            {
               if(stateDestTmp.fromAll != true){
                   stateSourceTmp.bindings[stateDest] = true;
                   stateDestTmp.root[stateSource] = true;
               }
               assert(true, "links correctly added");
            }
            else
            {
                assert(false, "one of the state don't exist")
                return;
            }
            
        }
        
        return __g__;
    }
    TP.StateGraph = StateGraph;
})(TP);