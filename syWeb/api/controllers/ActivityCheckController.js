/**
 * ActivityCheckController
 *
 * @description :: Server-side logic for managing the activity checks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var http = require('http');
var util  = require('util');
var execSync = require('child_process').execSync;

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

        // boatModelArray = [];
        //
        // Boat.find().exec(function(err, boatModels) {
        //   if (err) {
        //     return res.json({
        //       error: err
        //     });
        //   }
        //
        //   if (boatModels === undefined) {
        //     return res.notFound();
        //   } else {
        //
        //     for (var i = 0; i < boatModels.length; i++) {
        //       var boatModel  = boatModels[i];
        //
        //       boatModelArray.push(boatModel);
        //     }
        //   }
        // });

        getAllBoats(function(boats) {
            console.log("In end of callback");
            console.log("boats: ", boats);

            var isActiveArray = [];

            //console.log("boats: ", boats);
            //console.log("boats.length: ", boats.length);

            for (var i = 0; i < boats.length; i++) {
              var boat = boats[i];

              //console.log("");
              //console.log("boat.id: ", boat.id);
              //console.log("boat.name: ", boat.name);
              //console.log("boat.mainAppFile: ", boat.mainAppFile);

              var longString = "ps aux | grep \"/apps/" + boat.id+ "/" + boat.mainAppFile + "\" | wc -l";

              var command = execSync(longString).toString();

              var numberOfProcesses = command - 2;
              var isActive = (numberOfProcesses > 0);

              var boatModel = User.findOne(boat.id).done(function(error, boatModel) {
                  if(error) {
                     // do something with the error.
                  }

                  //Save it to the object.
                  boatModel.active = isActive;

                  console.log("Updated boat #", boatModel.id, "'s activity status'");

                  boatModel.save(function(error) {
                      if(error) {
                          // do something with the error.
                      } else {
                          // value saved!
                          req.send(boatModel);
                      }
                  });
              });

            //   Boat.update({id:boat.id}).exec(function afterwards(err, updated){
              //
            //       if (err) {
            //         // handle error here- e.g. `res.serverError(err);`
            //         return;
            //       }
              //
            //       console.log('Updated user to have name ' + updated[0].name);
            //   });

              isActiveArray.push([boat.id, isActive]);

              if (numberOfProcesses > 0){
                  console.log("App #",boat.id, " is running");
              } else {
                  console.log("App #",boat.id, " isn't running");
              }

              /*
              console.log("Command: ", command);
              console.log("numberOfProcesses: ", numberOfProcesses);
              console.log("isActive: ", isActive);
              */

            }
            return res.json(isActiveArray);
        });
    }
};
