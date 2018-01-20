// variable declaration
var map;
var service;
var infowindow;
var loc;

// search for city, return lat and long
$("#search").on("change keyup", function() {
  var city = $(this).val()

  // $.getJSON is a method to get JSON data using an AJAX HTTP GET request
  // google geocode api is used for converting addresses
  // encodeURIComponent means it takes out any special characters
  $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+encodeURIComponent(city), function(val) {
    if(val.results.length) {
      loc = val.results[0].geometry.location
      $("#lat").val(loc.lat)
      $("#lon").val(loc.lng)
      console.log(loc.lat);
      console.log(loc.lng);

initMap();
    }
  })
})

function initMap() {
  var searchLocation = new google.maps.LatLng(loc.lat, loc.lng);

  map = new google.maps.Map(document.getElementById('map-div'), {
      center: searchLocation,
      zoom: 15
    });

  var request = {
    location: searchLocation,
    radius: '500',
    query: 'restaurant'
  };

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

// function to look for search results. If search results exist, run createMarker
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

// creates markers for each search result
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  // when marker is clicked, display information
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    console.log(JSON.stringify(place));
    infowindow.open(map, this);
  });
}