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

    afterCreate: function (entry, cb) {
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
            'title' : 'Shipyard | ' + entry.name,
            'body' : entry.message,

          }
      }

      // Start the request
      request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              // Print out the response body
              console.log(body)
          }
      })
      // Encrypt password
      bcrypt.hash(values.password, 10, function(err, hash) {
        if(err) return cb(err);
        values.password = hash;
        //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
        cb();
      });
  }
};
