$(document).ready(function () {
    // javascript below here 

    // api key
    var apiKey = '_Gh7Iho7AsJ3k27QFmYght2x83vh2Q3YbAf1g6tYV4BLoivTseswFHtLiln5Fm5AqdLkMXNSgXT8ZW3vJWPZppsoHD12wvhblZg15hUFih97xOcL6DmeQ1BLsMFaWnYx';
    // the cors proxy to enable Yelp API requests
    // this proxy is running on my personal server... please do not share this with others
    var proxy = 'https://fathomless-lake-71727.herokuapp.com/' 
    // yelp search api
    var url = 'https://api.yelp.com/v3/businesses/search';
    // query parameters
    var longitude = -118.243683; // this is downtown LA
    var latitude = 34.052235;
    var term = 'restaurants';
    var limit = 5;
    var sort = 'rating';

    // do we want to add "open now" or "$$$" or "hot and new" as search parameters?

    var qs = '?term=' + term + '&longitude=' + longitude + '&latitude=' + latitude + '&limit=' + limit + '&sort_by=' + sort;

    $.ajax({
        method: 'GET',
        // we simply append the yelp url to the proxy url
        url: proxy + url + qs,
        // api key is included as an Authorization header
        headers: {
            Authorization: 'Bearer ' + apiKey
        }
    })
        .done(function (data) {
            // console.log(data)

            var results = data.businesses;
            console.log(results);

            for (var i = 0; i < results.length; i++) {
                var newDiv = $('<div>');
                var p = $('<p>').text('Restaurant name: '+ results[i].name + ' Rating: ' + results[i].rating);
                newDiv.append(p);
                $('#places-div').append(newDiv);
            }

        })
});