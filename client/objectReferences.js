/************************************************************************
 * This module contains references to global objects
 * @authors Fabien Gelibert
 * @created May 2012
 ***********************************************************************/

var TP = TP || {};
(function () {


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
        this.ToolObject = new TP.Tools();

        return __g__;
    }

    TP.ObjectReferences = ObjectReferences;
})(TP);