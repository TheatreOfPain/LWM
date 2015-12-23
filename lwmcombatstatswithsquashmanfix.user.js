// ==UserScript==
// @name			LWMCombatStats
// @author			TheatreOfPain
// @version			2.0.120201
// @description		This script provides complete combat stats about any profile you choose to collect stats for
// @include			http://www.lordswm.com/pl_warlog.php*
// @include			http://www.lordswm.com/pl_info.php*
// ==/UserScript==

const HS = 'HS';	// solo hunt						xx-xx-xx xx:xx	<player>[level] vs <monster> (xx)
const HD = 'HD';	// dual hunt						xx-xx-xx xx:xx	<player>[level], <dual_player>[level] vs <monster1> (xx), <monster2> (xx)
const HA = 'HA';	// you assisted a hunt				xx-xx-xx xx:xx	<assisted_player>[level], <player>[level] vs <monster> (xx)
const HT = 'HT';	// you were assisted in a hunt		xx-xx-xx xx:xx	<player>[level], <assisting_player>[level] vs <monster> (xx)
const MA = 'MA';	// mercenary - army					xx-xx-xx xx:xx	<player>[level] vs Army of xx {xx}
const MB = 'MB';	// mercenary - brigands				xx-xx-xx xx:xx	• xx-brigands {xx} vs <player>[level]
const MC = 'MC';	// mercenary - conspirators			xx-xx-xx xx:xx	<player>[level] vs xx - conspirators {xx}
const MI = 'MI';	// mercenary - invanders			xx-xx-xx xx:xx	<player>[level] vs xx-invaders {xx}
const MM = 'MM';	// mercenary - monster				xx-xx-xx xx:xx	<player>[level] vs xx-monster {xx}
const MR = 'MR';	// mercenary - raid					xx-xx-xx xx:xx	<player>[level] vs xx-raid {xx}
const MV = 'MV';	// mercenary - vanguard				xx-xx-xx xx:xx	<player>[level] vs Vanguard of xx {xx}
const TG = 'TG';	// you ambushed a player			xx-xx-xx xx:xx	• <player>[level] vs <ambushed_player>[level]
const TP = 'TP';	// you were ambushed by a player	xx-xx-xx xx:xx	• <ambusher_player>[level] vs <player>[level]
const TD = 'TD';	// you ambushed a dual				xx-xx-xx xx:xx	• <player>[level] vs <ambushed_player1>[level], <ambushed_player2>[level]
const TU = 'TU';	// you were ambushed in a dual		xx-xx-xx xx:xx	• <player>[level] vs <ambushed_player1>[level], <ambushed_player2>[level]
const TV = 'TV';	// caravan							xx-xx-xx xx:xx	• <player>[level] vs Caravan of xx
const C1 = 'C1';	// commander - duels				xx-xx-xx xx:xx	c <player1>[level] vs <player2>[level]
const C2 = 'C2';	// commander - group 2x2			xx-xx-xx xx:xx	c <player1>[level], <player2>[level] vs <player3>[level], <player4>[level]
const C3 = 'C3';	// commander - group 3x3			xx-xx-xx xx:xx	c <player1>[level], <player2>[level], <player3>[level] vs <player4>[level], <player5>[level], <player6>[level]
const XD = 'XD';	// misc - demons					xx-xx-xx xx:xx	 <player1>[level], <player2>[level], <player3>[level] vs Gate demons
					//									xx-xx-xx xx:xx	 <player1>[level], <player2>[level], <player3>[level] vs Infernals
					//									xx-xx-xx xx:xx	 <player1>[level], <player2>[level], <player3>[level] vs Infernals, Pandemonium leader
					//									xx-xx-xx xx:xx	 <player1>[level], <player2>[level], <player3>[level] vs Demon Portal guard
					//									xx-xx-xx xx:xx	Demon Portal guard vs <player>[level]
const XH = 'XH';	// misc - halloween					xx-xx-xx xx:xx	Dreadful nightmares vs <player>[level]
const XP = 'XP';	// misc - packmaster				xx-xx-xx xx:xx	<player>[level] vs Packmaster
					//									xx-xx-xx xx:xx	<player>[level] vs <ambushed_player>[level], Packmaster
const XR = 'XR';	// misc - rebels					xx-xx-xx xx:xx	Saboteur destructors vs <player1>[level], <player2>[level], <player3>[level]
					//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Rebel camp defenders-1
					//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Rebel camp defenders-2
					//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Rebel camp defenders-3
					//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Rebel camp defenders, Rebel ringleader
const XU = 'XU';	// misc - undead					xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Unholy venomancers
					//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Undead
					//									xx-xx-xx xx:xx	Undead vs <player>[level]
const XV = 'XV';	// misc - valentine					xx-xx-xx xx:xx	<player>[level] Valentine`s Card thieves
const XG = 'XG';	// dragon guards
const XX = 'XX';	// others

const HUNTS = 'Hunts';
const HST = 'Solo';
const HDT = 'Dual';
const HAT = 'Assist';
const HTT = 'Assisted';
const MERCENARY_MISSIONS = 'Mercenary Missions';
const MAT = 'Armies';
const MBT = 'Brigands';
const MCT = 'Conspirators';
const MIT = 'Invaders';
const MMT = 'Monsters';
const MRT = 'Raids';
const MVT = 'Vanguards';
const THIEF_AMBUSHES = 'Thief Ambushes';
const TGT = '1 Ambush';
const TPT = '1 Ambushed';
const TDT = '2 Ambush';
const TUT = '2 Ambushed';
const TVT = 'Caravans';
const COMMANDERS = 'Commanders';
const C1T = 'Duels';
const C2T = 'Group 2x2';
const C3T = 'Group 3x3';
const MISC = 'Miscellaneous';
const XDT = 'Demons';
const XHT = 'Halloween';
const XPT = 'Packmaster';
const XRT = 'Rebels';
const XUT = 'Undead';
const XVT = 'Valentine';
const XGT = 'Dragon Guards';
const XXT = 'Other';

const LOSS = '0';		// used in combat record
const WIN = '1';		// used in combat record
const LOSSES = 'L';		// used as id for the checkbox
const WINS = 'W';		// used as id for the checkbox

const AI = '@';			// indicator that opponent/ally is AI controlled
const HUMAN = '!';		// indicator that opponent/ally is human controlled
const SEPARATOR = '%';	// to separate multiple opponents/allies
const A_SEPARATOR = '#';// to separate different allies/opponents from each other

// combat levels
const COMBAT_LEVELS = 17;
const CL1 = '1';
const CL2 = '2';
const CL3 = '3';
const CL4 = '4';
const CL5 = '5';
const CL6 = '6';
const CL7 = '7';
const CL8 = '8';
const CL9 = '9';
const CL10 = '10';
const CL11 = '11';
const CL12 = '12';
const CL13 = '13';
const CL14 = '14';
const CL15 = '15';
const CL16 = '16';
const CL17 = '17';

const HG_COLOR = '#CCEECC';
const MG_COLOR = '#EEEECC';
const TG_COLOR = '#CCCCEE';
const CG_COLOR = '#EECCCC';
const MISC_COLOR = '#EEEEEE'; 

var player_id;						// this is the player id of the profile stats you're tracking
var combat_stats = new Array();		// this is the main array that stores the compact form of the combat records
var mercenary_stats = new Array();	// this array is for stats of mercenary missions
var update_from, update_to;			// timestamps reflecting the time range of the combat logs processed
var player_level;					// player level 
var opponents, allies;				// player names/AI involved in the same battle with the player
var warid;							// combat id
var div;
var center;

if (location.href.indexOf('pl_warlog.php') != -1) {
	combatStats();		// the current page is a combat log
	formatLogTable();
	combatAnalysis();
} else {
	profileStats();		// the current page is a character profile
}

// runs if the page is combat log
function combatStats() {
	
	var all_tds = document.getElementsByTagName('td');
	var combat_log_td;
	var combat_log_str = '<br><center>Combat log of <a';
	var combat_records;
	var current_combat_type;
	var mercenary_mission;
	var temp_array = new Array();	// used to temporarily split combat records and examine opponents and allies
	var tmep_array2 = new Array();
		
	for (var i = 0; i < all_tds.length; i++) {

		if (all_tds[i].innerHTML.indexOf(combat_log_str) != -1) {
			combat_log_td = all_tds[i];
			var player_pattern = /<br><center>Combat log of <a\D{0,}pl_info\.php\?id=(\d+)\D{0,}><b>(\w*\D*\w*)<\/b><\/a>/;
			combat_log_td.innerHTML.match(player_pattern);
			player_id = RegExp.$1;	// the player id is retrieved
			player_name = RegExp.$2;	// the player name is retrieved

			var continue_execution = collectStats();	// execution would continue only if we selected to track this profile stats
			if (!continue_execution) {
				return;
			}
	
			combat_records = combat_log_td.innerHTML.split('warlog.php\?');
			
			getCombatData();	// load all combat records we have previously stored

			for (var j = 1; j < combat_records.length; j++) {
				var vs_position = combat_records[j].indexOf(' vs ');
				var player_position = combat_records[j].indexOf('pl_info.php?id=' + player_id);
				var bold_tag_position;	// bold tag is the indicator of the combat winner
								
				// slicing will result in combat records in addition to other log pages links, which we will be filtering out
				if (vs_position == -1) {	
					continue;
				} 
				// commander combats uses the bold tag with letter c, we need to make sure the bold tag for the winner is calculated properly in this case
				if (combat_records[j].indexOf('<b>c</b>') == -1) {	
					bold_tag_position = combat_records[j].indexOf('<b>');
				} else {
					bold_tag_position = combat_records[j].indexOf('<b>', combat_records[j].indexOf('<b>c</b>') + 1);
				}
				
				var combat_result;
				// format the timestamp as yyyymmddhhmm				 
				var timestamp_pattern = /(\d{2})-(\d{2})-(\d{2})\D{0,}(\d{2}):(\d{2})/;
				combat_records[j].match(timestamp_pattern);
				combat_result = RegExp.$3 + RegExp.$1 + RegExp.$2 + RegExp.$4 + RegExp.$5;

				// initialize combat type to 'others' and then search below to set it properly, otherwise it will remain 'others'
				current_combat_type = XX;
				
				mercenary_mission = '';
				opponents = '';
				allies = '';
				combat_records[j].match(/warid=(\d+)\">/);
				warid = RegExp.$1;

				if(combat_records[j].search(/\(\d+\)/) != -1 ){						// hunt
					if (combat_records[j].indexOf(',') != -1) {
						var comma_pos = combat_records[j].indexOf(',');
						if (combat_records[j].split('(').length > 2) {				// dual hunt
							current_combat_type = HD;
							temp_array = combat_records[j].split(' vs ');
							temp_array[0].match(/>\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1;
							temp_array[0].match(/>(\w*\D*\w*\[\d+\])<\/a>/);
							allies = HUMAN + RegExp.$1; 
							temp_array2 = temp_array[1].split(',');
							temp_array2[0].match(/<i>(\D+ \(\d+\))<\/i>/);
							opponents = AI + RegExp.$1;
							temp_array2[1].match(/<i>(\D+ \(\d+\))<\/i>/);
							opponents += A_SEPARATOR + AI + RegExp.$1;
						} else if (player_position < comma_pos) {		
							current_combat_type = HT;								// you were assisted in a hunt
							temp_array = combat_records[j].split(',');
							temp_array2 = temp_array[1].split(' vs ');
							temp_array2[0].match(/>(\w*\D*\w*\[(\d+)\])<\/a>/);
							allies = HUMAN + RegExp.$1; 
							player_level = RegExp.$2; 
							temp_array2[1].match(/<i>(\D+ \(\d+\))<\/i>/);
							opponents = AI + RegExp.$1;
						} else {			
							current_combat_type = HA;								// you assisted a hunt
							temp_array = combat_records[j].split(',');
							temp_array[0].match(/>(\w*\D*\w*\[(\d+)\])<\/a>/);
							allies = HUMAN + RegExp.$1; 
							player_level = RegExp.$2; 
							temp_array2 = temp_array[1].split(' vs ');
							temp_array2[1].match(/<i>(\D+ \(\d+\))<\/i>/);
							opponents = AI + RegExp.$1;
						}	
					} else {
						current_combat_type = HS;									// solo hunt
						combat_records[j].match(/<i>(\D+ \(\d+\))<\/i>/);
						opponents = AI + RegExp.$1;
						combat_records[j].match(/>\w*\D*\w*\[(\d+)\]<\/font>/);
						player_level = RegExp.$1; 
					}
					
				} else if(combat_records[j].search(/\{\d+\}/) != -1 ){				// mercenary
					var search_str;
					if (combat_records[j].indexOf('Army') != -1) {					// mercenary - army
						current_combat_type = MA;
						combat_records[j].match(/Army.of.(\D{0,} \{\d+\})/);
						mercenary_mission = RegExp.$1;
					} else if (combat_records[j].indexOf('brigands') != -1) {		// mercenary - brigands
						current_combat_type = MB;
						combat_records[j].match(/\u2022.(\D{0,})-brigands( \{\d+\})/);
						mercenary_mission = RegExp.$1 + RegExp.$2;
						mercenary_mission = mercenary_mission.replace('<i>','');
						mercenary_mission = mercenary_mission.replace('<b>','');
					} else if (combat_records[j].indexOf('conspirators') != -1) {	// mercenary - conspirators
						current_combat_type = MC;
						combat_records[j].match(/vs (\D{0,}) - conspirators( \{\d+\})/);
						mercenary_mission = RegExp.$1 + RegExp.$2;
						mercenary_mission = mercenary_mission.replace('<i>','');
						mercenary_mission = mercenary_mission.replace('<b>','');
						mercenary_mission = mercenary_mission.replace(/,/g,'+');
					} else if (combat_records[j].indexOf('invaders') != -1) {		// mercenary - invaders
						current_combat_type = MI;
						combat_records[j].match(/vs (\D{0,})-invaders( \{\d+\})/);
						mercenary_mission = RegExp.$1 + RegExp.$2;
						mercenary_mission = mercenary_mission.replace('<i>','');
						mercenary_mission = mercenary_mission.replace('<b>','');
					} else if (combat_records[j].indexOf('monster') != -1) {		// mercenary - monster
						current_combat_type = MM;
						combat_records[j].match(/vs (\D{0,})-monster( \{\d+\})/);
						mercenary_mission = RegExp.$1 + RegExp.$2;
						mercenary_mission = mercenary_mission.replace('<i>','');
						mercenary_mission = mercenary_mission.replace('<b>','');
					} else if (combat_records[j].indexOf('raid') != -1) {			// mercenary - raid
						current_combat_type = MR;
						combat_records[j].match(/vs (\D{0,})-raid( \{\d+\})/);
						mercenary_mission = RegExp.$1 + RegExp.$2;
						mercenary_mission = mercenary_mission.replace('<i>','');
						mercenary_mission = mercenary_mission.replace('<b>','');
					} else if (combat_records[j].indexOf('Vanguard') != -1) {		// mercenary - vanguard
						current_combat_type = MV;
						combat_records[j].match(/Vanguard of (\D{0,})( \{\d+\})/);
						mercenary_mission = RegExp.$1 + RegExp.$2;
					}
					opponents = AI + mercenary_mission;
					combat_records[j].match(/>\w*\D*\w*\[(\d+)\]<\/font>/);
					player_level = RegExp.$1;
				} else if(combat_records[j].search(/\u2022/) != -1 ){				// thief
					if (combat_records[j].indexOf(',') != -1) {
						if (player_position < vs_position) {
							current_combat_type = TD								// you ambushed a dual
							temp_array = combat_records[j].split(' vs ');
							temp_array2 = temp_array[1].split(',');
							temp_array2[0].match(/>(\w*\D*\w*\[(\d+)\])<\/a>/);
							opponents = HUMAN + RegExp.$1;
							temp_array2[1].match(/>(\w*\D*\w*\[(\d+)\])<\/a>/);
							opponents += A_SEPARATOR + HUMAN + RegExp.$1;
							player_level = RegExp.$2; 
						} else {
							current_combat_type = TU;								// you were ambushed in a dual
							temp_array = combat_records[j].split(' vs ');
							temp_array[0].match(/>(\w*\D*\w*\[(\d+)\])<\/a>/);
							opponents = HUMAN + RegExp.$1;
							temp_array[1].match(/>(\w*\D*\w*\[(\d+)\])<\/a>/);
							allies = HUMAN + RegExp.$1;
							player_level = RegExp.$2; 
						}					
					} else if (combat_records[j].indexOf('Caravan') != -1) {
						current_combat_type = TV;									// caravan
						temp_array = combat_records[j].split(' vs ');
						temp_array[0].match(/>\w*\D*\w*\[(\d+)\]<\/font>/);
						player_level = RegExp.$1; 
						temp_array[1].match(/<i>Caravan.of.(\D*)<\/i>/);
						opponents = AI + RegExp.$1;
					} else {
						if (player_position < vs_position) {
							current_combat_type = TG;								// you ambushed a player
							temp_array = combat_records[j].split(' vs ');
							temp_array[1].match(/>(\w*\D*\w*\[(\d+)\])<\/a>/);
							opponents = HUMAN + RegExp.$1;
							player_level = RegExp.$2; 
						} else {
							current_combat_type = TP;								// you were ambushed by a player
							temp_array = combat_records[j].split(' vs ');
							temp_array[0].match(/>(\w*\D*\w*\[(\d+)\])<\/a>/);
							opponents = HUMAN + RegExp.$1;
							player_level = RegExp.$2; 
						}
					}
					
				} else if(combat_records[j].indexOf('<b>c</b>') != -1 ){			// commander
					switch (combat_records[j].split(',').length) {
					case 1:
						current_combat_type = C1;									// commander - duels
						combat_records[j].match(/>\w*\D*\w*\[(\d+)\]<\/font>/);
						player_level = RegExp.$1;
						combat_records[j].match(/>(\w*\D*\w*\[\d+\])<\/a>/);
						opponents = HUMAN + RegExp.$1;
						break;
					case 3:
						current_combat_type = C2;									// commander - group 2x2
						temp_array = combat_records[j].split(' vs ');
						if (temp_array[0].match(/>\w*\D*\w*\[\d+\]<\/font>/) != null) {
							temp_array[0].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array[0].match(/>(\w*\D*\w*\[\d+\])<\/a>/);
							allies = HUMAN + RegExp.$1;
							temp_array2 = temp_array[1].split(',');
						} else {
							temp_array[1].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array[1].match(/>(\w*\D*\w*\[\d+\])<\/a>/);
							allies = HUMAN + RegExp.$1;
							temp_array2 = temp_array[0].split(',');
						}
						temp_array2[0].match(/>(\w*\D*\w*\[\d+\])<\/a>/);
						opponents = HUMAN + RegExp.$1;
						temp_array2[1].match(/>(\w*\D*\w*\[\d+\])<\/a>/);
						opponents += A_SEPARATOR + HUMAN + RegExp.$1;
						break;
					case 5:
						current_combat_type = C3;									// commander - group 3x3
						temp_array = combat_records[j].split(' vs ');
						if (temp_array[0].match(/>\w*\D*\w*\[\d+\]<\/font>/) != null) {
							temp_array[0].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array2 = temp_array[0].split(',');
							for (var y = 0; y < temp_array2.length; y++) {
								if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
									allies += HUMAN + RegExp.$1 + A_SEPARATOR;
								}
							}
							allies = allies.substring(0, allies.length - 1);
							temp_array2 = temp_array[1].split(',');
						} else {
							temp_array[1].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array2 = temp_array[1].split(',');
							for (var y = 0; y < temp_array2.length; y++) {
								if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
									allies += HUMAN + RegExp.$1 + A_SEPARATOR;
								}
							}
							allies = allies.substring(0, allies.length - 1);
							temp_array2 = temp_array[0].split(',');
						}
						for (var y = 0; y < temp_array2.length; y++) {
							if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
								opponents += HUMAN + RegExp.$1 + A_SEPARATOR;
							}
						}
						opponents = opponents.substring(0, opponents.length - 1);
					}					
					
				} else {															// misc
					if ((combat_records[j].indexOf('Gate demons') != -1) || (combat_records[j].indexOf('Demon Portal guard') != -1) || (combat_records[j].indexOf('Infernals') != -1)) {
						current_combat_type = XD;									// misc - demons
						temp_array = combat_records[j].split(' vs ');
						if (temp_array[0].match(/\w*\D*\w*\[\d+\]<\/font>/) != null) {
							temp_array[0].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array2 = temp_array[0].split(',');
							for (var y = 0; y < temp_array2.length; y++) {
								if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
									allies += HUMAN + RegExp.$1 + A_SEPARATOR;
								}
							}
							allies = allies.substring(0, allies.length - 1);
							temp_array[1].match(/<i>(\w*\D*\w*)<\/i>/);
							opponents = AI + RegExp.$1;
						} else {
							temp_array[1].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array2 = temp_array[1].split(',');
							for (var y = 0; y < temp_array2.length; y++) {
								if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
									allies += HUMAN + RegExp.$1 + A_SEPARATOR;
								}
							}
							allies = allies.substring(0, allies.length - 1);
							temp_array[0].match(/<i>(\w*\D*\w*)<\/i>/);
							opponents = AI + RegExp.$1;
						}
					} else if (combat_records[j].indexOf('Dreadful nightmares') != -1) {
						current_combat_type = XH;									// misc - halloween
						combat_records[j].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
						player_level = RegExp.$1; 
						combat_records[j].match(/<i>(\w*\D*\w*)<\/i>/);
						opponents = AI + RegExp.$1;
					} else if (combat_records[j].indexOf('Packmaster') != -1) {
						current_combat_type = XP;									// misc - packmaster
						temp_array = combat_records[j].split(' vs ');
						if (temp_array[0].match(/>\w*\D*\w*\[\d+\]<\/font>/) != null) {
							temp_array[0].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array2 = temp_array[1].split(',');
						} else {
							temp_array[1].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array2 = temp_array[0].split(',');
							allies = AI + 'Packmaster';
						}
						for (var y = 0; y < temp_array2.length; y++) {
							if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
								opponents += HUMAN + RegExp.$1;
							}
							if (temp_array2[y].match(/<i>(\w*\D*\w*)<\/i>/)) {
								opponents += AI + RegExp.$1;
							}
						}
					} else if ((combat_records[j].indexOf('Rebel camp defenders') != -1) || (combat_records[j].indexOf('Saboteur destructors') != -1)) {
						current_combat_type = XR;									// misc - rebels
						temp_array = combat_records[j].split(' vs ');
						if (temp_array[0].indexOf('Saboteur') == -1) {
							temp_array[0].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array2 = temp_array[0].split(',');
							for (var y = 0; y < temp_array2.length; y++) {
								if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
									allies += HUMAN + RegExp.$1 + A_SEPARATOR;
								}
							}
							allies = allies.substring(0, allies.length - 1);
							temp_array[1].match(/<i>(\w*\D*\w*)<\/i>/);
							opponents = AI + RegExp.$1;
						} else {
							temp_array[1].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array2 = temp_array[1].split(',');
							for (var y = 0; y < temp_array2.length; y++) {
								if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
									allies += HUMAN + RegExp.$1 + A_SEPARATOR;
								}
							}
							allies = allies.substring(0, allies.length - 1);
							temp_array[0].match(/<i>(\w*\D*\w*)<\/i>/);
							opponents = AI + RegExp.$1;
						}
					} else if ((combat_records[j].indexOf('Undead') != -1) || (combat_records[j].indexOf('Unholy venomancers') != -1)) {
						current_combat_type = XU;									// misc - undead
						temp_array = combat_records[j].split(' vs ');
						if (temp_array[0].match(/\w*\D*\w*\[\d+\]<\/font>/) != null) {
							temp_array[0].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array2 = temp_array[0].split(',');
							for (var y = 0; y < temp_array2.length; y++) {
								if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
									allies += HUMAN + RegExp.$1 + A_SEPARATOR;
								}
							}
							allies = allies.substring(0, allies.length - 1);
							temp_array[1].match(/<i>(\w*\D*\w*)<\/i>/);
							opponents = AI + RegExp.$1;
						} else {
							temp_array[1].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array2 = temp_array[1].split(',');
							for (var y = 0; y < temp_array2.length; y++) {
								if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
									allies += HUMAN + RegExp.$1 + A_SEPARATOR;
								}
							}
							allies = allies.substring(0, allies.length - 1);
							temp_array[0].match(/<i>(\w*\D*\w*)<\/i>/);
							opponents = AI + RegExp.$1;
						}
					} else if (combat_records[j].indexOf('Valentine`s Card thieves') != -1) {
						current_combat_type = XV;									// misc - valentine
						combat_records[j].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
						player_level = RegExp.$1; 
						combat_records[j].match(/<i>(\w*\D*\w*)<\/i>/);
						opponents = AI + RegExp.$1;
					} else if (combat_records[j].indexOf('Dragon guards') != -1) {
						current_combat_type = XG;									// misc - dragon guards
						combat_records[j].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
						player_level = RegExp.$1; 
						combat_records[j].match(/<i>(\w*\D*\w*)<\/i>/);
						opponents = AI + RegExp.$1;
					} else if (combat_records[j].split(' vs ').length > 2) {
						combat_records[j].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
						player_level = RegExp.$1;
						temp_array = combat_records[j].split(' vs ');
						for (var y = 0; y < temp_array.length; y++) {
							if (temp_array[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
								opponents += HUMAN + RegExp.$1 + A_SEPARATOR;
							}
						}
						opponents = opponents.substring(0, opponents.length - 1); 
					} else {
						temp_array = combat_records[j].split(' vs ');
						if (temp_array[0].match(/\w*\D*\w*\[(\d+)\]<\/font>/) != null) {
							player_level = RegExp.$1; 
							temp_array2 = temp_array[0].split(',');
							for (var y = 0; y < temp_array2.length; y++) {
								if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
									allies += HUMAN + RegExp.$1 + A_SEPARATOR;
								}
							}
							allies = allies.substring(0, allies.length - 1);
							if (temp_array[1].match(/<i>(\w*\D*\w*)<\/i>/) != null) {
								opponents = AI + RegExp.$1;
							} else {
								temp_array2 = temp_array[1].split(',');
								for (var y = 0; y < temp_array2.length; y++) {
									if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
										opponents += HUMAN + RegExp.$1 + A_SEPARATOR;
									}
								}
								opponents = opponents.substring(0, opponents.length - 1);
							}
						} else {
							temp_array[1].match(/\w*\D*\w*\[(\d+)\]<\/font>/);
							player_level = RegExp.$1; 
							temp_array2 = temp_array[1].split(',');
							for (var y = 0; y < temp_array2.length; y++) {
								if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
									allies += HUMAN + RegExp.$1 + A_SEPARATOR;
								}
							}
							allies = allies.substring(0, allies.length - 1);
							if (temp_array[0].match(/<i>(\w*\D*\w*)<\/i>/) != null) {
								temp_array[0].match(/<i>(\w*\D*\w*)<\/i>/);
								opponents = AI + RegExp.$1;
							} else {
								temp_array2 = temp_array[0].split(',');
								for (var y = 0; y < temp_array2.length; y++) {
									if (temp_array2[y].match(/>(\w*\D*\w*\[\d+\])<\/a>/) != null) {
										opponents += HUMAN + RegExp.$1 + A_SEPARATOR;
									}
								}
								opponents = opponents.substring(0, opponents.length - 1);
							}
						}
					}
				}
				
				// add combat type to the combat record
				combat_result += current_combat_type;
				var temp_result;
				if (vs_position != -1) {
					if (combat_records[j].split(' vs ').length > 2) {				// everyone for oneself combat type has multiple 'vs'
						var n = combat_records[j].split(' vs ');
						temp_result = LOSS;
						for (var m = 0; m < n.length; m++) {
							if ((n[m].indexOf('pl_info.php?id=' + player_id) != -1) && (n[m].indexOf('<b>')) != -1 ) {
								temp_result = WIN;
							}
						}
					} else {				
						if (bold_tag_position > vs_position) {
							if (player_position > vs_position) {
								temp_result = WIN;
							} else {
								temp_result = LOSS;
							}		
						} else { if (player_position < vs_position) {
								temp_result = WIN;
							} else {
								temp_result = LOSS;
							}
						}
					}
				}

				player_level = encodePlayerLevel(player_level);
				// add combat record to the combat array
				createCombatStatRec(combat_result + temp_result + player_level + SEPARATOR + warid + SEPARATOR + allies + SEPARATOR + opponents);	

				// add mercenary record to the mercenary array
				if ((mercenary_mission.length > 0) && (temp_result == WIN)) {
					createMercenaryStatRec(current_combat_type + mercenary_mission + warid);
				}
			}
			
		}
	}
	// store combat data
	setCombatData();
}


//	runs if the current page is the character profile
function profileStats() { 

	// initialize all totals to zero
	var total_hunts = total_solo_hunts = total_dual_hunts = total_assist_hunts = total_assisted_hunts = 0;
	var won_hunts = won_solo_hunts = won_dual_hunts = won_assist_hunts = won_assisted_hunts = 0;
	var total_mercenaries = total_armies = total_brigands = total_conspirators = total_invaders = total_monsters = total_raids = total_vanguards = 0;
	var won_mercenaries = won_armies = won_brigands = won_conspirators = won_invaders = won_monsters = won_raids = won_vanguards = 0;
	var total_thief = total_ambushes = total_ambushed = total_ambush_duals = total_ambushed_duals = total_caravans = 0;
	var won_thief = won_ambushes = won_ambushed = won_ambush_duals = won_ambushed_duals = won_caravans = 0;
	var total_commander = total_commander1 = total_commander2 = total_commander3 = 0; 
	var won_commander = won_commander1 = won_commander2 = won_commander3 = 0; 
	var total_other = total_rebels = total_demons = total_packmaster = total_undead = total_halloween = total_valentine = total_dragons = total_misc = total_combats = 0;
	var won_other = won_rebels = won_demons = won_packmaster = won_undead = won_halloween = won_valentine = won_dragons = won_misc = won_combats = 0;
	var combat_type, combat_result;
	var armies = new Array();
	var brigands = new Array();
	var conspirators = new Array();
	var invaders = new Array();
	var monsters = new Array();
	var raids = new Array();
	var vanguards = new Array();
	
	var all_tables = document.getElementsByTagName('table');
	var stats_table, achievements_table;	// we will add the stats table immediately before the Achievements table
	
	for (var i = 0; i < all_tables.length; i++) {
		if ((all_tables[i].innerHTML.indexOf('Combat log [<a')!= -1)) {
			var player_id_pattern = /pl_warlog\.php\?id=(\d+)/;
			all_tables[i].innerHTML.match(player_id_pattern);
			player_id = RegExp.$1;		// retreive player id
		}
	}
	for (var i = 0; i < all_tables.length; i++) {
		if ((all_tables[i].innerHTML.indexOf('sms-create.php\?mailto')!= -1)) {
			var player_name_pattern = /mailto=(\w*\D*\w*)\">Write a message/;
			all_tables[i].innerHTML.match(player_name_pattern);
			player_name = RegExp.$1;	// retreive player name
		}		
	}
	
	removeCombatData();	// checks if stats are set to be deleted
	
	getCombatData();	// load stored combat data
	
	var continue_execution = collectStats();	// continue execution if we're tracking stats for the profile

	if (combat_stats.length != 0) {
		for (var i = 0; i < combat_stats.length; i++) {
			
			// parse combat type and its result to properly calculate totals
			combat_type = combat_stats[i].substr(10,2);
			combat_result = parseInt(combat_stats[i].substr(12,1));
			
			switch (combat_type) {
			case HS:		// solo hunt
				++total_hunts;
				++total_solo_hunts;
				won_hunts += combat_result;
				won_solo_hunts += combat_result;
				break;
				
			case HD:		// dual hunt
				++total_hunts;
				++total_dual_hunts;
				won_hunts += combat_result;
				won_dual_hunts += combat_result;
				break;

			case HA:		// you assisted a hunt
				++total_hunts;
				++total_assist_hunts;
				won_hunts += combat_result;
				won_assist_hunts += combat_result;
				break;

			case HT:		// you were assisted in a hunt
				++total_hunts;
				++total_assisted_hunts;
				won_hunts += combat_result;
				won_assisted_hunts += combat_result;
				break;

			case MA:		// mercenery - army
				++total_mercenaries;
				++total_armies;
				won_mercenaries += combat_result;
				won_armies += combat_result;
				break;

			case MB:		// mercenery - brigands
				++total_mercenaries;
				++total_brigands;
				won_mercenaries += combat_result;
				won_brigands += combat_result;
				break;

			case MC:		// mercenery - conspirators
				++total_mercenaries;
				++total_conspirators;
				won_mercenaries += combat_result;
				won_conspirators += combat_result;
				break;

			case MI:		// mercenery - invaders
				++total_mercenaries;
				++total_invaders;
				won_mercenaries += combat_result;
				won_invaders += combat_result;
				break;

			case MM:		// mercenery - monster
				++total_mercenaries;
				++total_monsters;
				won_mercenaries += combat_result;
				won_monsters += combat_result;
				break;

			case MR:		// mercenery - raid
				++total_mercenaries;
				++total_raids;
				won_mercenaries += combat_result;
				won_raids += combat_result;
				break;

			case MV:		// mercenery - vanguard
				++total_mercenaries;
				++total_vanguards;
				won_mercenaries += combat_result;
				won_vanguards += combat_result;
				break;

			case TG:		// you ambushed a player
				++total_thief;
				++total_ambushes;
				won_thief += combat_result;
				won_ambushes += combat_result;
				break;

			case TP:		// you were ambushed by a player
				++total_thief;
				++total_ambushed;
				won_thief += combat_result;
				won_ambushed += combat_result;
				break;

			case TD:		// you ambushed a dual
				++total_thief;
				++total_ambush_duals;
				won_thief += combat_result;
				won_ambush_duals += combat_result;
				break;

			case TU:		// you were ambushed in a dual
				++total_thief;
				++total_ambushed_duals;
				won_thief += combat_result;
				won_ambushed_duals += combat_result;
				break;

			case TV:		// caravan
				++total_thief;
				++total_caravans;
				won_thief += combat_result;
				won_caravans += combat_result;
				break;

			case C1:		// commander - duels
				++total_commander;
				++total_commander1;
				won_commander += combat_result;
				won_commander1 += combat_result;
				break;
				
			case C2:		// commander - group 2x2
				++total_commander;
				++total_commander2;
				won_commander += combat_result;
				won_commander2 += combat_result;
				break;
				
			case C3:		// commander - group 3x3
				++total_commander;
				++total_commander3;
				won_commander += combat_result;
				won_commander3 += combat_result;
				break;

			case XD:		// misc - demons
				++total_misc;
				++total_demons;
				won_misc += combat_result;
				won_demons += combat_result;
				break;

			case XH:		// misc - halloween
				++total_misc;
				++total_halloween;
				won_misc += combat_result;
				won_halloween += combat_result;
				break;

			case XP:		// misc - packmaster
				++total_misc;
				++total_packmaster;
				won_misc += combat_result;
				won_packmaster += combat_result;
				break;

			case XR:		// misc - rebels
				++total_misc;
				++total_rebels;
				won_misc += combat_result;
				won_rebels += combat_result;
				break;

			case XU:		// misc - undead
				++total_misc;
				++total_undead;
				won_misc += combat_result;
				won_undead += combat_result;
				break;

			case XV:		// misc - valentine
				++total_misc;
				++total_valentine;
				won_misc += combat_result;
				won_valentine += combat_result;
				break;

			case XG:		// misc - dragon guards
				++total_misc;
				++total_dragons;
				won_misc += combat_result;
				won_dragons += combat_result;
				break;

			case XX:		// others
				++total_misc;
				++total_other;
				won_misc += combat_result;
				won_other += combat_result;		
			}
			++total_combats;
			won_combats += combat_result;	
		}
	}
	if (mercenary_stats.length != 0) {
		
		for (var i = 0; i < mercenary_stats.length; i++) {
			// parse mercenary combat type and its result to properly group them
			combat_type = mercenary_stats[i].substr(0,2);
			combat_result = mercenary_stats[i].substr(2);
			
			switch (combat_type) {
			case MA:		// mercenery - army
				armies.push(combat_result);
				break;

			case MB:		// mercenery - brigands
				brigands.push(combat_result);
				break;

			case MC:		// mercenery - conspirators
				conspirators.push(combat_result.replace(/\+/g,','));
				break;

			case MI:		// mercenery - invaders
				invaders.push(combat_result);
				break;

			case MV:		// mercenery - vanguard
				vanguards.push(combat_result);
			
			}
		}
	}	

	var achievements_table_position;
	
	for (var i = 0; i < all_tables.length; i++) {
		if (all_tables[i].innerHTML.indexOf('<b>Achievements</b>') != -1) {
			achievements_table = all_tables[i];	
			achievements_table_position = achievements_table.innerHTML.indexOf('<table', achievements_table.innerHTML.indexOf('<b>Achievements</b>') - 200);
			break;
		}
	}
	if (achievements_table == null) {
		for (var i = 0; i < all_tables.length; i++) {
			if (all_tables[i].innerHTML.indexOf('<b>Personal info</b>') != -1) {
				achievements_table = all_tables[i];	
				achievements_table_position = achievements_table.innerHTML.indexOf('<table', achievements_table.innerHTML.indexOf('<b>Personal info</b>') - 200);
				break;
			}
		}
	}

	stats_table = "<table class=\"wblight\" align=\"center\" cellpadding=\"2\" cellspacing=\"0\" width=\"790\"><tbody><tr><td colspan =\"5\" class=\"wb\" align=\"center\" width=\"100%\"><b>Combat Statistics</b>"
	
	if (!continue_execution) {	// we are not tracking stats for this profile, simply display a message confirming that
		stats_table += "<br><br><i>No stats have been collected for this profile. If you want to collect them, click <b><a href = \"#\" onclick = \"var r=confirm('"
		stats_table += "To collect stats, you need to visit the combat log of the profile.\\nThe script will transparently process each log page you view.\\nPlease click ok to enable stats collection');"; 
		stats_table += "if (r==true) {document.cookie='" + player_name + " collectStats=1;expires=' + new Date('2020');"
		stats_table += "document.cookie='" + player_name + " autoStats=1';window.location.reload();} return false;\">here</a></b></i></td></tr>";
	} else {		// the totals table
		stats_table += "<br><font style=\"font-size:8px\">For combats played between: " + update_from + "  -  " + update_to
		stats_table += "<br><b>&lt;&lt;<a href = \"#\" onclick = \"var r=confirm('Please confirm you no longer want to keep combat stats for this profile');"
		stats_table += "if (r==true) {document.cookie='" + player_name + " removeStats=1';window.location.reload();} return false;\">Remove Stats</a>&gt;&gt;</font></td></tr>"
		stats_table += "<tr><td class=\"wb\" align=\"center\" width=\"20%\"><b>" + HUNTS + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"20%\"><b>" + MERCENARY_MISSIONS + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"20%\"><b>" + THIEF_AMBUSHES + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"20%\"><b>" + COMMANDERS + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"20%\"><b>" + MISC + "</b></td></tr>"
		
		// hunts subtotals
		stats_table += "<tr><td class=\"wb\" align=\"right\" width=\"20%\"><a href = \"#\" onclick = \"alert('" + explainStats(HS) + "'); return false;\">" + HST + "</a>:&nbsp;&nbsp;&nbsp;" + won_solo_hunts + "/" + total_solo_hunts
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(HD) + "'); return false;\">" + HDT + "</a>:&nbsp;&nbsp;&nbsp;" + won_dual_hunts + "/" + total_dual_hunts 
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(HA) + "'); return false;\">" + HAT + "</a>:&nbsp;&nbsp;&nbsp;" + won_assist_hunts + "/" + total_assist_hunts
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(HT) + "'); return false;\">" + HTT + "</a>:&nbsp;&nbsp;&nbsp;" + won_assisted_hunts + "/" + total_assisted_hunts

		// mercenary subtotals
		stats_table += "<td class=\"wb\" align=\"right\" width=\"20%\"><a href = \"#\" onclick = \"alert('" + explainStats(MA) + "'); return false;\">" + MAT + "</a>:&nbsp;&nbsp;&nbsp;" + won_armies + "/" + total_armies
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(MB) + "'); return false;\">" + MBT + "</a>:&nbsp;&nbsp;&nbsp;" + won_brigands + "/" + total_brigands
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(MC) + "'); return false;\">" + MCT + "</a>:&nbsp;&nbsp;&nbsp;" + won_conspirators + "/" + total_conspirators
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(MI) + "'); return false;\">" + MIT + "</a>:&nbsp;&nbsp;&nbsp;" + won_invaders + "/" + total_invaders
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(MM) + "'); return false;\">" + MMT + "</a>:&nbsp;&nbsp;&nbsp;" + won_monsters + "/" + total_monsters
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(MR) + "'); return false;\">" + MRT + "</a>:&nbsp;&nbsp;&nbsp;" + won_raids + "/" + total_raids
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(MV) + "'); return false;\">" + MVT + "</a>:&nbsp;&nbsp;&nbsp;" + won_vanguards + "/" + total_vanguards

		// thief subtotals
		stats_table += "<td class=\"wb\" align=\"right\" width=\"20%\"><a href = \"#\" onclick = \"alert('" + explainStats(TG) + "'); return false;\">" + TGT + "</a>:&nbsp;&nbsp;&nbsp;" + won_ambushes + "/" + total_ambushes
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(TP) + "'); return false;\">" + TPT + "</a>:&nbsp;&nbsp;&nbsp;" + won_ambushed + "/" + total_ambushed
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(TD) + "'); return false;\">" + TDT + "</a>:&nbsp;&nbsp;&nbsp;" + won_ambush_duals + "/" + total_ambush_duals
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(TU) + "'); return false;\">" + TUT + "</a>:&nbsp;&nbsp;&nbsp;" + won_ambushed_duals + "/" + total_ambushed_duals
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(TV) + "'); return false;\">" + TVT + "</a>:&nbsp;&nbsp;&nbsp;" + won_caravans + "/" + total_caravans
		
		// commander subtotals
		stats_table += "<td class=\"wb\" align=\"right\" width=\"20%\"><a href = \"#\" onclick = \"alert('" + explainStats(C1) + "'); return false;\">" + C1T + "</a>:&nbsp;&nbsp;&nbsp;" + won_commander1 + "/" + total_commander1
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(C2) + "'); return false;\">" + C2T + "</a>:&nbsp;&nbsp;&nbsp;" + won_commander2 + "/" + total_commander2
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(C3) + "'); return false;\">" + C3T + "</a>:&nbsp;&nbsp;&nbsp;" + won_commander3 + "/" + total_commander3

		// misc subtotals
		stats_table += "<td class=\"wb\" align=\"right\" width=\"20%\"><a href = \"#\" onclick = \"alert('" + explainStats(XD) + "'); return false;\">" + XDT + "</a>:&nbsp;&nbsp;&nbsp;" + won_demons + "/" + total_demons
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(XH) + "'); return false;\">" + XHT + "</a>:&nbsp;&nbsp;&nbsp;" + won_halloween + "/" + total_halloween
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(XP) + "'); return false;\">" + XPT + "</a>:&nbsp;&nbsp;&nbsp;" + won_packmaster + "/" + total_packmaster
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(XR) + "'); return false;\">" + XRT + "</a>:&nbsp;&nbsp;&nbsp;" + won_rebels + "/" + total_rebels
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(XU) + "'); return false;\">" + XUT + "</a>:&nbsp;&nbsp;&nbsp;" + won_undead + "/" + total_undead
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(XV) + "'); return false;\">" + XVT + "</a>:&nbsp;&nbsp;&nbsp;" + won_valentine + "/" + total_valentine
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(XG) + "'); return false;\">" + XGT + "</a>:&nbsp;&nbsp;&nbsp;" + won_dragons + "/" + total_dragons
		stats_table += "<br><a href = \"#\" onclick = \"alert('" + explainStats(XX) + "'); return false;\">" + XXT + "</a>:&nbsp;&nbsp;&nbsp;" + won_other + "/" + total_other

		// totals
		stats_table += "<tr><td class=\"wb\" align=\"right\" width=\"20%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + won_hunts + "/" + total_hunts
		stats_table += "<td class=\"wb\" align=\"right\" width=\"20%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + won_mercenaries + "/" + total_mercenaries
		stats_table += "<td class=\"wb\" align=\"right\" width=\"20%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + won_thief + "/" + total_thief
		stats_table += "<td class=\"wb\" align=\"right\" width=\"20%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + won_commander + "/" + total_commander
		stats_table += "<td class=\"wb\" align=\"right\" width=\"20%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + won_misc + "/" + total_misc
		
		// grand total
		stats_table += "<tr><td colspan =\"5\" class=\"wb\" align=\"center\" width=\"100%\">&nbsp;&nbsp;<b>Total Combats:&nbsp;&nbsp;&nbsp;" + won_combats + "/" + total_combats + "</b></td></tr></tbody></table>"
		
		
		// mercenary missions
		stats_table += "<table class=\"wblight\" align=\"center\" cellpadding=\"2\" cellspacing=\"0\" width=\"790\"><tbody><tr><td colspan =\"5\" class=\"wb\" align=\"center\" width=\"100%\"><b>Mercenary Statistics</b></td></tr>"
		stats_table += "<tr><td cclass=\"wb\" align=\"center\" width=\"17%\"><b>" + MAT + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"17%\"><b>" + MBT + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"32%\"><b>" + MCT + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"17%\"><b>" + MIT + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"17%\"><b>" + MVT + "</b></td></tr>"

		stats_table += "<tr><td class=\"wb\" align=\"right\" width=\"17%\">"
		if (armies.length > 0) {
			for (var z = 0; z < armies.length ; z++) {
				var warid = armies[z].match(/(\D{0,}\{\d+\})(\d+)/);
				stats_table += "<a href=\"http://www.lordswm.com/warlog.php?warid=" + RegExp.$2 + "\">" + RegExp.$1.charAt(0).toUpperCase() + RegExp.$1.slice(1) + "</a><br>";
			}
		} 
		stats_table += "</td>"

		stats_table += "<td class=\"wb\" align=\"right\" width=\"17%\">"
		if (brigands.length > 0) {
			for (var z = 0; z < brigands.length ; z++) {
				var warid = brigands[z].match(/(\D{0,}\{\d+\})(\d+)/);
				stats_table += "<a href=\"http://www.lordswm.com/warlog.php?warid=" + RegExp.$2 + "\">" + RegExp.$1.charAt(0).toUpperCase() + RegExp.$1.slice(1) + "</a><br>";
			}
		}
		stats_table += "</td>"
		
		stats_table += "<td class=\"wb\" align=\"right\" width=\"32%\">"
		if (conspirators.length > 0) {
			for (var z = 0; z < conspirators.length ; z++) {
				var warid = conspirators[z].match(/(\D{0,}\{\d+\})(\d+)/);
				stats_table += "<a href=\"http://www.lordswm.com/warlog.php?warid=" + RegExp.$2 + "\">" + RegExp.$1.charAt(0).toUpperCase() + RegExp.$1.slice(1) + "</a><br>";
			}
		}
		stats_table += "</td>"

		stats_table += "<td class=\"wb\" align=\"right\" width=\"17%\">"
		if (invaders.length > 0) {
			for (var z = 0; z < invaders.length ; z++) {
				var warid = invaders[z].match(/(\D{0,}\{\d+\})(\d+)/);
				stats_table += "<a href=\"http://www.lordswm.com/warlog.php?warid=" + RegExp.$2 + "\">" + RegExp.$1.charAt(0).toUpperCase() + RegExp.$1.slice(1) + "</a><br>";
			}
		}
		stats_table += "</td>"

		stats_table += "<td class=\"wb\" align=\"right\" width=\"17%\">"
		if (vanguards.length > 0) {
			for (var z = 0; z < vanguards.length ; z++) {
				var warid = vanguards[z].match(/(\D{0,}\{\d+\})(\d+)/);
				stats_table += "<a href=\"http://www.lordswm.com/warlog.php?warid=" + RegExp.$2 + "\">" + RegExp.$1.charAt(0).toUpperCase() + RegExp.$1.slice(1) + "</a><br>";
			}
		}
		stats_table += "</td></tr>"		
	}
	
	stats_table += "</tbody></table>";
	
	achievements_table.innerHTML = achievements_table.innerHTML.substring(0, achievements_table_position) + stats_table + achievements_table.innerHTML.substring(achievements_table_position);
}

// save combat data
function setCombatData() {
	var last_index;
	var stats_key = player_name + ' combat_stats';
	var mercenary_key = player_name + ' mercenary stats';
	var from_key = player_name + ' from';
	var to_key = player_name + ' to';

	//delete processed squashman battles
	//////////
	var len = combat_stats.length; 
	var removedBattlesCount = 0;
	for (var z = len - 1; z > 0; z--) {
		if ((combat_stats[z].substring(0,6) == '121031')
			&& (combat_stats[z].substring(10,12) == 'XX')) {
			combat_stats.splice(z, 1);
			removedBattlesCount++;
		}
	}
	if (removedBattlesCount > 0) {
		alert('Script has removed ' + removedBattlesCount + ' squashman battles from your log!');
	}
	//////////

	for (var z = 0; z < combat_stats.length; z++) {
		combat_stats[z] = combat_stats[z].replace(/,/g, '+');
	}
	combat_stats.sort();
	combat_stats.reverse();
	mercenary_stats.sort();
	last_index = combat_stats.length - 1;
	update_from = '20' + combat_stats[0].substr(0,2) + '-' + combat_stats[0].substr(2,2) + '-' + combat_stats[0].substr(4,2) + ' ' + combat_stats[0].substr(6,2) + ':' + combat_stats[0].substr(8,2);
	update_to = '20' + combat_stats[last_index].substr(0,2) + '-' + combat_stats[last_index].substr(2,2) + '-' + combat_stats[last_index].substr(4,2) + ' ' + combat_stats[last_index].substr(6,2) + ':' + combat_stats[last_index].substr(8,2);
	GM_setValue(stats_key, combat_stats.toString());
	GM_setValue(mercenary_key, mercenary_stats.toString());
	GM_setValue(from_key, update_from);
	GM_setValue(to_key, update_to);
}

// retrieve combat data
function getCombatData() {
	var stats_key = player_name + ' combat_stats';
	var mercenary_key = player_name + ' mercenary stats';
	var from_key = player_name + ' from';
	var to_key = player_name + ' to';
	var key_value = GM_getValue(stats_key, 0);
	if (key_value.length > 0) {
		combat_stats = key_value.split(',');
		for (var z = 0; z < combat_stats.length; z++) {
			combat_stats[z] = combat_stats[z].replace(/\+/g, ',');
		}
	}
	var key_value = GM_getValue(mercenary_key, 0);
	if (key_value.length > 0) {
		mercenary_stats = key_value.split(',');
	}
	update_from = GM_getValue(from_key, '');
	update_to = GM_getValue(to_key, '');
}

// this function removes combat data
function removeCombatData() {
	var remove_key = player_name + ' removeStats';
	var remove_stats = getCookie(remove_key);
	if (remove_stats == 0) {
		return;
	}
	var stats_key = player_name + ' combat_stats';
	var mercenary_key = player_name + ' mercenary stats';
	var from_key = player_name + ' from';
	var to_key = player_name + ' to';
	var collect_stats = player_name + ' collectStats';
	GM_deleteValue(stats_key);
	GM_deleteValue(mercenary_key);
	GM_deleteValue(from_key);
	GM_deleteValue(to_key);
	GM_deleteValue(collect_stats);
	document.cookie=player_name + ' collectStats=0;expires=' + new Date('1999');
	document.cookie=player_name + ' removeStats=0;expires=' + new Date('1999');
	document.cookie=player_name + ' autoStats=0;expires=' + new Date('1999');
}


// this function returns the value of a stored cookie
function getCookie(cookie_key) {
	var i,x,y,ARRcookies=document.cookie.split(';');
	for (i=0;i<ARRcookies.length;i++) {
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf('='));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf('=')+1);
		x=x.replace(/^\s+|\s+$/g,'');
		if (x==cookie_key) {
			return unescape(y);
		}
	}
	return 0;
}

// this function adds the combat record to the combat array
function createCombatStatRec(new_record) {
	for (var z = 0; z < combat_stats.length; z++) {
		if (combat_stats[z].substring(0,10) == new_record.substring(0,10)) {
			// this is important for selfcorrection/upgrade from earlier versions of the script
			if (combat_stats[z] != new_record) {	
				combat_stats[z] = new_record;
			}
			return;
		}
	}
	combat_stats.push(new_record);
}

// this function adds the mercenary record to the mercenary array
function createMercenaryStatRec(new_record) {
	var add_record = true;
	var found = false;
	new_record.match(/(\D{0,})\{(\d+)\}/);
	var mercenary_mission = RegExp.$1;
	var mercenary_level = parseInt(RegExp.$2);
	for (var z = 0; z < mercenary_stats.length; z++) {
		mercenary_stats[z].match(/(\D{0,})\{(\d+)\}/);
		if (mercenary_mission == RegExp.$1) {
			if  (mercenary_level > parseInt(RegExp.$2)) {
				mercenary_stats[z] = new_record;
				return;
			}
			add_record = false;
		}	
	}
	if (add_record) {
		mercenary_stats.push(new_record);
	}
}

// this function indicates if we're tracking stats for the profile
function collectStats() {
	var stats_cookie = getCookie(player_name + ' collectStats');
	var collect_stats = GM_getValue(player_name + ' collectStats', 0);
	if ((stats_cookie == 0) && (collect_stats == 0)){
		return false;
	}
	if (stats_cookie != 0) {
		GM_setValue(player_name + ' collectStats', '1');
		document.cookie=player_name + ' collectStats=0;expires=' + new Date('1999');
	}
	return true;
}

// this function provides short help for collected stats items
function explainStats (explain_item) {
	var help_msg = '';
	var explain_numbers = '\\nThe number on the left indicates count of wins,\\nand the number on the right indicates count of combats.';
	switch (explain_item) {
		case HS:		// solo hunt
			help_msg = 'Solo hunts are the regular hunts you do on your own.';
			break;

		case HD:		// dual hunt
			help_msg = 'Dual hunts are when you randomly join another hunter\\nand you both hunt together both the sets of monsters\\nyou chose to hunt initially.';
			break;

		case HA:		// you assisted a hunt
			help_msg = 'Assist hunts are the hunts you join to help another hunter.';
			break;

		case HT:		// you were assisted in a hunt
			help_msg = 'Assisted hunts are the hunts you ask another hunter to help you with.';
			break;

		case MA:		// mercenery - army
			help_msg = 'Army mercenary missions.';
			break;

		case MB:		// mercenery - brigands
			help_msg = 'Brigand mercenary missions.';
			break;

		case MC:		// mercenery - conspirators
			help_msg = 'Conspirators mercenary missions.';
			break;

		case MI:		// mercenery - invanders
			help_msg = 'Invaders mercenary missions.';
			break;

		case MM:		// mercenery - monster
			help_msg = 'Monster mercenary missions.';
			break;

		case MR:		// mercenery - raid
			help_msg = 'Raid mercenary missions.';
			break;

		case MV:		// mercenery - vanguard
			help_msg = 'Vanguard mercenary missions.';
			break;

		case TG:		// you ambushed a player
			help_msg = 'One player was ambushed.';
			break;

		case TP:		// you were ambushed by a player
			help_msg = 'Player is ambushed by a thief\\n(this is not considered a TG mission).';
			break;

		case TD:		// you ambushed a dual
			help_msg = 'Two players were ambushed.';
			break;

		case TU:		// you were ambushed in a dual
			help_msg = 'Player is ambushed with another player by a thief\\n(this is not considered a TG mission).';
			break;

		case TV:		// caravan
			help_msg = 'Caravan mission.';
			break;

		case C1:		// commander - duels
			help_msg = 'Duel commander combat.';
			break;
			
		case C2:		// commander - group 2x2
			help_msg = 'Group 2x2 commander combat.';
			break;
			
		case C3:		// commander - group 3x3
			help_msg = 'Group 3x3 commander combat.';
			break;

		case XD:		// misc - demons
			help_msg = 'Demons event, includes the following combat types:\\nGate demons, Demon Portal guard, and Infernals, Pandemonium leader.';
			break;

		case XH:		// misc - halloween
			help_msg = 'Halloween event, includes the following combat type:\\nDreadful nightmares.';
			break;

		case XP:		// misc - packmaster
			help_msg = 'Packmaster event.';
			break;

		case XR:		// misc - rebels
			help_msg = 'Rebels event, includes the following combat type:\\nRebel camp defenders, Rebel ringleader, and Saboteur destructors.';
			break;

		case XU:		// misc - undead
			help_msg = 'Undead event, includes the following combat type:\\nUndead and Unholy venomancers.';
			break;

		case XV:		// misc - valentine
			help_msg = 'Valentine`s Card thieves event.';
			break;

		case XG:		// misc - dragon guards
			help_msg = 'Dragon Guards in Ridge of Hope.';
			break;

		case XX:		// others
			help_msg = 'All remaining combat types that were not covered in the other categories\\nsuch as: Tournaments, non-CG PVP...etc.';

			}
	if (help_msg != '') {
		help_msg += explain_numbers;
		return help_msg;
	}
	
}

function encodePlayerLevel(current_code) {
	switch(current_code) {
		case '10':
			return 'A';
		case '11':
			return 'B';
		case '12':
			return 'C';
		case '13':
			return 'D';
		case '14':
			return 'E';
		case '15':
			return 'F';
		case '16':
			return 'G';
		case '17':
			return 'H';
	}
	return current_code;
}

function decodePlayerLevel(current_code) {
	switch(current_code) {
		case 'A':
			return '10';
		case 'B':
			return '11';
		case 'C':
			return '12';
		case 'D':
			return '13';
		case 'E':
			return '14';
		case 'F':
			return '15';
		case 'G':
			return '16';
		case 'H':
			return '17';
	}
	return current_code;
}

function combatAnalysis() {
	var split_record = new Array();
	var all_centers = document.body.getElementsByTagName('center');
	var original_center;
	for (var i = 0; i < all_centers.length; i++) {
		if (all_centers[i].innerHTML.indexOf('Combat log of ') != -1) {
			original_center = all_centers[i];
		}
	}
	original_center.innerHTML.match(/<b>(\w*\D*\w*)<\/b><\/a>/);
	player_name = RegExp.$1;
	
	var continue_execution = collectStats();	// execution would continue only if we selected to track this profile stats
	if (!continue_execution) {
		return;
	}
	center = document.createElement('center');
	original_center.parentNode.insertBefore(center, original_center.nextSibling );
	var el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', displayAnalysisTable, false);
	el.setAttribute('value', 'Display Analysis Table');
	center.appendChild(el);
	center.appendChild(document.createElement('br'));

	div = document.createElement('div');
	div.id = 'AnalysisTable';
	div.style.display = 'none';

	// filters table
	var filters = document.createElement('table');
	filters.className = 'wbwhite';
	filters.width = '1000';
	filters.cellPadding = '10';
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.colSpan = '4';
	td.appendChild(document.createTextNode('Select criteria for the analysis you\'d like to perform:'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.align = 'right';
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', selectCombatCheckboxes, false);
	el.setAttribute('value', 'Select All');
	td.appendChild(el);
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', deselectCombatCheckboxes, false);
	el.setAttribute('value', 'Deselect All');
	td.appendChild(el);
	tr.appendChild(td);
	
	filters.appendChild(tr);
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.align = 'center';
	td.className = 'wb';
	td.innerHTML = HUNTS.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.align = 'center';
	td.className = 'wb';
	td.innerHTML = MERCENARY_MISSIONS.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.align = 'center';
	td.className = 'wb';
	td.innerHTML = THIEF_AMBUSHES.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.align = 'center';
	td.className = 'wb';
	td.innerHTML = COMMANDERS.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.align = 'center';
	td.className = 'wb';
	td.innerHTML = MISC.bold();
	tr.appendChild(td);

	filters.appendChild(tr);
	

	// hunt filters
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.className = 'wb';
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = HS;
	td.appendChild(el);
	td.appendChild(document.createTextNode(HST));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = HD;
	td.appendChild(el);
	td.appendChild(document.createTextNode(HDT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = HA;
	td.appendChild(el);
	td.appendChild(document.createTextNode(HAT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = HT;
	td.appendChild(el);
	td.appendChild(document.createTextNode(HTT));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);

	// mercenary mission filters
	td = document.createElement('td');
	td.className = 'wb';
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = MA;
	td.appendChild(el);
	td.appendChild(document.createTextNode(MAT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = MB;
	td.appendChild(el);
	td.appendChild(document.createTextNode(MBT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = MC;
	td.appendChild(el);
	td.appendChild(document.createTextNode(MCT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = MI;
	td.appendChild(el);
	td.appendChild(document.createTextNode(MIT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = MM;
	td.appendChild(el);
	td.appendChild(document.createTextNode(MMT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = MR;
	td.appendChild(el);
	td.appendChild(document.createTextNode(MRT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = MV;
	td.appendChild(el);
	td.appendChild(document.createTextNode(MVT));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);
	filters.appendChild(tr);

	// thief filters
	td = document.createElement('td');
	td.className = 'wb';
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = TG;
	td.appendChild(el);
	td.appendChild(document.createTextNode(TGT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = TP;
	td.appendChild(el);
	td.appendChild(document.createTextNode(TPT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = TD;
	td.appendChild(el);
	td.appendChild(document.createTextNode(TDT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = TU;
	td.appendChild(el);
	td.appendChild(document.createTextNode(TUT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = TV;
	td.appendChild(el);
	td.appendChild(document.createTextNode(TVT));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);
	filters.appendChild(tr);

	// commanders filters
	td = document.createElement('td');
	td.className = 'wb';
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = C1;
	td.appendChild(el);
	td.appendChild(document.createTextNode(C1T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = C2;
	td.appendChild(el);
	td.appendChild(document.createTextNode(C2T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = C3;
	td.appendChild(el);
	td.appendChild(document.createTextNode(C3T));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);
	filters.appendChild(tr);

	// misc filters
	td = document.createElement('td');
	td.className = 'wb';
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = XD;
	td.appendChild(el);
	td.appendChild(document.createTextNode(XDT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = XH;
	td.appendChild(el);
	td.appendChild(document.createTextNode(XHT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = XP;
	td.appendChild(el);
	td.appendChild(document.createTextNode(XPT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = XR;
	td.appendChild(el);
	td.appendChild(document.createTextNode(XRT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = XU;
	td.appendChild(el);
	td.appendChild(document.createTextNode(XUT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = XV;
	td.appendChild(el);
	td.appendChild(document.createTextNode(XVT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = XG;
	td.appendChild(el);
	td.appendChild(document.createTextNode(XGT));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = XX;
	td.appendChild(el);
	td.appendChild(document.createTextNode(XXT));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);
	filters.appendChild(tr);
	
	// combat levels
	td = document.createElement('td');
	tr = document.createElement('tr');
	td.colSpan = '4';
	td.appendChild(document.createTextNode('Combat levels:\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL1;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL1) + '\u00a0\u00a0\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL2;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL2) + '\u00a0\u00a0\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL3;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL3) + '\u00a0\u00a0\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL4;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL4) + '\u00a0\u00a0\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL5;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL5) + '\u00a0\u00a0\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL6;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL6) + '\u00a0\u00a0\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL7;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL7) + '\u00a0\u00a0\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL8;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL8) + '\u00a0\u00a0\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL9;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL9) + '\u00a0\u00a0\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL10;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL10) + '\u00a0\u00a0\u00a0\u00a0\u00a0'));
	td.appendChild(document.createElement('br'));
	var space = '';
	for (x = 0; x < 48; x++) {
		space += '\u00a0';
	}
	td.appendChild(document.createTextNode(space));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL11;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL11) + '\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL12;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL12) + '\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL13;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL13) + '\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL14;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL14) + '\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL15;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL15) + '\u00a0\u00a0\u00a0'));
/* 	uncomment when further combat levels are implemented
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL16;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL16) + '\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CL17;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(decodePlayerLevel(CL17) + '\u00a0\u00a0\u00a0'));
 */
	tr.appendChild(td);
	
	td = document.createElement('td');
	td.align = 'right';
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', selectCLCheckboxes, false);
	el.setAttribute('value', 'Select All');
	td.appendChild(el);
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', deselectCLCheckboxes, false);
	el.setAttribute('value', 'Deselect All');
	td.appendChild(el);
	tr.appendChild(td);
	filters.appendChild(tr);

	// date and time filters
	td = document.createElement('td');
	tr = document.createElement('tr');
	td.className = 'wb';
	td.colSpan = '5';
	td.appendChild(document.createTextNode('Combats played from:\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	el = document.createElement('input');
	el.type = 'input'; 
	el.id = 'from_date';
	el.value = '';
	el.setAttribute('size', 16);
	td.appendChild(el);
	td.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0to\u00a0\u00a0\u00a0\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	el = document.createElement('input');
	el.type = 'input'; 
	el.id = 'to_date';
	el.value = '';
	el.setAttribute('size', 16);
	td.appendChild(el);
	td.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0Formatted as \"yyyy-mm-dd hh:mm\" for example: 2011-12-31 23:59'));
	tr.appendChild(td);
	filters.appendChild(tr);
	
	// allies
	td = document.createElement('td');
	tr = document.createElement('tr');
	td.className = 'wb';
	td.colSpan = '5';
	td.appendChild(document.createTextNode('Allies played with:\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	el = document.createElement('input');
	el.type = 'input'; 
	el.id = 'allies';
	el.value = '';
	el.setAttribute('size', 16);
	td.appendChild(el);
	td.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0Filter by name of player you played with (AI can be used as well, for example: packmaster)'));
	tr.appendChild(td);
	filters.appendChild(tr);

	// opponents
	td = document.createElement('td');
	tr = document.createElement('tr');
	td.className = 'wb';
	td.colSpan = '5';
	td.appendChild(document.createTextNode('Opponents played against:\u00a0\u00a0\u00a0\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	el = document.createElement('input');
	el.type = 'input'; 
	el.id = 'opponents';
	el.value = '';
	el.setAttribute('size', 16);
	td.appendChild(el);
	td.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0Filter by name of player you played against (AI can be used as well, for example: necromancer)'));
	tr.appendChild(td);
	filters.appendChild(tr);

	// combat results
	td = document.createElement('td');
	tr = document.createElement('tr');
	td.colSpan = '2';
	td.className = 'wb';
	td.appendChild(document.createTextNode('Combat Results:\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = LOSSES;
	td.appendChild(el);
	td.appendChild(document.createTextNode('Losses\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = WINS;
	td.appendChild(el);
	td.appendChild(document.createTextNode('Wins'));
	tr.appendChild(td);
	td = document.createElement('td');
	td.colSpan = '2';
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = 'colors';
	td.appendChild(el);
	td.appendChild(document.createTextNode('Use colors to format analysis table'));
	tr.appendChild(td);
	td = document.createElement('td');
	td.align = 'right';
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', performAnalysis, false);
	el.setAttribute('value', 'Perform Analysis');
	td.appendChild(el);
	tr.appendChild(td);
	filters.appendChild(tr);

	div.appendChild(document.createElement('br'));
	div.appendChild(filters);
	div.appendChild(document.createElement('br'));
	
	center.appendChild(div);
	
	selectAllCheckBoxes();
	
}

function displayAnalysisTable () {
	if(div.style.display == 'block') {
		div.style.display = 'none';
	} else {
		div.style.display = 'block';
	}
}

function selectCombatCheckboxes () {
	var all_input = document.getElementsByTagName('input');

	for (var z = 0; z < all_input.length; z++) { 
		if ((all_input[z].type == 'checkbox') && (all_input[z].checked == false)) {
			switch (all_input[z].id) {
				case HS:case HD:case HA:case HT:
				case MA:case MB:case MC:case MI:case MM:case MR:case MV:
				case TG:case TP:case TD:case TU:case TV:
				case C1:case C2:case C3:
				case XD:case XH:case XP:case XR:case XU:case XV:case XG:case XX:
					all_input[z].checked = true;
			}
		}
	}
}

function deselectCombatCheckboxes () {
	var all_input = document.getElementsByTagName('input');

	for (var z = 0; z < all_input.length; z++) { 
		if ((all_input[z].type == 'checkbox') && (all_input[z].checked == true)) {
			switch (all_input[z].id) {
				case HS:case HD:case HA:case HT:
				case MA:case MB:case MC:case MI:case MM:case MR:case MV:
				case TG:case TP:case TD:case TU:case TV:
				case C1:case C2:case C3:
				case XD:case XH:case XP:case XR:case XU:case XV:case XG:case XX:
					all_input[z].checked = false;
			}
		}
	}
}

function selectCLCheckboxes () {
	var all_input = document.getElementsByTagName('input');

	for (var z = 0; z < all_input.length; z++) { 
		if ((all_input[z].type == 'checkbox') && (all_input[z].checked == false)) {
			switch (all_input[z].id) {
				case CL1:case CL2:case CL3:case CL4:case CL5:
				case CL6:case CL7:case CL8:case CL9:case CL10:
				case CL11:case CL12:case CL13:case CL14:case CL15:
				//case CL16:case CL17:
					all_input[z].checked = true;
			}
		}
	}
}

function deselectCLCheckboxes () {
	var all_input = document.getElementsByTagName('input');

	for (var z = 0; z < all_input.length; z++) { 
		if ((all_input[z].type == 'checkbox') && (all_input[z].checked == true)) {
			switch (all_input[z].id) {
				case CL1:case CL2:case CL3:case CL4:case CL5:
				case CL6:case CL7:case CL8:case CL9:case CL10:
				case CL11:case CL12:case CL13:case CL14:case CL15:
				//case CL16:case CL17:
					all_input[z].checked = false;
			}
		}
	}
}

function selectAllCheckBoxes() {
	selectCombatCheckboxes();
	selectCLCheckboxes();
	document.getElementById(LOSSES).checked = true;
	document.getElementById(WINS).checked = true;
	document.getElementById('colors').checked = GM_getValue('colors', true);
}

function performAnalysis() {
	var temp_table = document.getElementById('report_table');
	if (temp_table != null) {
		div.removeChild(temp_table);
	}
	temp_table = document.getElementById('summary_table');
	if (temp_table != null) {
		div.removeChild(temp_table);
	}
	var allies_filter = document.getElementById('allies').value;
	var opponents_filter = document.getElementById('opponents').value;
	var losses_filter = document.getElementById(LOSSES).checked;
	var wins_filter = document.getElementById(WINS).checked;
	var from_date_filter = '';
	var to_date_filter = '';
	var tbl = document.createElement('table');
	var temp_array = new Array();
	var wins = losses = 0;
	var summary_table;
	GM_setValue('colors', document.getElementById('colors').checked);
	
	if (document.getElementById('from_date').value != '') {
		if (document.getElementById('from_date').value.match(/(\d{4})-(\d{2})-(\d{2})\D{0,}(\d{2}):(\d{2})/) == null) {
			alert('To filter combats between specific timestamps, you must supply the parameters in the correct format:\n\"yyyy-mm-dd hh:mm\" for example: 2011-12-31 23:59\n\"From Date\" does not match the expected format');
			return;
		} else {
			from_date_filter = parseInt(RegExp.$1 + RegExp.$2 + RegExp.$3 + RegExp.$4 + RegExp.$5);
		}
	}
	if (document.getElementById('to_date').value != '') {
		if (document.getElementById('to_date').value.match(/(\d{4})-(\d{2})-(\d{2})\D{0,}(\d{2}):(\d{2})/) == null) {
			alert('To filter combats between specific timestamps, you must supply the parameters in the correct format:\n\"yyyy-mm-dd hh:mm\" for example: 2011-12-31 23:59\n\"To Date\" does not match the expected format');
			return;
		} else {
			to_date_filter = parseInt(RegExp.$1 + RegExp.$2 + RegExp.$3 + RegExp.$4 + RegExp.$5);
		}
	}
	
	tbl.className = 'wb';
	tbl.width = '80%';
	tbl.cellPadding = '4';
	tbl.id = 'report_table';
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.className = 'wb';
	td.colSpan = '3';
	var cell_class = 'wbwhite'
	td.className = cell_class;
	td.align = 'center';
	td.innerHTML = 'Combat Analysis for <a href = "http://www.lordswm.com/pl_info.php?nick=' + player_name + '"><b>' + player_name + '</b></a>';
	tr.appendChild(td);
	tbl.appendChild(tr);

	// header
	tr = document.createElement('tr');
	tr.innerHTML = '<td class="' + cell_class + '" align="center"><b>Timestamp</b></td><td class="' + cell_class + '" align="center"><b>Combat Type</b></td>'
	tr.innerHTML += '<td class="' + cell_class + '" align="center"><b>Combat Description</b></td>'
	tbl.appendChild(tr);

	var temp_timestamp;
	var temp_combat_type;
	var temp_combat_result;
	var temp_player_level;
	var temp_warid;
	var temp_allies = new Array();
	var temp_opponents = new Array();
	var allies_link;
	var opponents_link;
	var combat_description;

	for (var i = 0; i < combat_stats.length; i++) {
		temp_timestamp = 0;
		temp_combat_type = '';
		temp_combat_result = '';
		temp_player_level = '';
		temp_warid = '';
		temp_allies = new Array();
		temp_opponents = new Array();
		allies_link = '';
		opponents_link = '';
		combat_description = '';
		temp_array = combat_stats[i].split(SEPARATOR);			// temp_array[0] = timestamp + combat_type + combat_result + player_level
																// temp_array[1] = warid
																// temp_array[2] = allies
																// temp_array[3] = opponents
		temp_timestamp = parseInt('20' + temp_array[0].substr(0,10));
		// from date condition check
		if ((from_date_filter != '') && (temp_timestamp < from_date_filter)) {
			continue;
		}
		// to date condition check
		if ((to_date_filter != '') && (temp_timestamp > to_date_filter)) {
			continue;
		}
		temp_combat_type = temp_array[0].substr(10,2);
		// combat type filter check
		if (document.getElementById(temp_combat_type).checked != true) {
			continue;
		}
		temp_combat_result = temp_array[0].substr(12,1);
		// losses filter check
		if ((document.getElementById(LOSSES).checked != true) && (temp_combat_result == LOSS)) {
			continue;
		}
		//wins filter check
		if ((document.getElementById(WINS).checked != true) && (temp_combat_result == WIN)) {
			continue;
		}
		temp_player_level = decodePlayerLevel(temp_array[0].substr(13,1));
		// player level filter check
		if (document.getElementById(temp_player_level).checked != true) {
			continue;
		}
		temp_warid = temp_array[1];
		// allies filter check
		if ((allies_filter != '') && (temp_array[2].toLowerCase().replace(A_SEPARATOR,'').replace(A_SEPARATOR,'').replace(HUMAN,'').replace(HUMAN,'').replace(AI,'').match(allies_filter.toLowerCase()) == null)) {
			continue;
		}
		if (temp_array[2] != '') {
			temp_allies = temp_array[2].split(A_SEPARATOR);
			allies_link = '';
			for (var x = 0; x < temp_allies.length; x++) {
				if (temp_allies[x].substring(0,1) == HUMAN) {
					temp_allies[x].substring(1).match(/(\w*\D*\w*)\[\d+\]/);
					allies_link += '<a href="http://www.lordswm.com/pl_info.php?nick=' + RegExp.$1 + '">' + temp_allies[x].substring(1) + '</a>, ';
				} else {
					allies_link += '<i>' + temp_allies[x].substring(1) + '</i>, ';
				}
			}
			allies_link = '<a href="http://www.lordswm.com/pl_info.php?nick=' + player_name + '"><font color = "red">' + player_name + '[' + temp_player_level + ']' + '</font></a>, ' + allies_link.substring(0, allies_link.length - 2);
		} else {
			allies_link = '<a href="http://www.lordswm.com/pl_info.php?nick=' + player_name + '"><font color = "red">' + player_name + '[' + temp_player_level + ']' + '</font></a>';
		}
		// opponents filter check
		if ((opponents_filter != '') && (temp_array[3].toLowerCase().replace(A_SEPARATOR,'').replace(A_SEPARATOR,'').replace(HUMAN,'').replace(HUMAN,'').replace(AI,'').match(opponents_filter.toLowerCase()) == null)) {
			continue;
		}
		if (temp_array[3] != '') {
			temp_opponents = temp_array[3].split(A_SEPARATOR);
			opponents_link = '';
			for (var x = 0; x < temp_opponents.length; x++) {
				if (temp_opponents[x].substring(0,1) == HUMAN) {
					temp_opponents[x].substring(1).match(/(\w*\D*\w*)\[\d+\]/);
					opponents_link += '<a href="http://www.lordswm.com/pl_info.php?nick=' + RegExp.$1 + '">' + temp_opponents[x].substring(1) + '</a>, ';
				} else {
					switch (temp_combat_type) {
						case MA:
							opponents_link += '<i>Army of ' + temp_opponents[x].substring(1) + '</i>, ';
							break;
						case MB:
							temp_opponents[x].substring(1).match(/(\D*)( {\d*})/);
							opponents_link += '<i>' + RegExp.$1 + '-brigands' + RegExp.$2 + '</i>, ';
							break;
						case MC:
							temp_opponents[x].substring(1).match(/(\D*)( {\d*})/);
							opponents_link += '<i>' + RegExp.$1 + ' - conspirators' + RegExp.$2 + '</i>, ';
							break;
						case MI:
							temp_opponents[x].substring(1).match(/(\D*)( {\d*})/);
							opponents_link += '<i>' + RegExp.$1 + '-invaders' + RegExp.$2 + '</i>, ';
							break;
						case MM:
							temp_opponents[x].substring(1).match(/(\D*)( {\d*})/);
							opponents_link += '<i>' + RegExp.$1 + '-monster' + RegExp.$2 + '</i>, ';
							break;
						case MR:
							temp_opponents[x].substring(1).match(/(\D*)( {\d*})/);
							opponents_link += '<i>' + RegExp.$1 + '-raid' + RegExp.$2 + '</i>, ';
							break;
						case MA:
							opponents_link += '<i>Vanguard of ' + temp_opponents[x].substring(1) + '</i>, ';
							break;
						case TV:
							opponents_link += '<i>Caravan of ' + temp_opponents[x].substring(1) + '</i>, ';
							break;
						default:
					opponents_link += '<i>' + temp_opponents[x].substring(1) + '</i>, ';
					}
				}
			}
			opponents_link = opponents_link.replace(/\+/g, ',').substring(0, opponents_link.length - 2);
		}
		if (temp_combat_result == WIN) {
			allies_link = '<b>' + allies_link + '</b>';
			wins++;
		} else {
			opponents_link = '<b>' + opponents_link + '</b>';
			losses++;
		}
		combat_description = allies_link + ' vs ' + opponents_link;
		if (document.getElementById('colors').checked == false) {
			if (cell_class == 'wbwhite') {
				cell_class = 'wblight';
			} else {
				cell_class = 'wbwhite';
			}
		} else {
			switch (temp_combat_type) {
				case HS:case HD:case HA:case HT:
					cell_class = 'wb" bgcolor="' + HG_COLOR;
					break;
				case MA:case MB:case MC:case MI:case MM:case MR:case MV:
					cell_class = 'wb" bgcolor="' + MG_COLOR;
					break;
				case TG:case TP:case TD:case TU:case TV:
					cell_class = 'wb" bgcolor="' + TG_COLOR;
					break;
				case C1:case C2:case C3:
					cell_class = 'wb" bgcolor="' + CG_COLOR;
					break;
				default:
					cell_class = 'wb" bgcolor="' + MISC_COLOR;
			}
		}

		tr = document.createElement('tr');
		tr.innerHTML = '<td class="' + cell_class + '"><a href ="http://www.lordswm.com/warlog.php?warid=' + temp_warid + '">' 
						+ temp_timestamp.toString().substr(0, 4) + '-' + temp_timestamp.toString().substr(4, 2) + '-' + temp_timestamp.toString().substr(6, 2) 
						+ '&nbsp;' + temp_timestamp.toString().substr(8, 2) + ':' + temp_timestamp.toString().substr(10, 2) + '&nbsp;'
						+ '</a><a href ="http://www.lordswm.com/warlog.php?warid=' + temp_warid + '&lt=-1">[Full]</a><a href ="http://www.lordswm.com/battlechat.php?warid=' + temp_warid + '">[Chat]</a></td>'
						+ '<td class="' + cell_class + '">' + eval(temp_combat_type + "T") + '</td>'
						+ '<td class="' + cell_class + '">' + combat_description + '</td>'
		tbl.appendChild(tr);
	}
	
	div.appendChild(tbl);
	if ((document.getElementById(LOSSES).checked != true) || (document.getElementById(WINS).checked != true)
		|| ((wins == 0) && (losses == 0))) {
		return;
	}
	summary_table = document.createElement('table');
	summary_table.id = 'summary_table';
	summary_table.className = 'wbwhite';
	summary_table.width = '300';
	summary_table.cellPadding = '5';
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = '3';
	td.appendChild(document.createTextNode(''));
	td.align = 'center';
	td.className = 'wb';
	td.innerHTML = 'Combat Summary for <a href = "http://www.lordswm.com/pl_info.php?nick=' + player_name + '"><b>' + player_name + '</b></a>';
	tr.appendChild(td);
	summary_table.appendChild(tr);
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.className = 'wb';
	td.appendChild(document.createTextNode('Losses'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.className = 'wblight';
	td.appendChild(document.createTextNode(losses));
	td.align = 'right';
	tr.appendChild(td);
	td = document.createElement('td');
	td.className = 'wblight';
	td.appendChild(document.createTextNode(roundNumber((losses*100)/(losses + wins), 2) + '%'));
	td.align = 'right';
	tr.appendChild(td);
	summary_table.appendChild(tr);
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.className = 'wb';
	td.appendChild(document.createTextNode('Wins'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.className = 'wblight';
	td.appendChild(document.createTextNode(wins));
	td.align = 'right';
	tr.appendChild(td);
	td = document.createElement('td');
	td.className = 'wblight';
	td.appendChild(document.createTextNode(roundNumber((wins*100)/(losses + wins), 2) + '%'));
	td.align = 'right';
	tr.appendChild(td);
	summary_table.appendChild(tr);
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.className = 'wb';
	td.appendChild(document.createTextNode('Total'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.align = 'right';
	td.className = 'wblight';
	td.appendChild(document.createTextNode(wins + losses));
	tr.appendChild(td);
	td = document.createElement('td');
	td.align = 'right';
	td.className = 'wblight';
	td.appendChild(document.createTextNode('100%'));
	tr.appendChild(td);
	summary_table.appendChild(tr);
	div.insertBefore(summary_table, tbl);
	
}

function formatLogTable() {
	var all_tds = document.getElementsByTagName('td');
	var td;
	var log_table, new_tog_table;
	var split_table = new Array();
	var bg_color;
	for (var i = 0; i < all_tds.length; i++) {
		if (all_tds[i].innerHTML.indexOf('</center>') != -1) {
			td = all_tds[i];
		}
	}
	log_table = td.innerHTML.substring(td.innerHTML.lastIndexOf('</center>') + 13, td.innerHTML.lastIndexOf('<br>'));
	split_table = log_table.split('<br>');
	new_log_table = '<br><table class="wb" cellpadding="4">';
	for (var i = 0; i < split_table.length; i++) {
		if (split_table[i].search(/\(\d+\)/) != -1 ) { 
			bg_color = HG_COLOR;
		} else if (split_table[i].search(/\{\d+\}/) != -1 ) {
			bg_color = MG_COLOR;
		} else if (split_table[i].search(/\u2022/) != -1 ) {
			bg_color = TG_COLOR;
		} else if (split_table[i].indexOf('<b>c</b>') != -1) {
			bg_color = CG_COLOR;
		} else {
			bg_color = MISC_COLOR;
		}
		new_log_table += '<tr bgcolor="' + bg_color + '">';
		new_log_table += '<td class="wb" >' + split_table[i].substring(split_table[i].indexOf('<a'), split_table[i].indexOf('</a>') + 4) + '</td>';
		new_log_table += '<td class="wb" >' + split_table[i].substring(split_table[i].lastIndexOf(':') + 1) + '</td></tr>';
	}
	new_log_table += '</table>';
	td.innerHTML = td.innerHTML.substring(0, td.innerHTML.lastIndexOf('</center>') + 9) + new_log_table;
}

 function roundNumber(unrounded_number, decimals) {
	var rounded_number = Math.round(unrounded_number*Math.pow(10,decimals))/Math.pow(10,decimals);
	return rounded_number;
 }