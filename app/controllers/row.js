var args = arguments[0] || {};

$.title.text = args.title;
$.image.image = args.image;
$.row.annotation = args.annotation;

$.row.applyProperties({
	annotation:args.annotation,
	title:args.title,
	phone:args.phone
});

function touch(e){
	
	$.row.backgroundColor = Alloy.CFG.theme;
	$.title.color = "#fff";
	setTimeout(function(){
		$.row.backgroundColor = "transparent";
		$.title.color = "#000";
	},150);
		
}
