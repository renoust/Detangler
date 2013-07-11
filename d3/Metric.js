//pile de gestion d'Etat

(function () {

    import_class("context.js", "TP")

    var Metric = function () {

        var __g__ = this;

        //var pile = {avant : null, name : null, operation : null, apres : null};

        var first = null;
        var current = null;
        var taille = 0;


        __g__.TreatmentAction = function (target, field, specificParam) //specificParams can be an array or a value
        {

            var dataNodes = TP.Context().view[target].getSvg();
            dataNodes = dataNodes.selectAll("g.node").data();

            var paramIsDefine = (specificParam != null) ? true : false

            var intTest = 0;


            if (typeof dataNodes[0][field] == typeof intTest) {
                if (paramIsDefine === true) {
                    if (typeof specificParam === "object") {
                        if (Object.getPrototypeOf(specificParam) == Object.getPrototypeOf([])) {
                            for (var i = 0; i < dataNodes.length; i++) {
                                for (var j = 0; j < specificParam.length; j++)
                                    if ("" + dataNodes[i][field] === "" + specificParam[j])
                                        __g__.addMetric("" + dataNodes[i][field], dataNodes[i]);
                            }
                        }
                    }
                    else {
                        if (typeof specificParam === "string") {
                            for (var i = 0; i < dataNodes.length; i++) {
                                if ("" + dataNodes[i][field] === specificParam)
                                    __g__.addMetric("" + dataNodes[i][field], dataNodes[i]);
                            }
                        }
                    }
                }
                else {
                    for (var i = 0; i < dataNodes.length; i++) {
                        __g__.addMetric("" + dataNodes[i][field], dataNodes[i]);
                    }
                }
            }
            else if (typeof dataNodes[0][field] === "string") {

                var tabTmp = null;

                if (paramIsDefine === true) {
                    if (typeof specificParam === "object") {
                        if (Object.getPrototypeOf(specificParam) == Object.getPrototypeOf([])) {
                            for (var i = 0; i < dataNodes.length; i++) {
                                tabTmp = dataNodes[i][field].split(";");

                                for (var j = 0; j < specificParam.length; j++)
                                    for (var o = 0; o < tabTmp.length; o++)
                                        if ("" + tabTmp[o] === "" + specificParam[j])
                                            __g__.addMetric("" + tabTmp[o], dataNodes[i]);
                            }
                        }
                    }
                    else {
                        if (typeof specificParam === "string") {
                            for (var i = 0; i < dataNodes.length; i++) {
                                tabTmp = dataNodes[i][field].split(";");

                                for (var o = 0; o < tabTmp.length; o++)
                                    if ("" + tabTmp[o] === specificParam)
                                        __g__.addMetric("" + tabTmp[o], dataNodes[i]);
                            }
                        }
                    }
                }
                else {
                    for (var i = 0; i < dataNodes.length; i++) {
                        tabTmp = dataNodes[i][field].split(";");

                        for (var t = 0; t < tabTmp.length; t++)
                            __g__.addMetric("" + tabTmp[t], dataNodes[i]);
                    }
                }
            }
        }


        __g__.addMetric = function (numS, nodee) {

            console.log(nodee)

            pileTMP = {avant: null, numS: null, nombreS: null, apres: null, indice: taille, node: null};
            pileTMP.numS = numS;
            pileTMP.nombreS = 1;
            pileTMP.node = new Array();
            pileTMP.node.push(nodee);


            if (current != null) {

                for (var i = first; i != null; i = i.apres) {
                    if (i.numS === pileTMP.numS) {
                        i.nombreS++;
                        i.node.push(nodee);
                        return;
                    }
                }

                pileTMP.avant = current;
                current.apres = pileTMP;
                current = pileTMP;
                taille++;
            }
            else {

                first = pileTMP;
                current = pileTMP;
                taille++;
            }
        }

        /*
         g.supprimerPile = function()
         {

         }
         */


        __g__.transformToArray = function (name) {
            /*var tab = new Array();
             tab.push("titi");
             tab.push("toto");
             tab.push(52);*/


            var tab = [];

            if (name == "BarChart") {
                tab[0] = [];
                tab[1] = [];
                tab[2] = [];


                for (var a = first; a != null; a = a.apres) {
                    // console.log("indice : " + a.indice+", numS : "+a.numS+" nombreS : "+a.nombreS);


                    tab[0][a.indice] = a.nombreS;
                    tab[1][a.indice] = a.numS;
                    tab[2][a.indice] = [a.nombreS, a.node, a.numS];


                }

            }

            if (name == "ScatterPlot") {

                tab[0] = [];
                tab[1] = [];
                tab[2] = [];

                for (var a = first; a != null; a = a.apres) {
                    //console.log("indice : " + a.indice+", numS : "+a.numS+" nombreS : "+a.nombreS);
                    /*
                     tab[0][a.indice] = a.nombreS*10;
                     tab[1][a.indice] = a.numS+50;
                     tab[2][a.indice] = [a.numS+50, a.nombreS*10, a.node, a.numS];*/

                    tab[0][a.indice] = a.nombreS;
                    tab[1][a.indice] = a.numS;
                    tab[2][a.indice] = [a.numS, a.nombreS, a.node, a.numS];
                }

            }

            console.log(tab);

            tab[3] = ["metrics", "numberNodes"];

            return tab;
        }


        __g__.afficher = function (target) {
            // console.log("pileMetric de " + target + " :")
            // console.log(current);

        }

        return __g__;
    }

    return {Metric: Metric};
})()
