// var map, infoWindow;
// function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat:34.0635,lng:-118.4455},
//     zoom: 11
// });
//   infoWindow = new google.maps.InfoWindow;

// // HTML5 geolocation.
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(function(position) {
//   var pos = {
//     lat: position.coords.latitude,
//     lng: position.coords.longitude
//   };

// infoWindow.setPosition(pos);
// infoWindow.setContent('Location found.');
// infoWindow.open(map);
// map.setCenter(pos);
//   }, function() {
//     handleLocationError(true, infoWindow, map.getCenter());
//   });
// } else {
// // Browser doesn't support Geolocation
//   handleLocationError(false, infoWindow, map.getCenter());
//   }
// }

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
// infoWindow.setPosition(pos);
// infoWindow.setContent(browserHasGeolocation ?
//           'Error: The Geolocation service failed.' :
//           'Error: Your browser doesn\'t support geolocation.');
// infoWindow.open(map);
// }


var map;
var service;
var infowindow;

function initialize() {
  var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

  map = new google.maps.Map(document.getElementById('map-div'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '500',
    query: 'restaurant'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

initialize();