
// NOTE: Make sure to set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.
// You can use a package like 'dotenv' (require('dotenv').config()) to load them from a .env file.

var request = require('request')
var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

if (!client_id || !client_secret) {
  console.error("Error: SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables are not set.");
  process.exit(1);
}

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {
      console.log(body)
      
    // var token = body.access_token;
  } else {
    console.error("Error fetching token:", error || body);
  }
});