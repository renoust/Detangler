/************************************************************************
 * This module contains the calls of the functions that creates Jquery-ui 
 * elements.
 * @authors Anne Laure Mesure
 * @created March 2013
 ***********************************************************************/

$(function() {
    $( "#menu1-content" ).accordion({
        collapsible:true,
        active:false
    });

    $( "input[type=spinner]" ).spinner();
});
