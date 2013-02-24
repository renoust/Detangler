(function(){
var Context = function() {
		var __g__ = this;
	
        // initialization of the communication address and port        
        // an additional default json file
        this.tulip_address = "http://localhost:8085";
        this.json_address = "./cluster1.json";

        // initialization of the default svg parameters
        this.width = 960;
        this.height = 500;
         
        // initialization of the svg frames
        this.svg_substrate = d3.select("body").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("id", "svg_substrate");
        this.svg_catalyst = d3.select("body").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("id", "svg_catalyst");
        this.svg_combined = d3.select("body")/*svg_i*/.append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("id", "svg_combined");

        // initialization of the graphs, and lasso interactors
        this.graph_substrate = new graph();
        this.graph_catalyst = new graph();
        this.graph_combined = new graph();
        this.lasso_catalyst = null;
        this.lasso_substrate = null;
        this.lasso_combined = null;

        // initialization of the selection and move modes
        this.select_mode_substrate = false;
        this.move_mode_substrate = true;
        this.show_labels_substrate = true;
        this.show_links_substrate = true;
        this.node_information_substrate = false;
        this.select_mode_catalyst = false;
        this.move_mode_catalyst = true;
        this.show_labels_catalyst = true;
        this.show_links_catalyst = true;
        this.node_information_catalyst = false;
        this.mouse_over_button = false;
        this.select_mode_combined = false;
        this.move_mode_combined = true;
        this.show_labels_combined = true;
        this.show_links_combined = true;
        this.node_information_combined = false;
        this.combined_foreground = "substrate";
        
        // initialization of the global entanglement parameters
        this.catalyst_sync_operator = "AND";
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

        this.sessionSid = 0;
        
        this.substrateProperties = {};
        this.substrateWeightProperty = null;
		
		return __g__;		
}
    return {Context:Context}
})()
