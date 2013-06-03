/************************************************************************
 * This module implements the concept of "View". It associates the svg
 * graphs with their corresponding html elements.
 * @authors Fabien Gelibert, Anne Laure Mesure, Guillaume Guerin
 * @created March 2013
 ***********************************************************************/

(function () {

import_class('context.js', 'TP');
import_class("objectReferences.js", "TP");
import_class('stateSelect.js','TP');

var View = function (bouton, svgs, target, application) {

	//assert(bouton != null && svgs != null && target != null && application != null, "parametres ok!");
    var __g__ = this;
    var contxt = TP.Context();
    var objectReferences = TP.ObjectReferences();
    var svg = svgs;

    elem = document.getElementById("bouton" + target);
    if (elem) elem.parentNode.removeChild(elem);
    elem = $("div[aria-describedby='zone" + target + "']");
     //console.log(elem)
    if (elem)elem.remove();

    
    //console.log($("div[aria-describedby='zone"+target+"']"))
    //console.log($("div[aria-describedby='zoneBarChart_substrate']"))
   
    //if (elem!=[])elem.remove();

	//$("#container").empty();

    /**************************
     * Application
     **************************/
    application[target] = Em.Application.create();

    /**************************
     * Models
     **************************/

    application[target].Boutton = Em.Object.extend({
        idButton: '',
        fonction: ''
    });


    /**************************
     * Controllers
     **************************/

    application[target].testArrayController = Em.ArrayController.create({
        content: [],

        loadFunction: function (propName, value) {
            var obj = this.findProperty(propName, value);
            obj.fonction();
        },

        addFunction: function (object) {
            var obj = this.findProperty("idButton", object.idButton);
            if (obj == null) {
                this.pushObject(object);
                //console.log("ajout bouton");
            }
        }
    });


    /**************************
     * Views
     **************************/

    contxt.activeView = target;
    //console.log('-->'+target);

    if(target==="substrate")    { contxt.dialogTop=0;  contxt.dialogRight=600; }
    else if(target==="catalyst"){ contxt.dialogTop=0;  contxt.dialogRight=100; }
    else                        { contxt.dialogTop=235; contxt.dialogRight=260; }


    /****  création du dialog ****/
    //document.getElementById("container").innerHTML += "<div id='zone" + target + "' title='" + target + "' ></div>";

     $("<div/>", {id: "zone"+target, title: target}).appendTo("html");

    var dialog = $("[id=zone" + target + "]");
    //console.log(dialog);

    dialog.dialog({
        height: contxt.dialogHeight,
        width: contxt.dialogWidth,
        minWidth:185,
        position: "right-"+ contxt.dialogRight + " top+" + contxt.dialogTop ,/*{my: "center", at: "center", of: "#container"}*/
    }).parent().resizable({
        containment: "#container"
    }).draggable({
        containment: "#container",
        opacity: 0.70
    });

    /****   en-tête du dialog   ****/

    var titlebar = dialog.parents('.ui-dialog').find('.ui-dialog-titlebar');
    $("<button/>", {text:"-"}).appendTo(titlebar).button().click(function() {dialog.toggle();});        
    $("<button/>", {id: "toggle"+target, text:"Move"}).appendTo(titlebar); 

    $('#toggle' + target).button().click (function(event){
        var interact = $(this).button("option","label");
        if (interact=="Move")   { $(this).button("option", "label", "Select");}
        else                    { $(this).button("option", "label", "Move");}
        contxt.stateStack[target].executeCurrentState();
    });





    dialog.parent().appendTo("#container")
    dialog.parent().click(function(){ 
        contxt.activeView = target;
    
        var num = 0;
        $(".arrayButtons").remove();
        $('#menu1-content').remove()
        $('<div/>', {id:'menu1-content'}).appendTo('#menu-1')
        $('#menu1-content').accordion()
        /*var pane = d3.select('#menu-1').append("div")
            .attr("id", "button" + target)
            .attr('class','arrayButtons');*/
            console.log(bouton)
        createArrayButtons(bouton);

        /*while (num < bouton.length) {
            var i = num;
            var j = 0 + i;
            var bout = application[target].Boutton.create({
                idButton: bouton[i][0],
                fonction: bouton[i][2]
            });
            application[target].testArrayController.addFunction(bout);
            (function (i) {

                var paneB = pane.append("div");
                paneB.append("input")
                    .attr("type", "button")
                    .attr("class", "button")
                    .attr("value", bouton[i][1])
                    .on("click", function () {
                    application[target].testArrayController.loadFunction("idButton", bouton[i][0]);
                });
            })(i);
            num++;
        }*/
        $.jPicker.List[0].color.active.val('hex', eval("contxt.nodeColor_"+target));
        $.jPicker.List[1].color.active.val('hex', eval("contxt.linkColor_"+target));
        $.jPicker.List[2].color.active.val('hex', eval("contxt.bgColor_"+target));
        $.jPicker.List[3].color.active.val('hex', contxt.labelColor);


        //var cGraph = contxt.getViewGraph(target);
        objectReferences.InterfaceObject.addInfoButton(target);


    });

    titlebar.dblclick(function() {
        if(target==="substrate")    { contxt.dialogTop=26;  contxt.dialogRight=600; }
        else if(target==="catalyst"){ contxt.dialogTop=26;  contxt.dialogRight=100; }
        else                        { contxt.dialogTop=240; contxt.dialogRight=260; }

        var fullheight = $('#container').height()-10;
        var fullwidth = $('#container').width()-10;
        console.log(dialog.parent().width() + " - " + fullwidth);
        console.log(dialog.parent());
        if(dialog.parent().width()!=fullwidth){
            console.log(1);
            dialog.dialog({
                width:fullwidth, 
                height:fullheight,
                position: ["left+"+15, "top+"+27] ,
            });
        }
        else{
            console.log(2);
            dialog.dialog({
                width:contxt.dialogWidth, 
                height:contxt.dialogHeight,
                position: "right-"+ contxt.dialogRight + " top+" + contxt.dialogTop ,
            });
        }
        console.log(contxt.dialogTop);

            //$(this).height()=fullheight;
    });

    this.add = function () {
        if(target != null){
            if (target == 'substrate') {
                objectReferences.InterfaceObject.addSettingsButton();
                objectReferences.InteractionObject.createLasso(target);
                objectReferences.InteractionObject.addZoom(target);
                objectReferences.InterfaceObject.addEntanglementFeedback(target);
            }
            if (target == 'catalyst') {
                objectReferences.InteractionObject.createLasso(target);
                objectReferences.InteractionObject.addZoom(target);
            }
            if (target == 'combined') {
                objectReferences.InteractionObject.createLasso(target);
                objectReferences.InteractionObject.addZoom(target);
            }
            contxt.stateStack[target].addState('select', new TP.stateSelect(target));
            contxt.stateStack[target].executeCurrentState();
        }
    }




    
    if (svg[0] == "svg") {
        if (target == 'substrate') {

            contxt.svg_substrate = d3.select("#zone" + target)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("id", svg[3]);
                //.attr("viewBox", "0 0 500 600");

            contxt.graph_substrate = new TP.Graph();

           
            this.add(bouton);
        }
        if (target == 'catalyst') {
            contxt.svg_catalyst = d3.select("#zone" + target)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("id", svg[3])
                //.attr("viewBox", "0 0 500 600");

            contxt.graph_catalyst = new TP.Graph();

            this.add(bouton);

        }
        if (target == 'combined') {
            contxt.svg_combined = d3.select("#zone" + target)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("id", svg[3])
                //.attr("viewBox", "0 0 500 600");
            contxt.graph_combined = new TP.Graph();
            this.add(bouton);
        }
    }
   


     $("#zone"+target).parent().appendTo("#container")



    
   
  /*      var tabContext = [];
		
		var svgvar = "svg_"+ target;
		var graphvar = "graph_"+ target;
			
		tabContext[svgvar] = d3.select("#zone"+target).append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("id", svg[3])
			.attr("viewBox", "0 0 500 600");
		
		tabContext[graphvar] = new TP.Graph();

		this.add(bouton); 
*/
  	

//utilisé pour test nombre View
	


    return __g__;

}
return {View: View};
})()