$(document).ready(function(){

// variable declaration
var map;
var service;
var infowindow;
var loc;
var searchLocation;
var searchOptions = ["restaurant", "pharmacy", "atm", "hospital", "library"]

// add search buttons for various place types
function displayButtons() {
  $("#map-search-div").empty();
  for (var i = 0; i < searchOptions.length; i++) {
    var newButton = $("<button>");
    newButton.attr("class", "search-button");
    newButton.data("name", searchOptions[i]);
    newButton.text(searchOptions[i]);
    $("#map-search-div").append(newButton);
  }
}
displayButtons();

// search for city, return lat and long
$("#submit").on("click", function () {
  var city = $("#search").val();
  console.log(city);

  // $.getJSON is a method to get JSON data using an AJAX HTTP GET request
  // google geocode api is used for converting addresses
  // encodeURIComponent means it takes out any special characters
  $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(city), function (val) {
    if (val.results.length) {
      loc = val.results[0].geometry.location;
      $("#lat").val(loc.lat)
      $("#lon").val(loc.lng)
      // console.log(loc.lat);
      // console.log(loc.lng);
      initMap();
    }
  })
})

// initiliaze the map and search for restaurant
function initMap() {
  searchLocation = new google.maps.LatLng(loc.lat, loc.lng);
  //  console.log(searchLocation);
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

$('#map-search-div').on('click', '.search-button', function () {

  searchLocation = new google.maps.LatLng(loc.lat, loc.lng);
  var searchType = $(this).data("name");

  var request = {
    location: searchLocation,
    radius: '500',
    query: searchType
  };

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
})

// function to look for search results. If search results exist, run createMarker
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

// function to create a marker for each search result. Add event listener, on click more information is shown in the info window
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: placeLoc
  });
  marker.addListener('click', function () {
    var request = {
      reference: place.reference
    };

    // get details of place clicked and display name, address, website, rating, and phone #
    service.getDetails(request, function (details, status) {
      infowindow.setContent([
        "<div class='info-window-div'>",
        "<span class='info-window-name'>" + details.name + "</span>",
        "Rating: " + details.rating + "/5 stars",
        details.formatted_address,
        details.formatted_phone_number,
        "<a class='map-link' target='_blank' href='" + details.url + "'>More info.</a>",
        "</div>"].join("<br />"));
      infowindow.open(map, marker);
    });

  })

  // closes infowindow when map clicked
  google.maps.event.addListener(map, 'click', function () {
    infowindow.close();
  });
};
});
