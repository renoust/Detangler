//pile de gestion d'Etat

var TP = TP || {};
(function () {


    var StatesChange = function () {

        var __g__ = this;

        //var pile = {avant : null, name : null, operation : null, apres : null};

        var first = {avant: null, name: "base", undo: null, redo: null, apres: null };
        var current = first;

        this.addChange = function (nameC, undoFunc, redoFunc) {

            pileTMP = {avant: null, name: nameC, undo: undoFunc, redo: redoFunc, apres: null };


            if (current != null) {

                pileTMP.avant = current;
                current.apres = pileTMP;
                current = pileTMP;

            }

            console.log(current.name);
            console.log(current.undo);
            console.log(current.redo);

            /*
             else{

             first = pileTMP;
             current = pileTMP;
             }*/
        }


        this.undo = function () {
            //assert(current == null, "pas d'état courant");
            //assert(current.operation == null, "pas d'operation sur etat courant");

            if (current.undo != null) {

                current.undo();
                if (current.avant != null)
                    current = current.avant;

            }

            console.log("undo : " + current.name);
        }

        this.redo = function () {

            //assert(current == null, "pas d'état courant");
            //assert(current.operation == null, "pas d'operation sur etat courant");


            if (current.apres != null)
                current = current.apres;

            if (current.redo != null)
                current.redo();


            console.log("redo : " + current.name);
        }
        /*
         this.afficher = function(target)
         {
         console.log("pile de " + target + " :")
         console.log(current);

         }*/

        return __g__;
    }

    TP.StatesChange = StatesChange;
})(TP);
