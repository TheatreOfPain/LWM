// ==UserScript==
// @name			LWMCombatStats
// @author			Theatre Of Pain (http://www.lordswm.com/pl_info.php?id=4821925)
// @version			3.0.131217
// @icon			http://dcdn.lordswm.com/hwmicon.ico
// @description		This script provides complete combat stats about any profile you choose to collect stats for
// @include			http://www.lordswm.com/pl_warlog.php*
// @include			http://www.lordswm.com/pl_info.php*
// @grant       	GM_getValue
// @grant       	GM_setValue
// @grant       	GM_log
// ==/UserScript==

var self = 'LWMCombatStats';
var selfVersion = '3.0.131217';
var debug = false;	//turn to true to display debug messages in the error console
var auto_parsing_interval = 1; //number of seconds between opening different pages during auto parsing of log pages

function RawCombatRecord(playerId, rawCombatRecord) {
	this._rawCombatRecord = rawCombatRecord;
	this._playerId = playerId;
}//**RawCombatRecord

RawCombatRecord.prototype.getVSCount = function() {
	if (this._rawCombatRecord.indexOf(SearchStrings.vs) != -1) {
		return this._rawCombatRecord.split(SearchStrings.vs).length - 1;
	}
	return 0;		
};//**getVSCount

RawCombatRecord.prototype.getCommaCount = function() {
	if (this._rawCombatRecord.indexOf(SearchStrings.comma) != -1) {
		return this._rawCombatRecord.split(SearchStrings.comma).length - 1;
	}
	return 0;		
};//**getCommaCount

RawCombatRecord.prototype.getPlayerIndex = function() {
	return this._rawCombatRecord.indexOf(SearchStrings.plInfo + this._playerId);
};//**getPlayerIndex

RawCombatRecord.prototype.getCommaIndex = function() {
	return this._rawCombatRecord.indexOf(SearchStrings.comma);
};//**getCommaIndex

RawCombatRecord.prototype.getVSIndex = function() {
	return this._rawCombatRecord.indexOf(SearchStrings.vs);
};//**getVSIndex

RawCombatRecord.prototype.getTimeStamp = function(){
	// format the timestamp as yymmddhhmm				 
	var timestamp_pattern = /(\d{2})-(\d{2})-(\d{2})\D{0,}(\d{2}):(\d{2})/;
	this._rawCombatRecord.match(timestamp_pattern);
	return RegExp.$1 + RegExp.$2 + RegExp.$3 + RegExp.$4 + RegExp.$5;
};//**getTimeStamp

RawCombatRecord.prototype.getCommentedCombatCode = function(){
	var matched = this._rawCombatRecord.match(/<!--(\d+)-->/);
	if (matched) return parseInt(RegExp.$1);
	return -1; //unknown
}//**getCommentedCombatCode

RawCombatRecord.prototype.getCombatType = function(){
	if(this.getVSCount() > 1){					//everyone for oneself
		if (this.getCommentedCombatCode() == 25) 
			return CombatTypes.X3.code;			//blindfold tournament
		return CombatTypes.XE.code;				//everyone for oneself
	} else if(this._rawCombatRecord.search(/\(\d+\)/) != -1){	//hunt
		if (this.getCommaCount() == 0) {						//solo hunt
			return CombatTypes.HS.code;
		} else if (this.getCommaCount() == 1) {					//assisted hunt
			if (this.getPlayerIndex() > this.getCommaIndex()){
				return CombatTypes.HA.code;						//you assisted
			} else {
				return CombatTypes.HT.code;						//you were assisted
			}
		} else if (this.getCommaCount() == 2) {					//dual hunt
			return CombatTypes.HD.code;
		}
		return CombatTypes.XX.code; //not a hunt mission!
	} else if(this._rawCombatRecord.search(/\{\d+\}/) != -1 ){	// mercenary
		switch(this.getCommentedCombatCode()){
			case 5:		return CombatTypes.MI.code;	//Invaders
			case 7:		return CombatTypes.MM.code;	//Monsters
			case 8:		return CombatTypes.MR.code;	//Raids
			case 10:	return CombatTypes.MV.code;	//Vanguards
			case 12:	return CombatTypes.MA.code;	//Armies
			case 28:	return CombatTypes.MC.code; //Conspirators
			case 6:case 29:	
						return CombatTypes.MB.code;	//Brigands
			default:	return CombatTypes.XX.code; //not a mercenary mission!
		}
	} else if(this._rawCombatRecord.search(/\u2022/) != -1 ){	//thief
		if (this.getCommaCount() > 0){
			if (this.getCommaCount() == 2) {						//group ambush
				return CombatTypes.TR.code;
			} else if (this.getCommaCount() == 1) {					//duel ambush
				if (this.getPlayerIndex() < this.getVSIndex()) {	
					return CombatTypes.TD.code;						//you ambushed a duel
				} else {
					return CombatTypes.TU.code;						//you were ambushed in a duel
				}
			}
		} else if (this._rawCombatRecord.indexOf(SearchStrings.caravan) != -1
					||this._rawCombatRecord.indexOf(SearchStrings.caravanRU) != -1) {
			return CombatTypes.TV.code;							//you ambushed a caravan
		} else {
			if (this.getPlayerIndex() < this.getVSIndex()) {
				return CombatTypes.TG.code;						//you ambushed a player
			} else {
				return CombatTypes.TP.code;						//you were ambushed by a player
			}
		}
	} else {
		switch(this.getCommentedCombatCode()) {
			case 14:	return CombatTypes.X2.code;						//Minor tournament		
			case 15:	return CombatTypes.XG.code;						//Dragon Guards		
			case 18:	return CombatTypes.X1.code;						//Throne battles		
			case 20:case 45:
						return CombatTypes.XA.code;						//Survival Tournament
			case 22:	return CombatTypes.EL.code;						//Elementals
			case 23:	return CombatTypes.EW.code;						//Dwarves		
			case 30:	return CombatTypes.EF.code;						//Inhabitants of the tunnel
			case 32:	return CombatTypes.EA.code;						//Monsters of the sea
			case 35:case 36:case 38:
						return CombatTypes.EK.code;						//Kingdom
			case 37:	return CombatTypes.X5.code;						//Mixed tournament
			case 39:	return CombatTypes.C0.code;						//Commander - the trial
			case 40:
				switch(this.getCommaCount()){
					case 0: return CombatTypes.C1.code;					//commander - duels
					case 2: return CombatTypes.C2.code;					//commander - group 2x2
					case 4: return CombatTypes.C3.code;					//commander - group 3x3
				}
			case 41:case 42:case 43:case 79:
						return CombatTypes.EU.code;						//Unholy venomancers, Undead
			case 33:case 44:
						return CombatTypes.EH.code;						//Dreadful nightmares
			case 46:case 47:case 48:case 49:
						return CombatTypes.ED.code;						//Gate demons, Infernals, Pandemonium leader, Demon Portal guard
			case 50:	return CombatTypes.XC.code;						//Contest Participants		
			case 51:	return CombatTypes.EV.code;						//Valentine's Card thieves
			case 53:case 54:case 55:
						return CombatTypes.ER.code;						//Saboteur destructors, Rebel camp defenders, Rebel ringleader
			case 56:	return CombatTypes.EP.code;						//Packmaster
			case 57:case 58:
						return CombatTypes.EB.code;						//Steppe barbarians
			case 60:	return CombatTypes.X0.code;						//Paired tournament
			case 61:	
						var opponent = this.getOpponents()[0].substring(0,1);
						if (opponent == Separators.AIIndicator)
							return CombatTypes.RA.code;					//ranger - AI
						return CombatTypes.RH.code;						//ranger - human
			case 63:	return CombatTypes.RA.code;						//ranger - AI
			case 62:case 64:case 65:
						return CombatTypes.EN.code;						//Knights of the Sun
			case 67:	return CombatTypes.ET.code;						//Recalcitrant tribes
			case 68:	return CombatTypes.XQ.code;						//Quick tournaments
			
			case 69:case 71:case 72:	
						return CombatTypes.EI.code;						//Trilateral war
			case 74:	return CombatTypes.ES.code;						//Sentinels of the Past
			case 77:	return CombatTypes.EM.code;						//Xmas tree
			case 80:	return CombatTypes.EJ.code;						//Survilurgs defense
			case 81:	return CombatTypes.EG.code;						//Survilurgs attack
			case 83:case 84:
						return CombatTypes.EX.code;						//Savage barbarians
		}
	}
	//in quick 4x4 there are 3 allies and 4 opponents
	if (this.getOpponents().split(Separators.AllySeparator).length == 4 
		&& this.getAllies().split(Separators.AllySeparator).length == 3)
		return CombatTypes.X4.code;						//quick 4x4

	return CombatTypes.XX.code;
};//**getCombatType

RawCombatRecord.prototype.getCombatResult = function() {
	var combatResult = 0;	//loss

	var players = this._rawCombatRecord.split(SearchStrings.vs);
	for (var i = 0; i < players.length; i++) {
		if ((players[i].indexOf(SearchStrings.plInfo + this._playerId) != -1) 
			&& (players[i].replace(SearchStrings.commanderTag, '').indexOf('<b>') != -1)) {
			//make sure we're excluding the commander data type bold tag
				combatResult = 1;	//win
				break;
		}
	}

	return combatResult;
}//**getCombatResult

RawCombatRecord.prototype.getPlayerLevel = function() {
	var re = new RegExp(SearchStrings.vs, 'g');
	var players = this._rawCombatRecord.replace(re,',').split(',');
	for (var i = 0; i < players.length; i++) {
		if (players[i].indexOf(SearchStrings.plInfo + this._playerId) != -1){
				var leftBracketPos = players[i].indexOf('[');
				var rightBracketPos = players[i].indexOf(']');
				var playerLevel = parseInt(players[i].substring(leftBracketPos + 1, rightBracketPos));
				return getEncodedPlayerLevel(playerLevel);
		}
	}
	return -1;
}//**getPlayerLevel

RawCombatRecord.prototype.getWarId = function() {
	this._rawCombatRecord.match(/warid=(\d+)/);
	return RegExp.$1;
}//**getWarId

RawCombatRecord.prototype.getAllies = function() {
	if (this.getVSCount() > 1) return ''; //everyone for oneself would have no allies
	var allies = ''
	var playerGroup = this._rawCombatRecord.split(SearchStrings.vs);
	var index = (playerGroup[0].indexOf(SearchStrings.plInfo + this._playerId) != -1)?0:1;
	var players = playerGroup[index].split(',');
	for	(var i = 0; i < players.length; i++) {
		//extract allies while excluding the player
		if (players[i].indexOf(SearchStrings.plInfo + this._playerId) == -1) {
			if (players[i].indexOf(SearchStrings.plInfo) != -1) {
				var plInfoPos = players[i].indexOf(SearchStrings.plInfo);
				var firstCharPos = players[i].indexOf('>', plInfoPos);
				var secondCharPos = players[i].indexOf('<', plInfoPos);
				allies += Separators.HumanIndicator
					+ players[i].substring(firstCharPos + 1, secondCharPos)
					+ Separators.AllySeparator;
			} else {
				var iTagStartPos = players[i].indexOf('<i>');
				var iTagEndPos = players[i].indexOf('</i>');
				allies += Separators.AIIndicator
					+ players[i].substring(iTagStartPos, iTagEndPos).replace('<i>', '').replace('<b>', '').replace('</b>', '')
					+ Separators.AllySeparator;
			}
		}
	}
	return allies.substring(0, allies.length - 1);
}//**getAllies

RawCombatRecord.prototype.getOpponents = function() {
	var opponents = '';
	var players;

	if (this.getVSCount() > 1) {	//everyone for oneself would have all opponents
		players = this._rawCombatRecord.split(SearchStrings.vs);
	} else {
		//reduce opponent names.
		//this is important to shorten the combat record by eliminating information that can be regenerated
		var reducedRawCombatRecord;
		switch(this.getCommentedCombatCode()){
			case 5:		reducedRawCombatRecord = this._rawCombatRecord.replace(SearchStrings.invaders, '');	//Invaders
						reducedRawCombatRecord = reducedRawCombatRecord.replace(SearchStrings.invadersRU, '');
						reducedRawCombatRecord = this.convertRussianOpponentsToEnglish(reducedRawCombatRecord);
						break;
			case 7:		reducedRawCombatRecord = this._rawCombatRecord.replace(SearchStrings.monster, '');	//Monsters
						reducedRawCombatRecord = reducedRawCombatRecord.replace(SearchStrings.monsterRU, '');
						reducedRawCombatRecord = this.convertRussianOpponentsToEnglish(reducedRawCombatRecord);
						break;
			case 8:		reducedRawCombatRecord = this._rawCombatRecord.replace(SearchStrings.raid, '');		//Raids
						reducedRawCombatRecord = reducedRawCombatRecord.replace(SearchStrings.raidRU, '');
						reducedRawCombatRecord = this.convertRussianOpponentsToEnglish(reducedRawCombatRecord);
						break;
			case 10:	reducedRawCombatRecord = this._rawCombatRecord.replace(SearchStrings.vanguard, '');//Vanguards
						reducedRawCombatRecord = reducedRawCombatRecord.replace(SearchStrings.vanguardRU, '');
						reducedRawCombatRecord = this.convertRussianOpponentsToEnglish(reducedRawCombatRecord);
						break;
			case 12:	reducedRawCombatRecord = this._rawCombatRecord.replace(SearchStrings.army, '');		//Armies
						reducedRawCombatRecord = reducedRawCombatRecord.replace(SearchStrings.armyRU, '');
						reducedRawCombatRecord = this.convertRussianOpponentsToEnglish(reducedRawCombatRecord);
						break;
			case 28:	reducedRawCombatRecord = this._rawCombatRecord.replace(SearchStrings.conspirators, '');//Conspirators
						reducedRawCombatRecord = reducedRawCombatRecord.replace(SearchStrings.conspiratorsRU, '');
						reducedRawCombatRecord = reducedRawCombatRecord.substring(0, this.getVSIndex)
							+ reducedRawCombatRecord.substring(this.getVSIndex).replace(/,/g, '+');
						reducedRawCombatRecord = this.convertRussianOpponentsToEnglish(reducedRawCombatRecord);
						break;
			case 6:case 29:
						reducedRawCombatRecord = this._rawCombatRecord.replace(SearchStrings.brigands, '');	//Brigands
						reducedRawCombatRecord = reducedRawCombatRecord.replace(SearchStrings.brigandsRU, '');
						reducedRawCombatRecord = this.convertRussianOpponentsToEnglish(reducedRawCombatRecord);
						break;
			case 50:	reducedRawCombatRecord = this._rawCombatRecord.replace(SearchStrings.contestParticipant, '');//Contest Participants
						reducedRawCombatRecord = reducedRawCombatRecord.replace(SearchStrings.contestParticipantRU, '');
						reducedRawCombatRecord = this.convertRussianOpponentsToEnglish(reducedRawCombatRecord);
						break;
			default:	
						if (this._rawCombatRecord.indexOf(SearchStrings.caravan) != -1
							|| this._rawCombatRecord.indexOf(SearchStrings.caravanRU) != -1) {	//Caravans
							reducedRawCombatRecord = this._rawCombatRecord.replace(SearchStrings.caravan, '').replace(SearchStrings.caravan, '');
							reducedRawCombatRecord = reducedRawCombatRecord.replace(SearchStrings.caravanRU, '').replace(SearchStrings.caravanRU, '');
							reducedRawCombatRecord = this.convertRussianOpponentsToEnglish(reducedRawCombatRecord);
						} else if (this._rawCombatRecord.indexOf(SearchStrings.thief) != -1
								||this._rawCombatRecord.indexOf(SearchStrings.thiefRU) != -1) {	//Ranger
							reducedRawCombatRecord = this._rawCombatRecord.replace(SearchStrings.thiefRU, '');
							reducedRawCombatRecord = reducedRawCombatRecord.replace(SearchStrings.thiefRU, '');
							reducedRawCombatRecord = this.convertRussianOpponentsToEnglish(reducedRawCombatRecord);
						} else {
							reducedRawCombatRecord = this._rawCombatRecord;
						}
		}

		var opponentsGroup = reducedRawCombatRecord.split(SearchStrings.vs);
		var index = (opponentsGroup[0].indexOf(SearchStrings.plInfo + this._playerId) != -1)?1:0;
		players = opponentsGroup[index].split(',');
	}
	
	for	(var i = 0; i < players.length; i++) {
		//extract opponents while excluding the player
		if (players[i].indexOf(SearchStrings.plInfo + this._playerId) == -1) {
			if (players[i].indexOf(SearchStrings.plInfo) != -1) {
				var plInfoPos = players[i].indexOf(SearchStrings.plInfo);
				var firstCharPos = players[i].indexOf('>', plInfoPos);
				var secondCharPos = players[i].indexOf('<', plInfoPos);
				opponents += Separators.HumanIndicator
					+ players[i].substring(firstCharPos + 1, secondCharPos)
					+ Separators.AllySeparator;
			} else {
				//if not found make the index -3 so it totals to zero when extracted
				var firstCharPos = (players[i].indexOf('<i>') == -1)?-3:players[i].indexOf('<i>');
				var secondCharPos = (players[i].indexOf('</i', firstCharPos) == -1)?players[i].length:players[i].indexOf('</i', firstCharPos);
				opponents += Separators.AIIndicator
					+ players[i].substring(firstCharPos + 3, secondCharPos).replace(/<b>/g, '').replace(/<\/b>/g, '')
					+ Separators.AllySeparator;
			}
		}
	}
	return opponents.substring(0, opponents.length - 1);
}//**getOpponents

RawCombatRecord.prototype.getAdditionalCombatInfo = function() {
	var additionalInfo = '';
	switch(this.getCommentedCombatCode()){
		case 68:		//quick tournaments
			var tournamentHistoryString = SearchStrings.quickTourHist;
			var tournamentId = '';
			var matched = this._rawCombatRecord.match(/fast_tour_hist\.php\?id=(\d+)/);
			if (matched) {
				tournamentId = RegExp.$1;
				var tournamentIdIndex = this._rawCombatRecord.indexOf(tournamentHistoryString);
				var tournamentLabelIndexStart = this._rawCombatRecord.indexOf('>', tournamentIdIndex);
				var tournamentLabelIndexEnd = this._rawCombatRecord.indexOf('<', tournamentLabelIndexStart);
				var tournamentLabel = this._rawCombatRecord.substring(tournamentLabelIndexStart + 1, tournamentLabelIndexEnd);

				switch(tournamentLabel) {
					case 'Final':
						additionalInfo = 'A';
						break;
					case 'Semi-final':
						additionalInfo = 'B';
						break;
					case '1/4':
						additionalInfo = 'C';
						break;
					case '1/8':
						additionalInfo = 'D';
						break;
					case '1/16':
						additionalInfo = 'E';
						break;
					case '1/32':
						additionalInfo = 'F';
						break;
					default:
						additionalInfo = 'Z';
				}
				additionalInfo += tournamentId;
			}
	}
	return additionalInfo;
}//**getAdditionalCombatInfo

RawCombatRecord.prototype.getFormattedRecord = function() {
	//formatted record is the minimum representation of a the combat record
	//for a example: 		2013-06-08 03:45	Theatre Of Pain[14] vs Tamed minotaurs-monster {1}
	//formatted record is: 	1306080345MM1N%540714386%%@Tamed minotaurs{1}
	//						1306080345 MM 1 N % 540714386 % % @Tamed minotaurs{1}
	var formattedRecord;
	formattedRecord = this.getTimeStamp() 
					+ this.getCombatType() 
					+ this.getCombatResult()
					+ this.getPlayerLevel()
					+ Separators.FieldSeparator
					+ this.getWarId()
					+ Separators.FieldSeparator
					+ this.getAllies()
					+ Separators.FieldSeparator
					+ this.getOpponents();
	if (this.getAdditionalCombatInfo().length > 0)
		formattedRecord += Separators.FieldSeparator + this.getAdditionalCombatInfo();
	
	if (debug) GM_log('TimeStamp = ' + this.getTimeStamp() 
					+ '\nCombatType = ' + this.getCombatType() 
					+ '\nCombatResult = ' + this.getCombatResult()
					+ '\nPlayerLevel = ' + this.getPlayerLevel()
					+ '\nWarId = ' + this.getWarId()
					+ '\nAllies = ' + this.getAllies()
					+ '\nOpponents = ' + this.getOpponents());
	
	return formattedRecord;
	
};//**getFormattedRecord

RawCombatRecord.prototype.isMercenary = function() {
	switch(this.getCombatType()){
		case CombatTypes.MI.code:
		case CombatTypes.MM.code:
		case CombatTypes.MR.code:
		case CombatTypes.MV.code:
		case CombatTypes.MA.code:
		case CombatTypes.MC.code:
		case CombatTypes.MB.code:
			return true;
		default:
			return false;
	}
};//**isMercenary

RawCombatRecord.prototype.getMercenaryRecord = function() {
	var mercenaryRecord = '';
	if (this.isMercenary() && this.getCombatResult() == 1) {
		var opponents = this.convertRussianOpponentsToEnglish(this.getOpponents());
		mercenaryRecord = this.getCombatType() 
						+ Separators.FieldSeparator
						+ this.getWarId()
						+ Separators.FieldSeparator
						+ opponents;
	}

	return mercenaryRecord;
};//**getMercenaryRecord

RawCombatRecord.prototype.convertRussianOpponentsToEnglish = function(opponents){
	opponents = opponents.replace(/\u0420\u044B\u0446\u0430\u0440\u0438/g, 'Knights');//knights
	opponents = opponents.replace(/\u0420\u044B\u0446\u0430\u0440\u0435\u0439/g, 'Knights');//of Knights
	opponents = opponents.replace(/\u0440\u044B\u0446\u0430\u0440\u0435\u0439/g, 'knights');//of knights
	opponents = opponents.replace(/\u0420\u044B\u0446\u0430\u0440\u044C/g, 'Knight');//Knight
	opponents = opponents.replace(/\u041D\u0435\u043A\u0440\u043E\u043C\u0430\u043D\u0442\u044B/g, 'Necromancers');
	opponents = opponents.replace(/\u041D\u0435\u043A\u0440\u043E\u043C\u0430\u043D\u0442\u043E\u0432/g, 'Necromancers');
	opponents = opponents.replace(/\u043D\u0435\u043A\u0440\u043E\u043C\u0430\u043D\u0442\u043E\u0432/g, 'necromancers');
	opponents = opponents.replace(/\u041D\u0435\u043A\u0440\u043E\u043C\u0430\u043D\u0442/g, 'Necromancer');
	opponents = opponents.replace(/\u041C\u0430\u0433\u0438/g, 'Wizards');
	opponents = opponents.replace(/\u041C\u0430\u0433\u043E\u0432/g, 'Wizards');
	opponents = opponents.replace(/\u043C\u0430\u0433\u043E\u0432/g, 'wizards');
	opponents = opponents.replace(/\u041C\u0430\u0433/g, 'Wizard');
	opponents = opponents.replace(/\u0422\u0435\u043C\u043D\u044B\u0435 \u044D\u043B\u044C\u0444\u044B/g, 'Dark elves');
	opponents = opponents.replace(/\u0422\u0451\u043C\u043D\u044B\u0435 \u042D\u043B\u044C\u0444\u044B/g, 'Dark elves');
	opponents = opponents.replace(/\u0422\u0451\u043C\u043D\u044B\u0435 \u044D\u043B\u044C\u0444\u043E\u0432/g, 'Dark elves');
	opponents = opponents.replace(/\u0422\u0435\u043C\u043D\u044B\u0445 \u044D\u043B\u044C\u0444\u043E\u0432/g, 'Dark elves');
	opponents = opponents.replace(/\u0442\u0451\u043C\u043D\u044B\u0445 \u044D\u043B\u044C\u0444\u043E\u0432/g, 'dark elves');
	opponents = opponents.replace(/\u0422\u0451\u043C\u043D\u044B\u0435/g, 'Dark elves');
	opponents = opponents.replace(/\u0422\u0451\u043C\u043D\u044B\u0445/g, 'Dark elves');
	opponents = opponents.replace(/\u0422\u0435\u043C\u043D\u044B\u0439 \u044D\u043B\u044C\u0444/g, 'Dark elf');
	opponents = opponents.replace(/\u042D\u043B\u044C\u0444\u044B/g, 'Elves');
	opponents = opponents.replace(/\u042D\u043B\u044C\u0444\u043E\u0432/g, 'Elves');
	opponents = opponents.replace(/\u044D\u043B\u044C\u0444\u043E\u0432/g, 'elves');
	opponents = opponents.replace(/\u042D\u043B\u044C\u0444/g, 'Elf');
	opponents = opponents.replace(/\u0421\u0442\u0435\u043F\u043D\u044B\u0435 \u0432\u0430\u0440\u0432\u0430\u0440\u044B/g, 'Tribals');
	opponents = opponents.replace(/\u0421\u0442\u0435\u043F\u043D\u044B\u0445 \u0432\u0430\u0440\u0432\u0430\u0440\u043E\u0432/g, 'Tribals');
	opponents = opponents.replace(/\u0441\u0442\u0435\u043F\u043D\u044B\u0445 \u0432\u0430\u0440\u0432\u0430\u0440\u043E\u0432/g, 'tribals');
	opponents = opponents.replace(/\u0421\u0442\u0435\u043F\u043D\u043E\u0439 \u0432\u0430\u0440\u0432\u0430\u0440/g, 'Tribal');
	opponents = opponents.replace(/\u0412\u0430\u0440\u0432\u0430\u0440\u044B/g, 'Barbarians');
	opponents = opponents.replace(/\u0412\u0430\u0440\u0432\u0430\u0440\u043E\u0432/g, 'Barbarians');
	opponents = opponents.replace(/\u0432\u0430\u0440\u0432\u0430\u0440\u043E\u0432/g, 'barbarians');
	opponents = opponents.replace(/\u0412\u0430\u0440\u0432\u0430\u0440/g, 'Barbarian');
	opponents = opponents.replace(/\u0414\u0435\u043C\u043E\u043D\u044B/g, 'Demons');
	opponents = opponents.replace(/\u0414\u0435\u043C\u043E\u043D\u043E\u0432/g, 'Demons');
	opponents = opponents.replace(/\u0434\u0435\u043C\u043E\u043D\u043E\u0432/g, 'demons');
	opponents = opponents.replace(/\u0414\u0435\u043C\u043E\u043D/g, 'Demon');
	opponents = opponents.replace(/\u0413\u043D\u043E\u043C\u044B/g, 'Dwarves');
	opponents = opponents.replace(/\u0413\u043D\u043E\u043C\u043E\u0432/g, 'Dwarves');
	opponents = opponents.replace(/\u0433\u043D\u043E\u043C\u043E\u0432/g, 'dwarves');
	opponents = opponents.replace(/\u0433\u043D\u043E\u043C\u043E\u0432/g, 'dwarves');
	opponents = opponents.replace(/\u0413\u043D\u043E\u043C/g, 'Dwarf');
	opponents = opponents.replace(/\u0420\u0435\u0439\u043D\u0434\u0436\u0435\u0440/g, 'Ranger');
	
	return opponents;
};//**convertRussianOpponentsToEnglish

function CombatRecord(playerId, combatRecord) {
	this._combatRecord = combatRecord;
	this._playerId = playerId;
}//**CombatRecord

CombatRecord.prototype.getTimeStamp = function() {
	return this._combatRecord.substr(0,10);
}//**getTimeStamp

CombatRecord.prototype.getFormattedTimeStamp = function() {
	var timeStamp = this.getTimeStamp();
	var formattedTimeStamp = '20' + timeStamp.substr(0,2) + '-' 
						   + timeStamp.substr(2,2) + '-'
						   + timeStamp.substr(4,2) + ' '
						   + timeStamp.substr(6,2) + ':'
						   + timeStamp.substr(8,2)
	return formattedTimeStamp;
}//**getFormattedTimeStamp

CombatRecord.prototype.getCombatType = function() {
	return this._combatRecord.substr(10,2);
}//**getCombatType

CombatRecord.prototype.getCombatCategory = function() {
	return this._combatRecord.substr(10,1);
}//**getCombatCategory

CombatRecord.prototype.getCombatResult = function() {
	return parseInt(this._combatRecord.substr(12,1));
}//**getCombatResult

CombatRecord.prototype.getPlayerLevel = function() {
	return getDecodedPlayerLevel(this._combatRecord.substr(13,1));
}//**getPlayerLevel

CombatRecord.prototype.getWarId = function() {
	return this._combatRecord.split(Separators.FieldSeparator)[1];
}//**getWarId

CombatRecord.prototype.getAllies = function() {
	var allyString = this._combatRecord.split(Separators.FieldSeparator)[2];
	return (allyString.length==0)?-1:allyString.split(Separators.AllySeparator);
}//**getAllies

CombatRecord.prototype.getOpponents = function() {
	var allyString = this._combatRecord.split(Separators.FieldSeparator)[3];
	return (allyString.length==0)?-1:allyString.split(Separators.AllySeparator);
}//**getOpponents

CombatRecord.prototype.getCombatAdditionalInfo = function() {
	if (this._combatRecord.split(Separators.FieldSeparator).length <= 3)
		return '';
	
	var additionalInfoString = this._combatRecord.split(Separators.FieldSeparator)[4];
	var additionalInfo = '';
	switch (this.getCombatType()){
		case CombatTypes.XQ.code:
			additionalInfo = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<a href=fast_tour_hist.php?id=' + additionalInfoString.substr(1) + '>';
			switch(additionalInfoString.substr(0,1)) {
				case 'A':
					additionalInfo += 'Final';
					break;
				case 'B':
					additionalInfo += 'Semi-final';
					break;
				case 'C':
					additionalInfo += '1/4';
					break;
				case 'D':
					additionalInfo += '1/8';
					break;
				case 'E':
					additionalInfo += '1/16';
					break;
				case 'F':
					additionalInfo += '1/32';
					break;
				default:
					additionalInfo += 'Quick Tournament';
			}
			additionalInfo += '</a>)';
	}
	return additionalInfo;
}//**getOpponents

function AnalysisOptions(analysisType, winsOnly) {
	this._analysisType = analysisType;
	this._winsOnly = winsOnly;
}//**AnalysisOptions

AnalysisOptions.prototype.getAnalysisType = function() {
	return this._analysisType;
};//**getAnalysisType

AnalysisOptions.prototype.getWinsOnly = function() {
	return this._winsOnly;
};//**getWinsOnly

AnalysisOptions.prototype.serialize = function() {
	if (this._analysisType == null || this._winsOnly == null) return -1;
	var options = this._analysisType + ',' + this._winsOnly;
	return options;
};//**serialize

AnalysisOptions.prototype.deserialize = function(serialized) {
	if (serialized == null) return false;//failure
	var options = serialized.split(',');
	this._analysisType = options[0];
	this._winsOnly = (options[1]=='true')?true:false;
	return true;//success
};//**deserialize

function VersionNumber(versionString) {
	this._versionString = versionString;
}//**VersionNumber

VersionNumber.prototype.getMajorVersion = function() {
	if (this._versionString.split('.').length > 0) {
		return parseInt(this._versionString.split('.')[0]);
	}
	return 0;
}//**getMajorVersion

VersionNumber.prototype.getMinorVersion = function() {
	if (this._versionString.split('.').length > 1) {
		return parseInt(this._versionString.split('.')[1]);
	}
	return 0;
}//**getMajorVersion

VersionNumber.prototype.getRevisionNumber = function() {
	if (this._versionString.split('.').length > 2) {
		return parseInt(this._versionString.split('.')[2]);
	}
	return 0;
}//**getMajorVersion

const SearchStrings = {
	comma: ',',
	vs: ' vs ',
	plInfo: 'pl_info.php?id=',
	quickTourHist: 'fast_tour_hist.php?id=',
	commanderTag: '<b>τ</b>',
	caravan: 'Caravan of ',
	caravanRU: '\u041A\u0430\u0440\u0430\u0432\u0430\u043D ',
	thief: 'Thief - ',
	thiefRU: '\u0412\u043E\u0440 - ',
	contestParticipant: 'Contest participant - ',
	contestParticipantRU: '\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A \u0441\u043E\u0441\u0442\u044F\u0437\u0430\u043D\u0438\u044F - ',
	army: 'Army of ',
	armyRU: '\u0410\u0440\u043C\u0438\u044F ',
	brigands: '-brigands ',
	brigandsRU: '-\u0440\u0430\u0437\u0431\u043E\u0439\u043D\u0438\u043A\u0438 ',
	conspirators: ' - conspirators ',
	conspiratorsRU: ' - \u0437\u0430\u0433\u043E\u0432\u043E\u0440\u0449\u0438\u043A\u0438 ',
	invaders: '-invaders ',
	invadersRU: '-\u0437\u0430\u0445\u0432\u0430\u0442\u0447\u0438\u043A\u0438 ',
	monster: '-monster ',
	monsterRU: '-\u043C\u043E\u043D\u0441\u0442\u0440 ',
	raid: '-raid ',
	raidRU: '-\u043D\u0430\u0431\u0435\u0433\u0438 ',
	vanguard: 'Vanguard of ',
	vanguardRU: '\u041E\u0442\u0440\u044F\u0434 ',
}

const Separators = {
 	FieldSeparator: '%',
	AllySeparator: '^',
	HumanIndicator: '!',
	AIIndicator: '@'
}//**Separators

const Labels = {
	H: {code:'H', value:'Hunts'},
	M: {code:'M', value:'Mercenary'},
	T: {code:'T', value:'Thief'},
	R: {code:'R', value:'Ranger'},
	C: {code:'C', value:'Commanders'},
	E: {code:'E', value:'Events'},
	X: {code:'X', value:'Miscellaneous'}
}//**Labels

const CombatTypeColors = {
	HG: '#CCEECC',
	MG:	'#EEEECC',
	TG:	'#CCCCEE',
	RG: '#CCEEEE',
	CG:	'#EECCCC',
	EV: '#EECCEE',
	XY: '#CCCCCC',
	XX:	'#EEEEEE' 
}//**CombatTypeColors

const CombatResults = {
	losses: {code:'0', value:'Losses'},
	wins: {code:'1', value:'Wins'}
}//**CombatResult


//combat types 75 and 76 for Squashman shouldn't be tracked
const CombatTypes = {
	HS: {ids: [0], code: 'HS', value: 'Solo'}, 			// solo hunt						xx-xx-xx xx:xx	<player>[level] vs <monster> (xx)
	HD: {ids: [19], code: 'HD', value: 'Dual'},			// dual hunt						xx-xx-xx xx:xx	<player>[level], <dual_player>[level] vs <monster1> (xx), <monster2> (xx) 
	HA: {ids: [0], code: 'HA', value: 'Assist'},		// you assisted a hunt				xx-xx-xx xx:xx	<assisted_player>[level], <player>[level] vs <monster> (xx)
	HT: {ids: [0], code: 'HT', value: 'Assisted'},		// you were assisted in a hunt		xx-xx-xx xx:xx	<player>[level], <assisting_player>[level] vs <monster> (xx)
	MA: {ids: [12], code: 'MA', value: 'Armies'},		// mercenary - army					xx-xx-xx xx:xx	<player>[level] vs Army of xx {xx}
	MB: {ids: [6,29], code: 'MB', value: 'Brigands'},	// mercenary - brigands				xx-xx-xx xx:xx	xx-brigands {xx} vs <player>[level]
	MC: {ids: [28], code: 'MC', value: 'Conspirators'},	// mercenary - conspirators			xx-xx-xx xx:xx	<player>[level] vs xx - conspirators {xx}
	MI: {ids: [5], code: 'MI', value: 'Invaders'},		// mercenary - invanders			xx-xx-xx xx:xx	<player>[level] vs xx-invaders {xx}
	MM: {ids: [7], code: 'MM', value: 'Monsters'},		// mercenary - monster				xx-xx-xx xx:xx	<player>[level] vs xx-monster {xx}
	MR: {ids: [8], code: 'MR', value: 'Raids'},			// mercenary - raid					xx-xx-xx xx:xx	<player>[level] vs xx-raid {xx}
	MV: {ids: [10], code: 'MV', value: 'Vanguards'},	// mercenary - vanguard				xx-xx-xx xx:xx	<player>[level] vs Vanguard of xx {xx}
	TG: {ids: [26], code: 'TG', value: '1\u00a0Ambush'},// you ambushed a player			xx-xx-xx xx:xx	<player>[level] vs <ambushed_player>[level]
	TP: {ids: [26], code: 'TP', value: '1\u00a0Ambushed'},// you were ambushed by a player	xx-xx-xx xx:xx	<ambusher_player>[level] vs <player>[level]
	TD: {ids: [0], code: 'TD', value: '2\u00a0Ambush'},	// you ambushed a dual				xx-xx-xx xx:xx	<player>[level] vs <ambushed_player1>[level], <ambushed_player2>[level]
	TU: {ids: [0], code: 'TU', value: '2\u00a0Ambushed'},// you were ambushed in a dual		xx-xx-xx xx:xx	<player>[level] vs <ambushed_player1>[level], <ambushed_player2>[level]
	TR: {ids: [0], code: 'TR', value: 'Group'},			// you + ally ambushed 2 caravans	xx-xx-xx xx:xx	<player1>[level], <player2>[level] vs Caravan of xx, Caravan of xx
	TV: {ids: [66], code: 'TV', value: 'Caravans'},		// caravan							xx-xx-xx xx:xx	<player>[level] vs Caravan of xx
	RH: {ids: [61], code: 'RH', value: 'Human\u00a0thief'},// ranger against human player	xx-xx-xx xx:xx	<player>[level], Ranger vs <player>[level]
	RA: {ids: [63,61], code: 'RA', value: 'AI\u00a0thief'},// ranger against AI thief		xx-xx-xx xx:xx	<player>[level], Ranger vs Thief - xx
	C0: {ids: [39], code: 'C0', value: 'The\u00a0trial'},// commander - trial				xx-xx-xx xx:xx	<player1>[level] vs xx
	C1: {ids: [40], code: 'C1', value: 'Duels'},		// commander - duels				xx-xx-xx xx:xx	<player1>[level] vs <player2>[level]
	C2: {ids: [40], code: 'C2', value: 'Group\u00a02x2'},// commander - group 2x2			xx-xx-xx xx:xx	<player1>[level], <player2>[level] vs <player3>[level], <player4>[level]
	C3: {ids: [40], code: 'C3', value: 'Group\u00a03x3'},// commander - group 3x3			xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs <player4>[level], <player5>[level], <player6>[level]
	ED: {ids: [46,47,48,49], code: 'ED', value: 'Demons'},// misc - demons					xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Gate demons
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Infernals
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Infernals, Pandemonium leader
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Demon Portal guard
														//									xx-xx-xx xx:xx	Demon Portal guard vs <player>[level]
	EW: {ids: [23], code: 'EW', value: 'Dwarves'},		// misc - dwarves					xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs dwarf invaders[level]
	EL: {ids: [22], code: 'EL', value: 'Elementals'},	// misc - elementals				xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs elementals
	EK: {ids: [36], code: 'EK', value: 'Kingdom'},		// misc - kingdom					xx-xx-xx xx:xx	Kingdom vs <player1>[level], <player2>[level], <player3>[level], Dwarf warrior
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level], Dwarf warrior vs Kingdom
	EF: {ids: [30], code: 'EF', value: 'Inhabitants\u00a0of\u00a0the\u00a0tunnel'},//inhabitants of the tunnel	xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Inhabitants of the tunnel
	EP: {ids: [56], code: 'EP', value: 'Packmaster'},	// misc - packmaster				xx-xx-xx xx:xx	<player>[level] vs Packmaster
														//									xx-xx-xx xx:xx	<player>[level] vs <ambushed_player>[level], Packmaster
	ER: {ids: [53,54,55], code: 'ER', value: 'Rebels'},	// misc - rebels					xx-xx-xx xx:xx	Saboteur destructors vs <player1>[level], <player2>[level], <player3>[level]
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Rebel camp defenders-1
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Rebel camp defenders-2
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Rebel camp defenders-3
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Rebel camp defenders, Rebel ringleader
	EX: {ids: [83,84], code: 'EX', value: 'Savage barbarians'},	// misc - savage barbarians	xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Savage barbarians-1
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Savage barbarians-2
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Savage barbarians-3
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Savage barbarians-4, barbarian leader
	ET: {ids: [67], code: 'ET', value: 'Recalcitrant\u00a0tribes'},//recalcitrant tribes	xx-xx-xx xx:xx	Recalcitrant tribes vs <player>[level]
	EA: {ids: [32], code: 'EA', value: 'Monsters\u00a0of\u00a0the\u00a0sea'},//monsters of the sea	xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Monsters of the sea
	ES: {ids: [74], code: 'ES', value: 'Sentinels\u00a0of\u00a0the\u00a0past'},//sentinels of the past	xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Sentinels of the Past
	EB: {ids: [57,58], code: 'EB', value: 'Steppe\u00a0Barbarians'},//steppe barbarians		xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Steppe barbarians
	EG: {ids: [81], code: 'EG', value: 'Survilurgs\u00a0(Attack)'},	//survilurgs attack	xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Survilurgs
	EJ: {ids: [80], code: 'EJ', value: 'Survilurgs\u00a0(Defense)'},	//survilurgs defensexx-xx-xx xx:xx	Survilurgs vs <player1>[level], <player2>[level], <player3>[level]
	EN: {ids: [62,64,65], code: 'EN', value: 'Templars\u00a0of\u00a0the\u00a0sun'},// misc - knights of the sun	xx-xx-xx xx:xx	Guardians vs <player>[level]
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Detachment of the Sun
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Knights of the Sun
	EI: {ids: [69,71,72], code: 'EI', value: 'Trilateral war'},// misc - trilateral war		xx-xx-xx xx:xx	<player1>[level] vs invader arena
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs patrons of the seas
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs barbarians #x "xxxxx"
	EU: {ids: [41,42,43,79], code: 'EU', value: 'Undead'},	// misc - undead				xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Unholy venomancers
														//									xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs Undead
														//									xx-xx-xx xx:xx	Undead vs <player>[level]
	EM: {ids: [77], code: 'EM', value: 'Fir-tree\u00a0defense'},// misc - xmas tree			xx-xx-xx xx:xx	<player1>[level] vs Fir-tree defense[level]
	EH: {ids: [33], code: 'EH', value: 'Halloween'},		// misc - halloween				xx-xx-xx xx:xx	Dreadful nightmares vs <player>[level]
	EV: {ids: [51], code: 'EV', value: 'Valentine'},	// misc - valentine					xx-xx-xx xx:xx	<player>[level] vs Valentine`s Card thieves
	XC: {ids: [50], code: 'XC', value: 'Contest\u00a0participant'},// contest participants	xx-xx-xx xx:xx	<player1>[level] vs Contest participant - xx
	XE: {ids: [24], code: 'XE', value: 'Everyone\u00a0for\u00a0oneself'},// blindfold		xx-xx-xx xx:xx	<player1>[level] vs <player2>[level] vs <player3>[level] vs <player4>[level] vs <player5>[level] vs <player6>[level]
	XG: {ids: [15], code: 'XG', value: 'Dragon\u00a0guard'},// dragon guards				xx-xx-xx xx:xx	<player1>[level] vs Dragon guards
	X4: {ids: [0,21], code: 'X4', value: 'Quick\u00a04x4'},// quick 4x4						xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level], <player4>[level] vs <player5>[level], <player6>[level], <player7>[level], <player8>[level]
	X3: {ids: [25], code: 'X3', value: 'Blindfold\u00a0tournament'},// blindfold tournament	xx-xx-xx xx:xx	<player1>[level] vs <player2>[level] vs <player3>[level] vs <player4>[level] vs <player5>[level] vs <player6>[level]
	X0: {ids: [60], code: 'X0', value: 'Paired\u00a0tournament'},// paired tournaments		xx-xx-xx xx:xx	<player1>[level], <player2>[level] vs <player3>[level], <player4>[level]
	X2: {ids: [14], code: 'X2', value: 'Minor\u00a0tournament'},// minor tournament			xx-xx-xx xx:xx	<player1>[level] vs <player2>[level]
	X5: {ids: [37], code: 'X5', value: 'Mixed\u00a0tournament'},// mixed tournament			xx-xx-xx xx:xx	<player1>[level], <player2>[level], <player3>[level] vs <player4>[level], <player5>[level], <player6>[level]
	XQ: {ids: [68], code: 'XQ', value: 'Quick\u00a0tournament'},// misc - quick tournaments	xx-xx-xx xx:xx	<player1>[level], <player2>[level] vs <player3>[level], <player4>[level] (1/x)
	XA: {ids: [20,45], code: 'XA', value: 'Survival\u00a0tournament'},// survival tourney	xx-xx-xx xx:xx	<player>[level] vs Arena Gladiators/Mastermind Swarms
	X1: {ids: [18], code: 'X1', value: 'Throne\u00a0battle'},// throne battles				xx-xx-xx xx:xx	<player1>[level] vs <player2>[level]
	XX: {ids: [0], code: 'XX', value: 'Other'},			// others
}//**CombatTypes

function combatTypesToString(){
	var codes = ',';
	for(var combatType in CombatTypes){
		codes += CombatTypes[combatType].code + ',';
	}
	return codes;
}//**combatTypesToString

function combatLevelsToString(){
	var levels = ',';
	var maxPlayerLevel = 1;
	if (combat_stats.length > 0) {
		var combatRecord = new CombatRecord(player_id, combat_stats[0]);
		maxPlayerLevel = combatRecord.getPlayerLevel();
	}
	for (var z = 1; z <= maxPlayerLevel; z++){
		levels += getEncodedPlayerLevel(z) + ',';
	}	
	return levels;
}//**combatLevelsToString

function getEncodedPlayerLevel (level) {
	return String.fromCharCode(level + 64);
}//**getEncodedPlayerLevel

function getDecodedPlayerLevel(encodedLevel) {
	return parseInt(encodedLevel.charCodeAt(0)) - 64;
}//**getDecodedPlayerLevel

var player_id, player_name;			// this is the player id and name of the profile stats you're tracking
var combat_stats = new Array();		// this is the main array that stores the compact form of the combat records
var mercenary_stats = new Array();	// this array is for stats of mercenary missions
var update_from, update_to;			// timestamps reflecting the time range of the combat logs processed
var player_level;					// player level 
var opponents, allies;				// player names/AI involved in the same battle with the player
var warid;							// combat id
var div;
var opened_window;
var center;
var player_key;						// key to store player name
var stats_key;						// key to store all combat stats
var mercenary_key;					// key to store mercenary missions only
var from_key;						// key to store the starting range of combats processed
var to_key;							// key to store the ending range of combats processed
var collect_stats_key;				// key to indicate stats collection
var colorize_table_key;				// key to indicate colorization of the analysis table

/*
 * Main
 */

if (location.href.indexOf('pl_warlog.php') != -1) {
	combatStats();		// the current page is combat log
	formatLogTable();
	buildAnalysisTable();
	combatAnalysis();
} else {
	profileStats();		// the current page is character profile
}
checkForLatestVersion();

function setKeys(p_player_id, p_player_name) {
	stats_key = self + ' ' + p_player_id + ' combat stats';
	mercenary_key = self + ' ' + p_player_id + ' mercenary stats';
	from_key = self + ' ' + p_player_id + ' analysis from';
	to_key = self + ' ' + p_player_id + ' analysis to';
	collect_stats_key = self + ' ' + p_player_id + ' collect stats';
	colorize_table_key = self + ' ' + p_player_id + ' colorize';
	player_key = self + ' ' + p_player_id;
	if (collectStats()) {
		if (supportsHTML5Storage()) {
			localStorage[player_key] = p_player_name;
		} else {
			GM_setValue(player_key, p_player_name);
		}
	}
}

// runs if the page is combat log
function combatStats() {
	
	var all_tds = document.getElementsByTagName('td');
	var combat_log_td;
	var combat_log_str = '<center>Combat log of <a';
	var combat_records;
	var current_combat_type;
	var mercenary_mission;
		
	for (var i = 0; i < all_tds.length; i++) {

		if (all_tds[i].innerHTML.indexOf(combat_log_str) != -1) {
			combat_log_td = all_tds[i];
			var player_pattern = /Combat log of <a\D{0,}pl_info\.php\?id=(\d+)\D{0,}><b>(\w*\D*\w*)<\/b><\/a>/;
			combat_log_td.innerHTML.match(player_pattern);
			player_id = RegExp.$1;	// the player id is retrieved
			player_name = RegExp.$2;	// the player name is retrieved
			setKeys(player_id, player_name);

			var continue_execution = collectStats();	// execution would continue only if we selected to track this profile stats
			if (!continue_execution) {return;}

			autoProcess();
			getCombatData();	// load all combat records we have previously stored

			var cleanedCombatLog = combat_log_td.innerHTML.substring(combat_log_td.innerHTML.indexOf('&nbsp;')).replace(/&nbsp;/g,'').slice(0,-5);
			var combatRecords = cleanedCombatLog.split('<br>');

			for (var z = 0; z < combatRecords.length; z++) {
				var rawCombatRecord = new RawCombatRecord(player_id, combatRecords[z]);
				if (debug) GM_log('Combat record: ' + rawCombatRecord.getFormattedRecord());

				//ignore codes 75 and 76 (squashman) battles
				if (rawCombatRecord.getCommentedCombatCode() != 75
					&& rawCombatRecord.getCommentedCombatCode() != 76) {
					// add combat record to the combat array
					addCombatStatRec(rawCombatRecord.getFormattedRecord());	
					// add mercenary record to the mercenary array
					if (rawCombatRecord.isMercenary()) {
						if (debug) GM_log('Mercenary record: ' + rawCombatRecord.getMercenaryRecord());
						createMercenaryStatRec(rawCombatRecord.getMercenaryRecord());
					}
				}
			}
		}
	}
	// store combat data
	saveCombatData();
}


//	runs if the current page is the character profile
function profileStats() { 
	var totals = {
		H: {
			HS: {won: 0, total: 0},
			HD: {won: 0, total: 0},
			HA: {won: 0, total: 0},
			HT: {won: 0, total: 0},
			won: 0,
			total: 0
		},
		M: {
			MA: {won: 0, total: 0},
			MB: {won: 0, total: 0},
			MC: {won: 0, total: 0},
			MI: {won: 0, total: 0},
			MM: {won: 0, total: 0},
			MR: {won: 0, total: 0},
			MV: {won: 0, total: 0},
			won: 0,
			total: 0
		},
		T: {
			TG: {won: 0, total: 0},
			TP: {won: 0, total: 0},
			TD: {won: 0, total: 0},
			TU: {won: 0, total: 0},
			TR: {won: 0, total: 0},
			TV: {won: 0, total: 0},
			won: 0,
			total: 0
		},
		R: {		
			RH: {won: 0, total: 0},
			RA: {won: 0, total: 0},
			won: 0,
			total: 0
		},
		C: {
			C0: {won: 0, total: 0},
			C1: {won: 0, total: 0},
			C2: {won: 0, total: 0},
			C3: {won: 0, total: 0},
			won: 0,
			total: 0
		},
		E: {
			EA: {won: 0, total: 0},
			EB: {won: 0, total: 0},
			ED: {won: 0, total: 0},
			EF: {won: 0, total: 0},
			EG: {won: 0, total: 0},
			EH: {won: 0, total: 0},
			EI: {won: 0, total: 0},
			EJ: {won: 0, total: 0},
			EK: {won: 0, total: 0},
			EL: {won: 0, total: 0},
			EM: {won: 0, total: 0},
			EN: {won: 0, total: 0},
			EP: {won: 0, total: 0},
			ER: {won: 0, total: 0},
			ES: {won: 0, total: 0},
			ET: {won: 0, total: 0},
			EU: {won: 0, total: 0},
			EV: {won: 0, total: 0},
			EX: {won: 0, total: 0},
			EW: {won: 0, total: 0},
			won: 0,
			total: 0
		},
		X: {
			X0: {won: 0, total: 0},
			X1: {won: 0, total: 0},
			X2: {won: 0, total: 0},
			X3: {won: 0, total: 0},
			X4: {won: 0, total: 0},
			X5: {won: 0, total: 0},
			XA: {won: 0, total: 0},
			XC: {won: 0, total: 0},
			XE: {won: 0, total: 0},
			XG: {won: 0, total: 0},
			XQ: {won: 0, total: 0},
			XX: {won: 0, total: 0},
			won: 0,
			total: 0
		},
		won: 0,
		total: 0
	}
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
			player_id = RegExp.$1;		// retrieve player id
		}
	}
	for (var i = 0; i < all_tables.length; i++) {
		if ((all_tables[i].innerHTML.indexOf('sms-create.php\?mailto')!= -1)) {
			var player_name_pattern = /mailto=(\w*\D*\w*)\">Write a message/;
			all_tables[i].innerHTML.match(player_name_pattern);
			player_name = RegExp.$1;	// retrieve player name
		}		
	}
	setKeys(player_id, player_name);
	
	removeCombatData();	// checks if stats are set to be deleted
	autoProcess(); //checks if stats are set to be auto processed	
	
	getCombatData();	// load stored combat data
	
	var continue_execution = collectStats();	// continue execution if we're tracking stats for the profile

	if (combat_stats.length != 0) {
		for (var i = 0; i < combat_stats.length; i++) {
			var combatRecord = new CombatRecord(player_id, combat_stats[i]); 

			// parse combat type and its result to properly calculate totals
			var combatType = combatRecord.getCombatType();
			var combatResult = combatRecord.getCombatResult();
			var combatCategory = combatRecord.getCombatCategory();
			try{
				eval("totals." + combatCategory + "." + combatType + ".total++");
				eval("totals." + combatCategory + ".total++");
				eval("totals." + combatCategory + "." + combatType + ".won += " + combatResult);
				eval("totals." + combatCategory + ".won += " + combatResult);
			} catch (err) {
				alert("Message from LWMCombatStats:\nThere seems to be a problem with your combat data.\nPlease contact \"Theatre Of Pain\" to help you resolve it.");
				break;
			}
			totals.total++;
			totals.won += combatResult;
		}
	}
	if (mercenary_stats.length != 0) {
		for (var i = 0; i < mercenary_stats.length; i++) {
			// parse mercenary combat type and its result to properly group them
			var re = new RegExp(Separators.AIIndicator, 'g');
			var mercenaryRecord = mercenary_stats[i].replace(re,'').replace(/\+/g,',').split(Separators.FieldSeparator);
			switch (mercenaryRecord[0]) {
			case CombatTypes.MA.code:		// mercenery - army
				armies.push(mercenaryRecord);
				break;

			case CombatTypes.MB.code:		// mercenery - brigands
				brigands.push(mercenaryRecord);
				break;

			case CombatTypes.MC.code:		// mercenery - conspirators
				conspirators.push(mercenaryRecord);
				break;

			case CombatTypes.MI.code:		// mercenery - invaders
				invaders.push(mercenaryRecord);
				break;

			case CombatTypes.MV.code:		// mercenery - vanguard
				vanguards.push(mercenaryRecord);
			
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

	stats_table = "<table class=\"wblight\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" width=\"790\"><tbody><tr><td colspan =\"7\" class=\"wb\" align=\"center\" width=\"100%\"><b>Combat Statistics</b>"
	
	if (!continue_execution) {	// we are not tracking stats for this profile, simply display a message confirming that
		stats_table += "<br><i>No statistics have been collected for this profile.<b><br><button onclick = \"var r=confirm('"
		stats_table += "To collect stats, you need to visit the combat log of the profile.\\nThe script will transparently process each log page you view.\\nPlease click ok to enable stats collection');"; 
		stats_table += "if (r==true) {document.cookie='" + player_name + " collectStats=1;expires=' + new Date('2020');"
		stats_table += "document.cookie='" + player_name + " autoStats=1';window.location.reload();} return false;\">Collect Statistics</button></b></i></td></tr></tbody></table>";
	} else {		// the totals table
		stats_table += "<br><font style=\"font-size:8px\">For combats played between: " + update_from + "  -  " + update_to
		stats_table += "<br><button onclick = \"var r=confirm('Please confirm you no longer want to keep combat stats for this profile');"
		stats_table += "if (r==true) {document.cookie='" + player_name + " removeStats=1';window.location.reload();} return false;\">Remove Statistics</button></td></tr>"
		stats_table += "<tr><td class=\"wb\" align=\"center\" width=\"14%\" bgcolor='" + CombatTypeColors.HG + "'><b>" + Labels.H.value + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"14%\" bgcolor='" + CombatTypeColors.MG + "'><b>" + Labels.M.value + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"14%\" bgcolor='" + CombatTypeColors.TG + "'><b>" + Labels.T.value + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"14%\" bgcolor='" + CombatTypeColors.RG + "'><b>" + Labels.R.value + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"14%\" bgcolor='" + CombatTypeColors.CG + "'><b>" + Labels.C.value + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"14%\" bgcolor='" + CombatTypeColors.EV + "'><b>" + Labels.E.value + "</b></td>"
		stats_table += "<td class=\"wb\" align=\"center\" width=\"14%\" bgcolor='" + CombatTypeColors.XY + "'><b>" + Labels.X.value + "</b></td></tr>"
		
		//subtotals
		stats_table += "<tr>"
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + createSummaryTable(Labels.H.code) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + createSummaryTable(Labels.M.code) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + createSummaryTable(Labels.T.code) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + createSummaryTable(Labels.R.code) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + createSummaryTable(Labels.C.code) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + createSummaryTable(Labels.E.code) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + createSummaryTable(Labels.X.code) + "</td>";

		// totals
		stats_table += "<tr><td class=\"wb\" align=\"right\" width=\"14%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + totals.H.won + "/" + totals.H.total + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + totals.M.won + "/" + totals.M.total + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + totals.T.won + "/" + totals.T.total + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + totals.R.won + "/" + totals.R.total + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + totals.C.won + "/" + totals.C.total + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + totals.E.won + "/" + totals.E.total + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">&nbsp;&nbsp;<b>Total:&nbsp;&nbsp;&nbsp;" + totals.X.won + "/" + totals.X.total + "</td>";
		stats_table += "<tr>";

		// graphs for subtotals
		stats_table += "<tr bgcolor=\"#5d413a\"><td class=\"wb\" align=\"right\" width=\"14%\">" + generateGraph(totals.H.won, totals.H.total, CombatTypeColors.HG) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + generateGraph(totals.M.won, totals.M.total, CombatTypeColors.MG) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + generateGraph(totals.T.won, totals.T.total, CombatTypeColors.TG) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + generateGraph(totals.R.won, totals.R.total, CombatTypeColors.RG) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + generateGraph(totals.C.won, totals.C.total, CombatTypeColors.CG) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + generateGraph(totals.E.won, totals.E.total, CombatTypeColors.EV) + "</td>";
		stats_table += "<td class=\"wb\" align=\"right\" width=\"14%\">" + generateGraph(totals.X.won, totals.X.total, CombatTypeColors.XY) + "</td>";
		stats_table += "<tr>";
		
		// grand total
		stats_table += "<tr><td colspan =\"7\" class=\"wb\" align=\"center\" width=\"100%\">&nbsp;&nbsp;<b>Total Combats:&nbsp;&nbsp;&nbsp;" + totals.won + "/" + totals.total + "</b></td></tr>"
		
		// graph for totals
		stats_table += "<tr><td colspan =\"7\" class=\"wb\" align=\"center\" width=\"100%\" bgcolor=\"#5d413a\">"
		stats_table += generateGraphForTotals();
		stats_table += "</td></tr></tbody></table>"

		if (mercenary_stats.length != 0){
			// mercenary missions
			stats_table += "<table class=\"wblight\" align=\"center\" cellpadding=\"2\" cellspacing=\"0\" width=\"790\"><tbody><tr><td colspan =\"5\" class=\"wb\" align=\"center\" width=\"100%\"><b>Mercenary Statistics</b></td></tr>"
			stats_table += "<tr><td cclass=\"wb\" align=\"center\" width=\"17%\"><b>" + CombatTypes.MA.value + "</b></td>"
			stats_table += "<td class=\"wb\" align=\"center\" width=\"17%\"><b>" + CombatTypes.MB.value + "</b></td>"
			stats_table += "<td class=\"wb\" align=\"center\" width=\"32%\"><b>" + CombatTypes.MC.value + "</b></td>"
			stats_table += "<td class=\"wb\" align=\"center\" width=\"17%\"><b>" + CombatTypes.MI.value + "</b></td>"
			stats_table += "<td class=\"wb\" align=\"center\" width=\"17%\"><b>" + CombatTypes.MV.value + "</b></td></tr>"

			stats_table += "<tr><td class=\"wb\" align=\"right\" width=\"17%\">"
			if (armies.length > 0) {
				for (var z = 0; z < armies.length ; z++) {
					stats_table += "<a href=\"http://www.lordswm.com/warlog.php?warid=" + armies[z][1] + "\">" + armies[z][2].charAt(0).toUpperCase() + armies[z][2].slice(1) + "</a><br>";
				}
			} 
			stats_table += "</td>"

			stats_table += "<td class=\"wb\" align=\"right\" width=\"17%\">"
			if (brigands.length > 0) {
				for (var z = 0; z < brigands.length ; z++) {
					stats_table += "<a href=\"http://www.lordswm.com/warlog.php?warid=" + brigands[z][1] + "\">" + brigands[z][2].charAt(0).toUpperCase() + brigands[z][2].slice(1) + "</a><br>";
				}
			}
			stats_table += "</td>"
		
			stats_table += "<td class=\"wb\" align=\"right\" width=\"32%\">"
			if (conspirators.length > 0) {
				for (var z = 0; z < conspirators.length ; z++) {
					stats_table += "<a href=\"http://www.lordswm.com/warlog.php?warid=" + conspirators[z][1] + "\">" + conspirators[z][2].charAt(0).toUpperCase() + conspirators[z][2].slice(1) + "</a><br>";
				}
			}
			stats_table += "</td>"

			stats_table += "<td class=\"wb\" align=\"right\" width=\"17%\">"
			if (invaders.length > 0) {
				for (var z = 0; z < invaders.length ; z++) {
					stats_table += "<a href=\"http://www.lordswm.com/warlog.php?warid=" + invaders[z][1] + "\">" + invaders[z][2].charAt(0).toUpperCase() + invaders[z][2].slice(1) + "</a><br>";
				}
			}
			stats_table += "</td>"

			stats_table += "<td class=\"wb\" align=\"right\" width=\"17%\">"
			if (vanguards.length > 0) {
				for (var z = 0; z < vanguards.length ; z++) {
					stats_table += "<a href=\"http://www.lordswm.com/warlog.php?warid=" + vanguards[z][1] + "\">" + vanguards[z][2].charAt(0).toUpperCase() + vanguards[z][2].slice(1) + "</a><br>";
				}
			}
			stats_table += "</td></tr></tbody></table>"	
		}	
	}
	
	achievements_table.innerHTML = achievements_table.innerHTML.substring(0, achievements_table_position) + stats_table + achievements_table.innerHTML.substring(achievements_table_position);

	function createSummaryTable(combatCategory){
		var table = "<table width=\"100%\"><tr>";
		table += "<td align = \"right\">"
		for (var combatType in CombatTypes) {
			if (combatType.substring(0,1) == combatCategory)
				table += "<br>" + CombatTypes[combatType].value + ":"
		}
		table += "</td>";
		table += "<td align = \"right\">"
		for (var combatType in CombatTypes) {
			if (combatType.substring(0,1) == combatCategory)
				table += "<br>" + createSummaryHyperlink(eval("CombatTypes." + combatType + ".code"),
														eval("totals." + combatCategory + "." + combatType + ".won"),
														eval("totals." + combatCategory + "." + combatType + ".total"))
		}
		table += "</td></tr></table>"
		return table;
	}
	function createSummaryHyperlink(combatCode, wins, total){
		//create wins hyperlink
		var analysisOptions = new AnalysisOptions(combatCode, true);
		var now = new Date();
		var time = now.getTime();
		time += 5 * 1000; //expire the cookie in 5 seconds
		var hyperlink = '';
		if (wins > 0) {
			hyperlink = "<a href = \"#\" onclick=\"document.cookie='CombatStatsAnalysisOptions=" + analysisOptions.serialize() 
				+ ";expires=" + time + "';"
				+ "window.open('http://www.lordswm.com/pl_warlog.php?id=" 
				+ player_id + "', 'log_window');return false;\">" + wins + "</a>";
		} else {
			hyperlink = '0';
		}
		//create total hyperlink
		analysisOptions = new AnalysisOptions(combatCode, false);
		if (total > 0) {
			hyperlink += "/<a href = \"#\" onclick=\"document.cookie='CombatStatsAnalysisOptions=" + analysisOptions.serialize() 
				+ ";expires=" + time + "';"
				+ "window.open('http://www.lordswm.com/pl_warlog.php?id=" 
				+ player_id + "', 'log_window');return false;\">" + total + "</a>";
		} else {
			hyperlink += '/0';
		}		
		return hyperlink;
	}
	function generateGraph(subtotal, total, subtotalColor){
		var subtotalCell = Math.ceil((subtotal / total) * 100, 0);
		var remainingCell = 100 - subtotalCell;
		if (remainingCell == 0 && (total - subtotal) != 0)
			remainingCell = 1;
		var graph = '<table cellpadding="0" cellspacing="0" width="100%"><tbody>';
		graph += '<tr>';
		if (total != 0) {
			graph += '<td class="wb" align="center" width="' + subtotalCell + '%" bgcolor="' + subtotalColor + '"><font size="1">' + subtotalCell + '%</font></td>';
			graph += '<td class="wb" width="' + remainingCell + '%"></td>';
		}
		graph += '</tr>';
		graph += '</tbody></table>';
		return graph;
	}	
	function generateGraphForTotals(){
		var allCells = 100;//represents 100%
		var hCells = Math.ceil((totals.H.total / totals.total) * 100, 0);
		var mCells = Math.ceil((totals.M.total / totals.total) * 100, 0);
		var tCells = Math.ceil((totals.T.total / totals.total) * 100, 0);
		var rCells = Math.ceil((totals.R.total / totals.total) * 100, 0);
		var cCells = Math.ceil((totals.C.total / totals.total) * 100, 0);
		var eCells = Math.ceil((totals.E.total / totals.total) * 100, 0);
		var oCells = allCells - (hCells + mCells + tCells + rCells + cCells + eCells);
		if (oCells == 0 && totals.X.total != 0)
			oCells = 1;
		
		var graph = '<table cellpadding="0" cellspacing="0" width="100%"><tbody>';
		graph += '<tr class="wb">';
		
		if (totals.H.total != 0) graph += '<td class="wb" align="center" width="' + hCells + '%" bgcolor="' + CombatTypeColors.HG + '"><font size="1">' + hCells + '%</font></td>';
		if (totals.M.total != 0) graph += '<td class="wb" align="center" width="' + mCells + '%" bgcolor="' + CombatTypeColors.MG + '"><font size="1">' + mCells + '%</font></td>';
		if (totals.T.total != 0) graph += '<td class="wb" align="center" width="' + tCells + '%" bgcolor="' + CombatTypeColors.TG + '"><font size="1">' + tCells + '%</font></td>';
		if (totals.R.total != 0) graph += '<td class="wb" align="center" width="' + rCells + '%" bgcolor="' + CombatTypeColors.RG + '"><font size="1">' + rCells + '%</font></td>';
		if (totals.C.total != 0) graph += '<td class="wb" align="center" width="' + cCells + '%" bgcolor="' + CombatTypeColors.CG + '"><font size="1">' + cCells + '%</font></td>';
		if (totals.E.total != 0) graph += '<td class="wb" align="center" width="' + eCells + '%" bgcolor="' + CombatTypeColors.EV + '"><font size="1">' + eCells + '%</font></td>';
		if (totals.X.total != 0) graph += '<td class="wb" align="center" width="' + oCells + '%" bgcolor="' + CombatTypeColors.XY + '"><font size="1">' + oCells + '%</font></td>';
		graph += '</tr>';
		graph += '</tbody></table>';
		return graph;
	}
}

function combatAnalysis(){
	analysisOptionsCookie = getCookie('CombatStatsAnalysisOptions');
	if (analysisOptionsCookie != 0) {
		analysisOptions = new AnalysisOptions();
		analysisOptions.deserialize(analysisOptionsCookie)
		performCombatAnalysis(analysisOptions);
	}
}

function performCombatAnalysis(analysisOptions){
	//by default all analysis options are selected
	//deselect all combat types and select the passed analysis option only
	deselectCombatCheckboxes();
	document.getElementById(analysisOptions.getAnalysisType()).checked = true;
	if (analysisOptions.getWinsOnly()) 
		document.getElementById(CombatResults.losses.code).checked = false;
	performAnalysis();
	var allCenters = document.body.getElementsByTagName('center');
	var firstCenter = allCenters[0];
	var detailTable = document.getElementById('report_table');
	var summaryTable = document.getElementById('summary_table');
	while (firstCenter.hasChildNodes()) {
    	firstCenter.removeChild(firstCenter.lastChild);
	}
	firstCenter.appendChild(document.createElement('br'));
	if (!analysisOptions.getWinsOnly()) {
		firstCenter.appendChild(summaryTable);
		firstCenter.appendChild(document.createElement('br'));
	}
	firstCenter.appendChild(detailTable);
	firstCenter.appendChild(document.createElement('br'));
	document.cookie='CombatStatsAnalysisOptions=0;expires=' + new Date('1999');
}

// save combat data
function saveCombatData() {
	var last_index;

	//delete processed squashman battles
	//////////
	var len = combat_stats.length; 
	var removedBattlesCount = 0;
	for (var z = len - 1; z > 0; z--) {
		if (((combat_stats[z].substring(2,6) == '1030') || (combat_stats[z].substring(2,6) == '1031'))
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
	if (supportsHTML5Storage()) {
		try{
			localStorage[stats_key] = combat_stats.toString();
			localStorage[mercenary_key] = mercenary_stats.toString();
			localStorage[from_key] = update_from;
			localStorage[to_key] = update_to;
		} catch(err) {
			alert(self + ':\nUnable to save data!\nYou might be running out of local storage on your browser.\nPlease contact Theatre Of Pain for advice.');
		}
	} else {	
		GM_setValue(stats_key, combat_stats.toString());
		GM_setValue(mercenary_key, mercenary_stats.toString());
		GM_setValue(from_key, update_from);
		GM_setValue(to_key, update_to);
	}
}

// retrieve combat data
function getCombatData() {
	var stats_key_value;
	var mercenary_key_value;
	if (supportsHTML5Storage()) {
		stats_key_value = (localStorage[stats_key] == undefined)?'':localStorage[stats_key];
		mercenary_key_value = (localStorage[mercenary_key] == undefined)?'':localStorage[mercenary_key];
		update_from = (localStorage[from_key] == undefined)?'':localStorage[from_key];
		update_to = (localStorage[to_key] == undefined)?'':localStorage[to_key];;
	} else {
		stats_key_value = GM_getValue(stats_key, 0);
		mercenary_key_value = GM_getValue(mercenary_key, 0);
		update_from = GM_getValue(from_key, '');
		update_to = GM_getValue(to_key, '');
	}
	if (stats_key_value != '') {
		combat_stats = stats_key_value.split(',');
		for (var z = 0; z < combat_stats.length; z++) {
			combat_stats[z] = combat_stats[z].replace(/\+/g, ',');
		}
	}

	if (mercenary_key_value != '') {
		mercenary_stats = mercenary_key_value.split(',');
	}
}

// this function removes combat data
function removeCombatData() {
	var remove_key = player_name + ' removeStats';
	var remove_stats = getCookie(remove_key);
	if (remove_stats == 0) {
		return;
	}
	document.cookie = player_name + ' collectStats=0;expires=' + new Date('1999');
	document.cookie = player_name + ' autoStats=0;expires=' + new Date('1999');
	document.cookie = player_name + ' removeStats=0;expires=' + new Date('1999');
	document.cookie = player_name + ' from_page=0;expires=' + new Date('1999');
	document.cookie = player_name + ' to_page=0;expires=' + new Date('1999');
	if (supportsHTML5Storage()) {
		localStorage.removeItem(player_key);
		localStorage.removeItem(stats_key);
		localStorage.removeItem(mercenary_key);
		localStorage.removeItem(from_key);
		localStorage.removeItem(to_key);
		localStorage.removeItem(collect_stats_key);
		localStorage.removeItem(colorize_table_key);
	} else {
		GM_deleteValue(player_key);
		GM_deleteValue(stats_key);
		GM_deleteValue(mercenary_key);
		GM_deleteValue(from_key);
		GM_deleteValue(to_key);
		GM_deleteValue(collect_stats_key);
		GM_deleteValue(colorize_table_key);
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
function addCombatStatRec(new_record) {
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
function createMercenaryStatRec(newRecord) {
	if (newRecord.length == 0 || newRecord == undefined) return; 
	var addRecord = true;
	var found = false;
	mercenaryRecord = newRecord.split(Separators.FieldSeparator);
	mercenaryRecord[2].match(/\{(\d+)\}/);//opponent
	var mercenaryMissionType = mercenaryRecord[0];
	var mercenaryMission = mercenaryRecord[2].substring(0, mercenaryRecord[2].indexOf('{'));
	var mercenaryLevel = parseInt(RegExp.$1);
	for (var z = 0; z < mercenary_stats.length; z++) {
		var mercenaryStatsRec = mercenary_stats[z].split(Separators.FieldSeparator);
		mercenaryStatsRec[2].match(/\{(\d+)\}/);
		if (mercenaryMissionType == mercenaryStatsRec[0] &&
			mercenaryMission == mercenaryStatsRec[2].substring(0, mercenaryStatsRec[2].indexOf('{'))) {
			if  (mercenaryLevel > parseInt(RegExp.$1)) {
				mercenary_stats[z] = newRecord;
				return;
			}
			addRecord = false;
		}	
	}
	if (addRecord) {
		mercenary_stats.push(newRecord);
	}
}

// this function indicates if we're tracking stats for the profile
function collectStats() {
	var stats_cookie = getCookie(player_name + ' collectStats');
	var collect_stats;
	if (supportsHTML5Storage()) {
		collect_stats = (localStorage[collect_stats_key] == undefined)?0:localStorage[collect_stats_key];
	} else {	
		collect_stats = GM_getValue(collect_stats_key, 0);
	}
	if ((stats_cookie == 0) && (collect_stats == 0)){
		return false;
	}
	if (stats_cookie != 0) {
		if (supportsHTML5Storage()) {
			localStorage[collect_stats_key] = '1';
		} else {	
			GM_setValue(collect_stats_key, '1');
		}
		document.cookie=player_name + ' collectStats=0;expires=' + new Date('1999');
	}
	return true;
}

function buildAnalysisTable() {
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
	el.id = 'displayAnalysisTable';
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
	filters.width = '1100';
	filters.cellPadding = '10';
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.colSpan = '6';
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
	for (var combatCategory in Labels) {
		tr.appendChild(createHeaderTD('center', Labels[combatCategory].value.bold(), 'wb'));
	}
	filters.appendChild(tr);
	
	// filters
	tr = document.createElement('tr');
	for (var combatCategory in Labels) {
		tr.appendChild(createFilterTD(Labels[combatCategory].code));
		filters.appendChild(tr);
	}
	
	// combat levels
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.appendChild(document.createTextNode('Combat levels:'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);

	td = document.createElement('td');
	td.colSpan = '5';
	td.appendChild(createPlayerLevelsTable());
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
	tr.className = 'wb';
	td.colSpan = '1';
	td.appendChild(document.createTextNode('Combats played from:'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.colSpan = '6';
	el = document.createElement('input');
	el.type = 'input'; 
	el.id = 'from_date';
	el.value = '';
	el.setAttribute('size', 16);
	td.appendChild(el);
	td.appendChild(document.createTextNode('\u0009to\u0009'));
	el = document.createElement('input');
	el.type = 'input'; 
	el.id = 'to_date';
	el.value = '';
	el.setAttribute('size', 16);
	td.appendChild(el);
	td.appendChild(document.createTextNode('\u0009Formatted as \"yyyy-mm-dd hh:mm\". for example: 2011-12-31 23:59'));
	tr.appendChild(td);
	filters.appendChild(tr);
	
	// allies
	td = document.createElement('td');
	tr = document.createElement('tr');
	tr.className = 'wb';
	td.colSpan = '1';
	td.appendChild(document.createTextNode('Allies played with:'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.colSpan = '6';
	el = document.createElement('input');
	el.type = 'input'; 
	el.id = 'allies';
	el.value = '';
	el.setAttribute('size', 16);
	td.appendChild(el);
	td.appendChild(document.createTextNode('\u0009Filter by name of player you played with (AI can be used as well, for example: packmaster)'));
	tr.appendChild(td);
	filters.appendChild(tr);

	// opponents
	td = document.createElement('td');
	tr = document.createElement('tr');
	tr.className = 'wb';
	td.colSpan = '1';
	td.appendChild(document.createTextNode('Opponents played against:'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.colSpan = '6';
	el = document.createElement('input');
	el.type = 'input'; 
	el.id = 'opponents';
	el.value = '';
	el.setAttribute('size', 16);
	td.appendChild(el);
	td.appendChild(document.createTextNode('\u0009Filter by name of player you played against (AI can be used as well, for example: necromancer)'));
	tr.appendChild(td);
	filters.appendChild(tr);

	// combat results
	td = document.createElement('td');
	tr = document.createElement('tr');
	tr.className = 'wb';
	td.colSpan = '1';
	td.appendChild(document.createTextNode('Combat Results:'));
	td.innerHTML = td.innerHTML.bold();
	tr.appendChild(td);
	td = document.createElement('td');
	td.colSpan = '2';
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CombatResults.losses.code;
	td.appendChild(el);
	td.appendChild(document.createTextNode(CombatResults.losses.value));
	el = document.createElement('input');
	el.type = 'checkbox'; 
	el.id = CombatResults.wins.code;
	td.appendChild(el);
	td.appendChild(document.createTextNode(CombatResults.wins.value));
	tr.appendChild(td);
	td = document.createElement('td');
	td.colSpan = '3';
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
	
	function createFilterTD(_combatCategory) {
		td = document.createElement('td');
		td.className = 'wb';
		for(var combatType in CombatTypes){
			if(combatType.substring(0,1) == _combatCategory){
				createInput('checkbox', td, CombatTypes[combatType].code, CombatTypes[combatType].value);
				td.appendChild(document.createElement('br'));
			}
		}
		return td;
	}
	function createInput(type, node, id, label){
		var el = document.createElement('input');
		el.type = type; 
		el.id = id;
		node.appendChild(el);
		node.appendChild(document.createTextNode(label));
	}
	function createHeaderTD(align, innerHTML, className){
		var td = document.createElement('td');
		td.align = align;
		td.innerHTML = innerHTML;
		td.className = className;
		return td;
	}
	function createPlayerLevelsTable(){
		var tbl = document.createElement('table');
		var tr = document.createElement('tr');
		tbl.appendChild(tr);
		
		var maxPlayerLevel = 1;
		if (combat_stats.length > 0) {
			var combatRecord = new CombatRecord(player_id, combat_stats[0]);
			maxPlayerLevel = combatRecord.getPlayerLevel();
		}

		for (var i = 1; i <= maxPlayerLevel; i++){
			var td = document.createElement('td');
			td.align = 'left';
			td.width = 55;
			createInput('checkbox', td, getEncodedPlayerLevel(i), i.toString());
			tr.appendChild(td);
			if (i%10 == 0) {
				tr = document.createElement('tr');//new line for every 10 levels
				tbl.appendChild(tr);
			}
		}
		return tbl;
	}
}

function displayAnalysisTable () {
	if(div.style.display == 'block') {
		document.getElementById('displayAnalysisTable').setAttribute('value', 'Display Analysis Table');
		div.style.display = 'none';
	} else {
		document.getElementById('displayAnalysisTable').setAttribute('value', 'Hide Analysis Table');
		div.style.display = 'block';
	}
}

function selectCombatCheckboxes() {
	setCombatCheckboxes(true);
}

function deselectCombatCheckboxes() {
	setCombatCheckboxes(false);
}

function setCombatCheckboxes(selected) {
	var all_input = document.getElementsByTagName('input');

	for (var z = 0; z <all_input.length; z++) { 
		if ((all_input[z].type == 'checkbox') 
			&& combatTypesToString().indexOf(',' + all_input[z].id + ',') != -1 ) {
				all_input[z].checked = selected;
			}
	}
}

function selectCLCheckboxes() {
	setCLCheckboxes(true);
}

function deselectCLCheckboxes() {
	setCLCheckboxes(false);
}

function setCLCheckboxes(selected) {
	var all_input = document.getElementsByTagName('input');

	for (var z = 0; z <all_input.length; z++) { 
		if ((all_input[z].type == 'checkbox') 
			&& combatLevelsToString().indexOf(',' + all_input[z].id + ',') != -1 ) {
				all_input[z].checked = selected;
			}
	}
}

function selectAllCheckBoxes() {
	selectCombatCheckboxes();
	selectCLCheckboxes();
	document.getElementById(CombatResults.losses.code).checked = true;
	document.getElementById(CombatResults.wins.code).checked = true;
	var colorize;
	if (supportsHTML5Storage()) {
		colorize = (localStorage[colorize_table_key] == undefined)?true:localStorage[colorize_table_key];
	} else {	
		colorize = GM_getValue(colorize_table_key, true);
	}
	document.getElementById('colors').checked = colorize;
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
	var losses_filter = document.getElementById(CombatResults.losses.code).checked;
	var wins_filter = document.getElementById(CombatResults.wins.code).checked;
	var from_date_filter = '';
	var to_date_filter = '';
	var tbl = document.createElement('table');
	var temp_array = new Array();
	var wins = losses = 0;
	var summary_table;
	
	if (supportsHTML5Storage()) {
		localStorage[colorize_table_key] = document.getElementById('colors').checked;
	} else {	
		GM_setValue(colorize_table_key, document.getElementById('colors').checked);
	}
	
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
	td.innerHTML = 'Combat Details for <a href = "http://www.lordswm.com/pl_info.php?nick=' + player_name + '"><b>' + player_name + '</b></a>';
	tr.appendChild(td);
	tbl.appendChild(tr);

	// header
	tr = document.createElement('tr');
	tr.innerHTML = '<td width = \"200\" class="' + cell_class + '" align="center"><b>Timestamp</b></td><td width= \"100\" class="' + cell_class + '" align="center"><b>Combat Type</b></td>'
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

		var combatRecord = new CombatRecord(player_id, combat_stats[i]);
		temp_timestamp = parseInt('20' + combatRecord.getTimeStamp());

		// from date condition check
		if ((from_date_filter != '') && (temp_timestamp < from_date_filter)) {
			continue;
		}

		// to date condition check
		if ((to_date_filter != '') && (temp_timestamp > to_date_filter)) {
			continue;
		}
		temp_combat_type = combatRecord.getCombatType();

		// combat type filter check
		if (document.getElementById(temp_combat_type).checked != true) {
			continue;
		}
		temp_combat_result = combatRecord.getCombatResult();

		// losses filter check
		if ((document.getElementById(CombatResults.losses.code).checked != true) 
			&& (temp_combat_result == 0)) {
			continue;
		}

		//wins filter check
		if ((document.getElementById(CombatResults.wins.code).checked != true) 
			&& (temp_combat_result == 1)) {
			continue;
		}
		temp_player_level = combatRecord.getPlayerLevel();

		// player level filter check
		if (document.getElementById(getEncodedPlayerLevel(temp_player_level)) != null){
			if (document.getElementById(getEncodedPlayerLevel(temp_player_level)).checked != true) {
				continue;
			}
		}
		temp_warid = combatRecord.getWarId();

		// allies filter check
		var reAI = new RegExp(Separators.AIIndicator, 'g');
		var reHuman = new RegExp(Separators.HumanIndicator, 'g');
		var reAlly = new RegExp(Separators.AllySeparator, 'g');
		temp_allies = combatRecord.getAllies();
		if (allies_filter != '') {
			var found = false;
			for (var x = 0; x < temp_allies.length; x++) {
				if (temp_allies[x].toLowerCase().replace(reAlly,'').replace(reHuman,'').replace(reAI,'').match(allies_filter.toLowerCase()) != null) {
					found = true;
				}
			}
			if (!found) continue;
		}
		if (temp_allies != -1) {
			allies_link = '';
			for (var x = 0; x < temp_allies.length; x++) {
				if (temp_allies[x].substring(0,1) == Separators.HumanIndicator) {
					var ally_nick = temp_allies[x].substring(1, temp_allies[x].indexOf('['));
					allies_link += '<a href="http://www.lordswm.com/pl_info.php?nick=' + ally_nick + '">' + temp_allies[x].substring(1) + '</a>, ';
				} else {
					allies_link += '<i>' + temp_allies[x].substring(1) + '</i>, ';
				}
			}
			allies_link = '<a href="http://www.lordswm.com/pl_info.php?nick=' + player_name + '"><font color = "red">' + player_name + '[' + temp_player_level + ']' + '</font></a>, ' + allies_link.substring(0, allies_link.length - 2);
		} else {
			allies_link = '<a href="http://www.lordswm.com/pl_info.php?nick=' + player_name + '"><font color = "red">' + player_name + '[' + temp_player_level + ']' + '</font></a>';
		}
		// opponents filter check
		var temp_opponents = combatRecord.getOpponents();
		if (opponents_filter != '') {
			var found = false;
			for (var x = 0; x < temp_opponents.length; x++) {
				if (temp_opponents[x].toLowerCase().replace(reAlly,'').replace(reHuman,'').replace(reAI,'').match(opponents_filter.toLowerCase()) != null) {
					found = true;
				}
			}
			if (!found) continue;
		}
		if (temp_opponents != -1) {
			opponents_link = '';
			var opponentSeparator = (temp_combat_type == CombatTypes.XE.code)?' vs ':', ';
			for (var x = 0; x < temp_opponents.length; x++) {
				if (temp_opponents[x].substring(0,1) == Separators.HumanIndicator) {
					var opponent_nick = temp_opponents[x].substring(1, temp_opponents[x].indexOf('['));
					opponents_link += '<a href="http://www.lordswm.com/pl_info.php?nick=' + escape(opponent_nick) + '">' 
						+ temp_opponents[x].substring(1) + '</a>' + opponentSeparator;
				} else {
					switch (temp_combat_type) {
						case CombatTypes.MA.code:
							opponents_link += '<i>' + SearchStrings.army + temp_opponents[x].substring(1) + '</i>, ';
							break;
						case CombatTypes.MB.code:
							temp_opponents[x].substring(1).match(/(\D*)({\d*})/);
							opponents_link += '<i>' + RegExp.$1 + SearchStrings.brigands + RegExp.$2 + '</i>, ';
							break;
						case CombatTypes.MC.code:
							temp_opponents[x].substring(1).match(/(\D*)({\d*})/);
							opponents_link += '<i>' + RegExp.$1 + SearchStrings.conspirators + RegExp.$2 + '</i>, ';
							break;
						case CombatTypes.MI.code:
							temp_opponents[x].substring(1).match(/(\D*)({\d*})/);
							opponents_link += '<i>' + RegExp.$1 + SearchStrings.invaders + RegExp.$2 + '</i>, ';
							break;
						case CombatTypes.MM.code:
							temp_opponents[x].substring(1).match(/(\D*)({\d*})/);
							opponents_link += '<i>' + RegExp.$1 + SearchStrings.monster + RegExp.$2 + '</i>, ';
							break;
						case CombatTypes.MR.code:
							temp_opponents[x].substring(1).match(/(\D*)({\d*})/);
							opponents_link += '<i>' + RegExp.$1 + SearchStrings.raid + RegExp.$2 + '</i>, ';
							break;
						case CombatTypes.MV.code:
							opponents_link += '<i>' + SearchStrings.vanguard + temp_opponents[x].substring(1) + '</i>, ';
							break;
						case CombatTypes.TV.code:case CombatTypes.TR.code:
							opponents_link += '<i>' + SearchStrings.caravan + temp_opponents[x].substring(1) + '</i>, ';
							break;
						case CombatTypes.RA.code:
							opponents_link += '<i>' + SearchStrings.thief + temp_opponents[x].substring(1) + '</i>, ';
							break;
						case CombatTypes.XC.code:
							opponents_link += '<i>' + SearchStrings.contestParticipant + temp_opponents[x].substring(1) + '</i>, ';
							break;
						default:
					opponents_link += '<i>' + temp_opponents[x].substring(1) + '</i>, ';
					}
				}
			}
			opponents_link = opponents_link.replace(/\+/g, ',').substring(0, opponents_link.length - opponentSeparator.length);
		}
		if (temp_combat_result == 1) {
			allies_link = '<b>' + allies_link + '</b>';
			wins++;
		} else {
			opponents_link = '<b>' + opponents_link + '</b>';
			losses++;
		}
		combat_description = allies_link + ' vs ' + opponents_link;
		if (combatRecord.getCombatAdditionalInfo().length > 0)
			combat_description += combatRecord.getCombatAdditionalInfo();
		if (document.getElementById('colors').checked == false) {
			if (cell_class == 'wbwhite') {
				cell_class = 'wblight';
			} else {
				cell_class = 'wbwhite';
			}
		} else {
			switch (combatRecord.getCombatCategory()) {
				case Labels.H.code:
					cell_class = 'wb" bgcolor="' + CombatTypeColors.HG;
					break;
				case Labels.M.code:
					cell_class = 'wb" bgcolor="' + CombatTypeColors.MG;
					break;
				case Labels.T.code:
					cell_class = 'wb" bgcolor="' + CombatTypeColors.TG;
					break;
				case Labels.R.code:
					cell_class = 'wb" bgcolor="' + CombatTypeColors.RG;
					break;
				case Labels.C.code:
					cell_class = 'wb" bgcolor="' + CombatTypeColors.CG;
					break;
				case Labels.E.code:
					cell_class = 'wb" bgcolor="' + CombatTypeColors.EV;
					break;
				default:
					if (combatRecord.getCombatType() == CombatTypes.XX.code){
						cell_class = 'wb" bgcolor="' + CombatTypeColors.XX;
					} else {
						cell_class = 'wb" bgcolor="' + CombatTypeColors.XY;
					}
			}
		}

		tr = document.createElement('tr');
		tr.innerHTML = '<td class="' + cell_class + '"><a href ="http://www.lordswm.com/warlog.php?warid=' + temp_warid + '">' 
						+ combatRecord.getFormattedTimeStamp() + '&nbsp;'
						+ '</a><a href ="http://www.lordswm.com/warlog.php?warid=' + temp_warid + '&lt=-1">[Full]</a><a href ="http://www.lordswm.com/battlechat.php?warid=' + temp_warid + '">[Chat]</a></td>'
						+ '<td class="' + cell_class + '">' + CombatTypes[temp_combat_type].value + '</td>'
						+ '<td class="' + cell_class + '">' + combat_description + '</td>'
		tbl.appendChild(tr);
	}
	
	div.appendChild(tbl);
	if ((document.getElementById(CombatResults.losses.code).checked != true) 
		|| (document.getElementById(CombatResults.wins.code).checked != true)
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
	new_log_table = '<br><table id="logTable" class="wb" cellpadding="4">';
	for (var i = 0; i < split_table.length; i++) {
		var rawCombatRecord = new RawCombatRecord(player_id, split_table[i]);
		var combatRecord = new CombatRecord(player_id, rawCombatRecord.getFormattedRecord());
		switch (combatRecord.getCombatCategory()) {
			case Labels.H.code:
				bg_color = CombatTypeColors.HG;
				break;
			case Labels.M.code:
				bg_color = CombatTypeColors.MG;
				break;
			case Labels.T.code:
				bg_color = CombatTypeColors.TG;
				break;
			case Labels.R.code:
				bg_color = CombatTypeColors.RG;
				break;
			case Labels.C.code:
				bg_color = CombatTypeColors.CG;
				break;
			case Labels.E.code:
				bg_color = CombatTypeColors.EV;
				break;
			case Labels.X.code:
				bg_color = CombatTypeColors.XY;
				if (combatRecord.getCombatType() == CombatTypes.XX.code)
					bg_color = CombatTypeColors.XX;
				break;
			default:
				bg_color = CombatTypeColors.XX;
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
 
 function autoProcess() {
 	var auto_process = getCookie(player_name + ' autoStats');
	if (auto_process == 1) {
		var from_page = getCookie(player_name + ' from_page');
		if (from_page == 0) {
			var confirm_automation = confirm('The script can automate parsing of the combat log for this profile.\n' +
											 'You can alternatively do that manually by visiting each page in the log.\n' +
											 'Do you want to automate parsing of the log?');
			if (!confirm_automation) {
				document.cookie = player_name + ' autoStats=0;expires=' + new Date('1999');
				return;
			}
			var all_tds = document.getElementsByTagName('td');
			var td;
			for (var i = 0; i < all_tds.length; i++) {
				if (all_tds[i].innerHTML.indexOf('Combats fought:') != -1) {
					td = all_tds[i];
				}
			}
			var matched = td.innerHTML.match(/<b>(\d+)<\/b>/);
			var combats_fought = RegExp.$1;
			var total_pages = parseInt(combats_fought/40);
			if (combats_fought%40 > 0) {total_pages++;}
			document.cookie = player_name + ' from_page=0';
			document.cookie = player_name + ' to_page=' + total_pages;
			if (debug) GM_log('Combats fought = ' + combats_fought +
							  '\nTotal pages = ' + total_pages);
		}
		setTimeout( function() { processCombatPages(); }, auto_parsing_interval*1000);
	}
}
 
 function processCombatPages() {
	var from_page = getCookie(player_name + ' from_page');
	var to_page = getCookie(player_name + ' to_page');
	from_page++;
	document.cookie = player_name + ' from_page=' + from_page;

	if (from_page <= to_page) {
		var pagePath = 'http://www.lordswm.com/pl_warlog.php?id=' + player_id + '&page=' + --from_page;
		opened_window = window.open(pagePath, 'log_window');
	} else {
		document.cookie = player_name + ' autoStats=0;expires=' + new Date('1999');
		document.cookie = player_name + ' from_page=0;expires=' + new Date('1999');
		document.cookie = player_name + ' to_page=0;expires=' + new Date('1999');
	}
}

function checkForLatestVersion() {
	//detect browser support
	if (window.XMLHttpRequest) {
		var request = new XMLHttpRequest();
		var url = "https://dl.dropboxusercontent.com/u/39596449/LWM/LWMLatestScriptVersions.txt";
		
		request.open("GET",url,false);
		request.send(null);
		if (request.status!=200) return;//unsuccessful

		var scripts = request.responseText.split("\n");
		for (var i = 0; i < scripts.length; i++) {
			var scriptParts = scripts[i].split('|');
			var scriptName = scriptParts[0];
			var scriptVersion = scriptParts[1];
			var scriptURL = scriptParts[2];
			var scriptComments = scriptParts[3];
			if (self == scriptName) {
				var newVersionNumber = new VersionNumber(scriptVersion);
				var currentVersionNumber = new VersionNumber(selfVersion);

				if (newVersionNumber.getMajorVersion() >= currentVersionNumber.getMajorVersion()
					&& newVersionNumber.getMinorVersion() >= currentVersionNumber.getMinorVersion()
					&& newVersionNumber.getRevisionNumber() > currentVersionNumber.getRevisionNumber()){
					
					var	newVersionCookie = getCookie(self + 'NewVersion');
					if (newVersionCookie == 0){
						//reminder if user does not update script in 3 days
						var reminderDate = new Date();
						var remindAfterDays = 3;
						reminderDate.setDate(reminderDate.getDate() + remindAfterDays); 
						document.cookie = self + 'NewVersion=1;expires=' + reminderDate;
						
						var message = 'Script has detected a new version available: ' + scriptVersion + '\n\n';
						message += scriptComments + '\n\n';
						message += 'Press "OK" to go to the source page and download it.';
					
						var response = confirm(message);
						if (response)
							var newWindow = window.open(scriptURL, 'Script Update');
					}
				}
			}
		}
	}
}