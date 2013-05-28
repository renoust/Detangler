
//pile de gestion d'Etat

(function () {


	var Metric = function(){

		var __g__ = this;

		//var pile = {avant : null, name : null, operation : null, apres : null};

		var first = null;
		var current = null;
		var taille = 0;		

		this.addMetric = function(numS, nodee)
		{		

			pileTMP = {avant : null, numS : null, nombreS : null, apres : null, indice : taille, node : null};
			pileTMP.numS = numS;
			pileTMP.nombreS = 1;
			pileTMP.node = new Array();
			pileTMP.node.push(nodee);
			
			
			if(current != null){
				
				for (var i=first; i != null ;i = i.apres)
				{
					if(i.numS == pileTMP.numS)
					{
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
			else{
				
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

		
		this.transformToArray = function(name)
		{
			/*var tab = new Array();
			tab.push("titi");
			tab.push("toto");
			tab.push(52);*/
			
			
			
			var tab = [];
			
			if(name == "BarChart")
			{
				tab[0] = [];
				tab[1] = [];
				tab[2] = [];
				
			
				for (var a=first; a != null ;a = a.apres)
				{
					// console.log("indice : " + a.indice+", numS : "+a.numS+" nombreS : "+a.nombreS);
					
					
					tab[0][a.indice] = a.nombreS;					
					tab[1][a.indice] = a.numS;
					tab[2][a.indice] = [a.nombreS, a.node, a.numS];
					
					
				}	
			
			}
			
			if(name == "ScatterPlot")
			{

				tab[0] = [];
				tab[1] = [];
				tab[2] = [];
			
				for (var a=first; a != null ;a = a.apres)
				{
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
		
		

		
		this.afficher = function(target)
		{
			// console.log("pileMetric de " + target + " :")
			// console.log(current);			
			
		} 

        return __g__;
    }

    return {Metric: Metric};
})()
