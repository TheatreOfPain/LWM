// ==UserScript==
// @name			LWM New Message Sound
// @author			TheatreOfPain
// @version			1.0.121110
// @description		This script will play a sound when player receives a new message
// @include			http://www.lordswm.com/*
// ==/UserScript==

if (document.body.innerHTML.indexOf("pismo.gif") != -1) {
	var NoAlertCookie = getCookie('NoNewMessage');
	if (NoAlertCookie == 0) {
		var div = document.createElement("div");
		var sound_file_url = 'https://dl.dropbox.com/u/39596449/LWM/Amorphis-Silent%20Waters-08-Shaman.mp3';
		div.innerHTML= "<embed src='" + sound_file_url + "' hidden=true autostart=true loop=false>";
		document.body.appendChild(div);
		var newTime = new Date;
		newTime.setMinutes(newTime.getMinutes() + 5);
		document.cookie = 'NoNewMessage=1;expires=' + newTime;
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