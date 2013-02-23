import_class('tools.js', 'TOOL');
import_class('TulipPosyVisualization.js', 'TP');
import_class('TulipPosyInteraction.js', 'TP');
import_class('TulipPosyInterface.js', 'TP');
import_class('TulipPosyClient.js', 'TP');

var ObjectContext = function(contexte)
{

	//object's variables

		var __g__ = this;
	
		var context = contexte;
		
		this.TulipPosyClientObject = new TP.TulipPosyClient(context, this);
		this.TulipPosyVisualizationObject = new TP.TulipPosyVisualization(context, this);
		this.TulipPosyInterfaceObject = new TP.TulipPosyInterface(context, this);
		this.TulipPosyInteractionObject = new TP.TulipPosyInteraction(context, this);
		this.ToolObject = new TOOL.Tools(context, this);
		
		return __g__;
		
}
