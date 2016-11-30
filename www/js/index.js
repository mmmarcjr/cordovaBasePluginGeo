document.addEventListener("deviceready", onDeviceReady, false);
$(window).on("orientationchange",	function()	{	setContentHeight();	setMapHeight();	} );


function showLoading()
{
	$.mobile.loading( 'show', {text: '', textVisible: 0, theme: 0, textonly: 0, html: ""});
}

function hideLoading()
{
	$.mobile.loading( "hide" );
}

function initGeoInfo()
{
	$('#geoAddress').html('');
	$('#geoLatitude').html('');
	$('#geoLongitude').html('');
	$('#geoAltitude').html('');
	$('#geoAccuracy').html('');
	$('#geoAlAc').html('');
	$('#geoSpeed').html('');
	$('#geoTimestamp').html('');
	$('#map').html('');
}

function setGeoInfo(position)
{
	$('#geoAddress').html('Loading Current Position ...');
	$('#geoLatitude').html(position.coords.latitude);
	$('#geoLongitude').html(position.coords.longitude);
	$('#geoAltitude').html(position.coords.altitude);
	$('#geoAccuracy').html(position.coords.accuracy);
	$('#geoAlAc').html(position.coords.altitudeAccuracy);
	$('#geoSpeed').html(position.coords.speed);
	$('#geoTimestamp').html(position.timestamp);
}


function onDeviceReady() 
{
	showLoading();
	initGeoInfo();
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 1000, timeout: 5000, enableHighAccuracy: true } );
}

function onSuccess(position) 
{
	setGeoInfo(position);
	if ($.mobile.activePage.attr("id") == "page1")
	{
		var LatLng = showMap(position.coords.latitude, position.coords.longitude);
		getAddress(LatLng, function(result) { $('#geoAddress').html(result) });
		setHeightContent();
		setHeightMap();
	}
	else
		$('#geoAddress').html('');
	hideLoading();
};

function onError(error) 
{
	$('#geoAddress').html('ERROR<br />Code: ' + error.code + '<br />Message: ' + error.message);
	hideLoading();
}


function setHeightContent()
{
	var screen = $.mobile.getScreenHeight();
	var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();
	var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
	/* content div has padding of 1em = 16px (32px top+bottom). This step can be skipped by subtracting 32px from content var directly. */
	var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();
	var content = screen - header - footer - contentCurrent;
	$(".ui-content").height(content);
}

function setHeightMap()
{
	var screen = $(".ui-content").height();
	var info = $("#geoAddress").height();
	$("#map").height(screen - info - 1);
}

function showMap(latitude, longitude)
{
	var LatLng = new google.maps.LatLng(latitude, longitude);
	var mapConfig = {zoom:15, center:LatLng, mapTypeId:google.maps.MapTypeId.ROADMAP}
	var map = new google.maps.Map($('#map').get(0), mapConfig);
	new google.maps.Marker({map:map, position:LatLng, animation: google.maps.Animation.DROP});
	return LatLng;
}

function getAddress(LatLng, callback)
{
	var formatted_address;
	var localisation = new google.maps.Geocoder();
	localisation.geocode({"latLng" : LatLng}, 
		function(results, status)
		{
			if (status == google.maps.GeocoderStatus.OK) 
			{
				if (results[0])
					formatted_address = results[0].formatted_address;
				else
					formatted_address = 'Unknown';
			}
			else
				formatted_address = "Couldn't find location. Error code: " + status;
			callback(formatted_address);
		}
	);
}
