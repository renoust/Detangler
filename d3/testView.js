/************************************************************************
 * This module is used to test the view module
 * @authors Fabien Gelibert
 * @created May 2012
 ***********************************************************************/

import_class("context.js", "TP");
import_class("objectReferences.js", "TP");


var testView = function (nbView, nbBouton) {

    var __g__ = this;

    var objectReferences = TP.ObjectReferences();
    var contxt = TP.Context();

    var target = "View"
    var button = "button";

    $("#menu").empty();

    for (j = 0; j < nbView; j++) {
        document.getElementById("menu").innerHTML += "<h3  margin-left='10px'>"
            + target + j + "</h3><p id='" + target + j + "'></p>";
        ;
    }

    $("[id=menu]").accordion("refresh");

    for (i = 0; i < nbView; i++) {


        var tab = new Array();

        for (j = 0; j < nbBouton; j++) {
            tab[j] = new Array(j, button + j + target + i,
                function () {
                });
        }

        new View(tab, new Array("svg", 960, 500, target + i), target + i,
            contxt.application, i);
    }

    return __g__;

}
