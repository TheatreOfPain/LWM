// ==UserScript==
// @name        LWMDepositoryDataCollector
// @author			Theatre Of Pain (http://www.lordswm.com/pl_info.php?id=4821925)
// @version			1.0.130626
// @icon			http://dcdn.lordswm.com/hwmicon.ico
// @description		This script combines multiple depository pages in one page
// @include			http://www.lordswm.com/sklad_log.php*
// @grant       	GM_getValue
// @grant       	GM_setValue
// @grant       	GM_log
// ==/UserScript==


main();

function main(){
	createInputs();
}

function createInputs(){
	var depositoryTD = getDepositoryTD(document);
	var depositoryCenters = depositoryTD.getElementsByTagName('center');
	var center = depositoryCenters[0];
	center.appendChild(document.createElement('br'));
	center.appendChild(document.createElement('br'));
	center.appendChild(document.createTextNode('Combine Pages From\u00a0\u00a0'));
	
	var el = document.createElement('input');
	el.type = 'input';
	el.id = 'fromPage';
	el.value = '';
	el.style.textAlign = 'center';
	el.setAttribute('size', 10);
	center.appendChild(el);

	center.appendChild(document.createTextNode('\u00a0\u00a0To\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'input';
	el.id = 'toPage';
	el.value = '';
	el.style.textAlign = 'center';
	el.setAttribute('size', 10);
	center.appendChild(el);

	center.appendChild(document.createTextNode('\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'button';
	el.id = 'combine';
	el.addEventListener('click', combine, false);
	el.setAttribute('value', 'Go!');
	center.appendChild(el);
	
	center.appendChild(document.createElement('br'));
}

function combine(){
	var el = document.getElementById('fromPage');
	var fromPage = el.value;
	el = document.getElementById('toPage');
	var toPage = el.value;
	combinePages(fromPage, toPage);
}

function combinePages(start, end){
	if (!window.XMLHttpRequest) {
		alert('XMLHttpRequest is not supported! you can\'t combine pages!');
		return;
	}
	if (!isNumber(start) || !isNumber(end)) {
		alert('Please use valid numbers for the combination range.');
		return;
	}
	if (start > end){
		var temp = start;
		start = end;
		end = temp;
	}
	
	showOverlay();

	
	var currentURL = self.location.href;
	var matched = currentURL.match(/sklad_log.php\?id\=(\d+)/);
	var url = 'http://www.lordswm.com/sklad_log.php?id=';
	if (matched){
		url += RegExp.$1;
	} else {
		url += '115'; //Empire's Wrath depository
	}
	
	var newTD = '';
		
	for (var i = start; i <= end; i++) {
		var request = new XMLHttpRequest();
		request.open("GET",url + '&page=' + i,false);
		request.send(null);
		if (request.status!=200) return;//unsuccessful
	
		var doc = document.implementation.createHTMLDocument('');
		var head = doc.createElement( 'head' );
		var body = doc.createElement( 'body' );

		var headStartIndex = request.responseText.toLowerCase().indexOf('<head>');
		var headEndIndex = request.responseText.toLowerCase().indexOf('</head>');
		head.innerHTML = request.responseText.substring(headStartIndex, headEndIndex);

		var bodyStartIndex = request.responseText.toLowerCase().indexOf('<body>');
		var bodyEndIndex = request.responseText.toLowerCase().indexOf('</body>');
		body.innerHTML = request.responseText.substring(bodyStartIndex, bodyEndIndex);

		doc.documentElement.appendChild(head);
		doc.documentElement.appendChild(body);
		
		newTD += getCleanDepositoryLog(doc);
	}
	
	var depositoryTD = getDepositoryTD(document);
	
	depositoryTD.innerHTML = newTD;

	hideOverlay();
}

function showOverlay(){
   var overlay = document.createElement('div');
   overlay.setAttribute('id','overlay');
   overlay.style.backgroundColor = 'black';
   overlay.style.opacity = 0.5;
   overlay.style.position = 'fixed';
   overlay.style.left = 0;
   overlay.style.top = 0;
   overlay.style.width = '100%';
   overlay.style.height = '100%';
   document.body.appendChild(overlay);
}

function hideOverlay() {
   document.body.removeChild(document.getElementById('overlay'));
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getDepositoryTD(reference){
	var allTDs = reference.getElementsByTagName('td');
	var depositoryTD;
	for (var i = 0; i < allTDs.length; i++) {
		if (allTDs[i].innerHTML.indexOf('Depository') != -1
			&& allTDs[i].innerHTML.indexOf('log') != -1
			&& allTDs[i].innerHTML.indexOf('clan') != -1){
		
			depositoryTD = allTDs[i];
		}
	}
	return depositoryTD;
}

function getCleanDepositoryLog(rawDepositoryLog){
	var depositoryTD = getDepositoryTD(rawDepositoryLog);
	var cleanedDepositoryLog = depositoryTD.innerHTML.substring(depositoryTD.innerHTML.indexOf('&nbsp;')).replace(/&nbsp;/g,'');

	return cleanedDepositoryLog;
}