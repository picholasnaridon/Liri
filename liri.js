require('dotenv').config()

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');
var logStream = fs.createWriteStream('log.txt', {'flags': 'a'});
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var command = process.argv[2]
var modifier = process.argv[3]

getTweets = () => {
  client.get('statuses/user_timeline.json', {count: 20}, function(error, tweets, response) {
   
      var outputTweets = []

      tweets.forEach(tweet => {
        outputTweets.push(tweet.text)
      });

      var output = 
`
==== MY Tweets ====
${outputTweets.join("\n")}
`

      console.log(output)
      logStream.write(output + "\n");

  });
}

getSong = (modifier) => {
  if (!modifier){
    modifier = "Sign Ace of Base"
  }
  spotify.search({ type: 'track', query: modifier }, function(err, data) {

    var output = 
`
==== Song Data ====
Artist: ${data.tracks.items[0].artists[0].name}
Album: ${data.tracks.items[0].album.name}
Track: ${data.tracks.items[0].name}
Link: ${data.tracks.items[0].href}
`
    console.log(output)
    logStream.write(output + "\n");
  })
}


getMovie = (modifier) => {
  if (!modifier){
    modifier = "Mr. Nobody"
  }
  request(`http://www.omdbapi.com/?apikey=${keys.omdb.key}&t=${modifier}`, function (error, response, body) {

    var response_data = JSON.parse(body); 
    var  output =
`
=====  Movie Data ====
Title: ${response_data.Title}
Year: ${response_data.Year}
${response_data.Ratings[0].Source} : ${response_data.Ratings[0].Value}
${response_data.Ratings[1].Source} : ${response_data.Ratings[1].Value}
Country: ${response_data.Country}
Language(s): ${response_data.Language}
Plot: ${response_data.Plot}
Actors: ${response_data.Actors}
`
              
    console.log(output)
    logStream.write(output + "\n");

  });
}

execute = () => {
  switch (command){
    case 'my-tweets' :
      getTweets()
    break
  
    case 'spotify-this-song':
      getSong(modifier)
    break
    
    case 'movie-this': 
      getMovie(modifier)
    break
  
    case 'do-what-it-says':
      fs.readFile('random.txt', 'utf8', (e, data) => {
        var inputs = data.split(",")
        command = inputs[0]
        modifier = inputs[1]
        execute()
      });
    break
  
    default:
      console.log("enter command")
    break 
  }
}

execute()



