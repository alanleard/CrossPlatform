// add view to container exposed by widget
$.drawermenu.drawermenuview.add(Alloy.createController("menu").getView());

// add view to container exposed by widget
var main = Alloy.createController("main");
$.drawermenu.drawermainview.add(main.getView());
main.logo.addEventListener('click',$.drawermenu.showhidemenu);

$.index.open();
