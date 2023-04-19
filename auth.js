
var request = require('request')
var client_id = '53d9b1f0ec474ad3ab875389174cad6c';
var client_secret = '7f4d579406e347158d88d8e92d00ff69';

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
  }
});