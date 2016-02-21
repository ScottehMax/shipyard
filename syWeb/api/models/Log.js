/**
* Log.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {

        type: {
            type: 'string'
        },

        message: {
            type: 'string'
        },

        boat: {
            type: 'integer'
        }

    },

    beforeCreate: function (values, cb) {
      var request = require('request');

      // Set the headers
      var headers = {
          'Content-Type':     'application/x-www-form-urlencoded',
          'Access-Token': 'o.PEpRgkpb7lcqbrQPOM2GStlLdyP9IBjq'
      }

      // Configure the request
      var options = {
          url: 'https://api.pushbullet.com/v2/pushes',
          method: 'POST',
          headers: headers,
          form: {
            'type': 'note',
            'title' : 'Shipyard | ' + values.message,
            'body' : '',

          }
      }

      // Start the request
      request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              // Print out the response body
              console.log(body)
              cb();
          }
      });
  }
};
