var args = arguments[0] || {};

function open(evt){
	require("/"+evt.source.id)();
}

function encrypt(){
	var crypto = require("crypto");
	crypto.init("KEYSIZE_AES128");
	alert("'This is my text to be encrypted.'\nThis is the encrypted text: "+crypto.encrypt({source:"This is my text to be encrypted.", type:"TYPE_HEXSTRING"}));
}
