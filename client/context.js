/************************************************************************
 * This module contains all the global variables the application needs
 * @authors Fabien Gelibert
 * @created February 2013
 ***********************************************************************/

var TP = TP || {};
(function () {


    var Context = function () {
        var __g__ = this;

        //forcing context to be singleton, instanciated once 
        if (Context.prototype._singletonInstance) {
            return Context.prototype._singletonInstance;
        }

        __g__.controller = new TP.Controller();

        __g__.viewMeter = 0;

        Context.prototype._singletonInstance = __g__;
        __g__.view = {};

        // initialization of the communication address and port        
        // an additional default json file
        __g__.tulip_address = document.URL;
        __g__.json_address = "./data/cluster1.json";


        //URLparameters = document.URL.split("?")[1]
        indexGURL = document.URL.indexOf("graphurl=")
        if(indexGURL !=-1)
        {
            URLaddress = document.URL.substring(indexGURL+9)
            if (URLaddress.indexOf("?") !=-1)
            {
                console.log("appending")
                __g__.json_address = URLaddress+"&callback=?";
            }else{
                __g__.json_address = URLaddress+"?callback=?";
            }
        }
        /*
        if (URLparameters)
            URLparameters = URLparameters.split("&")

        if (URLparameters && URLparameters.length >0)
        {
            for (i in URLparameters)
            {
                wparam = URLparameters[i].split('=');
                if (wparam.length >0)
                {
                    if (wparam[0] == "graphurl")
                    {
                        if (wparam[1].indexOf("?") !=-1)
                        {
                            console.log("appending")
                            __g__.json_address = wparam[1]+"&callback=?";
                        }else{
                            __g__.json_address = wparam[1]+"?callback=?";
                        }
                    }
                }
            }
        }*/

        // initialization of the default svg parameters
        __g__.dialogWidth = 460;
        __g__.dialogHeight = 460;
        __g__.width = __g__.dialogWidth - 30;
        __g__.height = __g__.dialogHeight - 50;

        // initialization of the svg frames
        __g__.tabGraph = [];

        //substrate by default
        __g__.activeView = "substrate";

        __g__.stateStack = [];

        __g__.changeStack = new TP.StatesChange();

        __g__.mouse_over_button = false;
        //__g__.combined_foreground = "substrate";

        // initialization of the global entanglement parameters        
        __g__.tabOperator = [];

        __g__.entanglement_intensity = 0.0;
        __g__.entanglement_homogeneity = 0.0;
        __g__.digitPrecision = 9;

        // initialization of default interface visual parameters
        __g__.defaultFillColor = "white";
        __g__.highlightFillColor = "lavender";
        __g__.defaultTextColor = "black";
        __g__.defaultBorderColor = "gray";
        __g__.defaultBorderWidth = .5;
        __g__.defaultTextFont = "Arial";
        __g__.defaultTextSize = 14;

        // initialization of default graph colors
        __g__.defaulNodeColor = "#4682b4";
        __g__.defaultLinkColor = "#C0C0C0";
        __g__.defaultNodeOpacity = 1;
        __g__.defaultLabelOpacity = 1;
        __g__.defaultLinkOpacity = .7;
        __g__.defaultSourceHighlightColor = "";
        __g__.defaultTargetHighlightColor = "";
        __g__.defaultBackgroundColor = "#FFFFFF";
        __g__.defaultLabelColor = "#000000";

        __g__.sessionSid = 0;

		__g__.tulipLayoutAlgorithms = {};
		__g__.tulipDoubleAlgorithms = {};

        __g__.substrateProperties = {};
        __g__.substrateWeightProperty = null;

        //number of pane for the menu
        __g__.menuNum = 1;

        __g__.tabOperator["catalyst"] = "OR";
        __g__.tabOperator[1] = "OR";


        __g__.dataTypes = {none:"NONE",
                           substrate:"SUBSTRATE",
                           catalyst:"CATALYST"
                           }
        
        __g__.viewTypes = {substrate:"SUBSTRATE",
                           catalyst:"CATALYST",
                           barchart:"BARCHART"            
        }
        

        __g__.getViewGraph = function (viewID) {
            return __g__.tabGraph["graph_" + viewID];
        };

        __g__.getIndiceView = function () {
            var tmp = __g__.viewMeter;
            __g__.viewMeter++;
            return tmp;
        };


        __g__.registerView = function (viewInstance)
        {
            var viewID = String(__g__.getIndiceView());
            __g__.view[viewID] = viewInstance;
        }


        __g__.clearInterface = function () {

            if (__g__.menuNum != 1) {

                d3.selectAll(".ui-dialog").remove();
                d3.selectAll(".cont").remove();
                $('#wrap')[0].className = 'sidebar';

                for (var key in __g__.view) {
                    __g__.view[key].remove();
                    __g__.view[key] = null;
                }

                __g__.view = null;
                __g__.view = {};

                __g__.substrateProperties = {};
                __g__.viewMeter = 0;
                __g__.menuNum = 1;
                __g__.tabGraph = null;
                __g__.tabGraph = [];
                __g__.substrateWeightProperty = null;
                __g__.entanglement_intensity = 0.0;
                __g__.entanglement_homogeneity = 0.0;
                __g__.tabOperator = [];
                __g__.tabOperator['catalyst'] = 'OR';
                __g__.changeStack = new TP.StatesChange();
                __g__.stateStack = [];

            }
        }
        
        __g__.updateTulipLayoutAlgorithms = function(layoutList)
        {       
            for (var index in layoutList) {
                key = layoutList[index]
                if (!(key in __g__.tulipLayoutAlgorithms))
                    __g__.tulipLayoutAlgorithms[key] = {}
            }
        }
        
        __g__.updateTulipDoubleAlgorithms = function(doubleList)
        {       
            for (var index in doubleList) {
                key = doubleList[index]
                if (!(key in __g__.tulipDoubleAlgorithms))
                    __g__.tulipDoubleAlgorithms[key] = {}
            }
        }

        
        __g__.initStates = function () {
            //assert(true, "type of controller principal");

            __g__.controller.addEventState("callLayoutSendQuery", function (_event) {/*assert(true, "callLayoutSendQuery");*/
                TP.Client().callLayoutSendQuery(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("selectionSendQuery", function (_event) {/*assert(true, "selectionSendQuery");*/
                TP.Client().selectionSendQuery(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("FloatAlgorithmSendQuery", function (_event) {/*assert(true, "FloatAlgorithmSendQuery");*/
                TP.Client().FloatAlgorithmSendQuery(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("analyseGraphSendQuery",  function (_event) {/*assert(true, "analyseGraphSendQuery");*/
                TP.Client().analyseGraphSendQuery(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("mouseoverInfoBox",  function (_event) {/*assert(true, "mouseoverInfoBox");*/
                TP.Interface().addInfoBox(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("getPlugins",  function(_event){
                TP.Client().getPlugins(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("getPluginsSendQuery",  function(_event){
                TP.Client().getPluginsSendQuery(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("answerGetPlugins",  function(_event){
                TP.Client().answerGetPlugins(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("simpleSelectionMade", function(_event){
                __g__.simpleSelectionReceived(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
        }

        __g__.simpleSelectionReceived = function(_event)
        {
            TP.Interaction().updateViewFromSimpleSelection(_event.associatedData.associated, _event.associatedData.selection);
        }

        __g__.initController = function (ID, typeC) {
            __g__.controller.initController(ID, typeC);
        }

        __g__.getController = function () {
            return __g__.controller;
        }

        return __g__;
    }

    TP.Context = Context;
})(TP);
