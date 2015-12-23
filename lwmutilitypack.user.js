// ==UserScript==
// @name			LWMUtilityPack
// @author			Theatre Of Pain (http://www.lordswm.com/pl_info.php?id=4821925)
// @version			1.1.130511
// @icon			http://dcdn.lordswm.com/hwmicon.ico
// @description		This script is a set of utilities that provides statistics for character profiles, costs of shop artifacts, and calculates the break even price for shop artifacts available for sale on the market
// @include			http://www.lordswm.com/pl_info.php*
// @include			http://www.lordswm.com/inventory.php*
// @include			http://www.lordswm.com/pl_transfers.php*
// @include			http://www.lordswm.com/auction.php*
// @grant       	GM_getValue
// @grant       	GM_setValue
// @grant       	GM_log
// ==/UserScript==

var debug = false;				//turn to true to display debug messages in the error console on Firefox only
var profileStatistics = true;	//turn to false to disable profile statistics
var artsCostPerBattle = true;	//turn to false to disable arts cost per AP and per battle
var breakEvenPrice = true;		//turn to false to disable brean even price

/*******************************
 **	profile constants
 *******************************/
// resources
const RESOURCES = 7;	// number of resources
const GOLD = 0;
const WOOD = 1;
const ORE = 2;
const MERCURY = 3;
const SULFUR = 4;
const CRYSTALS = 5;
const GEMS = 6;

// elements and others
const ELEMENTS = 19;	// number of elements
const STEEL = 0;
const LEATHER = 1;
const NICKEL = 2;
const MAGIC_POWDER = 3;
const MITHRIL_ORE = 4;
const OBSIDIAN = 5;
const MITHRIL = 6;
const ORICHALCUM = 7;

const ABRASIVE = 8;
const FERN_FLOWER = 9;
const FIRE_CRYSTAL = 10;
const ICE_CRYSTAL = 11;
const METEORITE_SHARD = 12;
const MOONSTONE = 13;
const TIGER_CLAW = 14;
const TOADSTOOL = 15;
const VIPER_VENOM = 16;
const WINDFLOWER = 17;
const WITCH_BLOOM = 18;

// factions
const FACTIONS = 9;
const KNIGHT = 0;
const NECROMANCER = 1;
const WIZARD = 2;
const ELF = 3;
const BARBARIAN = 4;
const DARK_ELF = 5;
const DEMON = 6;
const DWARF = 7;
const TRIBAL = 8;

// other stats
const OTHER_STATS = 8;
const ROULETTE_BETS = 0;
const ROULETTE_WINS = 1;
const COMBATS_FOUGHT = 2;
const COMBATS_WON = 3;
const COMBATS_LOST = 4
const GAMES_PLAYED = 5;
const GAMES_WON = 6;
const GAMES_LOST = 7;

/*******************************
 **	art constants
 *******************************/

// item types
const HEAD = 0;
const NECKLACE = 1;
const ARMOR = 2;
const BACK = 3;
const RIGHTHAND = 4;
const LEFTHAND = 5;
const FOOT = 6;
const RING = 7;

// items per item type
const HEAD_ITEMS = 20;
const LEATHER_HAT = 0;
const LEATHER_HELMET = 1;
const WIZARD_CAP = 2;
const HAT_OF_KNOWLEDGE = 3;
const CHAIN_HELMET = 4;
const STEEL_HELMET = 5;
const WIZARD_HELMET = 6;
const HELMET_OF_COURAGE = 7;
const LIGHT_MITHRIL_COIF = 8;
const HEAVY_MITHRIL_COIF = 9;
const RUBY_HELMET = 10;
const WARLOCK_CROWN = 11;
const OBSIDIAN_HELMET = 12;
const FLAME_HELMET = 13;
const FIREBENDER_CROWN = 14;

const HELMET_OF_GRACE = 15;
const HELMET_OF_DAWN =16;
const HELMET_OF_TWILIGHT = 17;
const MAIDEN_GARLAND = 18;

const FASHIONABLE_BONNET = 19;

const NECKLACE_ITEMS = 20;
const MEDAL_OF_BRAVERY = 0;
const AMULET_OF_LUCK = 1;
const PENDANT_OF_DESPAIR = 2;
const LUCKY_HORSESHOE =3;
const WARRIOR_PENDANT = 4;
const LOCKET_OF_CRYSTALLIZED_TEARS = 5;
const MYSTICAL_AMULET = 6;
const PENDANT_OF_WRATH = 7;
const SHARD_OF_DARKNESS = 8;
const AMULET_OF_FORTUNE = 9;
const TRIFORCE_CHARM = 10;
const CHARM_OF_CAPTURED_SOULS = 11;
const TALISMAN_OF_WARDANCE = 12;

const DRAGONGRIN_CHARM = 13;
const AMULET_OF_UNITY = 14;
const NECKLACE_OF_ULTIMATE_TRUTH = 15;
const AMULET_OF_ZEAL = 16;
const HALF_HEART_M = 17;

const HALF_HEART_W = 18;

const DIAMOND_PENDANT = 19;

const ARMOR_ITEMS = 18;
const LEATHER_ARMOR = 0;
const LEATHER_HARNESS = 1;
const HAUBERK = 2;
const STEEL_CUIRASS = 3;
const WIZARD_ATTIRE = 4;
const LIGHT_MITHRIL_CUIRASS = 5;
const MITHRIL_MAIL_ARMOUR = 6;
const PLATEMAIL = 7;
const SORCERER_ROBE = 8;
const FULLMITHRIL_ARMOR = 9;
const OBSIDIAN_ARMOR = 10;
const FIREBENDER_ROBE = 11;
const FLAME_PLATE = 12;
const BREASTPLATE_OF_GRACE = 13;
const ARMOUR_OF_TWILIGHT = 14;
const CUIRASS_OF_DAWN = 15;

const PROTECTORS_CUIRASS = 16;

const ARMOR_OF_ELEGANCE = 17;

const BACK_ITEMS = 16;
const SHORTBOW = 0;
const LONGBOW = 1;
const COMPOSITE_BOW = 2;
const BOW_OF_MIDNIGHT_STILL = 3;
const SCOUTS_CAPE = 4;
const CAPE_OF_SPIRITS = 5;
const CAPE_OF_WINDS = 6;
const MASKROBE =7;
const CAPE_OF_MAGICAL_POWER = 8;
const CAPE_OF_ARCANE_PROTECTION = 9;
const SORCERER_CAPE = 10;
const FIREBENDER_MANTLE = 11;

const DRAGONWING_CLOAK = 12;
const MANTLE_OF_ETERINITY = 13;
const TWILIGHT_PIERCER = 14;
const BUTTERFLY_WINGS = 15;

const RIGHTHAND_ITEMS = 32;
const WOODEN_SWORD = 0;
const LIGHT_AXE = 1;
const STEEL_BLADE = 2;
const REPRISAL_SWORD = 3;
const SWORD_OF_RETRIBUTION = 4;
const COMBAT_STAFF = 5;
const EQUILIBRIUM_BLADE = 6;
const SWORD_OF_MIGHT = 7;
const STAFF_OF_POWER = 8;
const STAFF_OF_YOUTH = 9;
const SWORD_OF_STIFFNESS = 10;
const MITHRIL_STAFF = 11;
const MITHRIL_LONGSWORD = 12;
const STAFF_OF_SHADOWS = 13;
const SWORD_OF_COURAGE = 14;
const RUBY_QUARTERSTAFF = 15;
const RUBY_GLADIUS = 16;
const OBSIDIAN_BATON = 17;
const OBSIDIAN_SWORD = 18;
const FIREBENDER_STAFF = 19;
const BLADE_OF_REBIRTH = 20;

const STAFF_OF_OBLIVION = 21;
const SWORD_OF_HARMONY = 22;
const STAFF_OF_ECLIPSE = 23;
const GLAIUS_OF_PRESAGE = 24;
const HAPPINESS_BOUQUET = 25;

const AROMA_OF_SPRING = 26;

const AROMA_OF_PASSION = 27;

const MAGNIFICENT_BOUQUET = 28;

const SILVER_PARTISAN = 29;

const CHARMING_BOUQUET = 30;

const DEFENDER_RAPIER = 31;

const LEFTHAND_ITEMS = 19;
const DAGGER_OF_VENGEANCE = 0;
const SCROLL_OF_ENERGY = 1;
const ROUND_SHIELD = 2;
const STEEL_BUCKLER = 3;
const DEFENDER_SHIELD = 4;
const SHIELD_OF_GLORY = 5;
const DRAGON_SHIELD = 6;
const TOWER_SHIELD = 7;
const HAWK_LORD_BULWARK = 8;
const OBSIDIAN_SHIELD = 9;
const DRAGON_SCALE_SHIELD = 10;
const FLAME_SHIELD = 11;
const AEGIS_OF_SUPPRESSION = 12;
const MANUSCRIPT_OF_FOCUS = 13;
const SHIELD_OF_DAWN = 14;
const DELIGHT_BOUQUET = 15;

const DEFENDER_DAGGER = 16;

const HEART_OF_FLOWERS = 17;

const DARLING_BOUQUET = 18;

const FOOT_ITEMS = 17;
const LEATHER_JACKBOOTS = 0;
const LEATHER_BOOTS = 1;
const GALOSHES_OF_BATTLE = 2;
const SHOES_OF_ASPIRATION = 3;
const STEEL_BOOTS = 4;
const LIGHT_MITHRIL_BOOTS = 5;
const SOLDIER_BOOTS = 6;
const HEAVY_MITHRIL_BOOTS = 7;
const RUBY_BOOTS = 8;
const SORCERER_SANDALS = 9;
const OBSIDIAN_BOOTS = 10;
const WARLOCK_JACKBOOTS = 11;
const FLAME_BOOTS = 12;

const BOOTS_OF_GRACE = 13;
const BOOTS_OF_DAWN = 14;
const JACKBOOTS_OF_TWILIGHT = 15;
const TEMPTRESS_BOOTS = 16;

const RING_ITEMS = 22;
const RING_OF_DEXTERITY = 0;
const RING_OF_AMBITION = 1;
const RING_OF_INSPIRATION = 2;
const RING_OF_DOUBTS = 3;
const RING_OF_IMPETUOSITY = 4;
const RING_OF_ABDICATION = 5;
const PROPHET_RING = 6;
const RING_OF_THUNDER = 7;
const RING_OF_THORNS = 8;
const PENUMBRAL_RING = 9;
const SIGNET_RING_OF_MIGHT = 10;
const SORCERER_SIGNET = 11;
const DRAGONS_EYE = 12;
const RING_OF_CONTRADICTIONS = 13;
const STELLAR_RING = 14;
const RING_OF_TORMENT = 15;

const SIGNET_RING_OF_UNITY = 16;
const DRAGONGRIP_RING = 17;
const RING_OF_INTEREPIDITY = 18;
const BAND_OF_INCESSANCY = 19;
const DIAMOND_RING = 20;

const RING_OF_LEADERSHIP = 21;

const ARTS_SUB_ARRAY = 8;
const ART_NAME = 0;
const BUY_PRICE = 1;
const DURABILITY = 2;
const AP = 3;
const COST_PER_BATTLE = 4;
const COST_PER_AP = 5;
const IMAGE_NAME = 6;
const LARGE_IMAGE_NAME = 7;

const GET_COST_PER_BATTLE = 1;
const GET_AP_PER_BATTLE = 2;

const SEP = '#';

const script_name = 'LWMUtilityPack';
const resources_key = script_name + 'Resources';
const elements_key = script_name + 'Elements';
const arts_key = script_name + 'ArtsFor';

/*******************************
 **	profile varsiables
 *******************************/

// stats posted on the profile
var resource_total = 0;
var element_total = 0;
var grand_total = 0;
var exp_total = 0;
var fsp_total = 0;
var arts_total = 0;
var exp_fsp_ratio = 0;
var roulette_ratio = 0;
var combat_ratio = 0;
var games_ratio = 0;
var registeration_date;

var all_td;	// array of all td elements in the document
var resource_td, skill_td;

var end_str, search_str, modified_str;	// string vars used in search
var end_pos;	// positions of search strings
var document_sections;		// to split the HTML document into multiple sections to isolate the searches only within the big profile table
var document_section;		// the document section that will be modified
var resources = new Array(RESOURCES);	// to store how many resources the player has of each type
var resource_tags = new Array(RESOURCES);	// the tags which the script will be searching for to extract resource quantities
	resource_tags[GOLD] = "gold.gif";
	resource_tags[WOOD] = "wood.gif";
	resource_tags[ORE] = "ore.gif";
	resource_tags[MERCURY] = "mercury.gif";
	resource_tags[SULFUR] = "sulfur.gif";
	resource_tags[CRYSTALS] = "crystal.gif";
	resource_tags[GEMS] = "gem.gif";
var resource_positions = new Array(RESOURCES);	// the position of each resource quantity
var resource_prices = new Array(RESOURCES);	// default prices for each of the resources
	resource_prices[GOLD] = 0;		// to prevent gold cash from being calculated in resource total
	  
var elements = new Array(ELEMENTS);	// to store how many elements the player has of each type
var element_tags = new Array(ELEMENTS);	// the tags which the script will be searching for to extract element quantities
	element_tags[STEEL] = "<b>Steel</b>: ";
	element_tags[LEATHER] = "<b>Leather</b>: ";
	element_tags[NICKEL] = "<b>Nickel</b>: ";
	element_tags[MAGIC_POWDER] = "<b>Magic powder</b>: ";
	element_tags[MITHRIL_ORE] = "<b>Mithril ore</b>: ";
	element_tags[OBSIDIAN] = "<b>Obsidian</b>: ";
	element_tags[MITHRIL] = "<b>Mithril</b>: ";
	element_tags[ORICHALCUM] = "<b>Orichalcum</b>: ";

	element_tags[ABRASIVE] = "<b>Abrasive</b>: ";
	element_tags[FERN_FLOWER] = "<b>Fern flower</b>: ";
	element_tags[FIRE_CRYSTAL] = "<b>Fire crystal</b>: ";
	element_tags[ICE_CRYSTAL] = "<b>Ice crystal</b>: ";
	element_tags[METEORITE_SHARD] = "<b>Meteorite shard</b>: ";
	element_tags[MOONSTONE] = "<b>Moonstone</b>: ";
	element_tags[TIGER_CLAW] = "<b>Tiger\`s claw</b>: ";
	element_tags[TOADSTOOL] = "<b>Toadstool</b>: ";
	element_tags[VIPER_VENOM] = "<b>Viper venom</b>: ";
	element_tags[WINDFLOWER] = "<b>Windflower</b>: ";
	element_tags[WITCH_BLOOM] = "<b>Witch bloom</b>: ";
var element_positions = new Array(ELEMENTS);	// the position of each element quantity
var element_prices = new Array(ELEMENTS);		// default prices for each of the resources **can be modified to reflect updated market prices**

var factions = new Array(FACTIONS);	// to store factions skill points
var faction_tags = new Array(ELEMENTS);	// the tags which the script will be searching for to extract element quantities
	faction_tags[KNIGHT] = "&nbsp;&nbsp;Knight:";
	faction_tags[NECROMANCER] = "&nbsp;&nbsp;Necromancer:";
	faction_tags[WIZARD] = "&nbsp;&nbsp;Wizard:";
	faction_tags[ELF] = "&nbsp;&nbsp;Elf:";
	faction_tags[BARBARIAN] = "&nbsp;&nbsp;Barbarian:";
	faction_tags[DARK_ELF] = "&nbsp;&nbsp;Dark elf:";
	faction_tags[DEMON] = "&nbsp;&nbsp;Demon:";
	faction_tags[DWARF] = "&nbsp;&nbsp;Dwarf:";
	faction_tags[TRIBAL] = "&nbsp;&nbsp;Tribal:";
var faction_positions = new Array(FACTIONS);	// the position of each faction skill
var main_faction;	//player's main faction
var others = new Array(OTHER_STATS);	// to store roulette, combats, and games stats
var other_tags = new Array(OTHER_STATS);	// the tags which the script will be searching for to extract other stats
	other_tags[ROULETTE_BETS] = "<td class=\"wb\" valign=\"top\" width=\"50%\">&nbsp;&nbsp;Roulette bets total: <b>";
	other_tags[ROULETTE_WINS] = "<br>&nbsp;&nbsp;Roulette winnings total: <b>";
	other_tags[COMBATS_FOUGHT] = "<td width=\"40%\">&nbsp;&nbsp;Combats fought: <b>";
	other_tags[COMBATS_WON] = "<td width=\"40%\">&nbsp;&nbsp;Victories: <b>";
	other_tags[COMBATS_LOST] = "<td width=\"40%\">&nbsp;&nbsp;Defeats: <b>";
	other_tags[GAMES_PLAYED] = "<td colspan=\"3\">&nbsp;&nbsp;Games played: <b>";
	other_tags[GAMES_WON] = "<td width=\"30%\">&nbsp;&nbsp;Victories: <b>";
	other_tags[GAMES_LOST] = "<td width=\"30%\">&nbsp;&nbsp;Defeats: <b>";
var other_positions = new Array(OTHER_STATS);	// the position of each stat	 

/*******************************
 **	art variables
 *******************************/

var Head = new Array(HEAD_ITEMS);
var Necklace = new Array(NECKLACE_ITEMS);
var Armor = new Array(ARMOR_ITEMS);
var RightHand = new Array(RIGHTHAND_ITEMS);
var LeftHand = new Array(LEFTHAND_ITEMS);
var Back = new Array(BACK_ITEMS);
var Foot = new Array(FOOT_ITEMS);
var Ring = new Array(RING_ITEMS);
var allArts = new Array();
var first_pass = false;
var cost_per_battle = 0;		// will sum up all costs per battle for arts
var ap_per_battle = 0;			// will sum up all ap for arts
var cost_per_ap = 0;			// will be cost_per_battle / ap_per_battle
var art_type;
var arts = new Array();
var all_tds;
var	td;
var player_name;
var profile_name;

//break even vars
var td;
var tr, all_trs;
var market_price, break_even_price;
var lot_number;
var item_name;
var item_count;
var item_seller_name;
var item_seller_id;
var item_type;
var market_art_durability;
var market_max_durability;
var max_durability = new Array();
var prices = new Array();
var buy_list = new Array();

/*******************************
 **	main
 *******************************/

initHead();
initNecklace();
initArmor();
initBack();
initRightHand();
initLeftHand();
initFoot();
initRing();
initAllArts();
getPlayerName();
if ((location.href.indexOf('pl_info.php') != -1) && profileStatistics) {
	profileStats();			// the current page is player profile
	profileArts();			// the current page is player profile
	profileLegend();		// the current page is player profile
} else if ((location.href.indexOf('inventory.php') != -1) && artsCostPerBattle) {
	inventoryArts();		// the current page is inventory
	inventoryLegend();		// the current page is inventory
} else if ((location.href.indexOf('pl_transfers.php') != -1) && profileStatistics) {
	getRegistrationDate();	// player transfer page
} else if ((location.href.indexOf('auction.php') != -1) && breakEvenPrice) {
	breakEven();	
}



function supportsHTML5Storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		if (debug) GM_log('HTML5 Storage is not supported');
		return false;
	}
}

function getPlayerName() {
	var all_params = document.getElementsByTagName('param');
	for (var i = 0; i < all_params.length; i++) {
		if (all_params[i].name == 'FlashVars') {
			player_name = all_params[i].value.split('|')[3];
			break;
		}
	}
	if (debug) {GM_log('Player name: ' + player_name)}
}

function profileArts() {
	all_tds = document.getElementsByTagName('td');

	for (var i = 0; i < all_tds.length; i++) {
		if ((all_tds[i].innerHTML.indexOf('slot1') != -1) 
			&& (all_tds[i].innerHTML.indexOf('slot5') != -1)
			&& (all_tds[i].innerHTML.indexOf('slot9') != -1)) {
				if (!first_pass) {
					first_pass = true;
					continue
				}
				td = all_tds[i];
		}
	}

	var all_divs = td.getElementsByTagName('div');
	cost_per_ap = 0;
	ap_per_battle = 0;
	cost_per_battle = 0;
	for (var i = 0; i < all_divs.length; i++) {
		switch (all_divs[i].id) {
			case 'slot1':		// head
				art_type = HEAD;
				break;
			case 'slot2':		// necklace
				art_type = NECKLACE;
				break;
			case 'slot3':		// armor
				art_type = ARMOR;
				break;
			case 'slot4':		// back
				art_type = BACK;
				break;
			case 'slot5':		// right hand
				art_type = RIGHTHAND;
				break;
			case 'slot6':		// left hand
				art_type = LEFTHAND;
				break;
			case 'slot7':		// foot
				art_type = FOOT;
				break;
			case 'slot8':		// top ring
				art_type = RING;
				break;
			case 'slot9':		// bottom ring
				art_type = RING;
				break;
			default:
				continue;
		}

		cost_per_battle += getArtValue(art_type, all_divs[i].innerHTML, GET_COST_PER_BATTLE);
		ap_per_battle += getArtValue(art_type, all_divs[i].innerHTML, GET_AP_PER_BATTLE);
	}
	el = document.createElement('p');
	el.style.textAlign = 'right';
	el.id = 'ArtCost';
	el.innerHTML = 'Cost per battle: <b>' + ((cost_per_battle != 0) ? (roundNumber(cost_per_battle, 2)) :0) 
		+ '</b>&nbsp;&nbsp;<br>Cost per AP: <b>' + ((cost_per_battle != 0) ? (roundNumber(cost_per_battle / ap_per_battle, 2)) :0)
		+ '</b>&nbsp;&nbsp;<br>Current AP: <b>' + ap_per_battle + '</b>&nbsp;&nbsp;<br><br>'
		+ 'Click <a href=\"#\" onClick=\"var e=document.getElementById(\'Legend\');if(e.style.display == \'block\') {e.style.display = \'none\';} else {e.style.display = \'block\';};return false;\">here</a> to display legend&nbsp;&nbsp;';
	td.appendChild(el);
}

function inventoryArts(){
	var passes = 3;
	var all_tables = document.getElementsByTagName('table');
	var art_name;
	var matched;
	
	var main_table;
	for (var i = 0; i < all_tables.length; i++) {
		if ((all_tables[i].innerHTML.indexOf('Items') != -1) && (all_tables[i].innerHTML.indexOf('Jewelry') != -1) && (all_tables[i].innerHTML.indexOf('Transactions:') != -1)) {
			main_table = all_tables[i];
		}
	}
	
	main_table.width = 1150;
	
	var tabs = new Array(10);
	for (var k = 1; k < tabs.length; k++) {
		tabs[k] = document.getElementById('tbc' + k);
		tabs[k].innerHTML = tabs[k].innerHTML.substring(0, tabs[k].innerHTML.indexOf('return (false)')) + 'window.location.reload();' + tabs[k].innerHTML.substring(tabs[k].innerHTML.indexOf('return (false)'));
	}
	arts = new Array();
	for (var i = 0; i < all_tables.length; i++) {
		if ((all_tables[i].innerHTML.indexOf('art_transfer.php') != -1) && (all_tables[i].innerHTML.indexOf('Durability') != -1)){
			if (passes != 0) {
				passes--; 
				continue;
			}
			matched = all_tables[i].innerHTML.match(/(\w*)\.jpg/);
			if (matched == null) {
				art_name = null;
			} else {
				if (RegExp.$1.substr(0,3) == 'gm_') {
					art_name = 'gm/' + RegExp.$1;
				} else if (RegExp.$1.substr(0,3) == 'sh_') {
					art_name = 'sh/' + RegExp.$1;
				} else {
					art_name = RegExp.$1;
				}
			}
			
			var found_art = false;
			cost_per_battle = 0;
			ap_per_battle = 0;
			cost_per_ap = 0;
			for (var j = 0; j < Head.length; j++) {
				if (Head[j][IMAGE_NAME] == art_name) {
					found_art = true;
					cost_per_battle = Head[j][COST_PER_BATTLE];
					ap_per_battle = Head[j][AP];
				}
			}

			if (!found_art) {
				for (var j = 0; j < Necklace.length; j++) {
					if (Necklace[j][IMAGE_NAME] == art_name) {
						found_art = true;
						cost_per_battle = Necklace[j][COST_PER_BATTLE];
						ap_per_battle = Necklace[j][AP];
					}
				}
			}
			
			if (!found_art) {
				for (var j = 0; j < Armor.length; j++) {
					if (Armor[j][IMAGE_NAME] == art_name) {
						found_art = true;
						cost_per_battle = Armor[j][COST_PER_BATTLE];
						ap_per_battle = Armor[j][AP];
					}
				}
			}
			
			if (!found_art) {
				for (var j = 0; j < Back.length; j++) {
					if (Back[j][IMAGE_NAME] == art_name) {
						found_art = true;
						cost_per_battle = Back[j][COST_PER_BATTLE];
						ap_per_battle = Back[j][AP];
					}
				}
			}
			
			if (!found_art) {
				for (var j = 0; j < RightHand.length; j++) {
					if (RightHand[j][IMAGE_NAME] == art_name) {
						found_art = true;
						cost_per_battle = RightHand[j][COST_PER_BATTLE];
						ap_per_battle = RightHand[j][AP];
					}
				}
			}
			
			if (!found_art) {
				for (var j = 0; j < LeftHand.length; j++) {
					if (LeftHand[j][IMAGE_NAME] == art_name) {
						found_art = true;
						cost_per_battle = LeftHand[j][COST_PER_BATTLE];
						ap_per_battle = LeftHand[j][AP];
					}
				}
			}
			
			if (!found_art) {
				for (var j = 0; j < Foot.length; j++) {
					if (Foot[j][IMAGE_NAME] == art_name) {
						found_art = true;
						cost_per_battle = Foot[j][COST_PER_BATTLE];
						ap_per_battle = Foot[j][AP];
					}
				}
			}
			
			if (!found_art) {
				for (var j = 0; j < Ring.length; j++) {
					if (Ring[j][IMAGE_NAME] == art_name) {
						found_art = true;
						cost_per_battle = Ring[j][COST_PER_BATTLE];
						ap_per_battle = Ring[j][AP];
					}
				}
			} 

			var enchanted = true;
			var enchantment_lvl = 0;
			matched = all_tables[i].innerHTML.match(/\[(\w*)\]/); 
			if (matched != null) {
				enchanted = true;
				var enchantments = RegExp.$1;
				matched = enchantments.match(/I(\d*)/);
				if (matched != null) {(enchantment_lvl += parseInt(RegExp.$1))}
				matched = enchantments.match(/E(\d*)/);
				if (matched != null) {(enchantment_lvl += parseInt(RegExp.$1))}
				matched = enchantments.match(/A(\d*)/);
				if (matched != null) {(enchantment_lvl += parseInt(RegExp.$1))}
				matched = enchantments.match(/W(\d*)/);
				if (matched != null) {(enchantment_lvl += parseInt(RegExp.$1))}
				matched = enchantments.match(/F(\d*)/);
				if (matched != null) {(enchantment_lvl += parseInt(RegExp.$1))}
			}
			
			if (enchanted) {ap_per_battle = Math.floor(ap_per_battle * (1 + (enchantment_lvl/50)))}
			cost_per_ap = roundNumber(cost_per_battle / ap_per_battle, 2);

			var new_na_td = '<td width = "30%" align="right"><font style="font-size:9px;">Cost:<br>per battle:<a href="#" onClick="alert(\'Cost calculation is applicable only to non-enchanted shop artifacts.\'); return false;"><font style="font-size:9px;">N/A</font></a><br>per AP:<a href="#" onClick="alert(\'Cost calculation is applicable only to non-enchanted shop artifacts.\'); return false;"><font style="font-size:9px;">N/A</font></a><br></td>';
			var new_td = '<td width = "30%" align="right"><font style="font-size:9px;">Cost:<br>per battle:' + cost_per_battle + '<br>per AP:' + cost_per_ap + '</font></td>';
			
			var li_pos = all_tables[i].innerHTML.indexOf('<li>'); 
			var td_pos = all_tables[i].innerHTML.substring(0,li_pos).lastIndexOf('<td');
			var art_pos = all_tables[i].innerHTML.indexOf('art_info.php');
			var table_pos = all_tables[i].innerHTML.substring(0,art_pos).lastIndexOf('<table');
			var td_span_pos = all_tables[i].innerHTML.substring(0,table_pos).lastIndexOf('<td');
			var search_pos = all_tables[i].innerHTML.lastIndexOf('</li>'); 

			if (search_pos != -1) {
				if (cost_per_battle != 0) {
					all_tables[i].innerHTML = all_tables[i].innerHTML.substring(0, td_span_pos + 3) + ' colspan="2"' + all_tables[i].innerHTML.substring(td_span_pos + 3, td_pos + 3) + ' width="70%"' + all_tables[i].innerHTML.substring(td_pos + 3, search_pos + 10) + new_td + all_tables[i].innerHTML.substring(search_pos + 10);
				}
			}
		}
	}
	profileArts();
}

function initHead() {
	for (var i = 0; i < Head.length; i++) {
		Head[i] = new Array(ARTS_SUB_ARRAY);
	}
	// art_type[art_name] = {buying_price, durability, ap, cost_per_battle, cost_per_ap, small_image_name, large_image_name, editable_price}
	Head[LEATHER_HAT] 		= ['Leather hat', 		180,	12,	1,,,	'leatherhat_s',			'leatherhat'];
	Head[LEATHER_HELMET] 	= ['Leather helmet', 	640,	30,	1,,,	'leatherhelmet_s',		'leather_helm'];
	Head[WIZARD_CAP]		= ['Wizard cap',		1629,	35,	2,,,	'magehat_s',			'wizard_cap'];
	Head[HAT_OF_KNOWLEDGE]	= ['Hat of knowledge',	999,	25,	2,,,	'knowlengehat_s',		'knowledge_hat'];
	Head[CHAIN_HELMET]		= ['Chain helmet',		1571,	40,	2,,,	'chaincoif_s',			'chain_coif'];
	Head[STEEL_HELMET]		= ['Steel helmet',		3753,	70,	3,,,	'steel_helmet_s',		'steel_helmet'];
	Head[WIZARD_HELMET]		= ['Wizard helmet',		3346,	50,	4,,,	'mage_helm_s',			'mage_helm'];
	Head[HELMET_OF_COURAGE]	= ['Helmet of courage',	1260,	30, 3,,,	'shelm8_s',				'shelm8'];
	Head[LIGHT_MITHRIL_COIF]= ['Light mithril coif',5354,	70,	5,,,	'mif_lhelmet_s',		'mif_lhelmet'];
	Head[HEAVY_MITHRIL_COIF]= ['Heavy mithril coif',6431,	70,	5,,,	'mif_hhelmet_s',		'mif_hhelmet'];
	Head[RUBY_HELMET]		= ['Ruby helmet',		2800,	40, 5,,,	'shelm12_s',			'shelm12'];
	Head[WARLOCK_CROWN]		= ['Warlock crown',		6518,	70,	6,,,	'mhelmetzh13_s',		'mhelmetzh13'];
	Head[OBSIDIAN_HELMET]	= ['Obsidian helmet',	6518,	70,	6,,,	'zxhelmet13_s',			'zxhelmet13'];
	Head[FLAME_HELMET]		= ['Flame helmet',		6722,	70,	7,,,	'myhelmet15_s',			'myhelmet15'];
	Head[FIREBENDER_CROWN]	= ['Firebender crown',	6751,	70,	7,,,	'xymhelmet15_s',		'xymhelmet15'];
	
	Head[HELMET_OF_GRACE]	= ['Helmet of grace',	3870,	40,	7,,,	'umshelm16_s',			'shelm16'];
	Head[HELMET_OF_DAWN]	= ['Helmet of dawn',	7620,	70, 8,,,	'hwmhelmet17_s',		'helmet17'];
	Head[HELMET_OF_TWILIGHT]= ['Helmet of twilight',7620,	70,	8,,,	'miqmhelmet17_s',		'mhelmet17'];
	Head[MAIDEN_GARLAND]    = ['Maiden`s garland',	350,    10, 2,,,    'gifts/venok_s',        'venok'];
	
	Head[FASHIONABLE_BONNET]= ['Fashionable bonnet',17500,  50, 6,,,    'gifts/whelmet_s',      'whelmet'];

	for (var i = 0; i < Head.length; i++) {
		Head[i][COST_PER_BATTLE] = roundNumber(Head[i][BUY_PRICE] / Head[i][DURABILITY], 2);
		Head[i][COST_PER_AP] = roundNumber(Head[i][COST_PER_BATTLE] / Head[i][AP], 2);
	}
}

function initNecklace() {
	for (var i = 0; i < Necklace.length; i++) {
		Necklace[i] = new Array(ARTS_SUB_ARRAY);
	}
	// art_type[art_name] = {buying_price, durability, ap, cost_per_battle, cost_per_ap, small_image_name, large_image_name, editable_price}
	Necklace[MEDAL_OF_BRAVERY]				= ['Medal of bravery',			572,	25,	2,,,	'braverymedal_s',		'bravery_medal'];
	Necklace[AMULET_OF_LUCK]				= ['Amulet of luck',			979,	25,	2,,,	'lucknecklace_s',		'amulet_of_luck'];
	Necklace[PENDANT_OF_DESPAIR]			= ['Pendant of despair',		7536,	60,	7,,,	'power_pendant_s',		'power_pendant'];
	Necklace[LUCKY_HORSESHOE]				= ['Lucky horseshoe',			3570,	30, 7,,,	'samul81_s',			'samul8'];
	Necklace[WARRIOR_PENDANT]				= ['Warrior pendant',			8215,	50,	8,,,	'warrior_pendant_s',	'warrior_pendant'];
	Necklace[LOCKET_OF_CRYSTALLIZED_TEARS]	= ['Locket of crystallized tears',8555,	50,	7,,,	'magic_amulet_s',		'magic_amulet'];
	Necklace[MYSTICAL_AMULET]				= ['Mystical amulet',			10185,	60,	9,,,	'mmzamulet13_s',		'mmzamulet13'];
	Necklace[PENDANT_OF_WRATH]				= ['Pendant of wrath',			10185,	60,	9,,,	'wzzamulet13_s',		'wzzamulet13'];
	Necklace[SHARD_OF_DARKNESS]				= ['Shard of darkness',			4600,	30, 9,,,	'smamul14_s',			'smamul14'];
	Necklace[AMULET_OF_FORTUNE]				= ['Amulet of fortune',			4600,	30, 9,,,	'samul141_s',			'samul14'];
	Necklace[TRIFORCE_CHARM]				= ['Triforce charm',			11038,	65,	9,,,	'bafamulet15_s',		'bafamulet15'];
	Necklace[CHARM_OF_CAPTURED_SOULS]		= ['Charm of captured souls',	11203,	65,	10,,,	'mmzamulet16_s',		'mmzamulet16'];
	Necklace[TALISMAN_OF_WARDANCE]			= ['Talisman of wardance',		11203,	65,	10,,,	'wzzamulet16_s',		'wzzamulet16'];
	Necklace[DRAGONGRIN_CHARM]				= ['Dragongrin charm',			4620,	30,	10,,,	'warsamul17_s',			'samul17'];
	Necklace[AMULET_OF_UNITY]				= ['Amulet of unity',			4620,	30,	10,,,	'sekmamul17_s',			'smamul17'];
	Necklace[NECKLACE_OF_ULTIMATE_TRUTH]	= ['Necklace of ultimate truth',11620,	65,	11,,,	'megmamulet19_s',		'mamulet19'];
	Necklace[AMULET_OF_ZEAL]				= ['Amulet of zeal',			10900,	65,	11,,,	'nwamulet19_s',			'amulet19'];

	Necklace[HALF_HEART_M]                 	= ['The other half (M)',        5250,  25, 2,,,    'gifts/half_heart_m_s', 'half_heart_m'];
	Necklace[HALF_HEART_W]                	= ['The other half (F)',        5250,  25, 2,,,    'gifts/half_heart_w_s', 'half_heart_w'];

	Necklace[DIAMOND_PENDANT]               = ['Diamond pendant',           24500, 50, 6,,,    'gifts/bril_pendant_s', 'bril_pendant'];

	for (var i = 0; i < Necklace.length; i++) {
		Necklace[i][COST_PER_BATTLE] = roundNumber(Necklace[i][BUY_PRICE] / Necklace[i][DURABILITY], 2);
		Necklace[i][COST_PER_AP] = roundNumber(Necklace[i][COST_PER_BATTLE] / Necklace[i][AP], 2);
	}
}

function initArmor() {
	for (var i = 0; i < Armor.length; i++) {
		Armor[i] = new Array(ARTS_SUB_ARRAY);
	}
	// art_type[art_name] = {buying_price, durability, ap, cost_per_battle, cost_per_ap, small_image_name, large_image_name, editable_price}
	Armor[LEATHER_ARMOR]		= ['Leather armor',			280,	18,	1,,,	'leathershield_s',		'leather_shiled'];
	Armor[LEATHER_HARNESS]		= ['Leather harness',		1430,	30,	2,,,	'leatherplate_s',		'leatherplate'];
	Armor[HAUBERK]				= ['Hauberk',				2337,	40,	3,,,	'chainarmor_s',			'hauberk'];
	Armor[STEEL_CUIRASS]		= ['Steel cuirass',			4549,	70,	4,,,	'ciras_s',				'ciras'];
	Armor[WIZARD_ATTIRE]		= ['Wizard attire',			4559,	50,	5,,,	'mage_armor_s',			'mage_armor'];
	Armor[LIGHT_MITHRIL_CUIRASS]= ['Light mithril cuirass',	6382,	70,	5,,,	'mif_light_s',			'mif_light'];
	Armor[MITHRIL_MAIL_ARMOUR]	= ['Mithril mail armour',	2610,	40,	5,,,	'sarmor9_s',			'sarmor9'];
	Armor[PLATEMAIL]			= ['Platemail',				9438,	75,	6,,,	'full_plate_s',			'full_plate'];
	Armor[SORCERER_ROBE]		= ['Sorcerer robe',			9573,	70,	7,,,	'mage_robes_s',			'wiz_robe'];
	Armor[FULLMITHRIL_ARMOR]	= ['Fullmithril armor',		10049,	75,	7,,,	'miff_plate_s',			'miff_plate'];
	Armor[OBSIDIAN_ARMOR]		= ['Obsidian armor',		4550,	50,	7,,,	'sarmor13_s',			'sarmor13'];
	Armor[FIREBENDER_ROBE]		= ['Firebender robe',		9506,	70,	8,,,	'robewz15_s',			'robewz15'];
	Armor[FLAME_PLATE]			= ['Flame plate',			9506,	70,	8,,,	'armor15_s',			'armor15'];

	Armor[BREASTPLATE_OF_GRACE]	= ['Breastplate of grace',	4580,	44,	8,,,	'brsarmor16_s',			'sarmor16'];
	Armor[ARMOUR_OF_TWILIGHT]	= ['Armour of twilight',	9800,	70,	9,,,	'mammarmor17_s',		'marmor17'];
	Armor[CUIRASS_OF_DAWN]		= ['Cuirass of dawn',		9990,	70,	9,,,	'anwarmor17_s',			'armor17'];
	Armor[PROTECTORS_CUIRASS]   = ['Protector`s cuirass',	14000,  50, 4,,,    'gifts/goldciras_s',    'goldciras'];

	Armor[ARMOR_OF_ELEGANCE]    = ['Armor of elegance',		17500,  50, 6,,,    'gifts/warmor_s',       'warmor'];

	for (var i = 0; i < Armor.length; i++) {
		Armor[i][COST_PER_BATTLE] = roundNumber(Armor[i][BUY_PRICE] / Armor[i][DURABILITY], 2);
		Armor[i][COST_PER_AP] = roundNumber(Armor[i][COST_PER_BATTLE] / Armor[i][AP], 2);
	}
}

function initBack() {
	for (var i = 0; i < Back.length; i++) {
		Back[i] = new Array(ARTS_SUB_ARRAY);
	}
	// art_type[art_name] = {buying_price, durability, ap, cost_per_battle, cost_per_ap, small_image_name, large_image_name, editable_price}
	Back[SHORTBOW]					= ['Shortbow',					360,	20,	1,,,	'shortbow_s',			'shortbow'];
	Back[LONGBOW]					= ['Longbow',					6450,	50,	4,,,	'long_bow_s',			'long_bow'];
	Back[COMPOSITE_BOW]				= ['Composite bow',				8419,	55,	5,,,	'composite_bow_s',		'composite_bow'];
	Back[BOW_OF_MIDNIGHT_STILL]		= ['Bow of midnight still',		10155,	65,	6,,,	'bow14_s',				'bow14'];
	Back[SCOUTS_CAPE]				= ['Scouts cape',				320,	20,	1,,,	'cloack_s',				'scoutcloack'];
	Back[CAPE_OF_SPIRITS]			= ['Cape of spirits',			1222,	30,	2,,,	'soulcape_s',			'soul_cape'];
	Back[CAPE_OF_WINDS]				= ['Cape of winds',				2987,	60,	3,,,	'antiair_cape_s',		'antiair_cape'];
	Back[MASKROBE]					= ['Maskrobe',					2160,	30, 4,,,	'scloack8_s',			'scloack8'];
	Back[CAPE_OF_MAGICAL_POWER]		= ['Cape of magical power',		5451,	40,	4,,,	'powercape_s',			'powercape'];
	Back[CAPE_OF_ARCANE_PROTECTION]	= ['Cape of arcane protection',	5053,	50,	5,,,	'antimagic_cape_s',		'antimagic_cape'];
	Back[SORCERER_CAPE]				= ['Sorcerer cape',				8894,	60,	7,,,	'wiz_cape_s',			'wiz_cape'];
	Back[FIREBENDER_MANTLE]			= ['Firebender mantle',			9816,	65,	8,,,	'cloackwz15_s',			'cloackwz15'];

	Back[DRAGONWING_CLOAK]			= ['Dragonwing cloak',			3360,	30,	8,,,	'mascloack16_s',		'scloack16'];
	Back[MANTLE_OF_ETERINITY]		= ['Mantle of eterinity',		10500,	65,	9,,,	'clscloack17_s',		'cloack17'];
	Back[TWILIGHT_PIERCER]			= ['Twilight piercer',			10640,	65,	7,,,	'bbobow17_s',			'bow17'];
	Back[BUTTERFLY_WINGS]           = ['Butterfly wings',           52500,  50, 5,,,    'gifts/bfly_s',         'bfly'];

	for (var i = 0; i < Back.length; i++) {
		Back[i][COST_PER_BATTLE] = roundNumber(Back[i][BUY_PRICE] / Back[i][DURABILITY], 2);
		Back[i][COST_PER_AP] = roundNumber(Back[i][COST_PER_BATTLE] / Back[i][AP], 2);
	}
}

function initRightHand() {
	for (var i = 0; i < RightHand.length; i++) {
		RightHand[i] = new Array(ARTS_SUB_ARRAY);
	}
	// art_type[art_name] = {buying_price, durability, ap, cost_per_battle, cost_per_ap, small_image_name, large_image_name, editable_price}
	RightHand[WOODEN_SWORD]			= ['Wooden sword',			140,	7,	1,,,	'woodensword_s',		'wood_sword'];
	RightHand[LIGHT_AXE]			= ['Light axe',				300,	25,	2,,,	'onehandaxe_s',			'gnome_hammer'];
	RightHand[STEEL_BLADE]			= ['Steel blade',			475,	30,	2,,,	'steelsword_s',			'steel_blade'];
	RightHand[REPRISAL_SWORD]		= ['Reprisal sword',		1319,	40,	3,,,	'def_sword_s',			'def_sword'];
	RightHand[SWORD_OF_RETRIBUTION]	= ['Sword of retribution',	2580,	40,	5,,,	'requitalsword_s',		'requital_sword'];
	RightHand[COMBAT_STAFF]			= ['Combat staff',			2580,	40,	6,,,	'staff_s',				'staff'];
	RightHand[EQUILIBRIUM_BLADE]	= ['Equilibrium blade',		4820,	60,	6,,,	'broadsword_s',			'broad_sword'];
	RightHand[SWORD_OF_MIGHT]		= ['Sword of might',		9981,	80,	8,,,	'power_sword_s',		'power_sword'];
	RightHand[STAFF_OF_POWER]		= ['Staff of power',		6246,	50,	8,,,	'sor_staff_s',			'sor_staff'];
	RightHand[STAFF_OF_YOUTH]		= ['Staff of youth',		3040,	30, 8,,,	'mstaff8_s',			'mstaff8'];
	RightHand[SWORD_OF_STIFFNESS]	= ['Sword of stiffness',	4040,	40,	8,,,	'ssword8_s',			'ssword8'];
	RightHand[MITHRIL_STAFF]		= ['Mithril staff',			16732,	70,	9,,,	'mif_staff_s',			'mif_staff'];
	RightHand[MITHRIL_LONGSWORD]	= ['Mithril longsword',		17314,	70,	9,,,	'mif_sword_s',			'mif_sword'];
	RightHand[STAFF_OF_SHADOWS]		= ['Staff of shadows',		3980,	35, 9,,,	'mstaff10_s',			'mstaff10'];
	RightHand[SWORD_OF_COURAGE]		= ['Sword of courage',		5110,	45,	9,,,	'ssword10_s',			'ssword10'];
	RightHand[RUBY_QUARTERSTAFF]	= ['Ruby quarterstaff ',	17343,	70,	10,,,	'mm_staff_s',			'mm_staff'];
	RightHand[RUBY_GLADIUS]			= ['Ruby gladius',			17557,	70,	10,,,	'mm_sword_s',			'mm_sword'];
	RightHand[OBSIDIAN_BATON]		= ['Obsidian baton',		5050,	40, 10,,,	'mstaff13_s',			'mstaff13'];
	RightHand[OBSIDIAN_SWORD]		= ['Obsidian sword',		6300,	50,	10,,,	'ssword13_s',			'ssword13'];
	RightHand[FIREBENDER_STAFF]		= ['Firebender staff',		18051,	70,	11,,,	'ffstaff15_s',			'ffstaff15'];
	RightHand[BLADE_OF_REBIRTH]		= ['Blade of rebirth',		18042,	70,	11,,,	'firsword15_s',			'firsword15'];
	RightHand[STAFF_OF_OBLIVION]	= ['Staff of oblivion',		5140,	37,	11,,,	'ssmstaff16_s',			'smstaff16'];
	RightHand[SWORD_OF_HARMONY]		= ['Sword of harmony',		6370,	46,	11,,,	'szzsword16_s',			'ssword16'];
	RightHand[STAFF_OF_ECLIPSE]		= ['Staff of eclipse',		18680,	70,	12,,,	'smmstaff18_s',			'staff18'];
	RightHand[GLAIUS_OF_PRESAGE]	= ['Glaius of presage',		18690,	70,	12,,,	'smasword18_s',			'sword18'];
	RightHand[HAPPINESS_BOUQUET]    = ['`Female happiness` bouquet',350,10, 1,,,    'gifts/flowers2_s',     'flowers2'];

	RightHand[AROMA_OF_SPRING]      = ['`Aroma of spring` bouquet',3500,15, 4,,,    'gifts/flowers3_s',     'flowers3'];

	RightHand[AROMA_OF_PASSION]     = ['Aroma of passion',		3500,   15, 5,,,    'gifts/d_spray_s',      'd_spray'];

	RightHand[MAGNIFICENT_BOUQUET]  = ['`Magnificent` bouquet',	5250,   25, 5,,,    'gifts/buk1_s',         'flowers5'];

	RightHand[SILVER_PARTISAN]      = ['Silver partisan',		8750,  	40, 2,,,    'gifts/protazan_s',     'protazan'];

	RightHand[CHARMING_BOUQUET]     = ['Charming bouquet',		8750,  	40, 9,,,    'gifts/roses_s',        'roses'];

	RightHand[DEFENDER_RAPIER]      = ['Defender rapier',		28000,  60, 10,,,   'shpaga_s',             'shpaga'];

	for (var i = 0; i < RightHand.length; i++) {
		RightHand[i][COST_PER_BATTLE] = roundNumber(RightHand[i][BUY_PRICE] / RightHand[i][DURABILITY], 2);
		RightHand[i][COST_PER_AP] = roundNumber(RightHand[i][COST_PER_BATTLE] / RightHand[i][AP], 2);
	}
}

function initLeftHand() {
	for (var i = 0; i < LeftHand.length; i++) {
		LeftHand[i] = new Array(ARTS_SUB_ARRAY);
	}
	// art_type[art_name] = {buying_price, durability, ap, cost_per_battle, cost_per_ap, small_image_name, large_image_name, editable_price}
	LeftHand[DAGGER_OF_VENGEANCE]	= ['Dagger of vengeance',	931,	30,	1,,,	'dagger_s',				'dagger'];
	LeftHand[SCROLL_OF_ENERGY]		= ['Scroll of energy',		9234,	70,	6,,,	'energy_scroll_s',		'energy_scroll'];
	LeftHand[ROUND_SHIELD]			= ['Round shield',			110,	7,	1,,,	'roundshield_s',		'round_shiled'];
	LeftHand[STEEL_BUCKLER]			= ['Steel buckler',			280,	15,	2,,,	's_shield_s',			's_shield'];
	LeftHand[DEFENDER_SHIELD]		= ['Defender shield',		1154,	40,	3,,,	'protectshield_s',		'defender_shield'];
	LeftHand[SHIELD_OF_GLORY]		= ['Shield of glory',		3040,	40,	4,,,	'sshield5_s',			'sshield5'];
	LeftHand[DRAGON_SHIELD]			= ['Dragon shield',			8962,	70,	5,,,	'dragon_shield_s',		'dragon_shield'];
	LeftHand[TOWER_SHIELD]			= ['Tower shield',			9777,	70,	6,,,	'large_shield_s',		'large_shield'];
	LeftHand[HAWK_LORD_BULWARK]		= ['Hawk lord bulwark',		4080,	40,	6,,,	'sshield11_s',			'sshield11'];
	LeftHand[OBSIDIAN_SHIELD]		= ['Obsidian shield',		10388,	70,	7,,,	'shield13_s',			'shield13'];
	LeftHand[DRAGON_SCALE_SHIELD]	= ['Dragon scale shield',	4130,	38,	7,,,	'zpsshield14_s',		'sshield14'];
	LeftHand[FLAME_SHIELD]			= ['Flame shield',			10514,	70,	8,,,	'shield16_s',			'shield16'];

	LeftHand[AEGIS_OF_SUPPRESSION]	= ['Aegis of suppression',	4230,	35,	8,,,	'esshield17_s',			'sshield17'];
	LeftHand[MANUSCRIPT_OF_FOCUS]	= ['Manuscript of focus',	10850,	70,	9,,,	'shhscroll18_s',		'scroll18'];
	LeftHand[SHIELD_OF_DAWN]		= ['Shield of dawn',		11020,	70,	9,,,	'sioshield19_s',		'shield19'];
	LeftHand[DELIGHT_BOUQUET]       = ['`Delight` bouquet',		350,    10, 1,,,    'gifts/flowers1_s',     'flowers1'];

	LeftHand[DEFENDER_DAGGER]       = ['Defender dagger',		1400,   15, 2,,,    'gifts/defender_dagger_s','defender_dagger'];

	LeftHand[HEART_OF_FLOWERS]      = ['Heart of flowers',		1750,   20, 3,,,    'gifts/flower_heart_s', 'flower_heart'];

	LeftHand[DARLING_BOUQUET]       = ['`Darling` bouquet',		5250,   25, 5,,,    'gifts/buk2_s',         'flowers4'];

	for (var i = 0; i < LeftHand.length; i++) {
		LeftHand[i][COST_PER_BATTLE] = roundNumber(LeftHand[i][BUY_PRICE] / LeftHand[i][DURABILITY], 2);
		LeftHand[i][COST_PER_AP] = roundNumber(LeftHand[i][COST_PER_BATTLE] / LeftHand[i][AP], 2);
	}
}

function initFoot() {
	for (var i = 0; i < Foot.length; i++) {
		Foot[i] = new Array(ARTS_SUB_ARRAY);
	}
	// art_type[art_name] = {buying_price, durability, ap, cost_per_battle, cost_per_ap, small_image_name, large_image_name, editable_price}
	Foot[LEATHER_JACKBOOTS]		= ['Leather jackboots',		210,	14,	1,,,	'leatherboots_s',	'leatherboots'];
	Foot[LEATHER_BOOTS]			= ['Leather boots',			931,	30,	1,,,	'hunterboots_s',	'hunter_boots'];
	Foot[GALOSHES_OF_BATTLE]	= ['Galoshes of battle',	1080,	35,	2,,,	'boots2_s',			'boots2'];
	Foot[SHOES_OF_ASPIRATION]	= ['Shoes of aspiration',	2434,	40,	3,,,	'initboots_s',		'shoe_of_initiative'];
	Foot[STEEL_BOOTS]			= ['Steel boots',			5907,	70,	4,,,	'steel_boots_s',	'steel_boots'];
	Foot[LIGHT_MITHRIL_BOOTS]	= ['Light mithril boots',	7304,	55,	6,,,	'mif_lboots_s',		'mif_lboots'];
	Foot[SOLDIER_BOOTS]			= ['Soldier boots',			2250,	30,	5,,,	'sboots9_s',		'sboots9'];
	Foot[HEAVY_MITHRIL_BOOTS]	= ['Heavy mithril boots',	7915,	65,	6,,,	'mif_hboots_s',		'mif_hboots'];
	Foot[RUBY_BOOTS]			= ['Ruby boots',			3150,	35,	6,,,	'sboots12_s',		'sboots12'];
	Foot[SORCERER_SANDALS]		= ['Sorcerer sandals',		8177,	65,	6,,,	'wiz_boots_s',		'wiz_boots'];
	Foot[OBSIDIAN_BOOTS]		= ['Obsidian boots',		8681,	70,	7,,,	'boots13_s',		'boots13'];
	Foot[WARLOCK_JACKBOOTS]		= ['Warlock jackboots',		9011,	70,	8,,,	'mboots14_s',		'mboots14'];
	Foot[FLAME_BOOTS]			= ['Flame boots',			8739,	70,	8,,,	'boots15_s',		'boots15'];
	Foot[BOOTS_OF_GRACE]		= ['Boots of grace',		3410,	40,	8,,,	'nmsboots16_s',		'sboots16'];
	Foot[BOOTS_OF_DAWN]			= ['Boots of dawn',			9140,	70,	9,,,	'bzbboots17_s',		'boots17'];
	Foot[JACKBOOTS_OF_TWILIGHT]	= ['Jackboots of twilight',	9140,	70,	9,,,	'macmboots17_s',	'mboots17'];

	Foot[TEMPTRESS_BOOTS]       = ['Temptress boots',		17500,  50, 6,,,    'gifts/wboots_s',   'wboots'];

	for (var i = 0; i < Foot.length; i++) {
		Foot[i][COST_PER_BATTLE] = roundNumber(Foot[i][BUY_PRICE] / Foot[i][DURABILITY], 2);
		Foot[i][COST_PER_AP] = roundNumber(Foot[i][COST_PER_BATTLE] / Foot[i][AP], 2);
	}
}

function initRing() {
	for (var i = 0; i < Ring.length; i++) {
		Ring[i] = new Array(ARTS_SUB_ARRAY);
	}
	// art_type[art_name] = {buying_price, durability, ap, cost_per_battle, cost_per_ap, small_image_name, large_image_name, editable_price}
	Ring[RING_OF_DEXTERITY]		= ['Ring of dexterity',		180,	10,	1,,,	'i_ring_s',				'i_ring'];
	Ring[RING_OF_AMBITION]		= ['Ring of ambition',		610,	15,	2,,,	'sring4_s',				'sring4'];
	Ring[RING_OF_INSPIRATION]	= ['Ring of inspiration',	1610,	18,	2,,,	'eaglering_s',			'verve_ring'];
	Ring[RING_OF_DOUBTS]		= ['Ring of doubts',		1086,	12,	2,,,	'necroring_s',			'doubt_ring'];
	Ring[RING_OF_IMPETUOSITY]	= ['Ring of impetuosity',	1969,	30,	2,,,	'hastering_s',			'rashness_ring'];
	Ring[RING_OF_ABDICATION]	= ['Ring of abdication',	6644,	50,	4,,,	'circ_ring_s',			'circ_ring'];
	Ring[PROPHET_RING]			= ['Prophet ring',			5296,	40,	4,,,	'powerring_s',			'powerring'];
	Ring[RING_OF_THUNDER]		= ['Ring of thunder',		3010,	30,	5,,,	'smring10_s',			'smring10'];
	Ring[RING_OF_THORNS]		= ['Ring of thorns',		3010,	30,	5,,,	'sring10_s',			'sring10'];
	Ring[PENUMBRAL_RING]		= ['Penumbral ring',		8555,	50,	5,,,	'darkring_s',			'darkring'];
	Ring[SIGNET_RING_OF_MIGHT]	= ['Signet-ring of might',	6838,	40,	5,,,	'warriorring_s',		'warriorring'];
	Ring[SORCERER_SIGNET]		= ['Sorcerer signet',		10495,	60,	6,,,	'magring13_s',			'magring13'];
	Ring[DRAGONS_EYE]			= ['Dragon`s eye',			10495,	60,	6,,,	'warring13_s',			'warring13']; 
	Ring[RING_OF_CONTRADICTIONS]= ['Ring of contradictions',10592,	60,	6,,,	'bring14_s',			'bring14'];
	Ring[STELLAR_RING]			= ['Stellar ring',			11475,	65,	6,,,	'mmmring16_s',			'mmmring16'];
	Ring[RING_OF_TORMENT]		= ['Ring of torment',		11475,	65,	6,,,	'wwwring16_s',			'wwwring16'];

	Ring[SIGNET_RING_OF_UNITY]	= ['Signet ring of unity',	3060,	30,	6,,,	'masmring17_s',			'smring17'];
	Ring[DRAGONGRIP_RING]		= ['Dragongrip ring',		3060,	30,	6,,,	'fgsring17_s',			'sring17'];
	Ring[RING_OF_INTEREPIDITY]	= ['Ring of interepidity',	11900,	65,	7,,,	'rarring19_s',			'ring19'];
	Ring[BAND_OF_INCESSANCY]	= ['Band of incessancy',	11990,	65,	7,,,	'meqmring19_s',			'mring19'];
	Ring[DIAMOND_RING]          = ['Diamond ring',          35000,  40, 5,,,    'gifts/bril_ring_s',	'bril_ring'];

	Ring[RING_OF_LEADERSHIP]    = ['Ring of leadership',    24500,  40, 6,,,    'koltsou_s',			'koltsou'];

	for (var i = 0; i < Ring.length; i++) {
		Ring[i][COST_PER_BATTLE] = roundNumber(Ring[i][BUY_PRICE] / Ring[i][DURABILITY], 2);
		Ring[i][COST_PER_AP] = roundNumber(Ring[i][COST_PER_BATTLE] / Ring[i][AP], 2);
	}
}

function initAllArts(){
	allArts = Head.concat(Necklace, Armor, RightHand, LeftHand, Back, Foot, Ring);
	allArts.push(['Mana tube',543,476,1,,,,'smallmana_s','mana_tube']);
}

function getArtValue(temp_art_type, search_str, value_to_return) {
	var temp_cost_per_battle = 0;
	var temp_ap = 0;
	var temp_art_name = '';
	var temp_array = new Array();
	var matched;
	var enchanted = false;
	var enchantment_lvl = 0;

	switch(temp_art_type) {
		case HEAD:			// head
			temp_array = Head;
			break;
		case NECKLACE:		// necklace
			temp_array = Necklace;
			break;
		case ARMOR:			// armor
			temp_array = Armor;
			break;
		case BACK:			// back
			temp_array = Back;
			break;
		case RIGHTHAND:		// right hand
			temp_array = RightHand;
			break;
		case LEFTHAND:		// left hand
			temp_array = LeftHand;
			break;
		case FOOT:			// foot
			temp_array = Foot;
			break;
		case RING:			// top ring
			temp_array = Ring;
	}
	matched = search_str.match(/(\w*)\.jpg/);
	if (matched == null) {return 0}
	if (RegExp.$1.substr(0,3) == 'gm_') {
		temp_art_name = 'gm/' + RegExp.$1;
	} else if (RegExp.$1.substr(0,3) == 'sh_') {
		temp_art_name = 'sh/' + RegExp.$1;
	} else {
		temp_art_name = RegExp.$1;
	}
	matched = search_str.match(/\[(\w*)\]/); 
	if (matched != null) {
		enchanted = true;
		var enchantments = RegExp.$1;
		matched = enchantments.match(/I(\d*)/);
		if (matched != null) {(enchantment_lvl += parseInt(RegExp.$1))}
		matched = enchantments.match(/E(\d*)/);
		if (matched != null) {(enchantment_lvl += parseInt(RegExp.$1))}
		matched = enchantments.match(/A(\d*)/);
		if (matched != null) {(enchantment_lvl += parseInt(RegExp.$1))}
		matched = enchantments.match(/W(\d*)/);
		if (matched != null) {(enchantment_lvl += parseInt(RegExp.$1))}
		matched = enchantments.match(/F(\d*)/);
		if (matched != null) {(enchantment_lvl += parseInt(RegExp.$1))}
	}
	
	var found = false;
	for (var i = 0; i < temp_array.length; i++) {
		if (temp_array[i][IMAGE_NAME] == temp_art_name) {
			found = true;
			temp_cost_per_battle = temp_array[i][COST_PER_BATTLE];
			(enchanted)? (temp_ap = Math.floor(temp_array[i][AP] * (1 + (enchantment_lvl/50)))) : (temp_ap = temp_array[i][AP]);
		}
	}
	
	//special art (hunter, thief, rare...etc)
	if (!found) {
		matched = search_str.match(/(\w*)_s\.jpg/);
		(enchanted)? (temp_ap = Math.floor(getSpecialArtAP(RegExp.$1) * (1 + (enchantment_lvl/50)))) : (temp_ap = getSpecialArtAP(RegExp.$1));
	}

	switch (value_to_return) {
		case GET_COST_PER_BATTLE:		// return cost per battle
			return (temp_cost_per_battle != 0)?roundNumber(parseFloat(temp_cost_per_battle), 2):0;
		case GET_AP_PER_BATTLE:			// return ap
			return roundNumber(parseFloat(temp_ap), 2);
	}	
}

function getSpecialArtAP(art_code){
	switch (art_code) {
		//AP = 1
		case 'hunter_sword1':		//hunter sword
		case 'hunter_boots1':		//hunter boots
		case 'hunter_jacket1':		//hunter shirt
		case 'hunter_gloves1':		//hunter glove
		case 'hunter_pendant1':		//hunter pendant
		case 'hunter_hat1':			//hunter hat
			return 1	
			
		//AP = 2
		case 'hunter_shield1':		//hunter shield
		case 'hunter_bow1':			//hunter bow
		case 'hunterdagger':		//MH dagger
		case 'hunter_boots2':		//MH jackboots
		case 'hunter_boots3':		//MH boots
		case 'hunter_ring1':		//MH ring of flight
		case 'hunter_helm':			//MH helmet
		case 'hunter_roga1':		//MH bone helmet
		case 'gm_spdb':				//GH boots
		case 'gm_rring':			//GH ring of charm
		case 'necrwar5st':			//defender medal 5g
			return 2;

		//AP = 3
		case 'huntershield2':		//MH shield
		case 'hunter_armor1':		//MH armor
		case 'hunter_mask1':		//MH maskrobe
		case 'hunter_bow2':			//MH bow
		case 'hunter_amulet1':		//MH amulet
		case 'hunter_arrows1':		//MH arrows
		case 'tiger_bronze':		//tiger lake medal 3g
		case 'warthief_medal5':		//order of confrontation 5g
		case '4year_klever':		//4-leaved clover
		case '3rd':					//triennial talisman
		case '3year_amul':			//triennial pendant
			return 3;
			
		//AP = 4
		case 'hunterdsword':		//MH sabre
		case 'huntersword2':		//MH cutlass
		case 'gm_sring':			//GH ring of dexterity
		case 'gm_hat':				//GH helmet
		case 'sh_boots':			//BB boots
		case 'sh_ring2':			//BB band
		case 'barb_helm':			//barb helmet
		case 'tiger_silver':		//tiger lake medal 2g
		case 'necrwar4st':			//defender medal 4g
		case 'bunt_medal3':			//medal of courage 3g
		case 'elfwar6':				//order of courage 6g
		case 'demwar6':				//order of freedom 6g
		case 'magewar5':			//order of peace 5g
		case 'warthief_medal4':		//order of confrontation 4g
		case 'necrohelm1':			//undead legionnaire morion
			return 4;
			
		//AP = 5
		case 'gm_defence':			//GH shield
		case 'gm_arm':				//GH armor
		case 'gm_3arrows':			//GH arrows
		case 'gm_amul':				//GH amulet
		case 'thief_cape':			//thief cloak
		case 'thief_ring':			//thief ring
		case 'thief_mask':			//thief mask
		case 'welfboots':			//warrior elf greaves
		case 'welfhelmet':			//warrior elf helmet
		case 'gnomeboots':			//dwarf warrior boots
		case 'gnomehelmet':			//dwarf warrior helmet
		case 'knightboots':			//militant boots
		case 'knighthelmet':		//militant armor
		case 'kn_helm':				//templar crest
		case 'demwar5':				//order of freedom 5g
		case 'magewar4':			//order of peace 4g
		case 'warthief_medal3':		//order of confrontation 3g
		case 'medal7':				//imperial award 7g
		case 'kmedal7':				//imperial medal 7g
		case 'bmedal7':				//imperial order 7g
		case '5year_star':			//5th anniversary
		case 'centaurbow':			//centaur bow
		case '6ring':				//6-faceted ring
			return 5;
			
		//AP = 6
		case 'gm_protect':			//GH maskrobe
		case 'gm_abow':				//GH bow
		case 'sh_ring1':			//BB signet
		case 'sh_helmet':			//BB helmet
		case 'thief_boots':			//thief boots
		case 'thief_armor':			//thief armor
		case 'barb_shield':			//barb shield
		case 'barb_armor':			//barb armor
		case 'barb_boots':			//barb boots
		case 'merc_dagger':			//mercenary dagger
		case 'merc_boots':			//mercenary boots
		case 'merc_armor':			//mercenary armor
		case 'darkelfcloack':		//servant of darkness cloak
		case 'darkelfkaska':		//servant of darkness crown
		case 'mage_cape':			//mage disciple cape
		case 'mage_hat':			//mage disciple hat
		case 'welfshield':			//warrior elf shield
		case 'welfarmor':			//warrior elf carapace
		case 'welfbow':				//warrior elf long bow
		case 'gmage_crown':			//mage instructor crown
		case 'gnomeshield':			//dwarf warrior buckler
		case 'gnomearmor':			//dwarf warrior armor
		case 'gnomem_helmet':		//dwarf craftsman helmet
		case 'knightshield':		//militant shield
		case 'knightarmor':			//militant armor
		case 'paladin_helmet':		//paladin headplate
		case 'kn_shield':			//templar bulwark
		case 'kn_body':				//templar platemail
		case 'nv_boot':				//unruly barb footguard
		case 'nv_helm':				//unruly barb helmet
		case 'sv_helm':				//tribal casque
		case 'inq_helm':			//inquisitor helm
		case 'amf_helm':			//amphibian faceguard
		case 'necrwar3st':			//defender medal 3g
		case 'bunt_medal2':			//medal of courage 2g
		case 'elfwar5':				//order of courage 5g
		case 'warthief_medal2':		//order of confrontation 2g
		case 'medal6':				//imperial award 6g
		case 'kmedal6':				//imperial medal 6g
		case 'bmedal6':				//imperial order 6g
		case 'dmech':				//pit demon blade
			return 6;
			
		//AP = 7
		case 'sh_shield':			//BB shield
		case 'sh_armor':			//BB armor
		case 'sh_4arrows':			//BB arrows
		case 'sh_amulet2':			//BB amulet
		case 'thief_dagger':		//thief dagger
		case 'tm_cape':				//plunderer cape
		case 'r_bow':				//ranger bow
		case 'r_warring':			//ranger ring of dexterity
		case 'r_magicsring':		//ranger ring of spirit
		case 'tact765_bow':			//tactician bow
		case 'tactspw_mring':		//tactician ring of wisdom
		case 'tactwww_wring':		//tactician band of force
		case 'necr_helm':			//necro hood
		case 'necr_robe':			//necro cape
		case 'barb_club':			//barb club
		case 'darkelfboots':		//servant of darkness boots
		case 'darkelfciras':		//servant of darkness cuirass
		case 'mage_boots':			//mage disciple boots
		case 'mage_robe':			//mage disciple robe
		case 'elfboots':			//elven scout boots
		case 'elfshirt':			//elven scout shirt
		case 'druid_boots':			//druid boots
		case 'gmage_boots':			//mage instructor overshoes
		case 'gnomem_shield':		//dwarf craftsman targe
		case 'gnomem_boots':		//dwarf craftsman footguards
		case 'paladin_shield':		//paladin shield
		case 'paladin_boots':		//paladin sabatons
		case 'nv_shield':			//unruly barb shield
		case 'nv_body':				//unruly barb harness
		case 'sv_shield':			//tribal aegis
		case 'sv_boot':				//tribal stompers
		case 'inq_boot':			//inquisitor boots
		case 'amf_boot':			//amphibian greaves
		case 'elfwar4':				//order of courage 4g
		case 'demwar4':				//order of freedom 4g
		case 'magewar3':			//order of peace 3g
		case 'warthief_medal1':		//order of confrontation 1g
		case 'medal5':				//imperial award 5g
		case 'kmedal5':				//imperial medal 5g
		case 'bmedal5':				//imperial order 5g
		case 'tjarmor3':			//light temporal
		case 'gdubina':				//goblin buldgeon
		case 'kirka':				//miner pickaxe
		case 'sunart1':				//sentinel spear
		case 'trident':				//siren trident
		case 'topor_skelet':		//skeleton hatchet
		case 'tj_helmet3':			//light temporal helmet
			return 7;
			
		//AP = 8
		case 'gm_sword':			//GH sword
		case 'gm_kastet':			//GH knucleduster
		case 'sh_cloak':			//BB maskrobe
		case 'sh_bow':				//BB bow
		case 'thief_amulet':		//thief amulet
		case 'tm_boots':			//plunderer boots
		case 'tm_wring':			//plunderer ring of swiftness
		case 'tm_mring':			//plunderer ring of sorcery
		case 'tm_msk':				//plunderer mask
		case 'r_dagger':			//ranger dagger
		case 'tacthapp_helmet':		//tactician helmet
		case 'tactsm0_dagger':		//tactician dagger
		case 'tactdff_shield':		//tactician shield
		case 'vrb_shild':			//recruiter shield
		case 'necr_amulet':			//necro amulet
		case 'dem_shield':			//demon shield
		case 'merc_sword':			//mercenary sword
		case 'mage_scroll':			//mage disciple scroll
		case 'elfbow':				//elven scout bow
		case 'druid_cloack':		//druid bolero
		case 'druid_armor':			//druid robe
		case 'gmage_scroll':		//mage instructor scroll
		case 'gmage_armor':			//mage instructor mantle
		case 'gmage_cloack':		//mage instructor cloak
		case 'gnomem_armor':		//dwarf craftsman armor
		case 'paladin_armor':		//paladin battleplate
		case 'paladin_bow':			//paladin crossbow
		case 'sv_body':				//tribal hauberk
		case 'sv_arb':				//tribal arbalest
		case 'inq_cl':				//inquisitor mantlet
		case 'amf_scroll':			//amphibian scroll
		case 'amf_body':			//amphibian garment
		case 'amf_cl':				//amphibian cloak
		case 'elfwar3':				//order of courage 3g
		case 'medal4':				//imperial award 4g
		case 'kmedal4':				//imperial medal 4g
		case 'bmedal4':				//imperial order 4g
		case 'takt':				//award of tactics
		case 'splo':				//award of unity
		case 'stoj':				//award of endurance
		case 'medalc':				//medal of tactics
		case 'medala':				//medal of unity
		case 'medalb':				//medal of endurance
		case 'bmedalc':				//order of tactics
		case 'bmedala':				//order of unity
		case 'bmedalb':				//order of endurance
		case 'necrohelm2':			//lich crown
			return 8;
		
		//AP=9
		case 'thief_arb':			//thief crossbow
		case 'r_goodscroll':		//ranger scroll
		case 'tactcv1_armor':		//tactician armor
		case 'tactzl4_boots':		//tactician jackboots
		case 'tactpow_cloack':		//tactician cloak
		case 'verbboots':			//recruiter boots
		case 'v_1armor':			//recruiter armor
		case 've_helm':				//recruiter helmet
		case 'dem_helmet':			//demon helmet
		case 'dem_armor':			//demon armor
		case 'dem_bootshields':		//demon shin-plates
		case 'darkelfpendant':		//servant of darkness pendant
		case 'elfamulet':			//elven scout amulet
		case 'welfsword':			//warrior elf sword
		case 'gnomehammer':			//dwarf warrior hammer
		case 'knightsword':			//militant sword
		case 'kn_weap':				//templar gladius
		case 'inq_body':			//inquisitor chestguard
		case 'tiger_gold':			//tiger lake medal 1g
		case 'demwar3':				//order of freedom 3g
		case 'magewar2':			//order of peace 2g
		case 'pika':				//assailant poleaxe
		case 'kopie':				//dwarven spear
		case 'kosa':				//hell reaper scythe
		case 'bludgeon':			//invader flail
		case 'sunart2':				//sun crossbow
		case 'tj_helmet2':			//temporal helmet
		case 'necrohelm3':			//undead knight helmet
			return 9;
		
		//AP = 10
		case 'sh_sword':			//BB blade
		case 'sh_spear':			//BB spear
		case 'tm_armor':			//plunderer harness
		case 'r_bootsmb':			//ranger jackboots
		case 'r_zarmor':			//ranger vest
		case 'r_helmb':				//ranger cap
		case 'tactmag_staff':		//tactician baton
		case 'tactms1_mamulet':		//tactician charm
		case 'tact1w1_wamulet':		//tactician war pendant
		case 'necr_staff':			//necro staff
		case 'darkelfstaff':		//servant of darkness staff
		case 'gnomem_hammer':		//dwarf craftsman hammer
		case 'nv_weap':				//unruly barbsword
		case 'necrwar2st':			//defender medal 2g
		case 'medal3':				//imperial award 3g
		case 'kmedal3':				//imperial medal 3g
		case 'bmedal3':				//imperial order 3g
		case 'rog_demon':			//demon horn
		case 'zub':					//dragon fang
		case 'tjarmor2':			//temporal armor
		case 'blacksword':			//unholy blackshard
		case 'ruru9':				//runet figurine 2009
			return 10;
		
		//AP = 11
		case 'tm_knife':			//plunderer shiv
		case 'tm_amulet':			//plunderer necklace
		case 'r_clck':				//ranger cloak
		case 'r_warriorsamulet':	//ranger amulet
		case 'r_m_amulet':			//ranger pendant
		case 'tactaz_axe':			//tactician hatchet
		case 'verb11_sword':		//recruiter sword
		case 'mage_staff':			//mage disciple staff
		case 'druid_staff':			//druid staff
		case 'druid_amulet':		//druid charm
		case 'gmage_staff':			//mage instructor staff
		case 'gnomem_amulet':		//dwarf craftsman amulet
		case 'paladin_sword':		//paladin sword
		case 'sv_weap':				//tribal mace
		case 'amf_weap':			//amphibian staff
		case 'bunt_medal1':			//medal of courage 1g
		case 'elfwar2':				//order of courage 2g
		case 'demwar2':				//order of freedom 2g
		case 'slayersword':			//commander sword
		case 'dtopor':				//devil axe
		case 'dubina':				//ogre club
		case 'sunart3':				//sword of requital
			return 11;
		
		//AP = 12
		case 'tm_arb':				//plunderer crossbow
		case 'dem_axe':				//demon axe
		case 'dem_amulet':			//demon amulet
		case 'inq_weap':			//inquisitor rod
		case 'magewar1':			//order of peace 1g
		case 'medal2':				//imperial award 2g
		case 'kmedal2':				//imperial medal 2g
		case 'bmedal2':				//imperial order 2g
		case 'sunart4':				//blade of revelation
		case 'molot_tan':			//invoker thundermace
		case 'tj_helmet1':			//heavy temporal helmet
			return 12;
		
		//AP = 13
		case 'r_bigsword':			//ranger sword
		case 'r_magy_staff':		//ranger staff
		case 'elfwar1':				//order of courage 1g
			return 13;
			
		//AP = 14
		case 'necrwar1st':			//defender medal 1g
		case 'demwar1':				//order of freedom 1g
			return 14;
			
		//AP = 15
		case 'medal1':				//imperial award 1g
		case 'kmedal1':				//imperial medal 1g
		case 'bmedal1':				//imperial order 1g
			return 15;
			
		default:
			return 0;
	}
}

function getLegend() {
	var legend = document.createElement('div');
	var main_tbl;
	var main_tr;
	var main_td;
	legend.id = 'Legend';
	legend.style.display = 'none';
	legend.align = 'center';
	main_tbl = document.createElement('table');
	main_tbl.className = 'wblight';
	main_tbl.id = 'legend_table';
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_td.appendChild(getLegendTable(Head, 'Headgear'));
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_td.appendChild(getLegendTable(Necklace, 'Necklace'));
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_td.appendChild(getLegendTable(Armor, 'Armor'));
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_td.appendChild(getLegendTable(Back, 'Back'));
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_td.appendChild(getLegendTable(RightHand, 'Weapon'));
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_td.appendChild(getLegendTable(LeftHand, 'Left\u00a0Hand'));
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_td.appendChild(getLegendTable(Foot, 'Footgear'));
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	main_tr = document.createElement('tr');
	main_td = document.createElement('td');
	main_td.appendChild(getLegendTable(Ring, 'Ring'));
	main_tr.appendChild(main_td);
	main_tbl.appendChild(main_tr);
	legend.appendChild(main_tbl);
	return legend;
}

function getLegendTable(passed_array, legend_label) {
	var img;
	var hyperlink;
	var cell_class;
	var lowest_ap_index;
	tbl = document.createElement('table');
	tbl.className = 'wbwhite';
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.align = 'right';
	td.className = 'wb';
	td.appendChild(document.createTextNode('\u00a0\u00a0' + legend_label + '\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	lowest_ap_index = getLowestAPIndex(passed_array);
	for (var z = 0; z < passed_array.length; z++) {
		td = document.createElement('td');
		if (z == lowest_ap_index) {
			td.className = 'wb';
			td.bgColor = 'yellow';
		} else {
			td.className = 'wblight';
		}
		img = document.createElement('img');
		img.src = 'i/artifacts/' + passed_array[z][IMAGE_NAME] + '.jpg';
		hyperlink = document.createElement('a');
		hyperlink.href = 'art_info.php?id=' + passed_array[z][LARGE_IMAGE_NAME];
		hyperlink.appendChild(img);
		td.appendChild(hyperlink);
		tr.appendChild(td);
	}
	tbl.appendChild(tr);
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.align = 'right';
	td.className = 'wb';
	td.appendChild(document.createTextNode('\u00a0\u00a0Durability\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	for (var z = 0; z < passed_array.length; z++) {
		td = document.createElement('td');
		td.align = 'center';
		if (z == lowest_ap_index) {
			td.className = 'wb';
			td.bgColor = 'yellow';
		} else {
			td.className = 'wblight';
		}
		td.appendChild(document.createTextNode(passed_array[z][DURABILITY]));
		tr.appendChild(td);
	}
	tbl.appendChild(tr);
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.align = 'right';
	td.className = 'wb';
	td.appendChild(document.createTextNode('AP\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	for (var z = 0; z < passed_array.length; z++) {
		td = document.createElement('td');
		td.align = 'center';
		if (z == lowest_ap_index) {
			td.className = 'wb';
			td.bgColor = 'yellow';
		} else {
			td.className = 'wblight';
		}
		td.appendChild(document.createTextNode(passed_array[z][AP]));
		tr.appendChild(td);
	}
	tbl.appendChild(tr);
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.align = 'right';
	td.className = 'wb';
	td.appendChild(document.createTextNode('\u00a0\u00a0Buy\u00a0Price\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	for (var z = 0; z < passed_array.length; z++) {
		td = document.createElement('td');
		td.align = 'center';
		if (z == lowest_ap_index) {
			td.className = 'wb';
			td.bgColor = 'yellow';
		} else {
			td.className = 'wblight';
		}
		td.appendChild(document.createTextNode(passed_array[z][BUY_PRICE]));
		tr.appendChild(td);
	}
	tbl.appendChild(tr);
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.align = 'right';
	td.className = 'wb';
	td.appendChild(document.createTextNode('\u00a0\u00a0Per\u00a0Battle\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	for (var z = 0; z < passed_array.length; z++) {
		td = document.createElement('td');
		td.align = 'center';
		if (z == lowest_ap_index) {
			td.className = 'wb';
			td.bgColor = 'yellow';
		} else {
			td.className = 'wblight';
		}
		td.appendChild(document.createTextNode(roundNumber(passed_array[z][COST_PER_BATTLE], 2)));
		tr.appendChild(td);
	}
	tbl.appendChild(tr);
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.align = 'right';
	td.className = 'wb';
	td.appendChild(document.createTextNode('\u00a0\u00a0Per\u00a0AP\u00a0\u00a0'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	for (var z = 0; z < passed_array.length; z++) {
		td = document.createElement('td');
		td.align = 'center';
		if (z == lowest_ap_index) {
			td.className = 'wb';
			td.bgColor = 'yellow';
		} else {
			td.className = 'wblight';
		}
		td.appendChild(document.createTextNode(roundNumber(passed_array[z][COST_PER_AP], 2)));
		tr.appendChild(td);
	}
	tbl.appendChild(tr);
	return tbl;
}

function getLowestAPIndex(passedArray) {
	var lowest = 0;
	for (var x = 0; x < passedArray.length; x++) {
		if ((parseFloat(passedArray[x][COST_PER_AP]) < parseFloat(passedArray[lowest][COST_PER_AP]))
			&& (passedArray[x][IMAGE_NAME].indexOf('hunter') == -1)
			&& (passedArray[x][IMAGE_NAME].indexOf('gm/gm_') == -1)
			&& (passedArray[x][IMAGE_NAME].indexOf('sh/sh_') == -1)
			&& (passedArray[x][IMAGE_NAME].indexOf('thief_') == -1)
			){
			lowest = x;
		}
	}
	return lowest;
}

function profileLegend() {
	var tables = document.getElementsByTagName('table');
	var statistics_tables;
	for (var i = 0; i < tables.length; i++) {
		if (tables[i].innerHTML.indexOf('<b>Statistics</b>') != -1) {
			statistics_tables = tables[i];
		}
	}
	statistics_tables.parentNode.insertBefore(getLegend(), statistics_tables.nextSibling);
}

function inventoryLegend() {
	var statistics_div = document.getElementById('test');
	statistics_div.insertBefore(getLegend(), statistics_div.firstChild);
}

function profileStats() {
	// get default/user set prices for resources and elements
	getConstants();

	// update faction tags based on the main faction
	main_faction = determineMainFaction();
	switch (main_faction) {
	case KNIGHT:
		 faction_tags[KNIGHT] = "&nbsp;&nbsp;<b>Knight:";
		 break;
	case NECROMANCER:
		 faction_tags[NECROMANCER] = "&nbsp;&nbsp;<b>Necromancer:";
		 break;
	case WIZARD:
		 faction_tags[WIZARD] = "&nbsp;&nbsp;<b>Wizard:";
		 break;
	case ELF:
		 faction_tags[ELF] = "&nbsp;&nbsp;<b>Elf:";
		 break;
	case BARBARIAN:
		 faction_tags[BARBARIAN] = "&nbsp;&nbsp;<b>Barbarian:";
		 break;
	case DARK_ELF:
		 faction_tags[DARK_ELF] = "&nbsp;&nbsp;<b>Dark elf:";
		 break;
	case DEMON:
		 faction_tags[DEMON] = "&nbsp;&nbsp;<b>Demon";
		 break;
	case DWARF:
		 faction_tags[DWARF] = "&nbsp;&nbsp;<b>Dwarf";
		 break;
	case TRIBAL:
		 faction_tags[TRIBAL] = "&nbsp;&nbsp;<b>Tribal";
	}

	// initialize other stats array
	for (var i = 0; i < others.length; i++) {
		others[i] = 0;
	}

	// search for td elements that has the needed information
	all_td = document.getElementsByTagName('td');
	for (var i = 0; i < all_td.length; i++) {
		if ((all_td[i].innerHTML.indexOf(resource_tags[CRYSTALS])!= -1) && (all_td[i].innerHTML.indexOf(resource_tags[GEMS])!= -1)) {
			resource_td = all_td[i];
			
		}
		if ((all_td[i].innerHTML.indexOf(faction_tags[BARBARIAN])!= -1) && (all_td[i].innerHTML.indexOf(faction_tags[DEMON])!= -1)) {
			skill_td = all_td[i];
		}	
	}

	/*******************************
	**	calculate character stats
	*******************************/

	// calculate resources 

	end_str = "</b>";
	for (var j = 0; j < RESOURCES; j++) {
		var tag_pos = resource_td.innerHTML.indexOf(resource_tags[j])
		resource_positions[j] = resource_td.innerHTML.indexOf("</td><td><b>", tag_pos) + 12;	// 12 is the length of the searched end tags
		if (resource_positions[j] != -1) {
			end_pos = resource_td.innerHTML.indexOf(end_str, resource_positions[j]);				
			resources[j] = resource_td.innerHTML.substring(resource_positions[j], end_pos);
			resources[j] = parseInt(resources[j].replace(/,/g,""));
			resource_total += resources[j] * resource_prices[j];
		}
	}

	// calculate elements
	element_total = calculateResources();

	// get character name for viewed profile
	var hyperlinks = document.getElementsByTagName('a');
	for (var y = 0; y < hyperlinks.length; y++) {
		if (hyperlinks[y].href.indexOf('mailto') != -1) {
			profile_name = hyperlinks[y].href.substring(hyperlinks[y].href.indexOf('mailto')+7).replace(/%20/g,' ');
			break;
		}
	}

	// calculate gold total
	grand_total = resources[GOLD] + resource_total + element_total;

	// get exp
	var exp_str = "&nbsp;<b>Combat level: ";
	var left_bracket_pos, right_bracket_pos;
	var exp_pos = document.body.innerHTML.indexOf(exp_str);
	if (exp_pos != -1) {
		left_bracket_pos = document.body.innerHTML.indexOf("(", exp_pos);
		right_bracket_pos = document.body.innerHTML.indexOf(")", exp_pos);
		exp_total = parseInt(document.body.innerHTML.substring(left_bracket_pos + 1, right_bracket_pos));
	}
	
	// calculate fsp
	fsp_total = calculateTotalFSP();
	

	// calculate exp/fsp ratio
	if (fsp_total != 0) {
		exp_fsp_ratio = roundNumber((exp_total / fsp_total), 2);
	}

	// calculate other stats
	end_str = "</b>";
	for (var j = 0; j < OTHER_STATS; j++) {
		other_positions[j] = document.body.innerHTML.indexOf(other_tags[j]);
		if (other_positions[j] != -1) {
			end_pos = document.body.innerHTML.indexOf(end_str, other_positions[j]);				
			others[j] = document.body.innerHTML.substring(parseInt(other_positions[j] + other_tags[j].length), end_pos);
			others[j] = parseInt(others[j].replace(/,/g,""));
		}
	}

	// calculate ratios
	if ((others[ROULETTE_BETS] != 0) && ((others[ROULETTE_WINS] - others[ROULETTE_BETS]) > 0)) {
		roulette_ratio = roundNumber((((others[ROULETTE_WINS] - others[ROULETTE_BETS]) * 100) / others[ROULETTE_BETS]), 2);
	}
	if (others[COMBATS_FOUGHT] != 0) {
		combat_ratio = roundNumber((others[COMBATS_WON] * 100) / others[COMBATS_FOUGHT], 2);
	}
	if (others[GAMES_PLAYED] != 0) {
		games_ratio = roundNumber((others[GAMES_WON] * 100) / others[GAMES_PLAYED], 2);
	}

	if (debug) {GM_log(
					'Profile info for: ' + profile_name +
					'\nExperience: ' + exp_total +
					'\nFSP Total: ' + fsp_total +
					'\nEXP/FSP Ratio: ' + exp_fsp_ratio +
					'\nCombat Ratio: ' + combat_ratio +
					'\nGames Ratio: ' + games_ratio +
					'\nRoulette Ratio: ' + roulette_ratio
				)}
	
	/*******************************
	**	update character profile
	*******************************/

	// exp/fsp ratio
	end_str = "&nbsp;<b>Troops ready:</b>"; 
	search_str = "&nbsp;<b>Troops ready:</b>";
	modified_str = "&nbsp;<b>FSP:</b> " + roundNumber(fsp_total, 2) + "<br>&nbsp;&#187;&nbsp;<b>EXP/FSP:</b> " + exp_fsp_ratio;
	var temp_tds = document.getElementsByTagName('td');
	for (var z = 0; z < temp_tds.length; z++) {
		if ((temp_tds[z].innerHTML.indexOf('lordswm.com/pl_transfers.php?id=')) && (temp_tds[z].innerHTML.indexOf('lordswm.com/pl_warlog.php?id='))) {
			temp_tds[z].innerHTML.match(/pl_transfers\.php\?id=(\d*)/);
			var profile_id = RegExp.$1;
		}
		if ((temp_tds[z].innerHTML.indexOf('Laborers\' guild') != -1) && (temp_tds[z].innerHTML.indexOf('Enchanters\' guild')) != -1) {
			var guild_td = temp_tds[z];
		}
	}
	var temp_pos = guild_td.innerHTML.indexOf("Laborers' guild");
	left_bracket_pos = guild_td.innerHTML.indexOf("(", temp_pos);
	right_bracket_pos = guild_td.innerHTML.indexOf(")", temp_pos);
	var lg = parseInt(guild_td.innerHTML.substring(left_bracket_pos + 1, right_bracket_pos));
	
	var date_key = script_name + profile_id + ' registeration date'; 
	registeration_date = localStorage[date_key];
	if (registeration_date != undefined) {
		var no_of_days = days_between(new Date(), new Date(registeration_date));
		if (debug) {GM_log('Registration Date: ' + registeration_date)}
		modified_str += "<br>&nbsp;&#187;&nbsp;<b>FSP per day:</b> " + roundNumber(fsp_total / no_of_days, 2);
		modified_str += "<br>&nbsp;&#187;&nbsp;<b>EXP per day:</b> " + roundNumber(exp_total / no_of_days, 2);
		modified_str += "<br>&nbsp;&#187;&nbsp;<b>Combats per day:</b> " + roundNumber(others[COMBATS_FOUGHT] / no_of_days, 2);
		modified_str += "<br>&nbsp;&#187;&nbsp;<b>Enrollments per day:</b> " + roundNumber(lg / no_of_days, 2);
	} else {
		modified_str += "<br>&nbsp;&#187;&nbsp;<b>FSP per day:</b>&nbsp;Not available, click <a href='http://www.lordswm.com/pl_transfers.php?id=" + profile_id + "&page=999999'>here</a> to update";
		modified_str += "<br>&nbsp;&#187;&nbsp;<b>EXP per day:</b>&nbsp;Not available, click <a href='http://www.lordswm.com/pl_transfers.php?id=" + profile_id + "&page=999999'>here</a> to update";
		modified_str += "<br>&nbsp;&#187;&nbsp;<b>Combat per day:</b>&nbsp;Not available, click <a href='http://www.lordswm.com/pl_transfers.php?id=" + profile_id + "&page=999999'>here</a> to update";
		modified_str += "<br>&nbsp;&#187;&nbsp;<b>Enrollments per day:</b>&nbsp;Not available, click <a href='http://www.lordswm.com/pl_transfers.php?id=" + profile_id + "&page=999999'>here</a> to update";
	}
	modified_str += "</b><br>&nbsp;&#187;&nbsp;<b>Troops ready:</b>";
	updateProfile(end_str, modified_str, search_str);	
	
	// combat ratio
	end_str = "</b></td><td width=\"30%\">&nbsp;&nbsp;Defeats: <b>"; 
	search_str = "<td width=\"40%\">&nbsp;&nbsp;Defeats: <b>";
	modified_str = "</b><br>&nbsp;&nbsp;Win %: <b>" + combat_ratio + "%</b></td><td width=\"30%\">&nbsp;&nbsp;Defeats: <b>";
	updateProfile(end_str, modified_str, search_str);

	// games ratio
	end_str = "<td width=\"30%\">&nbsp;&nbsp;Defeats: <b>" + others[GAMES_LOST] + "</b></td><td width=\"5%\">"; 
	search_str = "<td width=\"30%\">&nbsp;&nbsp;Defeats: <b>";
	modified_str = "<td width=\"30%\">&nbsp;&nbsp;Defeats: <b>" + others[GAMES_LOST] + "</b><br>&nbsp;&nbsp;Win %: <b>" + games_ratio + "%</b></td><td width=\"5%\">";
	updateProfile(end_str, modified_str, search_str);

	// roulette ratio
	end_str = "</b><br><br>"; 
	search_str = "<br>&nbsp;&nbsp;Roulette winnings total: <b>";
	modified_str = "</b><br>&nbsp;&nbsp;Roulette Win %: <b>" + roulette_ratio + "%</b><br><br>";
	updateProfile(end_str, modified_str, search_str);

	// build prices form 
	search_str = "Game log [<a href=\"pl_cardlog.php"; 
	var tds = document.getElementsByTagName("td");
	var first_pass = false;
	for (var k = 0; k < tds.length; k++) {
		search_pos = tds[k].innerHTML.indexOf(search_str);
		if (search_pos != -1) {
			if (!first_pass) {
				first_pass = true;
				continue;
			}
			updateGoldTotal(tds[k]);
			tds[k].innerHTML += "To update default resource and element prices, click <a href=\"#\" onClick=\"var e=document.getElementById('ConstantPrices');if(e.style.display == 'block') {e.style.display = 'none';} else {e.style.display = 'block';};return false;\">here</a>&nbsp;&nbsp;<br>";
			div = document.createElement("div");
			div.id = "ConstantPrices";
			div.style.display = "none";
			tds[k].appendChild(div);
			div.appendChild(document.createElement("br"));
			
			for (var z = 1; z < resources.length; z++) {
				el = document.createTextNode(resource_tags[z].substring(0,1).toUpperCase() + resource_tags[z].substring(1).replace(".gif"," "));
				div.appendChild(el);
				el = document.createElement("input");
				el.type = "input"
				el.id = "r" + z;
				el.value = resource_prices[z];
				el.style.textAlign = "center";
				el.setAttribute("size", 6);
				div.appendChild(el);
				div.appendChild(document.createElement("br"));
			}

			for (var z = 0; z < elements.length; z++) {
				el = document.createTextNode(element_tags[z].replace("<b>","").replace("</b>:",""));
				div.appendChild(el);
				el = document.createElement("input");
				el.type = "input"
				el.id = "e" + z;
				el.value = element_prices[z];
				el.style.textAlign = "center";
				el.setAttribute("size", 6);
				div.appendChild(el);
				div.appendChild(document.createElement("br"));
			}
			div.appendChild( document.createElement("br"));

			el = document.createElement("input");
			el.type = "button";
			el.addEventListener("click", removeConstants, false);
			el.setAttribute("value", "Default");
			div.appendChild(el);
			el = document.createElement("input");
			el.type = "button";
			el.addEventListener("click", updateConstants, false);
			el.setAttribute("value", "Update");
			div.appendChild(el);
			div.appendChild(document.createElement("br"));
			div.appendChild(document.createElement("br"));
			div.appendChild(document.createTextNode("To update prices, click \"Update\""));
			div.appendChild(document.createElement("br"));
			div.appendChild(document.createTextNode("To restore default values, click \"Default\""));
		}
	}
}

function updateGoldTotal(td){
	var el;
	td.appendChild(document.createElement('br'));
	td.appendChild(document.createElement('br'));
	td.appendChild(document.createElement('br'));
	
	//Gold on hand
	td.appendChild(document.createTextNode('Gold on hand: '));
	el = document.createElement('b');
	el.innerHTML = formatNumber(resources[GOLD]);
	td.appendChild(el);
	td.appendChild(document.createTextNode('\u00a0\u00a0'));
	td.appendChild(document.createElement('br'));
	
	//Gold from resources
	td.appendChild(document.createTextNode('Gold from resources: '));
	el = document.createElement('b');
	el.innerHTML = formatNumber(resource_total);
	td.appendChild(el);
	td.appendChild(document.createTextNode('\u00a0\u00a0'));
	td.appendChild(document.createElement('br'));

	//Gold from elements
 		el = document.createElement('u');
		el.appendChild(document.createTextNode('Gold from elements: '));
		var el2 = document.createElement('b');
		el2.innerHTML = formatNumber(element_total);
		el.appendChild(el2);
		td.appendChild(el);
		td.appendChild(document.createTextNode('\u00a0\u00a0'));
		td.appendChild(document.createElement('br'));
 
	td.appendChild(document.createTextNode('Total Gold: '));
	el = document.createElement('b');
	el.innerHTML = formatNumber(grand_total);
	td.appendChild(el);
	td.appendChild(document.createTextNode('\u00a0\u00a0'));
	td.appendChild(document.createElement('br'));
	td.appendChild(document.createElement('br'));
}

function getRegistrationDate() {
	var temp_tds = document.getElementsByTagName('td');
	var found = false;
	var registeration_entry;
	var english_registeration = ': Registered. Faction:';
	var russian_registeration = ': Зарегистрирован. Фракция:';
	for (var z = 0; z < temp_tds.length; z++) {
		if (temp_tds[z].innerHTML.indexOf(english_registeration) != -1) {
			found = true;
			registeration_entry = english_registeration;
			var temp_td = temp_tds[z];
		}
		if (temp_tds[z].innerHTML.indexOf(russian_registeration) != -1) {
			found = true;
			registeration_entry = russian_registeration;
			var temp_td = temp_tds[z];
		}
	}
	if (!found) {return;}
	var end_pos = temp_td.innerHTML.indexOf(registeration_entry);
	var reg_date_str = temp_td.innerHTML.substring(end_pos - 16, end_pos);
	var reg_date = new Date(reg_date_str.substring(0,4), reg_date_str.substring(5,7) - 1, reg_date_str.substring(8,10), reg_date_str.substring(11,13), reg_date_str.substring(14,16));
	var temp_match = location.href.match(/pl_transfers\.php\?id=(\d*)/);
	if (temp_match == null) {return;}
	var player_id = RegExp.$1;
	var date_key = script_name + player_id + ' registeration date';
	localStorage[date_key] = reg_date.toString();
	if (debug) {GM_log('Registeration date for player id: ' + player_id + ' is: ' + reg_date.toString() )}
}

function days_between(date1, date2) {

    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)
    
    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}

function isNumeric(number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

function roundNumber(unrounded_number, decimals) {
	var rounded_number = Math.round(unrounded_number*Math.pow(10,decimals))/Math.pow(10,decimals);
	return rounded_number;
}

function determineMainFaction () {
	var faction;
	var faction_str = "]&nbsp;<img src=\"i/r";
	var faction_pos = document.body.innerHTML.indexOf(faction_str);
	if (faction_pos != -1) {
		faction = document.body.innerHTML.substr(parseInt(faction_pos + faction_str.length), 1);
		return faction - 1;
	}
 }
 
function formatNumber(unformatted_number)  {  
	unformatted_number += "";
	x = unformatted_number.split(".");
	x1 = x[0];
	x2 = x.length > 1 ? "." + x[1] : "";
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
	  x1 = x1.replace(rgx, "$1" + "," + "$2");
	}
	return x1 + x2;
 }

function updateProfile (old_str, new_str, lookup_str) {
	var tds = document.getElementsByTagName('td');
	for (var k = 0; k < tds.length; k++) {
		search_pos = tds[k].innerHTML.indexOf(search_str);
		if (search_pos != -1) {
			end_pos = tds[k].innerHTML.indexOf(end_str, search_pos);	
			tds[k].innerHTML = tds[k].innerHTML.replace(end_str, modified_str);
			return;
		}
	}
 }
 
function updateConstants () {
	for (var z = 1; z < resources.length; z++) {
		resource_prices[z] = document.getElementById("r"+z).value;
	}

	for (var z = 1; z < elements.length; z++) {
		element_prices[z] = document.getElementById("e"+z).value;
	}
	setConstants();
	window.location.reload();
 }
 
function getConstants () {
	var resource_str = localStorage[resources_key];
	var element_str = localStorage[elements_key];
	if (debug) {GM_log('Resources = ' + resource_str 
					+ '\Elements = ' + element_str)}
	if ((resource_str != undefined) && (element_str != undefined)){
		resource_prices = resource_str.split(",");
		element_prices = element_str.split(",");
	} else {
		defaultConstants();
		setConstants();
	}
	return;
 }
 
function setConstants () {
	localStorage[resources_key] = resource_prices.toString();
	localStorage[elements_key] = element_prices.toString();
	if (debug) {GM_log('Saving Resources: ' + resource_prices.toString() +
						'\nSaving Elements: ' + element_prices.toString()
					)}
	return;
 }
 
function defaultConstants() {
   	resource_prices[WOOD] = 180;
	resource_prices[ORE] = 180;
	resource_prices[MERCURY] = 360;
	resource_prices[SULFUR] = 360;
	resource_prices[CRYSTALS] = 360;
	resource_prices[GEMS] = 360;	 
	element_prices[STEEL] = 759;
	element_prices[LEATHER] = 180;
	element_prices[NICKEL] = 1698;
	element_prices[MAGIC_POWDER] = 2074;
	element_prices[MITHRIL_ORE] = 460;
	element_prices[OBSIDIAN] = 2000;
	element_prices[MITHRIL] = 3325;
	element_prices[ORICHALCUM] = 11000;
	
	element_prices[ABRASIVE] = 250;
	element_prices[FERN_FLOWER] = 300;
	element_prices[FIRE_CRYSTAL] = 1800;
	element_prices[ICE_CRYSTAL] = 2800;
	element_prices[METEORITE_SHARD] = 1600;
	element_prices[MOONSTONE] = 5800;
	element_prices[TIGER_CLAW] = 1400;
	element_prices[TOADSTOOL] = 300;
	element_prices[VIPER_VENOM] = 100;
	element_prices[WINDFLOWER] = 2900;
	element_prices[WITCH_BLOOM] = 100;
	return;
 }

function removeConstants () {
	localStorage.removeItem(resources_key);
	localStorage.removeItem(elements_key);
	window.location.reload();
}

function calculateResources () {
	var all_tables = document.getElementsByTagName('table');
	var resources_table;
	var matched;
	var resources_td;
	var total_resources = 0;
	for (var i = 0; i < all_tables.length; i++) {
		if ((all_tables[i].innerHTML.indexOf('Resources') != -1)
		&& (all_tables[i].innerHTML.indexOf('Skills') != -1)
		&& (all_tables[i].innerHTML.indexOf('Talents') != -1)) {
			resources_table = all_tables[i];
		}
	}

	matched = resources_table.innerHTML.match(/<b>Steel<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[STEEL];
		if (debug) {GM_log('Steel: ' + RegExp.$1 + ' for ' + element_prices[STEEL])}
	}
	matched = resources_table.innerHTML.match(/<b>Leather<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[LEATHER];
		if (debug) {GM_log('Leather: ' + RegExp.$1 + ' for ' + element_prices[LEATHER])}
	}
	matched = resources_table.innerHTML.match(/<b>Nickel<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[NICKEL];
		if (debug) {GM_log('Nickel: ' + RegExp.$1 + ' for ' + element_prices[NICKEL])}
	}
	matched = resources_table.innerHTML.match(/<b>Magic powder<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[MAGIC_POWDER];
		if (debug) {GM_log('Magic powder: ' + RegExp.$1 + ' for ' + element_prices[MAGIC_POWDER])}
	}
	matched = resources_table.innerHTML.match(/<b>Mithril ore<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[MITHRIL_ORE];
		if (debug) {GM_log('Mithril ore: ' + RegExp.$1 + ' for ' + element_prices[MITHRIL_ORE])}
	}
	matched = resources_table.innerHTML.match(/<b>Obsidian<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[OBSIDIAN];
		if (debug) {GM_log('Obsidian: ' + RegExp.$1 + ' for ' + element_prices[OBSIDIAN])}
	}
	matched = resources_table.innerHTML.match(/<b>Mithril<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[MITHRIL];
		if (debug) {GM_log('Mithril: ' + RegExp.$1 + ' for ' + element_prices[MITHRIL])}
	}
	matched = resources_table.innerHTML.match(/<b>Orichalcum<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[ORICHALCUM];
		if (debug) {GM_log('Orichalcum: ' + RegExp.$1 + ' for ' + element_prices[ORICHALCUM])}
	}

	matched = resources_table.innerHTML.match(/<b>Abrasive<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[ABRASIVE];
		if (debug) {GM_log('Abrasive: ' + RegExp.$1 + ' for ' + element_prices[ABRASIVE])}
	}
	matched = resources_table.innerHTML.match(/<b>Fern flower<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[FERN_FLOWER];
		if (debug) {GM_log('Fern flower: ' + RegExp.$1 + ' for ' + element_prices[FERN_FLOWER])}
	}
	matched = resources_table.innerHTML.match(/<b>Fire crystal<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[FIRE_CRYSTAL];
		if (debug) {GM_log('Fire crystal: ' + RegExp.$1 + ' for ' + element_prices[FIRE_CRYSTAL])}
	}
	matched = resources_table.innerHTML.match(/<b>Ice crystal<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[ICE_CRYSTAL];
		if (debug) {GM_log('Ice crystal: ' + RegExp.$1 + ' for ' + element_prices[ICE_CRYSTAL])}
	}
	matched = resources_table.innerHTML.match(/<b>Meteorite shard<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[METEORITE_SHARD];
		if (debug) {GM_log('Meteorite shard: ' + RegExp.$1 + ' for ' + element_prices[METEORITE_SHARD])}
	}
	matched = resources_table.innerHTML.match(/<b>Moonstone<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[MOONSTONE];
		if (debug) {GM_log('Moonstone: ' + RegExp.$1 + ' for ' + element_prices[MOONSTONE])}
	}
	matched = resources_table.innerHTML.match(/<b>Tiger\`s claw<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[TIGER_CLAW];
		if (debug) {GM_log('Tiger\`s claw: ' + RegExp.$1 + ' for ' + element_prices[TIGER_CLAW])}
	}
	matched = resources_table.innerHTML.match(/<b>Toadstool<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[TOADSTOOL];
		if (debug) {GM_log('Toadstool: ' + RegExp.$1 + ' for ' + element_prices[TOADSTOOL])}
	}
	matched = resources_table.innerHTML.match(/<b>Viper venom<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[VIPER_VENOM];
		if (debug) {GM_log('Viper venom: ' + RegExp.$1 + ' for ' + element_prices[VIPER_VENOM])}
	}
	matched = resources_table.innerHTML.match(/<b>Windflower<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[WINDFLOWER];
		if (debug) {GM_log('Windflower: ' + RegExp.$1 + ' for ' + element_prices[WINDFLOWER])}
	}
	matched = resources_table.innerHTML.match(/<b>Witch bloom<\/b>: (\d*)/);
	if (matched != null) {
		total_resources += parseInt(RegExp.$1) * element_prices[WITCH_BLOOM];
		if (debug) {GM_log('Witch bloom: ' + RegExp.$1 + ' for ' + element_prices[WITCH_BLOOM])}
	}
	if (debug) {GM_log('Total Resources: ' + total_resources)}
	return total_resources;
}

function calculateTotalFSP () {
	var all_tables = document.getElementsByTagName('table');
	var skills_table;
	var matched;
	var faction_td;
	var total_fsp = 0;
	for (var i = 0; i < all_tables.length; i++) {
		if ((all_tables[i].innerHTML.indexOf('Resources') != -1)
		&& (all_tables[i].innerHTML.indexOf('Skills') != -1)
		&& (all_tables[i].innerHTML.indexOf('Talents') != -1)) {
			skills_table = all_tables[i];
		}
	}

	var all_tds = skills_table.getElementsByTagName('td');
	for (var i = 0; i < all_tds.length; i++) {
		if ((all_tds[i].innerHTML.indexOf('Necromancer') != -1)
			&& (all_tds[i].innerHTML.indexOf('Demon') != -1)) {
			faction_td = all_tds[i];
		}
	}

	faction_array = faction_td.innerHTML.split('<br>');
	
 	for (var i = 0; i < faction_array.length; i++) {
		// faction points
		matched = faction_array[i].match(/Knight: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			if (debug) {GM_log('Knight FSP: ' + RegExp.$1)}
			total_fsp += parseFloat(RegExp.$1);
		}
		matched = faction_array[i].match(/Necromancer: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			if (debug) {GM_log('Necromancer FSP: ' + RegExp.$1)}
			total_fsp += parseFloat(RegExp.$1);
		}
		matched = faction_array[i].match(/Wizard: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			if (debug) {GM_log('Wizard FSP: ' + RegExp.$1)}
			total_fsp += parseFloat(RegExp.$1);
		}
		matched = faction_array[i].match(/Elf: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			if (debug) {GM_log('Elf FSP: ' + RegExp.$1)}
			total_fsp += parseFloat(RegExp.$1);
		}
		matched = faction_array[i].match(/Barbarian: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			if (debug) {GM_log('Barbarian FSP: ' + RegExp.$1)}
			total_fsp += parseFloat(RegExp.$1);
		}
		matched = faction_array[i].match(/Dark elf: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			if (debug) {GM_log('Dark Elf FSP: ' + RegExp.$1)}
			total_fsp += parseFloat(RegExp.$1);
		}
		matched = faction_array[i].match(/Demon: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			if (debug) {GM_log('Demon FSP: ' + RegExp.$1)}
			total_fsp += parseFloat(RegExp.$1);
		}
		matched = faction_array[i].match(/Dwarf: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			if (debug) {GM_log('Dwarf FSP: ' + RegExp.$1)}
			total_fsp += parseFloat(RegExp.$1);
		}
		matched = faction_array[i].match(/Tribal: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			if (debug) {GM_log('Tribal FSP: ' + RegExp.$1)}
			total_fsp += parseFloat(RegExp.$1);
		}

	}
	return total_fsp;
}

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

function breakEven() {
	all_tds = document.getElementsByTagName('td');
	 
	for (var i = 0; i < all_tds.length; i++) {
		if (all_tds[i].className =="wbwhite") {
			td = all_tds[i];
		}
	}

	all_trs = td.getElementsByTagName('tr');

	for (var i = 0; i < all_trs.length; i++) {
		var not_element = true;
		var not_art = true;

		if (all_trs[i].className =="wb") {
			var matched = all_trs[i].innerHTML.match(/<\/a><\/b><br>Durability: (\d+)\/(\d+)/);		
			//art
			if (matched != null) {
				not_art = false;
				market_art_durability = parseInt(RegExp.$1);
				market_max_durability = parseInt(RegExp.$2);
				if (market_art_durability < market_max_durability) {
					continue;
				}
			} else {
				continue;
			}

			matched = all_trs[i].innerHTML.match(/<\/td><td>(\d{0,}\,{0,}\d{0,}\,{0,}\d{0,})<\/td><\/tr>/);	
			if (matched != null) {
				all_trs[i].innerHTML.match(/<\/a> - (\D*)&nbsp;<b>/);
				item_name = RegExp.$1;
				
				market_price = getArtPrice(item_name);
				if (market_price != 0) {
					break_even_price = Math.floor(market_price/0.99);
					var durability_str = '<br>Durability';
					var durability_pos = all_trs[i].innerHTML.indexOf(durability_str);
					var end_pos = all_trs[i].innerHTML.indexOf('<', durability_pos + durability_str.length);
					all_trs[i].innerHTML = all_trs[i].innerHTML.substring(0, end_pos) + '<br>Break-even: ' + formatNumber(break_even_price) + all_trs[i].innerHTML.substring(end_pos)
				}
			}
		}
	}
}

function getArtPrice(item_name){
	var artsCount = allArts.length;
	for (var i = 0; i < artsCount; i++) {
		if (allArts[i][ART_NAME] == item_name) return allArts[i][BUY_PRICE];
	}
	return 0;
}