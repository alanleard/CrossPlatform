var args = arguments[0] || {};

function open(evt){
	require("/"+evt.source.id)();
}
