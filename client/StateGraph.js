//pile de gestion d'Etat

var TP = TP || {};
(function () {

    var StateGraph = function () {

        var __g__ = this;

        var hashMapStates = new Object();
        var hashMapSavedStates = new Object();        
        var saveState = new Object();
        

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
                assert(false, "state already exist !!!")
                return;
            }
            
            if(saveState[node.name] != null){
                delete saveState[node.name];
            }

            if (hashMapStates[node.name] == null) {
                if(hashMapSavedStates[node.name] != null){
                    hashMapStates[node.name] = hashMapSavedStates[node.name];
                    delete hashMapSavedStates[node.name];
                }
                else
                    hashMapStates[node.name] = {name: node.name, root: {}, bindings: {}, func: null, activate: true, useless: false};
            }

                //hashMapStates[node.name].specialRoot = true;
            if(fromAll != null)
            {
                hashMapStates[node.name].root = new Object(); //reinitialise hashtab if it was not empty
                hashMapStates[node.name].root["all"] = true;
            }

            if (useless != null) {
                hashMapStates[node.name].useless = useless;
            }

            if (activate != null)
                hashMapStates[node.name].activate = activate;

            var tmp = null;
            tmp = node.bindings;
            
            if (tmp != null) {

                if (Object.getPrototypeOf(node.bindings) == Object.getPrototypeOf([])) {
                    //tmp = node.bindings;

                    //if(tmp != null){

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
                    //}
                }
                else
                    assert(false, "'node.bindings' must be an array");
            }

            if (node.func != null) {
                if (hashMapStates[node.name].func == null) {
                    hashMapStates[node.name].func = node.func;
                    //assert(true, "the function just been associated to the State")
                }
                else
                    assert(false, "one function already associated to the State")
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

                saveState[name] = hashMapStates[name];
                delete hashMapStates[name];

                if(saveState[name].bindings["all"] == null){

                    for(var key in saveState[name].bindings){
                        if(hashMapStates[key] != null){
                            if(hashMapStates[key].root[name] != null)
                                delete hashMapStates[key].root[name];
                        }
                        else if(saveState[key] != null){
                            if(saveState[key].root[name] != null)
                                delete saveState[key].root[name];
                        }
                    }
                }
            }
            else{
                assert(false, "state does'nt exist !!!")
                return;
            }
        }


        __g__.goBackState = function(name)
        {
            var bindings = new Array();
            var node = null;
            var fromAll = null;
            var useless = null;
            var activate = null;

            if(saveState[name] != null){

                for(var key in saveState[name].bindings)
                    bindings.push(key);				

                node = {name:saveState[name].name, bindings:bindings, func:saveState[name].func}
/*
                if(saveState[name].specialRoot == true){
                    nodeRoot = (saveState[name].root["all"] != null) ? "all":null;
                }
                else
                    nodeRoot = null;
*/
                useless = saveState[name].useless;

                activate = saveState[name].activate;

                console.log("node : ",node, "useless : ",useless, "activate : ", activate);

                var tmp = saveState[name]; //because saveState[name] is deleted in addState;

                __g__.addState(node, fromAll, useless, activate);

                if(hashMapStates[name] != null){
                    for(var key in tmp.root)
                        hashMapStates[name].root[key] = tmp.root[key];

                    delete tmp;
                }
                else{
                    assert(false, "problem with State adding");
                }
                
            }
            else{
                assert(false, "state does'nt exist")
            }
        }

        
        __g__.isUseless = function(nameState, value)
        {
            if((value != true) || (value != false))
            {
                assert(false, "bad value !!!");
                return -1;
            }
             
            if(hashMapStates[nameState] != null)
            {
                hashMapStates[nameState].useless = value
            }
        }
        

        return __g__;
    }
    TP.StateGraph = StateGraph;
})(TP);