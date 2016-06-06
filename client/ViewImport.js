/**
 * @author stagiaire
 */


var TP = TP || {};
(function () {


	var ViewImport = function(data) {
		
		var __g__ = this;

        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();
        
        var baseGen = null
        
        var arrayBD = {}
        var arrayFile =[]
        
        this.redirectFromLoad = function(bd) {
        	$('#parameters').parent().css("display","block");
			$('#parameters').parent().css("visibility","visible");
			objectReferences.ViewImportObject.addNewBase(bd);	
        }
        
        this.addNewBase = function(bd) {
        	dataName = bd['name']
        	if (!(dataName in arrayFile)) {
        		arrayBD[dataName] = bd
        		console.log(dataName)
        		console.log('the name of is')
        		console.log(arrayBD)
				console.log($('#param'))
				arrayFile.push(dataName)
				console.log(arrayFile)
				
				
				document.getElementById('labelName').value = dataName
				document.getElementById('secondLine').value = bd['size']
			
				/*for (var i=0; i<arrayFile.length; i++) {
					var size = arrayFile.length;
					console.log('size:', size)
					console.log('size - i', size - i)
					console.log(arrayFile[size - i -1])
					$("<option/>",{value:arrayFile[size - i-1 ], text:arrayFile[size - i-1]}).appendTo("#bases")
				}*/
				console.log('totututututututututuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu')
        		console.log(arrayFile)
				objectReferences.ViewImportObject.updateSelectedBase(bd)
        	}
        	else {
        		console.log('already in database')
        	}	
        }
        
        this.switchDataBase = function(dataName) {
        	bd = arrayBD[dataName]
        	objectReferences.ViewImportObject.updateSelectedBase(bd)
        }
        
        
        this.closeOtherDiv = function(divName, checkBoxName, divAsso) {
        	var st  = document.getElementById(divName)
			tab = st.getElementsByTagName('div')
			for (var i=0; i<tab.length; i++) {
				if (!(tab[i].id == divAsso)) {
					console.log(tab[i].id)
					$(tab[i]).css("display","none");
					$(tab[i]).css("visibility","hidden");
					console.log(document.getElementById(tab[i].id))
				}
			}		
			var inputs =  st.getElementsByTagName('input');
			console.log(inputs)
			for(var i = 0; i < inputs.length; i++) {
    			if(inputs[i].type.toLowerCase() == 'checkbox') {
    				console.log('inputs de i:   ' + $('#'+inputs[i].id))
        			$(inputs[i]).attr('checked', false)
    			}
			}	
        }
        
        this.updateSelectedBase = function(bd) {
        	dataName = bd['name']
        	document.getElementById('visuDiv').innerHTML = ''
			arrayBD[dataName] = bd
			base = bd
			dataColumn = base['columns']
			
			document.getElementById('choiceC').options.length = 0;
			document.getElementById('choiceColumn').options.length = 0;
			document.getElementById('choiceDrop').options.length = 0;
			document.getElementById('nodes').options.length = 0;
			//document.getElementById('paramLiaison').innerHTML = ''
			

			$("<option/>",{value:0, text:''}).appendTo("#choiceC");
			$("<option/>",{value:0, text:''}).appendTo("#choiceColumn");
			$("<option/>",{value:0, text:''}).appendTo("#choiceDrop");
			
			//objectReferences.ViewImportObject.updateParamWindow(dataColumn)
			
			$("<option/>",{value:'default', text:'keep the default index'}).appendTo("#nodes");
			//$("<option/>",{value:0, text:''}).appendTo("#nodes");
			
			for (dc in dataColumn) {
				$("<option/>",{value:dc, text:dc}).appendTo("#choiceC");
				$("<option/>",{value:dc, text:dc}).appendTo("#choiceColumn");
				$("<option/>",{value:dc, text:dc}).appendTo("#choiceDrop");
				$("<option/>",{value:dc, text:dc}).appendTo("#nodes");
			}

			
			dataDF = base['df']
			size = base['size']
			stui  = "<table id='users' border =2 cellspacing=1>"+		
				"<thead>"+
				"<tr class='ui-widget-header'>"+
				"<th></th>"	
			for (var dt in dataColumn) {
				stui += "<th>"+dt+"</th>"
			}
			stui += "<tbody>"
			if (size <20) {
				for (var ll in dataDF) {
					stui +="<tr>"+
					"<td>"+ll+"</td>"
					for (var ll2 in dataDF[ll]) {
						stui +="<td>"+dataDF[ll][ll2]+"</td>"
					}
					stui += "</tr>"
				}
				stui +="</tbody>"
				stui+= "</thead>"+"</table>"
			}
			else {
				nb = 0
					for (var ll in dataDF) {
						if (nb <10) {
							stui +="<tr>"+
							"<td>"+ll+"</td>"
							for (var ll2 in dataDF[ll]) {
								stui +="<td>"+dataDF[ll][ll2]+"</td>"
							}
							stui += "</tr>"
							nb = nb+1
						}
						else {
							break
						}
					}
				stui +="</tbody>"
				stui+= "</thead>"+"</table>"
				stui+= "..."
			}
			console.log(stui)
			document.getElementById('visuDiv').innerHTML += stui
			var target = 0
			TP.Client().createGraphFromCSV(bd, target, 'start', {})
        }
        
       /* this.updateParamWindow = function(dataColumn) {
        	document.getElementById('paramLiaison').innerHTML = ''
        	for (dc in dataColumn) {
        		$('<div>', {id: dc}).appendTo('#paramLiaison')
        		$('#'+dc).append(dc)
        		$('<input>', {id: dc+'box', type: 'checkBox'}).appendTo('#'+dc)
        		$('<select/>', {id: dc+'select'}).appendTo('#' +dc)
        		$("<option/>",{value:'same', text:'same'}).appendTo('#'+dc+'select');
				$("<option/>",{value:'by group', text: 'by group'}).appendTo('#'+dc+'select');
				$('<input>', {id: dc+'text', type:'text'}).appendTo('#'+dc)
				console.log('on prend skksksksk')
        	}
        	
        	
        }
        */
		
		this.handleCoeffEquation = function(name, coeff) {
			
			var res= true
			bd = arrayBD[name]
			//console.log(bd['columns'])
			
			var si= Object.keys(bd['columns']).length
			try {
				var co = parseInt(coeff)
				if(co>=0 && co <= si ) {
					res= true
				}
				else {
					res = false
				}
			} catch(Error) {
				res= false
				
			}
			if (res) {
				
				var target = 0
				console.log('odooorororororororororororo')
				TP.Client().createGraphFromCSV(bd, target, 'coefficient', {})
			}
			
			return res
		}
		
		
		this.handleJacquardEquation=function(name, borneLeft, borneRight) {
			
			var res= true
			bd = arrayBD[name]
			try {
				var valLeft = parseFloat(borneLeft)
				var valRight = parseFloat(borneRight)
				if (valLeft >= 0.0 && valRight<= 1.0 && valLeft <valRight) {
					res = true
				}
				else {
					res= false
				}
			
			} catch (Error) {
				res= false
				console.log('no float')
			}
			if (res) {
				var target = 0
        		TP.Client().createGraphFromCSV(bd, target, 'jacquard', {})
			}
			
			return res
		}
		
		
        
        this.handleBooleanEquation = function(name, val) {
        	
        	var res = true
        	bd = arrayBD[name]
        	txt = $.trim(val)
        	console.log(txt)
        	tabPlus = txt.split('+')
        	totalTab = []
        	for (var i=0; i<tabPlus.length; i++) {
        		tabAnd = tabPlus[i].split('.')
        		for (var j=0; j<tabAnd.length; j++) {
        			totalTab.push(tabAnd[j])
        		} 
        	} 
        	
        	
        	tabCol = []
        	for (var dc in bd['columns']) {
        			tabCol.push(dc)
        	}
        	for (var tt=0; tt<totalTab.length; tt++) {
        		rt = $.trim(totalTab[tt])
        		console.log(typeof(bd['columns']))
        		for (var a=0; a<tabCol.length; a++) {
        			console.log('rt     '   +rt)
        			console.log('tabCol '   + tabCol[a])
        			console.log(rt == tabCol[a])
        			
        			if (rt == tabCol[a]) {
        				res= true
        				break
        			}
        			else {
        				res= false
        			}
        		}
        			
        	}
        	if (res) {
        		var target = 0
        		TP.Client().createGraphFromCSV(bd, target, 'equat', {})
        	}
        	return res
        	
        }	
        
        	
        
			
        
        
        
        
   
	}


TP.ViewImport  = ViewImport;	
})(TP);