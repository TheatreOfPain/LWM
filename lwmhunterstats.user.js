// ==UserScript==
// @name			LWMHunterStats
// @author			Theatre Of Pain
// @version			1.1.130423
// @description		This script collects your personal hunting records and compares them with the current top hunters showing you how far are you from achieving records
// @include			http://www.lordswm.com/pl_hunter_stat.php*
// @include			http://www.lordswm.com/plstats_hunters.php*
// @include			http://www.lordswm.com/map.php*
// ==/UserScript==

var debug = false;	//turn to true to display debug messages in the error console

// it's presumed you're using Top Hunters (authored by: Antviolence), hence will use the same color coding
// however, if you are not using it, then turn TOP_HUNTERS_SCRIPT to false
const TOP_HUNTERS_SCRIPT = true;	
const COLOR1 = "#ccccee"; // blue
const COLOR2 = "#cceecc"; // green
const COLOR3 = "#eeeecc"; // yellow
const COLOR4 = "#eeeecc"; // yellow
const COLOR5 = "#eeeecc"; // yellow

const TOP_HUNTER_RECORD = 4;
const PLAYER_ID = 0;
const GOLD = 1;
const SILVER = 2;
const BRONZE = 3;
const PLAYER_LINK = 4;

var records_table;
var main_table;
var player_name;
var hunt_stats = new Array();
var hunt_record;
var top_hunters = new Array();
var top_ten_hunters = new Array();

if (location.href.indexOf("pl_hunter_stat.php") != -1) {				// the current page is personal records
	collectHuntStats();
} else if (location.href.indexOf("plstats_hunters.php") != -1) {		// the current page is top hunters
	displayHuntStats();
	displayTopHunters();
} else if (location.href.indexOf("map.php") != -1) {					// the current page is the map
	updateMap();
}

function collectHuntStats() {
	var all_tables = document.getElementsByTagName('table');
	var table_pass = 0;			// there will be 3 tables elements, we need to ignore the first, extract player name from the second, and parse personal records from the third

	for (var i = 0; i < all_tables.length; i++) {
		if (all_tables[i].innerHTML.indexOf("warlog.php") != -1) {
			table_pass++;
			if (table_pass == 2) {		// extract player name
				all_tables[i].innerHTML.match(/<tr><td\D{0,}><b>(\D{0,})<\/b><br><br><\/td><\/tr>/);
				player_name = RegExp.$1.replace(/^\s+|\s+$/g,"");		// trim spaces
			}
		records_table = all_tables[i];
		}
	}

	var all_trs = records_table.getElementsByTagName('tr');
	var hyperlinks;
	var war_id;
	var monster_hunt;
	for (var i = 1; i < all_trs.length; i++) {
		hyperlinks = all_trs[i].getElementsByTagName('a');
		for (var y = 0; y < hyperlinks.length; y++) {
			if (hyperlinks[y].href.indexOf('army_info') != -1) {
				hyperlinks[y].href.match(/army_info\.php\?name=(\w*)/);
				monster_name = RegExp.$1;
			}
 			if (hyperlinks[y].href.indexOf('warlog') != -1) {
				hyperlinks[y].href.match(/warlog\.php\?warid=(\d*)/);
				war_id = RegExp.$1;
				monster_hunt = hyperlinks[y].innerHTML;
			}
 		}
		if (monster_hunt != "") {
			hunt_record = monster_name + "#" + war_id + "#" + monster_hunt; 
			hunt_stats.push(hunt_record);
		}
	}
	
	if (hunt_stats.length != 0) {
		setHuntStats();
	}	
}

function displayHuntStats() {
	
	var all_params = document.getElementsByTagName('param');
	for (var i = 0; i < all_params.length; i++) {
		if (all_params[i].name == 'FlashVars') {
			player_name = all_params[i].value.split('|')[3];
			break;
		}
	}

	hunt_stats = getHuntStats();
	
	if (hunt_stats == -1) return;
	
	var all_tables = document.getElementsByTagName('table');

	for (var i = 0; i < all_tables.length; i++) {
		if (all_tables[i].innerHTML.indexOf("Monsters") != -1) {
			records_table = all_tables[i];
		}
	}
	
	var all_trs = records_table.getElementsByTagName('tr');
	var monster;
	var gold_war_id;
	var gold_hunt;

tr_loop:	
	for (var i = 1; i < all_trs.length; i++) {
		all_trs[i].innerHTML.match(/rowspan=\"(\d+)\"/);
		var rowspan = RegExp.$1;
		hyperlinks = all_trs[i].getElementsByTagName('a');
		for (var y = 0; y < hyperlinks.length; y++) {
			if (hyperlinks[y].href.indexOf('army_info') != -1) {
				hyperlinks[y].href.match(/army_info\.php\?name=(\w*)/);
				monster_name = RegExp.$1;
			}
 			if (hyperlinks[y].href.indexOf('warlog') != -1) {
				hyperlinks[y].href.match(/warlog\.php\?warid=(\d*)/);
				gold_war_id = RegExp.$1;
				gold_hunt = hyperlinks[y].innerHTML;
			}
 		}
		var record_found = false;
		var modify_row;
	hunts_loop:
		for (var j = 0; j < hunt_stats.length; j++) {
			hunt_record = hunt_stats[j].split("#");
			if (monster_name != hunt_record[0]) {
				continue;
			} else{
				record_found = true;
				modify_row = i;
				break hunts_loop;
			}
		}
		if (!record_found) {
			if (rowspan > 1) {
				modify_row = i;
				for (var k = 1; k < rowspan; k++) {
					i++;
				}
			}
			continue tr_loop;
		}
		
		var war_id = parseInt(hunt_record[1]);
		var player_hunt = parseInt(hunt_record[2]);
		var new_td = "";
		var cell_color = 0;
		if (gold_hunt > player_hunt) {
			var hunts_to_go = 0;
			var temp_hunt = player_hunt;
			var loop_break = false;
			while (!loop_break) {
				hunts_to_go++;
				temp_hunt = temp_hunt * 1.3;
				if (Math.floor(temp_hunt) > gold_hunt) {
					loop_break = true;
				}
			}
			new_td += "&nbsp;Current: <b><a href=\"warlog.php?warid=" + war_id + "\">" + player_hunt + "</a></b><br>&nbsp;<b>" + hunts_to_go + "</b> hunts to gold";
		} else if (gold_hunt <= player_hunt) {
			new_td += "<b>&nbsp;Current: <b><a href=\"warlog.php?warid=" + war_id + "\">" + player_hunt + "</a></b><br>";
			if (gold_war_id == war_id) {
				new_td += "&nbsp;You Rock!</b>";
				cell_color = COLOR1;
			} else {
				new_td += "&nbsp;1 hunt to gold</b>";
			}
		}
		new_td += "</td>";
		if (rowspan > 1) {
			var player_found = 0;
			for (var k = 1; k <= rowspan; k++) {
				if (all_trs[i+k-1].innerHTML.indexOf(player_name) != -1) {
					player_found = k;
					break;
				}
			}
			i += rowspan - 1;
			switch (player_found) {
				case 1:		// 1st place
					cell_color = COLOR1;
					break;
				case 2:		// 2nd place
					cell_color = COLOR2;
					break;
				case 3:		// 3rd place
					cell_color = COLOR3;
					break;
				case 4:		// 4th place
					cell_color = COLOR4;
					break;
				case 5:		// 5th place
					cell_color = COLOR5;
			}
		}
			if ((cell_color != 0) && (TOP_HUNTERS_SCRIPT)) {
			new_td = "<td rowspan=\"" + rowspan + "\" class=\"wb\" bgcolor=\"" + cell_color + "\">" + new_td;
		} else {
			new_td = "<td rowspan=\"" + rowspan + "\" class=\"wblight\">" + new_td;
		}
		all_trs[modify_row].innerHTML = all_trs[modify_row].innerHTML + new_td;
	}
	all_trs[0].innerHTML = all_trs[0].innerHTML + "<td class=\"wblight\" align=\"center\">&nbsp;Personal Record&nbsp;</td>";
}

function displayTopHunters() {
	var all_tables = document.getElementsByTagName('table');

	for (var i = 0; i < all_tables.length; i++) {
		if (all_tables[i].innerHTML.indexOf("Monsters") != -1) {
			records_table = all_tables[i];
		}
		if ((all_tables[i].innerHTML.indexOf("All factions") != -1) && (all_tables[i].innerHTML.indexOf("All levels") != -1)) {
			main_table = all_tables[i];
		}
	}
	
	var universal_reckoning = false;
	if (records_table.innerHTML.indexOf('Universal reckoning') != -1) {
		universal_reckoning = true;
	}
	if (!universal_reckoning) {
		var td_index = 0;
	} else {
		var td_index = 1;
	}

	var top_positions = 3;
	var top_hunter;
	
	var all_trs = records_table.getElementsByTagName('tr');
	for (var i = 1; i < all_trs.length; i++) {
		var row_span = all_trs[i].getElementsByTagName('td')[0].rowSpan;
		addMedal(all_trs[i].getElementsByTagName('td')[td_index + 1], GOLD);
		if (row_span > 1) {
			i++;
			addMedal(all_trs[i].getElementsByTagName('td')[td_index], SILVER);
		}
		if (row_span > 2) {
			i++;
			addMedal(all_trs[i].getElementsByTagName('td')[td_index], BRONZE);
		}	
		if (row_span > 3) {
			i += row_span - 3;
		}
	}
	
	var all_tds = main_table.getElementsByTagName('td');
	for (var i = 0; i < all_tds.length; i++) {
		if ((all_tds[i].innerHTML.indexOf("All factions") != -1) && (all_tds[i].innerHTML.indexOf("All levels") != -1)) {
			var top_td = all_tds[i];
		}
	}
	
	top_td.appendChild(document.createElement('br'));
	top_td.appendChild(getTopHuntersTable());
	top_td.appendChild(document.createElement('br'));
}

function addMedal(player_td, medal_type) {
	var top_hunter_record = new Array(TOP_HUNTER_RECORD); 
	var matched = player_td.innerHTML.match(/pl_info\.php\?id=(\d*)/);
	top_hunter_record[PLAYER_ID] = RegExp.$1;
	for (var z = 0; z < top_hunters.length; z++) {
		if	(top_hunters[z][PLAYER_ID] == top_hunter_record[PLAYER_ID]) {
			top_hunters[z][medal_type]++;
			return;
		}
	}
	top_hunter_record[GOLD] = 0;
	top_hunter_record[SILVER] = 0;
	top_hunter_record[BRONZE] = 0;
	top_hunter_record[medal_type]++;
	top_hunter_record[PLAYER_LINK] = player_td.innerHTML.substring(0, player_td.innerHTML.indexOf(' - ')).replace(/<b>/g,'').replace(/<\/b>/g,'');
	top_hunters.push(top_hunter_record);	
}

function getTopHuntersTable() {
	var divisor = 1000;
	var top_players_count = 5;
	var temp_top_hunters = new Array();
	for (var z = 0; z < top_hunters.length; z++) {
		var new_value = (((((top_hunters[z][GOLD] * divisor) + top_hunters[z][SILVER]) * divisor) + top_hunters[z][BRONZE]) * divisor) + z;
		temp_top_hunters.push(new_value);
	}
	temp_top_hunters.sort(reverseSort);		

	var top_div = document.createElement('div');
	var tbl = document.createElement('table');
	tbl.className = 'wb';
	tbl.cellPadding = '2';
	tbl.id = 'top_ten_table';
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	var class_name = 'wblight';
	td.className = class_name;
	td.innerHTML = 'Top Hunters'.bold();
	td.align = 'center';
	tr.appendChild(td);
	td = document.createElement('td');
	td.className = class_name;
	td.width = 50;
	td.innerHTML = '<img width="50" height="50" border="0" src="i/rewards/hunt_1.png">'
	tr.appendChild(td);
	td = document.createElement('td');
	td.className = class_name;
	td.width = 50;
	td.innerHTML = '<img width="50" height="50" border="0" src="i/rewards/hunt_2.png">'
	tr.appendChild(td);
	td = document.createElement('td');
	td.className = class_name;
	td.width = 50;
	td.innerHTML = '<img width="50" height="50" border="0" src="i/rewards/hunt_3.png">'
	tr.appendChild(td);
	tbl.appendChild(tr);
	for (var z = 0; z < top_players_count; z++) {
		(class_name == 'wblight') ? (class_name = 'wbwhite') : (class_name = 'wblight');
		tr = document.createElement('tr');
		td = document.createElement('td');
		var top_hunter_index = temp_top_hunters[z] % divisor;
		td.innerHTML = top_hunters[top_hunter_index][PLAYER_LINK];
		td.align = 'left';
		td.className = class_name;
		tr.appendChild(td);
		td = document.createElement('td');
		td.innerHTML = top_hunters[top_hunter_index][GOLD];
		td.align = 'center';
		td.className = class_name;
		tr.appendChild(td);
		td = document.createElement('td');
		td.innerHTML = top_hunters[top_hunter_index][SILVER];
		td.align = 'center';
		td.className = class_name;
		tr.appendChild(td);
		td = document.createElement('td');
		td.innerHTML = top_hunters[top_hunter_index][BRONZE];
		td.align = 'center';
		td.className = class_name;
		tr.appendChild(td);
		tbl.appendChild(tr);
	}
	top_div.appendChild(tbl);
	return top_div;
}

function reverseSort (a, b) {
	return (a - b) * -1;
}

function pad(num, size) {
    var padded = num + '';
    while (padded.length < size) {
		padded = '0' + padded;
	}
    return padded;
}

function updateMap() {
	var all_params = document.getElementsByTagName('param');
	for (var i = 0; i < all_params.length; i++) {
		if (all_params[i].name == 'FlashVars') {
			player_name = all_params[i].value.split('|')[3];
			break;
		}
	}

	hunt_stats = getHuntStats();
	
	if (hunt_stats == -1) return;
	
	records_table = document.body.getElementsByTagName('table');
	var table_pass = 0;			// there will be at least 3 tables elements, we need to ignore the first and the second, and update the third (and the forth if the character has HG level 6 and above)

	for (var i = 0; i < records_table.length; i++) {
		if ((records_table[i].innerHTML.indexOf("plstats_hunters.php") != -1) && (records_table[i].innerHTML.indexOf("action=skip") != -1) &&(records_table[i].innerHTML.indexOf("showarmy1") != -1)) {
			table_pass++;
			if (table_pass <=2) {
				continue;
			}

			records_table[i].innerHTML.match(/army_info\.php\?name=(\w*\D*\w*)\">/);
			var monster_name = RegExp.$1;
			var record_found = false;
			
			for (var j = 0; j < hunt_stats.length; j++) {
				hunt_record = hunt_stats[j].split("#");
				if (monster_name != hunt_record[0]) {
					continue;
				} else {
					record_found = true;
					break;
				}
			}
			
			if (!record_found) {
				continue;
			}

			var new_str = "<td class=\"wb\" rowspan=\"2\" align=\"center\" valign=\"middle\">&nbsp;Current&nbsp;<br><b><a href=\"warlog.php?warid=" + hunt_record[1] + "\">" + hunt_record[2] + "</a></b></td>";
			var search_str = "<a href=\"plstats_hunters.php";
			var search_str2 = "</a></td>";
			var search_pos = records_table[i].innerHTML.indexOf(search_str2, records_table[i].innerHTML.indexOf(search_str));
			records_table[i].innerHTML = records_table[i].innerHTML.substring(0,search_pos + search_str2.length) + new_str + records_table[i].innerHTML.substring(search_pos + search_str2.length);
			
		}
	}	
}

function supportsHTML5Storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		if (debug) GM_log('HTML5 Storage is not supported');
		return false;
	}
}

function getHuntStats() {
	var hunterStatsKey = 'LWMHunterStats ' + player_name;
	var huntData;
	if (supportsHTML5Storage()) {
		huntData = (localStorage[hunterStatsKey] == undefined)?0:localStorage[hunterStatsKey];
	} else {
		huntData = GM_getValue(hunterStatsKey, 0);
	}
	if (huntData != 0) {
		return huntData.split(',');
	}
	return -1;
}

function setHuntStats() {
	var hunterStatsKey = 'LWMHunterStats ' + player_name;
	if (supportsHTML5Storage()) {
		localStorage[hunterStatsKey] = hunt_stats.toString();
	} else {
		GM_setValue(hunterStatsKey, hunt_stats.toString());
	}
}