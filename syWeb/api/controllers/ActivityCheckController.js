/**
 * ActivityCheckController
 *
 * @description :: Server-side logic for managing the activity checks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var http = require('http');
var util  = require('util');
const spawnSync = require('child_process').spawnSync;
var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;
var util = require('util');

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

            console.log("Before callback");

            callback(parsed);
        });
    });

}

module.exports = {
    checkActivityStatus: function(req,res){
        getAllBoats(function(boats) {
            console.log("In end of callback");
            console.log("boats: ", boats);

            var isActiveArray = [];

            console.log("boats: ", boats);
            console.log("boats.length: ", boats.length);

            for (var i = 0; i < boats.length; i++) {
              var boat = boats[i];

              console.log("");
              console.log("boat.id: ", boat.id);
              console.log("boat.name: ", boat.name);
              console.log("boat.mainAppFile: ", boat.mainAppFile);

              var longString = "ps aux | grep \"/apps/" + boat.id+ "/" + boat.mainAppFile + "\" | wc -l";

              var command = execSync(longString).toString();

              var numberOfProcesses = command - 2;
              var isActive = (numberOfProcesses > 0);

              isActiveArray.push([boat.id ,isActive]);

              /*
              if (numberOfProcesses > 0){
                  console.log("App #",boat.id, " is running");
              } else {
                  console.log("App #",boat.id, " isn't running")
              }

              //console.log("Command: ", command);
              //console.log("numberOfProcesses: ", numberOfProcesses);
              //console.log("isActive: ", isActive);
              */

            }
            return res.json(isActiveArray);
        });

        console.log("After callback");
    }
};
