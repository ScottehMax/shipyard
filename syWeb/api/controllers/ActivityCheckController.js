/**
 * ActivityCheckController
 *
 * @description :: Server-side logic for managing the activity checks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var http = require('http');
var util = require('util');
var execSync = require('child_process').execSync;
var isActiveArray = [];

function getAllBoats(callback) {

  return http.get({
    host: '',
    path: '/boat/getAll',
    port: 1337
  }, function(response) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {

      // Data reception is done, do whatever with it!
      var parsed = JSON.parse(body);

      callback(parsed);
    });
  });

}

module.exports = {
  checkActivityStatus: function(req, res) {

    getAllBoats(function(boats) {



      console.log("bl: ", boats.length);
      for (var i = 0; i < boats.length; i++) {
        console.log('current iteration ' + i);
        var boat = boats[i];


        var longString = "ps aux | grep \"/apps/" + boat.id + "/" + boat.mainAppFile + "\" | wc -l";

        var command = execSync(longString).toString();

        var numberOfProcesses = command - 2;
        var isActive;


        if (numberOfProcesses > 0) {
          console.log("App #", boat.id, " is running");
          Boat.findOne({
            id: boat.id
          }).exec(function(error, boatModel) {
            if (error) {
              // do something with the error.
              console.log(error);
            }

            //Save it to the object.

            boatModel.lastUpdated = Time.now();
            boatModel.active = true;


            console.log("Updated boat #", boatModel.id, "'s activity status to true");

            boatModel.save(function(error) {
              if (error) {
                console.log(error);
                // do something with the error.
              } else {
                // value saved!
                console.log(boatModel.id, " saved");
              }
            });
          });
          isActive = true;
          isActiveArray[i] = [boat.id, true];
        } else {
          console.log("App #", boat.id, " isn't running");
          Boat.findOne({
            id: boat.id
          }).exec(function(error, boatModel) {
            if (error) {
              // do something with the error.
              console.log(error);
            }

            //Save it to the object.

            boatModel.active = false;


            console.log("Updated boat #", boatModel.id, "'s activity status to false");

            boatModel.save(function(error) {
              if (error) {
                console.log(error);
                // do something with the error.
              } else {
                // value saved!
                console.log(boatModel.id, " saved");
              }
            });
          });
          isActive = false;
          isActiveArray[i] = [boat.id, false];
        }


      }


      return res.json(isActiveArray);
    });
  }
};
