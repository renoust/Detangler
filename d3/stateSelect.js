(function () {

    import_class("objectReferences.js", "TP");

    var stateSelect = function (args) {

        var __g__ = this;

        var objectReferences = TP.ObjectReferences();
        var argument = args;

        this.executeState = function () {

            objectReferences.InterfaceObject.toggleSelectMove(args);

        }


        this.deleteState = function () {

            //objectReferences.InterfaceObject.toggleSelectMove(args); //juste pour les test de la pile

        }


        return __g__;
    }

    return {stateSelect: stateSelect};

})()
