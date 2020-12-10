// ==UserScript==
// @name			LWMNavigationLinks
// @autohor			TheatreOfPain
// @version			1.0.201020
// @icon			http://dcdn.lordswm.com/hwmicon.ico
// @description			This script adds additional navigation links to overcome LWM's limitation of 10
// @include			https://www.lordswm.com/*
// @exclude			https://www.lordswm.com/warlog.php*
// @exclude			https://www.lordswm.com/war.php*
// @exclude			https://www.lordswm.com/brd.php
// @exclude			https://www.lordswm.com/rightcol.php
// @exclude			https://www.lordswm.com/ch_box.php
// @exclude			https://www.lordswm.com/chatonline.php*
// @exclude			https://www.lordswm.com/chat_line.php*
// @exclude			https://www.lordswm.com/chatpost.php*
// @exclude			https://www.lordswm.com/chat.php*
// @exclude			https://www.lordswm.com/ticker.php*
// @exclude			https://www.lordswm.com/cgame.php*
// @exclude			https://www.lordswm.com/battlechat.php*
// @exclude			https://www.lordswm.com/
// @grant               	GM_getValue
// @grant               	GM_setValue
// ==/UserScript==

const DEFAULT_LINK = 'http://';
const MAX_LINKS = 10;				// the script defaults to 10 additional links, increase this number if you need more
const SEP = '^';

var links = new Array();

if (location.href.indexOf('pers_navlinks.php') != -1) {
	setupLinks();
} else {
	displayLinks();
}

function setupLinks() {
	var all_tables = document.getElementsByTagName('table');
	var main_table;
	var tr;
	var td;
	var el;
	
	getLinks();
	
	for (var i = 0; i < all_tables.length; i++) {
		if (all_tables[i].innerHTML.indexOf('You may set up to 10 quick link shortcuts for the most used pages') != -1) {
			main_table = all_tables[i];
		}
	}
	
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 3;
	td.className = 'wbwhite';
	td.innerHTML = 'Additional links'.bold();
	tr.appendChild(td);
	main_table.appendChild(tr);
	
	for (var i = 0; i < MAX_LINKS; i++) {
		tr = document.createElement('tr');
		td = document.createElement('td');
		td.className = 'wbwhite';
		td.width = '30';
		td.innerHTML = (i + 11 )+ '.';
		tr.appendChild(td);
		td = document.createElement('td');
		td.className = 'wbwhite';
		td.align = 'center';
		el = document.createElement('input');
		el.type = 'input';
		el.id = 'caption' + (i + 11);
		el.name = 'caption' + (i + 11);
		el.value = links[i].split(SEP)[0];
		el.style.width = '180';
		el.setAttribute('maxlength', 20);
		td.appendChild(el);
		tr.appendChild(td);
		td = document.createElement('td');
		td.className = 'wbwhite';
		td.align = 'center';
		el = document.createElement('input');
		el.type = 'input';
		el.id = 'url' + (i + 11);
		el.name = 'url' + (i + 11);
		el.value = links[i].split(SEP)[1];
		el.style.width = '530';
		el.setAttribute('maxlength', 120);
		td.appendChild(el);
		tr.appendChild(td);
		main_table.appendChild(tr);
	}

	tr = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 3;
	td.className = 'wbwhite';
	td.align = 'center';
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', setLinks, false);
	el.setAttribute('value', 'Save Additional Links');
	td.appendChild(el);
	tr.appendChild(td);
	main_table.appendChild(tr);
}

function displayLinks() {
	var display_link = '';
	
	getLinks();
	
	for (var i = 0; i < links.length; i++) {
		if (links[i].split(SEP)[0].length != 0) {
			display_link += '<a class = "pi" href="' + links[i].split(SEP)[1] + '">' + links[i].split(SEP)[0] + '</a> | ';
		}
	}
	
	if (display_link.length == 0) {
		return;
	}
	
	display_link = display_link.substr(0, display_link.length - 3);
	
	var new_center = document.createElement('center');
	new_center.innerHTML = display_link;
	document.getElementsByTagName('center')[0].insertBefore(new_center, document.getElementsByTagName('center')[0].firstChild);
	
}

function setLinks() {
	var links_key = 'Navigation_Links';
	var caption_el;
	var url_el;
	var new_links = new Array();
	for (var z = 0; z < MAX_LINKS; z++) {
		caption_el = document.getElementById('caption' + (z + 11));
		url_el = document.getElementById('url' + (z + 11));
		if ((url_el.value.length == 0) || (caption_el.value.length == 0)) {
			url_el.value = DEFAULT_LINK;
		}
		new_links.push(caption_el.value + SEP + url_el.value);
	}
	GM_setValue(links_key, new_links.toString());
}

function getLinks() {
	var links_key = 'Navigation_Links';
	var temp_links = GM_getValue(links_key, -1);
	if (temp_links != -1) {
		links = temp_links.split(',');
	} else {
		for (var z = 0; z < MAX_LINKS; z++) {
			links.push('' + SEP + DEFAULT_LINK);
		}
	}
}
