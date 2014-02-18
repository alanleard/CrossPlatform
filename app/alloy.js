// START: APM service code injection
// Require the apm module
Alloy.Globals.apm = undefined;
try {
Alloy.Globals.apm = require("com.appcelerator.apm");
}
catch (e) {
Ti.API.info("com.appcelerator.apm module is not available");
}

// Initialize the module if it is defined
Alloy.Globals.apm && Alloy.Globals.apm.init();
// END: APM code injection

Ti.Map = OS_IOS || OS_ANDROID?require("ti.map"):Ti.Map;
//Ti.Map = OS_ANDROID?require("ti.map"):OS_IOS?require("com.moshemarciano.googlemaps"):Ti.Map;

Alloy.Globals.customMapView = (function(){
	return Ti.UI.createView({
		backgroundColor:"blue",
		height:100,
		width:100,
		opacity:"50%"
	});
})();
