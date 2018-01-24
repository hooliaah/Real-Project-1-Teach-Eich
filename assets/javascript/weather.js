// function to get current weather conditions via GET call to API and display in HTML
function weather() {
  var APIKey = "73b0b0a8d48f5e0f";
  var queryURL = "https://api.wunderground.com/api/" + APIKey + "/conditions/q/" + loc.lat + "," + loc.lng + ".json";
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .done(function (response) {
      var tableImage = $('<img>');
      var tableP = $("<p>");
      var wIconToday = response.current_observation.icon_url;
      var wTempToday = response.current_observation.temp_f;
      var feelsLike = response.current_observation.feelslike_f;
      var newDiv = $('<div>');

      tableImage.attr('src', wIconToday);
      tableP.append("<p class='weather-condition-p'>Current Temp " + wTempToday + "&#8457</p>");
      tableP.append("<p class='weather-condition-p'>Feels Like " + feelsLike + "&#8457</p>");
      newDiv.append("Today<br>", tableImage, tableP);
      newDiv.attr('class', "weather-card")
      $("#weather-div").append(newDiv);

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
        var iconTomorrowImg = $('<img>');
        var tablePTomorrow = $('<p>');
        var tomorrowDiv = $('<div>');
        var tomorrowDay = response.forecast.simpleforecast.forecastday[0].date.weekday;
        var iconTomorrow = response.forecast.simpleforecast.forecastday[0].icon_url;
        var highTempTomorrow = response.forecast.simpleforecast.forecastday[0].high.fahrenheit;
        var lowTempTomorrow = response.forecast.simpleforecast.forecastday[0].low.fahrenheit;
        var conditionsTomorrow = response.forecast.simpleforecast.forecastday[0].conditions;

        iconTomorrowImg.attr('src', iconTomorrow);
        tablePTomorrow.append("<p class='weather-condition-p'>High " + highTempTomorrow + "&#8457" + " / Low " + lowTempTomorrow + "&#8457</p>");
        tablePTomorrow.append("<p class='weather-condition-p'>Conditions: " + conditionsTomorrow + "</p>");
        tomorrowDiv.append(tomorrowDay + "<br>", iconTomorrowImg, tablePTomorrow);
        tomorrowDiv.attr('class', "weather-card")
        $("#weather-div").append(tomorrowDiv);

        var iconNextDayImg = $('<img>');
        var tablePNextDay = $('<p>');
        var nextDiv = $('<div>');
        var nextDayDay = response.forecast.simpleforecast.forecastday[1].date.weekday;
        var iconNextDay = response.forecast.simpleforecast.forecastday[1].icon_url;
        var highTempNextDay = response.forecast.simpleforecast.forecastday[1].high.fahrenheit;
        var lowTempNextDay = response.forecast.simpleforecast.forecastday[1].low.fahrenheit;
        var conditionsNextDay = response.forecast.simpleforecast.forecastday[1].conditions;

        iconNextDayImg.attr('src', iconNextDay);
        tablePNextDay.append("<p class='weather-condition-p'>High " + highTempNextDay + "&#8457" + " / Low " + lowTempNextDay + "&#8457</p>");
        tablePNextDay.append("<p class='weather-condition-p'>Conditions: " + conditionsNextDay + "</p>");
        nextDiv.append(nextDayDay + "<br>", iconNextDayImg, tablePNextDay);
        nextDiv.attr('class', "weather-card")
        $("#weather-div").append(nextDiv);
      });
  };
};