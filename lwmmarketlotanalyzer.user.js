// ==UserScript==
// @name			LWMMarketLotAnalyzer
// @author			TheatreOfPain
// @description		This script analyzes market lots
// @include			http://www.lordswm.com/auction_lot_protocol.php*
// @include			http://www.lordswm.com/auction.php
// ==/UserScript==

var all_tables;
var log_table;
var lot_type;
var lot_number;
var original_lot_log;
var lot_log = new Array();
var market_records = new Array();
var from_range, to_range;
var lots_per_minute;
var time_interval;
var opened_window;

if (location.href == 'http://www.lordswm.com/auction_lot_protocol.php') {
	drawLotReport(); 
} else if (location.href == 'http://www.lordswm.com/auction.php') {
	lotRange();
} else {
	main();	
}

function main() {
	var is_auto = getCookie('auto_process');
	if (is_auto == 1) {
		time_interval = getCookie('time_interval');
		setTimeout( function() { processLogs(); }, time_interval);;
	}
	all_tables = document.getElementsByTagName('table');
	for (var i = 0; i < all_tables.length; i++) {
		if (all_tables[i].innerHTML.search(/Lot #(\d+) log/)) {
			lot_number = RegExp.$1;
			log_table = all_tables[i];
		}
	}

	if (log_table.innerHTML.indexOf('starting price') != -1) {
		lot_type = 'Auction';
	} else if (log_table.innerHTML.indexOf('gold each') != -1) {
		lot_type = 'Direct Sale';
	}
	original_lot_log = log_table.innerHTML.split('<br>');

	for (var i = original_lot_log.length - 2; i > 0; i--) {
		if (original_lot_log[i].length != 0) {
			lot_log.push(original_lot_log[i]);
		}
	}
	
	parseLog();
	
	if (market_records.length > 0) {
		market_records.sort();
		GM_setValue('Market Records', market_records.toString());
	}
	
	var el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', viewLotTable, false);
	el.setAttribute('value', 'View Lot Table');
	log_table.appendChild(document.createElement("br"));
	log_table.appendChild(el);
	log_table.appendChild(document.createElement("br"));
	

}

function parseLog() {
	var temp_log_header = lot_log[0];
	var temp_placement_date;
	var temp_sell_date;
	var temp_quantity = 1;
	var temp_item;
	var temp_durability = '-';
	var temp_price;
	var temp_seller;
	var temp_buyer = '';
	var parsed_log;
	
	temp_placement_date = temp_log_header.substr(0,14);

	var matched = temp_log_header.match(/Displayed for sale:  (\d+)/);
	if (matched != null) {
		//element
		temp_quantity = RegExp.$1;
		matched = temp_log_header.replace(/ /g,'_').match(/<b>(\D+)<\/b>/);
		temp_item = RegExp.$1.replace(/_/g,' ');
	} 
	
	matched = temp_log_header.match(/<b>(\D+)<\/b><\/a> (\d+\/\d+)/);
	if (matched != null) {
		temp_item = RegExp.$1;
		temp_durability = RegExp.$2;
	}

	matched = temp_log_header.match(/(\d+) pcs./);
	if (matched != null) {
		temp_quantity = RegExp.$1;
	}
	
	if (lot_type == 'Direct Sale') {
		matched = temp_log_header.match(/(\d+) gold each/);
		temp_price = RegExp.$1;
		for (var x = 1; x < lot_log.length; x++) {
			if (lot_log[x].indexOf('pl_info.php') != -1) {
				temp_buyer += lot_log[x].substring(16) + '<br>';
			}
		}
		temp_buyer = temp_buyer.substring(0, temp_buyer.length - 4);
	}
	
	temp_seller = temp_log_header.substring(temp_log_header.indexOf('Seller: ') + 8);
	
	if (lot_log[lot_log.length - 1].indexOf('Auction over') != -1) {
		matched = lot_log[lot_log.length - 1].match(/<b>(\d+)<\/b>/);
		temp_price = RegExp.$1;
		temp_buyer = lot_log[lot_log.length - 1].substring(lot_log[lot_log.length - 1].indexOf('to ') + 3, lot_log[lot_log.length - 1].indexOf(' for '));
	}

	if (temp_buyer == '') {
		return;
	}
	if ((lot_log[lot_log.length - 1].indexOf('Auction expired') == -1) && (lot_log[lot_log.length - 1].indexOf('Goods sold out') == -1) && (lot_log[lot_log.length - 1].indexOf('Auction over') == -1)){
		return;
	}

	temp_sell_date = lot_log[lot_log.length - 1].substr(0,14);

	parsed_log = lot_number + '#' + temp_placement_date + '#' + temp_sell_date + '#' + lot_type + '#' + temp_quantity + '#' + temp_item + '#' + temp_durability + '#' + temp_price + '#' + temp_seller + '#' + temp_buyer;

	newLogRecord(parsed_log);
}

function newLogRecord (new_record) {
	var temp = GM_getValue('Market Records', -1);
	if (temp != -1) {
		market_records = temp.split(',');
	}

	for (var z = 0; z < market_records.length; z++) {
		if (market_records[z] == new_record) {
			return;
		}
	}
	market_records.push(new_record);
}

function removeMarketReport() {
	GM_deleteValue('Market Records');
	window.location.reload();
}

function viewLotTable() {
	location.href = "http://www.lordswm.com/auction_lot_protocol.php";
}

function drawLotReport() {
	var temp = GM_getValue('Market Records', -1);
	var lot_records = new Array();
	var lot_record = new Array();
	var lot_table;
	var tr, td;
	var cell_class;

	if (temp == -1) {
		return;
	}

	all_tables = document.getElementsByTagName('table');
	for (var x = 0; x < all_tables.length; x++) {
		if (all_tables[x].innerHTML.indexOf('Lot #0 log') != -1) {
			lot_table = all_tables[x];
		}
	}

	lot_records = temp.split(',');
	
	while (lot_table.childNodes[0]) {
		lot_table.removeChild(lot_table.childNodes[0]);
	}	
	
	lot_table.width = '1100';
	cell_class = 'wbwhite';

	// table header
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = '11';
	td.className = cell_class;
	td.align = 'center';
	td.innerHTML = '<b>Market Lots</b>';
	tr.appendChild(td);
	lot_table.appendChild(tr);
	
	tr = document.createElement('tr');
	tr.innerHTML = '<td class="' + cell_class + '" align="center"><b>Lot Number</b></td><td class="' + cell_class + '" align="center"><b>Placed on</b></td><td class="' + cell_class + '" align="center"><b>Sold on</b></td><td class="' + cell_class + '" align="center"><b>Lot Type</b></td>'
	tr.innerHTML += '<td class="' + cell_class + '" align="center"><b>Quantity</b></td><td class="' + cell_class + '" align="center"><b>Item Sold</b></td><td class="' + cell_class + '" align="center"><b>Durability</b></td><td class="' + cell_class + '" align="center"><b>Price</b></td>'
	tr.innerHTML += '<td class="' + cell_class + '" align="center"><b>Seller</b></td><td class="' + cell_class + '" align="center"><b>Buyer</b></td><td class="' + cell_class + '" align="center"><b>Del</b></td>';
		
	lot_table.appendChild(tr);

	for (var x = 0; x < lot_records.length; x++) {
		if (cell_class == 'wbwhite') {
			cell_class = 'wblight';
		} else {
			cell_class = 'wbwhite';
		}

		lot_record = lot_records[x].split('#');
		lot_number = lot_record[0];
		lot_record[0] = '<a href="http://www.lordswm.com/auction_lot_protocol.php?id=' + lot_record[0] + '">' + lot_record[0] + '</a>';
		tr = document.createElement('tr');
		for (var y = 0; y < lot_record.length; y++) {
			td = document.createElement('td');
			td.className = cell_class;
			td.innerHTML = lot_record[y];
			tr.appendChild(td);
		}
		
		td = document.createElement('td');
		td.className = cell_class;
		td.align = 'center';
		el = document.createElement('input');
		el.type = 'checkbox'; 
		el.id = lot_number;
		td.appendChild(el);
		tr.appendChild(td);
		lot_table.appendChild(tr);
	
	}

	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', removeSelectedRecords, false);
	el.setAttribute('value', 'Delete Selected');
	td = document.createElement('td');
	td.align = 'right';
	td.colSpan = '11';
	td.appendChild(document.createElement('br'));
	td.appendChild(el);
	td.appendChild(document.createElement('br'));
	lot_table.appendChild(td);

	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', removeMarketReport, false);
	el.setAttribute('value', 'Delete Lot Table');
	lot_table.appendChild(document.createElement('br'));
	lot_table.appendChild(el);
	lot_table.appendChild(td);
}

function lotRange () {
	var all_tds = document.getElementsByTagName('td');
	var td;
	var el;
	 
	for (var i = 0; i < all_tds.length; i++) {
		if (all_tds[i].className =="wbwhite") {
			td = all_tds[i];
		}
	}
	
	td.insertBefore(document.createElement('br'), td.firstChild);
	td.insertBefore(document.createElement('br'), td.firstChild);

	td.insertBefore(document.createTextNode('\u00a0\u00a0lots per minute'), td.firstChild);

	el = document.createElement('input');
	el.type = 'input';
	el.id = 'lots_per_minute';
	el.value = '20';
	el.style.textAlign = 'center';
	el.setAttribute('size', 4);
	td.insertBefore(el, td.firstChild);

	td.insertBefore(document.createTextNode('\u00a0\u00a0'), td.firstChild);
	
	el = document.createElement('input');
	el.type = 'button';
	el.id = 'auto_process';
	el.addEventListener('click', autoProcess, false);
	el.setAttribute('value', 'Auto Process');
	td.appendChild(el);
	td.insertBefore(el, td.firstChild);

	td.insertBefore(document.createTextNode('\u00a0\u00a0or\u00a0\u00a0'), td.firstChild);

	el = document.createElement('input');
	el.type = 'button';
	el.id = 'build_links';
	el.addEventListener('click', buildLinks, false);
	el.setAttribute('value', 'Build Links');
	td.appendChild(el);
	td.insertBefore(el, td.firstChild);

	td.insertBefore(document.createTextNode('\u00a0\u00a0\u00a0\u00a0'), td.firstChild);
	
	el = document.createElement('input');
	el.type = 'input';
	el.id = 'to_range';
	el.value = '';
	el.style.textAlign = 'center';
	el.setAttribute('size', 10);
	td.insertBefore(el, td.firstChild);
	
	td.insertBefore(document.createTextNode('\u00a0\u00a0To\u00a0\u00a0'), td.firstChild);
	
	el = document.createElement('input');
	el.type = 'input';
	el.id = 'from_range';
	el.value = '';
	el.style.textAlign = 'center';
	el.setAttribute('size', 10);
	td.insertBefore(el, td.firstChild);

	td.insertBefore(document.createTextNode('Analyze Lots From\u00a0\u00a0'), td.firstChild);

	td.insertBefore(document.createElement('br'), td.firstChild);
	
	td.insertBefore(document.createTextNode('Enter range of market lots to be analyzed in the following boxes then click \"Build Links\" to build the links for the lots'), td.firstChild);
}

function buildLinks () {
	var all_tds = document.getElementsByTagName('td');
	var td;
	var el;
	var links = '';
	 
	for (var i = 0; i < all_tds.length; i++) {
		if (all_tds[i].className =="wbwhite") {
			td = all_tds[i];
		}
	}
	
	el = document.getElementById('from_range');
	from_range = el.value;
	el = document.getElementById('to_range');
	to_range = el.value;
	
	if ((from_range != parseInt(from_range)) || (to_range != parseInt(to_range))) {
		alert('Please make sure both the ranges are filled with numbers');
		return;
	}
	
	if (from_range > to_range) {
		var temp_val = from_range;
		from_range = to_range;
		to_range = temp_val;		
	}
	to_range++;
	
	for (var x = from_range; x < to_range; x++) {
		links += '<a href = "http://www.lordswm.com/auction_lot_protocol.php?id=' + x + '"> #' + x + '</a>\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0';
	}
	
	el = document.getElementById('links');
	if (el == null) {
		td.insertBefore(document.createElement('br'), td.firstChild);
		el = document.createElement('div');		
		el.id = 'links';
	}

	el.innerHTML = links;
	td.insertBefore(el, td.firstChild);
}

function autoProcess () {
	var el;
	el = document.getElementById('from_range');
	from_range = el.value;
	el = document.getElementById('to_range');
	to_range = el.value;
	
	if ((from_range != parseInt(from_range)) || (to_range != parseInt(to_range))) {
		alert('Please make sure both the ranges are filled with numbers');
		return;
	}
	
	if (from_range > to_range) {
		var temp_val = from_range;
		from_range = to_range;
		to_range = temp_val;		
	}

	el = document.getElementById('lots_per_minute');
	lots_per_minute = el.value;

	if (lots_per_minute != parseInt(lots_per_minute)) {
		lots_per_minute = 20;
	} else {
		lots_per_minute = parseInt(lots_per_minute);
	}
	
	to_range++;
	time_interval = (60/lots_per_minute)*1000;

	document.cookie = 'auto_process=1';
	document.cookie = 'time_interval=' + time_interval;
	document.cookie = 'from_range=' + from_range;
	document.cookie = 'to_range=' + to_range;
	
	opened_window = window.open('http://www.lordswm.com/auction_lot_protocol.php?id=' + from_range, 'lot_window');
	setTimeout( function() { processLogs(); }, time_interval);

}

function processLogs() {
	from_range = getCookie('from_range');
	to_range = getCookie('to_range');

	from_range++;
	document.cookie = 'from_range=' + from_range;

	if (from_range < to_range) {
		opened_window = window.open('http://www.lordswm.com/auction_lot_protocol.php?id=' + from_range, 'lot_window');
	} else {
		document.cookie = 'auto_process=0';
		opened_window = window.open('http://www.lordswm.com/auction_lot_protocol.php', 'lot_window');
		drawLotReport();
	}
}

function getCookie(cookie_key) {
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++) {
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==cookie_key) {
			return unescape(y);
		}
	}
	return 0;
}

function removeSelectedRecords () {
	var temp = GM_getValue('Market Records', -1);
	var loaded_records = temp.split(',');
	var modified = false;
	var all_input = document.getElementsByTagName('input');

	for (var z = 0; z < all_input.length; z++) {
		if ((all_input[z].type == 'checkbox') && (all_input[z].checked == true)) {
			var found_record = -1;
			for (var y = 0; y < loaded_records.length; y++) {
				if (loaded_records[y].split('#')[0] == all_input[z].id) {
					found_record = y;
				}
			}
			if (found_record != -1) {
				loaded_records.splice(found_record,1);
				modified = true;
			}
		}
	}
	if (modified) {
		if (loaded_records.length > 0) {
			GM_setValue('Market Records', loaded_records.toString());
		} else {
			GM_deleteValue('Market Records');
		}
		window.location.reload();
	}
}




