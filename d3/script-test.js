/************************************************************************
 * This module contains the calls of the functions that creates Jquery-ui 
 * elements.
 * @authors Anne Laure Mesure
 * @created March 2013
 ***********************************************************************/


    $( "#menu1-content" ).accordion({
        collapsible:true,
        active:false
    });

    $( "input[type=spinner]" ).spinner();

$( ".slider" ).slider({ 
    range: true,
    min: 0,
    max: 500,
    values: [ 75, 300 ],
    /*slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
    }*/
});
