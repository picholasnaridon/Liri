require('dotenv').config()

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var command = process.argv[2]
var modifier = process.argv[3]

getTweets = () => {
  client.get('statuses/user_timeline.json', {count: 20}, function(error, tweets, response) {
    if (!error) {
      console.log("My 20 most recent tweets:")
      tweets.forEach(tweet => {
        console.log(tweet.text)
      });
    }
  });
}

getSong = (modifier) => {
  spotify.search({ type: 'track', query: modifier }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }  
    console.log(`Artist: ${data.tracks.items[0].artists[0].name}`)
    console.log(`Album: ${data.tracks.items[0].album.name}`)
    console.log(`Track: ${data.tracks.items[0].name}`)
    console.log(`Link: ${data.tracks.items[0].href}`)
  })
}


getMovie = (modifier) => {
  request(`http://www.omdbapi.com/?apikey=${keys.omdb.key}&t=${modifier}`, function (error, response, body) {
    var response_data = JSON.parse(body); 
    console.log(`Title: ${response_data.Title}`)
    console.log(`Year: ${response_data.Year}`)
    console.log(`${response_data.Ratings[0].Source} : ${response_data.Ratings[0].Value}`)
    console.log(`${response_data.Ratings[1].Source} : ${response_data.Ratings[1].Value}`)
    console.log(`Country: ${response_data.Country}`)
    console.log(`Language(s): ${response_data.Language}`)
    console.log(`Plot: ${response_data.Plot}`)
    console.log(`Actors: ${response_data.Actors}`)
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