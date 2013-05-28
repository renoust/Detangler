/************************************************************************
 * This module contains references to global objects
 * @authors Fabien Gelibert
 * @created May 2012
 ***********************************************************************/

(function () {

    import_class('tools.js', 'TOOL');
    import_class('context.js', 'TP');

    import_class('Visualization.js', 'TP');
    import_class('Interaction.js', 'TP');
    import_class('Interface.js', 'TP');
    import_class('Client.js', 'TP');
    import_class('UpdateViews.js', 'TP');

    var ObjectReferences = function () {
        //forcing ObjectReferences to be singleton, instanciated once 
        if (ObjectReferences.prototype._singletonInstance) {
            return ObjectReferences.prototype._singletonInstance;
        }

        ObjectReferences.prototype._singletonInstance = this;

        var __g__ = this;

        var context = TP.Context();

        this.ClientObject = new TP.Client();
        this.VisualizationObject = new TP.Visualization();
        this.InterfaceObject = new TP.Interface();
        this.InteractionObject = new TP.Interaction();
        this.UpdateViewsObject = new TP.UpdateViews();
        this.ToolObject = new TOOL.Tools();

        return __g__;
    }

    return {ObjectReferences: ObjectReferences};
})()