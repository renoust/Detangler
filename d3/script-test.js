/************************************************************************
 * This module contains the calls of the functions that creates Jquery-ui 
 * elements.
 * @authors Anne Laure Mesure
 * @created March 2013
 ***********************************************************************/



/*
$(document).ready(function(){


    // Variables
    var objMain = $('#wrap');

    // Show sidebar
function showSidebar(menuNum){
        objMain[0].className="sidebar-"+menuNum;
        $('#menu-'+menuNum)[0].style.cssText='z-index:101;'; 
    }

    // Hide sidebar
    function hideSidebar(menuNum){
        objMain[0].className="nosidebar";
        $('#menu-'+menuNum)[0].style.cssText='left:-225; z-index:0;'; 
        

    }

    $('span').click(function(e){
        //var button = event.srcElement.id;
        var menu = event.srcElement.parentNode;
        var menuNum = menu.id.split('-')[1];

        if(menu.parentNode.className==='nosidebar'){
            console.log('ok');
            showSidebar(menuNum);
        } else {hideSidebar(menuNum)}

    });

});

*/
/*
var wrap = $('#wrap')[0];
var menuNum = 2;

var menu = document.createElement("div");
        //menu.style.cssText="color:'red';";
//console.log(menu);
$('#wrap')[0].appendChild(document.createElement("div"));
console.log(menu);*/

    //var wrap = $('#wrap')[0];


//var menu = document.createElement("div");
 //       menu.style.cssText="color:'red';";
//console.log(menu);
//$('#wrap')[0].appendChild(menu);
//menu.style.cssText="color:'red';";
//menu.className("cont");
//console.log(menu);
//    $('#wrap')[0].appendChild(document.createElement("div"))

/*this.createPane(){
    contxt.menuNum++;
    $("<div/>", {
        "class": "cont",
        id: "menu-"+menuNum,
        text: "Click me!",
        style:"left:-225; z-index:0;",
    }).appendTo("#wrap");

    $("<span/>", {
        "class": "toggleButton",
        id: "toggleBtn"+menuNum,
        text: ">",
        style:"top:"+15*menuNum+"px;",
    }).appendTo("#menu-"+menuNum);
}*/
//objectReferences.InterfaceObject.createMenu(3);
//objectReferences.InterfaceObject.addPane();
//objectReferences.InterfaceObject.addPane();
//objectReferences.InterfaceObject.addPane();
/*
$(document).ready(function(){


            // Variables
            var objMain = $('#wrap');

            // Show sidebar
        function showSidebar(menuNum){
                objMain[0].className="sidebar-"+menuNum;
                $('#menu-'+menuNum)[0].style.cssText='z-index:101;'; 
            }

            // Hide sidebar
            function hideSidebar(menuNum){
                objMain[0].className="nosidebar";
                $('#menu-'+menuNum)[0].style.cssText='left:-225; z-index:0;'; 
                

            }


            $('span').click(function(e){
                //var button = event.srcElement.id;
                var menu = event.srcElement.parentNode;
                var menuNum = menu.id.split('-')[1];
console.log(menuNum);
                if(menu.parentNode.className==='nosidebar'){
                    console.log('ok');
                    showSidebar(menuNum);
                } else {hideSidebar(menuNum)}

            });

        });*/

