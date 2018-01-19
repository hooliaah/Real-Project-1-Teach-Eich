
var sportsRadarAPIKey = 'gk5zjt3sktfagphmb5z3q785';
var dateFormat = 'MM-DD-YYYY';
var dateRange = 15;
var allGames = [];
var teamInfo = [];
var display = [];

getSports('FL','NFL');

function getSports (state,sports) {
    if (sports = 'NFL') {
        getNFL(state);
    }
    if (sports = 'NBA') {
        getNBA(state);
    }
    if (sports = 'NHL') {
        getNHL(state);
    }   
}

function getNFL (state) {
  // load team hiearchy into teamInfo[]
  getTeamHierarchy();
  // wait for 1 second api call limit then pull NFL schedule and load all data, venue, team and score info into allGames[]
  setTimeout(function(){
    getNFLSchedule();
  },1500)
  // wait for 1500ms for previous API call to finish teh search allGames[] for matches to incoming state
  setTimeout(function(){
    var matchedGameStates = matchGameStates(state);
    console.log('display ', display);
    
    return matchedGameStates;
  },3000)

}

function getNBA (state) {

}

function getNHL (state) {

}


function getTeamHierarchy () {
  var teamsInfo = [];
  var url = 'http://api.sportradar.us/nfl-ot2/league/hierarchy.json' + '?api_key=' + sportsRadarAPIKey;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // iterates through conferences
      for (i=0; i < data.conferences.length; i++) {
        // iterates through divisions
        for (j=0; j < data.conferences[i].divisions.length; j++) {
          // iterates through teams
          for (k=0; k < data.conferences[i].divisions[j].teams.length; k++) {
            var teamID = data.conferences[i].divisions[j].teams[k].id;
            var teamCity = data.conferences[i].divisions[j].teams[k].venue.city;
            var teamState = data.conferences[i].divisions[j].teams[k].venue.state;
            teamsInfo.push ({
              'teamID': teamID,
              'teamCity': teamCity,
              'teamState': teamState
              });
          }
        }
      }
      teamInfo = teamsInfo;
    });
}

function getNFLSchedule (city,st) {
    // retrieves 2017 Post Season Schedule
    // setTimeout(function(){
      $.ajax({
        url: 'http://api.sportradar.us/nfl-ot2/games/2017/PST/schedule.json?api_key=gk5zjt3sktfagphmb5z3q785',
        method: "GET"
      })
      .then(function(response) {
        var numWeeks = response.weeks.length;
        // iterates through the weeks in the season
        for (i=0; i < numWeeks; i++) {
            var games = response.weeks[i].games;
            // iterates through the games in the week
            for (j=0; j < games.length; j++) {
                var game = games[j];
                var date = convertDate(game.scheduled);
                // checks if the game is within the date range
                if (checkDate(date)) {
                    var awayTeamInfo = lookupTeamInfo(teamInfo, 'teamID', game.away.id);
                    var homeTeam = game.home.name;
                    var homeTeamCity = game.venue.city;
                    var homeTeamState = game.venue.state;
                    var awayTeam = game.away.name;
                    var awayTeamCity = awayTeamInfo.teamCity; 
                    var awayTeamState = awayTeamInfo.teamState;
                    var venue = game.venue.name;
                      // checks if the game has a score yet
                      if (game.scoring) {
                          var homeScore = game.scoring.home_points;
                          var awayScore = game.scoring.away_points;
                      } else {
                          var homeScore = null;
                          var awayScore = null;
                      }
                    // push the game to allGames[];
                    allGames.push(
                        {'sport':'NFL',
                        'date':date,
                        'venue':venue,
                        'venueCity': game.venue.city,
                        'venueState': game.venue.state,
                        'homeTeam':homeTeam,
                        'homeTeamCity':homeTeamCity,
                        'homeTeamState':homeTeamState,
                        'homeScore':homeScore,
                        'awayTeam':awayTeam,
                        'awayTeamCity':awayTeamCity,
                        'awayTeamState':awayTeamState,
                        'awayScore':awayScore}
                    );
                }
            }
        }
      });
    // },1000)
    
};

function lookupTeamInfo (array, key, value) {
  for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
          return array[i];
      }
  }
  return null;
}

function matchGameStates(state) {
    var matchingResults = [];
    // parse allGames[] for matching home or away team state
    for (var i = 0; i < allGames.length; i++) {
        if (allGames[i].awayTeamState === state || allGames[i].homeTeamState === state) {
            matchingResults.push(
                allGames[i]
            );
        }
    // parse matchingResults[] and format 
                
        }
    if (matchingResults.length > 0) {
        display.push(formatResponse(matchingResults));
        
    } else return 'no results';
}

function formatResponse(input) {
    var responseFormat = [];
    for (i=0; i < input.length; i++) {
        var winTeam = '';
        var winScore = null;
        var looseTeam = '';
        var looseScore = null;
        if (input[i].homeScore >= input[i].awayScore) {
            winTeam = input[i].homeTeam;
            winScore = input[i].homeScore;
            looseTeam = input[i].awayTeam;
            looseScore = input[i].awayScore;
        } else {
            winTeam = input[i].awayTeam;
            winScore = input[i].awayScore;
            looseTeam = input[i].homeTeam;
            looseScore = input[i].homeScore;
        }
        responseFormat.push({
            'sport': input[i].sport,
            'date': input[i].date,
            'winTeam': winTeam,
            'winScore': winScore,
            'looseTeam': looseTeam,
            'looseScore': looseScore,
            'venue': input[i].venue
            });
    }
    console.log(responseFormat);
    $('#sports').append('NFL' + '<br>');
    for (i=0; i<responseFormat.length; i++) {
        $('#sports').append(responseFormat[i].date + ' ');
        $('#sports').append(responseFormat[i].venue + ' ');
        $('#sports').append(responseFormat[i].winTeam + ' ');
        $('#sports').append(responseFormat[i].winScore + ' ');
        $('#sports').append(responseFormat[i].looseTeam + ' ');
        $('#sports').append(responseFormat[i].looseScore + ' <br>');
    }
    
    return responseFormat;
    
}

function convertDate (date) {
    return(moment(date).format(dateFormat));
}

function checkDate(date) {
    // if the date is between the dateRange returns true, otherwise false
    var upperRange = moment().add(dateRange, 'days').format(dateFormat);
    var lowerRange = moment().subtract(dateRange, 'days').format(dateFormat);
    if (date > upperRange) {
        return false;
    } else if (date < lowerRange) {
        return false;

    } else {
      return true
    }; 
}