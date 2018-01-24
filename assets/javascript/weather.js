// function to get current weather conditions via GET call to API and display in HTML
function weather() {
  var APIKey = "73b0b0a8d48f5e0f";
  var queryURL = "https://api.wunderground.com/api/" + APIKey + "/conditions/q/" + loc.lat + "," + loc.lng + ".json";
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .done(function (response) {
      console.log(response);
      var city = $(".city").html("<p class='weather-conditions'>" + response.current_observation.display_location.city + " Current Weather Condition</p>");
      var temp = $(".temp").html("<p>Temperature (F): " + response.current_observation.temp_f + "</p>");
      prediction(location);
    }); // end of condition function

  // function to get weather forecast for next 2 days and display in HTML
  function prediction(location) {
    var query2URL = "https://api.wunderground.com/api/73b0b0a8d48f5e0f/forecast/q/" + loc.lat + "," + loc.lng + ".json";
    $.ajax({
      url: query2URL,
      method: "GET"
    })
      .done(function (response) {
        for (let i = 0; i < 3; i++) {
          var newDiv = $("<div>");
          var paragraph = $("<p>");
          var day = response.forecast.txt_forecast.forecastday[i].title;
          var condition = response.forecast.txt_forecast.forecastday[i].fcttext;
          newDiv.append(day);
          paragraph.append(condition);
          newDiv.append(paragraph);
          $("#weather-div").append(newDiv);
        }
      });
  };
};
