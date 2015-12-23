// ==UserScript==
// @name        LWMQueuedArts
// @include     http://www.lordswm.com/inventory.php
// @version     1
// @grant       none
// ==/UserScript==

var allAnchors = document.links;
var artCounter = 0;
for (var i=0; i < allAnchors.length; i++){
	if (allAnchors[i].text.toLowerCase() == "pay") {
		artCounter++;
		var newNodeText = artCounter + " ";
		var artCount = document.createTextNode(newNodeText);
		allAnchors[i].parentNode.insertBefore(artCount, allAnchors[i].parentNode.firstChild);
		console.log(allAnchors[i].text);
	}
}