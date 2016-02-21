/**
 * ActivityCheckController
 *
 * @description :: Server-side logic for managing the activity checks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var http = require('http');
var util  = require('util');
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
            //console.log("boats: ", boats);



            //console.log("boats: ", boats);
            //console.log("boats.length: ", boats.length);
            console.log("bl: ", boats.length);
            for (var i = 0; i < boats.length; i++) {
                console.log('current iteration ' + i);
              var boat = boats[i];

              //console.log("");
              //console.log("boat.id: ", boat.id);
              //console.log("boat.name: ", boat.name);
              //console.log("boat.mainAppFile: ", boat.mainAppFile);

              var longString = "ps aux | grep \"/apps/" + boat.id+ "/" + boat.mainAppFile + "\" | wc -l";

              var command = execSync(longString).toString();

              var numberOfProcesses = command - 2;
              var isActive;

            //   Boat.update({id:boat.id}).exec(function afterwards(err, updated){
              //
            //       if (err) {
            //         // handle error here- e.g. `res.serverError(err);`
            //         return;
            //       }
              //
            //       console.log('Updated user to have name ' + updated[0].name);
            //   });

              if (numberOfProcesses > 0){
                  console.log("App #",boat.id, " is running");
                  Boat.findOne({id: boat.id}).exec(function(error, boatModel) {
                      if(error) {
                         // do something with the error.
                         console.log(error);
                      }

                      //Save it to the object.

                      boatModel.active = true;


                      console.log("Updated boat #", boatModel.id, "'s activity status to true");

                      boatModel.save(function(error) {
                          if(error) {
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
                  console.log("App #",boat.id, " isn't running");
                  Boat.findOne({id: boat.id}).exec(function(error, boatModel) {
                      if(error) {
                         // do something with the error.
                         console.log(error);
                      }

                      //Save it to the object.

                      boatModel.active = false;


                      console.log("Updated boat #", boatModel.id, "'s activity status to false");

                      boatModel.save(function(error) {
                          if(error) {
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
