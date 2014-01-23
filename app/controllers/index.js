$.index.open();

Ti.Geolocation.purpose = "Setting your location";
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_LOW;

var couponArr = [
	"http://www.trafficwave.net/images/banners/email_marketing234x60a.gif",
	"http://www.trafficwave.net/images/banners/email_marketing234x60b.gif",
	"http://www.trafficwave.net/images/banners/email_marketing234x60c.gif",
];
var annotations = [];
var couponCount = 0;
var myRow = null;
var favoriteCoupons = [];
var couponInterval = setInterval(function(){
	$.coupons.setUrl(couponArr[couponCount]);
	couponCount++;
	if(couponCount>2){
		couponCount = 0;
	}
}, 3000);

var data = [
	{
		latitude: 37.389569,
		longitude: -122.050212,
		title: 'Appcelerator HQ',
		image:"http://media.tumblr.com/tumblr_m1hzbmMNrs1qznie6.jpg"
	},
	{
		latitude: 37.331689,
		longitude: -122.030731,
		title: 'Apple HQ',
		image:"http://www.bangor.ac.uk/itservices/office365/images/apple.png"
	},
	{
		latitude: 37.422502,
		longitude: -122.0855498,
		title: 'Google HQ',
		image:"https://cdn1.iconfinder.com/data/icons/yooicons_set01_socialbookmarks/512/social_google_box.png"
	}
];

for(var i in data){
	annotations.push(Ti.Map.createAnnotation({latitude:data[i].latitude, longitude:data[i].longitude, title:data[i].title, animated:true}));
	var row = Alloy.createController("row", {title:data[i].title, annotation:i, image:data[i].image}).getView();
	row.addEventListener("click", tblClick);
	$.table.add(row);
}

$.mapview.setAnnotations(annotations);

function locate(evt){
	if(evt.source.text == L("button_name")){
		evt.source.text = L("button_locating");
		Ti.Geolocation.getCurrentPosition(function(e) {
			if(e.coords && e.coords.latitude && data.length<4){	
				var closest = require("closest");
				alert(closest(e.coords.latitude, e.coords.longitude, data).title+" is the closest location.");
			    data.push(
				    {
						latitude: e.coords.latitude,
						longitude: e.coords.longitude,
						title: 'Your Location',
						image:"http://blog.nac.net/Portals/215004/images/location_icon-resized-600.png"
					}
				);
	
				annotations.push(Ti.Map.createAnnotation({latitude:data[3].latitude, longitude:data[3].longitude, title:data[3].title, animated:true}));
				myRow = Alloy.createController("row", {title:data[3].title, annotation:3, image:data[3].image}).getView();
				myRow.addEventListener("click", tblClick);
				$.table.add(myRow);
				
			 	
				$.mapview.addAnnotation(annotations[3]);
				$.mapview.setRegion({latitude:e.coords.latitude, longitude:e.coords.longitude, latitudeDelta:0.5, longitudeDelta:0.5});	
				$.mapview.selectAnnotation(annotations[3]);
				evt.source.text = L("button_located");
				
			} else {
				if(data.length==4){
					evt.source.text = L("button_located");
					setTimeout(function(){
						$.location.text = L("button_remove");
					}, 5000);
				} else {
					evt.source.text = L("button_failed");
				}
			}
	}); 
	} else {
		if(data.length==4){
			$.mapview.removeAnnotation(annotations[3]);
			$.table.remove(myRow);
			annotations.pop();
			data.pop();
		}
		evt.source.text = L("button_name");
	}
};

function tblClick(e){
	$.mapview.setRegion({latitude:annotations[e.source.annotation].latitude, longitude:annotations[e.source.annotation].longitude, latitudeDelta:0.1, longitudeDelta:0.1});
	$.mapview.selectAnnotation(annotations[e.source.annotation]);
}

function scanBarcode(){
	var barcode = require("barcode");
	barcode();
}

function couponClick(){
	
	if(favoriteCoupons.indexOf(couponArr[couponCount])!="-1"){
		alert("Coupon #"+(couponCount+1)+" has already been added to your favorites.");
	} else {
		favoriteCoupons.push(couponArr[couponCount]);
		alert("Coupon #"+(couponCount+1)+" has been added to your favorites.");
	}
}

//Automated Testing Injection Code
if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad')
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