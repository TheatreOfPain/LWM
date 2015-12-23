// ==UserScript==
// @name			LWMMarketWatcher
// @author			TheatreOfPain
// @include			http://www.lordswm.com/auction.php*
// @include			http://www.lordswm.com/group_wars.php*
// ==/UserScript==


const ABRASIVE = 0;
const FERN_FLOWER = 1;
const FIRE_CRYSTAL = 2;
const ICE_CRYSTAL = 3;
const METEORITE_SHARD = 4;
const MOONSTONE = 5;
const TIGER_CLAW = 6;
const TOADSTOOL = 7;
const VIPER_VENOM = 8;
const WINDFLOWER = 9;
const WITCH_BLOOM = 10;

const WOOD = 11;
const ORE = 12;
const MERCURY = 13;
const SULFUR = 14;
const CRYSTALS = 15;
const GEMS = 16;

const THIEF_AMULET = 21;
const THIEF_ARMOR = 22;
const THIEF_BOOTS = 23;
const THIEF_CLOAK = 24;
const THIEF_CROSSBOW = 25;
const THIEF_DAGGER = 26;
const THIEF_MASK = 27;
const THIEF_RING = 28;

const ART = 0;
const ELEMENT = 1;

var td, all_tds;
var tr, all_trs;
var market_price;
var item_name;
var item_count;
var item_seller_name;
var item_seller_id;
var item_type;
var market_art_durability;
var market_max_durability;
var max_durability = new Array();
var min_price = new Array();
var buy_list = new Array();

if (location.href.indexOf("auction.php") != -1) {
	setConstants();
	main();
	setTimeout( function() { window.location.reload(); } , 30000 + Math.floor(Math.random()*270000));
} else if (location.href.indexOf("group_wars.php") != -1) {
	drawMarketReport();	
}

function main() {
	var temp = GM_getValue('Buy List', -1);
	if (temp != -1) {
		buy_list = temp.split(',');
	}
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
			}

			matched = all_trs[i].innerHTML.match(/<\/a><\/b><br><b>(\d+) pcs\.<\/b><\/td>/);
			
			//element + resource
			if (matched != null) {
				not_element = false;
				item_type = ELEMENT;
				item_count = RegExp.$1;
			}
			matched = all_trs[i].innerHTML.match(/Buy now/);
			if ((not_element && not_art) || (matched == null)) {
				continue;
			}
			
			matched = all_trs[i].innerHTML.match(/<\/td><td>(\d{0,}\,{0,}\d{0,}\,{0,}\d{0,})<\/td><\/tr>/);	
			if (matched != null) {
				market_price = RegExp.$1.replace(/,/g,"");
				all_trs[i].innerHTML.match(/<\/a> - (\D*)&nbsp;<b>/);
				item_name = RegExp.$1;
				all_trs[i].innerHTML.match(/pl_info\.php\?id=(\d+)\"\w*><b>(\w*\D*\w*)<\/b><\/a>/);
				item_seller_id = RegExp.$1;
				item_seller_name = RegExp.$2;
				evaluateMarketPrice();
			}
			
			
		}
		
	}
	if (buy_list.length > 0) {
		GM_setValue('Buy List', buy_list.toString());
	}
}

function setConstants () {

	min_price[ABRASIVE] = 250;
	min_price[FERN_FLOWER] = 250;
	min_price[FIRE_CRYSTAL] = 2500;
	min_price[ICE_CRYSTAL] = 3500;
	min_price[METEORITE_SHARD] = 2000;
	min_price[MOONSTONE] = 6500;
	min_price[TIGER_CLAW] = 1400;
	min_price[TOADSTOOL] = 300;
	min_price[VIPER_VENOM] = 85;
	min_price[WINDFLOWER] = 3500;
	min_price[WITCH_BLOOM] = 85;
	
	min_price[WOOD] = 150;
	min_price[ORE] = 150;
	min_price[MERCURY] = 340;
	min_price[SULFUR] = 350;
	min_price[CRYSTALS] = 340;
	min_price[GEMS] = 340;
	
	min_price[THIEF_AMULET] = 56000;
	min_price[THIEF_ARMOR] = 18500;
	min_price[THIEF_BOOTS] = 17000;
	min_price[THIEF_CLOAK] = 44000;
	min_price[THIEF_CROSSBOW] = 19000;
	min_price[THIEF_DAGGER] = 37000;
	min_price[THIEF_MASK] = 13500;
	min_price[THIEF_RING] = 47000;

	max_durability[THIEF_AMULET] = 60;
	max_durability[THIEF_ARMOR] = 60;
	max_durability[THIEF_BOOTS] = 60;
	max_durability[THIEF_CLOAK] = 60;
	max_durability[THIEF_CROSSBOW] = 60;
	max_durability[THIEF_DAGGER] = 60;
	max_durability[THIEF_MASK] = 60;
	max_durability[THIEF_RING] = 60;
	
}

function evaluateMarketPrice () {
	var item_min_price;
	var item_max_durability;
	var item_cateogry;
	var item_link_name;
	var item_link;
	var new_art = false;
	switch (item_name) {
		//elements
		case 'Abrasive':
			item_min_price = min_price[ABRASIVE];
			item_link_name = 'art_type=abrasive';
			item_category = 'elements';
		break;
		case 'Fern flower':
			item_min_price = min_price[FERN_FLOWER];
			item_link_name = 'art_type=fern_flower';
			item_category = 'elements';
		break;
		case 'Fire crystal':
			item_min_price = min_price[FIRE_CRYSTAL];
			item_link_name = 'art_type=fire_crystal';
			item_category = 'elements';
		break;
		case 'Ice crystal':
			item_min_price = min_price[ICE_CRYSTAL];
			item_link_name = 'art_type=ice_crystal';
			item_category = 'elements';
		break;
		case 'Meteorite shard':
			item_min_price = min_price[METEORITE_SHARD];
			item_link_name = 'art_type=meteorit';
			item_category = 'elements';
		break;
		case 'Moonstone':
			item_min_price = min_price[MOONSTONE];
			item_link_name = 'art_type=moon_stone';
			item_category = 'elements';
		break;
		case 'Tiger`s claw':
			item_min_price = min_price[TIGER_CLAW];
			item_link_name = 'art_type=tiger_tusk';
			item_category = 'elements';
		break;
		case 'Toadstool':
			item_min_price = min_price[TOADSTOOL];
			item_link_name = 'art_type=badgrib';
			item_category = 'elements';
		break;
		case 'Viper venom':
			item_min_price = min_price[VIPER_VENOM];
			item_link_name = 'art_type=snake_poison';
			item_category = 'elements';
		break;
		case 'Windflower':
			item_min_price = min_price[WINDFLOWER];
			item_link_name = 'art_type=wind_flower';
			item_category = 'elements';
		break;
		case 'Witch bloom':
			item_min_price = min_price[WITCH_BLOOM];
			item_link_name = 'art_type=witch_flower';
			item_category = 'elements';
		break;
		
		//resources
		case 'Wood':
			item_min_price = min_price[WOOD];
			item_link_name = 'type=1';
			item_category = 'res';
		break;
		case 'Ore':
			item_min_price = min_price[ORE];
			item_link_name = 'type=2';
			item_category = 'res';
		break;
		case 'Mercury':
			item_min_price = min_price[MERCURY];
			item_link_name = 'type=3';
			item_category = 'res';
		break;
		case 'Sulfur':
			item_min_price = min_price[SULFUR];
			item_link_name = 'type=4';
			item_category = 'res';
		break;
		case 'Crystals':
			item_min_price = min_price[CRYSTALS];
			item_link_name = 'type=5';
			item_category = 'res';
		break;
		case 'Gems':
			item_min_price = min_price[GEMS];
			item_link_name = 'type=6';
			item_category = 'res';			
		break;
		
		//thief
		case 'Thief amulet':
			item_min_price = min_price[THIEF_AMULET];
			if (max_durability[THIEF_AMULET] == market_art_durability) { new_art = true;};
			item_link_name = 'art_type=thief_neckl';
			item_category = 'thief';
		break;
		case 'Thief armor':
			item_min_price = min_price[THIEF_ARMOR];
			if (max_durability[THIEF_ARMOR] == market_art_durability) { new_art = true;};
			item_link_name = 'art_type=thief_goodarmor';
			item_category = 'thief';
		break;
		case 'Thief boots':
			item_min_price = min_price[THIEF_BOOTS];
			if (max_durability[THIEF_BOOTS] == market_art_durability) { new_art = true;};
			item_link_name = 'art_type=thief_fastboots';
			item_category = 'thief';
		break;
		case 'Thief cloak':
			item_min_price = min_price[THIEF_CLOAK];
			if (max_durability[THIEF_CLOAK] == market_art_durability) { new_art = true;};
			item_link_name = 'art_type=thief_cape';
			item_category = 'thief';
		break;
		case 'Thief crossbow':
			item_min_price = min_price[THIEF_CROSSBOW];
			if (max_durability[THIEF_CROSSBOW] == market_art_durability) { new_art = true;};
			item_link_name = 'art_type=thief_arb';
			item_category = 'thief';
		break;
		case 'Thief dagger':
			item_min_price = min_price[THIEF_DAGGER];
			if (max_durability[THIEF_DAGGER] == market_art_durability) { new_art = true;};
			item_link_name = 'art_type=thief_ml_dagger';
			item_category = 'thief';
		break;
		case 'Thief mask':
			item_min_price = min_price[THIEF_MASK];
			if (max_durability[THIEF_MASK] == market_art_durability) { new_art = true;};
			item_link_name = 'art_type=thief_msk';
			item_category = 'thief';
		break;
		case 'Thief ring':
			item_min_price = min_price[THIEF_RING];
			if (max_durability[THIEF_RING] == market_art_durability) { new_art = true;};
			item_link_name = 'art_type=ring_of_thief';
			item_category = 'thief';
		break;
			
	}
	
	if ((market_price <= item_min_price) && ((item_type == ELEMENT) || (item_type == ART && new_art))) {
		item_link = '<a href="http://www.lordswm.com/auction.php?cat=' + item_category + '&sort=0&' + item_link_name + '">' + item_name + '</a>';
		var seller_link = '<a href="http://www.lordswm.com/pl_info.php?id=' + item_seller_id + '">' + item_seller_name + '</a>';
		var new_buy_record = '';
		if (item_type == ELEMENT) {
			new_buy_record = item_count + ' of ';
		}
		new_buy_record += item_link + ' for ' + market_price + ' by ' + seller_link;
		newBuyRecord(new_buy_record);
	}
}

function newBuyRecord (new_record) {
	for (var z = 0; z < buy_list.length; z++) {
		if (buy_list[z] == new_record) {
			return;
		}
	}
	buy_list.push(new_record);
}

function drawMarketReport() {
	var temp = GM_getValue('Buy List', -1);
	var search_pos;
	var search_str = '<a href="ecostat.php"><b>Statistics</b></a>';
	var buy_table;
	var el;
	
	if (temp == -1) {
		return;
	}
	buy_list = temp.split(',');
	all_tds = document.getElementsByTagName('center');
	td = all_tds[all_tds.length-2];

	buy_table = '<br><br><table class="wb" width="500" cellpadding="3"><tbody><tr><td class="wb" align="center"><b>Items available for purchase</b></td></tr>';
	for (var i = 0; i < buy_list.length; i++) {
		var z = i % 2;
		if (z == 0) {
			buy_table += '<tr><td class="wblight">' + buy_list[i] + '</td></tr>';
		} else {
			buy_table += '<tr><td class="wbwhite">' + buy_list[i] + '</td></tr>';
		}
	}
	buy_table += '</table>';
	td.innerHTML = td.innerHTML + buy_table;
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', removeMarketReport, false);
	el.setAttribute('value', 'Delete Market Table');
	td.appendChild(el);
	td.appendChild(document.createElement("br"));
	td.appendChild(document.createElement("br"));
	alert('Items available for purchase!');
}	

function removeMarketReport() {
	GM_deleteValue('Buy List');
	window.location.reload();
}