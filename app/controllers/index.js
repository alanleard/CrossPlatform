// Add view to menu container exposed by widget
$.drawermenu.drawermenuview.add(Alloy.createController("menu").getView());

//Create main view controller
var main = Alloy.createController("main");

//Add click event listener to open/close menu
main.logo.addEventListener('click',$.drawermenu.showhidemenu);

// Add view to main view container exposed by widget
$.drawermenu.drawermainview.add(main.getView());

//Open main window
$.index.open();

//Setup Android Specific Items
if(OS_ANDROID){
	$.index.addEventListener("androidBack",$.drawermenu.showhidemenu);
	
	var activity = $.index.activity;

	activity.onCreateOptionsMenu = function(e){
	  var menu = e.menu;
	  var menuItem = menu.add({ 
	    title: "Item 1", 
	    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
	  });
	  menuItem.addEventListener("click", function(e) {
	    alert("Item 1 Clicked!");
	  });
	};
}

//Setup TouchTest module for iOS
if (OS_IOS)
{
  var touchTestModule = undefined;
  try
  {
    touchTestModule = require("com.soasta.touchtest");
  }
  catch (tt_exception)
  {
    Ti.API.error("com.soasta.touchest module is required");
  }

  var cloudTestURL = Ti.App.getArguments().url;
  if (cloudTestURL != null)
  {
    // The URL will be null if we don't launch through TouchTest.
    touchTestModule && touchTestModule.initTouchTest(cloudTestURL);
  }

  Ti.App.addEventListener('resumed',function(e)
  {
    // Hook the resumed from background
    var cloudTestURL = Ti.App.getArguments().url;
    if (cloudTestURL != null)
    {
      touchTestModule && touchTestModule.initTouchTest(cloudTestURL);
    }
  });
}