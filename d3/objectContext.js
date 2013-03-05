
(function()
{

	import_class('tools.js', 'TOOL');
	import_class('context.js', 'TP');
	
	import_class('TulipPosyVisualization.js', 'TP');
	import_class('TulipPosyInteraction.js', 'TP');
	import_class('TulipPosyInterface.js', 'TP');
	import_class('TulipPosyClient.js', 'TP');
	import_class('TulipPosyInteractionCallbacks.js', 'TP');
	
	var ObjectContext = function()
	{
			//forcing ObjectContext to be singleton, instanciated once 
			if (ObjectContext.prototype._singletonInstance ) {
		      return ObjectContext.prototype._singletonInstance;
		    }
		    
		    ObjectContext.prototype._singletonInstance = this;
			
			//object's variables
	
			var __g__ = this;
		
			var context = TP.Context();
			
			this.TulipPosyClientObject = new TP.TulipPosyClient();
			this.TulipPosyVisualizationObject = new TP.TulipPosyVisualization();
			this.TulipPosyInterfaceObject = new TP.TulipPosyInterface();
			this.TulipPosyInteractionObject = new TP.TulipPosyInteraction();
			this.TulipPosyInteractionCallbacksObject = new TP.TulipPosyInteractionCallbacks();
			this.ToolObject = new TOOL.Tools();
	
			return __g__;
			
	}
	
    return {ObjectContext:ObjectContext};
})()
