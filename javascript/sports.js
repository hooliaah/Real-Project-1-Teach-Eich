
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
    console.log("getSports() SPORTS, STATE , RESULTS ", sports, state, display)
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
  console.log('enter getTeamHiearchy()');
  var teamsInfo = [];
  var url = 'http://api.sportradar.us/nfl-ot2/league/hierarchy.json' + '?api_key=' + sportsRadarAPIKey;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // iterates through conferences
      for (i=0; i < data.conferences.length; i++) {
        console.log("Enter conferences ", data.conferences.length);
        // iterates through divisions
        for (j=0; j < data.conferences[i].divisions.length; j++) {
          console.log("Enter divisions ", data.conferences[i].divisions.length);    
          // iterates through teams
          for (k=0; k < data.conferences[i].divisions[j].teams.length; k++) {
            console.log("Enter teams ", data.conferences[i].divisions[j].teams.length);
            var teamID = data.conferences[i].divisions[j].teams[k].id;
            var teamCity = data.conferences[i].divisions[j].teams[k].venue.city;
            var teamState = data.conferences[i].divisions[j].teams[k].venue.state;
            console.log(teamID, teamCity, teamState);
            teamsInfo.push ({
              'teamID': teamID,
              'teamCity': teamCity,
              'teamState': teamState
              });
            // console.log("teamsInfo[]", teamsInfo)
          }
        }
      }
      console.log("teamsInfo[]", teamsInfo)
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
        console.log("Schedule Data");
        console.log(response);
        var numWeeks = response.weeks.length;
        console.log("Weeks",numWeeks);
        // iterates through the weeks in the season
        for (i=0; i < numWeeks; i++) {
            console.log("i",i);
            var games = response.weeks[i].games;
            console.log('games',games);
            // iterates through the games in the week
            for (j=0; j < games.length; j++) {
                console.log("j",j);
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
        console.log("allGames",allGames);
      });
    // },1000)
    
};

function lookupTeamInfo (array, key, value) {
  console.log('enter lookupTeamInfo () ', array, key, value);
  for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
          return array[i];
      }
  }
  return null;
}

function matchGameStates(state) {
    console.log('enter matchGameStates() ', state);
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
    console.log('finished matching result is ',matchingResults)
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
    return responseFormat;
    
}

function convertDate (date) {
    return(moment(date).format(dateFormat));
}

function checkDate(date) {
    // if the date is between the dateRange returns true, otherwise false
    var upperRange = moment().add(dateRange, 'days').format(dateFormat);
    var lowerRange = moment().subtract(dateRange, 'days').format(dateFormat);
    console.log(date, upperRange, lowerRange);
    if (date > upperRange) {
        console.log("above range");
        return false;
    } else if (date < lowerRange) {
        console.log("below range");
        return false;

    } else {
      console.log("in range");
      return true
    }; 
}