// ==UserScript==
// @name        LWMMailUtility
// @author		TheatreOfPain
// @version		1.0.121020
// @description This script provides the functionality to custom sort messages in Inbox
// @include     http://www.lordswm.com/sms.php*
// ==/UserScript==


const MESSAGE_ATTRIBUTES = 7;
const SMS_ID = 0;
const PLAYER_NAME = 1;
const PLAYER_ID = 2;
const DATE = 3;
const FLAG = 4;
const SUBJECT = 5;
const IS_READ = 6;

const RECORD_SEP = '{|}';
const ARRAY_SEP = '}||{';

const SORT_INACTIVE = 'black';
const SORT_ACTIVE = 'blue';
const SORT_ASC = '\u25B2';
const SORT_DESC = '\u25BC';

const SORT_BY_PLAYER = 0;
const SORT_BY_DATE = 1;
const SORT_BY_SUBJECT = 2;

const SORT_FILTER_ID = 'sortFilter';

const INBOX_PAGE = 0;
const OUTBOX_PAGE = 1;

var selectedPage; //inbox or outbox
var messagesTable;
var searchTable;
var playerName;
var serverName;
var messages;
var sortedMessages;
var btnPlayer;
var btnDate;
var btnSubject;
var currentSortType;

main();

function main() {
	selectedPage = getSelectedPage();
	playerName = getPlayerName();
	serverName = getServerName();
	loadMessages();
	messagesTable = getMessagesTable();
	searchTable = getSearchTable();
	processMessages();
	displaySortingButtons();
}

function getSelectedPage(){
	if (location.href.indexOf('box=out') != -1) {
		return OUTBOX_PAGE;
	} else {
		return INBOX_PAGE;
	}
}

function getPlayerName() {
	var all_params = document.getElementsByTagName('param');
	for (var i = 0; i < all_params.length; i++) {
		if (all_params[i].name == 'FlashVars') {
			return all_params[i].value.split('|')[3];
		}
	}
}

function getServerName(){
	if (window.location.href.indexOf('lordswm.com') != -1) {
    	return '.com';
	} else {
		return '.ru';
	}
}

function getMessagesTable() {
	allTables = document.getElementsByTagName('tbody');
	for (var i = 0; i < allTables.length; i++) {
		if ((allTables[i].innerHTML.indexOf('Date') != -1)
		&& (allTables[i].innerHTML.indexOf('Subject') != -1)) {
			var table = allTables[i];
		}
	}
	return table;
}

function getSearchTable() {
	allTables = document.getElementsByTagName('tbody');
	for (var i = 0; i < allTables.length; i++) {
		if ((allTables[i].innerHTML.indexOf('Inbox') != -1) 
		&& (allTables[i].innerHTML.indexOf('Outbox') != -1)
		&& (allTables[i].innerHTML.indexOf('Clan mail') != -1)) {
			var table = allTables[i];
		}
	}
	return table;
}

function processMessages() {
	var allTRs = messagesTable.getElementsByTagName('tr');
	if (allTRs.length < 2) return;
	
	for (var i = 1; i < allTRs.length; i++) {
		allTDs = allTRs[i].getElementsByTagName('td');
		if (allTDs[0].colSpan > 1) {
			continue;
		}

		var message = new Array(MESSAGE_ATTRIBUTES);
		
		// sender name and id
		message[PLAYER_NAME] = allTDs[0].textContent;
		var playerIDPattern = /pl_info.php\?id=(\d+)/;
		allTDs[0].innerHTML.match(playerIDPattern);
		message[PLAYER_ID] = RegExp.$1;

		// sms id
		message[SMS_ID] = allTDs[1].firstChild.value;

		// sms id
		message[DATE] = allTDs[2].textContent;

		// message subject
		var subjectIndex;
		if (selectedPage == INBOX_PAGE){
			subjectIndex = 4;
		} else {
			subjectIndex = 3;
		}
		message[SUBJECT] = allTDs[subjectIndex].textContent.replace(/\[new\]/g,'');

		// flag and read indicator - inbox only
		if (selectedPage == INBOX_PAGE) {
			var flagPattern = /i\/sms_flag_imp\.gif/;
			var matched = allTDs[3].innerHTML.match(flagPattern);
			if (matched) {
				message[FLAG] = 1;
			} else {
				message[FLAG] = 0;
			}
	
			var isRead = allTDs[4].innerHTML.indexOf('[new]');
			if (isRead != -1) {
				message[IS_READ] = 1;
			} else {
				message[IS_READ] = 0;
			}
		}
		
		if (isNewMessage(message)) {
			messages.push(message.join(RECORD_SEP));
		}
		
	}
	saveMessages();
}

function displaySortingButtons(){
	var allTRs = messagesTable.getElementsByTagName('tr');
	if (allTRs.length < 2) return;
	
	var headerTR = allTRs[0];
	headerTDs = headerTR.getElementsByTagName('td');
	
	btnPlayer = document.createElement('input');
	btnPlayer.type = 'button';
	btnPlayer.addEventListener('click', sortByPlayer, false);
	btnPlayer.setAttribute('value', SORT_ASC);
	btnPlayer.style.color = SORT_INACTIVE;
	btnPlayer.style.fontStyle = 'bold';
	btnPlayer.style.fontSize = '16px';
	headerTDs[0].appendChild(btnPlayer);

	btnDate = document.createElement('input');
	btnDate.type = 'button';
	btnDate.addEventListener('click', sortByDate, false);
	btnDate.setAttribute('value', SORT_ASC);
	btnDate.style.color = SORT_INACTIVE;
	btnDate.style.fontStyle = 'bold';
	btnDate.style.fontSize = '16px';
	headerTDs[2].appendChild(btnDate);

	btnSubject = document.createElement('input');
	btnSubject.type = 'button';
	btnSubject.addEventListener('click', sortBySubject, false);
	btnSubject.setAttribute('value', SORT_ASC);
	btnSubject.style.color = SORT_INACTIVE;
	btnSubject.style.fontStyle = 'bold';
	btnSubject.style.fontSize = '16px';
	if (selectedPage == INBOX_PAGE) {
		headerTDs[4].appendChild(btnSubject);
	} else {
		headerTDs[3].appendChild(btnSubject);
	}
}

function isNewMessage(newMessage){
	var l = messages.length;
	for (var z = 0; z<l; z++) {
		var tempMessage = messages[z].split(RECORD_SEP);
		if (tempMessage[SMS_ID] == newMessage[SMS_ID]) {
			messages[z] = newMessage.join(RECORD_SEP);
			return false;
		}
	}
	return true;
}

function saveMessages(){
	var messagesKey = playerName + serverName;
	if (selectedPage == INBOX_PAGE) {
		messagesKey += ' inboxMessages';
	} else {
		messagesKey += ' outboxMessages';
	}
	messages.sort();
	messages.reverse();
	GM_setValue(messagesKey, messages.join(ARRAY_SEP).toString());
}

function loadMessages(){
	var messagesKey = playerName + serverName;
	if (selectedPage == INBOX_PAGE) {
		messagesKey += ' inboxMessages';
	} else {
		messagesKey += ' outboxMessages';
	}
	var messagesData = GM_getValue(messagesKey, 0);
	if (messagesData != 0) {
		messages = messagesData.split(ARRAY_SEP);
	} else {
		messages = new Array();
	}
}

function sortByPlayer(){
	resetSort(btnDate);
	resetSort(btnSubject);
	sortingStyle(btnPlayer);
	sortMessages(SORT_BY_PLAYER, this.value);
}

function sortByDate(){
	resetSort(btnPlayer);
	resetSort(btnSubject);
	sortingStyle(btnDate);
	sortMessages(SORT_BY_DATE, this.value);
}

function sortBySubject(){
	resetSort(btnPlayer);
	resetSort(btnDate);
	sortingStyle(btnSubject);
	sortMessages(SORT_BY_SUBJECT, this.value);
}

function resetSort(btn){
	btn.style.color = SORT_INACTIVE;
	btn.setAttribute('value', SORT_ASC);
}

function sortingStyle(btn){
	if (btn.style.color == SORT_INACTIVE) {
		btn.style.color = SORT_ACTIVE;
	} else {
		if (btn.value == SORT_ASC) {
			btn.setAttribute('value', SORT_DESC);
		} else {
			btn.setAttribute('value', SORT_ASC);
		}
	}
}

function sortMessages(byType, sortingMode){
	prepareSortedMessages(messages, byType, sortingMode);
	displayMessages(sortedMessages);
	displaySortFilter();
}

function prepareSortedMessages(unSortedMessages, byType, sortingMode){
	var sortKeys = new Array();
	currentSortType = byType;
	var len = unSortedMessages.length;
	if (len == 0) return;
	
	switch (byType) {
	case SORT_BY_PLAYER:
		for (var i = 0; i<len; i++) {
			var tempMessage = unSortedMessages[i].split(RECORD_SEP);
			sortKeys.push(tempMessage[PLAYER_NAME].toUpperCase() + RECORD_SEP + tempMessage[SMS_ID]);
		}
		break;
	case SORT_BY_DATE:
		for (var i = 0; i<len; i++) {
			var tempMessage = unSortedMessages[i].split(RECORD_SEP);
			sortKeys.push(tempMessage[SMS_ID] + RECORD_SEP + tempMessage[SMS_ID]);
		}
		break;
	case SORT_BY_SUBJECT:
		for (var i = 0; i<len; i++) {
			var tempMessage = unSortedMessages[i].split(RECORD_SEP);
			sortKeys.push(tempMessage[SUBJECT].toUpperCase() + RECORD_SEP + tempMessage[SMS_ID]);
		}
	}

	sortKeys.sort();
	if (sortingMode == SORT_DESC) {
		sortKeys.reverse();
	}
	
	sortedMessages = new Array();
	for (var i = 0; i<len; i++) {
		var splitKeys = sortKeys[i].split(RECORD_SEP);
		var smsID = splitKeys[1];
		for (var j = 0; j<len; j++) {
			var message = unSortedMessages[j].split(RECORD_SEP);
			if (message[SMS_ID] == smsID) {
				sortedMessages.push(unSortedMessages[j]);
				break;
			}
		}
	}
	return sortedMessages;
}

function displayMessages(messages){
	var allTRs = messagesTable.getElementsByTagName('tr');
	if (allTRs.length < 2) return;
	for (var i = allTRs.length - 1; i > 0; i--) {
		allTDs = allTRs[i].getElementsByTagName('td');
		if (allTDs[0].colSpan > 1) {
			continue;
		}
		allTRs[i].parentNode.removeChild(allTRs[i]);
	}

	var referenceTR = allTRs[0]; // insert new TRs after header
	var trClass1 = 'wblight';
	var trClass2 = 'wblight2';
	var len = messages.length;
	for (var i = 0; i<len; i++) {
		var tempMessage = messages[i].split(RECORD_SEP);
		var TR = document.createElement('tr');
		TR.className = (i%2 == 0)?trClass1:trClass2;
		
		var playerTD = document.createElement('td');
		playerTD.align = 'left';
		playerTD.innerHTML = '<a name="hwm_hero" style="text-decoration:none;" href="pl_info.php?id=' + tempMessage[PLAYER_ID] 
			+ '"><b>' + tempMessage[PLAYER_NAME] + '</b></a>';
		TR.appendChild(playerTD);
		
		var inputTD = document.createElement('td');
		TR.appendChild(inputTD);
		
		var dateTD = document.createElement('td');
		dateTD.align = 'left';
		dateTD.innerHTML = '<font style="font-size:9px">&nbsp;' + tempMessage[DATE] + '&nbsp;</font>';
		TR.appendChild(dateTD);

		if (selectedPage == INBOX_PAGE) {
			var flagged = '';
			if (tempMessage[FLAG] == 1) flagged = '_imp';
			var flagTD = document.createElement('td');
			flagTD.align = 'center';
			flagTD.innerHTML = '<a href="sms.php?action=mark&amp;id=' + tempMessage[SMS_ID] + '"><img src="i/sms_flag' 
				+ flagged + '.gif" title="Flag" height="16" border="0" width="16"></a>';
			TR.appendChild(flagTD);
		}
		
		var read = '';
		if (tempMessage[IS_READ] == 1) read = '<font color="#5ACE5A"><b>[new]</b></font>';
		var subjectTD = document.createElement('td');
		subjectTD.align = 'left';
		var smsTitle = '<a href="sms.php?sms_id=' + tempMessage[SMS_ID];
		if (selectedPage == OUTBOX_PAGE) {
			smsTitle += '&box=out';
		}
		smsTitle += '">' + read + tempMessage[SUBJECT] + '</a>';
		subjectTD.innerHTML = smsTitle;
		TR.appendChild(subjectTD);

		referenceTR.parentNode.insertBefore(TR, referenceTR.nextSibling);
		referenceTR = TR; // to insert after the new added TR
	}
}

function displaySortFilter(){
	if (document.getElementById(SORT_FILTER_ID)) {
		return;
	}
	
	var TR = document.createElement('tr');
	var TD = document.createElement('td');
	TD.colSpan = 2;
	TR.appendChild(TD);	
	searchTable.appendChild(TR);
	searchTable.appendChild(TR);
	searchTable.appendChild(TR);
	searchTable.appendChild(TR);
	searchTable.appendChild(TR);

	TR = document.createElement('tr');
	TD = document.createElement('td');
	TD.colSpan = 2;
	var filterLabel = document.createTextNode('Filter messages');
	TD.appendChild(filterLabel);
	TR.appendChild(TD);
	searchTable.appendChild(TR);

	TR = document.createElement('tr');
	TD = document.createElement('td');
	TD.colSpan = 2;
	var filterTextField = document.createElement('input');
	filterTextField.id = SORT_FILTER_ID;
	filterTextField.type = 'input';
	filterTextField.style.width = 165;
	filterTextField.addEventListener('keyup', keyPressed, false);
	TD.appendChild(filterTextField);
	
	TR.appendChild(TD);
	searchTable.appendChild(TR);
}

function keyPressed(){
	filterResults();
}

function filterResults(){
	var filter = document.getElementById(SORT_FILTER_ID).value.toLowerCase();
	if (filter.length == 0) {
		displayMessages(sortedMessages);
		return;
	}
	
	var sortedColumn;
	switch (currentSortType) {
	case SORT_BY_PLAYER:
		sortedColumn = PLAYER_NAME;
		break;
	case SORT_BY_DATE:
		sortedColumn = DATE;
		break;
	case SORT_BY_SUBJECT:
		sortedColumn = SUBJECT;
	}
	
	var filteredMessages = new Array();
	var len = sortedMessages.length;
	for (var i = 0; i<len; i++) {
		var tempMessage = sortedMessages[i].split(RECORD_SEP);
		var matched = tempMessage[sortedColumn].toLowerCase().match(filter);
		if (matched) filteredMessages.push(sortedMessages[i]);
	}
	messages = filteredMessages;
	displayMessages(filteredMessages);
}