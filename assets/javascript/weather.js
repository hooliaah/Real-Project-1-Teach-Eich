//pseudo code
//initialize variables for this api
$("#submit").on("click", function(){
    var location = $("#search").val().trim();
      setTimeout(function () {
          if (location != $("#search").val().trim()) {
              clearTimeout();
            } else {
              weather(location);
            }
      }, 50)
});//end of change keyup
function weather(location){
  var APIKey = "73b0b0a8d48f5e0f";
  var queryURL = "http://api.wunderground.com/api/" + APIKey + "/conditions/q/CA/" + location + ".json";
  $.ajax({
      url: queryURL,
      method: "GET"
    })
    .done(function(response) {
        var city = $(".city").html("<h3>" + response.current_observation.display_location.city + " Weather Condition</h3>");
        var temp = $(".temp").html("<p>Temperature (F): " + response.current_observation.temp_f + "</p>");
prediction(location);
});//end of condition function
function prediction(location){
    var query2URL = "http://api.wunderground.com/api/73b0b0a8d48f5e0f/forecast/q/CA/" + location + ".json";
    $.ajax({
      url: query2URL,
      method: "GET"
    })
    .done(function(response) {
  for (let i = 0; i < 3; i++){
    var newDiv = $("<div>");
    var paragraph = $("<p>");
    var day = response.forecast.txt_forecast.forecastday[i].title;
    var condition = response.forecast.txt_forecast.forecastday[i].fcttext;
    newDiv.append(day);
    paragraph.append(condition);
    newDiv.append(paragraph);
    $("#weather-div").append(newDiv);
  }
//http://api.wunderground.com/api/Your_Key/geolookup/q/37.776289,-122.395234.json
});
};
};
