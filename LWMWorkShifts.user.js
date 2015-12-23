// ==UserScript==
// @name        LWMWorkShifts
// @namespace   http://lordswm.com
// @description This scripts processes the workshifts for each of the facilities in the map page, and displays the workshift end time and remaining balance of the facility
// @include     http://www.lordswm.com/map.php*
// @include     http://www.lordswm.com/ecostat_details.php*
// @version     1
// ==/UserScript==



main();

function main(){
	var allTDs = document.getElementsByTagName('td');
	var td;
	for (var i = 0; i < allTDs.length; i++) {
		if ((allTDs[i].innerHTML.indexOf('Mining') != -1
			&& allTDs[i].innerHTML.indexOf('Production') != -1
			&& allTDs[i].innerHTML.indexOf('Location') != -1
			&& location.href.indexOf('map.php') != -1)
		
			|| (allTDs[i].innerHTML.indexOf('Facility') != -1
			&& allTDs[i].innerHTML.indexOf('Demands') != -1
			&& allTDs[i].innerHTML.indexOf('Price') != -1
			&& location.href.indexOf('ecostat_details.php') != -1)) {
			
			td = allTDs[i];			
		}
	}
	if (td != 'undefined') {
		td.insertBefore(document.createElement('br'), td.firstChild);

		var processButton = document.createElement('input');
		processButton.type = 'button';
		processButton.id = 'processButton';
		processButton.addEventListener('click', processWorkShifts, false);
		processButton.setAttribute('value', 'Retrieve facility Info');
	
		td.insertBefore(processButton,td.firstChild);
	}
}

function processWorkShifts(){
	var url = 'http://www.lordswm.com/object-info.php?id=';
	var allAnchors = document.getElementsByTagName('a');
	for (var i = 0; i < allAnchors.length; i++) {
		if (allAnchors[i].href.match(/object-info\.php\?id=(\d+)/)
			&& allAnchors[i].innerHTML != ''
			&& allAnchors[i].innerHTML != '»»»'){

			var request = new XMLHttpRequest();
			request.open("GET",allAnchors[i].href,false);
			request.send(null);
			if (request.status!=200) return;//unsuccessful

			var table = document.createElement('table');
			var tableStartIndex = request.responseText.toLowerCase().indexOf('<table>');
			var tableEndIndex = request.responseText.toLowerCase().lastIndexOf('</table>');
			table.innerHTML = request.responseText.substring(tableStartIndex, tableEndIndex);

			var allTables = table.getElementsByTagName('table');
		

			for (var j = 0; j < allTables.length; j++) {
				if (allTables[j].innerHTML.indexOf('Balance :') != -1
					&& allTables[j].innerHTML.indexOf('Wage :') != -1
					&& allTables[j].innerHTML.indexOf('Workshift ends at:') != -1) {

					var workShiftMatched = false;
					workShiftMatched = (allTables[j].innerHTML.indexOf('Workshift ends at:') != -1)?true:false
					allTables[j].innerHTML.match(/Workshift ends at: (\d+):(\d+)/);
					if (workShiftMatched)
						allAnchors[i].innerHTML += '<br>[<b>' + RegExp.$1 + ':' + RegExp.$2 + '</b>]';
					
					var tds = allTables[j].getElementsByTagName('td');
					var balanceTD;
					for (var z = 0; z < tds.length; z++) {
						if (tds[z].innerHTML.indexOf('Balance :') != -1){
							balanceTD = tds[z];
						}
					}
					if (balanceTD != null) {
						var goldTable = balanceTD.nextSibling;
						var goldTDs = goldTable.getElementsByTagName('td');
						var goldStartPos = 0;
						var goldEndPos = 0;
						var goldTD;
						
						for (var y = 0; y < goldTDs.length; y++) {
							goldStartPos = goldTDs[y].innerHTML.indexOf('<b>');
							goldEndPos = goldTDs[y].innerHTML.indexOf('</b>');
							goldTD = goldTDs[y];
						}

						if (goldEndPos > 0) {
							var goldAmount = parseInt(goldTD.innerHTML.substring(goldStartPos + 3, goldEndPos));
							allAnchors[i].innerHTML += ' [<b>$ ' + goldAmount + '</b>]';
							if (goldAmount > 500) {
								allAnchors[i].parentNode.style.backgroundColor = '#00cc00';
							}							
						}
					}					
					break;
				}
			}
			
		}
	}
}
