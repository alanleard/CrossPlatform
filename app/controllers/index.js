// Add view to menu container exposed by widget
$.drawermenu.drawermenuview.add(Alloy.createController("menu").getView());

//Create main view controller
var main = Alloy.createController("main");

//Add click event listener to open/close menu
main.logo.addEventListener('click',$.drawermenu.showhidemenu);

// Add view to main view container exposed by widget
$.drawermenu.drawermainview.add(main.getView());

Alloy.Globals.MainView = main.getView();

//Open main window
$.index.open();
