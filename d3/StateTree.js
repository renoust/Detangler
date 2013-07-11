//pile de gestion d'Etat

(function () {

    import_class('Interaction.js', 'TP')
    import_class('assert.js', 'TP')
    import_class("Client.js", "TP")
    import_class("lasso.js", 'TP')
    import_class("BarChart.js", 'TP')

    var StateTree = function () {

        var __g__ = this;

        var hashTabNode = new Object();
        var rootP = {};

        __g__.getStateTree = function () {
            return hashTabNode;
        }

        __g__.getRoot = function () {
            return rootP;
        }

        __g__.getInfoState = function (name) {
            if (hashTabNode[name] !== undefined || hashTabNode[name] !== null) {
                return hashTabNode[name];
            }
            else
                return null;
        }

        __g__.enableState = function (state) {
            hashTabNode[state].activate = true;
        }

        __g__.disableState = function (state) {
            hashTabNode[state].activate = false;
        }


        __g__.addState = function (node, nodeRoot, useless, activate) // nodeRoot is present for special root like "all", "principal" (message from principal controller) or "otherController" (message from
            // other controller). useless specifies if the node must be register as currentState in State's chain or not. For example, if a state
            //doesn't involve any changements about the current state, we don't put it in the state's chain as current State.
        {
            if (node == null || node.name == null) {
                assert(false, "State are no name or there is node object default")
                return;
            }


            if (hashTabNode[node.name] == null) {
                hashTabNode[node.name] = {name: node.name, root: {}, bindings: {}, func: null, specialRoot: false, activate: true, useless: false};
            }

            if (nodeRoot != null) {
                hashTabNode[node.name].specialRoot = true;
                hashTabNode[node.name].root = new Object(); //reinitialise hashtab if it was not empty
                hashTabNode[node.name].root[nodeRoot] = true;
            }

            if (useless != null) {
                hashTabNode[node.name].useless = useless;
            }

            if (activate != null)
                hashTabNode[node.name].activate = activate;

            var tmp = null;
            tmp = node.bindings;
            if (tmp != null) {

                if (Object.getPrototypeOf(node.bindings) == Object.getPrototypeOf([])) {
                    //tmp = node.bindings;

                    //if(tmp != null){

                    var end = tmp.length;

                    for (var key = 0; key < end; key++) {
                        if (tmp[key] != "all") {
                            if (hashTabNode[tmp[key]] == null) {
                                hashTabNode[tmp[key]] = {name: tmp[key], root: {}, bindings: {}, func: null, specialRoot: false, activate: true, useless: false};
                            }

                            if (hashTabNode[node.name].bindings[tmp[key]] === undefined) {
                                hashTabNode[node.name].bindings[tmp[key]] = hashTabNode[tmp[key]];
                                assert(true, "binding with : '" + tmp[key] + "' added")


                                if (hashTabNode[tmp[key]].root[node.name] == undefined && hashTabNode[tmp[key]].specialRoot === false) {
                                    hashTabNode[tmp[key]].root[node.name] = hashTabNode[node.name];
                                    assert(true, "root : '" + node.name + "' added to : '" + tmp[key] + "'")
                                }
                                else
                                    assert(false, "root : '" + node.name + "' already added to : '" + tmp[key] + "' or node is special node")
                            }
                            else
                                assert(false, "warning ! binding with : '" + tmp[key] + "' already exist")
                        }
                        else {
                            hashTabNode[node.name].bindings = new Object();
                            hashTabNode[node.name].bindings[tmp[key]] = null;
                            hashTabNode[node.name].specialRoot = true;
                            break;
                        }
                        //hashTabNode[tmp[key]].bindings[node.name] = hashTabNode[node.name];
                    }
                    //}
                }
                else
                    assert(false, "'node.bindings' must be an array");
            }

            if (node.func != null) {
                if (hashTabNode[node.name].func == null) {
                    hashTabNode[node.name].func = node.func;
                    assert(true, "the function just been associated to the State")
                }
                else
                    assert(false, "one function already associated to the State")
            }
            //}
        }


        return __g__;
    }
    return {StateTree: StateTree};
})()