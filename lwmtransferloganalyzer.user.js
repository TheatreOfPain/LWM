// ==UserScript==
// @name			LWMTransferLogAnalyzer
// @author			TheatreOfPain
// @description		This script analyzes players transfer logs and provide a detailed analysis report along with filters and other options to modify how the report is displayed
// @include			http://www.lordswm.com/pl_transfers.php*
// ==/UserScript==

// transfer types
const ACQUIRED_RESOURCE = 'AR';
const ACQUIRED_RESOURCE_T = 'Acquired Resources';
const ACQUIRED_ITEM = 'AI';
const ACQUIRED_ITEM_T = 'Acquired Items';
const ACQUIRED_ELEMENT = 'AE';
const ACQUIRED_ELEMENT_T = 'Acquired Elements';
const ACQUIRED_ESTATES = 'AT';
const ACQUIRED_ESTATES_T = 'Acquired Estates';
const ACQUIRED_SKELETON = 'AS';
const ACQUIRED_SKELETON_T = 'Acquired Skeletons';
const SOLD_RESOURCE = 'SR';
const SOLD_RESOURCE_T = 'Sold Resources';
const SOLD_ITEM = 'SI';
const SOLD_ITEM_T = 'Sold Items';
const SOLD_ELEMENT = 'SE';
const SOLD_ELEMENT_T = 'Sold Elements';
const SOLD_ESTATES = 'ST';
const SOLD_ESTATES_T = 'Sold Estates';
const SOLD_SKELETON = 'SS';
const SOLD_SKELETON_T = 'Sold Skeletons';
const RETURNED_ITEM = 'TI';
const RETURNED_ITEM_T = 'Returned Items';
const RECEIVED_RESOURCE_OR_GOLD = 'RR';
const RECEIVED_RESOURCE_OR_GOLD_T = 'Received Gold/Resources';
const RECEIVED_ITEM = 'RI';
const RECEIVED_ITEM_T = 'Received Items';
const RECEIVED_ITEM_REPAIR = 'RP';
const RECEIVED_ITEM_REPAIR_T = 'Received Items (Enchant/Repair/Storage)';
const RECEIVED_ITEM_LEASE = 'RL';
const RECEIVED_ITEM_LEASE_T = 'Received Items (Lease)';
const RECEIVED_ITEM_ACQUIRE = 'RA';
const RECEIVED_ITEM_ACQUIRE_T = 'Received Items (Acquire)';
const RECEIVED_ELEMENT = 'RE';
const RECEIVED_ELEMENT_T = 'Received Elements';
const TRANSFERRED_RESOURCE_OR_GOLD = 'TG';
const TRANSFERRED_RESOURCE_OR_GOLD_T = 'Transferred Gold/Resources';
const TRANSFERRED_ITEM_REPAIR = 'TR';
const TRANSFERRED_ITEM_REPAIR_T = 'Transferred Items (Enchant/Repair/Storage)';
const TRANSFERRED_ITEM_LEASE = 'TL';
const TRANSFERRED_ITEM_LEASE_T = 'Transferred Items (Lease)';
const TRANSFERRED_ITEM_SELL = 'TS';
const TRANSFERRED_ITEM_SELL_T = 'Transferred Items (Priced)';
const TRANSFERRED_ITEM_FREE = 'TF';
const TRANSFERRED_ITEM_FREE_T = 'Transferred Items (Free)';
const TRANSFERRED_ELEMENT = 'TE';
const TRANSFERRED_ELEMENT_T = 'Transferred Elements';
const RENTED = 'RN';
const RENTED_T = 'Rent';
const CLAN_TRANSFERRED = 'CT';
const CLAN_TRANSFERRED_T = 'Clan Transfer';
const CLAN_WITHDRAW = 'CW';
const CLAN_WITHDRAW_T = 'Clan Withdrawal';
const ESTATE_WITHDRAWN = 'EW';
const ESTATE_WITHDRAWN_T = 'Estate Gold Withdrawal';
const ESTATE_DEPOSITED = 'ED';
const ESTATE_DEPOSITED_T = 'Estate Gold Depositing';
const ESTATE_PLACED = 'EP';
const ESTATE_PLACED_T = 'Estate Item Placement';
const ESTATE_ITEM_WITHDRAWN = 'EI';
const ESTATE_ITEM_WITHDRAWN_T = 'Estate Item Withdrawal';
const ESTATE_MODIFIED = 'EC';
const ESTATE_MODIFIED_T = 'Estate Modification';
const FACTION_CHANGE = 'FC';
const FACTION_CHANGE_T = 'Faction Change';
const CASTLE_MODIFIED = 'CM';
const CASTLE_MODIFIED_T = 'Castle Modification';
const OTHER = 'XX';
const OTHER_T = 'Miscellaneous';

// resources
const WOOD = 1;
const ORE = 2;
const MERCURY = 3;
const SULFUR = 4;
const CRYSTALS = 5;
const GEMS = 6;

// elements
const ABRASIVE = 10;
const FERN_FLOWER = 11;
const FIRE_CRYSTAL = 12;
const ICE_CRYSTAL = 13;
const METEORITE_SHARD = 14;
const MOONSTONE = 15;
const TIGER_CLAW = 16;
const TOADSTOOL = 17;
const VIPER_VENOM = 18;
const WINDFLOWER = 19;
const WITCH_BLOOM = 20;

// shop arts
const LEATHER_HAT = 30;
const LEATHER_HELMET = 31;
const WIZARD_CAP = 32;
const HAT_OF_KNOWLEDGE = 33;
const CHAIN_HELMET = 34;
const STEEL_HELMET = 35;
const WIZARD_HELMET = 36;
const LIGHT_MITHRIL_COIF = 37;
const HEAVY_MITHRIL_COIF = 38;
const WARLOCK_CROWN = 39;
const OBSIDIAN_HELMET = 40;
const FLAME_HELMET = 41;
const FIREBENDER_CROWN = 42;
const MEDAL_OF_BRAVERY = 50;
const AMULET_OF_LUCK = 51;
const PENDANT_OF_DESPAIR = 52;
const WARRIOR_PENDANT = 53;
const LOCKET_OF_CRYSTALIZED_TEARS = 54;
const MYSTICAL_AMULET = 55;
const PENDANT_OF_WRATH = 56;
const TRIFORCE_CHARM = 57;
const LEATHER_ARMOR = 60;
const LEATHER_HARNESS = 61;
const HAUBERK = 62;
const STEEL_CUIRASS = 63;
const WIZARD_ATTIRE = 64;
const LIGHT_MITHRIL_CUIRASS = 65;
const PLATEMAIL = 66;
const SORCERER_ROBE = 67;
const FULLMITHRIL_ARMOR = 68;
const FIREBENDER_ROBE = 69;
const FLAME_PLATE = 70;
const SHORTBOW = 80;
const LONG_BOW = 81;
const COMPOSITE_BOW = 82;
const BOW_OF_MIDNIGHT_STILL = 83;
const SCOUTS_CAPE = 84;
const CAPE_OF_SPIRITS = 85;
const CAPE_OF_WINDS = 86;
const CAPE_OF_MAGICAL_POWER = 87;
const CAPE_OF_ARCANE_PROTECTION = 88;
const SORCERER_CAPE = 89;
const FIREBENDER_MANTLE = 90;
const WOODEN_SWORD = 100;
const LIGHT_AXE = 101;
const STEEL_BLADE = 102;
const REPRISAL_SWORD = 103;
const SWORD_OF_RETRIBUTION = 104;
const COMBAT_STAFF = 105;
const EQUILIBRIUM_BLADE = 106;
const SWORD_OF_MIGHT = 107;
const STAFF_OF_POWER = 108;
const MITHRIL_STAFF = 109;
const MITHRIL_LONGSWORD = 110;
const RUBY_QUARTER_STAFF = 111;
const RUBY_GLADIUS = 112;
const FIREBENDER_STAFF = 113;
const BLADE_OF_REBIRTH = 114;
const DAGGER_OF_VENGEANCE = 120;
const SCROLL_OF_ENERGY = 121;
const ROUND_SHIELD = 122;
const STEEL_BUCKLER = 123;
const DEFENDER_SHIELD = 124;
const DRAGON_SHIELD = 125;
const TOWER_SHIELD = 126;
const OBSIDIAN_SHIELD = 127;
const LEATHER_JACKBOOTS = 130;
const LEATHER_BOOTS = 131;
const GALOSHES_OF_BATTLE = 132;
const SHOES_OF_ASPIRATION = 133;
const STEEL_BOOTS = 134;
const LIGHT_MITHRIL_BOOTS = 135;
const HEAVY_MITHRIL_BOOTS = 136;
const SORCERER_SANDALS = 137;
const OBSIDIAN_BOOTS = 138;
const WARLOCK_JACKBOOTS = 139;
const FLAME_BOOTS = 140;
const RING_OF_DEXTERITY = 150;
const RING_OF_INSPIRATION = 151;
const RING_OF_DOUBTS = 152;
const RING_OF_IMPETUOSITY = 153;
const RING_OF_ABDICATION = 154;
const PROPHET_RING = 155;
const PENUMBRAL_RING = 156;
const SIGNET_RING_OF_MIGHT = 157;
const SORCERER_SIGNET = 158;
const DRAGONS_EYE = 159;
const RING_OF_CONTRADICTIONS = 160;
const DIAMOND_PENDANT = 170;
const HEART_OF_FLOWERS = 171;
const THE_OTHER_HALF_F = 172;
const THE_OTHER_HALF_M = 173;
const DEFENDERS_DAGGER = 174;
const DELIGHT_BOUQUET = 175;
const FEMALE_HAPPINESS_BOUQUET = 176;
const AROMA_OF_SPRING_BOUQUET = 177;
const DIAMOND_RING = 178;
const AROMA_OF_PASSION = 179;
const SILVER_PARTISAN = 180;
const TEMTRESS_BOOTS = 181;
const DARLING_BOUQUET = 182;
const MAGNIFICIENT_BOUQUET = 183;
const PROTECTORS_CUIRASS = 184;
const ARMOR_OF_ELEGANCE = 185;
const ALE = 186;
const ELIXIR_OF_RESTORATION = 190;
const MANA_TUBE = 191;
const POTION_OF_OBLIVION = 192;


// hunter arts
const HUNTER_BROADSWORD = 200;
const HUNTER_SHIELD = 201;
const HUNTER_BOOTS = 202;
const HUNTER_SHIRT = 203;
const HUNTER_BOW = 204;
const HUNTER_GLOVE = 205;
const HUNTER_PENDANT = 206;
const HUNTER_HAT = 207;
const MH_SABRE = 210;
const MH_CUTLASS = 211;
const MH_DAGGER = 212;
const MH_SHIELD = 213;
const MH_JACKBOOTS = 214;
const MH_BOOTS = 215;
const MH_ARMOR = 216;
const MH_MASKROBE = 217;
const MH_BOW = 218;
const MH_ARROWS = 219;
const MH_AMULET = 220;
const MH_RING_OF_FLIGHT = 221;
const MH_RING_OF_DEXTERITY = 222;
const MH_HELMET = 223;
const MH_BONE_HELMET = 224;
const GH_SWORD = 230;
const GH_KNUCKLEDUSTER = 231;
const GH_SHIELD = 232;
const GH_BOOTS = 233;
const GH_ARMOR = 234;
const GH_MASKROBE = 235;
const GH_BOW = 236;
const GH_ARROWS = 237;
const GH_AMULET = 238;
const GH_RING_OF_DEXTERITY = 239;
const GH_RING_OF_CHARM = 240;
const GH_HELMET = 241;
const BB_BLADE = 250;
const BB_SPEAR = 251;
const BB_SHIELD = 252;
const BB_BOOTS = 253;
const BB_ARMOR = 254;
const BB_MASKROBE = 255;
const BB_BOW = 256;
const BB_ARROWS = 257;
const BB_CHARM = 258;
const BB_SIGNET = 259;
const BB_BAND = 260;
const BB_HELMET = 261;

// special arts
const THIEF_DAGGER = 300;
const THIEF_BOOTS = 301;
const THIEF_ARMOR = 302;
const THIEF_CLOAK = 303;
const THIEF_CROSSBOW = 304;
const THIEF_AMULET = 305;
const THIEF_RING = 306;
const THIEF_MASK = 307;
const TACTICIAN_HATCHET = 310;
const TACTICIAN_BATON = 311;
const TACTICIAN_DAGGER = 312;
const TACTICIAN_HELMET = 313;
const TACTICIAN_ARMOR = 314;
const TACTICIAN_CLOAK = 315;
const TACTICIAN_BOW = 316;
const TACTICIAN_SHIELD = 317;
const TACTICIAN_CHARM = 318;
const TACTICIAN_WAR_PENDANT = 319;
const TACTICIAN_RING_OF_WISDOM = 320;
const TACTICIAN_BAND_OF_FORCE = 321;
const TACTICIAN_JACKBOOTS = 322;
const VENOMANCER_PENDANT = 330;
const VENOMANCER_STAFF = 331;
const VENOMANCER_HOOD = 332;
const VENOMANCER_FROCK = 333;
const INFERNAL_AXE = 340;
const INFERNAL_SHIELD = 341;
const INFERNAL_HELMET = 342;
const INFERNAL_ARMOR = 343;
const INFERNAL_GREAVE = 344;
const INFERNAL_TALISMAN = 345;

// transfer record indexes
const TRANSFERRED_PLAYER = 0;
const TRANSFERRED_TIMESTAMP = 1;
const TRANSFERRED_TYPE = 2;
const RECEIVED = 3;
const TRANSFERRED = 4;
const NET_GOLD = 5;
const DESCRIPTION = 6;

var div;
var all_tds;
var td;
var matched;
var log_entries;
var log_record;
var log_table = new Array();
var prices = new Array();
var transfer_table = new Array();

// transfer record
var record_type;
var player_name;
var transfer_timestamp;
var transfer_player;
var received;
var transferred;
var net_gold;
var description;
var total_net_gold = 0;

setConstants();
main();

function main() {
	var split_record = new Array();
	var all_centers = document.body.getElementsByTagName('center');
	for (var i = 0; i < all_centers.length; i++) {
		if (all_centers[i].innerHTML.indexOf('Transfer log of') != -1) {
			var center = all_centers[i];
		}
	}
	center.innerHTML.match(/<b>(\w*\D*\w*)<\/b><\/a>/);
	player_name = RegExp.$1;

	center.innerHTML += '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0';

	var el = document.createElement('input');
	el.type = 'button';
	if (isParsingEnabled()) {
		analyzeTransferLog();
		el.addEventListener('click', disableLogAnalysis, false);
		el.setAttribute('value', 'Disable Log Analysis');
		center.appendChild(el);
	} else {
		el.addEventListener('click', enableLogAnalysis, false);
		el.setAttribute('value', 'Enable Log Analysis');
		center.appendChild(el); 
		return;
	}
	center.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'));

	el = document.createElement('input');
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
	filters.cellPadding = '10';
	filters.width = '100%';
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.colSpan = '6';
	td.appendChild(document.createTextNode('Select the transfer types you want to display:'));
	td.appendChild(document.createElement('br'));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);
	filters.appendChild(tr);
	tr = document.createElement('tr');
	td = document.createElement('td');

	// acquired filters
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = ACQUIRED_RESOURCE;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(ACQUIRED_RESOURCE_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = ACQUIRED_ITEM;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(ACQUIRED_ITEM_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = ACQUIRED_ELEMENT;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(ACQUIRED_ELEMENT_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = ACQUIRED_ESTATES;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(ACQUIRED_ESTATES_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = ACQUIRED_SKELETON;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(ACQUIRED_SKELETON_T));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);

	// sold filters
	td = document.createElement('td');
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = SOLD_RESOURCE;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(SOLD_RESOURCE_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = SOLD_ITEM;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(SOLD_ITEM_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = SOLD_ELEMENT;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(SOLD_ELEMENT_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = SOLD_ESTATES;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(SOLD_ESTATES_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = SOLD_SKELETON;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(SOLD_SKELETON_T));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);

	// transfered filters
	td = document.createElement('td');
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = TRANSFERRED_RESOURCE_OR_GOLD;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(TRANSFERRED_RESOURCE_OR_GOLD_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = TRANSFERRED_ITEM_REPAIR;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(TRANSFERRED_ITEM_REPAIR_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = TRANSFERRED_ITEM_LEASE;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(TRANSFERRED_ITEM_LEASE_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = TRANSFERRED_ITEM_SELL;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(TRANSFERRED_ITEM_SELL_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = TRANSFERRED_ITEM_FREE;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(TRANSFERRED_ITEM_FREE_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = TRANSFERRED_ELEMENT;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(TRANSFERRED_ELEMENT_T));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);

	// received filters
	td = document.createElement('td');
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = RECEIVED_RESOURCE_OR_GOLD;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(RECEIVED_RESOURCE_OR_GOLD_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = RECEIVED_ITEM_REPAIR;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(RECEIVED_ITEM_REPAIR_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = RECEIVED_ITEM_LEASE;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(RECEIVED_ITEM_LEASE_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = RECEIVED_ITEM_ACQUIRE;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(RECEIVED_ITEM_ACQUIRE_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = RECEIVED_ITEM;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(RECEIVED_ITEM_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = RECEIVED_ELEMENT;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(RECEIVED_ELEMENT_T));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);

	// estate filters
	td = document.createElement('td');
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = ESTATE_WITHDRAWN;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(ESTATE_WITHDRAWN_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = ESTATE_DEPOSITED;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(ESTATE_DEPOSITED_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = ESTATE_PLACED;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(ESTATE_PLACED_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = ESTATE_ITEM_WITHDRAWN;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(ESTATE_ITEM_WITHDRAWN_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = ESTATE_MODIFIED;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(ESTATE_MODIFIED_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = RENTED;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(RENTED_T));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);

	// misc filters
	td = document.createElement('td');
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CLAN_TRANSFERRED;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(CLAN_TRANSFERRED_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CLAN_WITHDRAW;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(CLAN_WITHDRAW_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = RETURNED_ITEM;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(RETURNED_ITEM_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = FACTION_CHANGE;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(FACTION_CHANGE_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CASTLE_MODIFIED;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(CASTLE_MODIFIED_T));
	td.appendChild(document.createElement('br'));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = OTHER;
	el.checked = true;
	td.appendChild(el);
	td.appendChild(document.createTextNode(OTHER_T));
	td.appendChild(document.createElement('br'));
	tr.appendChild(td);
	filters.appendChild(tr);

	// empty row
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.innerHTML = '\u00a0';
	tr.appendChild(td);
	filters.appendChild(tr);
	
	// select/deselect buttons
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = '2';
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', selectAllCheckboxes, false);
	el.setAttribute('value', 'Select All');
	td.appendChild(el);
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', deselectAllCheckboxes, false);
	el.setAttribute('value', 'Deselect All');
	td.appendChild(el);
	tr.appendChild(td);
	td = document.createElement('td');
	td.colSpan = '2';
	td.align = 'center';
	td.appendChild(document.createTextNode('Filter by player\u00a0'));
	el = document.createElement('input');
	el.type = 'input';
	el.id = 'filter_by_player';
	td.appendChild(el);
	tr.appendChild(td);
	td = document.createElement('td');
	td.colSpan = '2';
	td.align = 'right';
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', filterResults, false);
	el.setAttribute('value', 'Filter Results');
	td.appendChild(el);
	tr.appendChild(td);
	filters.appendChild(tr);
	
	div.appendChild(document.createElement('br'));
	div.appendChild(filters);
	div.appendChild(document.createElement('br'));
	
	center.appendChild(div);	
}

function displayAnalysisTable () {
	if(div.style.display == 'block') {
		div.style.display = 'none';
	} else {
		div.style.display = 'block';
	}
}

function analyzeTransferLog() {
	getTransferData();
	all_tds = document.body.getElementsByTagName('td');

	for (var i = 0; i < all_tds.length; i++) {
		if (all_tds[i].innerHTML.indexOf('Transfer log of') != -1) {
			td = all_tds[i];
		}
	}

	log_entries = td.innerHTML.split('<br>');

	for (var i = 0; i < log_entries.length; i++) {
		if (log_entries[i].indexOf('Transfer log of') != -1) {
			matched = td.innerHTML.match(/<b>(\w*\D*\w*)<\/b><\/a>/);
			player_name = RegExp.$1;
			continue;
		} else if ((log_entries[i].length == 0) || (log_entries[i].match(/\d{2}\-\d{2}\-\d{2} \d{2}/) == null)) {
			continue;
		}
		log_table.push(log_entries[i]);
	}

	for (var i = 0; i < log_table.length; i++) {
		record_type = determineRecordType(log_table[i]);
		
		matched = log_table[i].match(/(\d{2})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
		transfer_timestamp = '20' + RegExp.$3 + RegExp.$1 + RegExp.$2 + RegExp.$4 + RegExp.$5;

		parseTransferRecord(log_table[i]);
		
		if (net_gold == 0) {
			net_gold = '';
		}		
		if (received == 0) {
			received = '';
		}		
		if (transferred == 0) {
			transferred = '';
		}		
		
		log_record = transfer_player + '$' + transfer_timestamp + '$' + record_type + '$' + received + '$' + transferred + '$' + net_gold + '$' + description; 
		createTransferRecord(log_record);
	}
	setTransferData();
}

// this function adds the transfer record to the transfer array
function createTransferRecord (new_record) {
	for (var z = 0; z < transfer_table.length; z++) {
		if (transfer_table[z] == new_record.replace(/,/g, '~')) {
			return;
		}
	}
	transfer_table.push(new_record.replace(/,/g, '~'));
}

// this function checked if parsing is enabled
function isParsingEnabled() {
	var parse_key = player_name + " analysis";
	var is_enabled = GM_getValue(parse_key, false);
	return is_enabled;
}

// save transfer data
function setTransferData () {
	var transfer_key = player_name + " transfer_stats";
	//transfer_table.sort();
	GM_setValue(transfer_key, transfer_table.toString());
}

// retrieve transfer data
function getTransferData() {
	var transfer_key = player_name + " transfer_stats";
	var key_value = GM_getValue(transfer_key, 0);
	if (key_value.length > 0) {
		transfer_table = key_value.split(",");
	}
}

// this function enables parsing of the transfer log
function enableLogAnalysis() {
	var parse_key = player_name + " analysis";
	var response = confirm('Please confirm you want to enable analysis for this player\'s log');
	if (response == true) {
		GM_setValue(parse_key, true);
		window.location.reload();
	}
}

// this function disables parsing of the transfer log
function disableLogAnalysis() {
	var transfer_key = player_name + " transfer_stats";
	var parse_key = player_name + " analysis";
	var response = confirm('Please confirm you want to disable analysis for this player\'s log\n(all data collected for this log will be deleted)');
	if (response == true) {
		GM_deleteValue(transfer_key);	
		GM_deleteValue(parse_key);	
		window.location.reload();
	}
}

// this function selects all checkboxes
function selectAllCheckboxes() {
	var all_input = document.getElementsByTagName('input');

	for (var z = 0; z < all_input.length; z++) { 
		if ((all_input[z].type == 'checkbox') && (all_input[z].checked == false)) {
			all_input[z].checked = true;
		}
	}
	
}

// this function deselects all checkboxes
function deselectAllCheckboxes(){
	var all_input = document.getElementsByTagName('input');

	for (var z = 0; z < all_input.length; z++) {
		if ((all_input[z].type == 'checkbox') && (all_input[z].checked == true)) {
			all_input[z].checked = false;
		}
	}
	
}

// this funciton displays the analysis table with selected filters
function filterResults() {
	var temp_table = document.getElementById('report_table');
	if (temp_table != null) {
		div.removeChild(temp_table);
	}
	var player_filter = document.getElementById('filter_by_player').value;
	var tbl = document.createElement('table');
	tbl.className = 'wb';
	tbl.width = '100%';
	tbl.cellPadding = '4';
	tbl.id = 'report_table';
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.className = 'wb';
	td.colSpan = '7';
	var cell_class = 'wbwhite'
	td.className = cell_class;
	td.align = 'center';
	td.innerHTML = 'Log Analysis for <b>' + player_name + '</b>';
	tr.appendChild(td);
	tbl.appendChild(tr);
	
	// header
	tr = document.createElement('tr');
	tr.innerHTML = '<td class="' + cell_class + '" align="center"><b>Player</b></td><td class="' + cell_class + '" align="center"><b>Timestamp</b></td><td class="' + cell_class + '" align="center"><b>Transfer Type</b></td>'
	tr.innerHTML += '<td class="' + cell_class + '" align="center"><b>Received</b></td><td class="' + cell_class + '" align="center"><b>Transferred</b></td>'
	tr.innerHTML += '<td class="' + cell_class + '" align="center"><b>Net Gold</b></td><td class="' + cell_class + '" align="center"><b>Description</b></td>'
	tbl.appendChild(tr);

	for (var x = 0; x < transfer_table.length; x++) {
		var temp_check_box = document.getElementById(transfer_table[x].replace(/~/g, ',').split('$')[TRANSFERRED_TYPE]);
		if (temp_check_box != null){
			if (temp_check_box.checked == false) {
				continue;
			}
		}	
	
		split_record = transfer_table[x].replace(/~/g, ',').split('$');
		if (split_record[TRANSFERRED_PLAYER].indexOf('pl_info') != -1) {
			split_record[TRANSFERRED_PLAYER].match(/<b>(\w*\D*\w*)<\/b>/);
			var temp_player_name = RegExp.$1;
			if (temp_player_name.toLowerCase().match(player_filter.toLowerCase()) == null) {
				continue;
			}
		}
		if (cell_class == 'wbwhite') {
			cell_class = 'wblight';
		} else {
			cell_class = 'wbwhite';
		}
		tr = document.createElement('tr'); 
		tr.innerHTML = '<td class="' + cell_class + '">' + split_record[TRANSFERRED_PLAYER] + '</td>'
		tr.innerHTML += '<td class="' + cell_class + '">' + split_record[TRANSFERRED_TIMESTAMP].substring(0,4) + '-' + split_record[TRANSFERRED_TIMESTAMP].substring(4,6) + '-' 
			+ split_record[TRANSFERRED_TIMESTAMP].substring(6,8) + '&nbsp;' + split_record[TRANSFERRED_TIMESTAMP].substring(8,10) + ':' + split_record[TRANSFERRED_TIMESTAMP].substring(10,12) + '</td>';
			
		switch (split_record[TRANSFERRED_TYPE]) { 
			case ACQUIRED_RESOURCE:
				tr.innerHTML += '<td class="' + cell_class + '">' + ACQUIRED_RESOURCE_T + '</td>';
				break;
			case ACQUIRED_ITEM: 
				tr.innerHTML += '<td class="' + cell_class + '">' + ACQUIRED_ITEM_T + '</td>';
				break;
			case ACQUIRED_ELEMENT: 
				tr.innerHTML += '<td class="' + cell_class + '">' + ACQUIRED_ELEMENT_T + '</td>';
				break;
			case ACQUIRED_ESTATES:
				tr.innerHTML += '<td class="' + cell_class + '">' + ACQUIRED_ESTATES_T + '</td>';
				break;
			case ACQUIRED_SKELETON:
				tr.innerHTML += '<td class="' + cell_class + '">' + ACQUIRED_SKELETON_T + '</td>';
				break;
			case SOLD_RESOURCE: 
				tr.innerHTML += '<td class="' + cell_class + '">' + SOLD_RESOURCE_T + '</td>';
				break;
			case SOLD_ITEM: 
				tr.innerHTML += '<td class="' + cell_class + '">' + SOLD_ITEM_T + '</td>';
				break;
			case SOLD_ELEMENT: 
				tr.innerHTML += '<td class="' + cell_class + '">' + SOLD_ELEMENT_T + '</td>';
				break;
			case SOLD_SKELETON:
				tr.innerHTML += '<td class="' + cell_class + '">' + SOLD_SKELETON_T + '</td>';
				break;
			case SOLD_ESTATES:
				tr.innerHTML += '<td class="' + cell_class + '">' + SOLD_ESTATES_T + '</td>';
				break;
			case RETURNED_ITEM:
				tr.innerHTML += '<td class="' + cell_class + '">' + RETURNED_ITEM_T + '</td>';
				break;
			case RECEIVED_RESOURCE_OR_GOLD: 
				tr.innerHTML += '<td class="' + cell_class + '">' + RECEIVED_RESOURCE_OR_GOLD_T + '</td>';
				break;
			case RECEIVED_ITEM:
				tr.innerHTML += '<td class="' + cell_class + '">' + RECEIVED_ITEM_T + '</td>';
				break;
			case RECEIVED_ITEM_REPAIR:
				tr.innerHTML += '<td class="' + cell_class + '">' + RECEIVED_ITEM_REPAIR_T + '</td>';
				break;
			case RECEIVED_ITEM_LEASE: 
				tr.innerHTML += '<td class="' + cell_class + '">' + RECEIVED_ITEM_LEASE_T + '</td>';
				break;
			case RECEIVED_ITEM_ACQUIRE: 
				tr.innerHTML += '<td class="' + cell_class + '">' + RECEIVED_ITEM_ACQUIRE_T + '</td>';
				break;
			case RECEIVED_ELEMENT: 
				tr.innerHTML += '<td class="' + cell_class + '">' + RECEIVED_ELEMENT_T + '</td>';
				break;
			case TRANSFERRED_RESOURCE_OR_GOLD: 
				tr.innerHTML += '<td class="' + cell_class + '">' + TRANSFERRED_RESOURCE_OR_GOLD_T + '</td>';
				break;
			case TRANSFERRED_ITEM_REPAIR: 
				tr.innerHTML += '<td class="' + cell_class + '">' + TRANSFERRED_ITEM_REPAIR_T + '</td>';
				break;
			case TRANSFERRED_ITEM_LEASE: 
				tr.innerHTML += '<td class="' + cell_class + '">' + TRANSFERRED_ITEM_LEASE_T + '</td>';
				break;
			case TRANSFERRED_ITEM_SELL: 
				tr.innerHTML += '<td class="' + cell_class + '">' + TRANSFERRED_ITEM_SELL_T + '</td>';
				break;
			case TRANSFERRED_ITEM_FREE: 
				tr.innerHTML += '<td class="' + cell_class + '">' + TRANSFERRED_ITEM_FREE_T + '</td>';
				break;
			case TRANSFERRED_ELEMENT:
				tr.innerHTML += '<td class="' + cell_class + '">' + TRANSFERRED_ELEMENT_T + '</td>';
				break;
			case RENTED:
				tr.innerHTML += '<td class="' + cell_class + '">' + RENTED_T + '</td>';
				break;
			case CLAN_TRANSFERRED: 
				tr.innerHTML += '<td class="' + cell_class + '">' + CLAN_TRANSFERRED_T + '</td>';
				break;
			case CLAN_WITHDRAW:
				tr.innerHTML += '<td class="' + cell_class + '">' + CLAN_WITHDRAW_T + '</td>';
				break;
			case ESTATE_WITHDRAWN:
				tr.innerHTML += '<td class="' + cell_class + '">' + ESTATE_WITHDRAWN_T + '</td>';
				break;
			case ESTATE_DEPOSITED:
				tr.innerHTML += '<td class="' + cell_class + '">' + ESTATE_DEPOSITED_T + '</td>';
				break;
			case ESTATE_PLACED:
				tr.innerHTML += '<td class="' + cell_class + '">' + ESTATE_PLACED_T + '</td>';
				break;
			case ESTATE_ITEM_WITHDRAWN:
				tr.innerHTML += '<td class="' + cell_class + '">' + ESTATE_ITEM_WITHDRAWN_T + '</td>';
				break;
			case ESTATE_MODIFIED:
				tr.innerHTML += '<td class="' + cell_class + '">' + ESTATE_MODIFIED_T + '</td>';
				break;
			case FACTION_CHANGE:
				tr.innerHTML += '<td class="' + cell_class + '">' + FACTION_CHANGE_T + '</td>';
				break;
			case CASTLE_MODIFIED:
				tr.innerHTML += '<td class="' + cell_class + '">' + CASTLE_MODIFIED_T + '</td>';
				break;
			case OTHER:
				tr.innerHTML += '<td class="' + cell_class + '">' + OTHER_T + '</td>';
		}

		tr.innerHTML += '<td class="' + cell_class + '">' + split_record[RECEIVED] + '</td><td class="' + cell_class + '">' + split_record[TRANSFERRED] + '</td>';
		tr.innerHTML += '<td class="' + cell_class + '">' + split_record[NET_GOLD] + '</td><td class="' + cell_class + '">' + split_record[DESCRIPTION] + '</td>';
		tbl.appendChild(tr);
		if (parseInt(split_record[NET_GOLD]) == split_record[NET_GOLD]) {
			total_net_gold += parseInt(split_record[NET_GOLD]);
		}
	}
	if (total_net_gold != 0) {
		tr = document.createElement('tr'); 
		tr.innerHTML += '<td class="wb" bgcolor="yellow" colspan="5" align="right"><b>Total Net Gold</b></td><td class="wb" bgcolor="yellow" colspan="2" align="left"><b>' + total_net_gold + '</b></td>';
		tbl.appendChild(tr);
	}
	div.appendChild(tbl);
}

// this function determines the type of the transfer record
function determineRecordType (passed_record) {
	if (passed_record.indexOf('Acquired:') != -1) {					// resources acquired through market
		return ACQUIRED_RESOURCE;
	}
	if (passed_record.indexOf('Acquired item:') != -1) {			// item acquired through market
		return ACQUIRED_ITEM;
	}
	if (passed_record.indexOf('Acquired elements:') != -1) {		// element acquired through market
		return ACQUIRED_ELEMENT;
	}
	if (passed_record.indexOf('Acquired Estates') != -1) {			// estates acquired through market
		return ACQUIRED_ESTATES;
	}
	if (passed_record.indexOf('Acquired Skeletons:') != -1) {		// skeletons acquired through market
		return ACQUIRED_SKELETON;
	}

	if (passed_record.indexOf('Sold:') != -1) {						// resources sold through market
		return SOLD_RESOURCE;
	}
	if (passed_record.indexOf('Sold item:') != -1) {				// item sold through market
		return SOLD_ITEM;
	}
	if (passed_record.indexOf('Sold elements:') != -1) {			// element sold through market
		return SOLD_ELEMENT;
	}
	if (passed_record.indexOf('Sold Estates') != -1) {				// estates sold through market
		return SOLD_ESTATES;
	}
	if (passed_record.indexOf('Sold Skeletons:') != -1) {			// skeletons sold through market
		return SOLD_SKELETON;
	}

	if ((passed_record.indexOf('has returned an item:') != -1) 
		|| (passed_record.indexOf('has withdrawn an item:') != -1) 
		|| (passed_record.indexOf('Item withdrawn:') != -1) 
		|| (passed_record.indexOf('Item returned:')) != -1) {		// item return
			return RETURNED_ITEM;
	}
	
	if ((passed_record.match(/Received \d* [gG]old/) != null) 
		|| (passed_record.match(/Received \d* Wood/) != null)
		|| (passed_record.match(/Received \d* Ore/) != null)
		|| (passed_record.match(/Received \d* Mercury/) != null)
		|| (passed_record.match(/Received \d* Sulfur/) != null)
		|| (passed_record.match(/Received \d* Crystals/) != null)
		|| (passed_record.match(/Received \d* Gems/) != null)) {	// resource and/or gold acquired directly
		return RECEIVED_RESOURCE_OR_GOLD;
	}
	if ((passed_record.indexOf('Received item(s):') != -1) 
		&& (passed_record.indexOf('Transaction price') == -1)) {	// item acquired for free
		return RECEIVED_ITEM;
	}
	if ((passed_record.indexOf('Received item(s):') != -1) 
		&& (passed_record.indexOf('to be returned until') != -1) 
		&& (passed_record.indexOf('for 0 battles') != -1)) {		// item repair/storage
		return RECEIVED_ITEM_REPAIR;
	}
	if ((passed_record.indexOf('Received item(s):') != -1) 
		&& (passed_record.indexOf('to be returned until') != -1) 
		&& (passed_record.match(/for \d* battles/) != null)) {		// item lease/enchant
		return RECEIVED_ITEM_LEASE;
	}
	if ((passed_record.indexOf('Received item(s):') != -1) 
		&& (passed_record.indexOf('Transaction price') != -1)) {	// item acquired directly
		return RECEIVED_ITEM_ACQUIRE;
	}
	if (passed_record.indexOf('Received element(s):') != -1) {		// element acquired
		return RECEIVED_ELEMENT;
	}
	
	if ((passed_record.match(/Transferred \d* Gold/) != null)
		|| (passed_record.match(/Transferred \d* Wood/) != null)
		|| (passed_record.match(/Transferred \d* Ore/) != null)
		|| (passed_record.match(/Transferred \d* Mercury/) != null)
		|| (passed_record.match(/Transferred \d* Sulfur/) != null)
		|| (passed_record.match(/Transferred \d* Crystals/) != null)
		|| (passed_record.match(/Transferred \d* Gems/) != null)) {	// transferred resource and/or gold directly
		return TRANSFERRED_RESOURCE_OR_GOLD;
	}
	if ((passed_record.indexOf('Transferred item(s):') != -1) 
		&& (passed_record.indexOf('to be returned until') != -1) 
		&& (passed_record.indexOf('for 0 battles') != -1)) {		// transferred item for repair/storage
		return TRANSFERRED_ITEM_REPAIR;
	}
	if ((passed_record.indexOf('Transferred item(s):') != -1) 
		&& (passed_record.indexOf('to be returned until') != -1) 
		&& (passed_record.match(/for \d* battles/) != null)) {		// transferred item for lease/enchant
		return TRANSFERRED_ITEM_LEASE;
	}
	if ((passed_record.indexOf('Transferred item(s):') != -1) 
		&& (passed_record.indexOf('Transaction price') != -1)) {	// transferred item as direct sale
		return TRANSFERRED_ITEM_SELL;
	}
	if ((passed_record.indexOf('Transferred element(s):') != -1)) {	// transferred elements to receiver's disposal
		return TRANSFERRED_ELEMENT;
	}
	if ((passed_record.indexOf('Transferred ') != -1) 
		&& (passed_record.indexOf('Transaction price') == -1)	
		&& (passed_record.indexOf('clan account') == -1)) {			// transferred item to receiver's disposal
		return TRANSFERRED_ITEM_FREE;
	}

	if ((passed_record.match(/Transferred \d* gold/) != null) 		// transferred gold to clan
		&& (passed_record.indexOf('clan account') != -1)) {			
		return CLAN_TRANSFERRED;
	}
	if ((passed_record.indexOf('Withdrawn') != -1) 
		&& (passed_record.indexOf('clan account') != -1)) {			// withdraw from clan account
		return CLAN_WITHDRAW;
	}
	
	if ((passed_record.indexOf('Estates') != -1) 
		&& (passed_record.indexOf('Witdrawn ') != -1)
		&& (passed_record.indexOf('artifact') == -1)) {				// withdraw from estate
		return ESTATE_WITHDRAWN;
	}
	if ((passed_record.indexOf('Estates') != -1) 
		&& (passed_record.indexOf('Deposited ') != -1)) {			// deposited to estate
		return ESTATE_DEPOSITED;
	}
	if ((passed_record.indexOf('Estates') != -1) 
		&& (passed_record.indexOf('placed') != -1)
		&& (passed_record.indexOf('Artifact') != -1)) {				// artifact placement in estate
		return ESTATE_PLACED;
	}
	if ((passed_record.indexOf('Estates') != -1) 
		&& (passed_record.indexOf('Witdrawn') != -1)
		&& (passed_record.indexOf('artifact') != -1)) {				// artifact withdrawn from estate
		return ESTATE_ITEM_WITHDRAWN;
	}
	if ((passed_record.indexOf('Estates') != -1) 
		&& (passed_record.indexOf('annex') != -1)) {				// estate construction
		return ESTATE_MODIFIED;
	}

	if (passed_record.match(/Rent paid: \d* gold/) != null) {		// rent
		return RENTED;
	}
	if ((passed_record.indexOf('Registered. Faction:') != -1) 
		|| (passed_record.indexOf('Faction changed:')) != -1) {		// faction change
			return FACTION_CHANGE;
	}
	if (passed_record.indexOf('Castle modified.') != -1) {			// castle modified
		return CASTLE_MODIFIED;
	}
	return OTHER;	
}

// this function parses the transfer record to extract necessary information from it
function parseTransferRecord (transfer_record) {
	var start_pos;
	var start_str;
	var end_pos;
	var end_str;
	var item_price;

	switch (record_type) {	
	case ACQUIRED_RESOURCE:		// xx-xx-xx xx:xx: Acquired: xx for xx gold from xx as lot xx
		start_str = 'Acquired: ';
		end_str = ' for ';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 10, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/for (\d*) gold/);
		transferred = RegExp.$1;
		
		start_str = '<a';
		end_str = ' as lot';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		start_str = 'lot';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		
		matched = received.match(/(\d*) (\D*)/);
		switch (RegExp.$2) {
			case 'Wood':
				item_price = RegExp.$1 * prices[WOOD];
				break;
			case 'Ore':
				item_price = RegExp.$1 * prices[ORE];
				break;
			case 'Mercury':
				item_price = RegExp.$1 * prices[MERCURY];
				break;
			case 'Sulfur':
				item_price = RegExp.$1 * prices[SULFUR];
				break;
			case 'Crystals':
				item_price = RegExp.$1 * prices[CRYSTALS];
				break;
			case 'Gems':
				item_price = RegExp.$1 * prices[GEMS];
				break;
		}
		
		net_gold = item_price - transferred;
		break;

		case ACQUIRED_ITEM:		// xx-xx-xx xx:xx: Acquired item: "xx" [xx/xx] for xx gold from xx as lot xx
		start_str = 'Acquired item: ';
		end_str = ' for ';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 15, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/for (\d*) gold/);
		transferred = RegExp.$1;
		
		start_str = '<a';
		end_str = ' as lot';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		start_str = 'lot';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		
		matched = received.match(/"(\D*)"/);
		item_price = getArtPrice(RegExp.$1);
		matched = received.match(/(\d*) pcs/);
		if (matched != null) {
			item_price *= RegExp.$1;
		}		
		net_gold = item_price - transferred;
		break;

	case ACQUIRED_ELEMENT:		// xx-xx-xx xx:xx: Acquired elements: xx pcs. "xx"(s) for xx gold from xx as lot xx
		start_str = 'Acquired elements: ';
		end_str = ' for ';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 19, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/for (\d*) gold/);
		transferred = RegExp.$1;
		
		start_str = '<a';
		end_str = ' as lot';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		start_str = 'lot';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		
		matched = received.match(/"(\D*)"/);
		switch (RegExp.$1) {
			case 'Abrasive':
				item_price = prices[ABRASIVE];
				break;
			case 'Fern flower':
				item_price = prices[FERN_FLOWER];
				break;
			case 'Fire crystal':
				item_price = prices[FIRE_CRYSTAL];
				break;
			case 'Ice crystal':
				item_price = prices[ICE_CRYSTAL];
				break;
			case 'Meteorite shard':
				item_price = prices[METEORITE_SHARD];
				break;
			case 'Moonstone':
				item_price = prices[MOONSTONE];
				break;
			case 'Tiger`s claw':
				item_price = prices[TIGER_CLAW];
				break;
			case 'Toadstool':
				item_price = prices[TOADSTOOL];
				break;
			case 'Viper venom':
				item_price = prices[VIPER_VENOM];
				break;
			case 'Windflower':
				item_price = prices[WINDFLOWER];
				break;
			case 'Witch bloom':
				item_price = prices[WITCH_BLOOM];
				break;
		}
		
		matched = received.match(/(\d*) pcs/);
		if (matched != null) {
			item_price *= RegExp.$1;
		}		

		net_gold = item_price - transferred;
		break;

	case ACQUIRED_ESTATES:		// xx-xx-xx xx:xx: Acquired Estates xx for xx gold from xx as lot xx.
		start_str = 'Acquired Estates: ';
		end_str = ' for ';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 18, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/for (\d*) gold/);
		transferred = RegExp.$1;
		
		start_str = 'from <a';
		end_str = ' as lot';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str) + 5, transfer_record.indexOf(end_str));
		
		start_str = 'lot';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		
		net_gold = -1 * transferred;
		break;

	case ACQUIRED_SKELETON:		// xx-xx-xx xx:xx: Acquired Skeletons: xx pcs. for xx gold from xx as lot xx
		start_str = 'Acquired Skeletons: ';
		end_str = ' for ';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 20, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/for (\d*) gold/);
		transferred = RegExp.$1;
		
		start_str = '<a';
		end_str = ' as lot';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		start_str = 'lot';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		
		matched = received.match(/(\d*) pcs/);
		if (matched != null) {
			item_price = RegExp.$1;
		} else {
			item_price = 1;
		}
		net_gold = item_price - transferred;
		break;

	case SOLD_RESOURCE:			// xx-xx-xx xx:xx: Sold: xx for xx gold to xx as lot xx. Commission: xx
		start_str = 'Sold: ';
		end_str = ' for ';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 6, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/for (\d*) gold/);
		received = RegExp.$1;
		
		start_str = '<a';
		end_str = ' as lot';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		start_str = 'lot';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		
		matched = transferred.match(/(\d*) (\D*)/);
		switch (RegExp.$2) {
			case 'Wood':
				item_price = RegExp.$1 * prices[WOOD];
				break;
			case 'Ore':
				item_price = RegExp.$1 * prices[ORE];
				break;
			case 'Mercury':
				item_price = RegExp.$1 * prices[MERCURY];
				break;
			case 'Sulfur':
				item_price = RegExp.$1 * prices[SULFUR];
				break;
			case 'Crystals':
				item_price = RegExp.$1 * prices[CRYSTALS];
				break;
			case 'Gems':
				item_price = RegExp.$1 * prices[GEMS];
				break;
		}
		matched = transfer_record.match(/Commission: (\d*)/);
		net_gold = (parseInt(received) - parseInt(RegExp.$1)) - item_price;
		break;
		
	case SOLD_ITEM:			// xx-xx-xx xx:xx: Sold item: "xx" [xx/xx] for xx gold to xx as lot xx. Commission: xx
		start_str = 'Sold item: ';
		end_str = ' for ';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 11, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/for (\d*) gold/);
		received = RegExp.$1;
		
		start_str = '<a';
		end_str = ' as lot';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		start_str = 'lot';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		
		matched = transferred.match(/"(\D*)"/);
		item_price = getArtPrice(RegExp.$1);
		matched = transferred.match(/(\d*) pcs/);
		if (matched != null) {
			item_price *= RegExp.$1;
		}		
		matched = transfer_record.match(/Commission: (\d*)/);
		net_gold = (parseInt(received) - parseInt(RegExp.$1)) - item_price;
		break;
		
	case SOLD_ELEMENT:		// xx-xx-xx xx:xx: Sold elements: xx pcs. "xx"(s) for xx gold to xx as lot xx. Commission: xx
		start_str = 'Sold elements: ';
		end_str = ' for ';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 15, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/for (\d*) gold/);
		received = RegExp.$1;
		
		start_str = '<a';
		end_str = ' as lot';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		start_str = 'lot';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		
		matched = transferred.match(/"(\D*)"/);
		switch (RegExp.$1) {
			case 'Abrasive':
				item_price = prices[ABRASIVE];
				break;
			case 'Fern flower':
				item_price = prices[FERN_FLOWER];
				break;
			case 'Fire crystal':
				item_price = prices[FIRE_CRYSTAL];
				break;
			case 'Ice crystal':
				item_price = prices[ICE_CRYSTAL];
				break;
			case 'Meteorite shard':
				item_price = prices[METEORITE_SHARD];
				break;
			case 'Moonstone':
				item_price = prices[MOONSTONE];
				break;
			case 'Tiger`s claw':
				item_price = prices[TIGER_CLAW];
				break;
			case 'Toadstool':
				item_price = prices[TOADSTOOL];
				break;
			case 'Viper venom':
				item_price = prices[VIPER_VENOM];
				break;
			case 'Windflower':
				item_price = prices[WINDFLOWER];
				break;
			case 'Witch bloom':
				item_price = prices[WITCH_BLOOM];
				break;
		}
		
		matched = received.match(/(\d*) pcs/);
		if (matched != null) {
			item_price *= RegExp.$1;
		}		
		matched = transfer_record.match(/Commission: (\d*)/);
		net_gold = (parseInt(received) - parseInt(RegExp.$1)) - item_price;
		break;
		
	case SOLD_ESTATES:			// xx-xx-xx xx:xx: Sold Estates xx for xx gold to xx as lot xx. Commission: xx.
		start_str = 'Sold Estates ';
		end_str = ' for ';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 13, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/for (\d*) gold/);
		received = RegExp.$1;
		
		start_str = 'to <a';
		end_str = ' as lot';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str) + 3, transfer_record.indexOf(end_str));
		
		start_str = 'lot';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
			
		matched = transfer_record.match(/Commission: (\d*)/);
		net_gold = parseInt(received) - parseInt(RegExp.$1);
		break;
		
	case SOLD_SKELETON:			// xx-xx-xx xx:xx: Sold Skeletons: xx pcs. for xx gold to xx as lot xx. Commission: xx
		start_str = 'Sold Skeletons: ';
		end_str = ' for ';
		matched = transfer_record.match(/(\d*) pcs/);
		if (matched != null) {
			item_price = RegExp.$1;
			transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 16, transfer_record.indexOf(end_str)) + ' Skeletons';
		} else {
			item_price = 1;
			transferred = '1 Skeleton';
		}
		
		matched = transfer_record.match(/for (\d*) gold/);
		received = RegExp.$1;
		
		start_str = '<a';
		end_str = ' as lot';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		start_str = 'lot';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
			
		matched = transfer_record.match(/Commission: (\d*)/);
		net_gold = (parseInt(received) - parseInt(RegExp.$1)) - item_price;
		break;
		
	case RETURNED_ITEM:
		if (transfer_record.indexOf('has returned an item:') != -1) {
			start_str = '<a';
			end_str = ' has returned an item:';
			transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
			start_str = 'has returned an item:';
			description = transfer_record.substring(transfer_record.indexOf(start_str));
		} else if (transfer_record.indexOf('has withdrawn an item:') != -1) {
			start_str = '<a';
			end_str = ' has withdrawn an item:';
			transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
			start_str = 'has withdrawn an item:';
			description = transfer_record.substring(transfer_record.indexOf(start_str));
		} else if ((transfer_record.indexOf('Item withdrawn:') != -1)
			|| (transfer_record.indexOf('Item returned:') != -1)) {
			start_str = '<a';
			transfer_player = transfer_record.substring(transfer_record.indexOf(start_str));
			start_str = 'Item returned:';
			end_str = ' to ';
			description = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		}
		received = '';
		transferred = '';
		net_gold = '';
	
		break;
	case RECEIVED_RESOURCE_OR_GOLD:			// xx-xx-xx xx:xx: Received xx Gold xx Gems xx Crystals xx Sulfur xx Mercury xx Ore xx Wood from xx : xx
		start_str = 'Received ';
		end_str = ' from ';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 9, transfer_record.indexOf(end_str));
		
		transferred = '';
		
		start_str = '<a';
		end_str = ' : ';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		description = transfer_record.substring(transfer_record.indexOf(end_str) + 3);
		
		item_price = 0;
		matched = received.match(/(\d*) [gG]old/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1);
		}
		matched = received.match(/(\d*) Wood/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[WOOD];
		}
		matched = received.match(/(\d*) Ore/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[ORE];
		}
		matched = received.match(/(\d*) Mercury/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[MERCURY];
		}
		matched = received.match(/(\d*) Sulfur/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[SULFUR];
		}
		matched = received.match(/(\d*) Crystals/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[CRYSTALS];
		}
		matched = received.match(/(\d*) Gems/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[GEMS];
		}

		net_gold = item_price; 
		break;
		
	case RECEIVED_ITEM:			// xx-xx-xx xx:xx: Received item(s): 'xx' [xx/xx] from xx
		start_str = 'Received item(s): ';
		end_str = ' from ';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 18, transfer_record.indexOf(end_str));
		
		transferred = '';
		
		start_str = '<a';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str));
		
		description = '';
		
		matched = received.match(/'(\D*)'/);
		item_price = getArtPrice(RegExp.$1);
		matched = received.match(/(\d*) pcs/);
		if (matched != null) {
			item_price *= RegExp.$1;
		}		
		net_gold = item_price;
		break;
		
	case RECEIVED_ITEM_REPAIR:			// xx-xx-xx xx:xx: Received item(s): 'xx' [xx/xx] to be returned until xx ; for 0 battles ; (repairing allowed) from xx . Transaction price: xx Gold
		start_str = 'Received item(s): ';
		end_str = ' to be returned';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 18, transfer_record.indexOf(end_str));

		matched = transfer_record.match(/Transaction price: (\d*) Gold/);
		transferred = RegExp.$1;
		
		start_str = '<a';
		end_str = ' . ';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		start_str = 'to be returned';
		end_str = ' from ';
		description = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		net_gold = -1 * transferred;
		break;
		
	case RECEIVED_ITEM_LEASE:			// xx-xx-xx xx:xx: Received item(s): 'xx' [xx/xx] to be returned until xx ; for xx battles  from xx . Transaction price: xx Gold
		start_str = 'Received item(s): ';
		end_str = ' to be returned';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 18, transfer_record.indexOf(end_str));

		matched = transfer_record.match(/Transaction price: (\d*) Gold/);
		transferred = RegExp.$1;
		
		start_str = '<a';
		end_str = ' . ';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		start_str = 'to be returned';
		end_str = ' from ';
		description = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		net_gold = -1 * transferred;
		break;
		
	case RECEIVED_ITEM_ACQUIRE:		// xx-xx-xx xx:xx: Received item(s): 'xx' [xx/xx] from xx . Transaction price: xx Gold
		start_str = 'Received item(s): ';
		end_str = ' from ';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 18, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/Transaction price: (\d*) Gold/);
		transferred = RegExp.$1;
		
		start_str = '<a';
		end_str = ' . ';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		description = '';
		
		matched = received.match(/'(\D*)'/);
		item_price = getArtPrice(RegExp.$1);
		matched = received.match(/(\d*) pcs/);
		if (matched != null) {
			item_price *= RegExp.$1;
		}		
		matched = transfer_record.match(/Transaction price: (\d*)/);
		net_gold = item_price - RegExp.$1;
		break;
		
	case RECEIVED_ELEMENT:		// xx-xx-xx xx:xx: Received element(s): 'xx' xx pcs. from xx . Transaction price: xx Gold: xx
		start_str = 'Received element(s): ';
		end_str = ' from ';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 21, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/Transaction price: (\d*) Gold/);
		if (matched != null) {
			transferred = RegExp.$1;		
			start_str = 'Gold: ';
		} else {
			transferred = '';
			start_str = '</a>: ';
		}
		description = '';
		
		start_str = '<a';
		end_str = '</a>';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str) + 4);		
		
		matched = received.match(/'(\D*)'/);
		switch (RegExp.$1) {
			case 'Abrasive':
				item_price = prices[ABRASIVE];
				break;
			case 'Fern flower':
				item_price = prices[FERN_FLOWER];
				break;
			case 'Fire crystal':
				item_price = prices[FIRE_CRYSTAL];
				break;
			case 'Ice crystal':
				item_price = prices[ICE_CRYSTAL];
				break;
			case 'Meteorite shard':
				item_price = prices[METEORITE_SHARD];
				break;
			case 'Moonstone':
				item_price = prices[MOONSTONE];
				break;
			case 'Tiger`s claw':
				item_price = prices[TIGER_CLAW];
				break;
			case 'Toadstool':
				item_price = prices[TOADSTOOL];
				break;
			case 'Viper venom':
				item_price = prices[VIPER_VENOM];
				break;
			case 'Windflower':
				item_price = prices[WINDFLOWER];
				break;
			case 'Witch bloom':
				item_price = prices[WITCH_BLOOM];
				break;
		}
		matched = received.match(/(\d*) pcs/);
		if (matched != null) {
			item_price *= RegExp.$1;
		}
		if (transferred == '') {
			net_gold = item_price;
		} else {
			net_gold = item_price - transferred;
		}
		
		break;
		
	case TRANSFERRED_RESOURCE_OR_GOLD:		// xx-xx-xx xx:xx: Transferred xx Gold  to xx, Commission charged: xx : xx
		start_str = 'Transferred ';
		end_str = ' to ';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 12, transfer_record.indexOf(end_str));
		
		received = '';
		start_str = '<a';
		end_str = '</a>';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str) + 4);		
		
		if (transfer_record.indexOf('Commission charged') != -1) {
			start_str = 'Commission charged';
			description = transfer_record.substring(transfer_record.indexOf(start_str));
		} else {
			start_str = ' : ';
			description = transfer_record.substring(transfer_record.indexOf(start_str) + 3);
		}
		
		item_price = 0;
		matched = transferred.match(/(\d*) [gG]old/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1);
		}
		matched = transferred.match(/(\d*) Wood/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[WOOD];
		}
		matched = transferred.match(/(\d*) Ore/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[ORE];
		}
		matched = transferred.match(/(\d*) Mercury/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[MERCURY];
		}
		matched = transferred.match(/(\d*) Sulfur/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[SULFUR];
		}
		matched = transferred.match(/(\d*) Crystals/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[CRYSTALS];
		}
		matched = transferred.match(/(\d*) Gems/);
		if (matched != null) {
			item_price += parseInt(RegExp.$1) * prices[GEMS];
		}

		matched = transfer_record.match(/Commission charged: (\d*)/);
		if (matched != null) {
			net_gold = -1 * (item_price + parseInt(RegExp.$1));
		} else {
			net_gold = -1 * item_price;
		}
		break;
		
	case TRANSFERRED_ITEM_REPAIR:		// xx-xx-xx xx:xx: Transferred item(s): 'xx' [xx/xx] to be returned until xx ; for x battles  ; (repairing allowed) to xx . Transaction price: xx Gold, Commission: xx
		start_str = 'Transferred item(s): ';
		end_str = ' to be returned';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 21, transfer_record.indexOf(end_str));
		
		start_str = '<a';
		end_str = ' . ';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));		
		
		start_str = 'to be returned';
		end_str = ' to <a';
		description = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str)); 
		
		matched = transfer_record.match(/Transaction price: (\d*) Gold/);
		item_price = parseInt(RegExp.$1);
		matched = transfer_record.match(/Commission: (\d*)/);
		if (matched != null) {
			received = item_price - parseInt(RegExp.$1);
		} else {
			received = item_price;
		}
		net_gold = received;
		break;

	case TRANSFERRED_ITEM_LEASE:		// xx-xx-xx xx:xx: Transferred item(s): 'xx' [xx/xx] to be returned until xx ; for x battles  to xx . Transaction price: x Gold, Commission: x
		start_str = 'Transferred item(s): ';
		end_str = ' to be returned';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 21, transfer_record.indexOf(end_str));
		
		start_str = '<a';
		end_str = ' . ';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));		
		
		start_str = 'Commission';
		matched = transfer_record.match(/for (\d*) battles/)
		description = transfer_record.substring(transfer_record.indexOf(start_str)) + ', for ' + RegExp.$1 + ' battles';
		
		matched = transfer_record.match(/Transaction price: (\d*) Gold/);
		item_price = parseInt(RegExp.$1);
		matched = transfer_record.match(/Commission: (\d*)/);
		received = item_price;
		net_gold = received - parseInt(RegExp.$1);
		break;

	case TRANSFERRED_ITEM_SELL:		// xx-xx-xx xx:xx: Transferred item(s): 'xx' [xx/xx] to xx . Transaction price: xx Gold, Commission: x
		start_str = 'Transferred item(s): ';
		end_str = ' to ';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 21, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/Transaction price: (\d*) Gold/);
		received = RegExp.$1;
		
		start_str = '<a';
		end_str = ' . ';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		start_str = 'Commission';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		
		matched = transferred.match(/'(\D*)'/);
		item_price = getArtPrice(RegExp.$1);
		matched = transfer_record.match(/Commission: (\d*)/);
		if (matched != null) {
			net_gold = (parseInt(received) - parseInt(RegExp.$1)) - item_price;
		} else {
			net_gold = parseInt(received) - item_price;
		}
		break;
		
	case TRANSFERRED_ITEM_FREE:		// xx-xx-xx xx:xx: Transferred item(s): 'xx' [xx/xx] to xx
		start_str = 'Transferred item(s): ';
		end_str = ' to ';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 21, transfer_record.indexOf(end_str));
		
		received = '';
		
		start_str = '<a';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str));
		description = '';
		
		matched = transferred.match(/'(\D*)'/);
		item_price = getArtPrice(RegExp.$1);
		net_gold = -1 * item_price;
		break;
		
	case TRANSFERRED_ELEMENT:		// xx-xx-xx xx:xx: Transferred element(s): 'xx' xx pcs. to xx . Transaction price: xx Gold, Commission xx: xx
		start_str = 'Transferred element(s): ';
		end_str = ' to <';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 24, transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/Transaction price: (\d*) Gold/);
		if (matched != null) {
			received = RegExp.$1;
		} else {
			received = '';
		}
				
		start_str = '<a';
		end_str = '</a>';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str) + 4);
		
		if (transfer_record.indexOf('Commission') != -1) {
			start_str = 'Commission';
			description = transfer_record.substring(transfer_record.indexOf(start_str));
		} else {
			start_str = '</a>: ';
			description = transfer_record.substring(transfer_record.indexOf(start_str) + 6);
		}
		
		matched = transferred.match(/'(\D*)'/);
		switch (RegExp.$1) {
			case 'Abrasive':
				item_price = prices[ABRASIVE];
				break;
			case 'Fern flower':
				item_price = prices[FERN_FLOWER];
				break;
			case 'Fire crystal':
				item_price = prices[FIRE_CRYSTAL];
				break;
			case 'Ice crystal':
				item_price = prices[ICE_CRYSTAL];
				break;
			case 'Meteorite shard':
				item_price = prices[METEORITE_SHARD];
				break;
			case 'Moonstone':
				item_price = prices[MOONSTONE];
				break;
			case 'Tiger`s claw':
				item_price = prices[TIGER_CLAW];
				break;
			case 'Toadstool':
				item_price = prices[TOADSTOOL];
				break;
			case 'Viper venom':
				item_price = prices[VIPER_VENOM];
				break;
			case 'Windflower':
				item_price = prices[WINDFLOWER];
				break;
			case 'Witch bloom':
				item_price = prices[WITCH_BLOOM];
				break;
		}
		matched = transferred.match(/(\d*) pcs/);
		if (matched != null) {
			item_price *= RegExp.$1;
		} 
		if (received == '') {
			net_gold = -1 * item_price;
		} else {
			net_gold = received - item_price;
		}
		matched = transfer_record.match(/Commission: (\d*)/);
		if (matched != null) {
			net_gold -= parseInt(RegExp.$1);
		}
		break;
		
	case RENTED:		// xx-xx-xx xx:xx: Rent paid: xx gold (xx/d) for room xx until xx, Estates xx (owner: xx).
		start_str = 'Rent paid: ';
		end_str = ' for room';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 11, transfer_record.indexOf(end_str));
		received = '';
		
		start_str = '(owner: <a';
		end_str = ').';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str) + 8, transfer_record.indexOf(end_str));		
		
		start_str = 'Estates';
		end_str = '(owner: <a';
		description = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str));
		
		matched = transfer_record.match(/(\d*) gold/);
		net_gold = -1 * parseInt(RegExp.$1);
		break;

	case CLAN_TRANSFERRED:		// xx-xx-xx xx:xx: Transferred xx gold to the xx clan account
		start_str = 'Transferred ';
		end_str = ' to the ';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 12, transfer_record.indexOf(end_str));
		
		received = '';
		start_str = '<a';
		end_str = '</a>';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str) + 4);		
		
		start_str = '</a>';
		description = transfer_record.substring(transfer_record.indexOf(start_str) + 5);
		
		matched = transferred.match(/(\d*) gold/);
		item_price = RegExp.$1;
		net_gold = -1 * item_price;
		break;
		
	case CLAN_WITHDRAW:		// xx-xx-xx xx:xx: Withdrawn xx gold from the xx clan account
		start_str = 'Withdrawn ';
		end_str = ' from the ';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 10, transfer_record.indexOf(end_str));
		
		received = '';
		start_str = '<a';
		end_str = '</a>';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str) + 4);		
		
		start_str = '</a>';
		description = transfer_record.substring(transfer_record.indexOf(start_str) + 5);
		
		matched = transferred.match(/(\d*) gold/);
		net_gold = RegExp.$1;
		break;

	case ESTATE_WITHDRAWN:		// xx-xx-xx xx:xx: Withdrawn xx gold from "Estates" xx's account.
		start_str = 'Withdrawn ';
		end_str = ' from ';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 10, transfer_record.indexOf(end_str));
		
		transferred = '';
		start_str = '<a';
		end_str = '</a>';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str) + 4);		
		
		description = '';
		
		matched = received.match(/(\d*) gold/);
		net_gold = RegExp.$1;
		break;

	case ESTATE_DEPOSITED:		// xx-xx-xx xx:xx: Deposited xx gold to "Estates" #xx's account.
		start_str = 'Deposited ';
		end_str = ' to ';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 10, transfer_record.indexOf(end_str));
		
		received = '';
		start_str = '<a';
		end_str = '</a>';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str) + 4);		
		
		description = '';
		
		matched = transferred.match(/(\d*) gold/);
		net_gold = -1 * parseInt(RegExp.$1);
		break;

	case ESTATE_PLACED:		// xx-xx-xx xx:xx: Artifact 'xx' [xx/xx] placed into "Estates" #xx.
		start_str = 'Artifact ';
		end_str = ' placed ';
		transferred = transfer_record.substring(transfer_record.indexOf(start_str) + 9, transfer_record.indexOf(end_str));
		
		received = '';
		start_str = '<a';
		end_str = '</a>';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str) + 4);		
		
		start_str = 'placed';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		
		net_gold = '';
		break;

	case ESTATE_ITEM_WITHDRAWN:		// xx-xx-xx xx:xx: Witdrawn 'xx' [xx/xx] artifact from "Estates" xx.
		start_str = 'Witdrawn ';
		end_str = ' artifact';
		received = transfer_record.substring(transfer_record.indexOf(start_str) + 9, transfer_record.indexOf(end_str));
		
		transferred = '';
		start_str = '<a';
		end_str = '</a>';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str) + 4);		
		
		start_str = 'from';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		
		net_gold = '';
		break;

	case ESTATE_MODIFIED:		// xx-xx-xx xx:xx: Estates xx, annex added: xx.
		transferred = '';		
		received = '';
		start_str = '<a';
		end_str = '</a>';
		transfer_player = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str) + 4);		
		net_gold = '';
		
		start_str = 'annex';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		break;
		
	case FACTION_CHANGE:		// xx-xx-xx xx:xx: Faction changed: xx to xx.
		transferred = '';		
		received = '';
		transfer_player = '';	
		net_gold = '';
		
		start_str = 'Faction';
		end_str = '>.';
		description = transfer_record.substring(transfer_record.indexOf(start_str), transfer_record.indexOf(end_str) + 1);
		break;
		
	case CASTLE_MODIFIED:		// xx-xx-xx xx:xx: Castle modified. Construction added: xx.
		transferred = '';		
		received = '';
		transfer_player = '';	
		net_gold = '';
		
		start_str = 'Construction';
		description = transfer_record.substring(transfer_record.indexOf(start_str));
		break;
		
	case OTHER:
		transferred = '';		
		received = '';
		transfer_player = '';	
		net_gold = '';
		description = transfer_record;
	
	}
	
}

// this function sets default prices for resources, elements, and arts
function setConstants() {
	// min prices in mines for resources
	prices[WOOD] = 183;
	prices[ORE] = 184;
	prices[MERCURY] = 368;
	prices[SULFUR] = 369;
	prices[CRYSTALS] = 369;
	prices[GEMS] = 369;
	
	prices[ABRASIVE] = 300;
	prices[FERN_FLOWER] = 3500;
	prices[FIRE_CRYSTAL] = 2000;
	prices[ICE_CRYSTAL] = 3000;
	prices[METEORITE_SHARD] = 2000;
	prices[MOONSTONE] = 4800;
	prices[TIGER_CLAW] = 3800;
	prices[TOADSTOOL] = 250;
	prices[VIPER_VENOM] = 600;
	prices[WINDFLOWER] = 3800;
	prices[WITCH_BLOOM] = 250;

	prices[LEATHER_HAT] = 500;
	prices[LEATHER_HELMET] = 1900;
	prices[WIZARD_CAP] = 4953;
	prices[HAT_OF_KNOWLEDGE] = 5916;
	prices[CHAIN_HELMET] = 4742;
	prices[STEEL_HELMET] = 11032;
	prices[WIZARD_HELMET] = 17375;
	prices[LIGHT_MITHRIL_COIF] = 15886;
	prices[HEAVY_MITHRIL_COIF] = 19095;
	prices[WARLOCK_CROWN] = 19375;
	prices[OBSIDIAN_HELMET] = 19368;
	prices[FLAME_HELMET] = 20045;
	prices[FIREBENDER_CROWN] = 20087;
	prices[MEDAL_OF_BRAVERY] = 1669;
	prices[AMULET_OF_LUCK] = 2909;
	prices[PENDANT_OF_DESPAIR] = 21498;
	prices[WARRIOR_PENDANT] = 24340;
	prices[LOCKET_OF_CRYSTALIZED_TEARS] = 25380;
	prices[MYSTICAL_AMULET] = 30450;
	prices[PENDANT_OF_WRATH] = 30350;
	prices[TRIFORCE_CHARM] = 33130;
	prices[LEATHER_ARMOR] = 780;
	prices[LEATHER_HARNESS] = 4104;
	prices[HAUBERK] = 7152;
	prices[STEEL_CUIRASS] = 13746;
	prices[WIZARD_ATTIRE] = 27370;
	prices[LIGHT_MITHRIL_CUIRASS] = 19055;
	prices[PLATEMAIL] = 28040;
	prices[SORCERER_ROBE] = 28380;
	prices[FULLMITHRIL_ARMOR] = 29880;
	prices[FIREBENDER_ROBE] = 28420;
	prices[FLAME_PLATE] = 28210;
	prices[SHORTBOW] = 1032;
	prices[LONG_BOW] = 19365;
	prices[COMPOSITE_BOW] = 25010;
	prices[BOW_OF_MIDNIGHT_STILL] = 30195;
	prices[SCOUTS_CAPE] = 903;
	prices[CAPE_OF_SPIRITS] = 4099;
	prices[CAPE_OF_WINDS] = 9102;
	prices[CAPE_OF_MAGICAL_POWER] = 24740;
	prices[CAPE_OF_ARCANE_PROTECTION] = 14950;
	prices[SORCERER_CAPE] = 26590;
	prices[FIREBENDER_MANTLE] = 29250;
	prices[WOODEN_SWORD] = 400;
	prices[LIGHT_AXE] = 1052;
	prices[STEEL_BLADE] = 1550;
	prices[REPRISAL_SWORD] = 3897;
	prices[SWORD_OF_RETRIBUTION] = 7916;
	prices[COMBAT_STAFF] = 9377;
	prices[EQUILIBRIUM_BLADE] = 14716;
	prices[SWORD_OF_MIGHT] = 30690;
	prices[STAFF_OF_POWER] = 44490;
	prices[MITHRIL_STAFF] = 49905;
	prices[MITHRIL_LONGSWORD] = 51630;
	prices[RUBY_QUARTER_STAFF] = 51735;
	prices[RUBY_GLADIUS] = 52295;
	prices[FIREBENDER_STAFF] = 53860;
	prices[BLADE_OF_REBIRTH] = 53770;
	prices[DAGGER_OF_VENGEANCE] = 2800;
	prices[SCROLL_OF_ENERGY] = 27375;
	prices[ROUND_SHIELD] = 300;
	prices[STEEL_BUCKLER] = 800;
	prices[DEFENDER_SHIELD] = 3301;
	prices[DRAGON_SHIELD] = 27333;
	prices[TOWER_SHIELD] = 29050;
	prices[OBSIDIAN_SHIELD] = 30895;
	prices[LEATHER_JACKBOOTS] = 600;
	prices[LEATHER_BOOTS] = 2600;
	prices[GALOSHES_OF_BATTLE] = 3101;
	prices[SHOES_OF_ASPIRATION] = 7402;
	prices[STEEL_BOOTS] = 17562;
	prices[LIGHT_MITHRIL_BOOTS] = 21715;
	prices[HEAVY_MITHRIL_BOOTS] = 23555;
	prices[SORCERER_SANDALS] = 24325;
	prices[OBSIDIAN_BOOTS] = 25844;
	prices[WARLOCK_JACKBOOTS] = 26800;
	prices[FLAME_BOOTS] = 26030;
	prices[RING_OF_DEXTERITY] = 500;
	prices[RING_OF_INSPIRATION] = 4738;
	prices[RING_OF_DOUBTS] = 5786;
	prices[RING_OF_IMPETUOSITY] = 5903;
	prices[RING_OF_ABDICATION] = 18440;
	prices[PROPHET_RING] = 20315;
	prices[PENUMBRAL_RING] = 25370;
	prices[SIGNET_RING_OF_MIGHT] = 23300;
	prices[SORCERER_SIGNET] = 31250;
	prices[DRAGONS_EYE] = 31180;
	prices[RING_OF_CONTRADICTIONS] = 31578;
	prices[DIAMOND_PENDANT] = 70000;
	prices[HEART_OF_FLOWERS] = 5000;
	prices[THE_OTHER_HALF_F] = 15000;
	prices[THE_OTHER_HALF_M] = 15000;
	prices[DEFENDERS_DAGGER] = 4000;
	prices[DELIGHT_BOUQUET] = 1000;
	prices[FEMALE_HAPPINESS_BOUQUET] = 1000;
	prices[AROMA_OF_SPRING_BOUQUET] = 10000;
	prices[DIAMOND_RING] = 100000;
	prices[AROMA_OF_PASSION] = 10000;
	prices[SILVER_PARTISAN] = 25000;
	prices[TEMTRESS_BOOTS] = 50000;
	prices[DARLING_BOUQUET] = 15000;
	prices[MAGNIFICIENT_BOUQUET] = 15000;
	prices[PROTECTORS_CUIRASS] = 40000;
	prices[ARMOR_OF_ELEGANCE] = 50000;	
	prices[ALE] = 100;
	prices[ELIXIR_OF_RESTORATION] = 7500;
	prices[MANA_TUBE] = 605;
	prices[POTION_OF_OBLIVION] = 2500;


	// hunter arts
	prices[HUNTER_BROADSWORD] = 150;
	prices[HUNTER_SHIELD] = 600;
	prices[HUNTER_BOOTS] = 400;
	prices[HUNTER_SHIRT] = 400;
	prices[HUNTER_BOW] = 800;
	prices[HUNTER_GLOVE] = 1000;
	prices[HUNTER_PENDANT] = 300;
	prices[HUNTER_HAT] = 400;
	prices[MH_SABRE] = 1300;
	prices[MH_CUTLASS] = 1500;
	prices[MH_DAGGER] = 600;
	prices[MH_SHIELD] = 650;
	prices[MH_JACKBOOTS] = 700;
	prices[MH_BOOTS] = 700;
	prices[MH_ARMOR] = 4200;
	prices[MH_MASKROBE] = 750;
	prices[MH_BOW] = 1100;
	prices[MH_ARROWS] = 500;
	prices[MH_AMULET] = 2600;
	prices[MH_RING_OF_FLIGHT] = 1100;
	prices[MH_RING_OF_DEXTERITY] = 2800;
	prices[MH_HELMET] = 1800;
	prices[MH_BONE_HELMET] = 700;
	prices[GH_SWORD] = 3200;
	prices[GH_KNUCKLEDUSTER] = 3300;
	prices[GH_SHIELD] = 1400;
	prices[GH_BOOTS] = 1200;
	prices[GH_ARMOR] = 5800;
	prices[GH_MASKROBE] = 3700;
	prices[GH_BOW] = 3500;
	prices[GH_ARROWS] = 1100;
	prices[GH_AMULET] = 3000;
	prices[GH_RING_OF_DEXTERITY] = 3800;
	prices[GH_RING_OF_CHARM] = 3800;
	prices[GH_HELMET] = 5600;
	prices[BB_BLADE] = 20000;
	prices[BB_SPEAR] = 20000;
	prices[BB_SHIELD] = 2500;
	prices[BB_BOOTS] = 2300;
	prices[BB_ARMOR] = 13000;
	prices[BB_MASKROBE] = 12000;
	prices[BB_BOW] = 20000;
	prices[BB_ARROWS] = 3000;
	prices[BB_CHARM] = 4500;
	prices[BB_SIGNET] = 9000;
	prices[BB_BAND] = 20000;
	prices[BB_HELMET] = 7800;

	// special arts
	prices[THIEF_DAGGER] = 45000;
	prices[THIEF_BOOTS] = 18500;
	prices[THIEF_ARMOR] = 26000;
	prices[THIEF_CLOAK] = 48000;
	prices[THIEF_CROSSBOW] = 25000;
	prices[THIEF_AMULET] = 68000;
	prices[THIEF_RING] = 55000;
	prices[THIEF_MASK] = 15000;
}

// this function returns the price of the passed artifact
function getArtPrice (passed_art) {
	if (passed_art.match(/(\D*) \[/) != null) {
		passed_art = RegExp.$1;
	}
	switch (passed_art) {
		case 'Leather hat':
			return prices[LEATHER_HAT];
		case 'Leather helmet':			
			return prices[LEATHER_HELMET];
		case 'Wizard cap':			
			return prices[WIZARD_CAP];
		case 'Hat of knowledge':			
			return prices[HAT_OF_KNOWLEDGE];
		case 'Chain helmet':			
			return prices[CHAIN_HELMET];
		case 'Steel helmet':			
			return prices[STEEL_HELMET];
		case 'Wizard helmet':			
			return prices[WIZARD_HELMET];
		case 'Light mithril coif':			
			return prices[LIGHT_MITHRIL_COIF];
		case 'Heavy mithril coif':			
			return prices[HEAVY_MITHRIL_COIF];
		case 'Warlock crown':			
			return prices[WARLOCK_CROWN];
		case 'Obsidian helmet':			
			return prices[OBSIDIAN_HELMET];
		case 'Flame helmet':			
			return prices[FLAME_HELMET];
		case 'Firebender crown':			
			return prices[FIREBENDER_CROWN];

		case 'Medal of bravery':			
			return prices[MEDAL_OF_BRAVERY];
		case 'Amulet of luck':			
			return prices[AMULET_OF_LUCK];
		case 'Pendant of despair':			
			return prices[PENDANT_OF_DESPAIR];
		case 'Warrior pendant':			
			return prices[WARRIOR_PENDANT];
		case 'Locket of crystallized tears':			
			return prices[LOCKET_OF_CRYSTALIZED_TEARS];
		case 'Mystical amulet':			
			return prices[MYSTICAL_AMULET];
		case 'Pendant of wrath':			
			return prices[PENDANT_OF_WRATH];
		case 'Triforce charm':			
			return prices[TRIFORCE_CHARM];
			
		case 'Leather armor':			
			return prices[LEATHER_ARMOR];
		case 'Leather harness':			
			return prices[LEATHER_HARNESS];
		case 'Hauberk':			
			return prices[HAUBERK];
		case 'Steel cuirass':			
			return prices[STEEL_CUIRASS];
		case 'Wizard attire':			
			return prices[WIZARD_ATTIRE];
		case 'Light mithril cuirass':			
			return prices[LIGHT_MITHRIL_CUIRASS];
		case 'Platemail':			
			return prices[PLATEMAIL];
		case 'Sorcerer robe':			
			return prices[SORCERER_ROBE];
		case 'Fullmithril armor':			
			return prices[FULLMITHRIL_ARMOR];
		case 'Firebender robe':			
			return prices[FIREBENDER_ROBE];
		case 'Flame plate':			
			return prices[FLAME_PLATE];
			
		case 'Shortbow':			
			return prices[SHORTBOW];
		case 'Longbow':			
			return prices[LONG_BOW];
		case 'Composite bow':			
			return prices[COMPOSITE_BOW];
		case 'Bow of midnight still':			
			return prices[BOW_OF_MIDNIGHT_STILL];
		case 'Scout`s cape':			
			return prices[SCOUTS_CAPE];
		case 'Cape of spirits':			
			return prices[CAPE_OF_SPIRITS];
		case 'Cape of winds':			
			return prices[CAPE_OF_WINDS];
		case 'Cape of magical power':			
			return prices[CAPE_OF_MAGICAL_POWER];
		case 'Cape of arcane protection':			
			return prices[CAPE_OF_ARCANE_PROTECTION];
		case 'Sorcerer cape':			
			return prices[SORCERER_CAPE];
		case 'Firebender mantle':			
			return prices[FIREBENDER_MANTLE];
			
		case 'Wooden sword':			
			return prices[WOODEN_SWORD];
		case 'Light axe':			
			return prices[LIGHT_AXE];
		case 'Steel blade':			
			return prices[STEEL_BLADE];
		case 'Reprisal sword':			
			return prices[REPRISAL_SWORD];
		case 'Sword of retribution':			
			return prices[SWORD_OF_RETRIBUTION];
		case 'Combat staff':			
			return prices[COMBAT_STAFF];
		case 'Equilibrium blade':			
			return prices[EQUILIBRIUM_BLADE];
		case 'Sword of might':			
			return prices[SWORD_OF_MIGHT];
		case 'Staff of power':			
			return prices[STAFF_OF_POWER];
		case 'Mithril staff':			
			return prices[MITHRIL_STAFF];
		case 'Mithril longsword':			
			return prices[MITHRIL_LONGSWORD];
		case 'Ruby quarterstaff':			
			return prices[RUBY_QUARTER_STAFF];
		case 'Ruby gladius':			
			return prices[RUBY_GLADIUS];
		case 'Firebender staff':			
			return prices[FIREBENDER_STAFF];
		case 'Blade of rebirth':			
			return prices[BLADE_OF_REBIRTH];
			
		case 'Dagger of vengeance':			
			return prices[DAGGER_OF_VENGEANCE];
		case 'Scroll of energy':			
			return prices[SCROLL_OF_ENERGY];
		case 'Round shield':			
			return prices[ROUND_SHIELD];
		case 'Steel buckler':			
			return prices[STEEL_BUCKLER];
		case 'Defender shield':			
			return prices[DEFENDER_SHIELD];
		case 'Dragon shield':			
			return prices[DRAGON_SHIELD];
		case 'Tower shield':			
			return prices[TOWER_SHIELD];
		case 'Obsidian shield':			
			return prices[OBSIDIAN_SHIELD];
			
		case 'Leather jackboots':			
			return prices[LEATHER_JACKBOOTS];
		case 'Leather boots':			
			return prices[LEATHER_BOOTS];
		case 'Galoshes of battle':			
			return prices[GALOSHES_OF_BATTLE];
		case 'Shoes of aspiration':			
			return prices[SHOES_OF_ASPIRATION];
		case 'Steel boots':			
			return prices[STEEL_BOOTS];
		case 'Light mithril boots':			
			return prices[LIGHT_MITHRIL_BOOTS];
		case 'Heavy mithril boots':			
			return prices[HEAVY_MITHRIL_BOOTS];
		case 'Sorcerer sandals':			
			return prices[SORCERER_SANDALS];
		case 'Obsidian boots':			
			return prices[OBSIDIAN_BOOTS];
		case 'Warlock jackboots':			
			return prices[WARLOCK_JACKBOOTS];
		case 'Flame boots':			
			return prices[FLAME_BOOTS];
			
		case 'Ring of dexterity':			
			return prices[RING_OF_DEXTERITY];
		case 'Ring of inspiration':			
			return prices[RING_OF_INSPIRATION];
		case 'Ring of doubts':			
			return prices[RING_OF_DOUBTS];
		case 'Ring of impetuosity':			
			return prices[RING_OF_IMPETUOSITY];
		case 'Ring of abdication':			
			return prices[RING_OF_ABDICATION];
		case 'Prophet ring':			
			return prices[PROPHET_RING];
		case 'Penumbral ring':			
			return prices[PENUMBRAL_RING];
		case 'Signet-ring of might':			
			return prices[SIGNET_RING_OF_MIGHT];
		case 'Sorcerer signet':			
			return prices[SORCERER_SIGNET];
		case 'Dragon`s eye':			
			return prices[DRAGONS_EYE];
		case 'Ring of contradictions':			
			return prices[RING_OF_CONTRADICTIONS];

		case 'Diamond pendant':			
			return prices[DIAMOND_PENDANT];
		case 'Heart of flowers':			
			return prices[HEART_OF_FLOWERS];
		case 'The other half (F)':			
			return prices[THE_OTHER_HALF_F];
		case 'The other half (M)':			
			return prices[THE_OTHER_HALF_M];
		case 'Defender`s dagger':			
			return prices[DEFENDERS_DAGGER];
		case '`Delight` bouquet':			
			return prices[DELIGHT_BOUQUET];
		case '`Female happiness` bouquet':			
			return prices[FEMALE_HAPPINESS_BOUQUET];
		case '`Aroma of spring` bouquet':			
			return prices[AROMA_OF_SPRING_BOUQUET];
		case 'Diamond ring':			
			return prices[DIAMOND_RING];
		case 'Aroma of passion':			
			return prices[AROMA_OF_PASSION];
		case 'Silver partisan':			
			return prices[SILVER_PARTISAN];
		case 'Temptress` boots':			
			return prices[TEMTRESS_BOOTS];
		case '`Darling` bouquet':			
			return prices[DARLING_BOUQUET];
		case '`Magnificent` bouquet':			
			return prices[MAGNIFICIENT_BOUQUET];
		case 'Protector`s cuirass':			
			return prices[PROTECTORS_CUIRASS];
		case 'Armor of elegance':			
			return prices[ARMOR_OF_ELEGANCE];
		case 'Ale':			
			return prices[ALE];
		
		case 'Elixir of restoration':			
			return prices[ELIXIR_OF_RESTORATION];
		case 'Mana tube':			
			return prices[MANA_TUBE];
		case 'Potion of oblivion':			
			return prices[POTION_OF_OBLIVION];
			
		case 'Hunter broadsword':					
			return prices[HUNTER_BROADSWORD];
		case 'Hunter shield':			
			return prices[HUNTER_SHIELD];
		case 'Hunter boots':			
			return prices[HUNTER_BOOTS];
		case 'Hunter shirt':			
			return prices[HUNTER_SHIRT];
		case 'Hunter bow':			
			return prices[HUNTER_BOW];
		case 'Hunter glove':			
			return prices[HUNTER_GLOVE];
		case 'Hunter pendant':			
			return prices[HUNTER_PENDANT];
		case 'Hunter hat':			
			return prices[HUNTER_HAT];
		case 'Master hunter sabre':			
			return prices[MH_SABRE];
		case 'Master hunter cutlass':			
			return prices[MH_CUTLASS];
		case 'Master hunter dagger':			
			return prices[MH_DAGGER];
		case 'Master hunter shield':			
			return prices[MH_SHIELD];
		case 'Master hunter jackboots':			
			return prices[MH_JACKBOOTS];
		case 'Master hunter boots':			
			return prices[MH_BOOTS];
		case 'Master hunter armor':			
			return prices[MH_ARMOR];
		case 'Master hunter maskrobe':			
			return prices[MH_MASKROBE];
		case 'Master hunter bow':			
			return prices[MH_BOW];
		case 'Master hunter arrows':			
			return prices[MH_ARROWS];
		case 'Master hunter amulet':			
			return prices[MH_AMULET];
		case 'Master hunter ring of flight':			
			return prices[MH_RING_OF_FLIGHT];
		case 'Master hunter ring of dexterity':			
			return prices[MH_RING_OF_DEXTERITY];
		case 'Master hunter helmet':			
			return prices[MH_HELMET];
		case 'Master hunter bone helmet':			
			return prices[MH_BONE_HELMET];
		case 'Great hunter sword':			
			return prices[GH_SWORD];
		case 'Great hunter knuckleduster':			
			return prices[GH_KNUCKLEDUSTER];
		case 'Great hunter shield':			
			return prices[GH_SHIELD];
		case 'Great hunter boots':			
			return prices[GH_BOOTS];
		case 'Great hunter armor':			
			return prices[GH_ARMOR];
		case 'Great hunter maskrobe':			
			return prices[GH_MASKROBE];
		case 'Great hunter bow':			
			return prices[GH_BOW];
		case 'Great hunter arrows':			
			return prices[GH_ARROWS];
		case 'Great hunter amulet':			
			return prices[GH_AMULET];
		case 'Great hunter ring of dexterity':			
			return prices[GH_RING_OF_DEXTERITY];
		case 'Great hunter ring of charm':			
			return prices[GH_RING_OF_CHARM];
		case 'Great hunter helmet':			
			return prices[GH_HELMET];
		case 'Beastbane blade':			
			return prices[BB_BLADE];
		case 'Beastbane spear':			
			return prices[BB_SPEAR];
		case 'Beastbane shield':			
			return prices[BB_SHIELD];
		case 'Beastbane boots':			
			return prices[BB_BOOTS];
		case 'Beastbane armor':			
			return prices[BB_ARMOR];
		case 'Beastbane maskrobe':			
			return prices[BB_MASKROBE];
		case 'Beastbane bow':			
			return prices[BB_BOW];
		case 'Beastbane arrows':			
			return prices[BB_ARROWS];
		case 'Beastbane charm':			
			return prices[BB_CHARM];
		case 'Beastbane signet':			
			return prices[BB_SIGNET];
		case 'Beastbane band':			
			return prices[BB_BAND];
		case 'Beastbane helmet':			
			return prices[BB_HELMET];
			
		case 'Thief dagger':			
			return prices[THIEF_DAGGER];
		case 'Thief boots':			
			return prices[THIEF_BOOTS];
		case 'Thief armor':			
			return prices[THIEF_ARMOR];
		case 'Thief cloak':			
			return prices[THIEF_CLOAK];
		case 'Thief crossbow':			
			return prices[THIEF_CROSSBOW];
		case 'Thief amulet':			
			return prices[THIEF_AMULET];
		case 'Thief ring':			
			return prices[THIEF_RING];
		case 'Thief mask':			
			return prices[THIEF_MASK];
		default:
			return 0;
	}
}






