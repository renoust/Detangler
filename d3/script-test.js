/************************************************************************
 * This module contains the calls of the functions that creates Jquery-ui 
 * elements.
 * @authors Anne Laure Mesure
 * @created March 2013
 ***********************************************************************/

$(function () {
    $("[id=menu]")
        .accordion({
        fillSpace: 'true',
        containment: 'parent',
        collapsible: 'true',
        heightStyle: "content",
        autoHeight: 'false'
    });
});

$(function() {
    $( "#tabs" ).tabs();
});
