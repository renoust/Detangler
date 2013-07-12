//pile de gestion d'Etat

var TP = TP || {};
(function () {


    var States = function () {

        var __g__ = this;

        //var pile = {avant : null, name : null, operation : null, apres : null};

        var first = null;
        var current = null;

        this.addState = function (nameS, operationS) {

            pileTMP = {avant: null, name: null, operation: null, apres: null };

            pileTMP.name = nameS;
            pileTMP.operation = operationS;

            if (current != null) {

                pileTMP.avant = current;
                current.apres = pileTMP;
                current = pileTMP;

            }
            else {

                first = pileTMP;
                current = pileTMP;
            }
        }


        this.executeCurrentState = function () {
            //assert(current == null, "pas d'état courant");
            //assert(current.operation == null, "pas d'operation sur etat courant");

            if (current != null && current.operation != null)
                current.operation.executeState();

            console.log("current : " + current.name)
        }

        this.backState = function () {

            //assert(current == null, "pas d'état courant");
            //assert(current.operation == null, "pas d'operation sur etat courant");

            if (current != null && current.operation != null) {
                var tmp = current;
                if (tmp != null)
                    tmp.operation.deleteState();
                current = tmp.avant;
                console.log("current : " + current.name);
                if (current == null)
                    first = null;
            }

        }

        this.afficher = function (target) {
            //console.log("pile de " + target + " :")
            //console.log(current);

        }

        return __g__;
    }

    TP.States = States;
})(TP);
