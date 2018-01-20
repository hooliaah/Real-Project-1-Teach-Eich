var eventfullAPI = '4JcXb6fXXRDWGvj9';
var dateFormat = 'MM-DD-YYYY';
var dateRange = 10;
var eventData = [];

// getEvents('city','state') // get events for city and state pair 
// searchNews();

pushToDiv();

function searchNews(city,state) {
    var url = 'https://newsapi.org/v2/everything?' +
        'domains=espn.com&' +
        'from=2018-01-01&to=2018-01-30&' +
        'sortBy=popularity&' +
        // 'country=us&' +
        // 'sources=bleacher-report&' +
        'q=football denver&' +
        'apiKey=315c46529d14462bada6f13c7af58332';

    $.ajax({
        url: url,
        type: "GET",
    }).done(function (data) {
        setTimeout(function(){
            console.log(data);
            pushToDiv(data.articles)
        },100)
    });
}

//HELLO

function pushToDiv (data) {

    // for (i=0; i < data.length; i++) {

    // }
    var tableImageSource = 'https://imagesource';
    var tableURL = 'https://headlineurl';
    var tableHeadline = 'Headline';
    var tableSource = 'source.com';
    var tableRow = $('<tr class="sports-news-row">');

    var tableDataImage = $('<td class="sports-news-image">');
    var tableDataHeadline = $('<td class="sports-news-headline">');
    var tableDataSource = $('<td class="sports-news-source">');
    var tableImage = $('<img>');
    var tableLink = $('<a>');
    var tableLink = document.createElement('a');
    
    $(tableImage).attr('src',tableImageSource);
    $(tableDataImage).append(tableImage);
    
    $(tableLink).attr('href','tableURL');
    $(tableLink).attr('target','_new');
    $(tableLink).text(tableHeadline);
    $(tableDataHeadline).append(tableLink);

    $(tableDataSource).text(tableSource);

    $(tableRow).append(tableDataImage,tableDataHeadline,tableDataSource);

    $('#sports-div').append(tableRow);
    

    
// document.write("<table border=1>")
// for (row=1; row<=4; row++) {
//    document.write("<tr>")
//    for (col=1; col<=5; col++) {
//          document.write("<td>R" + row + "<br>C" + col + "</td>")
//     }
//     document.write("</tr>")
// }
// document.write("</table>")

}
