var ObjectContext = function(contexte)
{

	//object's variables

		var __g__ = this;
	
		var context = contexte;
		
		this.TulipPosyClientObject = new TulipPosyClient(context, this);
		this.TulipPosyVisualizationObject = new TulipPosyVisualization(context, this);
		this.TulipPosyInterfaceObject = new TulipPosyInterface(context, this);
		this.TulipPosyInteractionObject = new TulipPosyInteraction(context, this);
		this.ToolObject = new Tools(context, this);
		
		return __g__;
		
}
