// ==UserScript==
// @name			LWMBreakEvenPrice
// @author			Theatre Of Pain
// @version			1.0.130210
// @description		This script calculates the break even price for artifacts available for sale on the market
// @include			http://www.lordswm.com/auction.php*
// ==/UserScript==

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
const HELMET_OF_COURAGE = 37;
const LIGHT_MITHRIL_COIF = 38;
const HEAVY_MITHRIL_COIF = 39;
const RUBY_HELMET = 40;
const WARLOCK_CROWN = 41;
const OBSIDIAN_HELMET = 42;
const FLAME_HELMET = 43;
const FIREBENDER_CROWN = 44;

const MEDAL_OF_BRAVERY = 50;
const AMULET_OF_LUCK = 51;
const PENDANT_OF_DESPAIR = 52;
const LUCKY_HORSESHOE = 53;
const WARRIOR_PENDANT = 54;
const LOCKET_OF_CRYSTALIZED_TEARS = 55;
const MYSTICAL_AMULET = 56;
const PENDANT_OF_WRATH = 57;
const SHARD_OF_DARKNESS = 58;
const AMULET_OF_FORTUNE = 59;
const TRIFORCE_CHARM = 60;
const CHARM_OF_CAPTURED_SOULS = 61;
const TALISMAN_OF_WARDANCE = 62;

const LEATHER_ARMOR = 70;
const LEATHER_HARNESS = 71;
const HAUBERK = 72;
const STEEL_CUIRASS = 73;
const WIZARD_ATTIRE = 74;
const LIGHT_MITHRIL_CUIRASS = 75;
const MITHRIL_MAIL_ARMOR = 76;
const PLATEMAIL = 77;
const SORCERER_ROBE = 78;
const FULLMITHRIL_ARMOR = 79;
const OBSIDIAN_ARMOR = 80;
const FIREBENDER_ROBE = 81;
const FLAME_PLATE = 82;

const SHORTBOW = 90;
const LONG_BOW = 91;
const COMPOSITE_BOW = 92;
const BOW_OF_MIDNIGHT_STILL = 93;
const SCOUTS_CAPE = 94;
const CAPE_OF_SPIRITS = 95;
const CAPE_OF_WINDS = 96;
const MASKROBE = 97;
const CAPE_OF_MAGICAL_POWER = 98;
const CAPE_OF_ARCANE_PROTECTION = 99;
const SORCERER_CAPE = 100;
const FIREBENDER_MANTLE = 101;

const WOODEN_SWORD = 110;
const LIGHT_AXE = 111;
const STEEL_BLADE = 112;
const REPRISAL_SWORD = 113;
const SWORD_OF_RETRIBUTION = 114;
const COMBAT_STAFF = 115;
const EQUILIBRIUM_BLADE = 116;
const SWORD_OF_MIGHT = 117;
const STAFF_OF_POWER = 118;
const STAFF_OF_YOUTH = 119;
const SWORD_OF_STIFFNESS = 120;
const MITHRIL_STAFF = 121;
const MITHRIL_LONGSWORD = 122;
const STAFF_OF_SHADOWS = 123;
const SWORD_OF_COURAGE = 124;
const RUBY_QUARTER_STAFF = 125;
const RUBY_GLADIUS = 126;
const OBSIDIAN_BATON = 127;
const OBSIDIAN_SWORD = 128;
const FIREBENDER_STAFF = 129;
const BLADE_OF_REBIRTH = 130;

const DAGGER_OF_VENGEANCE = 140;
const SCROLL_OF_ENERGY = 141;
const ROUND_SHIELD = 142;
const STEEL_BUCKLER = 143;
const DEFENDER_SHIELD = 144;
const SHIELD_OF_GLORY = 145;
const DRAGON_SHIELD = 146;
const TOWER_SHIELD = 147;
const HAWK_LORD_BULWARK = 148;
const OBSIDIAN_SHIELD = 149;
const FLAME_SHIELD = 150;

const LEATHER_JACKBOOTS = 160;
const LEATHER_BOOTS = 161;
const GALOSHES_OF_BATTLE = 162;
const SHOES_OF_ASPIRATION = 163;
const STEEL_BOOTS = 164;
const LIGHT_MITHRIL_BOOTS = 165;
const SOLDIER_BOOTS = 166;
const HEAVY_MITHRIL_BOOTS = 167;
const RUBY_BOOTS = 168;
const SORCERER_SANDALS = 169;
const OBSIDIAN_BOOTS = 170;
const WARLOCK_JACKBOOTS = 171;
const FLAME_BOOTS = 172;

const RING_OF_DEXTERITY = 180;
const RING_OF_AMBITION = 181;
const RING_OF_INSPIRATION = 182;
const RING_OF_DOUBTS = 183;
const RING_OF_IMPETUOSITY = 184;
const RING_OF_ABDICATION = 185;
const PROPHET_RING = 186;
const RING_OF_THUNDER = 187;
const RING_OF_THORNS = 188;
const PENUMBRAL_RING = 189;
const SIGNET_RING_OF_MIGHT = 190;
const SORCERER_SIGNET = 191;
const DRAGONS_EYE = 192;
const RING_OF_CONTRADICTIONS = 193;
const STELLAR_RING = 194;
const RING_OF_TORMENT = 195;

const ART = 0;
const ELEMENT = 1;

var td, all_tds;
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

setConstants();
main();

function main() {
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
				item_type = ART;
				market_art_durability = RegExp.$1;
				market_max_durability = RegExp.$2;
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

function setConstants () {
	prices[WOOD] = 180;
	prices[ORE] = 180;
	prices[MERCURY] = 360;
	prices[SULFUR] = 360;
	prices[CRYSTALS] = 360;
	prices[GEMS] = 360;

	prices[ABRASIVE] = 250;
	prices[FERN_FLOWER] = 300;
	prices[FIRE_CRYSTAL] = 1800;
	prices[ICE_CRYSTAL] = 2800;
	prices[METEORITE_SHARD] = 1600;
	prices[MOONSTONE] = 5800;
	prices[TIGER_CLAW] = 1400;
	prices[TOADSTOOL] = 300;
	prices[VIPER_VENOM] = 100;
	prices[WINDFLOWER] = 2900;
	prices[WITCH_BLOOM] = 100;
	
	prices[LEATHER_HAT] = 500;
	prices[LEATHER_HELMET] = 1890;
	prices[WIZARD_CAP] = 4945;
	prices[HAT_OF_KNOWLEDGE] = 5880;
	prices[CHAIN_HELMET] = 4740;
	prices[STEEL_HELMET] = 11365;
	prices[WIZARD_HELMET] = 17475;
	prices[HELMET_OF_COURAGE] = 3600;
	prices[LIGHT_MITHRIL_COIF] = 15760;
	prices[HEAVY_MITHRIL_COIF] = 18910;
	prices[RUBY_HELMET] = 8000;
	prices[WARLOCK_CROWN] = 19600;
	prices[OBSIDIAN_HELMET] = 19600;
	prices[FLAME_HELMET] = 20000;
	prices[FIREBENDER_CROWN] = 20200;
	
	prices[MEDAL_OF_BRAVERY] = 1720;
	prices[AMULET_OF_LUCK] = 2920;
	prices[PENDANT_OF_DESPAIR] = 22180;
	prices[LUCKY_HORSESHOE] = 10200;
	prices[WARRIOR_PENDANT] = 24175;
	prices[LOCKET_OF_CRYSTALIZED_TEARS] = 25180;
	prices[MYSTICAL_AMULET] = 30300;
	prices[PENDANT_OF_WRATH] = 30300;
	prices[SHARD_OF_DARKNESS] = 13120;
	prices[AMULET_OF_FORTUNE] = 13120;
	prices[TRIFORCE_CHARM] = 34000;
	prices[CHARM_OF_CAPTURED_SOULS] = 33000;
	prices[TALISMAN_OF_WARDANCE] = 33000;
	
	prices[LEATHER_ARMOR] = 780;
	prices[LEATHER_HARNESS] = 4080;
	prices[HAUBERK] = 7140;
	prices[STEEL_CUIRASS] = 13850;
	prices[WIZARD_ATTIRE] = 28210;
	prices[LIGHT_MITHRIL_CUIRASS] = 18800;
	prices[MITHRIL_MAIL_ARMOR] = 7430;
	prices[PLATEMAIL] = 27775;
	prices[SORCERER_ROBE] = 28170;
	prices[FULLMITHRIL_ARMOR] = 30000;
	prices[OBSIDIAN_ARMOR] = 13000;
	prices[FIREBENDER_ROBE] = 28300;
	prices[FLAME_PLATE] = 28200;
	
	prices[SHORTBOW] = 1020;
	prices[LONG_BOW] = 19000;
	prices[COMPOSITE_BOW] = 24785;
	prices[BOW_OF_MIDNIGHT_STILL] = 30000;
	prices[SCOUTS_CAPE] = 900;
	prices[CAPE_OF_SPIRITS] = 4075;
	prices[CAPE_OF_WINDS] = 9090;
	prices[MASKROBE] = 6170;
	prices[CAPE_OF_MAGICAL_POWER] = 25460;
	prices[CAPE_OF_ARCANE_PROTECTION] = 13430;
	prices[SORCERER_CAPE] = 26500;
	prices[FIREBENDER_MANTLE] = 29300;
	
	prices[WOODEN_SWORD] = 400;
	prices[LIGHT_AXE] = 1059;
	prices[STEEL_BLADE] = 1587;
	prices[REPRISAL_SWORD] = 3890;
	prices[SWORD_OF_RETRIBUTION] = 7870;
	prices[COMBAT_STAFF] = 9350;
	prices[EQUILIBRIUM_BLADE] = 14640;
	prices[SWORD_OF_MIGHT] = 30570;
	prices[STAFF_OF_POWER] = 43540;
	prices[STAFF_OF_YOUTH] = 8660;
	prices[SWORD_OF_STIFFNESS] = 11540;
	prices[MITHRIL_STAFF] = 49265;
	prices[MITHRIL_LONGSWORD] = 50970;
	prices[STAFF_OF_SHADOWS] = 11350;
	prices[SWORD_OF_COURAGE] = 14580;
	prices[RUBY_QUARTER_STAFF] = 52000;
	prices[RUBY_GLADIUS] = 52000;
	prices[OBSIDIAN_BATON] = 14410;
	prices[OBSIDIAN_SWORD] = 18000;
	prices[FIREBENDER_STAFF] = 53160;
	prices[BLADE_OF_REBIRTH] = 53500;
	
	prices[DAGGER_OF_VENGEANCE] = 2800;
	prices[SCROLL_OF_ENERGY] = 27180;
	prices[ROUND_SHIELD] = 300;
	prices[STEEL_BUCKLER] = 800;
	prices[DEFENDER_SHIELD] = 3500;
	prices[SHIELD_OF_GLORY] = 8680;
	prices[DRAGON_SHIELD] = 27450;
	prices[TOWER_SHIELD] = 29375;
	prices[HAWK_LORD_BULWARK] = 11640;
	prices[OBSIDIAN_SHIELD] = 31000;
	prices[FLAME_SHIELD] = 31000;
	
	prices[LEATHER_JACKBOOTS] = 600;
	prices[LEATHER_BOOTS] = 2780;
	prices[GALOSHES_OF_BATTLE] = 3080;
	prices[SHOES_OF_ASPIRATION] = 7380;
	prices[STEEL_BOOTS] = 18045;
	prices[LIGHT_MITHRIL_BOOTS] = 21460;
	prices[SOLDIER_BOOTS] = 6420;
	prices[HEAVY_MITHRIL_BOOTS] = 23260;
	prices[RUBY_BOOTS] = 9000;
	prices[SORCERER_SANDALS] = 24500;
	prices[OBSIDIAN_BOOTS] = 26000;
	prices[WARLOCK_JACKBOOTS] = 27000;
	prices[FLAME_BOOTS] = 26000;
	
	prices[RING_OF_DEXTERITY] = 500;
	prices[RING_OF_AMBITION] = 1720;
	prices[RING_OF_INSPIRATION] = 4880;
	prices[RING_OF_DOUBTS] = 5885;
	prices[RING_OF_IMPETUOSITY] = 5890;
	prices[RING_OF_ABDICATION] = 20430;
	prices[PROPHET_RING] = 21180;
	prices[RING_OF_THUNDER] = 8580;
	prices[RING_OF_THORNS] = 8580;
	prices[PENUMBRAL_RING] = 25180;
	prices[SIGNET_RING_OF_MIGHT] = 23090;
	prices[SORCERER_SIGNET] = 31500;
	prices[DRAGONS_EYE] = 31200;
	prices[RING_OF_CONTRADICTIONS] = 31500;
	prices[STELLAR_RING] = 33780;
	prices[RING_OF_TORMENT] = 33780;

}

// this function returns the price of the passed artifact
function getArtPrice (passed_art) {
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
		case 'Helmet of courage':
			return prices[HELMET_OF_COURAGE];
		case 'Light mithril coif':			
			return prices[LIGHT_MITHRIL_COIF];
		case 'Heavy mithril coif':			
			return prices[HEAVY_MITHRIL_COIF];
		case 'Ruby helmet':
			return prices[RUBY_HELMET];
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
		case 'Lucky horseshoe':
			return prices[LUCKY_HORSESHOE];
		case 'Warrior pendant':			
			return prices[WARRIOR_PENDANT];
		case 'Locket of crystallized tears':			
			return prices[LOCKET_OF_CRYSTALIZED_TEARS];
		case 'Mystical amulet':			
			return prices[MYSTICAL_AMULET];
		case 'Pendant of wrath':			
			return prices[PENDANT_OF_WRATH];
		case 'Shard of darkness':
			return prices[SHARD_OF_DARKNESS];
		case 'Amulet of fortune':
			return prices[AMULET_OF_FORTUNE];
		case 'Triforce charm':			
			return prices[TRIFORCE_CHARM];
		case 'Charm of captured souls':
			return prices[CHARM_OF_CAPTURED_SOULS];
		case 'Talisman of wardance':
			return prices[TALISMAN_OF_WARDANCE];
			
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
		case 'Mithril mail armour':
			return prices[MITHRIL_MAIL_ARMOR];
		case 'Platemail':			
			return prices[PLATEMAIL];
		case 'Sorcerer robe':			
			return prices[SORCERER_ROBE];
		case 'Fullmithril armor':			
			return prices[FULLMITHRIL_ARMOR];
		case 'Obsidian armour':
			return prices[OBSIDIAN_ARMOR];
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
		case 'Maskrobe':
			return prices[MASKROBE];
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
		case 'Staff of youth':
			return prices[STAFF_OF_YOUTH];
		case 'Sword of stiffness':
			return prices[SWORD_OF_STIFFNESS];
		case 'Mithril staff':			
			return prices[MITHRIL_STAFF];
		case 'Mithril longsword':			
			return prices[MITHRIL_LONGSWORD];
		case 'Staff of shadows':
			return prices[STAFF_OF_SHADOWS];
		case 'Sword of courage':
			return prices [SWORD_OF_COURAGE];
		case 'Ruby quarterstaff':			
			return prices[RUBY_QUARTER_STAFF];
		case 'Ruby gladius':			
			return prices[RUBY_GLADIUS];
		case 'Obsidian baton':
			return prices[OBSIDIAN_BATON];
		case 'Obsidian sword':
			return prices[OBSIDIAN_SWORD];
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
		case 'Shield of glory':
			return prices[SHIELD_OF_GLORY];
		case 'Dragon shield':			
			return prices[DRAGON_SHIELD];
		case 'Tower shield':			
			return prices[TOWER_SHIELD];
		case 'Hawk lord bulwark':
			return prices[HAWK_LORD_BULWARK];
		case 'Obsidian shield':			
			return prices[OBSIDIAN_SHIELD];
		case 'Flame shield':
			return prices[FLAME_SHIELD];
			
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
		case 'Soldier boots':
			return prices[SOLDIER_BOOTS];
		case 'Heavy mithril boots':			
			return prices[HEAVY_MITHRIL_BOOTS];
		case 'Ruby boots':
			return prices[RUBY_BOOTS];
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
		case 'Ring of ambition':
			return prices[RING_OF_AMBITION];
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
		case 'Ring of thunder':
			return prices[RING_OF_THUNDER];
		case 'Ring of thorns':
			return prices[RING_OF_THORNS];
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
		case 'Stellar ring':
			return prices[STELLAR_RING];
		case 'Ring of torment':
			return prices[RING_OF_TORMENT];

		default:
			return 0;
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
