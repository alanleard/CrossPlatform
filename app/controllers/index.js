$.index.open();

function btnClick(){
	alert("Button Click");
}

function tblClick(e){
	$.mapview.setRegion({latitude:annotations[e.index].latitude, longitude:annotations[e.index].longitude, latitudeDelta:0.1, longitudeDelta:0.1});
	$.mapview.selectAnnotation(annotations[e.index]);
}

var annotations = [
	Ti.Map.createAnnotation({
		latitude: 37.389569,
		longitude: -122.050212,
		title: 'Appcelerator HQ',
		subtitle: 'Mountain View, CA',
		animate: true,
		pincolor: Ti.Map.ANNOTATION_GREEN
	}),
	Ti.Map.createAnnotation({
		latitude: 37.331689,
		longitude: -122.030731,
		title: 'Apple HQ',
		subtitle: 'Cupertino, CA',
		animate: true
	}),
	Ti.Map.createAnnotation({
		latitude: 37.422502,
		longitude: -122.0855498,
		title: 'Google HQ',
		subtitle: 'Mountain View, CA',
		animate: true
	})
];

$.mapview.setAnnotations(annotations);



