document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() 
{
	setContentScreen();
	$('#geoInfo').html('Loading Current Position ...');
	$('#address').html('');
	$('#map').html('');
	
	getcur();
}

function setContentScreen()
{
	var screen = $.mobile.getScreenHeight();
	var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();
	var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
	/* content div has padding of 1em = 16px (32px top+bottom). This step can be skipped by subtracting 32px from content var directly. */
	var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();
	var content = screen - header - footer - contentCurrent;
	$(".ui-content").height(content);
}


function setMapHeight()
{
	var screen = $(".ui-content").height();
	var info = $("#info").height();
	//alert(screen);
	//alert(info);
	$("#map").height(screen - info - 1);
	//$("info").height(content);
}


function getcur() 
{
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 1000, timeout: 5000, enableHighAccuracy: true } );
}

var onSuccess = function(position) 
{
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	$('#geoInfo').html('Latitude: ' + lat + '<br />Longitude: ' + lon);
	setMapHeight();
	showMap(lat, lon);
};

function onError(error) 
{
	$('#geoInfo').html('ERROR<br />Code: ' + error.code + '<br />Message: ' + error.message);
}

function showMap(latitude, longitude)
{
	var LatLng = new google.maps.LatLng(latitude, longitude);
	var mapConfig = {zoom:15, center:LatLng, mapTypeId:google.maps.MapTypeId.ROADMAP}
	var map = new google.maps.Map($('#map').get(0), mapConfig);
	new google.maps.Marker({map:map, position:LatLng, animation: google.maps.Animation.DROP});
	getAddress(LatLng);
}

function getAddress(LatLng)
{
	var localisation = new google.maps.Geocoder();
	localisation.geocode({"latLng" : LatLng}, function(address, status)
	{
		if (status == google.maps.GeocoderStatus.OK) 
		{
			$('#address').html(address[0].formatted_address);
			setMapHeight();
		}
	});
}