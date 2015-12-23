// ==UserScript==
// @name			LWM Battle start sound
// @author			TheatreOfPain
// @description		This script will play a sound when any battle starts. It's intended to prevent AFK in thief ambushes, but it doesn't differentiate between an ambush or any other battle type, so it'll play the sound no matter what the battle is
// @include			http://www.lordswm.com/war.php*
// ==/UserScript==

var div = document.createElement("div");
var sound_file_url = 'http://dl.dropbox.com/u/39596449/LWM/08.Skyforger.mp3';
div.innerHTML= "<embed src='" + sound_file_url + "' hidden=true autostart=true loop=false>";
document.body.appendChild(div);
