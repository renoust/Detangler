/************************************************************************
 * This module contains all the global variables the application needs
 * @authors Fabien Gelibert
 * @created February 2013
 ***********************************************************************/

(function () {

    import_class("graph.js", "TP");
    import_class('States.js', 'TP');
    import_class('StatesChange.js', 'TP');  

    var Context = function () {
        var __g__ = this;

        //forcing context to be singleton, instanciated once 
        if (Context.prototype._singletonInstance) {
            return Context.prototype._singletonInstance;
        }

        Context.prototype._singletonInstance = this;

        this.application = [];
        this.view = [];

        // initialization of the communication address and port        
        // an additional default json file
        this.tulip_address = "http://localhost:8085";
        this.json_address = "./cluster1.json";

        // initialization of the default svg parameters
        this.dialogWidth = 460;
        this.dialogHeight = 460;
        this.width = this.dialogWidth-30;
        this.height = this.dialogHeight-50;

        // initialization of the svg frames

        this.tabSvg = [];
		this.tabGraph = [];

        this.activeView = "substrate";

		this.firstGraph = 'substrate';

        this.stateStack = [];
        
        this.changeStack = new TP.StatesChange();
                
        this.metric_substrate_BC = null;
        this.metric_substrate_SP = null;

        // initialization of lasso interactors
        this.tabLasso = [];

        // initialization of the default colors of the graphs
        
        this.tabNodeColor = [];
        this.tabLinkColor = [];
        this.tabBgColor = [];

        // initialization of the selection and move modes        
        this.tabSelectMode = [];
        this.tabMoveMode = [];
        this.tabShowLabels = [];
        this.tabShowLinks = [];
        this.tabNodeInformation = [];
        
        this.mouse_over_button = false;        
        this.combined_foreground = "substrate";

        // initialization of the global entanglement parameters
        //this.catalyst_sync_operator = "AND";
        
        this.tabOperator = [];
                
        this.entanglement_intensity = 0.0;
        this.entanglement_homogeneity = 0.0;

        // initialization of default interface visual parameters
        this.defaultFillColor = "white";
        this.highlightFillColor = "lavender";
        this.defaultTextColor = "black";
        this.defaultBorderColor = "gray";
        this.defaultBorderWidth = .5;
        this.defaultTextFont = "Arial";
        this.defaultTextSize = 14;
        //var color = d3.scale.category20();

		//Added to get translation values 
		
		this.tabDataTranslation = [];

        this.sessionSid = 0;

        this.substrateProperties = {};
        this.substrateWeightProperty = null;

        //number of pane for the menu
        this.menuNum=1;

        this.getViewSVG = function (viewID) {
                return __g__.tabSvg["svg_"+viewID];
        };


        this.getViewGraph = function (viewID) {
                return __g__.tabGraph["graph_"+viewID];
        };

        return __g__;
    }

    return {Context: Context};
})()
