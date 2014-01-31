
Ti.Geolocation.purpose = "Setting your location";
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_LOW;
Ti.Geolocation.preferredProvider = "gps";

var customMapView = true;

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
		image:"http://media.tumblr.com/tumblr_m1hzbmMNrs1qznie6.jpg",
		phone:'+1-650-200-4255'
	},
	{
		latitude: 37.331689,
		longitude: -122.030731,
		title: 'Apple HQ',
		image:"http://www.bangor.ac.uk/itservices/office365/images/apple.png",
		phone:'+1-800-692-7753'
	},
	{
		latitude: 37.422502,
		longitude: -122.0855498,
		title: 'Google HQ',
		image:"https://cdn1.iconfinder.com/data/icons/yooicons_set01_socialbookmarks/512/social_google_box.png",
		phone:'+1-855-492-5538'
	}
];

for(var i in data){
	
	annotations.push(Ti.Map.createAnnotation({latitude:data[i].latitude, longitude:data[i].longitude, title:data[i].title, animated:true, canShowCallout:customMapView?false:true}));
	
	var row = Alloy.createController("row", {title:data[i].title, annotation:i, image:data[i].image, phone:data[i].phone}).getView();
	
	if(OS_IOS ||OS_ANDROID){
		row.addEventListener(OS_IOS?"longpress":"longclick", addContact);
		row.addEventListener("touchend", tblClick);
	} else {
		row.addEventListener("click", tblClick);
	}
	
	$.table.add(row);
}

$.mapview.setAnnotations(annotations);

function locate(evt){
	if(evt.source.text == L("button_name")){
		evt.source.text = L("button_locating");
		Ti.Geolocation.getCurrentPosition(function(e) {
			
			if(e.coords && e.coords.latitude && data.length<4){	
				var closest = require("closest");
				alert(closest(e.coords.latitude, e.coords.longitude, data).title+" is the closest location.\n");
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

function emailPicture(){
	if(Ti.Media.availableCameras && Ti.Media.availableCameras.length==0){
		Ti.Media.openPhotoGallery({
			success:email,
			cancel:function(){},
			error:function(){}
		});
	} else {
		Ti.Media.showCamera({
			success:email,
			cancel:function(){},
			error:function(){}
		});
	}
	
	function email(event){
		var photo = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "photo.png");
		photo.write(event.media);
		setTimeout(function(){
			var emailDialog = Ti.UI.createEmailDialog({
				subject : "Photo Attached",
				toRecipients : ['foo@yahoo.com']
			});
			emailDialog.addAttachment(photo);
			emailDialog.open();
		},200);
		
	}
}

function tblClick(e){
	$.mapview.setRegion({latitude:annotations[e.source.annotation].latitude, longitude:annotations[e.source.annotation].longitude, latitudeDelta:0.1, longitudeDelta:0.1});
	$.mapview.selectAnnotation(annotations[e.source.annotation]);
}

function scanBarcode(){
	require("barcode")();
}

function couponClick(e){
	
	if(favoriteCoupons.indexOf(couponArr[couponCount])!="-1"){
		alert("Coupon #"+(couponCount+1)+" has already been added to your favorites.");
	} else {
		favoriteCoupons.push(couponArr[couponCount]);
		alert("Coupon #"+(couponCount+1)+" has been added to your favorites.");
	}
}

function addContact(params){
	if(OS_IOS || OS_ANDROID){
		
		if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_AUTHORIZED){
		    performAddressBookFunction();
		} else if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_UNKNOWN){
		    Ti.Contacts.requestAuthorization(function(e){
		        if (e.success) {
		            performAddressBookFunction();
		        } else {
		            alert("Access to Address Book Denied");
		        }
		    });
		} else {
		    alert("Access to Address Book Denied");
		}
	
		function performAddressBookFunction(){
			var contactData = data[params.source.annotation];
			if(contactData.title && contactData.phone){
				if(Ti.Contacts.getPeopleWithName(contactData.title).length==0){
					Ti.Contacts.createPerson({
					  firstName: contactData.title,
					  phone:{
					    work: [contactData.phone]
					  }
					});
				}
				
				var callAlert = Ti.UI.createAlertDialog({
					title:contactData.title+"\nSaved to Contacts",
					message:"Would you like to call\n"+contactData.title+" now?\n"+contactData.phone,
					buttonNames:["No","Call"]
				});
				callAlert.show();
				callAlert.addEventListener("click", function(e){
					if(e.index == 1){
						if(Ti.Platform.model == "Simulator"){
							alert("Simulator cannot initiate a phone call, but on device the phone app would be opened and call would be initiated to:\n"+contactData.phone);
						} else {
							Ti.Platform.openURL("tel:"+contactData.phone);
						}
					}
				});
			}
		}
	}
}

if(customMapView == true && (OS_ANDROID || OS_IOS)){
	
	var convertMapPoints = require('convertMapPoints'),
	    win = $.main,
	    pop = new createPopView(),
	    popView = pop.view,
	    popLabel = pop.label,
	    defaultLatitude = 37,
	    defaultLongitude = -122,
	    selectedPin = null;
	win.add(popView);
	
	$.mapview.addEventListener("click",mapClick);
	$.mapview.addEventListener("regionchanged",movePopView);


	function createPopView(params){
	    
	    var params = params || {};
	
	    var contentView = Ti.UI.createView({
	        top:0,
	        width:params.width?params.width:100,
	        height:params.height?params.height:100,
	        backgroundColor:"#000000",
	        borderRadius:20,
	        opacity:params.opacity?params.opacity:0.8
	    });
	   
	    var closeBtn = Ti.UI.createButton({
	        title:"X",
	        top:5,
	        right:5,
	        height:30,
	        width:30,
	        font:{fontWeight:"bold"}
	    });
	   
	    this.label = Ti.UI.createLabel({
	        top:25,
	        left:5,
	        right:5,
	        color:"#ffffff",
	        height:Ti.UI.SIZE,
	        font:{fontSize:20},
	        minimumFontSize:8
	    });
	    
	    this.view = Ti.UI.createView({
	        height:contentView.height,
	        width:contentView.width,
	        visible:false,
	        opacity:0.0
	    });
	    
	    this.view.add(contentView);
	    this.view.add(closeBtn);
	    this.view.add(this.label);
	    
	    closeBtn.addEventListener('click', closePopView);
	    
	}
	
	function closePopView(evt){
	    
	    popView.hide();
	    selectedPin.setImage(selectedPin.pinImage);
	    selectedPin = null;
	
	}
	
	function movePopView(evt){
	    evt.source.setRegion(evt);
	    if(selectedPin){
	        var point = convertMapPoints({
	            map:evt.source,
	            annotation:selectedPin,
	            view:win
	        });
	        popView.center ={x:point.x, y:(point.y-(popView.height/2)-20)};
	    }
	}
	
	
	function showPopView(evt){
	    
	    var point = convertMapPoints({
	        map:evt.source,
	        annotation:evt.annotation?evt.annotation:selectedPin,
	        view:win
	    });
	    popLabel.text = evt.annotation.title;
	    popView.center ={x:point.x, y:(point.y-(popView.height/2)-30)};
	    popView.show();
	    popView.animate({opacity:1.0, duration:250});
	    
	}
	
	function mapClick(evt) {
		
		if(customMapView == true){
		    if(evt.clicksource === 'pin' && evt.annotation != selectedPin){
		        evt.source.deselectAnnotation(evt.annotation); 
		        showPopView(evt);
		        evt.annotation.setImage(evt.annotation.selectedPinImage);
		        if(selectedPin){
		            selectedPin.setImage(selectedPin.pinImage);
		            selectedPin = evt.annotation;
		        } else {
		            selectedPin = evt.annotation;
		        }
		    } else {
		        evt.source.deselectAnnotation(evt.annotation); 
		    }
	    }
	     
	}
}


