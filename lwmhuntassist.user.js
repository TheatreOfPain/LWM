// ==UserScript==
// @author			TheatreOfPain
// @name			LWM Hunt Assist
// @description		This script alerts you when there's a hunt you can assist
// @include			http://www.lordswm.com/*
// ==/UserScript==

if ((document.body.innerHTML.indexOf("lapa.gif") != -1) && (document.body.innerHTML.indexOf("Hunter needs help!") != -1)) {
	var NoAlertCookie = getCookie('NoHuntAssist');
	if (NoAlertCookie == 0) {
		alert("Hunter's assistance required!");
		var newTime = new Date;
		newTime.setMinutes(newTime.getMinutes() + 5);
		document.cookie = 'NoHuntAssist=1;expires=' + newTime;
	}
}

// this function returns the value of a stored cookie
function getCookie(cookie_key) {
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++) {
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==cookie_key) {
			return unescape(y);
		}
	}
	return 0;
}