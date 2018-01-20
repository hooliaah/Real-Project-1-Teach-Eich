//pseudo code
//initialize variables for this api
$(".begin-search").on('click', function(event){
      event.preventDefault();

    var location = $("#input-city").val().trim();
    var state = $("#input-state").val().trim();
    var APIKey = "ce992066cf350b51";
    var queryURL = "http://api.wunderground.com/api/" + APIKey + "/conditions/q/" + state + "/" + location + ".json";

    $.ajax({
        url: queryURL,
        method: "GET"
      })
      .done(function(response) {

        console.log(queryURL);
        console.log(response);

          var city = $(".city").html("<h3>" + response.current_observation.display_location.city + " Weather Condition</h3>");
          var temp = $(".temp").html("<p>Temperature (F): " + response.current_observation.temp_f + "</p>");
          var state = $(".state").html("<p>State: " + response.current_observation.display_location.state_name);
      });

    var query2URL = "http://api.wunderground.com/api/ce992066cf350b51/forecast/q/" + state + "/" + location + ".json";

    $.ajax({
      url: query2URL,
      method: "GET"
    })
    .done(function(response) {
        console.log(query2URL);
        console.log(response);

function prediction(){

  for (let i = 1; i < 5; i++){

    var newDiv = $("<div>");
    var paragraph = $("<p>");

    var day = response.forecast.txt_forecast.forecastday[i].title;
    var condition = response.forecast.txt_forecast.forecastday[i].fcttext;
    newDiv.append(day);
    paragraph.append(condition);

    console.log(day);
    console.log(condition);
    console.log(typeof(condition));

    newDiv.append(paragraph);
    $(".forecast-panel").append(newDiv);
  }
}
//http://api.wunderground.com/api/Your_Key/geolookup/q/37.776289,-122.395234.json
prediction();
})
})
