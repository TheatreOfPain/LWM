// ==UserScript==
// @name			LWMDepositoryAnalyzer
// @author			Theatre Of Pain (http://www.lordswm.com/pl_info.php?id=4821925)
// @version			1.0.130710
// @icon			http://dcdn.lordswm.com/hwmicon.ico
// @description		This script analyzes depository logs to help storekeeper and clan leadership pay the correct amounts of gold to owners of artifacts in the depository, in addition to some other helpful related statistical reports
// @include			http://www.lordswm.com/sklad_log.php*
// @grant       	GM_getValue
// @grant       	GM_setValue
// @grant       	GM_log
// ==/UserScript==

var self = 'LWMDepositoryAnalyzer';
var selfVersion = '1.0.130710';
var debug = false;	//turn to true to display debug messages in the error console

function RawDepoRecord(rawDepoRecord) {
	this._rawDepoRecord = rawDepoRecord;
}//**RawCombatRecord

RawDepoRecord.prototype.getTimeStamp = function(){
	// format the timestamp as yymmddhhmm				 
	var timestampPattern = /(\d{2})-(\d{2})-(\d{2})\D{0,}(\d{2}):(\d{2})/;
	this._rawDepoRecord.match(timestampPattern);
	return RegExp.$1 + RegExp.$2 + RegExp.$3 + RegExp.$4 + RegExp.$5;
}//**getTimeStamp

RawDepoRecord.prototype.getPlayerId = function(){
	var matched = this._rawDepoRecord.match(/pl_info\.php\?id=(\d+)/);
	if (matched) return parseInt(RegExp.$1);
	return -1; //not found
}//**getPlayerId

RawDepoRecord.prototype.getPlayerName = function(){
	var boldTagStartPos = this._rawDepoRecord.indexOf("<b>");
	var boldTagEndPos = this._rawDepoRecord.indexOf("</b>", boldTagStartPos + 1);
	if (boldTagStartPos > 0 && boldTagEndPos > 0){
		return this._rawDepoRecord.substring(boldTagStartPos + 3, boldTagEndPos);
	}
	return -1; //not found
}//**getPlayerName

RawDepoRecord.prototype.getArtifactCode = function(){
	var matched = this._rawDepoRecord.match(/<!--(\d+)-->/);
	if (matched) return parseInt(RegExp.$1);
	return -1; //not found
}//**getArtifactCode

RawDepoRecord.prototype.getArtifactName = function(){
	var firstQuotePos = this._rawDepoRecord.indexOf("'");
	var secondQuotePos = this._rawDepoRecord.indexOf("'", firstQuotePos + 1);
	if (firstQuotePos > 0 && secondQuotePos > 0){
		return this._rawDepoRecord.substring(firstQuotePos + 1, secondQuotePos);
	}
	return -1; //not found
}//**getArtifactName

RawDepoRecord.prototype.getArtifactDurability = function(){
	var matched = this._rawDepoRecord.match(/\[(\d+\/\d+)\]/);
	if (matched) return RegExp.$1;
	return -1; //not found
}//**getArtifactDurability

RawDepoRecord.prototype.getTransactionType = function(){
	if (this._rawDepoRecord.indexOf(SearchStrings.deposited) != -1 
		|| this._rawDepoRecord.indexOf(SearchStrings.depositedRU) != -1){
		return DepoTransactionTypes.depositing;
	}
	if (this._rawDepoRecord.indexOf(SearchStrings.withdrew) != -1 
		|| this._rawDepoRecord.indexOf(SearchStrings.withdrewRU) != -1){
		return DepoTransactionTypes.withdrawal;
	}
	if (this._rawDepoRecord.indexOf(SearchStrings.rented) != -1 
		|| this._rawDepoRecord.indexOf(SearchStrings.rentedRU) != -1){
		return DepoTransactionTypes.renting;
	}
	if (this._rawDepoRecord.indexOf(SearchStrings.returned) != -1 
		|| this._rawDepoRecord.indexOf(SearchStrings.returnedRU1) != -1
		|| this._rawDepoRecord.indexOf(SearchStrings.returnedRU2) != -1){
		return DepoTransactionTypes.returning;
	}
	if (this._rawDepoRecord.indexOf(SearchStrings.reservedForClan) != -1 
		|| this._rawDepoRecord.indexOf(SearchStrings.reservedForClanRU) != -1){
		return DepoTransactionTypes.reservation;
	}
	return -1; //unknown
}//**getTransactionType

RawDepoRecord.prototype.getTransactionAmount = function(){
	var expressionString;
	switch(this.getTransactionType()){
		case DepoTransactionTypes.renting:
				if (this._rawDepoRecord.indexOf(SearchStrings.cost) != -1){
					expressionString = new RegExp(SearchStrings.cost + ': (\\d+)\.');
				} else if (this._rawDepoRecord.indexOf(SearchStrings.costRU) != -1) {
					expressionString = new RegExp(SearchStrings.costRU + ': (\\d+)\.');
				} else {
					return 0;
				}
				var matched = this._rawDepoRecord.match(expressionString);
				if (matched) {
					return parseInt(RegExp.$1);
				}
			break;
		case DepoTransactionTypes.returning:
				if (this._rawDepoRecord.indexOf(SearchStrings.goldRefunded) != -1){
					expressionString = new RegExp(SearchStrings.goldRefunded + ': (\\d+)');
				} else if (this._rawDepoRecord.indexOf(SearchStrings.goldRefundedRU) != -1) {
					expressionString = new RegExp(SearchStrings.goldRefundedRU + ': (\\d+)');
				} else {
					return 0;
				}
				var matched = this._rawDepoRecord.match(expressionString);
				if (matched) {
					return -1 * parseInt(RegExp.$1);
				}
			break;
	}
	return 0; //zero amount will not affect calculations
}//**getTransactionAmount

RawDepoRecord.prototype.isArtifactSet = function() {
	if (this._rawDepoRecord.split(',').length > 1) return true; //this is a set
	return false;
};//**isArtifactSet

RawDepoRecord.prototype.getDepoRecord = function() {
	//record structure:
	//<timestamp><transaction_type>%<is_artifact_set?><artifact/set_code>%<player_id>%<transaction_amount>
	var record;
	record = this.getTimeStamp() 
			+ this.getTransactionType();
	if (this.getTransactionType() !== DepoTransactionTypes.reservation) {
		record += Separators.FieldSeparator;
		record += this.isArtifactSet()?'Y':'N';
		record += this.getArtifactCode();
	}
	if (this.getTransactionType() === DepoTransactionTypes.renting
		|| this.getTransactionType() === DepoTransactionTypes.returning) {
		record += Separators.FieldSeparator
				+ this.getPlayerId()
				+ Separators.FieldSeparator
				+ this.getTransactionAmount();
	}
	if (debug) GM_log('DepoRecord = ' + record);
	
	return record;
	
};//**getDepoRecord

RawDepoRecord.prototype.getArtifactRecord = function() {
	//record structure:
	//<artifact_code>%<artifact_name>%<current_durability/max_durability>%art_owner%paid_amount
	var record;
	if (this.getTransactionType() !== DepoTransactionTypes.reservation
		&& !this.isArtifactSet()){
		record = this.getArtifactCode()
				+ Separators.FieldSeparator
				+ this.getArtifactName()
				+ Separators.FieldSeparator
				+ this.getArtifactDurability()
				+ Separators.FieldSeparator
				+ ''//artifact owner unkown, it must be updated manually
				+ Separators.FieldSeparator
				+ '0';//initial balance paid for the artifact owner
	}
	if (debug) GM_log('ArtifactRecord = ' + record);
	return record;
	
};//**getArtifactRecord

RawDepoRecord.prototype.getArtifactSetRecord = function() {
	//artifact set record is composed of multiple artifacts
	//we'll play a trick here to split up the raw record into multiple parts
	//each will have a single artifact, and we'll treat each of these as a raw record

	//record structure:
	//<set_code>%set_owner%paid_amount%<artifact1_name>@<current_durability/max_durability>%<artifact2_name>@<current_durability/max_durability>...
	var record;

	if (this.getTransactionType() !== DepoTransactionTypes.reservation
		&& this.isArtifactSet()){
		record = this.getArtifactCode()
				+ Separators.FieldSeparator
				+ ''//artifact owner unkown, it must be updated manually
				+ Separators.FieldSeparator
				+ '0';//initial balance paid for the artifact owner

		var rawRecordParts = this._rawDepoRecord.split(',');
		for (var i = 0; i < rawRecordParts.length; i++) {
			var tempRecord = new RawDepoRecord(rawRecordParts[i]); 
			if (tempRecord.getTransactionType() !== DepoTransactionTypes.reservation) {
				record += Separators.FieldSeparator
						+ tempRecord.getArtifactName()
						+ Separators.SetSeparator
						+ tempRecord.getArtifactDurability();
			}
		}
	}
	
	if (debug) GM_log('ArtifactSetRecord = ' + record);
	return record;
	
};//**getArtifactSetRecord

RawDepoRecord.prototype.getPlayerRecord = function() {
	//record structure:
	//<player_id>%<player_name>
	var record;
	if (this.getTransactionType() !== DepoTransactionTypes.reservation) {
		record = this.getPlayerId()
				+ Separators.FieldSeparator
				+ this.getPlayerName();
	}
	if (debug) GM_log('PlayerRecord = ' + record);
	return record;
	
};//**getPlayerRecord

function DepoRecord(depoRecord) {
	this._depoRecord = depoRecord;
}//**DepoRecord

DepoRecord.prototype.getTimeStamp = function() {
	return this._depoRecord.substr(0,10);
}//**getTimeStamp

DepoRecord.prototype.getTransactionType = function() {
	return this._depoRecord.substr(10,1);
}//**getTransactionType

DepoRecord.prototype.isArtifactSet = function() {
	var recordSections = this._depoRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 1) {
		if (recordSections[1].substr(0,1) == 'Y') {
			return true;
		} else if (recordSections[1].substr(0,1) == 'N') {
			return false;
		}
	}
	return -1;//no artifact code was found
}//**isArtifactSet

DepoRecord.prototype.getArtifactCode = function() {
	var recordSections = this._depoRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 1) {
		if (recordSections[1].substr(0,1) == 'N') {
			return recordSections[1].substr(1);
		}
	}
	return -1;//no artifact code was found
}//**getArtifactCode

DepoRecord.prototype.getArtifactSetCode = function() {
	var recordSections = this._depoRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 1) {
		if (recordSections[1].substr(0,1) == 'Y') {
			return recordSections[1].substr(1);
		}
	}
	return -1;//no set code was found
}//**getArtifactSetCode

DepoRecord.prototype.getPlayerId = function() {
	var recordSections = this._depoRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 2) {
		return recordSections[2];
	}
	return -1;//no player id was found
}//**getPlayerId

DepoRecord.prototype.getTransactionAmount = function() {
	var recordSections = this._depoRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 3) {
		return recordSections[3];
	}
	return 0;//no impact to calculations
}//**getTransactionAmount

function ArtifactRecord(artifactRecord) {
	this._artifactRecord = artifactRecord;
}//**ArtifactRecord

ArtifactRecord.prototype.getArtifactCode = function() {
	var recordSections = this._artifactRecord.split(Separators.FieldSeparator);
	return recordSections[0];
}//**getArtifactCode

ArtifactRecord.prototype.getArtifactName = function() {
	var recordSections = this._artifactRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 1) {
		return recordSections[1];
	}
	return -1;
}//**getArtifactName

ArtifactRecord.prototype.getDurability = function() {
	var recordSections = this._artifactRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 2) {
		return recordSections[2];
	}
	return -1;
}//**getDurability

ArtifactRecord.prototype.getArtifactOwner = function() {
	var recordSections = this._artifactRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 3) {
		return recordSections[3];
	}
	return -1;
}//**getArtifactOwner

ArtifactRecord.prototype.setArtifactOwner = function(newOwner) {
	var recordSections = this._artifactRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 3) {
		recordSections[3] = newOwner;
		this._artifactRecord = recordSections.toString().replace(/,/g, Separators.FieldSeparator);
		return this._artifactRecord;
	}
	return -1;
}//**setArtifactOwner

ArtifactRecord.prototype.getPaidAmount = function() {
	var recordSections = this._artifactRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 4) {
		return recordSections[4];
	}
	return -1;
}//**getPaidAmount

ArtifactRecord.prototype.setPaidAmount = function(newAmount) {
	var recordSections = this._artifactRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 4) {
		recordSections[4] = newAmount;
		this._artifactRecord = recordSections.toString().replace(/,/g, Separators.FieldSeparator);
		return this._artifactRecord;
	}
	return -1;
}//**setArtifactOwner

function ArtifactSetRecord(artifactSetRecord) {
	this._artifactSetRecord = artifactSetRecord;
}//**ArtifactSetRecord

ArtifactSetRecord.prototype.getArtifactSetCode = function() {
	var recordSections = this._artifactSetRecord.split(Separators.FieldSeparator);
	return recordSections[0];
}//**getArtifactSetCode

ArtifactSetRecord.prototype.getArtifactNames = function() {
	var namesArray = new Array();
	var recordSections = this._artifactSetRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 2) {
		for (var x = 3; x < recordSections.length; x++) {
			namesArray.push(recordSections[x].split(Separators.SetSeparator)[0]);
		}
		return namesArray;
	}
	return -1;
}//**getArtifactNames

ArtifactSetRecord.prototype.getArtifactDurabilities = function() {
	var durabilitiesArray = new Array();
	var recordSections = this._artifactSetRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 2) {
		for (var x = 3; x < recordSections.length; x++) {
			durabilitiesArray.push(recordSections[x].split(Separators.SetSeparator)[1]);
		}
		return durabilitiesArray;
	}
	return -1;
}//**getArtifactDurabilities

ArtifactSetRecord.prototype.getArtifactSetOwner = function() {
	var recordSections = this._artifactSetRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 1) {
		return recordSections[1];
	}
	return -1;
}//**getArtifactSetOwner

ArtifactSetRecord.prototype.setArtifactSetOwner = function(newOwner) {
	var recordSections = this._artifactSetRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 1) {
		recordSections[1] = newOwner;
		this._artifactSetRecord = recordSections.toString().replace(/,/g, Separators.FieldSeparator);
		return this._artifactSetRecord;
	}
	return -1;
}//**setArtifactSetOwner

ArtifactSetRecord.prototype.getPaidAmount = function() {
	var recordSections = this._artifactSetRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 2) {
		return recordSections[2];
	}
	return -1;
}//**getPaidAmount

ArtifactSetRecord.prototype.setPaidAmount = function(newAmount) {
	var recordSections = this._artifactSetRecord.split(Separators.FieldSeparator);
	if (recordSections.length > 2) {
		recordSections[2] = newAmount;
		this._artifactSetRecord = recordSections.toString().replace(/,/g, Separators.FieldSeparator);
		return this._artifactSetRecord;
	}
	return -1;
}//**setPaidAmount

function BalanceRecord(balanceRecord) {
	this._balanceRecord = balanceRecord;
}//**BalanceRecord

BalanceRecord.prototype.isArtifactSet = function() {
	var recordSections = this._artifactSetRecord.split(Separators.FieldSeparator);
	return recordSections[0]=='Y'?true:false;
}//**isArtifactSet

BalanceRecord.prototype.getArtifactCode = function() {
	var recordSections = this._artifactSetRecord.split(Separators.FieldSeparator);
	return recordSections[1];
}//**getArtifactCode

BalanceRecord.prototype.getBalance = function() {
	var recordSections = this._artifactSetRecord.split(Separators.FieldSeparator);
	return parseInt(recordSections[2]);
}//**getBalance

const DepoTransactionTypes = {
	reservation: 'S',	//xxxx-xx-xx xx:xx: Reserved for clan #<clan_id> // <clan_leader>
	depositing: 'D',	//xxxx-xx-xx xx:xx: <player> deposited 'artifact [xxxxx]' [xx/xx].
	withdrawal: 'W',	//xxxx-xx-xx xx:xx: <player> withdrew 'artifact [xxxxx]' [xx/xx].
	renting: 'R',		//xxxx-xx-xx xx:xx: <player> rented 'artifact [xxxxx]' [xx/xx] for x combats until xxxx.xx.xx xx:xx. Cost: $$$.
						//xxxx-xx-xx xx:xx: <player> rented 'artifact1 [xxxxx]' [xx/xx], 'artifact2 [xxxxx]' [xx/xx], 'artifact3 [xxxxx]' [xx/xx] for x combats until xxxx.xx.xx xx:xx. Cost: $$$.
	returning: 'T',		//xxxx-xx-xx xx:xx: <player> returned 'artifact [xxxxx]' [xx/xx] after full use. Depository profit: $$$ gold.
						//xxxx-xx-xx xx:xx: <player> returned 'artifact1 [xxxxx]' [xx/xx], 'artifact2 [xxxxx]' [xx/xx], 'artifact3 [xxxxx]' [xx/xx] after full use. Depository profit: $$$ gold.
						//xxxx-xx-xx xx:xx: <player>: 'artifact [xxxxx]' [xx/xx] returned automatically after full use. Depository profit: $$$ gold.
						//xxxx-xx-xx xx:xx: <player> returned 'artifact [xxxxx]' [xx/xx]. Unused combats: x. Gold refunded: $$$. Depository profit: $$$ gold.
						//xxxx-xx-xx xx:xx: <player>: 'artifact [xxxxx]' [xx/xx] returned automatically after repairing.
	repairing: 'P'
}

const Separators = {
 	FieldSeparator: '%',
 	SetSeparator: '@'
}//**Separators

const SearchStrings = {
	reservedForClan: 'Reserved for clan',
	reservedForClanRU: '\u041F\u043E\u0441\u0442\u0440\u043E\u0435\u043D \u0434\u043B\u044F \u043A\u043B\u0430\u043D\u0430',
	deposited: 'deposited',
	depositedRU: '\u043F\u043E\u043C\u0435\u0441\u0442\u0438\u043B',
	withdrew: 'withdrew',
	withdrewRU: '\u0437\u0430\u0431\u0440\u0430\u043B',
	rented: 'rented',
	rentedRU: '\u0430\u0440\u0435\u043D\u0434\u043E\u0432\u0430\u043B',
	returned: 'returned',
	returnedRU1: '\u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u043E',
	returnedRU2: '\u0432\u0435\u0440\u043D\u0443\u043B',
	cost: 'Cost',
	costRU: '\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C',
	goldRefunded: 'Gold refunded',
	goldRefundedRU: '\u0412\u043E\u0437\u0432\u0440\u0430\u0442 \u0437\u043E\u043B\u043E\u0442\u0430' 
}



var clanID;							//identifier of the clan
var depoID;							//identifier of the depo
var clanName;						//name of the clan
var artifacts = new Array();		//list of depo artifacts
var artifactSets = new Array();		//list of artifact sets
var players = new Array();			//list of players involved in depo transactions
var artifactOwners = new Array();	//list of artifact owners
var depoRecords = new Array();		//depo transaction records
var balances = new Array();			//artifact balances
var balanceSummary = new Array();	//used to display results of art balances

var div;//panel div

//range of data collected
var update_from;
var update_to;

//save keys
var depo_key;
var depo_records_key;
var art_records_key;
var set_records_key;
var player_records_key;
var update_from_key;
var update_to_key;

main();

function main(){
	var allAnchors = document.getElementsByTagName('a');
	
	for (var i = 0; i < allAnchors.length; i++) {
		if (allAnchors[i].href.match(/clan_info\.php\?id=(\d+)/)){
			clanID = RegExp.$1;
			clanName = allAnchors[i].innerHTML.replace(/<b>/g,'').replace(/<\/b>/g,'');
		}
		if (allAnchors[i].href.match(/sklad_info\.php\?id=(\d+)/)){
			depoID = RegExp.$1;
		}
	}
	
	if (debug) {GM_log('Clan ID = ' + clanID + '\nDepo ID = ' + depoID)}
	
	setKeys(clanID, depoID);
	getData();

	if (!depoRecords || depoRecords.length == 0) {
		displayPanel(getDefaultPanel());
	} else {
		displayPanel(getProcessingPanel());
		parseLog();
	}
}

function parseLog(){
	var allTDs = document.getElementsByTagName('td');
	var depoTD;
		
	for (var i = 0; i < allTDs.length; i++) {
		if (allTDs[i].innerHTML.indexOf('sklad_info.php') != -1 && allTDs[i].innerHTML.indexOf('clan_info.php') != -1){
			depoTD = allTDs[i];
		}
	}
	
	var cleanedDepoLog = depoTD.innerHTML.substring(depoTD.innerHTML.indexOf('&nbsp;')).replace(/&nbsp;/g,'').slice(0,-5);
	var rawDepoRecords = cleanedDepoLog.split('<br>');

	for (var z = 0; z < rawDepoRecords.length; z++) {
		addNewRecord(new RawDepoRecord(rawDepoRecords[z]));
	}
	saveData();
}

function displayPanel(panel){
	var allCenters = document.body.getElementsByTagName('center');
	var center;
	for (var i = 0; i < allCenters.length; i++) {
		if (allCenters[i].innerHTML.indexOf('Depository') != -1) {
			center = allCenters[i];
		}
	}
	center.parentNode.insertBefore(panel, center.nextSibling);
	center.parentNode.insertBefore(document.createElement('br'), center.nextSibling);
}

function getDefaultPanel(){
	var tbl = document.createElement('table');
	tbl.className = 'wblight';
	tbl.cellPadding = '10';
	tbl.align = 'center';
	tbl.width = 500;
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.align = 'center';
	var collectButton = document.createElement('input');
	collectButton.type = 'button';
	collectButton.id = 'collectButton';
	collectButton.addEventListener('click', collectData, false);
	collectButton.setAttribute('value', 'Collect data for this depository');
	td.appendChild(collectButton);
	tr.appendChild(td);
	tbl.appendChild(tr);
	return tbl;
}

function getProcessingPanel(){
	var tbl = document.createElement('table');
	tbl.className = 'wblight';
	tbl.cellPadding = '10';
	tbl.align = 'center';
	tbl.width = 500;
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	var el = document.createTextNode('Collected data: ' 
									+ getFormattedTimeStamp(update_from) 
									+ '  -  ' + getFormattedTimeStamp(update_to));
	td.align = 'center';
	td.appendChild(el);
	tr.appendChild(td);

	td = document.createElement('td');
	td.align = 'right';
	var deleteButton = document.createElement('input');
	deleteButton.type = 'button';
	deleteButton.id = 'deleteButton';
	deleteButton.addEventListener('click', deleteData, false);
	deleteButton.setAttribute('value', 'Delete');
	td.appendChild(deleteButton);

	tr.appendChild(td);
	tbl.appendChild(tr);

	tr = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = "2";
	var processButton = document.createElement('input');
	processButton.type = 'button';
	processButton.id = 'processButton';
	processButton.addEventListener('click', processData, false);
	processButton.setAttribute('value', 'Process');
	td.align = 'right';
	td.appendChild(processButton);
	tr.appendChild(td);
	tbl.appendChild(tr);
	return tbl;
}

function collectData(){
	parseLog();
	window.location.reload();
}

function processData(){
	depoRecords.sort();
	var recordCount = depoRecords.length;
	for (var i = 0; i < recordCount; i++){
		var depoRecord = new DepoRecord(depoRecords[i]);
		var artCode;//will serve as art set code if the transaction is for a set
		if (depoRecord.isArtifactSet() == -1) continue;
		artCode = depoRecord.isArtifactSet()?depoRecord.getArtifactSetCode():depoRecord.getArtifactCode();
		updateBalanceForArt(depoRecord.isArtifactSet(), artCode, depoRecord.getTransactionAmount());
	}

	//balance summary will be as follows:
	//owner - artifact/set - balance - paid - repair - net amount

	for (var i = 0; i < balances.length; i++) {
		var summaryRecord;
		var balanceRecord = new BalanceRecord(balances[i]);
		var artifactRecord = new ArtifactRecord(getRecord(artifacts, balanceRecord.getArtifactCode()));
	}


	var disp = '';
	for (var i = 0; i < artifacts.length; i++) {
		var artifactRecord = new ArtifactRecord(artifacts[i]);
		var balanceRec = getRecord(balances, artifactRecord.getArtifactCode());
		disp += '\n' + artifactRecord.getArtifactCode()
				+ '\t'
				+ artifactRecord.getArtifactName() 
				+ '\t'
				+ artifactRecord.getDurability() 
				+ '\t'
				+ balanceRec.split(Separators.FieldSeparator)[1];
	}
	GM_log(disp);
}

function updateBalanceForArt(isSet, artCode, amount){
	if (!artCode) return;
	for (var z = 0; z < balances.length; z++) {
		if (balances[z].split(Separators.FieldSeparator)[1] == artCode) {
			balances[z] = balances[z].split(Separators.FieldSeparator)[1] 
						+ Separators.FieldSeparator 
						+ (parseInt(balances[z].split(Separators.FieldSeparator)[2]) + parseInt(amount));
			return;
		}
	}
	//not found, this is a new record
	balances.push(isSet + Separators.FieldSeparator + artCode + Separators.FieldSeparator + amount);
}

function setKeys(pClanID, pDepoID) {
	depo_key = self + ' ' + pDepoID + ' clan';
	depo_records_key = self + ' ' + pDepoID + ' depo records';
	art_records_key = self + ' ' + pDepoID + ' art records';
	set_records_key = self + ' ' + pDepoID + ' set records';
	player_records_key = self + ' ' + pDepoID + ' player records';
	update_from_key = self + ' ' + pDepoID + ' timestamp from';
	update_to_key = self + ' ' + pDepoID + ' timestamp to';
}

function deleteData(){
	var response = confirm('You are about to delete all collected data. Press OK to confirm.');
	if (!response) return;
	
	if (supportsHTML5Storage()) {
		try{
			localStorage.removeItem(depo_key);
			localStorage.removeItem(depo_records_key);
			localStorage.removeItem(art_records_key);
			localStorage.removeItem(set_records_key);
			localStorage.removeItem(player_records_key);
			localStorage.removeItem(update_from_key);
			localStorage.removeItem(update_to_key);
		} catch(err) {
			alert(self + ':\nAn error has occurred. Could not delete your data.');
		}
	} else {	
		GM_deleteValue(depo_key);
		GM_deleteValue(clan_key);
		GM_deleteValue(depo_records_key);
		GM_deleteValue(art_records_key);
		GM_deleteValue(set_records_key);
		GM_deleteValue(player_records_key);
		GM_deleteValue(update_from_key);
		GM_deleteValue(update_to_key);
	}
	window.location.reload();
}

function saveData() {
	artifacts.sort();
	artifactSets.sort();
	players.sort();
	depoRecords.sort();
	var last_index = depoRecords.length - 1;
	update_from = depoRecords[0].substr(0,10);
	update_to = depoRecords[last_index].substr(0,10);
	if (supportsHTML5Storage()) {
		try{
			localStorage[depo_key] = clanName;
			localStorage[depo_records_key] = depoRecords;
			localStorage[art_records_key] = artifacts;
			localStorage[set_records_key] = artifactSets;
			localStorage[player_records_key] = players;
			localStorage[update_from_key] = update_from;
			localStorage[update_to_key] = update_to;
		} catch(err) {
			alert(self + ':\nUnable to save data!\nYou might be running out of local storage on your browser.\nPlease contact Theatre Of Pain for advice.');
		}
	} else {	
		GM_setValue(depo_key, pDepoID);
		GM_setValue(clan_key, pClanID);
		GM_setValue(depo_records_key, depoRecords);
		GM_setValue(art_records_key, artifacts);
		GM_setValue(set_records_key, artifactSets);
		GM_setValue(player_records_key, players);
		GM_setValue(update_from_key, update_from);
		GM_setValue(update_to_key, update_to);
	}
}

function getData() {
	if (supportsHTML5Storage()) {
		if (localStorage[depo_records_key] != undefined) depoRecords = localStorage[depo_records_key].split(',');
		if (localStorage[art_records_key] != undefined) artifacts = localStorage[art_records_key].split(',');
		if (localStorage[set_records_key] != undefined) artifactSets = localStorage[set_records_key].split(',');
		if (localStorage[player_records_key] != undefined) players = localStorage[player_records_key].split(',');
		update_from = (localStorage[update_from_key] == undefined)?9999999999:localStorage[update_from_key];
		update_to = (localStorage[update_to_key] == undefined)?0:localStorage[update_to_key];
	} else {
		depoRecords = GM_getValue(depo_records_key, new Array());
		artifacts = GM_getValue(art_records_key, new Array());
		artifactSets = GM_getValue(set_records_key, new Array());
		players = GM_getValue(player_records_key, new Array());
		update_from = GM_getValue(update_from_key, 9999999999);
		update_to = GM_getValue(update_to_key, 0);
	}
}

function addNewRecord(rawRecord){
		addDepoRecord(rawRecord.getDepoRecord());
		addArtifactRecord(rawRecord.getArtifactRecord());
		addArtifactSetRecord(rawRecord.getArtifactSetRecord());
		addPlayerRecord(rawRecord.getPlayerRecord());
}

function addDepoRecord(newDepoRecord){
	if (!newDepoRecord) return;
	for (var z = 0; z < depoRecords.length; z++) {
		if (depoRecords[z] == newDepoRecord) return;
	}
	depoRecords.push(newDepoRecord);
}

function addArtifactRecord(newArtifactRecord){
	if (!newArtifactRecord) return;
	for (var z = 0; z < artifacts.length; z++) {
		if (artifacts[z].split(Separators.FieldSeparator)[0] == newArtifactRecord.split(Separators.FieldSeparator)[0]) {
			//we need to update the artifact record only when durability becomes less
			var currentDurability = artifacts[z].split(Separators.FieldSeparator)[2];
			var newDurability = newArtifactRecord.split(Separators.FieldSeparator)[2];
			if ((newDurability.split('/')[1] < currentDurability.split('/')[1])
				|| (newDurability.split('/')[1] == currentDurability.split('/')[1]
				&& newDurability.split('/')[0] < currentDurability.split('/')[0])){
				artifacts[z] = newArtifactRecord;
			}
			return;
		}
	}
	artifacts.push(newArtifactRecord);					
}

function getRecord(array, code){
	for (var z = 0; z < array.length; z++) {
		if (array[z].split(Separators.FieldSeparator)[0] == code) {
			return array[z];
		}
	}
	return -1;
}

function updateRecord(array, updatedRecord){
	for (var z = 0; z < array.length; z++) {
		if (array[z].split(Separators.FieldSeparator)[0] == updatedRecord.split(Separators.FieldSeparator)[0]) {
			array[z] = updatedRecord;
		}
	}
}

function addArtifactSetRecord(newArtifactSetRecord){
	if (!newArtifactSetRecord) return;
	for (var z = 0; z < artifactSets.length; z++) {
		if (artifactSets[z].split(Separators.FieldSeparator)[0] == newArtifactSetRecord.split(Separators.FieldSeparator)[0]) {
			//we need to update the artifact set record only when durability becomes less
			var currentDurability = artifactSets[z].split(Separators.FieldSeparator)[1].split(Separators.SetSeparator)[1];
			var newDurability = newArtifactRecord.split(Separators.FieldSeparator)[1].split(Separators.SetSeparator)[1];
			if ((newDurability.split('/')[1] < currentDurability.split('/')[1])
				|| (newDurability.split('/')[1] == currentDurability.split('/')[1]
				&& newDurability.split('/')[0] < currentDurability.split('/')[0])){
				artifactSets[z] = newArtifactSetRecord;
			}
			return;
		}
	}
	artifactSets.push(newArtifactSetRecord);					
}

function addPlayerRecord(newPlayerRecord){
	if (!newPlayerRecord) return;
	for (var z = 0; z < players.length; z++) {
		if (players[z].split(Separators.FieldSeparator)[0] == newPlayerRecord.split(Separators.FieldSeparator)[0]) {
			if (players[z] != newPlayerRecord) {	
				players[z] = newPlayerRecord;
			}
			return;
		}
	}
	players.push(newPlayerRecord);
}

function supportsHTML5Storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		if (debug) GM_log('HTML5 Storage is not supported');
		return false;
	}
}

function getFormattedTimeStamp(unformattedTimeStamp){
	return '20' + unformattedTimeStamp.substr(0,2) 
				+ '-' + unformattedTimeStamp.substr(2,2) 
				+ '-' + unformattedTimeStamp.substr(4,2) 
				+ ' ' + unformattedTimeStamp.substr(6,2) 
				+ ':' + unformattedTimeStamp.substr(8,2);
}