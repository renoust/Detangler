/************************************************************************
 * This module implements the concept of "View". It associates the svg
 * graphs with their corresponding html elements.
 * @authors Fabien Gelibert, Anne Laure Mesure, Guillaume Guerin
 * @created March 2013
 ***********************************************************************/

import_class('context.js', 'TP');
import_class("objectReferences.js", "TP");

var View = function (bouton, svgs, target, application) {

	assert(bouton != null && svgs != null && target != null && application != null, "parametres ok!");
    var __g__ = this;

    var contxt = TP.Context();

    var objectReferences = TP.ObjectReferences();
    var svg = svgs;

    elem = document.getElementById("bouton" + target);
    if (elem)
        elem.parentNode.removeChild(elem);

    elem = $("div[aria-describedby='zone" + target + "']");
    if (elem)
        elem.remove();

	$("#container").empty();

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
                console.log("ajout bouton");
            }
        }
    });


    /**************************
     * Views
     **************************/

    document.getElementById("container").innerHTML += "<div id='zone" + target + "' title='" + target + "' ></div>";


    //add the windows
    $(function () {
        var targettop, targetright;
        if(target==="substrate")
            {targettop=43;targetright=260;}
        else if(target==="catalyst")
            {targettop=43;targetright=10;}
        else {targettop=295;targetright=260;}
        $("[id=zone" + target + "]")
            .dialog({
                height: contxt.dialogHeight,
                width: contxt.dialogWidth,
                position: "right-"+ targetright + " top+" + targettop ,
                resize: function( event, ui ) {contxt.height = ui.size.height-50; contxt.width = ui.size.width-30;}
            });
    });

    $(document)
        .ready(function () {
            $('.ui-dialog').draggable("option", "containment", '[id=container]');
    });

    var dialog = $("[id='zone" + target + "']");
    var titlebar = dialog.parents('.ui-dialog').find('.ui-dialog-titlebar');

    $('<button>-</button>')
        .appendTo(titlebar)
        .click(function() {
            dialog.toggle();
    });
    $('<button>move</button>')
        .appendTo(titlebar)
        .click(function(){
            objectReferences.InterfaceObject.toggleSelectMove(target);
        });
    $('<button>select</button>')
        .appendTo(titlebar)
        .click(function(){
            objectReferences.InterfaceObject.toggleSelectMove(target);
        });


    this.add = function () {

        var accordDiv = d3.select("#" + target)
            .append("div")
            .attr("id", "bouton" + target);

        var num = 0;


        while (num < bouton.length) {
            console.log(num);
            var i = num;
            var j = 0 + i;
            var bout = application[target].Boutton.create({
                idButton: bouton[i][0],
                fonction: bouton[i][2]
            });
            application[target].testArrayController.addFunction(bout);
            (function (i) {

                var accordDivB = accordDiv.append("div");

                accordDivB.append("input")
                    .attr("type", "button")
                    .attr("class", "button")
                    .attr("value", bouton[i][1])
                    .on("click", function () {
                    application[target].testArrayController
                        .loadFunction("idButton", bouton[i][0]);
                });
            })(i);

            num++;
        }

        if (target == 'substrate') {
			$("#zoneEntanglement").empty();
			document.getElementById("zoneEntanglement")
                .innerHTML += "<div id='entanglement'></div>";
            document.getElementById("entanglement")
                .innerHTML += "<h2>Entanglement:</br><ul type='none'><li>Intensity: "
                    +contxt.entanglement_intensity+"</br></li><li>Homogeneity: "
                    +contxt.entanglement_homogeneity+"</li></ul></h2>";
            objectReferences.InterfaceObject.addInfoButton(target);
            objectReferences.InterfaceObject.addSettingsButton();
            objectReferences.InteractionObject.createLasso(target);
            objectReferences.InteractionObject.addZoom(target);

        }
        if (target == 'catalyst') {
            objectReferences.InterfaceObject.addInfoButton(target);
            objectReferences.InteractionObject.createLasso(target);
            objectReferences.InteractionObject.addZoom(target);
                     //TP.ObjectReferences().VisualizationObject.arrangeLabels(target);

        }
        if (target == 'combined') {
            objectReferences.InteractionObject.createLasso(target);
            objectReferences.InteractionObject.addZoom(target);
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
/*
		var tabContext = [];
		
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
  	}

//utilisé pour test nombre View
	


    return __g__;

}
