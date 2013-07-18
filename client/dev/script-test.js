/************************************************************************
 * This module contains the calls of the functions that creates Jquery-ui
 * elements.
 * @authors Anne Laure Mesure
 * @created March 2013
 ***********************************************************************/
/*

$("#menu1-content").accordion({
    collapsible: true,
    active: false
});

$("input[type=spinner]").spinner();

$(".slider").slider({
    range: true,
    min: 0,
    max: 500,
    values: [ 75, 300 ],

});


$("#menu").menu({
    position: {using: positionnerSousMenu}
});

//remplace la flèche droite par la flèche bas pour les menus de premier niveau
$("#menu > li > a > span.ui-icon-carat-1-e").removeClass("ui-icon-carat-1-e").addClass("ui-icon-carat-1-s");
function positionnerSousMenu(position, elements) {
    var options = { of: elements.target.element };
    if (elements.element.element.parent().parent().attr("id") === "menu") {
        //le menu à positionner est de niveau 2:
        //on va superposer le point central du haut du menu sur le point central bas du menu parent
        options.my = "center top";
        options.at = "center bottom";
    } else {
        // le menu à positionner est de niveau >  2
        //le positionnement reste celui par défaut : on va superposer le coin haut gauche et le coin haut droit du menu parent
        options.my = "left top";
        options.at = "right top";
    }
    elements.element.element.position(options);
};